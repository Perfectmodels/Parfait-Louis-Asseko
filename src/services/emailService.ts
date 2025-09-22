import { BREVO_CONFIG, isBrevoConfigured, EMAIL_TEMPLATES, EMAIL_CONFIG } from '../config/brevo';

export type EmailType = 'contact' | 'booking' | 'payment' | 'news' | 'custom';

export interface EmailData {
    to: string | string[];
    subject: string;
    content: string;
    htmlContent?: string;
    templateId?: string;
    attachments?: EmailAttachment[];
    tags?: string[];
    replyTo?: string;
    scheduledAt?: string; // ISO date string
}

export interface EmailAttachment {
    name: string;
    content: string; // base64 encoded
    type: string;
}

export interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
    retryCount?: number;
    scheduledAt?: string;
}

export interface EmailLog {
    id: string;
    timestamp: string;
    to: string | string[];
    subject: string;
    status: 'sent' | 'failed' | 'pending' | 'scheduled';
    messageId?: string;
    error?: string;
    retryCount: number;
    emailType: EmailType;
}

// Stockage local des logs d'emails
let emailLogs: EmailLog[] = JSON.parse(localStorage.getItem('emailLogs') || '[]');

// Sauvegarder les logs
const saveEmailLogs = () => {
    localStorage.setItem('emailLogs', JSON.stringify(emailLogs));
};

// Ajouter un log d'email
const addEmailLog = (log: EmailLog) => {
    emailLogs.unshift(log);
    // Garder seulement les 1000 derniers logs
    if (emailLogs.length > 1000) {
        emailLogs = emailLogs.slice(0, 1000);
    }
    saveEmailLogs();
};

/**
 * Envoie un email via l'API Brevo avec retry automatique
 * @param emailData - Données de l'email à envoyer
 * @param emailType - Type d'email pour le logging
 * @param retryCount - Nombre de tentatives actuelles
 * @returns Promise<EmailResponse>
 */
