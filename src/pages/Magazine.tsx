import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  EyeIcon, 
  HeartIcon,
  ShareIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const Magazine: React.FC = () => {
  const { data } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pm-gold">
        Chargement...
      </div>
    );
  }

  const { articles } = data;

  const categories = ['Tous', 'Mode', 'Beauté', 'Lifestyle', 'Actualités'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title="Magazine | Perfect Models Management"
        description="Découvrez notre magazine mode avec les dernières tendances, conseils beauté et actualités de l'industrie de la mode au Gabon."
        keywords="magazine mode gabon, tendances mode, beauté, lifestyle, actualités mode, perfect models magazine"
        socialImage={{
          title: "Magazine Mode",
          subtitle: "Tendances & Actualités",
          backgroundImage: data?.siteImages?.magazine || data?.siteImages?.hero
        }}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6"
          >
            Notre Magazine
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-8"
          >
            Découvrez les dernières tendances, conseils beauté et actualités 
            de l'univers de la mode gabonaise.
          </motion.p>
        </div>
      </section>

      <div className="page-container">
        {/* Search and Filter */}
        <section className="py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/50" />
              <input
                type="text"
                placeholder="Rechercher un article..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-pm-gold" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-black border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:outline-none focus:border-pm-gold"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <section className="py-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-96">
                  <img 
                    src={filteredArticles[0].imageUrl} 
                    alt={filteredArticles[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold rounded-full">
                      Article vedette
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs font-semibold rounded">
                      {filteredArticles[0].category}
                    </span>
                    <span className="text-pm-off-white/60 text-sm">
                      {new Date(filteredArticles[0].publishedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <h2 className="text-3xl font-playfair text-pm-gold mb-4">
                    {filteredArticles[0].title}
                  </h2>
                  <p className="text-pm-off-white/80 mb-6">
                    {filteredArticles[0].excerpt}
                  </p>
                  <Link
                    to={`/magazine/${filteredArticles[0].slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20 w-fit"
                  >
                    Lire l'article
                    <EyeIcon className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Articles Grid */}
        <section className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(1).map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-xl overflow-hidden hover:border-pm-gold/40 transition-all duration-300 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.imageUrl} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs font-semibold rounded">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3 text-sm text-pm-off-white/60">
                    <CalendarDaysIcon className="w-4 h-4" />
                    <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <h3 className="text-xl font-playfair text-pm-gold mb-3 group-hover:text-white transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-pm-off-white/70 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/magazine/${article.slug}`}
                      className="text-pm-gold hover:text-white font-semibold text-sm transition-colors"
                    >
                      Lire la suite →
                    </Link>
                    <div className="flex items-center gap-3">
                      <button className="text-pm-off-white/60 hover:text-pm-gold transition-colors">
                        <HeartIcon className="w-4 h-4" />
                      </button>
                      <button className="text-pm-off-white/60 hover:text-pm-gold transition-colors">
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <p className="text-pm-off-white/70 mb-4">
                Aucun article ne correspond à votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('Tous');
                }}
                className="px-6 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-pm-gold/90 transition"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Magazine;