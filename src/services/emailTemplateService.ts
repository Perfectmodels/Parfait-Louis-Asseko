export type EmailType = 'contact' | 'booking' | 'payment' | 'news' | 'custom';

export interface EmailTemplate {
    id: string;
    name: string;
    type: EmailType;
    subject: string;
    htmlContent: string;
    textContent: string;
    variables: string[]; // Variables disponibles dans le template
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TemplateVariable {
    name: string;
    description: string;
    example: string;
    required: boolean;
}

// Variables communes disponibles dans tous les templates
export const COMMON_VARIABLES: TemplateVariable[] = [
    { name: '{{name}}', description: 'Nom du destinataire', example: 'John Doe', required: true },
    { name: '{{email}}', description: 'Email du destinataire', example: 'john@example.com', required: true },
    { name: '{{date}}', description: 'Date actuelle', example: '15/01/2024', required: false },
    { name: '{{time}}', description: 'Heure actuelle', example: '14:30', required: false },
    { name: '{{company}}', description: 'Nom de l\'entreprise', example: 'Perfect Models', required: false },
    { name: '{{website}}', description: 'URL du site web', example: 'https://perfectmodels.ga', required: false },
    { name: '{{contact_email}}', description: 'Email de contact', example: 'Contact@perfectmodels.ga', required: false },
    { name: '{{phone}}', description: 'Numéro de téléphone', example: '+33 1 23 45 67 89', required: false }
];

// Variables spécifiques par type d'email
export const TYPE_SPECIFIC_VARIABLES: Record<EmailType, TemplateVariable[]> = {
    contact: [
        { name: '{{message}}', description: 'Message du contact', example: 'Bonjour, je souhaite...', required: true },
        { name: '{{subject}}', description: 'Sujet du message', example: 'Demande d\'information', required: true }
    ],
    booking: [
        { name: '{{booking_id}}', description: 'ID de la réservation', example: 'BK-2024-001', required: true },
        { name: '{{service}}', description: 'Service réservé', example: 'Séance photo', required: true },
        { name: '{{date_booking}}', description: 'Date de la réservation', example: '20/01/2024', required: true },
        { name: '{{time_booking}}', description: 'Heure de la réservation', example: '10:00', required: true },
        { name: '{{location}}', description: 'Lieu de la réservation', example: 'Studio Paris', required: false },
        { name: '{{price}}', description: 'Prix de la réservation', example: '150€', required: false }
    ],
    payment: [
        { name: '{{payment_id}}', description: 'ID du paiement', example: 'PAY-2024-001', required: true },
        { name: '{{amount}}', description: 'Montant du paiement', example: '150€', required: true },
        { name: '{{service}}', description: 'Service payé', example: 'Séance photo', required: true },
        { name: '{{payment_method}}', description: 'Méthode de paiement', example: 'Carte bancaire', required: true },
        { name: '{{transaction_id}}', description: 'ID de la transaction', example: 'TXN-123456', required: false }
    ],
    news: [
        { name: '{{news_title}}', description: 'Titre de l\'actualité', example: 'Nouvelle collection', required: true },
        { name: '{{news_content}}', description: 'Contenu de l\'actualité', example: 'Découvrez notre nouvelle...', required: true },
        { name: '{{news_link}}', description: 'Lien vers l\'actualité', example: 'https://perfectmodels.ga/news/123', required: false },
        { name: '{{news_image}}', description: 'Image de l\'actualité', example: 'https://perfectmodels.ga/images/news.jpg', required: false }
    ],
    custom: []
};

// Stockage local des templates
let emailTemplates: EmailTemplate[] = JSON.parse(localStorage.getItem('emailTemplates') || '[]');

// Sauvegarder les templates
const saveTemplates = () => {
    localStorage.setItem('emailTemplates', JSON.stringify(emailTemplates));
};

// Initialiser avec des templates par défaut si aucun n'existe
const initializeDefaultTemplates = () => {
    if (emailTemplates.length === 0) {
        const defaultTemplates: EmailTemplate[] = [
            {
                id: 'default_contact',
                name: 'Confirmation de Contact',
                type: 'contact',
                subject: 'Confirmation de votre message - {{company}}',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 20px; border-radius: 10px;">
                            <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">{{company}}</h1>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Confirmation de votre message</h2>
                                <p style="color: #333;">Bonjour {{name}},</p>
                                <p style="color: #333;">Nous avons bien reçu votre message concernant : <strong>{{subject}}</strong></p>
                                <p style="color: #333;">Nous vous répondrons dans les plus brefs délais.</p>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                                <p style="color: #6c757d; font-size: 0.9em; margin: 0;">
                                    {{company}} - {{website}}<br>
                                    Email: {{contact_email}} | Téléphone: {{phone}}
                                </p>
                            </div>
                        </div>
                    </div>
                `,
                textContent: `
                    {{company}}
                    
                    Confirmation de votre message
                    
                    Bonjour {{name}},
                    
                    Nous avons bien reçu votre message concernant : {{subject}}
                    Nous vous répondrons dans les plus brefs délais.
                    
                    Cordialement,
                    L'équipe {{company}}
                    
                    {{website}}
                    Email: {{contact_email}}
                    Téléphone: {{phone}}
                `,
                variables: ['name', 'subject', 'company', 'website', 'contact_email', 'phone'],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'default_booking',
                name: 'Confirmation de Réservation',
                type: 'booking',
                subject: 'Confirmation de votre réservation - {{company}}',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 20px; border-radius: 10px;">
                            <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">{{company}}</h1>
                            
                            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                                <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Confirmation de Réservation</h2>
                                <p style="color: #333;">Bonjour {{name}},</p>
                                <p style="color: #333;">Votre réservation a été confirmée avec succès !</p>
                                
                                <div style="background: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0;">
                                    <h3 style="color: #333; margin-top: 0;">Détails de la réservation</h3>
                                    <p style="color: #333; margin: 5px 0;"><strong>ID Réservation:</strong> {{booking_id}}</p>
                                    <p style="color: #333; margin: 5px 0;"><strong>Service:</strong> {{service}}</p>
                                    <p style="color: #333; margin: 5px 0;"><strong>Date:</strong> {{date_booking}}</p>
                                    <p style="color: #333; margin: 5px 0;"><strong>Heure:</strong> {{time_booking}}</p>
                                    <p style="color: #333; margin: 5px 0;"><strong>Prix:</strong> {{price}}</p>
                                </div>
                                
                                <p style="color: #333;">Nous vous remercions de votre confiance et nous réjouissons de vous accueillir.</p>
                            </div>
                            
                            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                                <p style="color: #6c757d; font-size: 0.9em; margin: 0;">
                                    {{company}} - {{website}}<br>
                                    Email: {{contact_email}} | Téléphone: {{phone}}
                                </p>
                            </div>
                        </div>
                    </div>
                `,
                textContent: `
                    {{company}}
                    
                    Confirmation de Réservation
                    
                    Bonjour {{name}},
                    
                    Votre réservation a été confirmée avec succès !
                    
                    Détails de la réservation :
                    - ID Réservation: {{booking_id}}
                    - Service: {{service}}
                    - Date: {{date_booking}}
                    - Heure: {{time_booking}}
                    - Prix: {{price}}
                    
                    Nous vous remercions de votre confiance et nous réjouissons de vous accueillir.
                    
                    Cordialement,
                    L'équipe {{company}}
                    
                    {{website}}
                    Email: {{contact_email}}
                    Téléphone: {{phone}}
                `,
                variables: ['name', 'booking_id', 'service', 'date_booking', 'time_booking', 'price', 'company', 'website', 'contact_email', 'phone'],
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        emailTemplates = defaultTemplates;
        saveTemplates();
    }
};

// Initialiser les templates par défaut
initializeDefaultTemplates();

/**
 * Récupère tous les templates
 * @param filters - Filtres optionnels
 * @returns EmailTemplate[]
 */
export const getEmailTemplates = (filters?: {
    type?: EmailType;
    isActive?: boolean;
}): EmailTemplate[] => {
    let templates = [...emailTemplates];

    if (filters?.type) {
        templates = templates.filter(template => template.type === filters.type);
    }

    if (filters?.isActive !== undefined) {
        templates = templates.filter(template => template.isActive === filters.isActive);
    }

    return templates.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

/**
 * Récupère un template par son ID
 * @param id - ID du template
 * @returns EmailTemplate | null
 */
export const getEmailTemplate = (id: string): EmailTemplate | null => {
    return emailTemplates.find(template => template.id === id) || null;
};

/**
 * Crée un nouveau template
 * @param templateData - Données du template
 * @returns EmailTemplate
 */
export const createEmailTemplate = (templateData: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): EmailTemplate => {
    const newTemplate: EmailTemplate = {
        ...templateData,
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    emailTemplates.unshift(newTemplate);
    saveTemplates();
    return newTemplate;
};

/**
 * Met à jour un template
 * @param id - ID du template
 * @param updates - Mises à jour
 * @returns boolean
 */
export const updateEmailTemplate = (id: string, updates: Partial<Omit<EmailTemplate, 'id' | 'createdAt'>>): boolean => {
    const templateIndex = emailTemplates.findIndex(template => template.id === id);
    
    if (templateIndex === -1) {
        return false;
    }

    emailTemplates[templateIndex] = {
        ...emailTemplates[templateIndex],
        ...updates,
        updatedAt: new Date().toISOString()
    };

    saveTemplates();
    return true;
};

/**
 * Supprime un template
 * @param id - ID du template
 * @returns boolean
 */
export const deleteEmailTemplate = (id: string): boolean => {
    const templateIndex = emailTemplates.findIndex(template => template.id === id);
    
    if (templateIndex === -1) {
        return false;
    }

    emailTemplates.splice(templateIndex, 1);
    saveTemplates();
    return true;
};

/**
 * Duplique un template
 * @param id - ID du template à dupliquer
 * @returns EmailTemplate | null
 */
export const duplicateEmailTemplate = (id: string): EmailTemplate | null => {
    const originalTemplate = getEmailTemplate(id);
    
    if (!originalTemplate) {
        return null;
    }

    const duplicatedTemplate = {
        ...originalTemplate,
        id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: `${originalTemplate.name} (Copie)`,
        isActive: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    emailTemplates.unshift(duplicatedTemplate);
    saveTemplates();
    return duplicatedTemplate;
};

/**
 * Récupère les variables disponibles pour un type d'email
 * @param type - Type d'email
 * @returns TemplateVariable[]
 */
export const getAvailableVariables = (type: EmailType): TemplateVariable[] => {
    return [...COMMON_VARIABLES, ...TYPE_SPECIFIC_VARIABLES[type]];
};

/**
 * Remplace les variables dans un contenu
 * @param content - Contenu avec variables
 * @param variables - Valeurs des variables
 * @returns string
 */
export const replaceTemplateVariables = (content: string, variables: Record<string, string>): string => {
    let result = content;
    
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, value || `{{${key}}}`);
    });
    
    return result;
};

/**
 * Valide un template
 * @param template - Template à valider
 * @returns { isValid: boolean; errors: string[] }
 */
export const validateEmailTemplate = (template: Partial<EmailTemplate>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!template.name?.trim()) {
        errors.push('Le nom du template est requis');
    }

    if (!template.subject?.trim()) {
        errors.push('Le sujet est requis');
    }

    if (!template.htmlContent?.trim() && !template.textContent?.trim()) {
        errors.push('Au moins un contenu (HTML ou texte) est requis');
    }

    if (!template.type) {
        errors.push('Le type d\'email est requis');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
