import type { VercelRequest, VercelResponse } from '@vercel/node';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER = { name: 'Perfect Models Management', email: 'contact@perfectmodels.ga' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Brevo API key not configured on server.' });
  }

  const { to, subject, htmlContent, replyTo } = req.body as {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
    replyTo?: { email: string; name?: string };
  };

  if (!to?.length || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, htmlContent' });
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: SENDER,
        to,
        subject,
        htmlContent,
        ...(replyTo ? { replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.message || `Brevo error ${response.status}` });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
