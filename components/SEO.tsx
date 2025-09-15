import React, { useEffect } from 'react';
import { siteConfig, socialLinks } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object; // JSON-LD personnalisé
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile' | 'event' | 'organization';
  lang?: string; // Pour hreflang
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
  lang = 'fr',
}) => {
  useEffect(() => {
    const defaultTitle = 'Perfect Models Management';
    const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

    document.title = pageTitle;

    // Fonction utilitaire : créer/mettre à jour une meta
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

    // Fonction utilitaire : créer/mettre à jour un link
    const setLink = (rel: string, href: string, extraAttr?: { [key: string]: string }) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
      if (extraAttr) {
        Object.entries(extraAttr).forEach(([k, v]) => link.setAttribute(k, v));
      }
    };

    const defaultDescription =
      "L'agence de mannequins de référence à Libreville, Gabon. Perfect Models Management révèle les talents, organise des événements mode d'exception et façonne l'avenir du mannequinat africain.";
    const defaultKeywords =
      'mannequin, agence de mannequins, Gabon, Libreville, mode, défilé, Perfect Models Management, casting';
    const defaultImage = siteConfig.logo;
    const siteUrl = window.location.href;
    const siteOrigin = window.location.origin;
    const siteName = 'Perfect Models Management';

    // Balises HTML essentielles
    setMeta('charset', 'UTF-8');
    setMeta('viewport', 'width=device-width, initial-scale=1');

    // Balises standard
    setMeta('description', description || defaultDescription);
    setMeta('keywords', keywords || defaultKeywords);
    setMeta('author', siteName);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical
    setLink('canonical', canonicalUrl || siteUrl);

    // Hreflang
    setLink('alternate', canonicalUrl || siteUrl, { hreflang: lang });

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
    setMeta('og:updated_time', new Date().toISOString(), true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', description || defaultDescription);
    setMeta('twitter:image', image || defaultImage);
    setMeta('twitter:site', '@PerfectModelsGA'); // Twitter handle de l’agence

    // JSON-LD Schema dynamique
    const schemaElementId = 'seo-schema-script';
    let schemaElement = document.getElementById(schemaElementId) as HTMLScriptElement | null;

    const schemasByType: Record<string, object> = {
      organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": siteName,
        "url": siteOrigin,
        "logo": siteConfig.logo,
        "sameAs": [socialLinks.facebook, socialLinks.instagram, socialLinks.youtube].filter(Boolean),
      },
      website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteName,
        "url": siteOrigin,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${siteOrigin}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      event: {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": title || siteName,
        "startDate": "2025-11-16T15:00:00+02:00",
        "eventStatus": "https://schema.org/EventScheduled",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "location": {
          "@type": "Place",
          "name": "Casino Croisette, Libreville",
          "address": "Libreville, Gabon"
        },
        "image": image || defaultImage,
        "description": description || defaultDescription,
        "organizer": {
          "@type": "Organization",
          "name": siteName,
          "url": siteOrigin
        }
      },
      article: {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title || siteName,
        "description": description || defaultDescription,
        "author": {
          "@type": "Organization",
          "name": siteName
        },
        "publisher": {
          "@type": "Organization",
          "name": siteName,
          "logo": {
            "@type": "ImageObject",
            "url": siteConfig.logo
          }
        },
        "datePublished": new Date().toISOString(),
        "image": image || defaultImage
      }
    };

    const finalSchema = schema || schemasByType[type] || schemasByType.organization;

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
  }, [title, description, keywords, image, noIndex, schema, canonicalUrl, type, lang]);

  return null;
};

export default SEO;
