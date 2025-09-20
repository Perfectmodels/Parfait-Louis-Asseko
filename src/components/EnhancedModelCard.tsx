import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, StarIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Model } from '../types';

interface EnhancedModelCardProps {
  model: Model;
  index?: number;
  viewMode?: 'grid' | 'list' | 'masonry';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const EnhancedModelCard: React.FC<EnhancedModelCardProps> = ({ 
  model, 
  index = 0, 
  viewMode = 'grid',
  isFavorite = false,
  onToggleFavorite
}) => {
  // Rendu conditionnel selon le mode de vue
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.05,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="group flex items-center gap-4 p-4 hover:bg-pm-gold/5 transition-colors rounded-xl"
      >
        {/* Image en liste */}
        <div className="relative w-20 h-24 overflow-hidden rounded-lg bg-gray-900 flex-shrink-0">
          <img 
            src={model.imageUrl} 
            alt={model.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {isFavorite && (
            <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
              <HeartIcon className="w-2.5 h-2.5 text-white fill-current" />
            </div>
          )}
        </div>
        
        {/* Informations en liste */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-pm-gold group-hover:text-yellow-400 transition-colors">
            {model.name}
          </h3>
          <p className="text-sm text-pm-off-white/70 mb-1">
            {model.height} - {model.gender} - {model.age} ans
          </p>
          <p className="text-xs text-pm-off-white/50">
            {model.experience || 'Débutant'} • {model.location}
          </p>
        </div>
        
        {/* Actions en liste */}
        <div className="flex items-center gap-2">
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(model.id)}
              className={`p-2 rounded-full transition-colors ${
                isFavorite 
                  ? 'bg-red-500/20 text-red-400' 
                  : 'bg-pm-gold/10 text-pm-gold hover:bg-red-500/20 hover:text-red-400'
              }`}
            >
              <HeartIcon className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
          <Link 
            to={`/mannequins/${model.id}`}
            className="p-2 bg-pm-gold/10 text-pm-gold rounded-full hover:bg-pm-gold/20 transition-colors"
          >
            <EyeIcon className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="group block"
    >
      <Link 
        to={`/mannequins/${model.id}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-pm-gold focus:ring-offset-2 focus:ring-offset-pm-dark rounded-xl"
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-900">
          {/* Image principale */}
          <img 
            src={model.imageUrl} 
            alt={model.name} 
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Overlay avec gradient animé */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Badge de niveau avec animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="absolute top-4 left-4"
          >
            <div className="px-3 py-1 bg-pm-gold/20 backdrop-blur-sm rounded-full text-xs font-bold text-pm-gold border border-pm-gold/30">
              {model.level}
            </div>
          </motion.div>
          
          {/* Bouton favori amélioré */}
          {onToggleFavorite && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="absolute top-4 right-4"
            >
              <button 
                className={`w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500/90 text-white opacity-100' 
                    : 'bg-black/50 text-pm-gold opacity-0 group-hover:opacity-100 hover:bg-red-500/90 hover:text-white'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(model.id);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HeartIcon className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </motion.div>
          )}
          
          {/* Informations avec animation */}
          <motion.div 
            className="absolute bottom-0 left-0 p-6 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <h3 className="text-2xl font-playfair text-white mb-2 group-hover:text-pm-gold transition-colors duration-300">
              {model.name}
            </h3>
            <p className="text-sm text-white/80 group-hover:text-white transition-colors duration-300 mb-3">
              {model.height} - {model.gender}
            </p>
            
            {/* Stats du mannequin */}
            <div className="flex items-center gap-4 text-xs text-white/70">
              <span>Expérience: {model.experience || 'Débutant'}</span>
              <span>•</span>
              <span>Disponible</span>
            </div>
          </motion.div>
          
          {/* Icône de flèche animée */}
          <motion.div
            className="absolute bottom-4 right-4 w-10 h-10 bg-pm-gold/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100"
            whileHover={{ rotate: 45 }}
          >
            <ChevronRightIcon className="w-5 h-5 text-pm-gold" />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EnhancedModelCard;
