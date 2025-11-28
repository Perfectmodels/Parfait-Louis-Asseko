import React, { useState } from 'react';
import { Article } from '../types';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ArticleGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleGenerated: (article: Partial<Article>) => void;
}

const ArticleGenerator: React.FC<ArticleGeneratorProps> = ({ isOpen, onClose, onArticleGenerated }) => {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedArticle: Partial<Article> = {
      title: `Article sur ${topic}`,
      excerpt: `Ceci est un résumé généré pour ${topic}.`,
      content: [
        { type: 'paragraph', text: `Voici le contenu généré pour le sujet : ${topic}.` }
      ],
      tags: ['Mode', 'Généré', topic]
    };

    onArticleGenerated(generatedArticle);
    setIsGenerating(false);
    setTopic('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-playfair text-pm-gold flex items-center gap-2">
            <SparklesIcon className="w-6 h-6" />
            Générateur d'Article IA
          </h2>
          <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Sujet de l'article
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
              placeholder="Ex: Les tendances été 2024..."
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic || isGenerating}
            className="w-full py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Génération en cours...' : 'Générer l\'article'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;
