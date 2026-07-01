/**
 * ImageInput — wrapper ImgBBUploader pour les images du site (AdminSettings).
 */
import React from 'react';
import ImgBBUploader from '../ImgBBUploader';

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => (
  <ImgBBUploader
    label={label}
    value={value}
    onChange={onChange}
    folder="site-images"
    allowUrl
  />
);

export default ImageInput;
