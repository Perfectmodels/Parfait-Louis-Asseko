// Emails are sent directly via Brevo API (client-side, key via VITE_BREVO_API_KEY).

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY as string;
const SENDER = { name: 'Perfect Models Management', email: 'contact@perfectmodels.ga' };

// ─── Logo SVG inline (branding email) ────────────────────────────────────────
const LOGO_URL = 'https://perfectmodels.ga/logo.svg';

// ─── Base template ────────────────────────────────────────────────────────────
export const buildEmailTemplate = (content: string, preheader = ''): string => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Perfect Models Management</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,Helvetica,sans-serif">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#080808">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- HEADER -->
        <tr>
          <td style="background:#0a0a0a;border:1px solid #c9a84c22;border-bottom:none;border-radius:12px 12px 0 0;padding:32px 40px;text-align:center">
            <img src="${LOGO_URL}" alt="PMM" width="64" height="64" style="border-radius:50%;border:1px solid #c9a84c33;padding:6px;background:#000"/>
            <div style="margin-top:12px">
              <span style="color:#c9a84c;font-size:11px;letter-spacing:6px;text-transform:uppercase;font-weight:900">Perfect Models Management</span>
            </div>
            <div style="width:40px;height:1px;background:#c9a84c;margin:12px auto 0"></div>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#0a0a0a;border-left:1px solid #c9a84c22;border-right:1px solid #c9a84c22;padding:40px">
            ${content}
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#050505;border:1px solid #c9a84c22;border-top:none;border-radius:0 0 12px 12px;padding:24px 40px;text-align:center">
            <p style="margin:0 0 8px;color:#ffffff20;font-size:11px;letter-spacing:3px;text-transform:uppercase">Suivez-nous</p>
            <p style="margin:0 0 16px">
              <a href="https://facebook.com" style="color:#c9a84c;text-decoration:none;margin:0 8px;font-size:12px">Facebook</a>
              <span style="color:#ffffff20">·</span>
              <a href="https://instagram.com" style="color:#c9a84c;text-decoration:none;margin:0 8px;font-size:12px">Instagram</a>
              <span style="color:#ffffff20">·</span>
              <a href="https://youtube.com" style="color:#c9a84c;text-decoration:none;margin:0 8px;font-size:12px">YouTube</a>
            </p>
            <p style="margin:0;color:#ffffff20;font-size:10px">
              © ${new Date().getFullYear()} Perfect Models Management · Libreville, Gabon<br/>
              <a href="https://perfectmodels.ga" style="color:#c9a84c44;text-decoration:none">perfectmodels.ga</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

// ─── Core send ────────────────────────────────────────────────────────────────
interface SendOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  replyTo?: { email: string; name?: string };
  apiKey?: string; // kept for backward compat, ignored
}

