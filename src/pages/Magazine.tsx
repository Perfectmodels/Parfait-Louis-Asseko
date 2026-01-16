import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Article } from '../types';
import { useData } from '../contexts/DataContext';
import Pagination from '../components/Pagination';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';

const Magazine: React.FC = () => {
  const { data, isInitialized } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const ARTICLES_PER_PAGE = 9;

  const articles = data?.articles || [];

  let featuredArticle = articles.find(a => a.isFeatured);
  if (!featuredArticle && articles.length > 0) {
    featuredArticle = articles[0]; // Fallback to the first article if none is featured
  }

  const otherArticles = articles.filter(a => a.slug !== featuredArticle?.slug);

  const totalPages = Math.ceil(otherArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = otherArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };


  if (!isInitialized) {
    return <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-gold">Chargement du magazine...</div>;
  }

  // Use featured article image for hero or fallback
  const heroImage = featuredArticle?.imageUrl || data?.siteImages?.hero || "";

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO
        title="Magazine | Focus Model 241"
        description="Focus Model 241, le magazine en ligne de Perfect Models Management. Plongez dans les coulisses de la mode gabonaise."
        keywords="magazine mode gabon, focus model 241, interview mannequin, tendances mode afrique, mode libreville"
        image={heroImage}
      />

      <ParallaxHero
        image={heroImage}
        title="FOCUS MODEL 241"
        subtitle="Le magazine de la mode et des talents gabonais."
        height="h-[60vh]"
        overlayOpacity={0.6}
      />

      <div className="page-container -mt-20 relative z-20">
        {/* Featured Article - displayed distinctively if not already in hero logic (here hero logic is generic title) */}
        {featuredArticle && (
          <FadeIn className="mb-16">
            <Link to={`/magazine/${featuredArticle.slug}`} className="group block relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="grid md:grid-cols-2 lg:h-[450px]">
                <div className="relative overflow-hidden h-64 md:h-full">
                  <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-none"></div>
                </div>
                <div className="bg-pm-dark-light/95 backdrop-blur-md p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-pm-gold"></span>
                    <p className="text-xs uppercase tracking-widest text-pm-gold font-bold">À la Une</p>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-white mb-4 group-hover:text-pm-gold transition-colors leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-pm-off-white/70 mb-8 leading-relaxed line-clamp-3 md:line-clamp-none">
                    {featuredArticle.excerpt}
                  </p>
                  <span className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-white group-hover:text-pm-gold transition-colors">
                    Lire l'article <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </Link>
          </FadeIn>
        )}

        {/* Other Articles Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentArticles.map((article, index) => (
              <FadeIn key={article.slug} delay={index * 0.1}>
                <ArticleCard article={article} />
              </FadeIn>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-16">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  const articleDate = new Date(article.date);
  const isValidDate = !isNaN(articleDate.getTime());

  return (
    <Link to={`/magazine/${article.slug}`} className="group block bg-white/5 border border-white/5 rounded-xl overflow-hidden hover:border-pm-gold/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-pm-gold px-3 py-1 text-xs font-bold uppercase tracking-widest rounded">
          {article.category}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-xs text-pm-off-white/40 mb-3 block">
          {isValidDate ? articleDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
        </span>
        <h3 className="text-xl font-playfair font-bold text-pm-off-white mb-3 group-hover:text-pm-gold transition-colors leading-snug">
          {article.title}
        </h3>
        <p className="text-sm text-pm-off-white/60 line-clamp-3 mb-4 flex-grow">
          {article.excerpt}
        </p>
        <span className="text-xs font-bold uppercase tracking-widest text-pm-gold mt-auto flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
          Lire plus <span className="ml-1 text-lg leading-none">›</span>
        </span>
      </div>
    </Link>
  );
};

export default Magazine;
