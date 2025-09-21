
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import PublicPageLayout from '../components/PublicPageLayout';
import Pagination from '../components/Pagination';
import { Article } from '../types';
import { CalendarDaysIcon, ClockIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Magazine: React.FC = () => {
  const { data, isInitialized } = useData();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const ARTICLES_PER_PAGE = 6;

  const articles = data?.articles || [];

  const featuredArticle = useMemo(() => articles.find(a => a.isFeatured) || articles[0], [articles]);
  
  const filteredArticles = useMemo(() => {
    return articles
      .filter(a => a.slug !== featuredArticle?.slug)
      .filter(a => filter === 'Tous' || a.category === filter)
      .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [articles, featuredArticle, filter, searchTerm]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const currentArticles = filteredArticles.slice((currentPage - 1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE);

  const categories = useMemo(() => ['Tous', ...new Set(articles.map(a => a.category))], [articles]);

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  return (
    <PublicPageLayout
      title="Focus Model 241"
      subtitle="Le magazine de la mode gabonaise. Analyses, interviews et tendances, par Perfect Models Management."
      heroImage={data?.siteImages.magazineHero}
    >
      <div className="space-y-16">
        {/* Featured Article */}
        {featuredArticle && <FeaturedArticleCard article={featuredArticle} />}

        {/* Articles Section */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-pm-off-white">Tous les articles</h2>
            <div className="relative min-w-full sm:min-w-[300px]">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-gold/60" />
                <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-black/40 border border-pm-gold/30 rounded-full pl-12 pr-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all"
                />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === c ? 'bg-pm-gold text-pm-dark font-semibold' : 'bg-black/50 hover:bg-black/80'}`}>{c}</button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {currentArticles.length > 0 ? (
              <motion.div
                key={filter + searchTerm + currentPage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentArticles.map((article, index) => (
                    <ArticleCard key={article.slug} article={article} index={index} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div key="no-results" className="text-center py-16">
                <p className="text-xl text-pm-off-white/80">Aucun article ne correspond à votre recherche.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </PublicPageLayout>
  );
};

const FeaturedArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    <Link to={`/magazine/${article.slug}`} className="group block rounded-2xl overflow-hidden bg-black/30 border border-pm-gold/20 hover:border-pm-gold/50 transition-all duration-300 shadow-lg hover:shadow-pm-gold/10">
      <div className="md:grid md:grid-cols-5 gap-6 items-center">
        <div className="md:col-span-3 h-64 md:h-full overflow-hidden">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="md:col-span-2 p-8 space-y-4">
          <span className="inline-block bg-pm-gold/10 text-pm-gold text-sm font-semibold px-3 py-1 rounded-full">Article à la une</span>
          <h2 className="text-3xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors">{article.title}</h2>
          <p className="text-pm-off-white/70 line-clamp-3">{article.excerpt}</p>
          <div className="flex items-center justify-between text-sm text-pm-off-white/60 pt-4 border-t border-pm-gold/10">
            <span>{new Date(article.publishDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <div className="flex items-center gap-2 text-pm-gold font-semibold">
              <span>Lire la suite</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.section>
);

const ArticleCard: React.FC<{ article: Article; index: number }> = ({ article, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    >
        <Link to={`/magazine/${article.slug}`} className="group block h-full">
            <div className="h-full bg-black/30 border border-pm-gold/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-pm-gold/50 hover:shadow-xl hover:shadow-pm-gold/10 flex flex-col">
                <div className="h-56 overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                    <p className="text-sm text-pm-gold mb-2">{article.category}</p>
                    <h3 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors line-clamp-2 flex-grow">{article.title}</h3>
                    <div className="flex items-center justify-between text-sm text-pm-off-white/60 mt-4 pt-4 border-t border-pm-gold/10">
                        <span>{new Date(article.publishDate).toLocaleDateString('fr-FR')}</span>
                        <div className="flex items-center gap-2 text-pm-gold font-semibold">
                            <span>Lire</span>
                            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);

export default Magazine;
