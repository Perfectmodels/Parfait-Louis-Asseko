import React, { useState, useCallback, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { ArrowUpTrayIcon, ArrowPathIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface MultiImageUploaderProps {
    label: string;
    description?: string;
    maxImages?: number;
    values: string[];
    onChange: (values: string[]) => void;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
    label,
    description,
    maxImages = 10,
    values,
    onChange
}) => {
    const { data } = useData();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadSingleImage = async (file: File): Promise<string> => {
        const apiKey = data?.apiKeys?.imgbbApiKey;
        if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY_HERE') {
            throw new Error("La clé API ImgBB n'est pas configurée dans les paramètres.");
        }

        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || "L'upload a échoué.");
        }

        const result = await response.json();
        if (result.data && result.data.url) {
            return result.data.url;
        } else {
            throw new Error("L'API ImgBB n'a pas retourné d'URL valide.");
        }
    };

    const handleUpload = useCallback(async (files: FileList) => {
        const remainingSlots = maxImages - values.length;
        if (remainingSlots <= 0) {
            setError(`Vous avez atteint la limite de ${maxImages} photos.`);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);
        setIsLoading(true);
        setError(null);
        setUploadProgress(0);

        try {
            const uploadedUrls: string[] = [];

            for (let i = 0; i < filesToUpload.length; i++) {
                const url = await uploadSingleImage(filesToUpload[i]);
                uploadedUrls.push(url);
                setUploadProgress(Math.round(((i + 1) / filesToUpload.length) * 100));
            }

            onChange([...values, ...uploadedUrls]);
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'upload.");
            console.error(err);
        } finally {
            setIsLoading(false);
            setUploadProgress(0);
        }
    }, [data?.apiKeys?.imgbbApiKey, onChange, values, maxImages]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleUpload(files);
        }
        // Reset input to allow re-uploading the same file
        e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleUpload(files);
        }
    };

    const handleRemove = (index: number) => {
        const newValues = values.filter((_, i) => i !== index);
        onChange(newValues);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-pm-off-white/50 mb-2">
                {label} ({values.length}/{maxImages})
            </label>
            {description && (
                <p className="text-sm text-pm-off-white/60 mb-4">{description}</p>
            )}

            {/* Upload Zone */}
            <div
                className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-all ${isLoading
                        ? 'border-pm-gold/50 bg-pm-gold/5'
                        : 'border-white/20 hover:border-pm-gold/50 hover:bg-white/5'
                    } ${values.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={values.length < maxImages ? triggerFileSelect : undefined}
            >
                <div className="flex flex-col items-center justify-center text-center">
                    {isLoading ? (
                        <>
                            <ArrowPathIcon className="w-12 h-12 text-pm-gold animate-spin mb-3" />
                            <p className="text-pm-gold font-medium">Upload en cours... {uploadProgress}%</p>
                        </>
                    ) : (
                        <>
                            <ArrowUpTrayIcon className="w-12 h-12 text-pm-gold/50 mb-3" />
                            <p className="text-white font-medium mb-1">
                                Cliquez ou glissez-déposez vos photos ici
                            </p>
                            <p className="text-xs text-pm-off-white/50">
                                PNG, JPG, GIF, WEBP jusqu'à 10MB • {maxImages - values.length} photo(s) restante(s)
                            </p>
                        </>
                    )}
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    multiple
                    disabled={values.length >= maxImages}
                    className="hidden"
                />
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-300 text-sm">
                    {error}
                </div>
            )}

            {/* Preview Grid */}
            {values.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {values.map((url, index) => (
                        <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-white/10 hover:border-pm-gold/50 transition-all">
                            <img
                                src={url}
                                alt={`Photo ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(index);
                                    }}
                                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                    title="Supprimer cette photo"
                                >
                                    <XMarkIcon className="w-5 h-5 text-white" />
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                                #{index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiImageUploader;
