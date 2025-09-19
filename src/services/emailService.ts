import { BREVO_CONFIG, isBrevoConfigured } from '../config/brevo';

export interface EmailData {
    to: string;
    subject: string;
    content: string;
    htmlContent?: string;
}

export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Envoie un email via l'API Brevo
 * @param emailData - Données de l'email à envoyer
 * @returns Promise<EmailResponse>
 */
export const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    try {
        // Vérifier la configuration Brevo
        if (!isBrevoConfigured()) {
            return {
                success: false,
                error: 'Configuration Brevo manquante. Veuillez configurer VITE_BREVO_API_KEY dans vos variables d\'environnement.'
            };
        }

        const response = await fetch(BREVO_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_CONFIG.API_KEY,
            },
            body: JSON.stringify({
                sender: {
                    name: BREVO_CONFIG.SENDER_NAME,
                    email: BREVO_CONFIG.SENDER_EMAIL,
                },
                to: [
                    {
                        email: emailData.to,
                    },
                ],
                subject: emailData.subject,
                htmlContent: emailData.htmlContent || emailData.content,
                textContent: emailData.content,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur Brevo: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        return {
            success: true,
            messageId: result.messageId,
        };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi de l\'email',
        };
    }
};

/**
 * Teste la configuration Brevo
 * @returns Promise<boolean>
 */
export const testBrevoConfiguration = async (): Promise<boolean> => {
    if (!isBrevoConfigured()) {
        return false;
    }

    try {
        const response = await fetch(BREVO_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_CONFIG.API_KEY,
            },
            body: JSON.stringify({
                sender: {
                    name: BREVO_CONFIG.SENDER_NAME,
                    email: BREVO_CONFIG.SENDER_EMAIL,
                },
                to: [
                    {
                        email: 'test@example.com',
                    },
                ],
                subject: 'Test de configuration',
                htmlContent: '<p>Test de configuration Brevo</p>',
                textContent: 'Test de configuration Brevo',
            }),
        });

        return response.ok;
    } catch (error) {
        console.error('Erreur lors du test de configuration Brevo:', error);
        return false;
    }
};
