import React, { useState, useMemo } from 'react';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

const Models: React.FC = () => {
  const { data, isInitialized } = useData();
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const models = data?.models || [];

  const filteredModels = useMemo(() => {
    return models
      .filter(model => model.isPublic === true) // Only show public models
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm, models]);

  const FilterButton: React.FC<{ gender: GenderFilter }> = ({ gender }) => (
    <button
      onClick={() => setFilter(gender)}
      className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 ${filter === gender ? 'bg-pm-gold text-pm-dark shadow-md shadow-pm-gold/30' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}
    >
      {gender}
    </button>
  );

  if (!isInitialized) {
      return <div className="min-h-screen flex items-center justify-center text-pm-gold">Chargement des mannequins...</div>;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-16 lg:py-24 min-h-screen">
      <SEO 
        title="Nos Mannequins | Le Visage de la Mode Gabonaise"
        description="Découvrez le portfolio complet des mannequins hommes et femmes de Perfect Models Management. Des visages uniques et professionnels prêts à incarner votre marque et vos créations."
        keywords="mannequins hommes gabon, mannequins femmes gabon, book mannequins, agence de modèles photo, casting modèles libreville"
      />
      <div className="container mx-auto px-6">
        <h1 className="text-4xl sm:text-5xl font-playfair text-pm-gold text-center mb-4">Nos Mannequins</h1>
        <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-10 lg:mb-14">
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
            <input
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