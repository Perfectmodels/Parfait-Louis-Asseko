import React, { useState, useMemo } from 'react';
import { models } from '../constants/data';
import ModelCard from '../components/ModelCard';
import { Model } from '../types';
import SEO from '../components/SEO';

type GenderFilter = 'Tous' | 'Femme' | 'Homme';

const Models: React.FC = () => {
  const [filter, setFilter] = useState<GenderFilter>('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModels = useMemo(() => {
    return models
      .filter(model => filter === 'Tous' || model.gender === filter)
      .filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm]);

  const FilterButton: React.FC<{ gender: GenderFilter }> = ({ gender }) => (
    <button
      onClick={() => setFilter(gender)}
      className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-colors duration-300 ${filter === gender ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}
    >
      {gender}
    </button>
  );

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title="Nos Mannequins"
        description="Parcourez le catalogue complet de nos mannequins professionnels, hommes et femmes. Trouvez le visage parfait pour votre prochain projet."
        keywords="mannequins hommes, mannequins femmes, catalogue mannequins, booker mannequin, agence Libreville"
      />
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Nos Mannequins</h1>
        <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
          Découvrez les visages qui définissent l'avenir de la mode. Des talents uniques, prêts à donner vie à vos créations.
        </p>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
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
              className="w-full md:w-64 bg-black border border-pm-gold/50 rounded-full px-4 py-2 text-pm-off-white focus:outline-none focus:border-pm-gold"
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