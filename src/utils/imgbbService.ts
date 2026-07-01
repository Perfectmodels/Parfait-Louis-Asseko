export interface ImgBBUploadResult {
  url: string;
}

export async function uploadToImgbb(
  file: File,
  apiKey: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  if (!apiKey?.trim()) {
    throw new Error('Clé API ImgBB manquante. Configurez-la dans les paramètres admin.');
  }

  let progressTimer: ReturnType<typeof setInterval> | null = null;

  const startProgress = () => {
    if (!onProgress) return;
    let pct = 0;
    progressTimer = setInterval(() => {
      pct += Math.random() * 15;
      if (pct > 85) pct = 85;
      onProgress(Math.round(pct));
    }, 300);
  };

  const stopProgress = () => {
    if (progressTimer) clearInterval(progressTimer);
    if (onProgress) onProgress(100);
  };

  try {
    startProgress();
    const base64 = await fileToBase64(file);
    const payload = base64.split(',')[1] ?? base64;

    const formData = new FormData();
    formData.append('key', apiKey.trim());
    formData.append('image', payload);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (!response.ok || !data?.data?.url) {
      throw new Error(data?.error?.message || "Échec de l'upload ImgBB");
    }

    return data.data.url as string;
  } finally {
    stopProgress();
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
    reader.readAsDataURL(file);
  });
}

export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp,image/gif,image/avif';
export const MAX_IMAGE_SIZE_MB = 10;

export function validateFile(file: File, _type: 'image' | 'video' | 'auto'): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Seules les images sont acceptées.';
  }

  if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    return `Fichier trop lourd (max ${MAX_IMAGE_SIZE_MB} Mo).`;
  }

  return null;
}