export const sendEmail = async (opts: SendOptions): Promise<void> => {
  if (!BREVO_API_KEY) throw new Error('VITE_BREVO_API_KEY non configurée.');

  const res = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: SENDER,
      to: opts.to,
      subject: opts.subject,
      htmlContent: opts.htmlContent,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Brevo error ${res.status}`);
  }
};

// ─── Templates ────────────────────────────────────────────────────────────────

/** Confirmation de réception au visiteur */
export const sendContactConfirmationToUser = (p: {
  name: string; email: string; subject: string;
}) =>
  sendEmail({
    to: [{ email: p.email, name: p.name }],
    subject: 'Nous avons bien reçu votre message — Perfect Models Management',
    htmlContent: buildEmailTemplate(`
      <p style="color:#f5f0e8;font-size:16px;margin:0 0 16px">Bonjour <strong style="color:#c9a84c">${p.name}</strong>,</p>
      <p style="color:#f5f0e8cc;line-height:1.8;margin:0 0 24px">
        Nous avons bien reçu votre message concernant <em>"${p.subject}"</em>.<br/>
        Notre équipe vous répondra dans les plus brefs délais, généralement sous <strong>24 à 48 heures ouvrées</strong>.
      </p>
      <div style="background:#c9a84c0d;border:1px solid #c9a84c22;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
        <p style="color:#c9a84c;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 8px">En attendant</p>
        <p style="color:#f5f0e8aa;font-size:14px;margin:0 0 16px">Découvrez nos mannequins, services et actualités.</p>
        <a href="https://perfectmodels.ga" style="display:inline-block;background:#c9a84c;color:#080808;font-weight:900;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:100px">Visiter le site</a>
      </div>
      <p style="color:#f5f0e8cc;line-height:1.7;margin:0">Cordialement,<br/><strong style="color:#c9a84c">L'équipe Perfect Models Management</strong></p>
    `, `Votre message a bien été reçu — nous vous répondons sous 48h`),
  });

/** Notification admin d'un nouveau message de contact */
export const sendContactNotificationToAdmin = (p: {
  name: string; email: string; subject: string; message: string; notificationEmail: string;
}) =>
  sendEmail({
    to: [{ email: p.notificationEmail, name: 'Équipe PMM' }],
    replyTo: { email: p.email, name: p.name },
    subject: `[Contact PMM] ${p.subject}`,
    htmlContent: buildEmailTemplate(`
      <div style="background:#c9a84c0d;border-left:3px solid #c9a84c;border-radius:4px;padding:16px 20px;margin-bottom:28px">
        <p style="color:#c9a84c;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 4px">Nouveau message de contact</p>
        <p style="color:#f5f0e8;font-size:18px;font-weight:bold;margin:0">${p.subject}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        <tr><td style="padding:10px 0;border-bottom:1px solid #ffffff0d;color:#c9a84c;font-size:11px;text-transform:uppercase;letter-spacing:2px;width:100px">De</td><td style="padding:10px 0;border-bottom:1px solid #ffffff0d;color:#f5f0e8">${p.name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #ffffff0d;color:#c9a84c;font-size:11px;text-transform:uppercase;letter-spacing:2px">Email</td><td style="padding:10px 0;border-bottom:1px solid #ffffff0d"><a href="mailto:${p.email}" style="color:#c9a84c">${p.email}</a></td></tr>
      </table>
      <p style="color:#f5f0e8aa;font-size:11px;text-transform:uppercase;letter-spacing:3px;margin:0 0 12px">Message</p>
      <div style="background:#ffffff06;border:1px solid #ffffff0d;border-radius:8px;padding:20px;color:#f5f0e8;line-height:1.8;white-space:pre-wrap">${p.message}</div>
      <p style="color:#ffffff30;font-size:11px;text-align:center;margin-top:24px">Répondez directement à cet email pour contacter ${p.name}</p>
    `, `Nouveau message de ${p.name}`),
  });

/** Réponse admin à un message de contact */
export const sendReplyToContact = (p: {
  toName: string; toEmail: string; originalSubject: string;
  replyBody: string; adminName?: string;
}) =>
  sendEmail({
    to: [{ email: p.toEmail, name: p.toName }],
    subject: `Re: ${p.originalSubject}`,
    htmlContent: buildEmailTemplate(`
      <p style="color:#f5f0e8;font-size:16px;margin:0 0 20px">Bonjour <strong style="color:#c9a84c">${p.toName}</strong>,</p>
      <div style="color:#f5f0e8cc;line-height:1.8;white-space:pre-wrap;margin-bottom:32px">${p.replyBody}</div>
      <p style="color:#f5f0e8cc;margin:0">Cordialement,<br/><strong style="color:#c9a84c">${p.adminName || "L'équipe Perfect Models Management"}</strong></p>
    `, p.replyBody.substring(0, 80)),
  });

/** Email générique / newsletter — envoi par lots pour éviter les blocages Brevo */
export const sendBulkEmail = async (p: {
  to: { email: string; name?: string }[];
  subject: string;
  bodyHtml: string;
  apiKey?: string;
  batchSize?: number;
  delayMs?: number;
  onProgress?: (sent: number, total: number) => void;
}): Promise<void> => {
  const batchSize = p.batchSize ?? 25;
  const delayMs = p.delayMs ?? 2000; // 2s entre chaque lot
  const total = p.to.length;
  let sent = 0;

  for (let i = 0; i < total; i += batchSize) {
    const batch = p.to.slice(i, i + batchSize);
    await sendEmail({
      to: batch,
      subject: p.subject,
      apiKey: p.apiKey,
      htmlContent: buildEmailTemplate(p.bodyHtml),
    });
    sent += batch.length;
    p.onProgress?.(sent, total);

    // Pause entre les lots (sauf après le dernier)
    if (i + batchSize < total) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
};

/** Template newsletter stylé */
export const buildNewsletterBody = (p: {
  headline: string;
  intro: string;
  sections: { title: string; text: string; imageUrl?: string; ctaLabel?: string; ctaUrl?: string }[];
}): string => `
  <h1 style="color:#c9a84c;font-family:Georgia,serif;font-size:28px;font-style:italic;margin:0 0 8px;line-height:1.2">${p.headline}</h1>
  <div style="width:40px;height:2px;background:#c9a84c;margin:0 0 24px"></div>
  <p style="color:#f5f0e8cc;line-height:1.8;margin:0 0 32px">${p.intro}</p>
  ${p.sections.map(s => `
    ${s.imageUrl ? `<img src="${s.imageUrl}" alt="${s.title}" style="width:100%;border-radius:8px;margin-bottom:20px;display:block"/>` : ''}
    <h2 style="color:#f5f0e8;font-family:Georgia,serif;font-size:20px;margin:0 0 12px">${s.title}</h2>
    <p style="color:#f5f0e8aa;line-height:1.8;margin:0 0 20px">${s.text}</p>
    ${s.ctaLabel && s.ctaUrl ? `
      <p style="margin:0 0 32px">
        <a href="${s.ctaUrl}" style="display:inline-block;background:#c9a84c;color:#080808;font-weight:900;font-size:11px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;padding:12px 24px;border-radius:100px">${s.ctaLabel}</a>
      </p>` : '<div style="height:24px;border-bottom:1px solid #ffffff0d;margin-bottom:24px"></div>'}
  `).join('')}
`;
