import React, { useState } from 'react';
import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
    const [error, setError] = useState<string | null>(null);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        setError(null);
        onChange(url);
    };

    const handleImageError = () => {
        setError("Impossible de charger l'image à partir de cette URL.");
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
            
            <div className="flex items-center space-x-4">
                <div className="flex-1">
                    <input
                        type="url"
                        value={value}
                        onChange={handleUrlChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 bg-pm-dark border border-gray-600 rounded-md text-pm-off-white focus:ring-2 focus:ring-pm-gold focus:border-pm-gold"
                    />
                    {error && (
                        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                            <XCircleIcon className="w-4 h-4" />
                            {error}
                        </p>
                    )}
                </div>
                
                {value && (
                    <div className="relative group">
                        <img
                            src={value}
                            alt="Preview"
                            className="w-12 h-12 rounded-md object-cover border border-pm-gold/20"
                            onError={handleImageError}
                        />
                    </div>
                )}
            </div>
            
            {value && !error && (
                <div className="mt-2">
                    <p className="text-xs text-pm-off-white/50 mb-1">Aperçu :</p>
                    <div className="relative border border-pm-gold/20 rounded-md overflow-hidden">
                        <img
                            src={value}
                            alt="Aperçu"
                            className="w-full max-h-64 object-contain"
                            onError={handleImageError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageInput;