export const sendEmail = async (
    emailData: EmailData, 
    emailType: EmailType = 'custom',
    retryCount: number = 0
): Promise<EmailResponse> => {
    const logId = `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        // Vérifier la configuration Brevo
        if (!isBrevoConfigured()) {
            const error = 'Configuration Brevo manquante. Veuillez configurer VITE_BREVO_API_KEY dans vos variables d\'environnement.';
            addEmailLog({
                id: logId,
                timestamp: new Date().toISOString(),
                to: emailData.to,
                subject: emailData.subject,
                status: 'failed',
                error,
                retryCount,
                emailType
            });
            
            return {
                success: false,
                error,
                retryCount
            };
        }

        // Préparer les destinataires
        const recipients = Array.isArray(emailData.to) 
            ? emailData.to.map(email => ({ email }))
            : [{ email: emailData.to }];

        // Préparer le payload pour Brevo
        const payload: any = {
            sender: {
                name: BREVO_CONFIG.SENDER_NAME,
                email: BREVO_CONFIG.SENDER_EMAIL,
            },
            to: recipients,
            subject: emailData.subject,
            htmlContent: emailData.htmlContent || emailData.content,
            textContent: emailData.content,
            replyTo: {
                email: emailData.replyTo || BREVO_CONFIG.REPLY_TO
            },
            headers: {
                'X-Mailer': 'Perfect Models Management System'
            }
        };

        // Ajouter les pièces jointes si présentes
        if (emailData.attachments && emailData.attachments.length > 0) {
            payload.attachment = emailData.attachments;
        }

        // Ajouter les tags si présents
        if (emailData.tags && emailData.tags.length > 0) {
            payload.tags = emailData.tags;
        }

        // Programmation d'envoi si spécifiée
        if (emailData.scheduledAt) {
            payload.scheduledAt = emailData.scheduledAt;
        }

        // Ajouter le template ID si spécifié
        if (emailData.templateId) {
            payload.templateId = emailData.templateId;
        }

        const response = await fetch(BREVO_CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': BREVO_CONFIG.API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const error = `Erreur Brevo: ${errorData.message || response.statusText}`;
            
            // Retry automatique si possible
            if (retryCount < EMAIL_CONFIG.MAX_RETRY_ATTEMPTS) {
                setTimeout(async () => {
                    await sendEmail(emailData, emailType, retryCount + 1);
                }, EMAIL_CONFIG.RETRY_DELAY * (retryCount + 1));
                
                addEmailLog({
                    id: logId,
                    timestamp: new Date().toISOString(),
                    to: emailData.to,
                    subject: emailData.subject,
                    status: 'pending',
                    error,
                    retryCount: retryCount + 1,
                    emailType
                });
                
                return {
                    success: false,
                    error: `Tentative ${retryCount + 1}/${EMAIL_CONFIG.MAX_RETRY_ATTEMPTS} - ${error}`,
                    retryCount: retryCount + 1
                };
            }
            
            addEmailLog({
                id: logId,
                timestamp: new Date().toISOString(),
                to: emailData.to,
                subject: emailData.subject,
                status: 'failed',
                error,
                retryCount,
                emailType
            });
            
            throw new Error(error);
        }

        const result = await response.json();
        
        addEmailLog({
            id: logId,
            timestamp: new Date().toISOString(),
            to: emailData.to,
            subject: emailData.subject,
            status: emailData.scheduledAt ? 'scheduled' : 'sent',
            messageId: result.messageId,
            retryCount,
            emailType
        });

        return {
            success: true,
            messageId: result.messageId,
            scheduledAt: emailData.scheduledAt,
            retryCount
        };
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue lors de l\'envoi de l\'email';
        
        addEmailLog({
            id: logId,
            timestamp: new Date().toISOString(),
            to: emailData.to,
            subject: emailData.subject,
            status: 'failed',
            error: errorMessage,
            retryCount,
            emailType
        });
        
        return {
            success: false,
            error: errorMessage,
            retryCount
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
                'accept': 'application/json',
                'api-key': BREVO_CONFIG.API_KEY,
                'content-type': 'application/json',
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

/**
 * Envoie un email avec un modèle prédéfini
 * @param emailType - Type d'email (contact, booking, payment, news)
 * @param emailData - Données de l'email
 * @returns Promise<EmailResponse>
 */
export const sendTemplatedEmail = async (
    emailType: EmailType,
    emailData: Partial<EmailData>
): Promise<EmailResponse> => {
    const template = EMAIL_TEMPLATES[emailType];
    
    const fullEmailData: EmailData = {
        to: emailData.to || '',
        subject: emailData.subject || template.subject,
        content: emailData.content || '',
        htmlContent: emailData.htmlContent,
        templateId: emailData.templateId || template.template,
        attachments: emailData.attachments,
        tags: emailData.tags,
        replyTo: emailData.replyTo,
        scheduledAt: emailData.scheduledAt
    };

    return sendEmail(fullEmailData, emailType);
};

/**
 * Envoie un email en masse
 * @param emailDataList - Liste des emails à envoyer
 * @param emailType - Type d'email
 * @returns Promise<EmailResponse[]>
 */
export const sendBulkEmails = async (
    emailDataList: EmailData[],
    emailType: EmailType = 'custom'
): Promise<EmailResponse[]> => {
    const results: EmailResponse[] = [];
    
    // Traitement par batch pour éviter les limites de rate
    for (let i = 0; i < emailDataList.length; i += EMAIL_CONFIG.BATCH_SIZE) {
        const batch = emailDataList.slice(i, i + EMAIL_CONFIG.BATCH_SIZE);
        
        const batchPromises = batch.map(emailData => 
            sendEmail(emailData, emailType)
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
        
        // Délai entre les batches pour respecter les limites de rate
        if (i + EMAIL_CONFIG.BATCH_SIZE < emailDataList.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return results;
};

/**
 * Récupère les logs d'emails
 * @param filters - Filtres optionnels
 * @returns EmailLog[]
 */
export const getEmailLogs = (filters?: {
    status?: EmailLog['status'];
    emailType?: EmailType;
    limit?: number;
}): EmailLog[] => {
    let logs = [...emailLogs];
    
    if (filters?.status) {
        logs = logs.filter(log => log.status === filters.status);
    }
    
    if (filters?.emailType) {
        logs = logs.filter(log => log.emailType === filters.emailType);
    }
    
    if (filters?.limit) {
        logs = logs.slice(0, filters.limit);
    }
    
    return logs;
};

/**
 * Supprime les logs d'emails
 * @param logIds - IDs des logs à supprimer (optionnel, supprime tous si non spécifié)
 * @returns boolean
 */
export const deleteEmailLogs = (logIds?: string[]): boolean => {
    try {
        if (logIds) {
            emailLogs = emailLogs.filter(log => !logIds.includes(log.id));
        } else {
            emailLogs = [];
        }
        saveEmailLogs();
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression des logs:', error);
        return false;
    }
};

/**
 * Obtient les statistiques des emails
 * @returns Statistiques des emails
 */
export const getEmailStats = () => {
    const total = emailLogs.length;
    const sent = emailLogs.filter(log => log.status === 'sent').length;
    const failed = emailLogs.filter(log => log.status === 'failed').length;
    const pending = emailLogs.filter(log => log.status === 'pending').length;
    const scheduled = emailLogs.filter(log => log.status === 'scheduled').length;
    
    const emailTypeStats = emailLogs.reduce((acc, log) => {
        acc[log.emailType] = (acc[log.emailType] || 0) + 1;
        return acc;
    }, {} as Record<EmailType, number>);
    
    return {
        total,
        sent,
        failed,
        pending,
        scheduled,
        successRate: total > 0 ? (sent / total) * 100 : 0,
        emailTypeStats
    };
};

/**
 * Programme un email pour envoi différé
 * @param emailData - Données de l'email
 * @param scheduledAt - Date d'envoi (ISO string)
 * @param emailType - Type d'email
 * @returns Promise<EmailResponse>
 */
export const scheduleEmail = async (
    emailData: EmailData,
    scheduledAt: string,
    emailType: EmailType = 'custom'
): Promise<EmailResponse> => {
    const scheduledEmailData = {
        ...emailData,
        scheduledAt
    };
    
    return sendEmail(scheduledEmailData, emailType);
};
