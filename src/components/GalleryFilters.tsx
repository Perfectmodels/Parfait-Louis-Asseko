import React from 'react';
import { TagIcon } from '@heroicons/react/24/outline';

interface GalleryFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const GalleryFilters: React.FC<GalleryFiltersProps> = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}) => {
  if (categories.length <= 1) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      <div className="flex items-center gap-2 text-pm-off-white/80 text-sm">
        <TagIcon className="w-4 h-4" />
        <span className="font-medium">Filtrer par catégorie :</span>
      </div>
      
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          selectedCategory === null
            ? 'bg-pm-gold text-pm-dark'
            : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
        }`}
      >
        Toutes
      </button>
      
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === category
              ? 'bg-pm-gold text-pm-dark'
              : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default GalleryFilters;