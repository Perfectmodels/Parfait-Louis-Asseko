// Serverless function to send emails via Brevo (Sendinblue)
// Expects JSON body: { to: string[]; subject: string; html: string; attachments?: { filename: string; url?: string; contentBase64?: string; contentType?: string }[] }

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.BREVO;
    if (!BREVO_API_KEY) {
      return res.status(400).json({ error: 'Missing BREVO_API_KEY env' });
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
      if (att.contentBase64) {
        preparedAttachments.push({ name: filename, content: att.contentBase64 });
        continue;
      }
      if (att.url) {
        try {
          const resp = await fetch(att.url);
          if (!resp.ok) throw new Error(`fetch ${att.url} -> ${resp.status}`);
          const arrayBuf = await resp.arrayBuffer();
          const base64 = Buffer.from(arrayBuf).toString('base64');
          preparedAttachments.push({ name: filename, content: base64 });
        } catch (e) {
          // Skip failing attachment but continue sending email
          console.warn('Attachment fetch failed:', att.url, e?.message);
        }
      }
    }

    // Use Brevo API
    const defaultFromEmail = process.env.DEFAULT_FROM_EMAIL || 'no-reply@perfectmodels.ga';
    const defaultFromName = process.env.DEFAULT_FROM_NAME || 'PMM Admin';
    let fromEmail = defaultFromEmail;
    let fromName = defaultFromName;
    if (from && typeof from === 'string') {
      const m = from.match(/^(.*)<([^>]+)>$/);
      if (m) {
        fromName = m[1].trim() || defaultFromName;
        fromEmail = m[2].trim() || defaultFromEmail;
      } else if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(from)) {
        fromEmail = from;
      } else {
        fromName = from;
      }
    }

    const brevoPayload = {
      sender: { email: fromEmail, name: fromName },
      to: (to || []).map((email) => ({ email })),
      subject,
      htmlContent: html,
      attachment: preparedAttachments.length > 0 ? preparedAttachments : undefined,
    };

    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brevoPayload),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'Brevo error', details: data });
    }
    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'send-email error', details: String(err) });
  }
}
