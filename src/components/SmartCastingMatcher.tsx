import React, { useState, useEffect } from 'react';
import { Model } from '../types';
import { useData } from '../contexts/DataContext';
import { MagnifyingGlassIcon, StarIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface SmartCastingMatcherProps {
  castingRequirements: {
    gender?: string;
    minHeight?: number;
    maxHeight?: number;
    ageRange?: { min: number; max: number };
    experience?: string[];
    skills?: string[];
  };
  onModelSelect: (model: Model) => void;
}

const SmartCastingMatcher: React.FC<SmartCastingMatcherProps> = ({
  castingRequirements,
  onModelSelect
}) => {
  const { data } = useData();
  const [matchedModels, setMatchedModels] = useState<Model[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (data?.models && castingRequirements) {
      setIsAnalyzing(true);
      
      // Simulation d'analyse AI (remplacer par vrai appel API)
      setTimeout(() => {
        const matches = data.models.filter(model => {
          let score = 0;
          
          // Vérification du genre
          if (castingRequirements.gender && 
              model.gender?.toLowerCase() === castingRequirements.gender.toLowerCase()) {
            score += 25;
          }
          
          // Vérification de la taille (conversion string vers nombre)
          if (castingRequirements.minHeight && castingRequirements.maxHeight) {
            const modelHeight = parseInt(model.height);
            if (modelHeight >= castingRequirements.minHeight && 
                modelHeight <= castingRequirements.maxHeight) {
              score += 20;
            }
          }
          
          // Vérification de l'âge
          if (castingRequirements.ageRange && model.age) {
            if (model.age >= castingRequirements.ageRange.min && 
                model.age <= castingRequirements.ageRange.max) {
              score += 20;
            }
          }
          
          // Vérification de l'expérience
          if (castingRequirements.experience?.length && model.experience) {
            const hasExperience = castingRequirements.experience.some(exp =>
              model.experience?.toLowerCase().includes(exp.toLowerCase())
            );
            if (hasExperience) score += 20;
          }
          
          // Vérification des compétences (utilisant les catégories comme compétences)
          if (castingRequirements.skills?.length && model.categories) {
            const hasSkills = castingRequirements.skills.some(skill =>
              model.categories?.some(modelSkill => 
                modelSkill.toLowerCase().includes(skill.toLowerCase())
              )
            );
            if (hasSkills) score += 15;
          }
          
          return score >= 40; // Seuil minimum de compatibilité
        });
        
        // Tri par score de compatibilité (simulation)
        const sortedMatches = matches.sort((a, b) => {
          const scoreA = calculateCompatibilityScore(a, castingRequirements);
          const scoreB = calculateCompatibilityScore(b, castingRequirements);
          return scoreB - scoreA;
        });
        
        setMatchedModels(sortedMatches.slice(0, 10)); // Top 10
        setIsAnalyzing(false);
      }, 1500);
    }
  }, [data, castingRequirements]);

  const calculateCompatibilityScore = (model: Model, requirements: any): number => {
    let score = 0;
    
    if (requirements.gender && model.gender?.toLowerCase() === requirements.gender.toLowerCase()) {
      score += 25;
    }
    
    if (requirements.minHeight && requirements.maxHeight && model.height) {
      const modelHeight = parseInt(model.height);
      if (modelHeight >= requirements.minHeight && modelHeight <= requirements.maxHeight) {
        score += 20;
      }
    }
    
    if (requirements.ageRange && model.age) {
      if (model.age >= requirements.ageRange.min && model.age <= requirements.ageRange.max) {
        score += 20;
      }
    }
    
    return score;
  };

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-3">
          <SparklesIcon className="w-6 h-6 text-pm-gold animate-pulse" />
          <span className="text-gray-600">Analyse IA en cours...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="w-5 h-5 text-pm-gold" />
          <h3 className="font-semibold text-gray-900">Modèles Recommandés ({matchedModels.length})</h3>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {matchedModels.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Aucun modèle ne correspond aux critères</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {matchedModels.map((model) => (
              <div key={model.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={model.imageUrl || 'https://i.ibb.co/NdrpzGpm/blob.jpg'}
                    alt={model.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{model.name}</h4>
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-600">
                          {calculateCompatibilityScore(model, castingRequirements)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <div>{model.age} ans • {model.height}cm • {model.gender}</div>
                      {model.experience && (
                        <div className="truncate">{model.experience}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onModelSelect(model)}
                    className="px-3 py-1 bg-pm-gold text-white rounded-md hover:bg-pm-gold/90 transition-colors text-sm"
                  >
                    Sélectionner
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartCastingMatcher;
