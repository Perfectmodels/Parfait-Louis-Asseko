import React, { useState } from 'react';
import { XMarkIcon, PlusIcon, PhotoIcon } from '@heroicons/react/24/outline';
import ImageUpload from './ImageUpload';

interface MultipleImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  placeholder?: string;
  className?: string;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  placeholder = "Cliquez pour ajouter des images",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUploaded = (imageUrl: string, index: number) => {
    if (imageUrl) {
      const newImages = [...images];
      newImages[index] = imageUrl;
      onImagesChange(newImages);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleAddImage = () => {
    if (images.length < maxImages) {
      onImagesChange([...images, '']);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div key={index} className="relative">
            <ImageUpload
              currentImage={imageUrl}
              onImageUploaded={(url) => handleImageUploaded(url, index)}
              placeholder={`Image ${index + 1}`}
              className="h-32"
            />
            {imageUrl && (
              <button
                onClick={() => handleRemoveImage(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {images.length < maxImages && (
        <button
          type="button"
          onClick={handleAddImage}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          <PlusIcon className="w-8 h-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">{placeholder}</p>
          <p className="text-xs text-gray-500 mt-1">
            {images.length}/{maxImages} images
          </p>
        </button>
      )}

      {images.length >= maxImages && (
        <p className="text-sm text-gray-500 text-center">
          Limite de {maxImages} images atteinte
        </p>
      )}
    </div>
  );
};

export default MultipleImageUpload;
