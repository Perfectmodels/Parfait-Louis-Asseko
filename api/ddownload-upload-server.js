export default async function handler(req, res) {
  try {
    const API_BASE = process.env.DDOWNLOAD_API_BASE || 'https://api-v2.ddownload.com';
    const API_KEY = process.env.DDOWNLOAD_API_KEY;

    if (!API_KEY) {
      res.status(400).json({ error: 'Missing DDOWNLOAD_API_KEY' });
      return;
    }

    const resp = await fetch(`${API_BASE}/api/upload/server?key=${encodeURIComponent(API_KEY)}`);
    if (!resp.ok) {
      const text = await resp.text();
      res.status(resp.status).json({ error: 'Failed to get upload server', details: text });
      return;
    }
    const data = await resp.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal error', details: String(err) });
  }
}
