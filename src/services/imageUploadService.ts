import { IMGBB_CONFIG } from '../config/imgbbConfig';

export interface UploadResult {
    success: boolean;
    imageUrl?: string;
    error?: string;
    deleteUrl?: string;
}

class ImageUploadService {
    async uploadImage(file: File): Promise<UploadResult> {
        try {
            // Validation du fichier
            if (!this.validateFile(file)) {
                return {
                    success: false,
                    error: 'Fichier invalide. Formats acceptés: JPG, PNG, GIF, WebP (max 5MB)'
                };
            }

            // Préparation des données
            const formData = new FormData();
            formData.append('image', file);
            formData.append('key', IMGBB_CONFIG.API_KEY);

            // Upload vers ImgBB
            const response = await fetch(IMGBB_CONFIG.UPLOAD_URL, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                return {
                    success: true,
                    imageUrl: result.data.url,
                    deleteUrl: result.data.delete_url
                };
            } else {
                return {
                    success: false,
                    error: result.error?.message || 'Erreur lors de l\'upload'
                };
            }
        } catch (error) {
            console.error('Image upload error:', error);
            return {
                success: false,
                error: 'Erreur de connexion lors de l\'upload'
            };
        }
    }

    async uploadMultipleImages(files: File[]): Promise<UploadResult[]> {
        const uploadPromises = files.map(file => this.uploadImage(file));
        return Promise.all(uploadPromises);
    }

    private validateFile(file: File): boolean {
        // Vérifier le type de fichier
        if (!IMGBB_CONFIG.ALLOWED_TYPES.includes(file.type)) {
            return false;
        }

        // Vérifier la taille
        if (file.size > IMGBB_CONFIG.MAX_FILE_SIZE) {
            return false;
        }

        return true;
    }

    // Méthode pour redimensionner une image avant l'upload (optionnel)
    async resizeImage(file: File, maxWidth: number = 1920, maxHeight: number = 1080): Promise<File> {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculer les nouvelles dimensions
                let { width, height } = img;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width *= ratio;
                    height *= ratio;
                }

                // Redimensionner
                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                // Convertir en blob puis en File
                canvas.toBlob((blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        });
                        resolve(resizedFile);
                    } else {
                        resolve(file);
                    }
                }, file.type, 0.9);
            };

            img.src = URL.createObjectURL(file);
        });
    }
}

const imageUploadService = new ImageUploadService();
export default imageUploadService;
