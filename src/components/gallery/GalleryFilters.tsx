import React from 'react';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface GalleryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  viewMode?: 'grid' | 'carousel';
  onViewModeChange?: (mode: 'grid' | 'carousel') => void;
  onClearFilters?: () => void;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery = '',
  onSearchChange = () => {},
  viewMode = 'grid',
  onViewModeChange = () => {},
  onClearFilters = () => {},
}) => {
  const hasActiveFilters = selectedCategory !== '' || (searchQuery !== undefined && searchQuery !== '');

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-2xl">
          <input
            type="text"
            placeholder="Rechercher un album..."
            className="w-full pl-10 pr-4 py-2.5 bg-pm-dark/50 border border-pm-off-white/20 rounded-full text-pm-off-white placeholder-pm-off-white/60 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pm-off-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pm-off-white/60 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-pm-dark/50 rounded-lg p-1 border border-pm-off-white/10">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-pm-gold/20 text-pm-gold' : 'text-pm-off-white/60 hover:bg-pm-off-white/5'}`}
              title="Vue en grille"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => onViewModeChange('carousel')}
              className={`p-2 rounded-md ${viewMode === 'carousel' ? 'bg-pm-gold/20 text-pm-gold' : 'text-pm-off-white/60 hover:bg-pm-off-white/5'}`}
              title="Vue en carrousel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FunnelIcon className="h-4 w-4 text-pm-off-white/60 group-hover:text-pm-gold transition-colors" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none bg-pm-dark/50 border border-pm-off-white/20 text-pm-off-white text-sm rounded-full py-2 pl-10 pr-8 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-transparent cursor-pointer"
          >
            <option value="">Toutes les catégories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-pm-off-white/60">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center text-sm text-pm-gold hover:text-pm-gold/80 transition-colors"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Réinitialiser les filtres
          </button>
        )}
      </div>
    </div>
  );
};

export default GalleryFilters;
