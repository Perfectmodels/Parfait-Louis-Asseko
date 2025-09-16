import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');

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
      <div className="page-container">
        <h1 className="page-title">Nos Mannequins</h1>
        <p className="page-subtitle">
          Découvrez les visages qui définissent l'avenir de la mode. Des talents uniques, prêts à donner vie à vos créations.
        </p>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 lg:mb-8"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2 text-pm-gold/70">
              <FunnelIcon className="w-5 h-5" />
              <span className="text-sm font-medium">Filtrer :</span>
            </div>
            <FilterButton gender="Tous" />
            <FilterButton gender="Femme" />
            <FilterButton gender="Homme" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full md:w-auto relative"
          >
            <label htmlFor="search-model" className="sr-only">Rechercher un mannequin</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/50" />
              <input
                id="search-model"
                type="text"
                placeholder="Rechercher un mannequin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-black/50 border border-pm-gold/30 rounded-full pl-10 pr-4 py-3 text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/30 focus:bg-black/70 transition-all duration-300"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Models Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ y: -5 }}
              >
                <ModelCard model={model} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <AnimatePresence>
          {filteredModels.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center col-span-full py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-pm-gold/10 rounded-full flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-12 h-12 text-pm-gold/50" />
                </div>
                <h3 className="text-xl font-semibold text-pm-off-white mb-2">Aucun résultat trouvé</h3>
                <p className="text-pm-off-white/70 mb-4">
                  Aucun mannequin ne correspond à votre recherche. Essayez de modifier vos critères.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('Tous');
                  }}
                  className="px-6 py-2 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded-full hover:bg-pm-gold/30 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Models;
