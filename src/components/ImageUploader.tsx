/**
 * ImageUploader — wrapper autour de ImgBBUploader pour rétrocompatibilité.
 */
import React from 'react';
import ImgBBUploader from './ImgBBUploader';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  folder?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange, folder }) => (
  <ImgBBUploader
    label={label}
    value={value}
    onChange={onChange}
    folder={folder}
    allowUrl
  />
);

export default ImageUploader;
