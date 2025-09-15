import React from 'react';
import { useData } from '../contexts/DataContext';

const Sitemap: React.FC = () => {
  const { data, isInitialized } = useData();

  React.useEffect(() => {
    if (!isInitialized || !data) {
      return;
    }

    const baseUrl = 'https://www.perfectmodels.ga';

    const generateUrlEntry = (loc: string, lastmod: string, changefreq: string, priority: string) => {
      // Basic sanitization for XML characters in URL
      const sanitizedLoc = loc.replace(/&/g, '&amp;')
                               .replace(/</g, '&lt;')
                               .replace(/>/g, '&gt;')
                               .replace(/"/g, '&quot;')
                               .replace(/'/g, '&apos;');

      return `
  <url>
    <loc>${baseUrl}${sanitizedLoc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    };

    const today = new Date().toISOString().split('T')[0];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Static pages from navLinks that are public
    data.navLinks
      .filter(link => link.inFooter || link.path === '/')
      .forEach(link => {
        sitemapContent += generateUrlEntry(link.path, today, 'weekly', link.path === '/' ? '1.0' : '0.8');
      });

    // Model pages
    data.models.filter(m => m.isPublic).forEach(model => {
      sitemapContent += generateUrlEntry(`/mannequins/${model.id}`, today, 'monthly', '0.7');
    });

    // Article pages
    data.articles.forEach(article => {
      sitemapContent += generateUrlEntry(`/magazine/${article.slug}`, article.date || today, 'monthly', '0.7');
    });
    
    // Service pages
    data.agencyServices.forEach(service => {
        sitemapContent += generateUrlEntry(`/services/${service.slug}`, today, 'monthly', '0.6');
    });

    sitemapContent += `
</urlset>`;

    // This effect replaces the document content with XML, serving a dynamic sitemap.
    document.open('application/xml');
    document.write(sitemapContent);
    document.close();

  }, [isInitialized, data]);

  return null; // This component only triggers an effect.
};

export default Sitemap;