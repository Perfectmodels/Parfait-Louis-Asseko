/**
 * CloudinaryUploader — composant réutilisable pour upload image/vidéo vers Cloudinary.
 * Supporte drag & drop, prévisualisation, barre de progression.
 */
import React, { useRef, useState, useCallback } from 'react';
import { PhotoIcon, VideoCameraIcon, XMarkIcon, ArrowUpTrayIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import MediaPicker from "./admin/MediaPicker";
import {
  uploadToCloudinary,
  validateFile,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  ACCEPTED_MEDIA_TYPES,
  CloudinaryResourceType,
} from '../utils/cloudinaryService';

interface CloudinaryUploaderProps {
  label?: string;
  value: string;           // current URL
  onChange: (url: string) => void;
  resourceType?: CloudinaryResourceType;
  folder?: string;
  /** Show URL input fallback */
  allowUrl?: boolean;
  /** Compact mode (no big drop zone) */
  compact?: boolean;
  className?: string;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
  label,
  value,
  onChange,
  resourceType = 'image',
  folder,
  allowUrl = true,
  compact = false,
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [urlMode, setUrlMode] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const accept =
    resourceType === 'image' ? ACCEPTED_IMAGE_TYPES :
    resourceType === 'video' ? ACCEPTED_VIDEO_TYPES :
    ACCEPTED_MEDIA_TYPES;

  const isVideo = value && (value.includes('/video/') || /\.(mp4|webm|mov|avi)$/i.test(value));

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const err = validateFile(file, resourceType);
    if (err) { setError(err); return; }

    try {
      setProgress(0);
      const result = await uploadToCloudinary(file, resourceType, folder, setProgress);
      onChange(result.secure_url);
    } catch (e: any) {
      setError(e.message || 'Erreur lors de l\'upload');
    } finally {
      setProgress(null);
    }
  }, [resourceType, folder, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="admin-label">{label}</label>}

      {/* Preview */}
      {value && (
        <div className="relative group w-full">
          {isVideo ? (
            <video src={value} controls className="w-full max-h-48 rounded border border-pm-gold/20 object-cover" />
          ) : (
            <img src={value} alt="preview" className="w-full h-40 object-cover rounded border border-pm-gold/20" />
          )}
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Supprimer"
            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-opacity"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Progress bar */}
      {progress !== null && (
        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-pm-gold transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Drop zone */}
      {!compact && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded cursor-pointer transition-all py-6 px-4
            ${dragging ? 'border-pm-gold bg-pm-gold/10' : 'border-white/10 hover:border-pm-gold/40 hover:bg-pm-gold/5'}
            ${progress !== null ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {resourceType === 'video'
            ? <VideoCameraIcon className="w-8 h-8 text-white/20" />
            : <PhotoIcon className="w-8 h-8 text-white/20" />
          }
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">
            {progress !== null ? `Upload… ${progress}%` : 'Glisser ou cliquer pour uploader'}
          </span>
          <span className="text-[9px] text-white/20">
            {resourceType === 'image' ? 'JPG, PNG, WEBP — max 10 Mo' :
             resourceType === 'video' ? 'MP4, WEBM, MOV — max 100 Mo' :
             'Image ou vidéo'}
          </span>
        </div>
      )}

      {/* Compact trigger */}
      {compact && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={progress !== null}
          className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-pm-gold border border-pm-gold/30 px-4 py-2 hover:bg-pm-gold/10 transition-colors disabled:opacity-50"
        >
          <ArrowUpTrayIcon className="w-3.5 h-3.5" />
          {progress !== null ? `${progress}%` : 'Uploader'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* URL fallback & Media Library */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          {allowUrl && (
            <button
              type="button"
              onClick={() => setUrlMode(v => !v)}
              className="text-[9px] text-white/20 hover:text-white/50 underline transition-colors"
            >
              {urlMode ? 'Masquer URL' : 'Ou coller une URL'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="text-[9px] text-pm-gold/60 hover:text-pm-gold underline transition-colors flex items-center gap-1"
          >
            <Square2StackIcon className="w-3 h-3" />
            Bibliothèque
          </button>
        </div>

        {urlMode && (
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="https://..."
            className="admin-input"
          />
        )}
      </div>

      <MediaPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(urls) => onChange(urls[0])}
        multiple={false}
        resourceType={resourceType === 'auto' ? 'auto' : resourceType}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default CloudinaryUploader;
