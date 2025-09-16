import React from 'react';
import { Model } from '../types';
import { Link } from 'react-router-dom';
import { UserIcon, MapPinIcon, StarIcon } from '@heroicons/react/24/outline';

interface ModelPreviewProps {
  model: Model;
  featured?: boolean;
}

const ModelPreview: React.FC<ModelPreviewProps> = ({ model, featured = false }) => {
  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Pro':
        return 'bg-pm-gold/20 text-pm-gold border-pm-gold/30';
      case 'Débutant':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className={`group ${featured ? 'lg:col-span-2' : ''}`}>
      <Link 
        to={`/mannequins/${model.id}`}
        className="block h-full bg-pm-dark/50 border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-all duration-300 hover:shadow-2xl hover:shadow-pm-gold/10"
      >
        {/* Image principale */}
        <div className={`relative overflow-hidden ${featured ? 'h-80' : 'h-64'}`}>
          <img
            src={model.imageUrl}
            alt={`Portfolio de ${model.name}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark/90 via-transparent to-transparent" />
          
          {/* Badge niveau */}
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getLevelColor(model.level)}`}>
              {model.level || 'Pro'}
            </span>
          </div>

          {/* Nom en overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className={`font-playfair text-white mb-1 ${
              featured ? 'text-2xl lg:text-3xl' : 'text-xl'
            }`}>
              {model.name}
            </h3>
            {model.location && (
              <div className="flex items-center gap-1 text-pm-off-white/80">
                <MapPinIcon className="w-4 h-4" />
                <span className="text-sm">{model.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="p-6">
          {/* Mesures */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-pm-gold">{model.height}</div>
              <div className="text-xs text-pm-off-white/60 uppercase tracking-wider">Taille</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pm-gold">{model.age || 'N/A'}</div>
              <div className="text-xs text-pm-off-white/60 uppercase tracking-wider">Âge</div>
            </div>
          </div>

          {/* Expérience */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-pm-gold mb-2 uppercase tracking-wider">Expérience</h4>
            <p className="text-pm-off-white/80 text-sm leading-relaxed">
              {truncateText(model.experience, featured ? 150 : 100)}
            </p>
          </div>

          {/* Distinctions */}
          {model.distinctions && model.distinctions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-pm-gold mb-2 uppercase tracking-wider">Réalisations</h4>
              <div className="flex flex-wrap gap-2">
                {model.distinctions.slice(0, featured ? 4 : 2).map((distinction, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-pm-gold/10 text-pm-gold text-xs rounded-full border border-pm-gold/20"
                  >
                    {distinction.title}
                  </span>
                ))}
                {model.distinctions.length > (featured ? 4 : 2) && (
                  <span className="px-2 py-1 bg-pm-gold/10 text-pm-gold text-xs rounded-full border border-pm-gold/20">
                    +{model.distinctions.length - (featured ? 4 : 2)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Portfolio preview */}
          {model.portfolioImages && model.portfolioImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-pm-gold mb-2 uppercase tracking-wider">Portfolio</h4>
              <div className="grid grid-cols-3 gap-2">
                {model.portfolioImages.slice(0, 3).map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-md">
                    <img
                      src={image}
                      alt={`Portfolio ${model.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Call to action */}
          <div className="flex items-center justify-between pt-4 border-t border-pm-gold/20">
            <div className="flex items-center gap-1 text-pm-gold">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Voir le profil</span>
            </div>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-pm-gold" />
              <span className="text-sm text-pm-off-white/60">Profil vérifié</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ModelPreview;
