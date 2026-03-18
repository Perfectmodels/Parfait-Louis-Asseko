/**
 * ImageUploader — wrapper autour de CloudinaryUploader pour rétrocompatibilité.
 * Remplace l'ancien composant URL-only par un vrai upload Cloudinary.
 */
import React from 'react';
import CloudinaryUploader from './CloudinaryUploader';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange, folder = 'site' }) => (
  <CloudinaryUploader
    label={label}
    value={value}
    onChange={onChange}
    resourceType="image"
    folder={folder}
    allowUrl
  />
);

export default ImageUploader;
