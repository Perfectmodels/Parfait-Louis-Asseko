import React, { useState, useRef } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelect, 
  onImageRemove, 
  currentImage,
  className = '' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-pm-gold bg-pm-gold/10'
            : 'border-pm-gold/30 hover:border-pm-gold/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Uploaded"
              className="max-w-full max-h-48 mx-auto rounded-lg"
            />
            {onImageRemove && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onImageRemove();
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <PhotoIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
            <p className="text-pm-gold font-medium mb-2">
              Cliquez ou glissez une image ici
            </p>
            <p className="text-pm-off-white/70 text-sm">
              PNG, JPG, GIF jusqu'à 10MB
            </p>
          </div>
        )}
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
