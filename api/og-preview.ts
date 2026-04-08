import type { VercelRequest, VercelResponse } from '@vercel/node';

const BASE_URL = 'https://www.perfectmodels.ga';
const SITE_NAME = 'Perfect Models Management';
const DEFAULT_IMAGE = 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg';
const DEFAULT_DESCRIPTION = "Agence de mannequins d'élite à Libreville, Gabon. Découvrez nos talents, nos événements mode et nos services professionnels.";

// Firebase config
const FIREBASE_PROJECT_ID = 'perfectmodels-4e5fa';

// Firestore REST API fetch
async function fetchFromFirestore(collection: string, docId: string, apiKey: string): Promise<ContentData | null> {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${collection}/${docId}?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.fields) return null;
    
    const f = data.fields;
    return {
      title: f.title?.stringValue || f.name?.stringValue || '',
      description: f.excerpt?.stringValue || f.description?.stringValue || f.experience?.stringValue || '',
      imageUrl: f.coverImageUrl?.stringValue || f.imageUrl?.stringValue || f.photoURL?.stringValue || DEFAULT_IMAGE,
      author: f.authorName?.stringValue || f.author?.stringValue || SITE_NAME,
      date: f.date?.stringValue || f.createdAt?.timestampValue || '',
      category: f.category?.stringValue || '',
      type: collection === 'articles' ? 'article' : collection === 'models' ? 'profile' : 'website'
    };
  } catch {
    return null;
  }
}

// Crawler User-Agent detection
const CRAWLER_AGENTS = [
  'facebookexternalhit',
  'facebot',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'slackbot',
  'discordbot',
  'googlebot',
  'bingbot',
  'applebot',
  'pinterest',
  'vkshare',
  'embedly',
  'bufferbot',
  'bitlybot',
  'iframely',
  'rogerbot',
  'whatsappbot',
  'trendsmap',
  'skypeuripreview',
  'yandexbot',
  'baiduspider',
  'duckduckbot',
];

function isCrawler(userAgent: string): boolean {
  const lower = userAgent.toLowerCase();
  return CRAWLER_AGENTS.some(bot => lower.includes(bot));
}

