import * as React from 'react';
import { siteConfig } from '../constants/data';

// Définition des types pour les données structurées
interface StructuredData {
  '@context'?: string;
  '@type': string;
  [key: string]: any;
}

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  type?: 'website' | 'article';
  section?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  twitterSite?: string;
  schema?: StructuredData;
  structuredData?: StructuredData;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  noIndex = false,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  author,
  type = 'website',
  section,
  tags = [],
  locale = 'fr_FR',
  siteName = 'Perfect Models Management',
  twitterCard = 'summary_large_image',
  twitterCreator = '@perfectmodels',
  twitterSite = '@perfectmodels',
  schema,
  structuredData,
}) => {
  // Configuration par défaut
  const defaultDescription = "L'agence de mannequins de référence à Libreville, Gabon. Découvrez nos mannequins, participez à nos castings et événements mode exclusifs.";
  const defaultKeywords = [
    'agence de mannequins',
    'modélisme Gabon',
    'casting mannequin',
    'agence mode Libreville',
    'mannequinat africain',
    'défilé de mode',
    'photographie mode',
    'book photo professionnel',
    'formation mannequinat',
    'agence de talents',
    ...keywords
  ];

  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description || defaultDescription;
  const pageImage = image || siteConfig.logo;
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const canonical = canonicalUrl || pageUrl;
  
  // Données structurées par défaut (Schema.org)
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: 'https://perfectmodelsgabon.com',
    logo: siteConfig.logo,
    sameAs: [
      'https://www.instagram.com/perfectmodelsgabon',
      'https://www.facebook.com/perfectmodelsgabon',
      'https://twitter.com/perfectmodels',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact?.phone || '',
      contactType: 'customer service',
      email: siteConfig.contact?.email || '',
      areaServed: 'GA',
      availableLanguage: ['French', 'English']
    },
    ...structuredData
  };

  // Si c'est une page d'article
  if (type === 'article') {
    defaultStructuredData['@type'] = 'Article';
    defaultStructuredData.headline = title;
    defaultStructuredData.description = pageDescription;
    defaultStructuredData.image = pageImage;
    if (publishedTime) defaultStructuredData.datePublished = publishedTime;
    if (modifiedTime) defaultStructuredData.dateModified = modifiedTime;
    if (author) defaultStructuredData.author = { '@type': 'Person', name: author };
    if (section) defaultStructuredData.articleSection = section;
    if (tags.length > 0) defaultStructuredData.keywords = tags.join(', ');
  }

  return (
    <>
      {/* Balises de base */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={defaultKeywords.join(', ')} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />

      {/* Données structurées */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(defaultStructuredData, null, 2)
        }}
      />

      {/* Balises supplémentaires */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#000000" />
      
      {/* Google Analytics */}
      {siteConfig.seo?.googleAnalyticsId && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.seo.googleAnalyticsId}`}></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${siteConfig.seo.googleAnalyticsId}');
              `,
            }}
          />
        </>
      )}
      
      {/* Google Tag Manager */}
      {siteConfig.seo?.googleTagManagerId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${siteConfig.seo.googleTagManagerId}');
            `,
          }}
        />
      )}
    </>
  );
};

export default SEO;