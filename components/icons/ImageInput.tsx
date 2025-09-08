import React, { useState, useRef } from 'react';
import { PhotoIcon, ArrowUpTrayIcon, XCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
    const { data } = useData();
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError(null);
        setUploading(true);
        setProgress(0);

        const workerUrl = data?.apiKeys.cloudflareWorkerUrl;
        if (!workerUrl || workerUrl.includes('VOTRE_WORKER')) {
            setError("L'URL du worker Cloudflare n'est pas configurée.");
            setUploading(false);
            return;
        }

        try {
            // 1. Get the one-time upload URL from our worker
            const response = await fetch(workerUrl);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Impossible d'obtenir l'URL d'upload. Serveur a répondu: ${errorText}`);
            }
            const { uploadURL } = await response.json();
             if (!uploadURL) {
                throw new Error("L'URL d'upload reçue du worker est invalide.");
            }

            // 2. Upload the file to Cloudflare Images
            const formData = new FormData();
            formData.append('file', file);
            
            const uploadRequest = new XMLHttpRequest();
            uploadRequest.open('POST', uploadURL, true);

            uploadRequest.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setProgress(percentComplete);
                }
            };

            uploadRequest.onload = () => {
                if (uploadRequest.status >= 200 && uploadRequest.status < 300) {
                    const uploadResponse = JSON.parse(uploadRequest.responseText);
                    const imageUrl = uploadResponse.result.variants[0]; // Get the public variant URL
                    onChange(imageUrl);
                } else {
                    console.error("Cloudflare Upload Error:", uploadRequest.responseText);
                    throw new Error(`Échec de l'upload: ${uploadRequest.statusText}`);
                }
                setUploading(false);
            };

            uploadRequest.onerror = () => {
                 console.error("Network Error during upload:", uploadRequest.statusText);
                throw new Error("Erreur réseau pendant l'upload.");
            };
            
            uploadRequest.send(formData);

        } catch (err: any) {
            setError(err.message || "Une erreur est survenue.");
            setUploading(false);
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">{label}</label>
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
                        type="file"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark disabled:opacity-50 disabled:cursor-wait"
                    >
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        {value ? 'Changer l\'image' : 'Uploader une image'}
                    </button>
                    
                    {uploading && (
                        <div className="mt-2">
                            <p className="text-xs text-pm-gold">Upload en cours...</p>
                            <div className="w-full bg-pm-dark rounded-full h-2 mt-1 border border-pm-gold/20">
                                <div className="bg-pm-gold h-full rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    )}
                    {error && (
                         <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
                            <XCircleIcon className="w-4 h-4"/> {error}
                         </div>
                    )}
                     {!uploading && !error && value && (
                         <div className="mt-2 flex items-center gap-2 text-xs text-green-400">
                            <CheckCircleIcon className="w-4 h-4"/> Image enregistrée.
                         </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageInput;
