/**
 * CloudinaryMultiUploader — upload multiple images/videos, returns array of URLs.
 */
import React, { useRef, useState, useCallback } from 'react';
import { PhotoIcon, XMarkIcon, PlusIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import MediaPicker from './admin/MediaPicker';
import {
  uploadToCloudinary,
  validateFile,
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  ACCEPTED_MEDIA_TYPES,
  CloudinaryResourceType,
} from '../utils/cloudinaryService';

interface CloudinaryMultiUploaderProps {
  label?: string;
  values: string[];
  onChange: (urls: string[]) => void;
  resourceType?: CloudinaryResourceType;
  folder?: string;
  maxFiles?: number;
}

interface UploadingItem {
  id: string;
  name: string;
  progress: number;
  error?: string;
}

const CloudinaryMultiUploader: React.FC<CloudinaryMultiUploaderProps> = ({
  label,
  values,
  onChange,
  resourceType = 'image',
  folder,
  maxFiles = 20,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const accept =
    resourceType === 'image' ? ACCEPTED_IMAGE_TYPES :
    resourceType === 'video' ? ACCEPTED_VIDEO_TYPES :
    ACCEPTED_MEDIA_TYPES;

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxFiles - values.length);
    if (!fileArray.length) return;

    const items: UploadingItem[] = fileArray.map(f => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      progress: 0,
    }));
    setUploading(prev => [...prev, ...items]);

    const results = await Promise.allSettled(
      fileArray.map(async (file, idx) => {
        const err = validateFile(file, resourceType);
        if (err) {
          setUploading(prev => prev.map(u => u.id === items[idx].id ? { ...u, error: err } : u));
          throw new Error(err);
        }
        const result = await uploadToCloudinary(file, resourceType, folder, (pct) => {
          setUploading(prev => prev.map(u => u.id === items[idx].id ? { ...u, progress: pct } : u));
        });
        return result.secure_url;
      })
    );

    const newUrls = results
      .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
      .map(r => r.value);

    onChange([...values, ...newUrls]);
    // Remove successful items after short delay
    setTimeout(() => {
      setUploading(prev => prev.filter(u => items.find(i => i.id === u.id && u.error)));
    }, 800);
  }, [values, onChange, resourceType, folder, maxFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const removeUrl = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url) || url.includes('/video/');

  return (
    <div className="space-y-3">
      {label && <label className="admin-label">{label}</label>}

      {/* Grid of existing items */}
      {(values.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {values.map((url, i) => (
            <div key={i} className="relative group aspect-square">
              {isVideo(url) ? (
                <video src={url} className="w-full h-full object-cover rounded border border-pm-gold/20" />
              ) : (
                <img src={url} alt="" className="w-full h-full object-cover rounded border border-pm-gold/20" />
              )}
              <button
                type="button"
                onClick={() => removeUrl(i)}
                aria-label="Supprimer ce média"
                className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5 text-white/60 hover:text-red-400 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 transition-opacity"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Uploading placeholders */}
          {uploading.map(item => (
            <div key={item.id} className="relative aspect-square bg-white/5 rounded border border-white/10 flex flex-col items-center justify-center gap-1 p-2">
              {item.error ? (
                <p className="text-[9px] text-red-400 text-center">{item.error}</p>
              ) : (
                <>
                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-pm-gold transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="text-[9px] text-white/30">{item.progress}%</span>
                </>
              )}
            </div>
          ))}

          {/* Add button */}
          {values.length < maxFiles && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Ajouter un média"
              className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded hover:border-pm-gold/40 hover:bg-pm-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold transition-all group"
            >
              <PlusIcon className="w-6 h-6 text-white/20 group-hover:text-pm-gold transition-colors" />
            </button>
          )}
        </div>
      )}

      {/* Drop zone when empty */}
      {values.length === 0 && uploading.length === 0 && (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded cursor-pointer transition-all py-8
            ${dragging ? 'border-pm-gold bg-pm-gold/10' : 'border-white/10 hover:border-pm-gold/40 hover:bg-pm-gold/5'}
          `}
        >
          <PhotoIcon className="w-8 h-8 text-white/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Glisser ou cliquer</span>
          <span className="text-[9px] text-white/20">Plusieurs fichiers acceptés</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          className="text-[9px] text-pm-gold/60 hover:text-pm-gold underline transition-colors flex items-center gap-1"
        >
          <Square2StackIcon className="w-3 h-3" />
          Ouvrir la bibliothèque
        </button>
      </div>

      <MediaPicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(urls) => {
          const newUrls = [...values];
          urls.forEach(url => {
            if (!newUrls.includes(url) && newUrls.length < maxFiles) {
              newUrls.push(url);
            }
          });
          onChange(newUrls);
        }}
        multiple={true}
        resourceType={resourceType === 'auto' ? 'auto' : resourceType}
      />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default CloudinaryMultiUploader;
