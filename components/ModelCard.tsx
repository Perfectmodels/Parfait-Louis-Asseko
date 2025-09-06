import React from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { Model } from '../types';

interface ModelCardProps {
  model: Model;
}

const ModelCard: React.FC<ModelCardProps> = ({ model }) => {
  return (
    <ReactRouterDOM.Link to={`/mannequins/${model.id}`} className="group block bg-pm-dark border border-pm-gold/20 overflow-hidden transition-all duration-300 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/20">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <h3 className="text-xl font-playfair text-pm-gold">{model.name}</h3>
          <p className="text-sm text-pm-off-white/80">{model.height} - {model.gender}</p>
        </div>
      </div>
    </ReactRouterDOM.Link>
  );
};

export default ModelCard;