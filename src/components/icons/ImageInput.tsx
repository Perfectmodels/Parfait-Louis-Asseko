import React, { useState } from 'react';
import { PhotoIcon, CloudArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ImageUpload from '../admin/ImageUpload';
import imageUploadService, { ImageUploadResult } from '../../services/imageUploadService';
import { isImgBBConfigured } from '../../config/imgbbConfig';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    folder?: string;
    className?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ 
    label, 
    value, 
    onChange, 
    folder = 'general',
    className = ''
}) => {
    const [showUpload, setShowUpload] = useState(false);

    const handleUpload = (result: ImageUploadResult) => {
        if (result.success && result.url) {
            onChange(result.url);
            setShowUpload(false);
        }
    };

    const handleRemove = () => {
        onChange('');
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <label className="block text-sm font-medium text-pm-gold mb-2">
                {label}
            </label>
            
            {/* Image actuelle */}
            {value && (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Prévisualisation"
                        className="w-32 h-32 object-cover rounded-lg border border-pm-gold/30"
                    />
                    <button
                        onClick={handleRemove}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Bouton d'upload */}
            {!value && (
                <div className="w-32 h-32 border-2 border-dashed border-pm-gold/30 rounded-lg flex items-center justify-center hover:border-pm-gold/50 transition-colors cursor-pointer"
                     onClick={() => setShowUpload(true)}>
                    <div className="text-center">
                        <PhotoIcon className="w-8 h-8 text-pm-gold mx-auto mb-2" />
                        <p className="text-xs text-pm-off-white/70">Ajouter une image</p>
                    </div>
                </div>
            )}

            {/* Input URL manuel */}
            <div className="space-y-2">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Ou coller l'URL de l'image ici"
                    className="w-full bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                />
                <p className="text-xs text-pm-off-white/60">
                    {isImgBBConfigured() 
                        ? "Utilisez le bouton d'upload pour une gestion automatique ou collez une URL manuellement."
                        : "Collez l'URL d'une image hébergée (ibb.co, postimages.org, etc.)"
                    }
                </p>
            </div>

            {/* Modal d'upload */}
            {showUpload && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-black/95 via-pm-dark/98 to-black/95 border border-pm-gold/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-playfair text-pm-gold">Upload d'image</h3>
                            <button
                                onClick={() => setShowUpload(false)}
                                className="p-2 text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-300"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <ImageUpload
                            onUpload={handleUpload}
                            folder={folder}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageInput;
