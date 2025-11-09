import React, { useState, useRef } from 'react';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ArrowUpTrayIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  storagePath: string; // e.g., 'site-images' or 'model-portfolios/model-id'
  currentImageUrl?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete, storagePath, currentImageUrl }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (file: File) => {
    if (!file) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    const storageRef = ref(storage, `${storagePath}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const prog = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(prog);
      },
      (err) => {
        console.error("Upload error:", err);
        setError('Upload failed. Please try again.');
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUploadComplete(downloadURL);
          setUploading(false);
          setPreview(downloadURL);
        });
      }
    );
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUploadComplete(''); // Notify parent component that image is removed
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Image
      </label>
      <div 
        className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-pm-gold transition-colors"
        onClick={triggerFileSelect}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Preview" className="max-h-60 rounded-lg object-contain" />
            <div 
              onClick={removeImage}
              className="absolute top-1 right-1 bg-black/50 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XCircleIcon className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-400">
              <p className="pl-1">Click to upload an image</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}
      </div>
      {uploading && (
        <div className="mt-2">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-pm-gold h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-right text-gray-400">{progress}%</p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;