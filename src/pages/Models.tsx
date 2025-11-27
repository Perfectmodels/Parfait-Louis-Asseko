import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const location = useLocation();
  
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const initialSearchTerm = queryParams.get('q') || '';

  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const models = data?.models || [];
  
  const publicModels = useMemo(() => models.filter(model => model.isPublic === true), [models]);

  const filteredModels = useMemo(() => {
    return publicModels
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm, publicModels]);
  
  const seoDescription = useMemo(() => {
      const modelNames = publicModels.slice(0, 3).map(m => m.name).join(', ');
      return `Découvrez le portfolio des mannequins de Perfect Models Management, incluant ${modelNames} et bien d'autres. Des visages uniques et professionnels prêts à incarner votre marque au Gabon.`;
  }, [publicModels]);

  const FilterButton: React.FC<{ gender: GenderFilter }> = ({ gender }) => (
    <button
      onClick={() => setFilter(gender)}
      aria-pressed={filter === gender}
      className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 ${filter === gender ? 'bg-pm-gold text-pm-dark shadow-md shadow-pm-gold/30' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}
    >
      {gender}
    </button>
  );

  if (!isInitialized) {
      return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement des mannequins...</div>;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO 
        title="Nos Mannequins | Le Visage de la Mode Gabonaise"
        description={seoDescription}
        keywords="mannequins hommes gabon, mannequins femmes gabon, book mannequins, agence de modèles photo, casting modèles libreville"
        image={publicModels[0]?.imageUrl || data?.siteImages.about}
      />
      
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 lg:py-32 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 to-transparent"></div>
        <div className="relative page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair font-bold text-pm-gold mb-6">
              Nos Mannequins
            </h1>
            <p className="text-lg md:text-xl text-pm-off-white/80 leading-relaxed">
              Découvrez les visages qui définissent l'avenir de la mode. Des talents uniques, prêts à donner vie à vos créations.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-pm-gold/60">
              <UserIcon className="w-5 h-5" />
              <span className="text-sm uppercase tracking-wider">
                {publicModels.length} Mannequins Professionnels
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="page-container">
        {/* Filters and Search */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 p-1 bg-black/50 rounded-full border border-pm-gold/20">
            <FilterButton gender="Tous" />
            <FilterButton gender="Femme" />
            <FilterButton gender="Homme" />
          </div>
          <div className="relative w-full md:w-auto">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/50" />
            <input
              id="search-model"
              type="text"
              placeholder="Rechercher un mannequin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-80 bg-black/50 border border-pm-gold/30 rounded-full pl-12 pr-4 py-3 text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/50 transition-all backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8 flex items-center justify-between"
        >
          <p className="text-pm-off-white/70">
            {filteredModels.length} {filteredModels.length === 1 ? 'mannequin trouvé' : 'mannequins trouvés'}
            {searchTerm && ` pour "${searchTerm}"`}
            {filter !== 'Tous' && ` • ${filter}`}
          </p>
        </motion.div>

        {/* Models Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                exit={{ opacity: 0, y: -30 }}
              >
                <ModelCard model={model} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {filteredModels.length === 0 && (
          <motion.div 
            className="text-center col-span-full py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <UserIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
              <p className="text-pm-off-white/70 text-lg mb-2">Aucun mannequin ne correspond à votre recherche</p>
              <p className="text-pm-off-white/50 text-sm">
                Essayez d'ajuster vos filtres ou votre recherche
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Models;