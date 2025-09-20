import React, { useEffect } from 'react';
import { siteConfig, socialLinks } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object; // JSON-LD personnalisé
  canonicalUrl?: string; // Nouveau : URL canonique
  type?: 'website' | 'article' | 'profile' | 'event'; // Nouveau : type Open Graph
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  noIndex,
  schema,
  canonicalUrl,
  type = 'website',
}) => {
  useEffect(() => {
    const defaultTitle = 'Perfect Models Management';
    const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

    document.title = pageTitle;

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

    const setLink = (rel: string, href: string) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    const defaultDescription =
      "L'agence de mannequins de référence à Libreville, Gabon. Perfect Models Management révèle les talents, organise des événements mode d'exception et façonne l'avenir du mannequinat africain.";
    const defaultKeywords =
      'mannequin, agence de mannequins, Gabon, Libreville, mode, défilé, Perfect Models Management, casting';
    const defaultImage = 'https://www.perfectmodels.ga/logo-seo.svg';
    const siteUrl = window.location.href;
    const siteName = 'Perfect Models Management';

    // Balises standard
    setMeta('description', description || defaultDescription);
    setMeta('keywords', keywords || defaultKeywords);
    setMeta('author', siteName);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    setLink('canonical', canonicalUrl || siteUrl);

    // Open Graph
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', description || defaultDescription, true);
    setMeta('og:image', image || defaultImage, true);
    setMeta('og:url', siteUrl, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:type', type, true);
    setMeta('og:locale', 'fr_FR', true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    
    // Métadonnées spécifiques aux événements
    if (type === 'event' && image) {
      setMeta('og:image:alt', `Affiche officielle de l'événement ${title}`, true);
      setMeta('og:image:type', 'image/png', true);
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', description || defaultDescription);
    setMeta('twitter:image', image || defaultImage);

    // JSON-LD Schema
    const schemaElementId = 'seo-schema-script';
    let schemaElement = document.getElementById(schemaElementId) as HTMLScriptElement | null;

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": window.location.origin,
      "logo": siteConfig.logo,
      "sameAs": [
        socialLinks.facebook,
        socialLinks.instagram,
        socialLinks.youtube
      ].filter(Boolean)
    };

    const finalSchema = schema || defaultSchema;

    if (finalSchema) {
      if (!schemaElement) {
        schemaElement = document.createElement('script');
        schemaElement.id = schemaElementId;
        schemaElement.type = 'application/ld+json';
        document.head.appendChild(schemaElement);
      }
      schemaElement.innerHTML = JSON.stringify(finalSchema);
    } else {
      if (schemaElement) schemaElement.remove();
    }

    // Cleanup
    return () => {
      const el = document.getElementById(schemaElementId);
      if (el) el.remove();
    };
  }, [title, description, keywords, image, noIndex, schema, canonicalUrl, type]);

  return null;
};

export default SEO;
