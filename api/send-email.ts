import sgMail from '@sendgrid/mail';

// Ensure the API key is provided via environment variable
const SENDGRID_API_KEY = (globalThis as any).process?.env?.SENDGRID_API_KEY as string | undefined;

// Using `any` types here to avoid requiring '@vercel/node' types locally
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SENDGRID_API_KEY) {
    const nodeEnv = (globalThis as any).process?.env?.NODE_ENV;
    if (nodeEnv !== 'production') {
      // Dev fallback: simulate success so the feature remains usable locally
      console.warn('SENDGRID_API_KEY missing. Mocking email send in development.');
      return res.status(200).json({ ok: true, mock: true });
    }
    return res.status(500).json({ error: 'SENDGRID_API_KEY not configured' });
  }

  const { to, subject, html, from, attachments } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);

    const sender = from || (globalThis as any).process?.env?.SENDGRID_FROM || 'contact@perfectmodels.ga';

    await sgMail.send({
      to,
      from: sender,
      subject,
      html,
      attachments: Array.isArray(attachments)
        ? attachments.map((a: any) => ({ filename: a.filename, type: a.type, content: a.content, disposition: 'attachment' }))
        : undefined,
    });

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('SendGrid error:', error?.response?.body || error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
