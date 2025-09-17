import React, { useState, useRef } from 'react';
import { XMarkIcon, PlusIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleMultipleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      setUploadError(`Seulement ${remainingSlots} images peuvent être ajoutées (limite: ${maxImages})`);
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadPromises = filesToUpload.map(uploadSingleImage);
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const validUrls = uploadedUrls.filter(url => url !== null) as string[];
      onImagesChange([...images, ...validUrls]);
    } catch (error) {
      console.error('Erreur lors de l\'upload multiple:', error);
      setUploadError('Erreur lors de l\'upload de certaines images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const uploadSingleImage = async (file: File): Promise<string | null> => {
    try {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`Le fichier ${file.name} est trop volumineux. Taille maximale : 5MB`);
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error(`Le fichier ${file.name} n'est pas une image valide`);
      }

      // Créer FormData
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', '59f0176178bae04b1f2cbd7f5bc03614');

      // Upload vers ImgBB
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'upload de ${file.name}`);
      }

      const data = await response.json();
      
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || `Erreur lors de l'upload de ${file.name}`);
      }
    } catch (error) {
      console.error(`Erreur upload ${file.name}:`, error);
      return null;
    }
  };

  const handleBulkUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input pour sélection multiple */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleMultipleFileSelect}
        className="hidden"
      />

      {/* Boutons d'action */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={handleBulkUpload}
          disabled={isUploading || images.length >= maxImages}
          className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-pm-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          {isUploading ? 'Upload en cours...' : 'Sélectionner plusieurs images'}
        </button>
        
        {images.length < maxImages && (
          <button
            type="button"
            onClick={handleAddImage}
            className="flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold/30 text-pm-gold font-medium rounded-lg hover:bg-pm-gold/10 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Ajouter une image
          </button>
        )}
      </div>

      {/* Affichage des erreurs */}
      {uploadError && (
        <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
          {uploadError}
        </div>
      )}

      {/* Grille des images */}
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

      {/* Compteur d'images */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          {images.length}/{maxImages} images
          {images.length >= maxImages && (
            <span className="text-red-500 ml-2">• Limite atteinte</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default MultipleImageUpload;
