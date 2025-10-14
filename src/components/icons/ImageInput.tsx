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

        try {
            setIsUploading(true);
            setProgress(0);
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, '_');
            const storagePath = `uploads/${timestamp}-${safeName}`;
            const task = storage.ref().child(storagePath).put(file, { contentType: file.type });

            task.on('state_changed', (snapshot) => {
                const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setProgress(pct);
            });

            await task;
            const downloadUrl = await storage.ref().child(storagePath).getDownloadURL();
            onChange(downloadUrl);
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
