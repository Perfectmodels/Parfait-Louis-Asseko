import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { MagnifyingGlassIcon, ArrowLongRightIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { Article } from '../types';
import { useData } from '../contexts/DataContext';
import Pagination from '../components/Pagination';
import Button from '../components/ui/Button';

// --- Sub-Components ---

const Hero: React.FC<{ image: string }> = ({ image }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, backgroundImage: `url('${image}')` }} className="absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="block text-pm-gold uppercase tracking-[0.3em] font-bold mb-4"
        >
          Édition En Ligne
        </motion.span>
        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight"
        >
          Focus Model 241
        </motion.h1>
      </div>
    </div>
  );
};

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Link to={`/magazine/${article.slug}`} className="group block h-full">
    <div className="relative h-80 overflow-hidden mb-6">
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      <img
        src={article.imageUrl}
        alt={article.title}
        className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute top-4 left-4 bg-pm-gold text-black text-xs font-bold uppercase tracking-widest px-3 py-1">
        {article.category}
      </div>
    </div>
    <div className="pr-4">
      <div className="flex items-center text-gray-500 text-xs uppercase tracking-widest mb-3 space-x-2">
        <span>{new Date(article.date).toLocaleDateString()}</span>
        <span>•</span>
        <span>{article.author}</span>
      </div>
      <h3 className="text-2xl font-playfair text-white mb-3 group-hover:text-pm-gold transition-colors leading-snug">
        {article.title}
      </h3>
      <p className="text-gray-400 text-sm line-clamp-3 mb-4">
        {article.excerpt}
      </p>
      <span className="inline-flex items-center text-pm-gold text-xs font-bold uppercase tracking-widest group-hover:underline">
        Lire l'article <ArrowLongRightIcon className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
);

const Magazine: React.FC = () => {
  const { data, isInitialized } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const ARTICLES_PER_PAGE = 9;

  const articles = data?.articles || [];

  // Logic: First find Featured, then filter remaining
  // If a category is selected, filtering applies to ALL articles.
  // The Featured article is only shown prominently if "Tous" is selected or if it matches the category.

  let filteredArticles = articles;
  if (activeCategory !== 'Tous') {
    filteredArticles = articles.filter(a => a.category === activeCategory);
  }

  // Identify featured article from the filtered set
  const featuredArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  const listArticles = filteredArticles.filter(a => a.slug !== featuredArticle?.slug);

  const totalPages = Math.ceil(listArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const currentArticles = listArticles.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  const categories = ['Tous', ...Array.from(new Set(articles.map(a => a.category)))];

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="bg-black text-white selection:bg-pm-gold selection:text-black min-h-screen">
      <SEO
        title="Magazine | Focus Model 241"
        description="Plongez dans les coulisses de la mode gabonaise avec Focus Model 241. Interviews, tendances et conseils."
        image={featuredArticle?.imageUrl}
      />

      {/* Hero */}
      <Hero image={featuredArticle?.imageUrl || data?.siteImages?.hero || ''} />

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-black/80 backdrop-blur border-y border-white/10 py-4">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between min-w-max gap-8">
            <div className="flex space-x-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
                  className={`text-sm uppercase tracking-widest transition-colors ${activeCategory === cat ? 'text-pm-gold font-bold' : 'text-gray-500 hover:text-white'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Simple Search Placeholder - Functional in future */}
            <div className="hidden md:flex items-center text-gray-500 border-b border-gray-700 pb-1">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
              <span className="text-xs uppercase tracking-widest">Rechercher</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">

        {/* Featured Article Section */}
        <AnimatePresence mode="wait">
          {featuredArticle && currentPage === 1 && (
            <motion.section
              key={featuredArticle.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-24"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative group overflow-hidden h-[500px]">
                  <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
                <div>
                  <span className="text-pm-gold text-sm font-bold uppercase tracking-widest mb-4 block">À la une</span>
                  <h2 className="text-4xl md:text-5xl font-playfair text-white mb-6 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <Link to={`/magazine/${featuredArticle.slug}`}>
                    <Button variant="outline" className="px-8">Lire l'article complet</Button>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Article Grid */}
        <motion.section
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-4">
            <h3 className="text-2xl font-playfair text-white">Récents</h3>
            <span className="text-gray-500 text-xs uppercase tracking-widest">
              Page {currentPage} / {totalPages}
            </span>
          </div>

          {currentArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {currentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500 italic">
              Aucun article trouvé dans cette catégorie.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.section>

      </div>

      {/* Newsletter Section */}
      <section className="bg-white/5 py-24 mt-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <EnvelopeIcon className="w-12 h-12 text-pm-gold mx-auto mb-6" />
          <h2 className="text-3xl font-playfair text-white mb-4">Abonnez-vous à notre Newsletter</h2>
          <p className="text-gray-400 mb-8">Recevez les dernières tendances, les interviews exclusives et les actualités de l'agence directement dans votre boîte mail.</p>
          <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 bg-black/50 border border-white/10 text-white px-6 py-3 focus:outline-none focus:border-pm-gold transition-colors"
            />
            <Button variant="primary">S'abonner</Button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Magazine;
