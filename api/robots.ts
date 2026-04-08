import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.perfectmodels.ga';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const robotsTxt = `User-agent: *
Allow: /

# Sitemap location
Sitemap: ${BASE_URL}/sitemap.xml

# Crawl rate limiting
Crawl-delay: 1

# Disallow private/admin routes (if any)
Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /register
Disallow: /api/

# Googlebot specific
User-agent: Googlebot
Allow: /

# Bingbot specific  
User-agent: Bingbot
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.status(200).send(robotsTxt);
}
