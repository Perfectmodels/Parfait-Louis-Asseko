
import React, { useState, useEffect, useCallback } from 'react';
import { AIAssistantProps } from '../types';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { GoogleGenAI, Type } from '@google/genai';
import Modal from './ui/Modal';

const getSuggestions = (fieldName: string): string[] => {
    const lowerFieldName = fieldName.toLowerCase();
    if (lowerFieldName.includes('distinction')) {
        return [
            "Génère 3 titres prestigieux pour un mannequin.",
            "Invente 2 distinctions internationales.",
            "Liste des récompenses pour un 'Mannequin Espoir'."
        ];
    }
    if (lowerFieldName.includes('titre')) {
        return [
            "Propose 5 titres accrocheurs pour un article de mode.",
            "Génère un titre d'interview percutant.",
            "Trouve un titre poétique pour un article sur la haute couture."
        ];
    }
     if (lowerFieldName.includes('extrait')) {
        return [
            "Rédige un résumé de 2 phrases pour un article.",
            "Écris une introduction engageante qui donne envie de lire."
        ];
    }
    if (lowerFieldName.includes('contenu')) {
        return [
            "Rédige un article sur les tendances mode de la saison.",
            "Écris une interview structurée avec un créateur.",
            "Décris l'histoire d'un vêtement iconique."
        ];
    }
    if (lowerFieldName.includes('témoignage')) {
        return [
            "Écris un témoignage positif d'un mannequin sur son agence.",
            "Rédige une citation inspirante d'un partenaire.",
            "Génère un texte élogieux d'un client satisfait."
        ];
    }
    return [];
};


const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onInsertContent, fieldName, initialPrompt, jsonSchema }) => {
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            setPrompt(initialPrompt);
            setGeneratedContent('');
            setError(null);
            setSuggestions(getSuggestions(fieldName));
        }
    }, [isOpen, initialPrompt, fieldName]);

    const handleGenerate = useCallback(async () => {
        if (!prompt) return;

        setIsLoading(true);
        setError(null);
        setGeneratedContent('');

        const convertSchema = (schema: any): any => {
            if (!schema || typeof schema !== 'object') return schema;
            const newSchema = { ...schema };
            if (schema.type && typeof schema.type === 'string' && Type[schema.type as keyof typeof Type]) {
                newSchema.type = Type[schema.type as keyof typeof Type];
            }
            if (schema.items) {
                newSchema.items = convertSchema(schema.items);
            }
            if (schema.properties) {
                newSchema.properties = {};
                for (const key in schema.properties) {
                    newSchema.properties[key] = convertSchema(schema.properties[key]);
                }
            }
            return newSchema;
        };

        try {
            if (!process.env.API_KEY) {
                throw new Error("La clé API n'est pas configurée.");
            }
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let response;
            const model = 'gemini-2.5-flash';

            if (jsonSchema) {
                const typedSchema = convertSchema(jsonSchema);
                response = await ai.models.generateContent({
                    model,
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: typedSchema
                    }
                });
            } else {
                 response = await ai.models.generateContent({
                    model,
                    contents: prompt
                });
            }
            
            const textResult = response.text;
            setGeneratedContent(textResult);

        } catch (err: any) {
            console.error("Erreur de l'API Gemini:", err);
            setError(err.message || "Une erreur est survenue lors de la génération du contenu.");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, jsonSchema]);

    const handleInsert = () => {
        onInsertContent(generatedContent);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Assistant IA pour "${fieldName}"`}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="ai-prompt" className="block text-sm font-bold text-pm-off-white/80 mb-2">Votre demande (Prompt) :</label>
                        <textarea
                            id="ai-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="admin-input admin-textarea"
                            placeholder="Ex: Rédige un paragraphe sur l'importance de la posture..."
                        />
                    </div>

                    {suggestions.length > 0 && (
                        <div className="pt-2">
                            <p className="text-xs text-pm-off-white/60 mb-2">Suggestions :</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPrompt(s)}
                                        className="px-3 py-1 bg-black border border-pm-gold/50 text-pm-gold/90 text-xs rounded-full hover:bg-pm-gold/10 transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-pm-gold/10"
                    >
                        {isLoading ? 'Génération en cours...' : 'Générer le contenu'}
                    </button>

                    {error && <div className="p-4 bg-red-900/30 border border-red-500/50 text-red-400 text-sm rounded-xl">{error}</div>}

                    {generatedContent && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-bold text-pm-off-white/80 mb-2">Résultat :</label>
                            <textarea
                                readOnly
                                value={generatedContent}
                                rows={8}
                                className="admin-input admin-textarea bg-black/40 rounded-xl p-4 border-pm-off-white/10"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-pm-gold/10">
                    <button onClick={onClose} className="px-6 py-2 bg-pm-dark border border-pm-off-white/20 text-pm-off-white/60 font-bold uppercase tracking-widest text-[10px] rounded-full hover:border-white hover:text-white transition-all">
                        Annuler
                    </button>
                    <button
                        onClick={handleInsert}
                        disabled={!generatedContent || isLoading}
                        className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white disabled:opacity-50 transition-all shadow-lg shadow-pm-gold/20"
                    >
                        Insérer le contenu
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AIAssistant;
