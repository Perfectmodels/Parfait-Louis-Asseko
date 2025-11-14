import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Model } from '../../types';
import { 
  UserIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  MagnifyingGlassIcon,
  StarIcon,
  MapPinIcon,
  TagIcon,
  EyeIcon,
  TrophyIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ModelSelectionForPromotionProps {
  onModelsSelected: (models: string[]) => void;
  selectedModels: string[];
}

const ModelSelectionForPromotion: React.FC<ModelSelectionForPromotionProps> = ({
  onModelsSelected,
  selectedModels
}) => {
  const { data } = useData();
  const models = data?.models || [];
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [showPromotionOnly, setShowPromotionOnly] = useState(false);
  const [promotionNotes, setPromotionNotes] = useState<Record<string, string>>({});

  const filteredModels = models.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (model.level && model.level.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'all' || model.level === levelFilter;
    const matchesPromotion = !showPromotionOnly || model.isPublic || model.level === 'Pro';
    
    return matchesSearch && matchesLevel && matchesPromotion;
  });

  const handleModelToggle = (modelId: string) => {
    const newSelection = selectedModels.includes(modelId)
      ? selectedModels.filter(id => id !== modelId)
      : [...selectedModels, modelId];
    onModelsSelected(newSelection);
  };

  const handlePromotionNoteChange = (modelId: string, note: string) => {
    setPromotionNotes(prev => ({ ...prev, [modelId]: note }));
  };

  const getModelLevelColor = (level: string | undefined) => {
    switch (level) {
      case 'Pro': return 'text-purple-400 bg-purple-400/20';
      case 'Débutant': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getPromotionScore = (model: Model) => {
    let score = 0;
    
    // Level scoring
    if (model.level === 'Pro') score += 40;
    
    // Public profile
    if (model.isPublic) score += 15;
    
    // Has basic info
    if (model.email) score += 5;
    if (model.phone) score += 5;
    if (model.age) score += 5;
    
    // Recent activity (simulated)
    score += Math.floor(Math.random() * 20);
    
    return score;
  };

  const getPromotionBadge = (score: number) => {
    if (score >= 60) {
      return { icon: StarIcon, color: 'text-purple-400', label: 'Premium' };
    } else if (score >= 40) {
      return { icon: FireIcon, color: 'text-orange-400', label: 'Trending' };
    } else if (score >= 25) {
      return { icon: SparklesIcon, color: 'text-pm-gold', label: 'Rising' };
    } else {
      return { icon: StarIcon, color: 'text-blue-400', label: 'Emerging' };
    }
  };

  return (
    <div className="bg-black border border-pm-gold/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-pm-gold mb-2">
            Sélection des mannequins pour promotion
          </h3>
          <p className="text-pm-off-white/70 text-sm">
            Choisissez les mannequins à mettre en avant dans cet article
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-pm-gold font-medium">
            {selectedModels.length} mannequin(s) sélectionné(s)
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pm-off-white/50" />
          <input
            type="text"
            placeholder="Rechercher un mannequin..."
            className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold text-sm"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="all">Tous les niveaux</option>
          <option value="Pro">Pro</option>
          <option value="Débutant">Débutant</option>
        </select>
        
        
        <label className="flex items-center gap-2 text-pm-off-white text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showPromotionOnly}
            onChange={(e) => setShowPromotionOnly(e.target.checked)}
            className="rounded border-pm-gold/20 bg-pm-dark text-pm-gold focus:ring-pm-gold"
          />
          <span>Promotion uniquement</span>
        </label>
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          const promotionScore = getPromotionScore(model);
          const promotionBadge = getPromotionBadge(promotionScore);
          const BadgeIcon = promotionBadge.icon;

          return (
            <div
              key={model.id}
              className={`relative bg-pm-dark border rounded-xl p-4 transition-all cursor-pointer ${
                isSelected 
                  ? 'border-pm-gold shadow-lg shadow-pm-gold/20' 
                  : 'border-pm-gold/20 hover:border-pm-gold/50'
              }`}
              onClick={() => handleModelToggle(model.id)}
            >
              {/* Selection indicator */}
              <div className="absolute top-2 right-2 z-10">
                {isSelected ? (
                  <div className="w-6 h-6 bg-pm-gold rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-4 h-4 text-black" />
                  </div>
                ) : (
                  <div className="w-6 h-6 bg-pm-dark border-2 border-pm-gold/30 rounded-full" />
                )}
              </div>

              {/* Promotion badge */}
              <div className="absolute top-2 left-2">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getModelLevelColor(model.level)}`}>
                  <BadgeIcon className={`w-3 h-3 ${promotionBadge.color}`} />
                  {promotionBadge.label}
                </div>
              </div>

              {/* Model content */}
              <div className="pt-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-pm-gold" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-pm-off-white">{model.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-pm-off-white/70">
                      <span className={`px-2 py-0.5 rounded-full ${getModelLevelColor(model.level)}`}>
                        {model.level || 'N/A'}
                      </span>
                      {model.isPublic && (
                        <span className="flex items-center gap-1 text-green-400">
                          <EyeIcon className="w-3 h-3" />
                          Public
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Model details */}
                <div className="space-y-2 text-sm">
                  {model.age && (
                    <div className="flex items-center gap-2 text-pm-off-white/70">
                      <TagIcon className="w-4 h-4" />
                      {model.age} ans
                    </div>
                  )}
                  
                  {model.height && (
                    <div className="flex items-center gap-2 text-pm-off-white/70">
                      <TrophyIcon className="w-4 h-4" />
                      {model.height}
                    </div>
                  )}
                  
                  {model.location && (
                    <div className="flex items-center gap-2 text-pm-off-white/70">
                      <MapPinIcon className="w-4 h-4" />
                      {model.location}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-pm-off-white/70">
                    <StarIcon className="w-4 h-4" />
                    Score: {promotionScore}/100
                  </div>
                </div>

                {/* Promotion note */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-pm-gold/20">
                    <textarea
                      placeholder="Note de promotion pour ce mannequin..."
                      className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white text-xs focus:outline-none focus:border-pm-gold resize-none"
                      rows={2}
                      value={promotionNotes[model.id] || ''}
                      onChange={(e) => handlePromotionNoteChange(model.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-pm-gold/20 mx-auto mb-4" />
          <p className="text-pm-off-white/50">
            Aucun mannequin trouvé pour les filtres actuels
          </p>
        </div>
      )}

      {/* Selected models summary */}
      {selectedModels.length > 0 && (
        <div className="mt-6 pt-6 border-t border-pm-gold/20">
          <h4 className="text-lg font-semibold text-pm-gold mb-3">
            Mannequins sélectionnés ({selectedModels.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedModels.map(modelId => {
              const model = models.find(m => m.id === modelId);
              if (!model) return null;
              
              return (
                <div
                  key={modelId}
                  className="flex items-center gap-2 px-3 py-1 bg-pm-gold/20 text-pm-gold rounded-full text-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  {model.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModelToggle(modelId);
                    }}
                    className="ml-1 hover:text-pm-off-white"
                  >
                    <XCircleIcon className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelectionForPromotion;
