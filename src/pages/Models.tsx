import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

// --- Sub-Components ---

const ModelsHero: React.FC<{ image: string }> = ({ image }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-black">
      <motion.div
        style={{ y, backgroundImage: `url('${image}')` }}
        className="absolute inset-0 bg-cover bg-center opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <div className="overflow-hidden mb-4">
          <motion.span
            initial={{ y: 40 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="block text-pm-gold uppercase tracking-[0.3em] text-sm md:text-base font-bold"
          >
            Portfolio
          </motion.span>
        </div>
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair text-white mb-6 leading-tight"
          >
            Nos <span className="italic text-pm-gold">Talents</span>
          </motion.h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
        >
          Découvrez les visages qui incarnent l'avenir de la mode.
          Une diversité de profils uniques, sélectionnés pour leur charisme et leur professionnalisme.
        </motion.p>
      </motion.div>
    </div>
  );
};

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const location = useLocation();

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialSearchTerm = queryParams.get('q') || '';

  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const models = data?.models || [];

  // Sort models by potential priority or randomly if preferred, here just public filter
  const publicModels = useMemo(() => models.filter(model => model.isPublic === true), [models]);

  const filteredModels = useMemo(() => {
    return publicModels
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm, publicModels]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredModels.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredModels, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const seoDescription = useMemo(() => {
    const modelNames = publicModels.slice(0, 3).map(m => m.name).join(', ');
    return `Découvrez le portfolio des mannequins de Perfect Models Management, incluant ${modelNames}. Agence de mannequins leader au Gabon.`;
  }, [publicModels]);

  if (!isInitialized) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="bg-black text-white min-h-screen selection:bg-pm-gold selection:text-black">
      <SEO
        title="Nos Mannequins | Portfolio"
        description={seoDescription}
        keywords="mannequins gabon, agence mode libreville, casting, model models"
        image={publicModels[0]?.imageUrl}
      />

      <ModelsHero image={data?.siteImages.castingBg || 'https://i.ibb.co/K2wS0Pz/hero-bg.jpg'} />

      <div className="container mx-auto px-6 py-12">

        {/* Controls Bar */}
        <div className="sticky top-20 z-30 mb-16 -mx-6 px-6 py-4 bg-black/80 backdrop-blur-md border-y border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl">

          {/* Gender Filters */}
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {(['Tous', 'Femme', 'Homme'] as GenderFilter[]).map((gender) => (
              <button
                key={gender}
                onClick={() => setFilter(gender)}
                className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${filter === gender
                  ? 'bg-pm-gold text-black shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                {gender}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80 group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-pm-gold transition-colors" />
            <input
              type="text"
              placeholder="Chercher un nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-gray-500 focus:outline-none focus:border-pm-gold focus:bg-white/10 transition-all"
            />
          </div>
        </div>

        {/* Models Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 min-h-[500px]"
        >
          <AnimatePresence mode='popLayout'>
            {paginatedModels.map((model) => (
              <motion.div
                layout
                key={model.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
              >
                <ModelCard model={model} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredModels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-2xl font-playfair text-gray-500 mb-4">Aucun résultat trouvé</p>
            <button
              onClick={() => { setFilter('Tous'); setSearchTerm(''); }}
              className="text-pm-gold hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          /* Pagination Controls */
          totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-20">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-3 rounded-full border border-white/20 transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-600' : 'hover:border-pm-gold hover:text-pm-gold text-white'
                  }`}
                aria-label="Page précédente"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === page
                      ? 'bg-pm-gold text-black scale-110'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-3 rounded-full border border-white/20 transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-600' : 'hover:border-pm-gold hover:text-pm-gold text-white'
                  }`}
                aria-label="Page suivante"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          )
        )}
      </div>

      {/* CTA Section */}
      <section className="py-24 border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-playfair text-white mb-6">Rejoignez l'Agence</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Vous pensez avoir le potentiel pour devenir notre prochain visage ?
            Nous sommes constamment à la recherche de nouveaux talents.
          </p>
          <Link to="/casting-formulaire">
            <Button className="px-10 py-4 text-lg">Postuler au Casting</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Models;