// Configuration Brevo - Variables d'environnement
export const BREVO_CONFIG = {
    API_KEY: import.meta.env.VITE_BREVO_API_KEY || 'your-brevo-api-key-here',
    API_URL: 'https://api.brevo.com/v3/send/email',
    SENDER_EMAIL: 'Contact@perfectmodels.ga',
    SENDER_NAME: 'Perfect Models'
};

// Vérification de la configuration
export const isBrevoConfigured = (): boolean => {
    return BREVO_CONFIG.API_KEY !== 'your-brevo-api-key-here' && BREVO_CONFIG.API_KEY.length > 0;
};
