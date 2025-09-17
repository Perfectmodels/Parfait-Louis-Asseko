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
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-center"
        style={{ 
          backgroundImage: data?.siteImages?.magazineHero ? `url(${data.siteImages.magazineHero})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl font-extrabold text-pm-gold mb-4 drop-shadow-lg">FOCUS MODEL 241</h1>
          <p className="text-xl text-pm-off-white/90 max-w-2xl mx-auto">
            Le magazine en ligne de Perfect Models Management. Plongez dans les coulisses de la mode gabonaise.
          </p>
        </div>
      </div>

      <header className="bg-black py-8 border-b-2 border-pm-gold">
        <div className="container mx-auto px-6 text-center">
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
            className="mb-12 md:mb-16"
          >
            <div className="content-section">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-playfair text-pm-gold mb-2">Article Vedette</h2>
                <div className="w-24 h-1 bg-pm-gold mx-auto"></div>
              </div>
              
              <Link to={`/magazine/${featuredArticle.slug}`} className="group block">
                <div className="bg-black border-2 border-pm-gold/30 rounded-2xl overflow-hidden hover:border-pm-gold transition-all duration-300 hover:shadow-2xl hover:shadow-pm-gold/30">
                  <div className="md:grid md:grid-cols-2 gap-0">
                    {/* Image principale */}
                    <motion.div 
                      className="relative h-80 md:h-full overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={featuredArticle.imageUrl} 
                        alt={featuredArticle.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Badge vedette */}
                      <div className="absolute top-6 left-6">
                        <span className="px-4 py-2 bg-pm-gold text-pm-dark text-sm font-bold uppercase tracking-wider rounded-full shadow-lg">
                          ⭐ Article Vedette
                        </span>
                      </div>
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-6 right-6">
                        <span className="px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                          {featuredArticle.category}
                        </span>
                      </div>
                      
                      {/* Badge temps de lecture */}
                      <div className="absolute bottom-6 right-6">
                        <div className="flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full">
                          <ClockIcon className="w-4 h-4" />
                          <span>8 min</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Contenu */}
                    <div className="p-8 md:p-12 flex flex-col justify-center space-y-6">
                      {/* Métadonnées */}
                      <div className="flex items-center justify-between text-sm text-pm-gold/70">
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5" />
                          <span>{new Date(featuredArticle.publishDate).toLocaleDateString('fr-FR', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>Par {featuredArticle.author}</span>
                        </div>
                      </div>
                      
                      {/* Titre */}
                      <h2 className="text-3xl md:text-4xl font-playfair text-pm-off-white transition-colors group-hover:text-pm-gold leading-tight">
                        {featuredArticle.title}
                      </h2>
                      
                      {/* Extrait */}
                      <p className="text-pm-off-white/80 text-lg leading-relaxed line-clamp-4">
                        {featuredArticle.excerpt}
                      </p>
                      
                      {/* Tags si disponibles */}
                      {featuredArticle.tags && featuredArticle.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {featuredArticle.tags.slice(0, 4).map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-pm-dark text-pm-gold text-sm rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {/* Call to action */}
                      <motion.div 
                        className="flex items-center gap-3 text-pm-gold font-semibold text-lg pt-4 border-t border-pm-gold/20"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>Lire l'article complet</span>
                        <ArrowRightIcon className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </motion.section>
        )}

        {/* Filtres et recherche */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="content-section">
            <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <h3 className="text-lg font-semibold text-pm-gold">Filtrer les articles</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Tous', 'Interview', 'Événement', 'Tendance', 'Conseils'].map(category => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          category === 'Tous' 
                            ? 'bg-pm-gold text-pm-dark' 
                            : 'bg-pm-dark text-pm-off-white hover:bg-pm-gold/20'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-pm-off-white/60">
                  {otherArticles.length} article{otherArticles.length > 1 ? 's' : ''} disponible{otherArticles.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Other Articles Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="content-section">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair text-pm-gold mb-2">Tous les Articles</h2>
              <div className="w-24 h-1 bg-pm-gold mx-auto"></div>
            </div>
            
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
          </div>
        </motion.section>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link to={`/magazine/${article.slug}`} className="group block">
    <motion.div 
      className="bg-black border border-pm-gold/20 rounded-xl overflow-hidden relative h-full hover:border-pm-gold transition-all duration-300 hover:shadow-2xl hover:shadow-pm-gold/20"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image principale avec overlay */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        
        {/* Badge catégorie */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
            {article.category}
          </span>
        </div>
        
        {/* Badge temps de lecture */}
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-xs rounded-full">
            <ClockIcon className="w-3 h-3" />
            <span>5 min</span>
          </div>
        </div>
        
        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-pm-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Contenu de l'article */}
      <div className="p-6 space-y-4">
        {/* Métadonnées */}
        <div className="flex items-center justify-between text-xs text-pm-gold/70">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <span>{new Date(article.publishDate).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Par {article.author}</span>
          </div>
        </div>
        
        {/* Titre */}
        <h3 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors leading-tight line-clamp-2">
          {article.title}
        </h3>
        
        {/* Extrait */}
        <p className="text-pm-off-white/70 text-sm line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
        
        {/* Tags si disponibles */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-pm-dark text-pm-gold text-xs rounded">
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="px-2 py-1 bg-pm-dark text-pm-off-white/60 text-xs rounded">
                +{article.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Call to action */}
        <motion.div 
          className="flex items-center justify-between pt-2 border-t border-pm-gold/10"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-pm-gold font-medium text-sm">Lire l'article</span>
          <ArrowRightIcon className="w-4 h-4 text-pm-gold group-hover:translate-x-1 transition-transform duration-200" />
        </motion.div>
      </div>
    </motion.div>
  </Link>
);

export default Magazine;
