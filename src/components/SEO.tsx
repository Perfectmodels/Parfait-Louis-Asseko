import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object;
  type?: 'website' | 'article';
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterSite?: string;
  twitterCreator?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tag?: string | string[];
  author?: string;
  canonicalUrl?: string;
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
  author,
  canonicalUrl
}) => {
  useEffect(() => {
    const defaultTitle = 'Perfect Models Management';
    const defaultDescription = "L'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, événements mode et formations professionnelles.";
    const defaultKeywords = 'mannequin, agence, Gabon, Libreville, mode, casting, Perfect Models Management, PMM, fashion, défilé, formation mannequin';
    const defaultOgImage = `${window.location.origin}/logopmm.jpg`;
    const siteUrl = window.location.href;

    const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
    document.title = pageTitle;

    const setMeta = (name: string, content: string | undefined, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) el.setAttribute('property', name); else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const setLink = (rel: string, href: string) => {
      if (!href) return;
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    setMeta('description', description || defaultDescription);
    setMeta('keywords', keywords || defaultKeywords);
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');
    setLink('canonical', canonicalUrl || siteUrl);

    // Open Graph tags
    setMeta('og:title', pageTitle, true);
    setMeta('og:description', description || defaultDescription, true);
    setMeta('og:image', image || defaultOgImage, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('og:image:alt', pageTitle, true);
    setMeta('og:url', siteUrl, true);
    setMeta('og:site_name', siteName, true);
    setMeta('og:type', type, true);
    setMeta('og:locale', locale, true);

    if (type === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, true);
      if (modifiedTime) setMeta('article:modified_time', modifiedTime, true);
      if (section) setMeta('article:section', section, true);
      if (tag) {
        const tags = Array.isArray(tag) ? tag : [tag];
        tags.forEach(t => setMeta('article:tag', t, true));
      }
      if (author) setMeta('article:author', author, true);
    }

    // Twitter Card tags
    setMeta('twitter:card', twitterCard);
    setMeta('twitter:site', twitterSite);
    setMeta('twitter:creator', twitterCreator);
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', description || defaultDescription);
    setMeta('twitter:image', image || defaultOgImage);
    setMeta('twitter:image:alt', pageTitle);

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
    } else if (schemaElement) {
      schemaElement.remove();
    }

    return () => {
      const el = document.getElementById(schemaElementId);
      if (el) el.remove();
    };
  }, [title, description, keywords, image, noIndex, schema, type, locale, siteName, twitterCard, twitterSite, twitterCreator, publishedTime, modifiedTime, section, tag, author, canonicalUrl]);

  return null;
};

export default SEO;


