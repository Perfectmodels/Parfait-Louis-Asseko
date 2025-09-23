import { EmailCampaign, EmailTemplate } from '../types';

// Service email simple pour l'instant
// TODO: Intégrer avec Brevo API quand la configuration sera disponible

class EmailService {
    async sendEmail(recipient: string, subject: string, content: string): Promise<{ success: boolean; messageId?: string }> {
        // Simulation d'envoi d'email
        console.log('Envoi d\'email simulé:', { recipient, subject, content });
        
        return {
            success: true,
            messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    async sendCampaign(campaign: EmailCampaign): Promise<{ success: boolean; messageId?: string }> {
        // Simulation d'envoi de campagne
        console.log('Envoi de campagne simulé:', campaign);
        
        // Simuler l'envoi à tous les destinataires
        for (const recipient of campaign.recipients) {
            await this.sendEmail(recipient.email, campaign.subject, campaign.htmlContent);
        }
        
        return {
            success: true,
            messageId: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };
    }

    async sendTemplate(template: EmailTemplate, recipient: string, variables?: Record<string, string>): Promise<{ success: boolean; messageId?: string }> {
        // Remplacer les variables dans le template
        let content = template.htmlContent;
        if (variables) {
            Object.entries(variables).forEach(([key, value]) => {
                content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
            });
        }
        
        return this.sendEmail(recipient, template.subject, content);
    }
}

const emailService = new EmailService();
export default emailService;
