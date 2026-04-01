import React from 'react';
import { CameraIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { Capacitor } from '@capacitor/core';
import { takePhoto, pickFromGallery } from '../utils/nativeCamera';

interface MobileImagePickerProps {
  onImageSelected: (dataUrl: string) => void;
  className?: string;
}

/**
 * Boutons caméra/galerie pour mobile natif.
 * Sur web, retourne null (utilise le input file classique).
 */
const MobileImagePicker: React.FC<MobileImagePickerProps> = ({ onImageSelected, className = '' }) => {
  if (!Capacitor.isNativePlatform()) return null;

  const handleCamera = async () => {
    const photo = await takePhoto();
    if (photo) onImageSelected(photo);
  };

  const handleGallery = async () => {
    const photo = await pickFromGallery();
    if (photo) onImageSelected(photo);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleCamera}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pm-gold/10 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/20 transition-colors"
      >
        <CameraIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Prendre une photo</span>
      </button>
      <button
        type="button"
        onClick={handleGallery}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-pm-gold/10 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/20 transition-colors"
      >
        <PhotoIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Galerie</span>
      </button>
    </div>
  );
};

export default MobileImagePicker;
