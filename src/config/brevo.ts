// Configuration Brevo - Variables d'environnement
export const BREVO_CONFIG = {
    API_KEY: (import.meta as any).env?.VITE_BREVO_API_KEY || 'your-brevo-api-key-here',
    API_URL: 'https://api.brevo.com/v3/smtp/email', // URL mise à jour pour la nouvelle API Brevo
    SENDER_EMAIL: 'Contact@perfectmodels.ga',
    SENDER_NAME: 'Perfect Models Management',
    REPLY_TO: 'Contact@perfectmodels.ga',
    TEMPLATE_IDS: {
        CONTACT_CONFIRMATION: 'contact_confirmation',
        BOOKING_CONFIRMATION: 'booking_confirmation',
        PAYMENT_CONFIRMATION: 'payment_confirmation',
        NEWS_NOTIFICATION: 'news_notification'
    }
};

// Types d'emails supportés
export type EmailType = 'contact' | 'booking' | 'payment' | 'news' | 'custom';

// Configuration des modèles d'emails
export const EMAIL_TEMPLATES = {
    contact: {
        subject: 'Confirmation de votre message - Perfect Models',
        template: 'contact_confirmation'
    },
    booking: {
        subject: 'Confirmation de réservation - Perfect Models',
        template: 'booking_confirmation'
    },
    payment: {
        subject: 'Confirmation de paiement - Perfect Models',
        template: 'payment_confirmation'
    },
    news: {
        subject: 'Nouvelle actualité - Perfect Models',
        template: 'news_notification'
    },
    custom: {
        subject: 'Message de Perfect Models',
        template: 'custom'
    }
};

// Vérification de la configuration
export const isBrevoConfigured = (): boolean => {
    return BREVO_CONFIG.API_KEY !== 'your-brevo-api-key-here' && BREVO_CONFIG.API_KEY.length > 0;
};

// Configuration avancée pour la gestion des emails
export const EMAIL_CONFIG = {
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 seconde
    BATCH_SIZE: 50,
    RATE_LIMIT: 100, // emails par heure
    TRACKING_ENABLED: true,
    UNSUBSCRIBE_ENABLED: true
};
