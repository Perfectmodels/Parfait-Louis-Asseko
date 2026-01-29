
import React, { useState, useCallback, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowUpTrayIcon, ArrowPathIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { dropboxService } from '../utils/dropboxService';

interface ImageUploaderProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange }) => {
    const { data } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        setIsLoading(true);
        setError(null);

        try {
            // First check if Dropbox is configured/authed
            if (dropboxService.isAuthenticated()) {
                // Upload to Dropbox
                const result = await dropboxService.uploadFile(file, '/site_uploads');
                if (result.sharing_url) {
                    onChange(result.sharing_url);
                    return;
                }
            }

            // Fallback to ImgBB
            const imgbbApiKey = data?.apiKeys?.imgbbApiKey;
            if (imgbbApiKey && imgbbApiKey !== 'YOUR_IMGBB_API_KEY_HERE') {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.data && result.data.url) {
                        onChange(result.data.url);
                        return;
                    }
                }
            }

            throw new Error("Aucun service de stockage (Dropbox ou ImgBB) n'est configuré.");

        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'upload.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [data?.apiKeys?.imgbbApiKey, onChange]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="admin-label">{label}</label>
            <div className="flex items-start gap-4">
                <div
                    className="w-28 h-28 flex-shrink-0 bg-black border-2 border-dashed border-pm-off-white/20 rounded-md flex items-center justify-center relative group"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {value ? (
                        <img src={value} alt="Prévisualisation" className="w-full h-full object-cover rounded-md" />
                    ) : (
                        <PhotoIcon className="w-12 h-12 text-pm-off-white/30" />
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md">
                            <ArrowPathIcon className="w-8 h-8 text-pm-gold animate-spin" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md cursor-pointer"
                        title="Changer l'image"
                    >
                        <ArrowUpTrayIcon className="w-8 h-8 text-pm-gold" />
                    </button>
                </div>
                <div className="flex-grow">
                    <input
                        type="text"
                        value={value}
                        onChange={handleUrlChange}
                        placeholder="URL de l'image ou téléversez"
                        className="admin-input"
                    />
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        className="hidden"
                    />
                    <p className="text-xs text-pm-off-white/60 mt-2">
                        Utilise Dropbox par défaut, ImgBB en secours.
                    </p>
                    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
                </div>
            </div>
        </div>
    );
};

export default ImageUploader;
