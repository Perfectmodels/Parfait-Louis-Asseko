// Serverless function to generate Open Graph/Twitter preview HTML for any URL
// Usage: /api/share?title=...&description=...&image=...&url=...&type=article|website

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    const { title = 'Perfect Models Management', description = '', image = '', url = '', type = 'website' } = req.query || {};

    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const protocol = (req.headers['x-forwarded-proto'] || 'https');
    const origin = `${protocol}://${host}`;

    const absolutize = (u) => {
      if (!u) return '';
      try {
        if (u.startsWith('http://') || u.startsWith('https://')) return u;
        return new URL(u, origin).toString();
      } catch {
        return '';
      }
    };

    const safeTitle = String(title).slice(0, 140);
    const safeDesc = String(description).slice(0, 300);
    const safeImage = absolutize(String(image));
    const targetUrl = absolutize(String(url)) || origin;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="robots" content="noindex, nofollow"/>
  <title>${safeTitle}</title>
  <link rel="canonical" href="${targetUrl}" />

  <!-- Open Graph -->
  <meta property="og:site_name" content="Perfect Models Management"/>
  <meta property="og:title" content="${safeTitle}"/>
  <meta property="og:description" content="${safeDesc}"/>
  <meta property="og:image" content="${safeImage}"/>
  <meta property="og:type" content="${type === 'article' ? 'article' : 'website'}"/>
  <meta property="og:url" content="${targetUrl}"/>

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${safeTitle}"/>
  <meta name="twitter:description" content="${safeDesc}"/>
  <meta name="twitter:image" content="${safeImage}"/>

  <meta http-equiv="refresh" content="0; url=${targetUrl}"/>
  <style>body{background:#0b0b0b;color:#f6f6f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:24px}a{color:#D4AF37}</style>
</head>
<body>
  <p>Redirection vers <a href="${targetUrl}">${targetUrl}</a>…</p>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch (e) {
    return res.status(500).json({ error: 'share-error', details: String(e) });
  }
}
