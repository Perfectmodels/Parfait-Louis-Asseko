export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.STORACHA_API_KEY;
    const UPLOAD_URL = process.env.STORACHA_UPLOAD_URL || 'https://api.storacha.com/v1/upload';

    if (!API_KEY) {
      res.status(400).json({ error: 'Missing STORACHA_API_KEY' });
      return;
    }

    const upstream = await fetch(UPLOAD_URL, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: req,
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      res.status(upstream.status).send(text);
      return;
    }

    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Storacha proxy error', details: String(err) });
  }
}
