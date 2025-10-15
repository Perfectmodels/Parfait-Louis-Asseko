import React, { useRef, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { storage } from '../../firebaseConfig';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState<number>(0);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handlePickFile = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation basique pour limiter les lenteurs et erreurs
        const MAX_SIZE_MB = 5;
        if (!file.type.startsWith('image/')) {
            alert('Veuillez sélectionner un fichier image.');
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(`Image trop lourde (> ${MAX_SIZE_MB} Mo). Réduisez la taille avant l'envoi.`);
            return;
        }

        try {
            setIsUploading(true);
            setProgress(0);
            // Prefer Storacha; then ddownload; fallback Firebase Storage
            const form = new FormData();
            form.append('file', file);
            // 1) Storacha
            try {
                const storachaResp = await fetch('/api/storacha-upload', { method: 'POST', body: form });
                if (storachaResp.ok) {
                    const sjson = await storachaResp.json();
                    const surl = sjson?.url || sjson?.result?.url || sjson?.data?.url || sjson?.raw || '';
                    if (surl) { onChange(surl); return; }
                }
            } catch {}
            // 2) ddownload
            try {
                const ddResp = await fetch('/api/ddownload-upload', { method: 'POST', body: form });
                if (ddResp.ok) {
                    const djson = await ddResp.json();
                    const durl = djson?.url || djson?.result?.url || djson?.result || djson?.raw || '';
                    if (durl) { onChange(durl); return; }
                }
            } catch {}
            // Fallback: Firebase Storage
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const storagePath = `images/${year}/${month}/${timestamp}-${safeName}`;
            const metadata = { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } as const;
            const task = storage.ref().child(storagePath).put(file, metadata);
            task.on('state_changed', (s) => setProgress(Math.round((s.bytesTransferred / s.totalBytes) * 100)));
            await task;
            onChange(await storage.ref().child(storagePath).getDownloadURL());
        } catch (err) {
            console.error('Upload failed', err);
            alert("Échec du téléversement. Vérifiez vos permissions Firebase Storage.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <label className="admin-label">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 flex-shrink-0 bg-black border border-pm-off-white/20 rounded-md flex items-center justify-center">
                    {value ? (
                        <img src={value} alt="Prévisualisation" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <PhotoIcon className="w-10 h-10 text-pm-off-white/30" />
                    )}
                </div>
                <div className="flex-grow">
                    <input
                        type="text"
                        value={value}
                        onChange={handleUrlChange}
                        placeholder="Coller l'URL de l'image ici"
                        className="admin-input"
                    />
                    <div className="mt-2 flex items-center gap-3">
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        <button type="button" onClick={handlePickFile} className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark">
                            Importer une image
                        </button>
                        {isUploading && (
                            <div className="flex items-center gap-2 text-xs text-pm-off-white/70">
                                <div className="w-28 h-1 bg-pm-off-white/20 rounded">
                                    <div className="h-1 bg-pm-gold rounded" style={{ width: `${progress}%` }} />
                                </div>
                                <span>{progress}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageInput;
