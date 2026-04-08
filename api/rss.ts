import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.perfectmodels.ga';
const SITE_NAME = 'Perfect Models Management';
const SITE_DESCRIPTION = 'Actualités, interviews et tendances mode au Gabon. Découvrez les coulisses de la mode gabonaise avec Perfect Models Management.';

const FIREBASE_PROJECT_ID = 'perfectmodels-4e5fa';

// Embedded articles for fallback
const articlesData = [
  {
    slug: 'octobre-rose-le-dpistage-laccessoire-indispensable-dict-par-la-mode-1760796504871',
    title: "Octobre Rose : Le Dépistage, l'Accessoire Indispensable Dicté par la Mode",
    excerpt: "Cet Octobre Rose, la mode dicte une tendance qui transcende les podiums : le dépistage.",
    imageUrl: 'https://i.ibb.co/RpXtWzq/1005252341.png',
    author: 'Focus Model 241',
    date: '2025-10-18',
    category: 'Actualités'
  },
  {
    slug: '1',
    title: 'Dorcas Moira SAPHOU : Son ticket pour Top Models FIMA est validé',
    excerpt: "L'heure est à la consécration pour Dorcas Moira SAPHOU.",
    imageUrl: 'https://i.ibb.co/Pzm6kdQ/559155589-797412703143073-47429732447466306-n.jpg',
    author: 'Focus Model 241',
    date: '2025-10-15',
    category: 'Actualités'
  },
  {
    slug: 'portrait-beitch-faro-laudace-et-llgance-signes-clofas-241-1757849750614',
    title: 'Portrait – Beitch Faro : l\'audace et l\'élégance signées CLOFAS 241',
    excerpt: 'Dans le paysage foisonnant de la mode gabonaise...',
    imageUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifRAwNB-vU6CpmHw1NN8uQsRRfz8jU7c887kpR3VYiVUeXtTSBNrP-GUBIwcAgN7UO-ZOLwwxpk_6z1zJj4rzulYjPJ0F1lpcd3Ebc87_RRGXbTZ1aRdu-nZ-GoDH-6sJd2Fc54Yuia6e7/s1600/beitch-faro.jpg',
    author: 'Focus Model 241',
    date: '2025-09-14',
    category: 'Portrait'
  },
  {
    slug: 'aj-caramela-nr-picture-collaboration',
    title: 'AJ Caramela x NR Picture : L\'Alliance Iconique',
    excerpt: 'Quand la présence magnétique du mannequin AJ Caramela rencontre l\'œil expert...',
    imageUrl: 'https://i.postimg.cc/k5skXhC2/NR-09474.jpg',
    author: 'Focus Model 241',
    date: '2024-07-28',
    category: 'Shooting'
  }
];

async function fetchArticlesFromFirestore(apiKey: string) {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/articles?key=${apiKey}&pageSize=20&orderBy=createdAt%20desc`;
  
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
        slug: id,
        title: f.title?.stringValue || '',
        excerpt: f.excerpt?.stringValue || '',
        imageUrl: f.coverImageUrl?.stringValue || '',
        author: f.authorName?.stringValue || 'Perfect Models',
        date: f.createdAt?.timestampValue || f.date?.stringValue || new Date().toISOString(),
        category: f.category?.stringValue || 'Actualités'
      };
    });
  } catch {
    return null;
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatRssDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

function generateRss(articles: typeof articlesData): string {
  const now = new Date().toUTCString();
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:media="http://search.yahoo.com/mrss/"
  xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(SITE_NAME)} - Magazine</title>
  <link>${BASE_URL}/magazine</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
  <language>fr</language>
  <lastBuildDate>${now}</lastBuildDate>
  <pubDate>${now}</pubDate>
  <generator>Vercel Serverless Function</generator>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
  <image>
    <url>${BASE_URL}/logo.svg</url>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${BASE_URL}</link>
  </image>
`;

  for (const article of articles) {
    const articleUrl = `${BASE_URL}/magazine/${article.slug}`;
    const pubDate = formatRssDate(article.date);
    
    xml += `  <item>
    <title>${escapeXml(article.title)}</title>
    <link>${articleUrl}</link>
    <guid isPermaLink="true">${articleUrl}</guid>
    <pubDate>${pubDate}</pubDate>
    <dc:creator>${escapeXml(article.author)}</dc:creator>
    <category>${escapeXml(article.category)}</category>
    <description>${escapeXml(article.excerpt)}</description>
    <content:encoded><![CDATA[
      <img src="${article.imageUrl}" alt="${article.title}" />
      <p>${article.excerpt}</p>
      <p><a href="${articleUrl}">Lire l'article complet</a></p>
    ]]></content:encoded>
    <media:content url="${article.imageUrl}" type="image/jpeg" medium="image">
      <media:title>${escapeXml(article.title)}</media:title>
      <media:thumbnail url="${article.imageUrl}"/>
    </media:content>
  </item>
`;
  }

  xml += `</channel>
</rss>`;
  return xml;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.VITE_FIREBASE_API_KEY || '';
  
  // Try Firestore first, fallback to embedded
  let articles = articlesData;
  if (apiKey) {
    const firestoreArticles = await fetchArticlesFromFirestore(apiKey);
    if (firestoreArticles && firestoreArticles.length > 0) {
      articles = firestoreArticles;
    }
  }

  const rss = generateRss(articles);

  res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
  return res.status(200).send(rss);
}
