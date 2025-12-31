import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Link to={`/mannequins/${model.id}`} className="group block relative overflow-hidden rounded-xl bg-pm-dark/50 border border-white/5 shadow-lg hover:shadow-pm-gold/10 transition-all duration-500 hover:-translate-y-2">
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 animate-pulse" /> {/* Placeholder */}
        <img
            src={model.imageUrl}
            alt={model.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 z-20" />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-pm-gold/80 opacity-0 group-hover:opacity-90 transition-opacity duration-500 z-30 flex items-center justify-center">
             <span className="text-black font-bold uppercase tracking-widest border border-black px-6 py-3 transform scale-90 group-hover:scale-100 transition-transform duration-500">
                Voir le profil
             </span>
        </div>

        <div className="absolute bottom-0 left-0 p-6 w-full z-40 transition-transform duration-500 transform group-hover:translate-y-2">
          <h3 className="text-2xl font-playfair text-white mb-1 group-hover:text-black transition-colors">{model.name}</h3>
          <p className="text-sm text-gray-300 font-medium uppercase tracking-wider group-hover:text-black/80 transition-colors">
            {model.height} • {model.gender}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ModelCard;