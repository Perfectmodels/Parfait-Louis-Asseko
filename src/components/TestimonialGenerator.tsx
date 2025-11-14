import React, { useState, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Testimonial } from '../../types';
import { useDataStore } from '../hooks/useDataStore';
import CloseIcon from './icons/CloseIcon';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface TestimonialGeneratorProps {
    isOpen: boolean;
    onClose: () => void;
    onTestimonialGenerated: (testimonial: Testimonial) => void;
}

const TestimonialGenerator: React.FC<TestimonialGeneratorProps> = ({ isOpen, onClose, onTestimonialGenerated }) => {
    const { data } = useDataStore();
    const [selectedType, setSelectedType] = useState<'model' | 'partner'>('model');
    const [selectedPerson, setSelectedPerson] = useState<string>('');
    const [customContext, setCustomContext] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedTestimonial, setGeneratedTestimonial] = useState<Testimonial | null>(null);

    const models = data?.models || [];
    const partners = data?.agencyPartners || [];

    const availablePeople = selectedType === 'model' 
        ? models.map(m => ({ id: m.id, name: m.name, role: 'Mannequin', imageUrl: m.imageUrl }))
        : partners.map((p, index) => ({ 
            id: p.id || `partner-${index}`, 
            name: p.name, 
            role: p.role || 'Partenaire', 
            imageUrl: p.imageUrl || 'https://i.ibb.co/y4x9Y8X/testimonial-2.jpg'
          }));

    const selectedPersonData = availablePeople.find(p => p.id === selectedPerson);

    const handleGenerate = useCallback(async () => {
        if (!selectedPerson) {
            setError('Veuillez sélectionner une personne');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        const person = selectedPersonData!;
        const prompt = `
            Tu es un assistant IA pour une agence de mode et d'événementiel (Perfect Models Management) basée au Gabon.
            
            Génère un témoignage authentique et professionnel pour ${person.name} qui est ${person.role}.
            
            Contexte supplémentaire: ${customContext || 'Aucun contexte supplémentaire'}
            
            Instructions:
            - Le ton doit être professionnel, sincère et positif
            - Le témoignage doit mettre en valeur la qualité du service, le professionnalisme, et l'expérience avec l'agence
            - Doit être crédible et réaliste (entre 2-4 phrases)
            - Doit refléter l'expertise de l'agence dans le domaine de la mode et de l'événementiel au Gabon
            - Éviter les exagérations ou les affirmations irréalistes
            - Adapter le langage au rôle de la personne (créateur, mannequin, directeur artistique, etc.)
            
            Génère uniquement le texte du témoignage, sans les guillemets.
        `;
        
        const responseSchema = {
            type: Type.OBJECT,
            properties: {
                quote: { 
                    type: Type.STRING, 
                    description: "Le témoignage généré, 2-4 phrases professionnelles et authentiques" 
                }
            },
            required: ["quote"]
        };

        try {
            const geminiApiKey = data?.apiKeys?.geminiApiKey || process.env.API_KEY!;
            const ai = new GoogleGenAI({ apiKey: geminiApiKey });
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema
                }
            });

            const jsonResult = response.text;
            if (!jsonResult) {
                throw new Error("Aucune réponse générée par l'IA");
            }
            
            const { quote } = JSON.parse(jsonResult);
            
            const testimonial: Testimonial = {
                name: person.name,
                role: person.role,
                quote: quote.trim(),
                imageUrl: person.imageUrl || 'https://i.ibb.co/y4x9Y8X/testimonial-2.jpg'
            };
            
            setGeneratedTestimonial(testimonial);

        } catch (err: any) {
            console.error("Erreur de l'API Gemini:", err);
            setError(err.message || "Une erreur est survenue lors de la génération du témoignage.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedPerson, selectedPersonData, customContext, data]);

    const handleConfirm = () => {
        if (generatedTestimonial) {
            onTestimonialGenerated(generatedTestimonial);
            handleClose();
        }
    };

    const handleClose = () => {
        setSelectedType('model');
        setSelectedPerson('');
        setCustomContext('');
        setError(null);
        setGeneratedTestimonial(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl shadow-pm-gold/10 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-pm-gold/20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-2">
                            <SparklesIcon className="w-6 h-6" />
                            Générateur de Témoignage par IA
                        </h2>
                        <button onClick={handleClose} className="text-pm-off-white/70 hover:text-white">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4 overflow-y-auto flex-grow">
                    {!generatedTestimonial ? (
                        <>
                            <p className="text-sm text-pm-off-white/80">
                                Sélectionnez un mannequin ou un partenaire, puis générez un témoignage authentique avec l'IA.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                                        Type de personne
                                    </label>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedType('model');
                                                setSelectedPerson('');
                                            }}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                selectedType === 'model'
                                                    ? 'bg-pm-gold text-pm-dark'
                                                    : 'bg-pm-dark/50 text-pm-off-white/70 border border-pm-gold/30'
                                            }`}
                                        >
                                            Mannequin
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSelectedType('partner');
                                                setSelectedPerson('');
                                            }}
                                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                selectedType === 'partner'
                                                    ? 'bg-pm-gold text-pm-dark'
                                                    : 'bg-pm-dark/50 text-pm-off-white/70 border border-pm-gold/30'
                                            }`}
                                        >
                                            Partenaire
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                                        Sélectionner {selectedType === 'model' ? 'un mannequin' : 'un partenaire'}
                                    </label>
                                    <select
                                        value={selectedPerson}
                                        onChange={(e) => setSelectedPerson(e.target.value)}
                                        className="w-full px-3 py-2 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
                                    >
                                        <option value="">Choisir...</option>
                                        {availablePeople.map(person => (
                                            <option key={person.id} value={person.id}>
                                                {person.name} - {person.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white/70 mb-2">
                                        Contexte supplémentaire (optionnel)
                                    </label>
                                    <textarea
                                        value={customContext}
                                        onChange={(e) => setCustomContext(e.target.value)}
                                        placeholder="Ex: Projet spécifique, événement récent, collaboration particulière..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold resize-none"
                                    />
                                </div>

                                {selectedPersonData && (
                                    <div className="p-3 bg-pm-gold/10 border border-pm-gold/30 rounded-lg">
                                        <p className="text-sm text-pm-off-white/80">
                                            <span className="font-medium">{selectedPersonData.name}</span> - {selectedPersonData.role}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="p-3 bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-md">
                                    {error}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-pm-gold">Témoignage généré</h3>
                            <div className="p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <img 
                                        src={generatedTestimonial.imageUrl} 
                                        alt={generatedTestimonial.name}
                                        className="w-16 h-16 rounded-lg object-cover"
                                    />
                                    <div className="flex-grow">
                                        <p className="font-medium text-pm-off-white">{generatedTestimonial.name}</p>
                                        <p className="text-sm text-pm-off-white/70 mb-2">{generatedTestimonial.role}</p>
                                        <p className="text-pm-off-white/90 italic">"{generatedTestimonial.quote}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="p-6 border-t border-pm-gold/20 flex justify-end gap-4">
                    {!generatedTestimonial ? (
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !selectedPerson}
                            className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Génération en cours...' : 'Générer le témoignage'}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => setGeneratedTestimonial(null)}
                                className="px-6 py-3 bg-pm-dark/50 text-pm-off-white/70 border border-pm-gold/30 font-medium rounded-lg hover:bg-pm-dark/70"
                            >
                                Régénérer
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white"
                            >
                                Confirmer et ajouter
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestimonialGenerator;
