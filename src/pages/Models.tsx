import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedModelCard from '../components/EnhancedModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import AdvancedLoader from '../components/AdvancedLoader';
import { MagnifyingGlassIcon, FunnelIcon, HeartIcon, Squares2X2Icon, ListBulletIcon, Bars3Icon } from '@heroicons/react/24/outline';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';
type ViewMode = 'grid' | 'list' | 'masonry';
type SortBy = 'name' | 'age' | 'height' | 'experience';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const models = data?.models || [];
  
  const publicModels = useMemo(() => models.filter(model => model.isPublic === true), [models]);

  const filteredModels = useMemo(() => {
    let filtered = publicModels
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Tri des modèles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'age':
          return (a.age || 0) - (b.age || 0);
        case 'height':
          return (a.height || '').localeCompare(b.height || '');
        case 'experience':
          return (a.experience || '').localeCompare(b.experience || '');
        default:
          return 0;
      }
    });
    
    return filtered;
  }, [filter, searchTerm, publicModels, sortBy]);
  
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
      return (
        <AdvancedLoader>
          <div className="min-h-screen flex items-center justify-center text-pm-gold">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
              <p>Chargement des mannequins...</p>
            </div>
          </div>
        </AdvancedLoader>
      );
  }

  if (!data) {
      return (
        <div className="min-h-screen flex items-center justify-center text-pm-gold">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Erreur de chargement</h2>
            <p>Impossible de charger les données des mannequins.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
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
      <div 
        className="relative bg-cover bg-center h-[50vh] flex items-center justify-center text-center"
        style={{ 
          backgroundImage: data?.siteImages?.modelsHero ? `url(${data.siteImages.modelsHero})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 p-4">
          <h1 className="text-5xl font-extrabold text-pm-gold mb-4 drop-shadow-lg">Nos Mannequins</h1>
          <p className="text-xl text-pm-off-white/90 max-w-2xl mx-auto">
            Découvrez les visages qui définissent l'avenir de la mode. Des talents uniques, prêts à donner vie à vos créations.
          </p>
        </div>
      </div>

      <div className="page-container">

        {/* Contrôles avancés */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-8"
        >
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              {/* Recherche */}
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/50" />
                <input
                  type="text"
                  placeholder="Rechercher un mannequin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/50 border border-pm-gold/30 rounded-full pl-10 pr-4 py-3 text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/30 focus:bg-black/70 transition-all duration-300"
                />
              </div>
              
              {/* Bouton de filtres */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-pm-gold/10 border border-pm-gold/30 rounded-full text-pm-gold hover:bg-pm-gold/20 transition-colors"
              >
                <FunnelIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Filtres</span>
                <Bars3Icon className="w-4 h-4" />
              </button>
            </div>
            
            {/* Contrôles de vue */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-black/50 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'
                  }`}
                >
                  <Squares2X2Icon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'
                  }`}
                >
                  <ListBulletIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Panneau de filtres avancés */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-2xl p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Filtre par genre */}
                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">Genre</label>
                    <div className="flex gap-2">
                      <FilterButton gender="Tous" />
                      <FilterButton gender="Femme" />
                      <FilterButton gender="Homme" />
                    </div>
                  </div>
                  
                  {/* Tri */}
                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">Trier par</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortBy)}
                      className="w-full bg-black/50 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white focus:outline-none focus:border-pm-gold"
                    >
                      <option value="name">Nom</option>
                      <option value="age">Âge</option>
                      <option value="height">Taille</option>
                      <option value="experience">Expérience</option>
                    </select>
                  </div>
                  
                  {/* Favoris */}
                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">Favoris</label>
                    <button
                      onClick={() => setFavorites([])}
                      className="flex items-center gap-2 px-3 py-2 bg-pm-gold/10 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/20 transition-colors"
                    >
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-sm">Effacer ({favorites.length})</span>
                    </button>
                  </div>
                  
                  {/* Statistiques */}
                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">Résultats</label>
                    <div className="text-pm-off-white/70 text-sm">
                      {filteredModels.length} mannequin{filteredModels.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Models Grid avec vues adaptatives */}
        <motion.div 
          layout
          className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
              : viewMode === 'list'
              ? 'space-y-4'
              : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
          }`}
        >
          <AnimatePresence>
            {filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                whileHover={{ y: viewMode === 'grid' ? -5 : 0 }}
                className={`${
                  viewMode === 'list' 
                    ? 'bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-4 hover:border-pm-gold transition-colors'
                    : ''
                }`}
              >
                <EnhancedModelCard 
                  model={model} 
                  index={index}
                  viewMode={viewMode}
                  isFavorite={favorites.includes(model.id)}
                  onToggleFavorite={(id) => {
                    setFavorites(prev => 
                      prev.includes(id) 
                        ? prev.filter(fav => fav !== id)
                        : [...prev, id]
                    );
                  }}
                />
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
