import React, { useEffect } from 'react';
import { siteConfig } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object; // New prop for JSON-LD
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, noIndex, schema }) => {
  useEffect(() => {
    const defaultTitle = 'Perfect Models Management';
    const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    document.title = pageTitle;

    const setMeta = (name: string, content: string, isProperty: boolean = false) => {
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

    const defaultDescription = "L'agence de mannequins de référence à Libreville, Gabon. Perfect Models Management révèle les talents, organise des événements mode d'exception et façonne l'avenir du mannequinat africain.";
    const defaultKeywords = "mannequin, agence de mannequins, Gabon, Libreville, mode, défilé, Perfect Models Management, casting";
    const defaultImage = siteConfig.logo;
    const siteUrl = window.location.href;
    const siteName = 'Perfect Models Management';

    setMeta('description', description || defaultDescription);
    setMeta('keywords', keywords || defaultKeywords);
    setMeta('author', siteName);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', description || defaultDescription, true);
    setMeta('og:image', image || defaultImage, true);
    setMeta('og:url', siteUrl, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:type', 'website', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image', false);
    setMeta('twitter:title', pageTitle, false);
    setMeta('twitter:description', description || defaultDescription, false);
    setMeta('twitter:image', image || defaultImage, false);

    // Handle JSON-LD Schema
    const schemaElementId = 'seo-schema-script';
    let schemaElement = document.getElementById(schemaElementId) as HTMLScriptElement | null;

    if (schema) {
      if (!schemaElement) {
        schemaElement = document.createElement('script');
        schemaElement.id = schemaElementId;
        schemaElement.type = 'application/ld+json';
        document.head.appendChild(schemaElement);
      }
      schemaElement.innerHTML = JSON.stringify(schema);
    } else {
      if (schemaElement) {
        schemaElement.remove();
      }
    }

    // Cleanup function to remove schema on component unmount
    return () => {
      const el = document.getElementById(schemaElementId);
      if (el) el.remove();
    };

  }, [title, description, keywords, image, noIndex, schema]);

  return null;
};

export default SEO;