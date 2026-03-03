import React, { useRef, useState } from 'react';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

interface ImageUploaderProps {
  onImageUpload: (url: string) => void;
  currentImage?: string;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, currentImage, className = '' }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Simulate upload - Replace with actual upload logic
    setTimeout(() => {
        const fakeUrl = URL.createObjectURL(file);
        onImageUpload(fakeUrl);
        setIsUploading(false);
    }, 1000);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-48 border-2 border-dashed border-pm-gold/30 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-pm-gold transition-colors ${currentImage ? 'bg-cover bg-center' : 'bg-pm-dark/50'}`}
        style={currentImage ? { backgroundImage: `url(${currentImage})` } : {}}
      >
        <div className="bg-pm-dark/70 p-4 rounded-lg flex flex-col items-center">
            {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pm-gold"></div>
            ) : (
                <>
                    <ArrowUpTrayIcon className="w-8 h-8 text-pm-gold mb-2" />
                    <span className="text-sm text-pm-off-white/70">
                        {currentImage ? 'Changer l\'image' : 'Cliquez pour uploader'}
                    </span>
                </>
            )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUploader;
