import { IMGBB_CONFIG, isImgBBConfigured, validateImageFile } from '../config/imgbb';

interface UploadResult {
    id: string;
    url: string;
    width: number;
    height: number;
    format: string;
    size: number;
    title?: string;
    delete_url?: string;
}

class ImgBBService {
    isConfigured(): boolean {
        return isImgBBConfigured();
    }

    async uploadFile(file: File, folder: string = 'perfect_models'): Promise<UploadResult> {
        if (!this.isConfigured()) {
            throw new Error('ImgBB n\'est pas configuré. Vérifiez vos variables d\'environnement.');
        }

        // Valider le fichier
        const validation = validateImageFile(file);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', IMGBB_CONFIG.API_KEY);
        formData.append('name', `${IMGBB_CONFIG.FOLDER_PREFIX}_${folder}_${Date.now()}_${file.name}`);

        try {
            const response = await fetch(IMGBB_CONFIG.API_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur d'upload: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(`Erreur ImgBB: ${result.error?.message || 'Erreur inconnue'}`);
            }

            return {
                id: result.data.id,
                url: result.data.url,
                width: result.data.width,
                height: result.data.height,
                format: result.data.image?.format || file.type.split('/')[1],
                size: result.data.size,
                title: result.data.title,
                delete_url: result.data.delete_url
            };
        } catch (error) {
            console.error('Erreur lors de l\'upload ImgBB:', error);
            throw new Error(`Impossible d'uploader le fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    }

    async uploadMultipleFiles(files: File[], folder: string = 'perfect_models'): Promise<UploadResult[]> {
        const uploadPromises = files.map(file => this.uploadFile(file, folder));
        return Promise.all(uploadPromises);
    }

    async deleteFile(deleteUrl: string): Promise<boolean> {
        if (!deleteUrl) {
            console.warn('URL de suppression non fournie');
            return false;
        }

        try {
            const response = await fetch(deleteUrl, {
                method: 'DELETE'
            });

            return response.ok;
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            return false;
        }
    }

    getOptimizedUrl(url: string, width?: number, height?: number): string {
        // ImgBB ne supporte pas les transformations d'URL comme Cloudinary
        // On retourne l'URL originale
        return url;
    }

    getThumbnailUrl(url: string, size: number = 300): string {
        // ImgBB ne supporte pas les transformations d'URL
        // On retourne l'URL originale
        return url;
    }
}

export const imgbbService = new ImgBBService();
export type { UploadResult };
