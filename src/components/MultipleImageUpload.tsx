import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { Photo } from '../../types'; // Importer le type Photo
import { XMarkIcon, PlusIcon, CloudArrowUpIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import imageCompression from 'browser-image-compression';

interface MultipleImageUploadProps {
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
  maxImages?: number;
  className?: string;
}

const MultipleImageUpload: React.FC<MultipleImageUploadProps> = ({
  photos,
  onPhotosChange,
  maxImages = 50,
  className = ""
}) => {
  const { data } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const handleMultipleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - photos.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setUploadError(`Vous ne pouvez téléverser que ${remainingSlots} image(s) supplémentaire(s) (limite: ${maxImages}).`);
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = filesToUpload.map(uploadSingleImage);
      const uploadedPhotos = (await Promise.all(uploadPromises)).filter(p => p !== null) as Photo[];
      onPhotosChange([...photos, ...uploadedPhotos]);
    } catch (error) {
      setUploadError('Une erreur est survenue lors du téléversement.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const uploadSingleImage = async (file: File): Promise<Photo | null> => {
    const imgbbApiKey = data?.apiKeys?.imgbbApiKey;
    if (!imgbbApiKey) {
      setUploadError("Clé d'API ImgBB manquante.");
      return null;
    }

    try {
      if (file.size > 20 * 1024 * 1024) throw new Error(`Taille max : 20MB.`);
      if (!file.type.startsWith('image/')) throw new Error('Fichier non valide.');

      const compressedFile = await imageCompression(file, { maxSizeMB: 2, maxWidthOrHeight: 1920 });
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('key', imgbbApiKey);

      const response = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Échec de l\'upload');
      
      const result = await response.json();
      if (!result.success) throw new Error(result.error?.message || 'Erreur ImgBB.');

      return {
        id: `photo_${Date.now()}_${Math.random()}`,
        url: result.data.url,
        title: '',
        alt: '',
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'admin', // A adapter avec le user actuel si possible
        featured: false
      };

    } catch (error) {
      console.error(`Erreur upload ${file.name}:`, error);
      setUploadError(error instanceof Error ? `Erreur: ${error.message}` : 'Erreur inconnue');
      return null;
    }
  };

  const handleMetaChange = (index: number, field: 'title' | 'alt', value: string) => {
    const newPhotos = [...photos];
    const photoToUpdate = { ...newPhotos[index], [field]: value };
    newPhotos[index] = photoToUpdate;
    onPhotosChange(newPhotos);
  };

  const handleToggleFeatured = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = { ...newPhotos[index], featured: !newPhotos[index].featured };
    onPhotosChange(newPhotos);
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleMultipleFileSelect} className="hidden" />
      
      <div className="flex gap-3 flex-wrap">
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isUploading || photos.length >= maxImages} className="action-btn">
          <CloudArrowUpIcon className="w-5 h-5" />
          {isUploading ? 'Téléversement...' : 'Ajouter des images'}
        </button>
      </div>

      {uploadError && <div className="p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">{uploadError}</div>}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div key={photo.id} className="relative group aspect-square bg-pm-dark border border-pm-dark-lighter rounded-lg overflow-hidden">
            <img src={photo.url} alt={photo.alt || `Aperçu ${index + 1}`} className="w-full h-full object-cover"/>
            
            <div className="absolute top-1 right-1 flex flex-col gap-1">
                <button type="button" onClick={() => handleToggleFeatured(index)} className="p-1.5 bg-black/50 text-white rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors backdrop-blur-sm">
                    {photo.featured ? <StarIconSolid className="w-4 h-4 text-yellow-300" /> : <StarIcon className="w-4 h-4" />}
                </button>
                <button type="button" onClick={() => handleRemovePhoto(index)} className="p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm">
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent transition-opacity opacity-0 group-hover:opacity-100">
              <input 
                type="text" 
                placeholder="Titre (optionnel)" 
                value={photo.title || ''}
                onChange={e => handleMetaChange(index, 'title', e.target.value)}
                className="admin-input-sm w-full text-xs" 
              />
              <input 
                type="text" 
                placeholder="Texte alternatif (SEO)" 
                value={photo.alt || ''}
                onChange={e => handleMetaChange(index, 'alt', e.target.value)}
                className="admin-input-sm w-full mt-1 text-xs" 
              />
            </div>
          </div>
        ))}

        {photos.length < maxImages && !isUploading && (
            <button type="button" onClick={() => fileInputRef.current?.click()} className="relative aspect-square flex flex-col items-center justify-center bg-pm-dark/50 border-2 border-dashed border-pm-gold/20 rounded-lg hover:bg-pm-gold/5 transition-colors text-pm-gold/60 hover:text-pm-gold">
                <PlusIcon className="w-10 h-10"/>
                <span className="text-xs mt-1">Ajouter</span>
            </button>
        )}
      </div>

      <div className="text-center mt-4">
        <p className="text-sm text-pm-off-white/50">{photos.length}/{maxImages} images | Max 20MB/image</p>
      </div>
    </div>
  );
};

export default MultipleImageUpload;
