import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  placeholder?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  placeholder = "Cliquez pour sélectionner une image",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  // Fonction pour compresser l'image via l'API TinyPNG (backend local)
  async function compressImageWithTinyPng(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('http://localhost:3001/api/compress-image', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Compression échouée');
    return await response.blob();
  }

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux. Taille maximale : 5MB');
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        throw new Error('Veuillez sélectionner un fichier image valide');
      }

      // Compresser l'image via TinyPNG (API backend)
      let compressedBlob: Blob;
      try {
        compressedBlob = await compressImageWithTinyPng(file);
      } catch (err) {
        // Si la compression échoue, fallback sur l'image originale
        console.warn('Compression TinyPNG échouée, upload de l\'original:', err);
        compressedBlob = file;
      }
      const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type || file.type });

      // Créer FormData pour ImgBB
      const formData = new FormData();
      formData.append('image', compressedFile);
      formData.append('key', '59f0176178bae04b1f2cbd7f5bc03614');

      // Upload vers ImgBB
      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload de l\'image');
      }

      const data = await response.json();
      
      if (data.success) {
        const imageUrl = data.data.url;
        setPreviewUrl(imageUrl);
        onImageUploaded(imageUrl);
      } else {
        throw new Error(data.error?.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      setUploadError(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            loading="lazy"
          />
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pm-gold"></div>
              <p className="mt-2 text-sm text-gray-600">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">{placeholder}</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (max 5MB)</p>
            </div>
          )}
        </div>
      )}

      {uploadError && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
