import React, { useEffect } from 'react';
import { siteConfig } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object;
  type?: 'website' | 'article' | 'profile' | 'book' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other';
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tag?: string | string[];
  author?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  noIndex = false,
  schema,
  type = 'website',
  locale = 'fr_FR',
  siteName = 'Perfect Models Management',
  twitterCard = 'summary_large_image',
  twitterSite = '@PerfectModelsGA',
  twitterCreator = '@PerfectModelsGA',
  publishedTime,
  modifiedTime,
  section,
  tag,
  author
}) => {
  useEffect(() => {
    const defaultTitle = 'Perfect Models Management';
    const defaultDescription = "L'agence de mannequins de référence à Libreville, Gabon. Perfect Models Management révèle les talents, organise des événements mode d'exception et façonne l'avenir du mannequinat africain.";
    const defaultKeywords = "mannequin, agence de mannequins, Gabon, Libreville, mode, défilé, Perfect Models Management, casting, mode africaine, mannequinat Gabon";
    const defaultImage = siteConfig.logo;
    const siteUrl = window.location.href;

    // Gestion du titre de la page
    const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    document.title = pageTitle;

    // Fonction utilitaire pour gérer les balises meta
    const setMeta = (name: string, content: string, isProperty: boolean = false) => {
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

    // Balises meta de base
    setMeta('description', description || defaultDescription);
    setMeta('keywords', keywords || defaultKeywords);
    setMeta('author', author || siteName);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Balises Open Graph (Facebook, LinkedIn, etc.)
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', description || defaultDescription, true);
    setMeta('og:image', image || defaultImage, true);
    setMeta('og:url', siteUrl, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:type', type, true);
    setMeta('og:locale', locale, true);

    // Balises spécifiques aux articles
    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true);
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
      if (section) setMeta('article:section', section, true);
      if (tag) {
        const tags = Array.isArray(tag) ? tag : [tag];
        tags.forEach((t, i) => setMeta(`article:tag`, t, true));
      }
      if (author) setMeta('article:author', author, true);
    }

    // Balises Twitter Card
    setMeta('twitter:card', twitterCard, false);
    setMeta('twitter:site', twitterSite, false);
    setMeta('twitter:creator', twitterCreator, false);
    setMeta('twitter:title', pageTitle, false);
    setMeta('twitter:description', description || defaultDescription, false);
    setMeta('twitter:image', image || defaultImage, false);

    // Balise canonique
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = siteUrl;

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

  }, [
    title, 
    description, 
    keywords, 
    image, 
    noIndex, 
    schema, 
    type, 
    locale, 
    siteName, 
    twitterCard, 
    twitterSite, 
    twitterCreator, 
    publishedTime, 
    modifiedTime, 
    section, 
    tag, 
    author
  ]);

  return null;
};

export default SEO;