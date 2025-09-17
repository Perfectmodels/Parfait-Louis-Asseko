import React from 'react';
import { FashionDayEvent } from '../types';

interface SharePreviewProps {
  event: FashionDayEvent;
  className?: string;
}

const SharePreview: React.FC<SharePreviewProps> = ({ event, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden max-w-md ${className}`}>
      {/* Image principale */}
      {event.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={event.imageUrl} 
            alt={`Affiche officielle Perfect Fashion Day Édition ${event.edition} - ${event.theme}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-pm-gold text-pm-dark px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
              Édition {event.edition}
            </span>
          </div>
        </div>
      )}
      
      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Perfect Fashion Day - Édition {event.edition}
        </h3>
        <p className="text-pm-gold font-medium text-sm mb-2">
          "{event.theme}"
        </p>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>
        
        {/* Métadonnées */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>perfectmodels.ga</span>
          <span>{new Date(event.date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
};

export default SharePreview;
