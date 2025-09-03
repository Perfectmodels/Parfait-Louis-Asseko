import React, { useEffect } from 'react';
import { siteConfig } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image }) => {
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

    const defaultDescription = "The official website for Perfect Models Management, a modeling agency based in Libreville, Gabon. Discover our models, events, and services.";
    const defaultKeywords = "mannequin, agence de mannequins, Gabon, Libreville, mode, défilé, Perfect Models Management, casting";
    const defaultImage = siteConfig.logo;

    setMeta('description', description || defaultDescription);
    setMeta('keywords', keywords || defaultKeywords);

    // Open Graph
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', description || defaultDescription, true);
    setMeta('og:image', image || defaultImage, true);
    setMeta('og:type', 'website', true);

  }, [title, description, keywords, image]);

  return null;
};

export default SEO;
