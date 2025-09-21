import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import ServiceOrderConfirmationClient from '../../components/emails/ServiceOrderConfirmationClient';
import ServiceOrderNotificationAdmin from '../../components/emails/ServiceOrderNotificationAdmin';

// Cette clé est stockée côté serveur, et ne sera jamais exposée côté client
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { order, agencyName, adminEmail } = await request.json();

    if (!order || !agencyName || !adminEmail) {
      return new Response('Données manquantes', { status: 400 });
    }

    // Envoyer l'email de confirmation au client
    await resend.emails.send({
      from: `PMM <no-reply@perfectmodelsmanagement.com>`,
      to: order.clientInfo.email,
      subject: `Confirmation de votre commande - ${agencyName}`,
      react: ServiceOrderConfirmationClient({ order, agencyName }),
    });

    // Envoyer l'email de notification à l'admin
    await resend.emails.send({
      from: `Notification PMM <no-reply@perfectmodelsmanagement.com>`,
      to: adminEmail,
      subject: `Nouvelle commande de service reçue - #${order.id}`,
      react: ServiceOrderNotificationAdmin({ order }),
    });

    return new Response(
      JSON.stringify({
        message: 'E-mails envoyés avec succès'
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error("Erreur lors de l'envoi des e-mails:", error);
    return new Response(`Erreur: ${error.message}`, { status: 500 });
  }
};