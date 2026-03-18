/**
 * ImageInput — wrapper CloudinaryUploader pour les images du site (AdminSettings).
 */
import React from 'react';
import CloudinaryUploader from '../CloudinaryUploader';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => (
  <CloudinaryUploader
    label={label}
    value={value}
    onChange={onChange}
    resourceType="image"
    folder="site-images"
    allowUrl
  />
);

export default ImageInput;
