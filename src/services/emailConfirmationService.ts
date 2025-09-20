import { ContactMessage, BookingRequest, FashionDayApplication, CastingApplication } from '../types';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailConfirmationData {
  recipientEmail: string;
  recipientName: string;
  formType: 'contact' | 'booking' | 'fashion-day' | 'casting' | 'payment';
  submissionData: any;
  submissionId: string;
}

class EmailConfirmationService {
  private apiKey: string;
  private baseUrl: string = 'https://api.brevo.com/v3/sendEmail';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Envoie un email de confirmation pour un formulaire de contact
   */
  async sendContactConfirmation(data: EmailConfirmationData): Promise<boolean> {
    const template = this.getContactConfirmationTemplate(data);
    return this.sendEmail(data.recipientEmail, data.recipientName, template);
  }

  /**
   * Envoie un email de confirmation pour une demande de réservation
   */
  async sendBookingConfirmation(data: EmailConfirmationData): Promise<boolean> {
    const template = this.getBookingConfirmationTemplate(data);
    return this.sendEmail(data.recipientEmail, data.recipientName, template);
  }

  /**
   * Envoie un email de confirmation pour une candidature Fashion Day
   */
  async sendFashionDayConfirmation(data: EmailConfirmationData): Promise<boolean> {
    const template = this.getFashionDayConfirmationTemplate(data);
    return this.sendEmail(data.recipientEmail, data.recipientName, template);
  }

  /**
   * Envoie un email de confirmation pour une candidature de casting
   */
  async sendCastingConfirmation(data: EmailConfirmationData): Promise<boolean> {
    const template = this.getCastingConfirmationTemplate(data);
    return this.sendEmail(data.recipientEmail, data.recipientName, template);
  }

  /**
   * Envoie un email de confirmation pour un paiement
   */
  async sendPaymentConfirmation(data: EmailConfirmationData): Promise<boolean> {
    const template = this.getPaymentConfirmationTemplate(data);
    return this.sendEmail(data.recipientEmail, data.recipientName, template);
  }

  /**
   * Méthode générique pour envoyer un email
   */
  private async sendEmail(recipientEmail: string, recipientName: string, template: EmailTemplate): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: 'Perfect Models Management',
            email: 'noreply@perfectmodels.ga'
          },
          to: [
            {
              email: recipientEmail,
              name: recipientName
            }
          ],
          subject: template.subject,
          htmlContent: template.html,
          textContent: template.text
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email de confirmation:', error);
      return false;
    }
  }

  /**
   * Template pour confirmation de contact
   */
  private getContactConfirmationTemplate(data: EmailConfirmationData): EmailTemplate {
    const submission = data.submissionData as ContactMessage;
    
    return {
      subject: 'Confirmation de réception - Perfect Models Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0f0f0; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 28px; margin: 0;">Perfect Models Management</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0;">L'agence de mannequins de référence au Gabon</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 25px; border-radius: 10px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin-top: 0;">✅ Message reçu avec succès</h2>
            <p>Bonjour <strong>${data.recipientName}</strong>,</p>
            <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">Détails de votre message :</h3>
              <p><strong>Sujet :</strong> ${submission.subject}</p>
              <p><strong>Date :</strong> ${new Date(submission.submissionDate).toLocaleString('fr-FR')}</p>
              <p><strong>Message :</strong></p>
              <div style="background: #0a0a0a; padding: 10px; border-radius: 5px; font-style: italic;">
                "${submission.message}"
              </div>
            </div>
            
            <p>Notre équipe examinera votre demande et vous répondra dans les plus brefs délais.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📞 Contact</h3>
              <p>Pour toute question urgente, n'hésitez pas à nous contacter :</p>
              <p>📧 Email : contact@perfectmodels.ga</p>
              <p>📱 WhatsApp : +241 XX XX XX XX</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px;">
              Perfect Models Management - Libreville, Gabon<br>
              <a href="https://perfectmodels.ga" style="color: #D4AF37;">www.perfectmodels.ga</a>
            </p>
          </div>
        </div>
      `,
      text: `
        Confirmation de réception - Perfect Models Management
        
        Bonjour ${data.recipientName},
        
        Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.
        
        Détails de votre message :
        - Sujet : ${submission.subject}
        - Date : ${new Date(submission.submissionDate).toLocaleString('fr-FR')}
        - Message : ${submission.message}
        
        Notre équipe examinera votre demande et vous répondra dans les plus brefs délais.
        
        Contact :
        - Email : contact@perfectmodels.ga
        - WhatsApp : +241 XX XX XX XX
        
        Perfect Models Management - Libreville, Gabon
        www.perfectmodels.ga
      `
    };
  }

  /**
   * Template pour confirmation de réservation
   */
  private getBookingConfirmationTemplate(data: EmailConfirmationData): EmailTemplate {
    const submission = data.submissionData as BookingRequest;
    
    return {
      subject: 'Confirmation de demande de réservation - Perfect Models Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0f0f0; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 28px; margin: 0;">Perfect Models Management</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0;">L'agence de mannequins de référence au Gabon</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 25px; border-radius: 10px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin-top: 0;">🎬 Demande de réservation reçue</h2>
            <p>Bonjour <strong>${data.recipientName}</strong>,</p>
            <p>Nous avons bien reçu votre demande de réservation et nous vous remercions de votre confiance.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">Détails de votre réservation :</h3>
              <p><strong>Entreprise :</strong> ${submission.clientCompany}</p>
              <p><strong>Modèles demandés :</strong> ${submission.requestedModels}</p>
              <p><strong>Période :</strong> Du ${new Date(submission.startDate).toLocaleDateString('fr-FR')} au ${new Date(submission.endDate).toLocaleDateString('fr-FR')}</p>
              <p><strong>Message :</strong></p>
              <div style="background: #0a0a0a; padding: 10px; border-radius: 5px; font-style: italic;">
                "${submission.bookingMessage}"
              </div>
            </div>
            
            <p>Notre équipe commerciale examinera votre demande et vous contactera dans les 24h pour discuter des détails et vous proposer un devis personnalisé.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📞 Contact Commercial</h3>
              <p>Pour toute question concernant votre réservation :</p>
              <p>📧 Email : commercial@perfectmodels.ga</p>
              <p>📱 WhatsApp : +241 XX XX XX XX</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px;">
              Perfect Models Management - Libreville, Gabon<br>
              <a href="https://perfectmodels.ga" style="color: #D4AF37;">www.perfectmodels.ga</a>
            </p>
          </div>
        </div>
      `,
      text: `
        Confirmation de demande de réservation - Perfect Models Management
        
        Bonjour ${data.recipientName},
        
        Nous avons bien reçu votre demande de réservation et nous vous remercions de votre confiance.
        
        Détails de votre réservation :
        - Entreprise : ${submission.clientCompany}
        - Modèles demandés : ${submission.requestedModels}
        - Période : Du ${new Date(submission.startDate).toLocaleDateString('fr-FR')} au ${new Date(submission.endDate).toLocaleDateString('fr-FR')}
        - Message : ${submission.bookingMessage}
        
        Notre équipe commerciale examinera votre demande et vous contactera dans les 24h.
        
        Contact Commercial :
        - Email : commercial@perfectmodels.ga
        - WhatsApp : +241 XX XX XX XX
        
        Perfect Models Management - Libreville, Gabon
        www.perfectmodels.ga
      `
    };
  }

  /**
   * Template pour confirmation Fashion Day
   */
  private getFashionDayConfirmationTemplate(data: EmailConfirmationData): EmailTemplate {
    const submission = data.submissionData as FashionDayApplication;
    
    return {
      subject: 'Confirmation de candidature Perfect Fashion Day - Perfect Models Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0f0f0; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 28px; margin: 0;">Perfect Models Management</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0;">Perfect Fashion Day</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 25px; border-radius: 10px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin-top: 0;">✨ Candidature reçue avec succès</h2>
            <p>Bonjour <strong>${data.recipientName}</strong>,</p>
            <p>Nous avons bien reçu votre candidature pour le Perfect Fashion Day et nous vous remercions de votre intérêt.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">Détails de votre candidature :</h3>
              <p><strong>Rôle :</strong> ${submission.role}</p>
              <p><strong>Âge :</strong> ${submission.age} ans</p>
              <p><strong>Genre :</strong> ${submission.gender}</p>
              <p><strong>Localisation :</strong> ${submission.location}</p>
              <p><strong>Expérience :</strong> ${submission.experience}</p>
              ${submission.portfolioUrl ? `<p><strong>Portfolio :</strong> <a href="${submission.portfolioUrl}" style="color: #D4AF37;">Voir le portfolio</a></p>` : ''}
            </div>
            
            <p>Notre équipe examinera votre candidature et vous contactera dans les 48h pour vous informer de la suite du processus de sélection.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📅 Prochaines étapes</h3>
              <ul style="color: #f0f0f0;">
                <li>Examen de votre candidature par notre équipe</li>
                <li>Présélection des candidats</li>
                <li>Convocation pour les auditions</li>
                <li>Annonce des résultats finaux</li>
              </ul>
            </div>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📞 Contact</h3>
              <p>Pour toute question concernant votre candidature :</p>
              <p>📧 Email : casting@perfectmodels.ga</p>
              <p>📱 WhatsApp : +241 XX XX XX XX</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px;">
              Perfect Models Management - Libreville, Gabon<br>
              <a href="https://perfectmodels.ga" style="color: #D4AF37;">www.perfectmodels.ga</a>
            </p>
          </div>
        </div>
      `,
      text: `
        Confirmation de candidature Perfect Fashion Day - Perfect Models Management
        
        Bonjour ${data.recipientName},
        
        Nous avons bien reçu votre candidature pour le Perfect Fashion Day et nous vous remercions de votre intérêt.
        
        Détails de votre candidature :
        - Rôle : ${submission.role}
        - Âge : ${submission.age} ans
        - Genre : ${submission.gender}
        - Localisation : ${submission.location}
        - Expérience : ${submission.experience}
        ${submission.portfolioUrl ? `- Portfolio : ${submission.portfolioUrl}` : ''}
        
        Notre équipe examinera votre candidature et vous contactera dans les 48h.
        
        Prochaines étapes :
        1. Examen de votre candidature par notre équipe
        2. Présélection des candidats
        3. Convocation pour les auditions
        4. Annonce des résultats finaux
        
        Contact :
        - Email : casting@perfectmodels.ga
        - WhatsApp : +241 XX XX XX XX
        
        Perfect Models Management - Libreville, Gabon
        www.perfectmodels.ga
      `
    };
  }

  /**
   * Template pour confirmation de casting
   */
  private getCastingConfirmationTemplate(data: EmailConfirmationData): EmailTemplate {
    const submission = data.submissionData as CastingApplication;
    
    return {
      subject: 'Confirmation de candidature de casting - Perfect Models Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0f0f0; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 28px; margin: 0;">Perfect Models Management</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0;">L'agence de mannequins de référence au Gabon</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 25px; border-radius: 10px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin-top: 0;">🎭 Candidature de casting reçue</h2>
            <p>Bonjour <strong>${data.recipientName}</strong>,</p>
            <p>Nous avons bien reçu votre candidature de casting et nous vous remercions de votre intérêt pour rejoindre notre agence.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">Détails de votre candidature :</h3>
              <p><strong>Nom :</strong> ${submission.firstName} ${submission.lastName}</p>
              <p><strong>Âge :</strong> ${submission.birthDate ? new Date().getFullYear() - new Date(submission.birthDate).getFullYear() : 'Non spécifié'} ans</p>
              <p><strong>Genre :</strong> ${submission.gender}</p>
              <p><strong>Nationalité :</strong> ${submission.nationality}</p>
              <p><strong>Ville :</strong> ${submission.city}</p>
              <p><strong>Expérience :</strong> ${submission.experience}</p>
              ${submission.instagram ? `<p><strong>Instagram :</strong> <a href="https://instagram.com/${submission.instagram}" style="color: #D4AF37;">@${submission.instagram}</a></p>` : ''}
            </div>
            
            <p>Notre équipe de casting examinera votre candidature et vos photos. Si votre profil correspond à nos critères, nous vous contacterons dans les 7 jours pour organiser un entretien.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📋 Processus de sélection</h3>
              <ul style="color: #f0f0f0;">
                <li>Examen de votre dossier et photos</li>
                <li>Présélection des candidats</li>
                <li>Entretien individuel</li>
                <li>Tests de pose et défilé</li>
                <li>Annonce des résultats</li>
              </ul>
            </div>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📞 Contact</h3>
              <p>Pour toute question concernant votre candidature :</p>
              <p>📧 Email : casting@perfectmodels.ga</p>
              <p>📱 WhatsApp : +241 XX XX XX XX</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px;">
              Perfect Models Management - Libreville, Gabon<br>
              <a href="https://perfectmodels.ga" style="color: #D4AF37;">www.perfectmodels.ga</a>
            </p>
          </div>
        </div>
      `,
      text: `
        Confirmation de candidature de casting - Perfect Models Management
        
        Bonjour ${data.recipientName},
        
        Nous avons bien reçu votre candidature de casting et nous vous remercions de votre intérêt pour rejoindre notre agence.
        
        Détails de votre candidature :
        - Nom : ${submission.firstName} ${submission.lastName}
        - Âge : ${submission.birthDate ? new Date().getFullYear() - new Date(submission.birthDate).getFullYear() : 'Non spécifié'} ans
        - Genre : ${submission.gender}
        - Nationalité : ${submission.nationality}
        - Ville : ${submission.city}
        - Expérience : ${submission.experience}
        ${submission.instagram ? `- Instagram : @${submission.instagram}` : ''}
        
        Notre équipe de casting examinera votre candidature et vos photos. Si votre profil correspond à nos critères, nous vous contacterons dans les 7 jours.
        
        Processus de sélection :
        1. Examen de votre dossier et photos
        2. Présélection des candidats
        3. Entretien individuel
        4. Tests de pose et défilé
        5. Annonce des résultats
        
        Contact :
        - Email : casting@perfectmodels.ga
        - WhatsApp : +241 XX XX XX XX
        
        Perfect Models Management - Libreville, Gabon
        www.perfectmodels.ga
      `
    };
  }

  /**
   * Template pour confirmation de paiement
   */
  private getPaymentConfirmationTemplate(data: EmailConfirmationData): EmailTemplate {
    const submission = data.submissionData;
    
    return {
      subject: 'Confirmation de soumission de paiement - Perfect Models Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #f0f0f0; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #D4AF37; font-size: 28px; margin: 0;">Perfect Models Management</h1>
            <p style="color: #f0f0f0; font-size: 16px; margin: 10px 0;">L'agence de mannequins de référence au Gabon</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 25px; border-radius: 10px; border-left: 4px solid #D4AF37;">
            <h2 style="color: #D4AF37; margin-top: 0;">💳 Soumission de paiement reçue</h2>
            <p>Bonjour <strong>${data.recipientName}</strong>,</p>
            <p>Nous avons bien reçu votre soumission de paiement et nous vous remercions.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">Détails de votre paiement :</h3>
              <p><strong>Montant :</strong> ${submission.amount} FCFA</p>
              <p><strong>Méthode :</strong> ${submission.paymentMethod}</p>
              <p><strong>Date :</strong> ${new Date(submission.submissionDate).toLocaleString('fr-FR')}</p>
              <p><strong>Statut :</strong> En cours de traitement</p>
            </div>
            
            <p>Notre équipe comptable examinera votre soumission et confirmera la réception de votre paiement dans les 24h.</p>
            
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #D4AF37; margin-top: 0;">📞 Contact Comptable</h3>
              <p>Pour toute question concernant votre paiement :</p>
              <p>📧 Email : comptabilite@perfectmodels.ga</p>
              <p>📱 WhatsApp : +241 XX XX XX XX</p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px;">
              Perfect Models Management - Libreville, Gabon<br>
              <a href="https://perfectmodels.ga" style="color: #D4AF37;">www.perfectmodels.ga</a>
            </p>
          </div>
        </div>
      `,
      text: `
        Confirmation de soumission de paiement - Perfect Models Management
        
        Bonjour ${data.recipientName},
        
        Nous avons bien reçu votre soumission de paiement et nous vous remercions.
        
        Détails de votre paiement :
        - Montant : ${submission.amount} FCFA
        - Méthode : ${submission.paymentMethod}
        - Date : ${new Date(submission.submissionDate).toLocaleString('fr-FR')}
        - Statut : En cours de traitement
        
        Notre équipe comptable examinera votre soumission et confirmera la réception de votre paiement dans les 24h.
        
        Contact Comptable :
        - Email : comptabilite@perfectmodels.ga
        - WhatsApp : +241 XX XX XX XX
        
        Perfect Models Management - Libreville, Gabon
        www.perfectmodels.ga
      `
    };
  }
}

export const emailConfirmationService = new EmailConfirmationService(
  import.meta.env.VITE_BREVO_API_KEY || ''
);
