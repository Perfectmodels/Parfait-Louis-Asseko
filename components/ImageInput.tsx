import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-medium text-pm-off-white/70 mb-2">{label}</label>
            <div className="flex items-center gap-4">
                {value && (
                    <img src={value} alt="Prévisualisation" className="w-24 h-24 object-cover rounded-md bg-black border border-pm-off-white/20" />
                )}
                <div className="flex-grow">
                     <p className="text-xs text-pm-off-white/60 mb-2">
                        Collez l'URL d'une image. Utilisez un service comme <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="underline text-pm-gold">Postimages</a> pour héberger vos images.
                    </p>
                    <div className="relative">
                         <PhotoIcon className="w-5 h-5 text-pm-off-white/50 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input 
                            type="text" 
                            value={value} 
                            onChange={(e) => onChange(e.target.value)} 
                            placeholder="https://..."
                            className="admin-input pl-10" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageInput;