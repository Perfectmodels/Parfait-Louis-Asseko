// Configuration Brevo pour l'envoi d'emails
// TODO: Remplacer par la vraie clé API Brevo

export const BREVO_CONFIG = {
    API_KEY: process.env.VITE_BREVO_API_KEY || '',
    SENDER_EMAIL: 'contact@perfectmodels.ga',
    SENDER_NAME: 'Perfect Models Management',
    SMTP_HOST: 'smtp-relay.brevo.com',
    SMTP_PORT: 587,
    SMTP_USER: '94c444001@smtp-brevo.com'
};

// Configuration ImgBB pour l'upload d'images
export const IMGBB_CONFIG = {
    API_KEY: '59f0176178bae04b1f2cbd7f5bc03614',
    UPLOAD_URL: 'https://api.imgbb.com/1/upload',
    MAX_FILE_SIZE: 15 * 1024 * 1024, // 15MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

export const EMAIL_CONFIG = {
    TEMPLATES: {
        WELCOME: 'welcome_template',
        NEWSLETTER: 'newsletter_template',
        NOTIFICATION: 'notification_template'
    },
    SETTINGS: {
        MAX_RECIPIENTS: 1000,
        RATE_LIMIT: 100, // emails per hour
        RETRY_ATTEMPTS: 3
    }
};

export const isBrevoConfigured = (): boolean => {
    return !!BREVO_CONFIG.API_KEY && BREVO_CONFIG.API_KEY.length > 0;
};
