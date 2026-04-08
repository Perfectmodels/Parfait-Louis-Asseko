import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.perfectmodels.ga';
const FIREBASE_PROJECT_ID = 'perfectmodels-4e5fa';

// Static routes with their priority and change frequency
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/agence', priority: '0.8', changefreq: 'weekly' },
  { path: '/mannequins', priority: '0.9', changefreq: 'daily' },
  { path: '/magazine', priority: '0.9', changefreq: 'daily' },
  { path: '/services', priority: '0.8', changefreq: 'weekly' },
  { path: '/fashion-day', priority: '0.8', changefreq: 'weekly' },
  { path: '/casting', priority: '0.7', changefreq: 'weekly' },
  { path: '/galerie', priority: '0.6', changefreq: 'weekly' },
  { path: '/miss-one-light', priority: '0.7', changefreq: 'weekly' },
  { path: '/contact', priority: '0.5', changefreq: 'monthly' },
];

// Embedded article slugs (fallback if Firestore fails)
const articleSlugs = [
  'octobre-rose-le-dpistage-laccessoire-indispensable-dict-par-la-mode-1760796504871',
  '1',
  'portrait-beitch-faro-laudace-et-llgance-signes-clofas-241-1757849750614',
  'lclat-des-cultures-perfect-models-management-et-badu-cration-unissent-leurs-talents-1757124604640',
  'aj-caramela-nr-picture-collaboration',
  'stecya-minkoue-une-visionnaire-au-service-de-la-mode-et-de-lmancipation-des-jeunes-femmes-gabonaises-1757082956934',
  'axel-une-voix-et-un-pilier-de-la-mode-gabonaise-1757082628847',
  'noemi-kim-au-dela-du-podium',
  'retour-sur-le-perfect-fashion-day',
];

// Embedded model IDs (fallback if Firestore fails)
const modelIds = ['noemi-kim', 'aj-caramela', 'yann-aubin'];

// Embedded service slugs
const serviceSlugs = [
  'casting-mannequins',
  'booking-mannequins',
  'mannequins-pour-defiles',
  'mannequins-publicite-audiovisuel',
  'mannequins-photo',
  'mannequins-figurants',
  'formation-mannequins',
  'conseil-image-style',
  'creation-tenues-sur-mesure',
];

// Fetch all document IDs from a Firestore collection
async function fetchCollectionIds(collection: string, apiKey: string): Promise<string[]> {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}?key=${apiKey}&pageSize=100`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    
    if (!data.documents) return [];
    
    return data.documents
      .map((doc: any) => {
        // Extract ID from the full resource path
        const name = doc.name || '';
        const parts = name.split('/');
        return parts[parts.length - 1];
      })
      .filter((id: string) => id);
  } catch {
    return [];
  }
}

// Generate sitemap XML
function generateSitemap(
  articleIds: string[],
  modelIdsList: string[],
  serviceIds: string[]
): string {
  const today = new Date().toISOString().split('T')[0];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Static routes
  for (const route of staticRoutes) {
    xml += `  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
  }

  // Magazine articles
  for (const slug of articleIds) {
    xml += `  <url>
    <loc>${BASE_URL}/magazine/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }

  // Models
  for (const id of modelIdsList) {
    xml += `  <url>
    <loc>${BASE_URL}/mannequins/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }

  // Services
  for (const slug of serviceIds) {
    xml += `  <url>
    <loc>${BASE_URL}/services/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  }

  xml += '</urlset>';
  return xml;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.VITE_FIREBASE_API_KEY || '';

  // Try to fetch from Firestore first, fallback to embedded data
  let articles: string[] = [];
  let models: string[] = [];

  if (apiKey) {
    // Fetch from Firestore in parallel
    const [firestoreArticles, firestoreModels] = await Promise.all([
      fetchCollectionIds('articles', apiKey),
      fetchCollectionIds('models', apiKey),
    ]);
    
    articles = firestoreArticles.length > 0 ? firestoreArticles : articleSlugs;
    models = firestoreModels.length > 0 ? firestoreModels : modelIds;
  } else {
    // Use embedded data if no API key
    articles = articleSlugs;
    models = modelIds;
  }

  // Services are always from embedded data (no Firestore collection)
  const services = serviceSlugs;

  // Generate sitemap
  const sitemap = generateSitemap(articles, models, services);

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200');
  return res.status(200).send(sitemap);
}
