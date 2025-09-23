import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import imageUploadService from '../../services/imageUploadService';

interface ImageUploadProps {
    onImageSelect: (imageUrl: string) => void;
    currentImage?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    onImageSelect,
    currentImage,
    className = ""
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            // Redimensionner l'image si nécessaire (optionnel)
            const resizedFile = await imageUploadService.resizeImage(file);
            
            // Upload vers ImgBB
            const result = await imageUploadService.uploadImage(resizedFile);
            
            if (result.success && result.imageUrl) {
                onImageSelect(result.imageUrl);
            } else {
                setError(result.error || 'Erreur lors de l\'upload de l\'image');
            }
        } catch (err) {
            setError('Erreur lors de l\'upload de l\'image');
            console.error('Upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        onImageSelect('');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {currentImage ? (
                <div className="relative">
                    <img
                        src={currentImage}
                        alt="Image sélectionnée"
                        className="w-full h-48 object-cover rounded-lg border border-pm-gold/20"
                    />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-pm-gold/30 rounded-lg p-8 text-center hover:border-pm-gold/50 transition-colors duration-200">
                    <PhotoIcon className="w-12 h-12 text-pm-gold/50 mx-auto mb-4" />
                    <p className="text-pm-off-white/70 mb-4">
                        {isUploading ? 'Upload en cours...' : 'Cliquez pour sélectionner une image'}
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        disabled={isUploading}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`inline-block px-6 py-2 bg-pm-gold text-pm-dark font-medium rounded-lg cursor-pointer hover:bg-yellow-400 transition-colors duration-200 ${
                            isUploading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isUploading ? 'Upload...' : 'Sélectionner une image'}
                    </label>
                </div>
            )}

            {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                </div>
            )}

            <div className="text-xs text-pm-off-white/60">
                Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)
            </div>
        </div>
    );
};

export default ImageUpload;
