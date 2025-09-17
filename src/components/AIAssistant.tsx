import React, { useState } from 'react';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface AIAssistantProps {
  onContentGenerated: (content: string) => void;
  context: string;
  placeholder?: string;
  className?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  onContentGenerated,
  context,
  placeholder = "Décrivez ce que vous voulez générer...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Simulation d'une génération AI (remplacer par un vrai service AI)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Pour l'instant, on génère du contenu basé sur le contexte
      let generatedContent = '';
      
      switch (context) {
        case 'album-description':
          generatedContent = `Découvrez cette magnifique séance photo qui capture l'essence de la mode et de l'élégance. Chaque image raconte une histoire unique, mettant en valeur le talent de nos mannequins et la créativité de notre équipe. ${prompt}`;
          break;
        case 'article-content':
          generatedContent = `Dans le monde en constante évolution de la mode, ${prompt} représente une tendance majeure qui redéfinit les standards de beauté et d'élégance. Cette approche novatrice ouvre de nouvelles perspectives pour les professionnels du secteur.`;
          break;
        case 'model-bio':
          generatedContent = `${prompt} est une mannequin passionnée et déterminée, avec une approche unique du métier. Son charisme naturel et sa polyvalence en font une professionnelle remarquable, capable de s'adapter à tous les styles et univers.`;
          break;
        case 'service-description':
          generatedContent = `Notre service ${prompt} offre une expérience personnalisée et professionnelle, conçue pour répondre aux besoins spécifiques de nos clients. Avec une équipe d'experts dédiés, nous garantissons des résultats exceptionnels.`;
          break;
        default:
          generatedContent = `Contenu généré basé sur votre demande : ${prompt}. Ce texte a été créé pour enrichir votre contenu et vous faire gagner du temps dans la rédaction.`;
      }

      onContentGenerated(generatedContent);
      setPrompt('');
      setIsOpen(false);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      setError('Erreur lors de la génération du contenu. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bouton pour ouvrir l'assistant */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        title="Assistant AI"
      >
        <SparklesIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Assistant AI</span>
      </button>

      {/* Modal de l'assistant */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Assistant AI</h3>
                  <p className="text-sm text-gray-500">Générateur de contenu intelligent</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Décrivez ce que vous voulez générer
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholder}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  disabled={isGenerating}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Suggestions rapides */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Suggestions rapides :</p>
                <div className="flex flex-wrap gap-2">
                  {getQuickSuggestions(context).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(suggestion)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors"
                      disabled={isGenerating}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-500">
                L'assistant AI vous aide à générer du contenu de qualité
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={isGenerating}
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <PaperAirplaneIcon className="w-4 h-4" />
                      Générer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fonction pour obtenir des suggestions rapides selon le contexte
const getQuickSuggestions = (context: string): string[] => {
  switch (context) {
    case 'album-description':
      return [
        'Séance mode élégante',
        'Portrait artistique',
        'Fashion shoot urbain',
        'Séance nature et lumière'
      ];
    case 'article-content':
      return [
        'Les tendances mode 2024',
        'L\'évolution du mannequinat',
        'Les techniques de pose',
        'L\'industrie de la mode'
      ];
    case 'model-bio':
      return [
        'Mannequin expérimentée',
        'Nouveau talent prometteur',
        'Spécialiste mode haute couture',
        'Modèle polyvalent'
      ];
    case 'service-description':
      return [
        'Formation mannequinat',
        'Séances photo professionnelles',
        'Coaching personnalisé',
        'Développement de carrière'
      ];
    default:
      return [
        'Contenu professionnel',
        'Description détaillée',
        'Présentation élégante',
        'Texte engageant'
      ];
  }
};

export default AIAssistant;