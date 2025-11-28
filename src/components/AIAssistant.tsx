import React, { useState, useEffect } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface AIAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    onInsertContent: (content: string) => void;
    fieldName: string;
    initialPrompt: string;
    jsonSchema?: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onInsertContent, fieldName, initialPrompt, jsonSchema }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    useEffect(() => {
        setPrompt(initialPrompt);
        setGeneratedContent('');
    }, [initialPrompt, isOpen]);

    if (!isOpen) return null;

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        let content = '';
        if (fieldName === 'title') {
            content = "Titre généré par IA : L'élégance intemporelle";
        } else if (fieldName === 'excerpt') {
            content = "Ceci est un résumé généré par IA. Il capture l'essence de l'article de manière concise.";
        } else if (fieldName === 'tags') {
            content = "mode, tendance, 2024, style, élégance";
        } else if (jsonSchema) {
            content = JSON.stringify([
                { type: 'paragraph', text: "Paragraphe 1 généré par IA." },
                { type: 'heading', level: 2, text: "Sous-titre généré" },
                { type: 'paragraph', text: "Paragraphe 2 généré par IA." }
            ], null, 2);
        } else {
            content = `Contenu généré pour ${fieldName}...`;
        }

        setGeneratedContent(content);
        setIsGenerating(false);
    };

    const handleInsert = () => {
        onInsertContent(generatedContent);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-playfair text-pm-gold flex items-center gap-2">
                        <SparklesIcon className="w-6 h-6" />
                        Assistant IA ({fieldName})
                    </h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
                            Prompt
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            className="w-full bg-pm-dark-light border border-pm-gold/20 rounded p-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                        />
                    </div>

                    {generatedContent && (
                        <div>
                            <label className="block text-sm font-medium text-pm-off-white/80 mb-1">
                                Résultat
                            </label>
                            <div className="bg-pm-dark-light p-3 rounded border border-pm-off-white/10 text-sm max-h-40 overflow-y-auto whitespace-pre-wrap">
                                {generatedContent}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={handleGenerate}
                            disabled={!prompt || isGenerating}
                            className="flex-1 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded hover:bg-pm-gold hover:text-pm-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isGenerating ? 'Génération...' : 'Générer'}
                        </button>
                        {generatedContent && (
                            <button
                                onClick={handleInsert}
                                className="flex-1 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded hover:bg-white transition-colors"
                            >
                                Insérer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;
