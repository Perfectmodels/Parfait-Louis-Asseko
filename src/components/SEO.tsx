import React, { useEffect } from 'react';
import { socialLinks, contactInfo } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile' | 'event' | 'local_business';
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  articlePublisher?: string;
  articleSection?: string;
  articleTag?: string[];
  videoUrl?: string;
  videoSecureUrl?: string;
  videoType?: string;
  videoWidth?: string;
  videoHeight?: string;
  audioUrl?: string;
  audioTitle?: string;
  audioArtist?: string;
  audioAlbum?: string;
  noFollow?: boolean;
  noImageIndex?: boolean;
  noSnippet?: boolean;
  maxSnippet?: number;
  maxImagePreview?: 'none' | 'standard' | 'large';
  maxVideoPreview?: number;
  noArchive?: boolean;
  unavailableAfter?: string;
  noTranslate?: boolean;
  imageAlt?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageType?: string;
  localeAlternate?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description = "Découvrez Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Spécialistes du mannequinat, défilés de mode et formations professionnelles.",
  keywords = "agence mannequin, mannequinat Gabon, mode Libreville, défilé de mode, formation mannequin, casting mode Afrique, agence de mannequins, mannequin professionnel, mannequinat Afrique",
  image = "https://i.ibb.co/fVBxPNTP/T-shirt.png",
  noIndex = false,
  schema,
  canonicalUrl,
  type = 'website',
  locale = 'fr_GA',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  siteName = 'Perfect Models Management',
  twitterCard = 'summary_large_image',
  twitterSite = '@PerfectModelsGA',
  twitterCreator = '@PerfectModelsGA',
  articlePublisher,
  articleSection,
  articleTag = [],
  videoUrl,
  videoSecureUrl,
  videoType,
  videoWidth,
  videoHeight,
  audioUrl,
  audioTitle,
  audioArtist,
  audioAlbum,
  noFollow = false,
  noImageIndex = false,
  noSnippet = false,
  maxSnippet,
  maxImagePreview = 'large',
  maxVideoPreview,
  noArchive = false,
  unavailableAfter,
  noTranslate = false,
  imageAlt = "Logo Perfect Models Management",
  imageWidth = "1200",
  imageHeight = "630",
  imageType = "image/png",
  localeAlternate = ['fr_FR', 'en_US']
}) => {
  useEffect(() => {
    const defaultTitle = 'Perfect Models Management';
    const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    const pageDescription = description || "Découvrez Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Spécialistes du mannequinat, défilés de mode et formations professionnelles.";
    const pageImage = image || 'https://i.ibb.co/fVBxPNTP/T-shirt.png';
    const pageUrl = canonicalUrl || window.location.href;

    // Définition du titre de la page
    document.title = pageTitle;

    // Fonction utilitaire pour définir les métadonnées
    const setMeta = (name: string, content: string | undefined, isProperty: boolean = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.head.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Fonction pour définir les balises link
    const setLink = (rel: string, href: string, type?: string, sizes?: string) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        if (type) link.type = type;
        if (sizes) link.setAttribute('sizes', sizes);
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Fonction pour définir les balises JSON-LD
    const setJsonLd = (jsonLd: object) => {
      // Supprimer l'ancien JSON-LD s'il existe
      const existingJsonLd = document.querySelector('script[type="application/ld+json"]');
      if (existingJsonLd) {
        document.head.removeChild(existingJsonLd);
      }

      // Créer un nouvel élément script pour le JSON-LD
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    };

    // Variables de configuration par défaut
    const siteName = 'Perfect Models Management';

    // Balises standard
    setMeta('description', pageDescription);
    setMeta('keywords', keywords);
    setMeta('author', author || 'Perfect Models Management');

    // Balises de contrôle des robots
    const robots = [
      noIndex ? 'noindex' : 'index',
      noFollow ? 'nofollow' : 'follow',
      noImageIndex ? 'noimageindex' : 'imageindex',
      noSnippet ? 'nosnippet' : (maxSnippet ? `max-snippet:${maxSnippet}` : ''),
      maxImagePreview ? `max-image-preview:${maxImagePreview}` : '',
      maxVideoPreview ? `max-video-preview:${maxVideoPreview}` : '',
      noArchive ? 'noarchive' : '',
      noTranslate ? 'notranslate' : '',
      unavailableAfter ? `unavailable_after: ${unavailableAfter}` : ''
    ].filter(Boolean).join(', ');

    setMeta('robots', robots);

    // Balises Open Graph
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', pageDescription, true);
    setMeta('og:type', type, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:image', pageImage, true);
    setMeta('og:image:width', imageWidth, true);
    setMeta('og:image:height', imageHeight, true);
    setMeta('og:image:alt', imageAlt, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:locale', locale, true);

    // Balises Open Graph supplémentaires pour les articles
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true);
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
      if (author) setMeta('article:author', author, true);
      if (section) setMeta('article:section', section, true);
      tags.forEach(tag => setMeta('article:tag', tag, true));
      if (articlePublisher) setMeta('article:publisher', articlePublisher, true);
    }

    // Balises Twitter Card
    setMeta('twitter:card', twitterCard, false);
    setMeta('twitter:site', twitterSite, false);
    setMeta('twitter:creator', twitterCreator, false);
    setMeta('twitter:title', pageTitle, false);
    setMeta('twitter:description', pageDescription, false);
    setMeta('twitter:image', pageImage, false);
    setMeta('twitter:image:alt', imageAlt, false);

    // Balises pour les vidéos
    if (videoUrl) {
      setMeta('og:video', videoUrl, true);
      if (videoSecureUrl) setMeta('og:video:secure_url', videoSecureUrl, true);
      if (videoType) setMeta('og:video:type', videoType, true);
      if (videoWidth) setMeta('og:video:width', videoWidth, true);
      if (videoHeight) setMeta('og:video:height', videoHeight, true);
    }

    // Balises pour les fichiers audio
    if (audioUrl) {
      setMeta('og:audio', audioUrl, true);
      if (audioTitle) setMeta('og:audio:title', audioTitle, true);
      if (audioArtist) setMeta('og:audio:artist', audioArtist, true);
      if (audioAlbum) setMeta('og:audio:album', audioAlbum, true);
    }

    // Lien canonique
    setLink('canonical', pageUrl);

    // Balises géographiques
    setMeta('geo.region', 'GA', false);
    setMeta('geo.placename', 'Libreville', false);
    setMeta('geo.position', '0.4162;9.4673', false);
    setMeta('ICBM', '0.4162, 9.4673', false);

    // Balises pour les appareils mobiles
    setMeta('theme-color', '#D4AF37', true);
    setMeta('mobile-web-app-capable', 'yes', false);
    setMeta('apple-mobile-web-app-title', 'PMM', false);
    setMeta('apple-mobile-web-app-status-bar-style', 'black-translucent', false);
    setMeta('apple-mobile-web-app-capable', 'yes', false);
    setMeta('application-name', 'Perfect Models Management', false);
    setMeta('msapplication-TileColor', '#D4AF37', false);
    setMeta('msapplication-config', '/browserconfig.xml', false);

    // Balises de référencement avancé
    setMeta('referrer', 'strict-origin-when-cross-origin', false);
    setMeta('format-detection', 'telephone=yes,date=yes,address=yes,email=yes,url=yes', false);
    setMeta('X-UA-Compatible', 'IE=edge,chrome=1', false);
    setMeta('content-language', 'fr-GA', false);

    // Balises pour les langues alternatives
    localeAlternate.forEach(loc => {
      setLink('alternate', pageUrl, 'text/html', loc);
    });

    // Balises pour les favicons
    setLink('icon', '/favicon.ico', 'image/x-icon');
    setLink('apple-touch-icon', '/icons/icon-192x192.png', 'image/png', '192x192');
    setLink('manifest', '/manifest.json');

    // Données structurées (JSON-LD)
    const defaultSchema = schema || {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Perfect Models Management',
      'url': 'https://www.perfectmodels.ga',
      'description': pageDescription,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': 'https://www.perfectmodels.ga/recherche?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Perfect Models Management',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://i.ibb.co/fVBxPNTP/T-shirt.png',
          'width': '512',
          'height': '512'
        }
      }
    };

    // Schéma d'entreprise locale
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Perfect Models Management',
      'image': 'https://i.ibb.co/fVBxPNTP/T-shirt.png',
      'telephone': contactInfo.phone,
      'email': contactInfo.email,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': contactInfo.address,
        'addressLocality': 'Libreville',
        'addressRegion': 'Estuaire',
        'postalCode': 'BP XXXX',
        'addressCountry': 'GA'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '0.4162',
        'longitude': '9.4673'
      },
      'url': 'https://www.perfectmodels.ga',
      'priceRange': '$$$',
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
          ],
          'opens': '09:00',
          'closes': '18:00'
        },
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': 'Saturday',
          'opens': '10:00',
          'closes': '15:00'
        }
      ],
      'sameAs': [
        socialLinks.facebook,
        socialLinks.instagram,
        socialLinks.youtube
      ]
    };

    // Ajouter les schémas JSON-LD
    setJsonLd(defaultSchema);
    setJsonLd(localBusinessSchema);

    // Cleanup
    return () => {
      document.title = 'Perfect Models Management';
      // Note: Nous ne nettoyons pas les balises meta car cela pourrait affecter d'autres composants
      // qui pourraient les utiliser. Le navigateur gérera le nettoyage lors du chargement d'une nouvelle page.
    };
  }, [
    title, description, keywords, image, noIndex, schema, canonicalUrl, type,
    locale, publishedTime, modifiedTime, author, section, tags, siteName,
    twitterCard, twitterSite, twitterCreator, articlePublisher, articleSection,
    articleTag, videoUrl, videoSecureUrl, videoType, videoWidth, videoHeight,
    audioUrl, audioTitle, audioArtist, audioAlbum, noFollow, noImageIndex,
    noSnippet, maxSnippet, maxImagePreview, maxVideoPreview, noArchive,
    unavailableAfter, noTranslate, imageAlt, imageWidth, imageHeight, imageType,
    localeAlternate
  ]);

  return null;
};

export default SEO;
