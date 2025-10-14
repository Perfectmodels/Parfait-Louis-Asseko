import React from 'react';
import Reveal from './Reveal';
import { Link } from 'react-router-dom';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <Reveal className="hover-lift" direction="up">
      <Link to={`/mannequins/${model.id}`} className="group block card-base overflow-hidden focus-style-self focus-visible:ring-2 focus-visible:ring-pm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-pm-dark">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 w-full transition-all duration-300 transform group-hover:bg-black/50">
            <h3 className="text-xl font-playfair text-pm-gold">{model.name}</h3>
            <p className="text-sm text-pm-off-white/80">{model.height} - {model.gender}</p>
          </div>
        </div>
      </Link>
    </Reveal>
  );
};

export default ModelCard;