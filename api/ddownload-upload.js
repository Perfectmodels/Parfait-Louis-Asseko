export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const API_BASE = process.env.DDOWNLOAD_API_BASE || 'https://api-v2.ddownload.com';
    const API_KEY = process.env.DDOWNLOAD_API_KEY;
    if (!API_KEY) {
      res.status(400).json({ error: 'Missing DDOWNLOAD_API_KEY' });
      return;
    }

    // Step 1: get upload server
    const serverResp = await fetch(`${API_BASE}/api/upload/server?key=${encodeURIComponent(API_KEY)}`);
    const serverJson = await serverResp.json();
    if (!serverResp.ok || !serverJson || !serverJson.result) {
      res.status(502).json({ error: 'Failed to fetch upload server', details: serverJson });
      return;
    }

    const uploadUrl = serverJson.result;

    // Step 2: stream the multipart body directly to ddownload
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    const upstream = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body: req,
    });

    const text = await upstream.text();
    if (!upstream.ok) {
      res.status(upstream.status).send(text);
      return;
    }

    // ddownload returns JSON-like but sometimes text; try parse
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = { raw: text }; }
    res.status(200).json(parsed);
  } catch (err) {
    res.status(500).json({ error: 'Upload proxy error', details: String(err) });
  }
}
