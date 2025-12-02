import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

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
      <div className="page-container">
        <h1 className="page-title">Nos Mannequins</h1>
        <p className="page-subtitle">
          Découvrez les visages qui définissent l'avenir de la mode. Des talents uniques, prêts à donner vie à vos créations.
        </p>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 lg:mb-14">
          <div className="flex items-center gap-4">
            <FilterButton gender="Tous" />
            <FilterButton gender="Femme" />
            <FilterButton gender="Homme" />
          </div>
          <div className="w-full md:w-auto">
            <label htmlFor="search-model" className="sr-only">Rechercher un mannequin</label>
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

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredModels.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
        {filteredModels.length === 0 && (
          <div className="text-center col-span-full py-20">
            <p className="text-pm-off-white/70">Aucun mannequin ne correspond à votre recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;