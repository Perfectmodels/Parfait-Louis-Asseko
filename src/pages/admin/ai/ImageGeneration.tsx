import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import SEO from '../../../components/SEO';
import { SparklesIcon } from '@heroicons/react/24/solid';

const ImageGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError("Veuillez entrer une description pour l'image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            if (!import.meta.env.VITE_API_KEY) {
                throw new Error("La clé API n'est pas configurée.");
            }
            const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
                },
            });

            if (response.generatedImages && response.generatedImages.length > 0) {
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                setGeneratedImage(imageUrl);
            } else {
                throw new Error("Aucune image n'a été générée. Veuillez essayer une autre description.");
            }

        } catch (err: any) {
            console.error("Erreur de l'API Gemini:", err);
            setError(err.message || "Une erreur est survenue lors de la génération de l'image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Génération d'Image par IA" description="Créez des images uniques avec l'IA de Gemini. Entrez une description et choisissez un format pour générer une œuvre d'art." />
            <div className="container mx-auto px-6 max-w-3xl text-center">
                <h1 className="page-title">Génération d'Image par IA</h1>
                <p className="page-subtitle">
                    Décrivez l'image que vous souhaitez créer, choisissez un format, et laissez la magie de l'IA opérer.
                </p>

                <div className="bg-black p-8 border border-pm-gold/20 rounded-lg space-y-6">
                    <div>
                        <label htmlFor="prompt" className="admin-label text-left">Description de l'image (Prompt)</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="admin-textarea"
                            placeholder="Ex: Un mannequin africain portant une robe futuriste en pagne, dans une rue de Libreville la nuit..."
                        />
                    </div>

                    <div>
                        <label htmlFor="aspectRatio" className="admin-label text-left">Format (Aspect Ratio)</label>
                        <select id="aspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="admin-input">
                            <option value="1:1">Carré (1:1)</option>
                            <option value="3:4">Portrait (3:4)</option>
                            <option value="4:3">Paysage (4:3)</option>
                            <option value="9:16">Story (9:16)</option>
                            <option value="16:9">Large (16:9)</option>
                        </select>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50"
                    >
                        <SparklesIcon className="w-6 h-6" />
                        {isLoading ? 'Génération en cours...' : 'Générer l\'image'}
                    </button>
                    {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
                </div>
                
                <div className="mt-12">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 bg-black rounded-lg border border-pm-gold/20 border-dashed">
                             <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin"></div>
                             <p className="mt-4 text-pm-gold">Génération de l'image...</p>
                        </div>
                    )}
                    {generatedImage && (
                        <div className="animate-fade-in">
                            <h2 className="section-title">Votre Image</h2>
                            <img src={generatedImage} alt={prompt} className="max-w-full mx-auto rounded-lg shadow-2xl shadow-pm-gold/10" />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ImageGeneration;
