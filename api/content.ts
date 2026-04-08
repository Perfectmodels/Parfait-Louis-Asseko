import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.perfectmodels.ga';
const FIREBASE_PROJECT_ID = 'perfectmodels-4e5fa';

// Embedded data for fallback
const embeddedData = {
  articles: [
    { slug: 'octobre-rose-le-dpistage-laccessoire-indispensable-dict-par-la-mode-1760796504871', title: "Octobre Rose", type: 'article', date: '2025-10-18' },
    { slug: '1', title: 'Dorcas Moira SAPHOU', type: 'article', date: '2025-10-15' },
    { slug: 'portrait-beitch-faro-laudace-et-llgance-signes-clofas-241-1757849750614', title: 'Beitch Faro', type: 'article', date: '2025-09-14' },
    { slug: 'aj-caramela-nr-picture-collaboration', title: 'AJ Caramela x NR Picture', type: 'article', date: '2024-07-28' },
  ],
  models: [
    { id: 'noemi-kim', name: 'Noemi Kim', type: 'model', level: 'Pro' },
    { id: 'aj-caramela', name: 'AJ Caramela', type: 'model', level: 'Pro' },
    { id: 'yann-aubin', name: 'Yann Aubin', type: 'model', level: 'Pro' },
  ],
  services: [
    { slug: 'casting-mannequins', title: 'Casting Mannequins', category: 'Mannequinat' },
    { slug: 'booking-mannequins', title: 'Booking Mannequins', category: 'Mannequinat' },
    { slug: 'formation-mannequins', title: 'Formation', category: 'Mannequinat' },
  ],
  pages: [
    { path: '/', title: 'Accueil' },
    { path: '/agence', title: 'L\'Agence' },
    { path: '/mannequins', title: 'Mannequins' },
    { path: '/magazine', title: 'Magazine' },
    { path: '/services', title: 'Services' },
    { path: '/fashion-day', title: 'Fashion Day' },
  ]
};

async function fetchFromFirestore(collection: string, apiKey: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}?key=${apiKey}&pageSize=100`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    
    if (!data.documents) return null;
    
    return data.documents.map((doc: any) => {
      const f = doc.fields || {};
      const name = doc.name || '';
      const parts = name.split('/');
      const id = parts[parts.length - 1];
      
      return {
        id,
        slug: id,
        title: f.title?.stringValue || f.name?.stringValue || id,
        excerpt: f.excerpt?.stringValue || f.description?.stringValue || '',
        imageUrl: f.coverImageUrl?.stringValue || f.imageUrl?.stringValue || '',
        author: f.authorName?.stringValue || '',
        date: f.createdAt?.timestampValue || f.date?.stringValue || '',
        category: f.category?.stringValue || '',
        type: collection === 'articles' ? 'article' : collection === 'models' ? 'model' : 'content'
      };
    });
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { type, q, limit = '50' } = req.query;
  const apiKey = process.env.VITE_FIREBASE_API_KEY || '';
  const maxResults = parseInt(String(limit), 10) || 50;

  let articles = embeddedData.articles;
  let models = embeddedData.models;
  let services = embeddedData.services;

  // Fetch from Firestore if API key available
  if (apiKey) {
    const [firestoreArticles, firestoreModels] = await Promise.all([
      fetchFromFirestore('articles', apiKey),
      fetchFromFirestore('models', apiKey),
    ]);
    
    if (firestoreArticles) articles = firestoreArticles;
    if (firestoreModels) models = firestoreModels;
  }

  // Build response
  let response: any = {
    meta: {
      site: BASE_URL,
      generatedAt: new Date().toISOString(),
      total: 0
    },
    content: {
      articles: articles.map(a => ({ ...a, url: `${BASE_URL}/magazine/${a.slug}` })),
      models: models.map(m => ({ ...m, url: `${BASE_URL}/mannequins/${m.id}` })),
      services: services.map(s => ({ ...s, url: `${BASE_URL}/services/${s.slug}` })),
      pages: embeddedData.pages.map(p => ({ ...p, url: `${BASE_URL}${p.path}` }))
    }
  };

  // Filter by type if specified
  if (type && typeof type === 'string') {
    const validTypes = ['articles', 'models', 'services', 'pages'];
    if (validTypes.includes(type)) {
      response.content = { [type]: response.content[type as keyof typeof response.content] };
    }
  }

  // Search filter if query provided
  if (q && typeof q === 'string') {
    const searchTerm = q.toLowerCase();
    response.content.articles = response.content.articles?.filter((a: any) => 
      a.title?.toLowerCase().includes(searchTerm) || 
      a.excerpt?.toLowerCase().includes(searchTerm)
    ) || [];
    response.content.models = response.content.models?.filter((m: any) => 
      m.name?.toLowerCase().includes(searchTerm) || 
      m.title?.toLowerCase().includes(searchTerm)
    ) || [];
    response.content.services = response.content.services?.filter((s: any) => 
      s.title?.toLowerCase().includes(searchTerm)
    ) || [];
  }

  // Apply limit per category
  response.content.articles = response.content.articles?.slice(0, maxResults);
  response.content.models = response.content.models?.slice(0, maxResults);
  response.content.services = response.content.services?.slice(0, maxResults);

  // Calculate total
  response.meta.total = Object.values(response.content).flat().length;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');
  return res.status(200).json(response);
}
