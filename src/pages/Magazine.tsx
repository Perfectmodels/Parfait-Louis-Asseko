import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Article } from '../types';
import { useData } from '../contexts/DataContext';
import Pagination from '../components/Pagination';
import { CalendarIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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
      return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement du magazine...</div>;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="Magazine | Focus Model 241"
        description="Focus Model 241, le magazine en ligne de Perfect Models Management. Plongez dans les coulisses de la mode gabonaise avec des interviews exclusives, des analyses de tendances et des conseils de pro."
        keywords="magazine mode gabon, focus model 241, interview mannequin, tendances mode afrique, mode libreville"
        image={featuredArticle?.imageUrl}
      />
      <header className="bg-black py-8 border-b-2 border-pm-gold">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-playfair text-pm-gold tracking-widest">FOCUS MODEL 241</h1>
          <p className="text-pm-off-white/80 mt-2">Le magazine de la mode et des talents gabonais.</p>
        </div>
      </header>

      <div className="page-container">
        {/* Featured Article */}
        {featuredArticle && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-10"
          >
            <Link to={`/magazine/${featuredArticle.slug}`} className="group block md:grid md:grid-cols-2 gap-8 items-center content-section">
              <motion.div 
                className="overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </motion.div>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-pm-gold/70">
                  <span className="px-3 py-1 bg-pm-gold/10 rounded-full text-pm-gold font-medium">
                    {featuredArticle.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(featuredArticle.publishDate).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <h2 className="text-4xl font-playfair text-pm-off-white transition-colors group-hover:text-pm-gold leading-tight">
                  {featuredArticle.title}
                </h2>
                <p className="text-pm-off-white/70 text-lg leading-relaxed">{featuredArticle.excerpt}</p>
                <motion.div 
                  className="flex items-center gap-2 text-pm-gold font-semibold"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>Lire l'article</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </motion.div>
              </div>
            </Link>
          </motion.section>
        )}

        {/* Other Articles Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="wait">
              {currentArticles.map((article, index) => (
                <motion.div
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          {totalPages > 1 && (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.5 }}
               className="mt-12"
             >
               <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
             </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link to={`/magazine/${article.slug}`} className="group block">
    <motion.div 
      className="card-base overflow-hidden relative h-full"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-pm-gold/90 text-pm-dark text-xs font-bold uppercase tracking-wider rounded-full">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-2 text-xs text-pm-gold/70">
          <CalendarIcon className="w-4 h-4" />
          <span>{new Date(article.publishDate).toLocaleDateString('fr-FR')}</span>
        </div>
        <h3 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors leading-tight line-clamp-2">
          {article.title}
        </h3>
        <p className="text-pm-off-white/70 text-sm line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
        <motion.div 
          className="flex items-center gap-2 text-pm-gold font-medium text-sm"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span>Lire l'article</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.div>
      </div>
    </motion.div>
  </Link>
);

export default Magazine;
