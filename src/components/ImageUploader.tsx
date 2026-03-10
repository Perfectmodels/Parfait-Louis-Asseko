import React from 'react';

interface ImageUploaderProps {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange }) => {
  return (
    <div>
      {label && <label className="admin-label">{label}</label>}
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder="URL de l'image"
        className="admin-input"
      />
    </div>
  );
};

export default ImageUploader;