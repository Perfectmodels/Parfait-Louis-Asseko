import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Model } from '../types';
import { StarIcon, EyeIcon } from '@heroicons/react/24/outline';

interface EnhancedModelCardProps {
  model: Model;
  index?: number;
}

const EnhancedModelCard: React.FC<EnhancedModelCardProps> = ({ model, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link 
        to={`/mannequins/${model.id}`} 
        className="block bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl overflow-hidden hover:border-pm-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/10"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img 
            src={model.imageUrl} 
            alt={model.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-pm-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Model Info */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <div className="transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
              <h3 className="text-2xl font-playfair text-pm-gold mb-2 group-hover:text-white transition-colors">
                {model.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-pm-off-white/80">
                <span>{model.height}</span>
                <span>•</span>
                <span>{model.gender}</span>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
              <EyeIcon className="w-4 h-4 text-pm-gold" />
              <span className="text-xs text-pm-off-white">Voir profil</span>
            </div>
          </div>
          
          {/* Experience Badge */}
          {model.experience && (
            <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-2">
                <StarIcon className="w-4 h-4 text-pm-gold fill-current" />
                <span className="text-xs text-pm-off-white font-semibold">{model.experience}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Additional Info */}
        <div className="p-6">
          <div className="space-y-2">
            {model.experience && (
              <div className="text-sm text-pm-off-white/70">
                {model.experience} d'expérience
              </div>
            )}
            
            {model.experience && (
              <div className="text-sm text-pm-off-white/60 line-clamp-2">
                {model.experience}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EnhancedModelCard;
