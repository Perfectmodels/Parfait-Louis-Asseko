import React from 'react';
import { useRouter } from 'next/router';
import SEO from '../../components/SEO';

const ArticleDetail: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;

  if (router.isFallback) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title={`Article ${slug} | Perfect Models Management`}
        description={`Découvrez l'article ${slug}`}
      />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-playfair text-pm-gold mb-8">Article {slug}</h1>
        <p className="text-lg text-pm-off-white/80">
          Page en construction...
        </p>
      </div>
    </div>
  );
};

export default ArticleDetail;
