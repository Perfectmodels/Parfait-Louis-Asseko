import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import ModelCard from '../components/ModelCard';
import { 
  FunnelIcon, 
  MagnifyingGlassIcon, 
  XMarkIcon, 
  AdjustmentsHorizontalIcon,
  ArrowsUpDownIcon,
  UserCircleIcon,
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';
type SortBy = 'name' | 'experience' | 'popularity';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [heightRange, setHeightRange] = useState<[number, number]>([150, 200]);
  const [isLoading, setIsLoading] = useState(true);

  const models = data?.models || [];
  
  // Simulate loading
  useEffect(() => {
    if (isInitialized) {
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isInitialized]);

  // Get all available categories
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    models.forEach(model => {
      model.categories?.forEach(cat => categories.add(cat));
    });
    return Array.from(categories);
  }, [models]);
  
  // Filter and sort models
  const filteredModels = useMemo(() => {
    let result = [...models]
      .filter(model => model.isPublic === true)
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.categories?.some(cat => 
          cat.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
      .filter(model => {
        if (selectedCategories.length === 0) return true;
        return selectedCategories.some(cat => 
          model.categories?.includes(cat)
        );
      })
      .filter(model => {
        const modelHeight = parseInt(model.height);
        return modelHeight >= heightRange[0] && modelHeight <= heightRange[1];
      });

    // Sort models
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'experience':
          return (b.experienceYears || 0) - (a.experienceYears || 0);
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [models, filter, searchTerm, sortBy, selectedCategories, heightRange]);
  
  const seoDescription = useMemo(() => {
    const modelNames = models.slice(0, 3).map(m => m.name).join(', ');
    return `Découvrez le portfolio des mannequins de Perfect Models Management, incluant ${modelNames} et bien d'autres. Des profils uniques et professionnels prêts à incarner votre marque au Gabon.`;
  }, [models]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Composant FilterButton
  const FilterButton: React.FC<{ gender: GenderFilter }> = ({ gender }) => (
    <button
      onClick={() => setFilter(gender)}
      aria-pressed={filter === gender}
      className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 ${
        filter === gender 
          ? 'bg-pm-gold text-pm-dark font-bold shadow-md shadow-pm-gold/30' 
          : 'bg-pm-dark/50 border border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10'
      }`}
    >
      {gender}
    </button>
  );

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pm-dark">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-pm-gold text-lg font-medium">Chargement des mannequins...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black text-pm-off-white">
      <SEO 
        title="Nos Mannequins | Le Visage de la Mode Gabonaise"
        description={seoDescription}
        keywords="mannequins hommes gabon, mannequins femmes gabon, book mannequins, agence de modèles photo, casting modèles libreville, mannequinat gabon, modèles africains"
        image={models[0]?.imageUrl || data?.siteImages.about}
      />
      
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-pm-dark/90 to-black/90 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-pm-gold mb-6">
              Découvrez Nos Talents
            </h1>
            <p className="text-xl md:text-2xl text-pm-off-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Une sélection exclusive de mannequins professionnels prêts à donner vie à vos projets créatifs.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-pm-gold/70" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 border border-pm-gold/30 bg-pm-dark/50 text-pm-off-white rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  placeholder="Rechercher un mannequin, une catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <XMarkIcon className="h-5 w-5 text-pm-gold/70 hover:text-pm-gold" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <FilterButton gender="Tous" />
              <FilterButton gender="Femme" />
              <FilterButton gender="Homme" />
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 text-sm uppercase tracking-widest rounded-full transition-all duration-300 flex items-center gap-2 ${
                  showFilters 
                    ? 'bg-pm-gold text-pm-dark font-bold' 
                    : 'bg-pm-dark/50 border border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10'
                }`}
              >
                <AdjustmentsHorizontalIcon className="w-5 h-5" />
                <span>Filtres avancés</span>
              </button>
            </div>
            
            {/* Active Filters */}
            {(searchTerm || selectedCategories.length > 0 || filter !== 'Tous' || heightRange[0] > 150 || heightRange[1] < 200) && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                <span className="text-sm text-pm-off-white/70">Filtres actifs :</span>
                
                {filter !== 'Tous' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pm-gold/20 text-pm-gold">
                    {filter}
                    <button 
                      onClick={() => setFilter('Tous')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pm-gold/30 hover:bg-pm-gold/50"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pm-gold/20 text-pm-gold">
                    {searchTerm}
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pm-gold/30 hover:bg-pm-gold/50"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                {selectedCategories.map(category => (
                  <span key={category} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pm-gold/20 text-pm-gold">
                    {category}
                    <button 
                      onClick={() => toggleCategory(category)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pm-gold/30 hover:bg-pm-gold/50"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                
                {(heightRange[0] > 150 || heightRange[1] < 200) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pm-gold/20 text-pm-gold">
                    Taille: {heightRange[0]} - {heightRange[1]} cm
                    <button 
                      onClick={() => setHeightRange([150, 200])}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pm-gold/30 hover:bg-pm-gold/50"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </span>
                )}
                
                <button 
                  onClick={() => {
                    setFilter('Tous');
                    setSearchTerm('');
                    setSelectedCategories([]);
                    setHeightRange([150, 200]);
                  }}
                  className="text-xs text-pm-gold hover:underline ml-2"
                >
                  Tout effacer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div 
            className="bg-pm-dark/50 border border-pm-gold/20 rounded-xl p-6 mb-12 overflow-hidden"
            style={{
              transition: 'all 0.3s ease',
              opacity: showFilters ? 1 : 0,
              height: showFilters ? 'auto' : 0,
              overflow: 'hidden'
            }}
          >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Categories Filter */}
                <div>
                  <h3 className="text-lg font-medium text-pm-gold mb-4 flex items-center">
                    <FunnelIcon className="w-5 h-5 mr-2" />
                    Catégories
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {allCategories.map(category => (
                      <label key={category} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="form-checkbox h-4 w-4 text-pm-gold bg-pm-dark border-pm-gold/50 rounded focus:ring-pm-gold"
                        />
                        <span className="text-pm-off-white/90">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Height Range Filter */}
                <div>
                  <h3 className="text-lg font-medium text-pm-gold mb-4">Taille (cm)</h3>
                  <div className="px-2">
                    <div className="flex justify-between text-sm text-pm-off-white/70 mb-2">
                      <span>{heightRange[0]} cm</span>
                      <span>{heightRange[1]} cm</span>
                    </div>
                    <div className="relative pt-1">
                      <div className="h-1 bg-pm-gold/20 rounded-full">
                        <div 
                          className="absolute h-1 bg-pm-gold rounded-full"
                          style={{
                            left: `${((heightRange[0] - 150) / 50) * 100}%`,
                            width: `${((heightRange[1] - heightRange[0]) / 50) * 100}%`
                          }}
                        ></div>
                      </div>
                      <input
                        type="range"
                        min="150"
                        max="200"
                        step="1"
                        value={heightRange[0]}
                        onChange={(e) => setHeightRange([parseInt(e.target.value), heightRange[1]])}
                        className="absolute w-full h-1 opacity-0 cursor-pointer"
                      />
                      <input
                        type="range"
                        min="150"
                        max="200"
                        step="1"
                        value={heightRange[1]}
                        onChange={(e) => setHeightRange([heightRange[0], parseInt(e.target.value)])}
                        className="absolute w-full h-1 opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sorting */}
                <div>
                  <h3 className="text-lg font-medium text-pm-gold mb-4 flex items-center">
                    <ArrowsUpDownIcon className="w-5 h-5 mr-2" />
                    Trier par
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setSortBy('name')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        sortBy === 'name' 
                          ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/50' 
                          : 'text-pm-off-white/80 hover:bg-pm-dark/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <UserCircleIcon className="w-5 h-5 mr-2" />
                        <span>Ordre alphabétique</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setSortBy('experience')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        sortBy === 'experience' 
                          ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/50' 
                          : 'text-pm-off-white/80 hover:bg-pm-dark/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <StarIcon className="w-5 h-5 mr-2" />
                        <span>Expérience</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setSortBy('popularity')}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        sortBy === 'popularity' 
                          ? 'bg-pm-gold/20 text-pm-gold border border-pm-gold/50' 
                          : 'text-pm-off-white/80 hover:bg-pm-dark/50'
                      }`}
                    >
                      <div className="flex items-center">
                        <HeartIcon className="w-5 h-5 mr-2" />
                        <span>Popularité</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
          </div>
        )}
        
        {/* Models Grid */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-playfair font-bold text-pm-gold">
              {filteredModels.length} mannequin{filteredModels.length !== 1 ? 's' : ''} trouvé{filteredModels.length !== 1 ? 's' : ''}
            </h2>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="appearance-none bg-pm-dark/50 border border-pm-gold/30 text-pm-off-white rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              >
                <option value="name">Trier par: Nom</option>
                <option value="experience">Trier par: Expérience</option>
                <option value="popularity">Trier par: Popularité</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pm-gold">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          {filteredModels.length === 0 ? (
            <div className="text-center py-16 bg-pm-dark/30 rounded-xl border border-pm-gold/10">
              <svg className="mx-auto h-16 w-16 text-pm-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-pm-off-white">Aucun mannequin trouvé</h3>
              <p className="mt-2 text-pm-off-white/60">Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.</p>
              <button 
                onClick={() => {
                  setFilter('Tous');
                  setSearchTerm('');
                  setSelectedCategories([]);
                  setHeightRange([150, 200]);
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pm-dark bg-pm-gold hover:bg-pm-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModels.map((model) => (
                <div key={model.id} className="opacity-0 animate-fadeIn" style={{ animationDelay: `${Math.random() * 0.3}s` }}>
                  <ModelCard model={model} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Call to Action */}
        <div className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-playfair font-bold text-pm-gold mb-4">Vous cherchez un profil spécifique ?</h3>
          <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
            Notre équipe est à votre écoute pour vous aider à trouver le mannequin parfait pour votre projet.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/contact"
              className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
            >
              Nous contacter
            </a>
            <a
              href="/casting"
              className="px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold/10 hover:scale-105"
            >
              Voir les castings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Models;
