// Configuration ImgBB pour l'upload d'images
export const IMGBB_CONFIG = {
    API_KEY: '59f0176178bae04b1f2cbd7f5bc03614',
    UPLOAD_URL: 'https://api.imgbb.com/1/upload',
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

export const isImgBBConfigured = (): boolean => {
    return !!IMGBB_CONFIG.API_KEY && IMGBB_CONFIG.API_KEY.length > 0;
};
