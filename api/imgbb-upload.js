export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.IMGBB_API_KEY;
    const UPLOAD_URL = process.env.IMGBB_UPLOAD_URL || 'https://api.imgbb.com/1/upload';

    if (!API_KEY) {
      res.status(400).json({ error: 'Missing IMGBB_API_KEY' });
      return;
    }

    const url = `${UPLOAD_URL}?key=${encodeURIComponent(API_KEY)}`;
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
      },
      body: req,
      // Required when streaming a request body in Node/Undici
      duplex: 'half',
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
    res.status(500).json({ error: 'imgbb proxy error', details: String(err) });
  }
}
