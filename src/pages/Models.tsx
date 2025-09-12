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
      <div className="py-24 bg-gradient-to-b from-pm-dark to-black">
        <div className="container mx-auto px-6">
          <h1 className="section-title mb-12">Nos Talents d'Exception</h1>
          <p className="text-center text-pm-off-white/80 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
            Découvrez notre sélection exclusive de mannequins professionnels, soigneusement formés et encadrés par Perfect Models Management. Chaque talent possède un profil unique et des compétences spécifiques pour répondre parfaitement aux besoins de votre marque et de vos projets créatifs.
          </p>
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12 lg:mb-16 animate-on-scroll">
          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
            <span className="text-pm-gold font-medium mr-2">Filtrer par :</span>
            <FilterButton gender="Tous" />
            <FilterButton gender="Femme" />
            <FilterButton gender="Homme" />
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <label htmlFor="search-model" className="sr-only">Rechercher un mannequin</label>
              <input
                id="search-model"
                type="text"
                placeholder="Rechercher un talent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 bg-black/60 border border-pm-gold/50 rounded-full px-5 py-3 text-pm-off-white focus:outline-none focus:border-pm-gold focus:ring-2 focus:ring-pm-gold/30 transition-all shadow-inner shadow-black/50"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-on-scroll">
          {filteredModels.map((model, index) => (
            <div key={model.id} className="card-hover" style={{animationDelay: `${index * 100}ms`}}>
              <ModelCard model={model} />
            </div>
          ))}
        </div>
        {filteredModels.length === 0 && (
          <div className="text-center col-span-full py-20 bg-black/30 rounded-lg border border-pm-gold/10 animate-on-scroll">
            <p className="text-pm-off-white/80 text-lg">Aucun mannequin ne correspond à votre recherche.</p>
            <button 
              onClick={() => {setFilter('Tous'); setSearchTerm('')}}
              className="mt-4 px-6 py-2 text-sm text-pm-gold border border-pm-gold/50 rounded-full hover:bg-pm-gold hover:text-pm-dark transition-all duration-300"
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