// ========== ARTICLES DATA ==========
const articlesData: Record<string, ContentData> = {
  "octobre-rose-le-dpistage-laccessoire-indispensable-dict-par-la-mode-1760796504871": {
    title: "Octobre Rose : Le Dépistage, l'Accessoire Indispensable Dicté par la Mode",
    description: "Cet Octobre Rose, la mode dicte une tendance qui transcende les podiums : le dépistage. Bien plus qu'un simple choix, c'est l'accessoire indispensable d'une femme consciente.",
    imageUrl: "https://i.ibb.co/RpXtWzq/1005252341.png",
    author: "Focus Model 241",
    date: "2025-10-18",
    category: "Actualités",
    type: "article"
  },
  "1": {
    title: "Dorcas Moira SAPHOU : Son ticket pour Top Models FIMA est validé",
    description: "L'heure est à la consécration pour Dorcas Moira SAPHOU : son précieux sésame pour Top Models FIMA est officiellement validé.",
    imageUrl: "https://i.ibb.co/Pzm6kdQ/559155589-797412703143073-47429732447466306-n.jpg",
    author: "Focus Model 241",
    date: "2025-10-15",
    category: "Actualités",
    type: "article"
  },
  "portrait-beitch-faro-laudace-et-llgance-signes-clofas-241-1757849750614": {
    title: "Portrait – Beitch Faro : l'audace et l'élégance signées CLOFAS 241",
    description: "Dans le paysage foisonnant de la mode gabonaise, certains noms brillent par leur originalité et leur vision.",
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEifRAwNB-vU6CpmHw1NN8uQsRRfz8jU7c887kpR3VYiVUeXtTSBNrP-GUBIwcAgN7UO-ZOLwwxpk_6z1zJj4rzulYjPJ0F1lpcd3Ebc87_RRGXbTZ1aRdu-nZ-GoDH-6sJd2Fc54Yuia6e7/s1600/beitch-faro.jpg",
    author: "Focus Model 241",
    date: "2025-09-14",
    category: "Portrait",
    type: "article"
  },
  "lclat-des-cultures-perfect-models-management-et-badu-cration-unissent-leurs-talents-1757124604640": {
    title: "L'Éclat des Cultures : PMM et BADU Création Unissent Leurs Talents",
    description: "Perfect Models Management est fier d'annoncer une collaboration exceptionnelle avec la styliste libanaise de renom, BADU Création.",
    imageUrl: "https://i.postimg.cc/rFJyp2X5/baducreations-03-09-2025-0023.jpg",
    author: "Perfect Models Management",
    date: "2025-09-03",
    category: "Événement",
    type: "article"
  },
  "aj-caramela-nr-picture-collaboration": {
    title: "AJ Caramela x NR Picture : L'Alliance Iconique",
    description: "Quand la présence magnétique du mannequin AJ Caramela rencontre l'œil expert de NR Picture, le résultat est une série photo qui transcende la mode.",
    imageUrl: "https://i.postimg.cc/k5skXhC2/NR-09474.jpg",
    author: "Focus Model 241",
    date: "2024-07-28",
    category: "Shooting",
    type: "article"
  },
  "stecya-minkoue-une-visionnaire-au-service-de-la-mode-et-de-lmancipation-des-jeunes-femmes-gabonaises-1757082956934": {
    title: "Stecya Minkoue : Une visionnaire au service de la mode gabonaise",
    description: "Dans le paysage culturel et mode du Gabon, rares sont les personnalités capables de conjuguer passion, vision et action sociale.",
    imageUrl: "https://i.ibb.co/gbmH1jX/378708855-809679301157528-686004269645432344-n.jpg",
    author: "Focus Model 241",
    date: "2025-09-05",
    category: "Interview",
    type: "article"
  },
  "axel-une-voix-et-un-pilier-de-la-mode-gabonaise-1757082628847": {
    title: "Axel, une voix et un pilier de la mode gabonaise",
    description: "Dans l'univers de la mode gabonaise, certains noms résonnent comme des symboles de passion, d'engagement et de vision.",
    imageUrl: "https://i.ibb.co/6RD7jyB/480400967-1438374950818646-5783580553424231814-n.jpg",
    author: "Focus Model 241",
    date: "2025-09-05",
    category: "Hommage",
    type: "article"
  },
  "noemi-kim-au-dela-du-podium": {
    title: "Noemi Kim : Au-delà du podium",
    description: "Plongez dans le parcours inspirant de notre mannequin phare, entre discipline, ambition et passion pour l'art.",
    imageUrl: "https://i.ibb.co/JWP8Dvk/1004673860.jpg",
    author: "Focus Model 241",
    date: "2024-07-15",
    category: "Interview",
    type: "article"
  },
  "retour-sur-le-perfect-fashion-day": {
    title: "Retour sur le Perfect Fashion Day",
    description: "Les moments forts, les coulisses et les plus belles créations de l'événement qui a marqué les esprits.",
    imageUrl: "https://i.ibb.co/C5rcPJH/titostyle-53.jpg",
    author: "La Rédaction",
    date: "2025-02-10",
    category: "Événement",
    type: "article"
  }
};

// ========== MODELS DATA ==========
const modelsData: Record<string, ContentData> = {
  "noemi-kim": {
    title: "Noemi Kim",
    description: "Mannequin vedette de l'agence, Noemi a défilé pour les plus grands créateurs gabonais et a été le visage de plusieurs campagnes nationales. Son professionnalisme et sa démarche captivante en font une référence.",
    imageUrl: "https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg",
    category: "Pro",
    type: "profile"
  },
  "aj-caramela": {
    title: "AJ Caramela",
    description: "Avec son regard perçant et sa polyvalence, AJ excelle dans les shootings éditoriaux et les campagnes publicitaires. Elle a collaboré avec de nombreuses marques locales et photographes de renom.",
    imageUrl: "https://i.postimg.cc/k5skXhC2/NR-09474.jpg",
    category: "Pro",
    type: "profile"
  },
  "yann-aubin": {
    title: "Yann Aubin",
    description: "Spécialiste du prêt-à-porter masculin, Yann est reconnu pour sa démarche puissante et son élégance naturelle. Il est un choix privilégié pour les défilés de créateurs de costumes.",
    imageUrl: "https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg",
    category: "Pro",
    type: "profile"
  }
};

