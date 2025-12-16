import React, { useState } from 'react';
import SEO from '../components/SEO';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { geminiService } from '../services/geminiService';
import Button from '../components/ui/Button';

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
            const imageUrl = await geminiService.generateImage(prompt, aspectRatio);
            setGeneratedImage(imageUrl);
        } catch (err: any) {
            console.error("Erreur Gemini:", err);
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

                    <Button
                        onClick={handleGenerate}
                        isLoading={isLoading}
                        className="w-full"
                        icon={<SparklesIcon className="w-6 h-6" />}
                    >
                        Générer l'image
                    </Button>

                    {error && <div className="p-4 bg-red-900/30 border border-red-500/50 rounded text-red-200 text-sm mt-4">{error}</div>}
                </div>

                <div className="mt-12">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center p-8 bg-black rounded-lg border border-pm-gold/20 border-dashed animate-pulse">
                            <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-pm-gold">Création de votre chef-d'œuvre...</p>
                        </div>
                    )}
                    {generatedImage && (
                        <div className="animate-fade-in space-y-4">
                            <h2 className="section-title">Votre Image</h2>
                            <img src={generatedImage} alt={prompt} className="max-w-full mx-auto rounded-lg shadow-2xl shadow-pm-gold/10 border border-pm-gold/10" />
                            <a
                                href={generatedImage}
                                download={`pmm-ai-art-${Date.now()}.jpg`}
                                className="inline-block text-pm-gold hover:underline text-sm"
                            >
                                Télécharger l'image
                            </a>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ImageGeneration;