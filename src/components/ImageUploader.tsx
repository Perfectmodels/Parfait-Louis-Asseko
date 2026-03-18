import React from 'react';

interface ImageUploaderProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange }) => (
  <div className="space-y-2">
    {label && <label className="admin-label">{label}</label>}
    {value && (
      <img src={value} alt="preview" className="w-full h-40 object-cover rounded border border-pm-gold/20 mb-2" />
    )}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="URL de l'image..."
      className="admin-input"
    />
  </div>
);

export default ImageUploader;
