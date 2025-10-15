// Serverless function to send emails via Resend
// Expects JSON body: { to: string[]; subject: string; html: string; attachments?: { filename: string; url?: string; contentBase64?: string; contentType?: string }[] }

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY || process.env.RESEND_TOKEN || process.env.RESEND;
    if (!RESEND_API_KEY) {
      return res.status(400).json({ error: 'Missing RESEND_API_KEY env' });
    }

    const { to, subject, html, attachments = [], from } = req.body || {};
    if (!Array.isArray(to) || to.length === 0) {
      return res.status(400).json({ error: 'Missing recipients' });
    }
    if (!subject || !html) {
      return res.status(400).json({ error: 'Missing subject or html' });
    }

    // Prepare attachments: support URLs or base64 content
    const preparedAttachments = [];
    for (const att of attachments) {
      if (!att) continue;
      const filename = att.filename || 'attachment';
      const contentType = att.contentType || 'application/octet-stream';
      if (att.contentBase64) {
        preparedAttachments.push({ filename, content: att.contentBase64, contentType });
        continue;
      }
      if (att.url) {
        try {
          const resp = await fetch(att.url);
          if (!resp.ok) throw new Error(`fetch ${att.url} -> ${resp.status}`);
          const arrayBuf = await resp.arrayBuffer();
          const base64 = Buffer.from(arrayBuf).toString('base64');
          preparedAttachments.push({ filename, content: base64, contentType });
        } catch (e) {
          // Skip failing attachment but continue sending email
          console.warn('Attachment fetch failed:', att.url, e?.message);
        }
      }
    }

    // Use Resend API directly via fetch
    const fromAddress = from || process.env.DEFAULT_FROM_EMAIL || 'PMM Admin <no-reply@perfectmodels.ga>';
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to,
        subject,
        html,
        attachments: preparedAttachments,
      }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Resend error', details: data });
    }
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'send-email error', details: String(err) });
  }
}
