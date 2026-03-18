import React from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  noIndex?: boolean;
}

const SITE_NAME = 'Perfect Models Management';
const BASE_URL = 'https://www.perfectmodels.ga';
const DEFAULT_IMAGE = 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg';
const DEFAULT_DESCRIPTION =
  "Agence de mannequins d'élite à Libreville, Gabon. Découvrez nos talents, nos événements mode et nos services professionnels.";
const DEFAULT_KEYWORDS =
  'agence mannequin Libreville, mannequin Gabon, Perfect Models Management, PMM, casting mannequin Gabon, défilé mode Libreville, Perfect Fashion Day, agence mode Afrique Centrale';

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${BASE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: 'PMM',
  description: DEFAULT_DESCRIPTION,
  url: BASE_URL,
  logo: 'https://i.ibb.co/fVBxPNTP/T-shirt.png',
  image: DEFAULT_IMAGE,
  telephone: '+241077000000',
  email: 'contact@perfectmodels.ga',
  foundingDate: '2021',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Libreville',
    addressCountry: 'GA',
    addressRegion: 'Estuaire',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 0.3924,
    longitude: 9.4536,
  },
  areaServed: [
    { '@type': 'City', name: 'Libreville' },
    { '@type': 'Country', name: 'Gabon' },
    { '@type': 'Place', name: 'Afrique Centrale' },
  ],
  sameAs: [
    'https://www.facebook.com/PerfectModels241',
    'https://www.instagram.com/perfectmodelsmanagement_/',
    'https://www.youtube.com/@perfectmodelsmanagement6013',
  ],
  priceRange: '$$',
  openingHours: 'Mo-Fr 08:00-18:00',
};

const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
}) => {
  const { pathname } = useLocation();
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Agence de Mannequins à Libreville, Gabon`;
  const canonicalUrl = `${BASE_URL}${pathname}`;
  const absoluteImage = image.startsWith('http') ? image : `${BASE_URL}${image}`;

  React.useEffect(() => {
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    setMeta('description', description);
    setMeta('keywords', keywords);
    if (noIndex) setMeta('robots', 'noindex, nofollow');

    // Geo / local SEO
    setMeta('geo.region', 'GA-1');
    setMeta('geo.placename', 'Libreville, Gabon');
    setMeta('geo.position', '0.3924;9.4536');
    setMeta('ICBM', '0.3924, 9.4536');
    setMeta('language', 'fr');
    setMeta('content-language', 'fr-GA');

    // Open Graph
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:image', absoluteImage, 'property');
    setMeta('og:url', canonicalUrl, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:site_name', SITE_NAME, 'property');
    setMeta('og:locale', 'fr_GA', 'property');

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', absoluteImage);

    // Canonical dynamique selon la route réelle
    setLink('canonical', canonicalUrl);

    // JSON-LD local business (une seule fois)
    const schemaId = 'local-business-schema';
    if (!document.getElementById(schemaId)) {
      const script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(LOCAL_BUSINESS_SCHEMA);
      document.head.appendChild(script);
    }
  }, [fullTitle, description, keywords, absoluteImage, canonicalUrl, type, noIndex]);

  return null;
};

export default SEO;