// ========== SERVICES DATA ==========
const servicesData: Record<string, ContentData> = {
  "casting-mannequins": {
    title: "Casting Mannequins",
    description: "Organisation de castings professionnels pour défilés, shootings, publicités et clips. Sélection rigoureuse de mannequins adaptés à votre projet.",
    imageUrl: DEFAULT_IMAGE,
    category: "Services Mannequinat",
    type: "service"
  },
  "booking-mannequins": {
    title: "Booking Mannequins",
    description: "Réservation de mannequins pour événements, shootings ou campagnes publicitaires. Mannequins professionnels pour tous types de projets.",
    imageUrl: DEFAULT_IMAGE,
    category: "Services Mannequinat",
    type: "service"
  },
  "mannequins-pour-defiles": {
    title: "Mannequins pour Défilés",
    description: "Des mannequins professionnels pour vos défilés, avec coaching sur la posture et la démarche. Présentation élégante et harmonieuse de vos créations.",
    imageUrl: DEFAULT_IMAGE,
    category: "Services Mannequinat",
    type: "service"
  },
  "formation-mannequins": {
    title: "Formation Mannequins",
    description: "Coaching complet pour mannequins : posture, démarche, expressions et présence scénique. Optimisation de la performance en casting ou sur podium.",
    imageUrl: DEFAULT_IMAGE,
    category: "Services Mannequinat",
    type: "service"
  },
  "conseil-image-style": {
    title: "Conseil en Image et Style",
    description: "Accompagnement pour look, coiffure, maquillage et style vestimentaire. Image cohérente et professionnelle adaptée à votre projet.",
    imageUrl: DEFAULT_IMAGE,
    category: "Services Mannequinat",
    type: "service"
  },
  "creation-tenues-sur-mesure": {
    title: "Création de Tenues Sur-Mesure",
    description: "Tenues sur-mesure pour femmes, hommes et enfants. Couture à la main avec des tissus haut de gamme pour des designs uniques.",
    imageUrl: DEFAULT_IMAGE,
    category: "Services Mode",
    type: "service"
  }
};

// ========== STATIC PAGES DATA ==========
const staticPagesData: Record<string, ContentData> = {
  "": {
    title: "Accueil",
    description: "Bienvenue chez Perfect Models Management - Agence de mannequins d'élite à Libreville, Gabon.",
    imageUrl: DEFAULT_IMAGE,
    type: "website"
  },
  "agence": {
    title: "L'Agence",
    description: "Découvrez Perfect Models Management, berceau de talents et acteur clé de la mode en Afrique Centrale depuis 2021.",
    imageUrl: "https://i.ibb.co/3WfK9Xg/about-img.jpg",
    type: "website"
  },
  "mannequins": {
    title: "Nos Mannequins",
    description: "Découvrez nos talents - Des mannequins professionnels pour vos défilés, shootings et campagnes publicitaires au Gabon.",
    imageUrl: DEFAULT_IMAGE,
    type: "website"
  },
  "magazine": {
    title: "Magazine",
    description: "Actualités, interviews et tendances mode au Gabon. Découvrez les coulisses de la mode gabonaise.",
    imageUrl: "https://i.ibb.co/C5rcPJH/titostyle-53.jpg",
    type: "website"
  },
  "services": {
    title: "Nos Services",
    description: "Découvrez l'ensemble des services conçus pour répondre aux besoins des créateurs, marques et particuliers.",
    imageUrl: "https://i.ibb.co/3WfK9Xg/about-img.jpg",
    type: "website"
  },
  "fashion-day": {
    title: "Perfect Fashion Day",
    description: "Le rendez-vous incontournable de la mode gabonaise. Découvrez notre événement phare qui célèbre la créativité et l'élégance.",
    imageUrl: "https://i.ibb.co/C5rcPJH/titostyle-53.jpg",
    type: "website"
  },
  "casting": {
    title: "Casting",
    description: "Participez à nos castings et devenez le prochain visage de la mode gabonaise. Rejoignez Perfect Models Management.",
    imageUrl: "https://i.ibb.co/z5TzL2M/casting-bg.jpg",
    type: "website"
  },
  "contact": {
    title: "Contact",
    description: "Contactez Perfect Models Management pour vos projets mode, réservations de mannequins et collaborations.",
    imageUrl: DEFAULT_IMAGE,
    type: "website"
  },
  "galerie": {
    title: "Galerie",
    description: "Découvrez nos shootings, défilés et moments forts à travers notre galerie photo.",
    imageUrl: DEFAULT_IMAGE,
    type: "website"
  },
  "miss-one-light": {
    title: "Miss One Light",
    description: "Concours Miss One Light by PMM - Découvrez nos candidates et suivez l'événement.",
    imageUrl: DEFAULT_IMAGE,
    type: "website"
  }
};

// Content data interface
interface ContentData {
  title: string;
  description: string;
  imageUrl: string;
  author?: string;
  date?: string;
  category?: string;
  type: 'article' | 'profile' | 'service' | 'website';
}

// Content result interface
interface ContentResult {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'article' | 'profile' | 'service' | 'website';
  author?: string;
  date?: string;
  category?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { slug, id, type, path } = req.query;
  const contentSlug = typeof slug === 'string' ? slug : typeof id === 'string' ? id : null;
  const contentType = typeof type === 'string' ? type : null;
  const pagePath = typeof path === 'string' ? path : null;

