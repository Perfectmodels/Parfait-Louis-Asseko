import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';
import { Model } from '../types';

interface EnhancedModelCardProps {
  model: Model;
  index?: number;
}

const EnhancedModelCard: React.FC<EnhancedModelCardProps> = ({ model, index = 0 }) => {
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
          
          {/* Icône de favori */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="absolute top-4 right-4"
          >
            <button 
              className="w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pm-gold/20"
              onClick={(e) => {
                e.preventDefault();
                // Logique pour ajouter aux favoris
              }}
            >
              <StarIcon className="w-5 h-5 text-pm-gold" />
            </button>
          </motion.div>
          
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
