// Configuration pour les transformations d'images (sans Cloudinary)
export const CLOUDINARY_CONFIG = {
  // Transformations par défaut
  defaultTransformations: {
    quality: 'auto',
    fetch_format: 'auto',
    width: 'auto',
    height: 'auto',
    crop: 'scale'
  },
  
  // Transformations pour les portraits de mannequins
  modelPortrait: {
    quality: 'auto',
    fetch_format: 'auto',
    width: 400,
    height: 600,
    crop: 'fill',
    gravity: 'face'
  },
  
  // Transformations pour les images de portfolio
  portfolioImage: {
    quality: 'auto',
    fetch_format: 'auto',
    width: 800,
    height: 1200,
    crop: 'fill',
    gravity: 'auto'
  },
  
  // Transformations pour les thumbnails
  thumbnail: {
    quality: 'auto',
    fetch_format: 'auto',
    width: 200,
    height: 300,
    crop: 'fill',
    gravity: 'face'
  },
  
  // Transformations pour les images de site
  siteImage: {
    quality: 'auto',
    fetch_format: 'auto',
    width: 1200,
    height: 800,
    crop: 'fill',
    gravity: 'auto'
  }
};

// Fonction pour uploader une image (fallback vers ImgBB)
export const uploadImage = async (file: File, folder: string = 'perfect-models'): Promise<any> => {
  // Utiliser ImgBB comme fallback
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', '59f0176178bae04b1f2cbd7f5bc03614');

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    
    if (data.success) {
      return {
        public_id: data.data.id,
        secure_url: data.data.url,
        url: data.data.url
      };
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Fonction pour générer des URLs optimisées (retourne l'URL originale)
export const getOptimizedImageUrl = (
  publicId: string, 
  transformations: any = CLOUDINARY_CONFIG.defaultTransformations
): string => {
  // Retourner l'URL originale car on utilise ImgBB
  return publicId;
};

// Fonction pour supprimer une image (non supportée avec ImgBB)
export const deleteImage = async (publicId: string): Promise<boolean> => {
  console.warn('Image deletion not supported with ImgBB');
  return false;
};