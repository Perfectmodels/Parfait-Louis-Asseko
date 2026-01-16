import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModelCard from '../components/ModelCard';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';

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
      className={`px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 relative group overflow-hidden ${filter === gender ? 'text-pm-dark bg-pm-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'text-pm-off-white hover:text-white bg-white/5 border border-white/10 hover:border-pm-gold/50'}`}
    >
      <span className="relative z-10">{gender}</span>
      {filter !== gender && <div className="absolute inset-0 bg-pm-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
    </button>
  );

  if (!isInitialized || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pm-dark">
        <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Use a fallback image or a nice one from siteImages
  const heroImage = data.siteImages.fashionDayBg || data.siteImages.hero;

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO
        title="Nos Mannequins | Le Visage de la Mode Gabonaise"
        description={seoDescription}
        keywords="mannequins hommes gabon, mannequins femmes gabon, book mannequins, agence de modèles photo, casting modèles libreville"
        image={models[0]?.imageUrl || data?.siteImages.about}
      />

      <ParallaxHero
        image={heroImage}
        title="Nos Mannequins"
        subtitle="Découvrez les visages qui définissent l'avenir de la mode."
        height="h-[50vh]"
        overlayOpacity={0.6}
      />

      <div className="page-container -mt-20 relative z-20">
        <FadeIn className="bg-black/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:p-10 shadow-2xl">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              <FilterButton gender="Tous" />
              <FilterButton gender="Femme" />
              <FilterButton gender="Homme" />
            </div>
            <div className="w-full md:w-auto relative group">
              <label htmlFor="search-model" className="sr-only">Rechercher un mannequin</label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-pm-gold bg-transparent" />
              </div>
              <input
                id="search-model"
                type="text"
                placeholder="Rechercher par nom..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-white/5 border border-white/10 rounded-full pl-12 pr-6 py-3 text-pm-off-white placeholder-pm-off-white/30 focus:outline-none focus:border-pm-gold focus:ring-1 focus:ring-pm-gold transition-all"
              />
            </div>
          </div>
        </FadeIn>

        {/* Models Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredModels.map((model, index) => (
            <FadeIn key={model.id} delay={index * 0.05} viewportAmount={0.1}>
              <ModelCard model={model} />
            </FadeIn>
          ))}
        </div>

        {filteredModels.length === 0 && (
          <FadeIn className="text-center py-20 bg-white/5 rounded-xl border border-white/5 mt-10">
            <p className="text-2xl font-playfair text-pm-off-white/60 mb-2">Aucun résultat</p>
            <p className="text-pm-off-white/40">Essayez de modifier vos filtres de recherche.</p>
          </FadeIn>
        )}
      </div>
    </div>
  );
};

export default Models;