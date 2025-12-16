import React, { useEffect } from 'react';
import { siteConfig, socialLinks } from '../constants/data';
import { getPageKeywords } from '../constants/seoKeywords';

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
    const defaultTitle = siteConfig.title;
    const pageTitle = title ? `${title} | ${siteConfig.name}` : defaultTitle;

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

    const descriptionContent = description || siteConfig.description;

    // Utilisation du générateur de mots-clés intelligent
    const generatedKeywords = getPageKeywords(keywords || siteConfig.keywords);

    const imageContent = image || siteConfig.defaultImage;
    const siteUrl = window.location.href;
    const siteName = siteConfig.name;

    // Balises standard
    setMeta('description', descriptionContent);
    setMeta('keywords', generatedKeywords);
    setMeta('author', siteConfig.author);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setMeta('geo.region', 'GA'); // Géolocalisation Gabon
    setMeta('geo.placename', 'Libreville'); // Géolocalisation Libreville

    // Canonical
    setLink('canonical', canonicalUrl || siteUrl);

    // Open Graph
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', descriptionContent, true);
    setMeta('og:image', imageContent, true);
    setMeta('og:url', siteUrl, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:type', type, true);
    setMeta('og:locale', 'fr_FR', true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', descriptionContent);
    setMeta('twitter:image', imageContent);
    if (siteConfig.twitterHandle) {
      setMeta('twitter:site', siteConfig.twitterHandle);
    }

    // JSON-LD Schema
    const schemaElementId = 'seo-schema-script';
    let schemaElement = document.getElementById(schemaElementId) as HTMLScriptElement | null;

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": siteConfig.url,
      "logo": siteConfig.logo,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+241 74 56 78 90", // Exemple, à remplacer par le vrai numéro si dispo dans data
        "contactType": "customer service",
        "areaServed": "GA",
        "availableLanguage": "French"
      },
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
      // On ne supprime pas les balises meta car cela pourrait affecter le SEO lors de la navigation
      // Mais on peut nettoyer le script schema si nécessaire
      const el = document.getElementById(schemaElementId);
      if (el) el.remove();
    };
  }, [title, description, keywords, image, noIndex, schema, canonicalUrl, type]);

  return null;
};

export default SEO;
