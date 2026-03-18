/**
 * Cloudinary upload service — unsigned upload preset required.
 * Create an unsigned preset in Cloudinary Dashboard > Settings > Upload > Upload Presets.
 * Set VITE_CLOUDINARY_UPLOAD_PRESET in .env
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

export type CloudinaryResourceType = 'image' | 'video' | 'auto';

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  duration?: number; // seconds, for video
  width?: number;
  height?: number;
  bytes: number;
}

/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 * @param file - The File object to upload
 * @param resourceType - 'image' | 'video' | 'auto'
 * @param folder - Optional Cloudinary folder path (e.g. 'models/portfolio')
 * @param onProgress - Optional progress callback (0–100)
 */
export async function uploadToCloudinary(
  file: File,
  resourceType: CloudinaryResourceType = 'auto',
  folder?: string,
  onProgress?: (pct: number) => void
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary non configuré. Vérifiez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans .env');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  // Pass original filename as public_id display name (preset: use_filename_as_display_name=true)
  formData.append('public_id', file.name.replace(/\.[^/.]+$/, '')); // strip extension
  if (folder) formData.append('folder', folder);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult);
      } else {
        const err = JSON.parse(xhr.responseText);
        reject(new Error(err?.error?.message || 'Échec de l\'upload Cloudinary'));
      }
    };

    xhr.onerror = () => reject(new Error('Erreur réseau lors de l\'upload'));
    xhr.send(formData);
  });
}

/** Accepted MIME types */
export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
export const ACCEPTED_VIDEO_TYPES = 'video/mp4,video/webm,video/quicktime,video/x-msvideo';
export const ACCEPTED_MEDIA_TYPES = `${ACCEPTED_IMAGE_TYPES},${ACCEPTED_VIDEO_TYPES}`;

/** Max sizes */
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_VIDEO_SIZE_MB = 100;

export function validateFile(file: File, type: 'image' | 'video' | 'auto'): string | null {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

  if (type === 'image' && !isImage) return 'Seules les images sont acceptées.';
  if (type === 'video' && !isVideo) return 'Seules les vidéos sont acceptées.';
  if (type === 'auto' && !isImage && !isVideo) return 'Format non supporté.';

  const maxMB = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
  if (file.size > maxMB * 1024 * 1024) return `Fichier trop lourd (max ${maxMB} Mo).`;

  return null;
}
