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
  canonicalUrl?: string; // URL canonique
  type?: 'website' | 'article' | 'profile' | 'event'; // Type Open Graph
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
    // 1. Définition des valeurs
    const defaultTitle = siteConfig.title;
    const pageTitle = title ? `${title} | ${siteConfig.name}` : defaultTitle;
    const descriptionContent = description || siteConfig.description;
    const generatedKeywords = getPageKeywords(keywords || siteConfig.keywords);

    // Construction de l'URL absolue pour l'image
    let imageContent = image || siteConfig.defaultImage;
    if (imageContent && !imageContent.startsWith('http')) {
        // Si l'image est relative, on la préfixe avec l'URL du site
        // Note: siteConfig.url ne doit pas avoir de slash final, ou on doit gérer ça.
        // On suppose que siteConfig.url est la racine.
        const baseUrl = siteConfig.url.endsWith('/') ? siteConfig.url.slice(0, -1) : siteConfig.url;
        const imagePath = imageContent.startsWith('/') ? imageContent : `/${imageContent}`;
        imageContent = `${baseUrl}${imagePath}`;
    }

    const siteUrl = window.location.href;
    const siteName = siteConfig.name;

    // 2. Mise à jour du Document Title
    document.title = pageTitle;

    // 3. Fonction utilitaire pour gérer les balises meta
    const updateMeta = (name: string, content: string | undefined, attribute: 'name' | 'property' = 'name') => {
      if (!content) return;
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;

      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 4. Fonction utilitaire pour gérer les liens (canonical)
    const updateLink = (rel: string, href: string) => {
        if (!href) return;
        let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', rel);
            document.head.appendChild(link);
        }
        link.setAttribute('href', href);
    };

    // 5. Mise à jour des balises

    // Standard SEO
    updateMeta('description', descriptionContent);
    updateMeta('keywords', generatedKeywords);
    updateMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    updateMeta('author', siteConfig.author);

    // Open Graph / Facebook
    updateMeta('og:type', type, 'property');
    updateMeta('og:site_name', siteName, 'property');
    updateMeta('og:title', pageTitle, 'property');
    updateMeta('og:description', descriptionContent, 'property');
    updateMeta('og:image', imageContent, 'property');
    updateMeta('og:url', canonicalUrl || siteUrl, 'property');
    updateMeta('og:locale', 'fr_FR', 'property');

    // Twitter
    updateMeta('twitter:card', 'summary_large_image', 'property'); // property ou name, Twitter supporte les deux mais property est mieux pour compatibilité OG
    updateMeta('twitter:title', pageTitle, 'property');
    updateMeta('twitter:description', descriptionContent, 'property');
    updateMeta('twitter:image', imageContent, 'property');
    if (siteConfig.twitterHandle) {
        updateMeta('twitter:site', siteConfig.twitterHandle, 'property');
        updateMeta('twitter:creator', siteConfig.twitterHandle, 'property');
    }

    // Canonical
    updateLink('canonical', canonicalUrl || siteUrl);

    // 6. JSON-LD Schema
    const schemaElementId = 'seo-schema-script';
    let schemaElement = document.getElementById(schemaElementId) as HTMLScriptElement | null;

    const defaultSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": siteName,
      "url": siteConfig.url,
      "logo": siteConfig.logo,
      "description": siteConfig.description,
      "sameAs": [
        socialLinks.facebook,
        socialLinks.instagram,
        socialLinks.youtube
      ].filter(Boolean)
    };

    const finalSchema = schema || defaultSchema;

    if (!schemaElement) {
        schemaElement = document.createElement('script');
        schemaElement.id = schemaElementId;
        schemaElement.type = 'application/ld+json';
        document.head.appendChild(schemaElement);
    }
    schemaElement.innerHTML = JSON.stringify(finalSchema);

    // Cleanup function:
    // Note: On single page apps, removing meta tags on unmount might be tricky if the next page hasn't mounted yet,
    // causing a flicker of "no tags". Usually, standard practice in simple implementations is to overwrite.
    // However, if we move from a page with "noIndex=true" to one without, we MUST ensure robots tag is updated (which we do above).
    // If we move from a page with a specific schema to one without, we should revert to default schema or remove.
    // Here we handle updates in the effect, so cleanup is mostly about avoiding memory leaks or stale schema if component unmounts without navigation (rare for SEO component).

    return () => {
        // Optional: Remove schema script to clean up DOM if component unmounts
        // const el = document.getElementById(schemaElementId);
        // if (el) el.remove();
        // We generally leave meta tags as they will be overwritten by the next page's SEO component.
    };

  }, [title, description, keywords, image, noIndex, schema, canonicalUrl, type]);

  return null;
};

export default SEO;
