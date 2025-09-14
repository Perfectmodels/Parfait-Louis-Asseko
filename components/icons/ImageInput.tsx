import React, { useState, useRef } from 'react';
import { PhotoIcon, ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
    const { data } = useData();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const apiKey = data?.apiKeys?.imgbbApiKey;
        if (!apiKey) {
            setError("La clé API pour l'upload d'images n'est pas configurée.");
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.error?.message || "L'upload a échoué. Veuillez réessayer.");
            }

            const result = await response.json();

            if (result.success) {
                onChange(result.data.url);
            } else {
                throw new Error(result.error?.message || "Une erreur inconnue est survenue.");
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsUploading(false);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div>
            <label className="admin-label">{label}</label>
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 flex-shrink-0 bg-black border border-pm-off-white/20 rounded-md flex items-center justify-center relative">
                    {value ? (
                        <img src={value} alt="Prévisualisation" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <PhotoIcon className="w-10 h-10 text-pm-off-white/30" />
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md">
                            <ArrowPathIcon className="w-8 h-8 text-pm-gold animate-spin" />
                        </div>
                    )}
                </div>
                <div className="flex-grow space-y-2">
                    <input
                        type="text"
                        value={value}
                        onChange={handleUrlChange}
                        placeholder="Coller une URL ou uploader un fichier"
                        className="admin-input"
                        disabled={isUploading}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark disabled:opacity-50"
                    >
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        Uploader un fichier
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        disabled={isUploading}
                    />
                     {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageInput;
