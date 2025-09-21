import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedModelCard from '../components/EnhancedModelCard';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { MagnifyingGlassIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';
type ViewMode = 'grid' | 'list';
type SortBy = 'name' | 'age' | 'height';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [showFilters, setShowFilters] = useState(false);

  const models = data?.models || [];
  const publicModels = useMemo(() => models.filter(model => model.isPublic), [models]);

  const filteredModels = useMemo(() => {
    let results = publicModels
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));

    results.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'age': return (a.age || 0) - (b.age || 0);
        case 'height': return (b.height || 0) - (a.height || 0);
        default: return 0;
      }
    });

    return results;
  }, [filter, searchTerm, sortBy, publicModels]);

  if (!isInitialized) {
    return <div className=\"min-h-screen bg-pm-dark\"></div>;
  }

  const pageTitle = "Nos Mannequins";
  const pageSubtitle = "Découvrez les visages qui définissent l'élégance et le professionnalisme. Des talents uniques prêts à incarner vos projets.";
  const heroImage = data?.siteImages.hero;

  return (
    <div className=\"bg-pm-dark\">
      <SEO 
        title={pageTitle}
        description={pageSubtitle}
        image={heroImage}
      />

      {/* Hero Section */}
      <div className=\"relative h-[90vh] min-h-[700px] text-white overflow-hidden\">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className=\"absolute inset-0\"
        >
          <div
            className=\"absolute inset-0 bg-cover bg-center bg-no-repeat\"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className=\"absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent\" />
        </motion.div>
        
        <div className=\"container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative\">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className=\"text-6xl md:text-8xl font-playfair font-bold text-white mb-6\"
          >
            {pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className=\"text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-8\"
          >
            {pageSubtitle}
          </motion.p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className=\"container mx-auto px-6 py-12 md:py-20\">
        <div className=\"space-y-12\">
          {/* Barre de contrôle */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className=\"bg-black/30 border border-pm-gold/20 rounded-2xl p-4 md:p-6 shadow-lg backdrop-blur-sm space-y-4\"
          >
            <div className=\"flex flex-wrap items-center justify-between gap-4\">
              <div className=\"relative flex-grow max-w-sm\">
                <MagnifyingGlassIcon className=\"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pm-gold/60\" />
                <input
                  type=\"text\"
                  placeholder=\"Rechercher par nom...\"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className=\"w-full bg-black/40 border border-pm-gold/30 rounded-full pl-12 pr-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all\"
                />
              </div>
              <div className=\"flex items-center gap-2\">
                  <button onClick={() => setShowFilters(!showFilters)} className=\"flex items-center gap-2 px-4 py-3 bg-pm-gold/10 text-pm-gold rounded-full hover:bg-pm-gold/20 transition-colors\">
                      <FunnelIcon className=\"w-5 h-5\" />
                      <span>Filtres</span>
                      <ChevronDownIcon className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <div className=\"flex items-center bg-black/40 border border-pm-gold/30 rounded-full p-1\">
                      <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-colors ${viewMode === 'grid' ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'}`}><Squares2X2Icon className=\"w-5 h-5\" /></button>
                      <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-colors ${viewMode === 'list' ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'}`}><ListBulletIcon className=\"w-5 h-5\" /></button>
                  </div>
              </div>
            </div>

            <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: 'auto', opacity: 1, marginTop: '16px' }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className=\"overflow-hidden\"
              >
                <div className=\"grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-pm-gold/20\">
                    <div>
                        <label className=\"block text-sm font-medium text-pm-gold mb-2\">Genre</label>
                        <div className=\"flex flex-wrap gap-2\">
                            {(['Tous', 'Femme', 'Homme'] as GenderFilter[]).map(g => (
                                <button key={g} onClick={() => setFilter(g)} className={`px-4 py-2 text-sm rounded-full transition-colors ${filter === g ? 'bg-pm-gold text-pm-dark font-semibold' : 'bg-black/50 hover:bg-black/80'}`}>{g}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className=\"block text-sm font-medium text-pm-gold mb-2\">Trier par</label>
                        <select onChange={e => setSortBy(e.target.value as SortBy)} value={sortBy} className=\"w-full bg-black/50 border border-pm-gold/30 rounded-full px-4 py-2 text-pm-off-white focus:outline-none focus:ring-1 focus:ring-pm-gold\">
                            <option value=\"name\">Nom</option>
                            <option value=\"age\">Âge</option>
                            <option value=\"height\">Taille</option>
                        </select>
                    </div>
                </div>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>

          {/* Grille des mannequins */}
          <AnimatePresence mode=\"wait\">
            {filteredModels.length > 0 ? (
              <motion.div
                key=\"model-list\"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8' : 'space-y-4'}
              >
                {filteredModels.map((model, index) => (
                  <EnhancedModelCard key={model.id} model={model} index={index} viewMode={viewMode} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key=\"no-results\"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className=\"text-center py-16 md:py-24\"
              >
                  <div className=\"w-24 h-24 bg-pm-gold/10 border-2 border-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-6\">
                      <MagnifyingGlassIcon className=\"w-12 h-12 text-pm-gold/50\" />
                  </div>
                  <h3 className=\"text-2xl font-bold text-pm-off-white mb-2\">Aucun mannequin trouvé</h3>
                  <p className=\"text-pm-off-white/70 max-w-md mx-auto mb-6\">Essayez d'ajuster vos filtres ou votre recherche pour trouver le talent parfait.</p>
                  <button 
                    onClick={() => { setSearchTerm(''); setFilter('Tous'); }}
                    className=\"flex items-center gap-2 mx-auto px-6 py-3 bg-pm-gold/20 text-pm-gold rounded-full hover:bg-pm-gold/30 transition-colors\"
                  >
                    <XMarkIcon className=\"w-5 h-5\" />
                    <span>Réinitialiser les filtres</span>
                  </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Models;
