import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig, socialLinks } from '../constants/data';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noIndex?: boolean;
  schema?: object;
  canonicalUrl?: string;
  type?: 'website' | 'article' | 'profile' | 'event';
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  noIndex = false,
  schema,
  canonicalUrl,
  type = 'website',
}) => {
  const location = useLocation();
  const siteUrl = `${window.location.origin}${location.pathname}${location.search}`;

  const defaultTitle = siteConfig.name || 'Perfect Models Management';
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;

  const defaultDescription =
    siteConfig.description || 
    "L'agence de mannequins de référence à Libreville, Gabon. Perfect Models Management révèle les talents, organise des événements mode d'exception et façonne l'avenir du mannequinat africain.";
  const finalDescription = description || defaultDescription;

  const defaultKeywords =
    'mannequin, agence de mannequins, Gabon, Libreville, mode, défilé, Perfect Models Management, casting';
  const finalKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  
  // Utilise le logo du site si aucune image n'est fournie, sinon une image par défaut
  const defaultImage = `${window.location.origin}${siteConfig.logo || '/logo-seo.svg'}`;
  const finalImage = image || defaultImage;

  const siteName = siteConfig.name || 'Perfect Models Management';

  // Schema JSON-LD par défaut
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": window.location.origin,
    "logo": defaultImage,
    "sameAs": [
      socialLinks.facebook,
      socialLinks.instagram,
      socialLinks.youtube
    ].filter(Boolean)
  };

  const finalSchema = schema || defaultSchema;

  return (
    <Helmet>
      {/* --- Balises Standard --- */}
      <title>{pageTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={siteName} />
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      <link rel="canonical" href={canonicalUrl || siteUrl} />

      {/* --- Open Graph (pour Facebook, WhatsApp, etc.) --- */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="fr_FR" />
      {/* Dimensions recommandées pour les images Open Graph */}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      {type === 'event' && <meta property="og:image:alt" content={`Affiche de l'événement ${title}`} />}

      {/* --- Twitter Card --- */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      {/* Si vous avez un compte Twitter associé, décommentez et remplacez */}
      {/* <meta name="twitter:site" content="@VotreCompteTwitter" /> */}
      {/* <meta name="twitter:creator" content="@AuteurOuCompteTwitter" /> */}

      {/* --- Schema JSON-LD (pour le SEO Google) --- */}
      {finalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(finalSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
