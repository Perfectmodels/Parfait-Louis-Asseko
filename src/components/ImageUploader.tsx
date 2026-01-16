import React from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  currentImage: string;
  onImageUpload: (url: string) => void;
  folder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload }) => {
  return (
    <div className="flex items-center gap-4">
        <div className="w-24 h-24 flex-shrink-0 bg-black border border-pm-gold/20 rounded-md flex items-center justify-center overflow-hidden">
            {currentImage ? (
                <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
            ) : (
                <PhotoIcon className="w-8 h-8 text-gray-600" />
            )}
        </div>
        <div className="flex-1">
            <input
                type="text"
                value={currentImage}
                onChange={(e) => onImageUpload(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 rounded p-2 text-white focus:border-pm-gold outline-none text-sm"
                placeholder="https://..."
            />
            <p className="text-xs text-gray-500 mt-1">
                Collez l'URL de l'image (ex: depuis <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-pm-gold hover:underline">ImgBB</a>)
            </p>
        </div>
    </div>
  );
};

export default ImageUploader;