  // Determine content and final URL (async with Firestore fetch)
  const content = await getContent(contentSlug, contentType, pagePath, req.url);

  // Check if request is from a crawler
  const userAgent = req.headers['user-agent'] || '';
  
  // Real users → redirect to root to serve the SPA (avoid redirect loops)
  // The SPA's client-side router will handle the URL client-side
  if (!isCrawler(userAgent)) {
    res.setHeader('Location', '/');
    return res.status(302).send('Redirecting to SPA...');
  }

  // Crawlers → return OG HTML with meta tags
  const html = generateOgHtml(content);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).send(html);
}

async function getContent(slug: string | null, type: string | null, path: string | null, url: string | undefined): Promise<ContentResult> {
  let content: ContentData | null = null;
  let contentPath = '';
  const apiKey = process.env.VITE_FIREBASE_API_KEY || '';

  // Try to determine content from URL if no explicit params
  if (!slug && !type && url) {
    const urlMatch = url.match(/\/(magazine|mannequins|services)\/([^?&/]+)/);
    if (urlMatch) {
      type = urlMatch[1];
      slug = urlMatch[2];
    } else if (url.includes('/agence')) {
      path = 'agence';
    } else if (url.includes('/fashion-day')) {
      path = 'fashion-day';
    } else if (url.includes('/casting')) {
      path = 'casting';
    } else if (url.includes('/contact')) {
      path = 'contact';
    } else if (url.includes('/galerie')) {
      path = 'galerie';
    } else if (url.includes('/miss-one-light')) {
      path = 'miss-one-light';
    } else if (url.includes('/magazine')) {
      path = 'magazine';
    } else if (url.includes('/mannequins')) {
      path = 'mannequins';
    } else if (url.includes('/services')) {
      path = 'services';
    }
  }

  // Try Firestore first for dynamic content, then fallback to embedded data
  if (type === 'magazine' && slug && apiKey) {
    content = await fetchFromFirestore('articles', slug, apiKey);
    if (!content) content = articlesData[slug] || null;
    contentPath = `/magazine/${slug}`;
  } else if (type === 'mannequins' && slug && apiKey) {
    content = await fetchFromFirestore('models', slug, apiKey);
    if (!content) content = modelsData[slug] || null;
    contentPath = `/mannequins/${slug}`;
  } else if (type === 'services' && slug) {
    content = servicesData[slug] || null;
    contentPath = `/services/${slug}`;
  } else if (path && staticPagesData[path]) {
    content = staticPagesData[path];
    contentPath = path === '' ? '/' : `/${path}`;
  }

  // Fallback: try to find in all embedded data sources by slug
  if (!content && slug) {
    if (articlesData[slug]) {
      content = articlesData[slug];
      contentPath = `/magazine/${slug}`;
    } else if (modelsData[slug]) {
      content = modelsData[slug];
      contentPath = `/mannequins/${slug}`;
    } else if (servicesData[slug]) {
      content = servicesData[slug];
      contentPath = `/services/${slug}`;
    }
  }

  // Default fallback
  if (!content) {
    content = {
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      imageUrl: DEFAULT_IMAGE,
      type: 'website'
    };
    contentPath = path ? `/${path}` : '/';
  }

  return {
    title: content.title,
    description: content.description,
    image: content.imageUrl,
    url: `${BASE_URL}${contentPath}`,
    type: content.type,
    author: content.author,
    date: content.date,
    category: content.category
  };
}

function generateOgHtml(content: ContentResult): string {
  const fullTitle = `${content.title} | ${SITE_NAME}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(content.description)}"/>
  <meta name="keywords" content="agence mannequin Libreville, mannequin Gabon, Perfect Models Management, PMM, casting mannequin Gabon, défilé mode Libreville, mode gabonaise"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${content.type}">
  <meta property="og:url" content="${content.url}">
  <meta property="og:title" content="${escapeHtml(content.title)}">
  <meta property="og:description" content="${escapeHtml(content.description)}">
  <meta property="og:image" content="${content.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:locale" content="fr_GA">
  ${content.category ? `<meta property="og:section" content="${escapeHtml(content.category)}">` : ''}
  ${content.type === 'article' && content.author ? `<meta property="article:author" content="${escapeHtml(content.author)}">` : ''}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(content.title)}">
  <meta name="twitter:description" content="${escapeHtml(content.description)}">
  <meta name="twitter:image" content="${content.image}">

  <!-- Canonical URL -->
  <link rel="canonical" href="${content.url}">
</head>
<body>
  <h1>${escapeHtml(content.title)}</h1>
  <p>${escapeHtml(content.description)}</p>
  <a href="${content.url}">Voir sur ${SITE_NAME}</a>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
