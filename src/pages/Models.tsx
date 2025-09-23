import React, { useState, useMemo } from 'react';
import EnhancedModelCard from '../components/EnhancedModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const models = data?.models || [];

  // Ne garder que les mannequins publics
  const publicModels = useMemo(
    () => models.filter((model) => model.isPublic === true),
    [models]
  );

  // Filtrage + recherche
  const filteredModels = useMemo(() => {
    return publicModels
      .filter((model) => filter === 'Tous' || model.gender === filter)
      .filter((model) =>
        model.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
  }, [filter, searchTerm, publicModels]);

  // Description SEO auto
  const seoDescription = useMemo(() => {
    const modelNames = publicModels.slice(0, 3).map((m) => m.name).join(', ');
    return `Découvrez le portfolio des mannequins de Perfect Models Management, incluant ${modelNames} et bien d'autres. Des visages uniques et professionnels prêts à incarner votre marque au Gabon.`;
  }, [publicModels]);

  const FilterButton: React.FC<{ gender: GenderFilter }> = ({ gender }) => (
    <button
      onClick={() => setFilter(gender)}
      aria-pressed={filter === gender}
      title={`Filtrer par ${gender}`}
      aria-label={`Filtrer les mannequins par ${gender}`}
      className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 ${
        filter === gender
          ? 'bg-pm-gold text-pm-dark shadow-md shadow-pm-gold/30'
          : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'
      }`}
    >
      {gender}
    </button>
  );

  if (!isInitialized) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-pm-gold"
        role="status"
      >
        Chargement des mannequins...
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
      <section className="relative py-20 bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6">
            Nos Mannequins
          </h1>
          <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-8">
            Découvrez les visages qui définissent l'avenir de la mode. Des talents
            uniques, prêts à donner vie à vos créations.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-pm-gold">{publicModels.length}</div>
              <div className="text-pm-off-white/70">Mannequins actifs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pm-gold">
                {publicModels.filter(m => m.gender === 'Femme').length}
              </div>
              <div className="text-pm-off-white/70">Femmes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pm-gold">
                {publicModels.filter(m => m.gender === 'Homme').length}
              </div>
              <div className="text-pm-off-white/70">Hommes</div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="page-container">

        {/* Filtres + Recherche */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 lg:mb-14">
          <div className="flex items-center gap-4">
            <FilterButton gender="Tous" />
            <FilterButton gender="Femme" />
            <FilterButton gender="Homme" />
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="search-model" className="sr-only">
              Rechercher un mannequin
            </label>
            <input
              id="search-model"
              type="text"
              placeholder="Rechercher un mannequin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64 bg-black border border-pm-gold/50 rounded-full px-4 py-2 text-pm-off-white focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/50 transition-all"
            />
          </div>
        </div>

        {/* Grille de mannequins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredModels.map((model, index) => (
            <EnhancedModelCard key={model.id} model={model} index={index} />
          ))}
        </div>

        {/* Aucun résultat */}
        {filteredModels.length === 0 && (
          <div className="text-center col-span-full py-20">
            <p className="text-pm-off-white/70 mb-4">
              Aucun mannequin ne correspond à votre recherche.
            </p>
            <button
              onClick={() => {
                setFilter('Tous');
                setSearchTerm('');
              }}
              className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full hover:bg-pm-gold/90 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
