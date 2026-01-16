import React from 'react';
import { Link } from 'react-router-dom';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Link to={`/mannequins/${model.id}`} className="group block relative overflow-hidden rounded-2xl bg-black/40 border border-white/5 hover:border-pm-gold/30 transition-all duration-500 hover:shadow-2xl hover:shadow-pm-gold/10">
      <div className="relative aspect-[3/4] overflow-hidden">
        {/* Main Image */}
        <img
          src={model.imageUrl}
          alt={model.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />

        {/* Dynamic Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

        {/* Glassmorphism Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-black/30 backdrop-blur-xl border border-white/10 text-pm-gold text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
            Elite Board
          </span>
        </div>

        {/* Content Info */}
        <div className="absolute bottom-0 left-0 p-6 w-full z-20">
          <div className="space-y-1 transform group-hover:-translate-y-2 transition-transform duration-500">
            <h3 className="text-2xl font-playfair font-bold text-white tracking-tight leading-tight group-hover:text-pm-gold transition-colors">
              {model.name}
            </h3>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-pm-off-white/60 uppercase tracking-widest font-bold">
                {model.height}
              </span>
              <span className="w-1 h-1 rounded-full bg-pm-gold"></span>
              <span className="text-xs text-pm-off-white/60 uppercase tracking-widest font-bold">
                {model.gender}
              </span>
            </div>
          </div>

          {/* Reveal on hover button look-alike */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2 text-pm-gold text-[10px] font-black uppercase tracking-[0.3em]">
            Voir le book <span>→</span>
          </div>
        </div>

        {/* Shine Animation Effect */}
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          <div className="absolute -inset-[100%] bg-gradient-to-tr from-transparent via-white/5 to-transparent top-0 left-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
      </div>
    </Link>
  );
};

export default ModelCard;