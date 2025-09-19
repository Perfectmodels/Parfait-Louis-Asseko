export const IMGBB_CONFIG = {
    API_KEY: import.meta.env.VITE_IMGBB_API_KEY || '59f0176178bae04b1f2cbd7f5bc03614',
    API_URL: 'https://api.imgbb.com/1/upload',
    MAX_FILE_SIZE: 32 * 1024 * 1024, // 32MB (limite ImgBB)
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    FOLDER_PREFIX: 'perfect_models'
};

export const isImgBBConfigured = (): boolean => {
    return !!IMGBB_CONFIG.API_KEY;
};

export const getImgBBUploadUrl = (): string => {
    return IMGBB_CONFIG.API_URL;
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    // Vérifier le type de fichier
    if (!IMGBB_CONFIG.ALLOWED_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `Type de fichier non supporté. Types acceptés: ${IMGBB_CONFIG.ALLOWED_TYPES.join(', ')}`
        };
    }

    // Vérifier la taille du fichier
    if (file.size > IMGBB_CONFIG.MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `Fichier trop volumineux. Taille maximale: ${IMGBB_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
        };
    }

    return { valid: true };
};
