import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import SEO from '../components/SEO';
import { SparklesIcon, PhotoIcon } from '@heroicons/react/24/solid';

const ImageGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedImage(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: [{ text: prompt }],
                config: {
                    imageConfig: { aspectRatio: aspectRatio as any }
                }
            });

            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
                    break;
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-pm-dark min-h-screen pt-40 px-6">
            <SEO title="Studio AI | Perfect Models" description="Générateur de visuels haute couture." />
            
            <div className="max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32">
                <div className="space-y-16">
                    <div>
                        <span className="section-label">AI Visual Studio</span>
                        <h1 className="text-7xl font-playfair font-black italic">Créer l'Imaginaire</h1>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <label className="admin-label">Description Édimétrique</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                rows={6}
                                className="admin-textarea !text-lg"
                                placeholder="ex: Mannequin gabonais portant une robe de haute couture inspirée par les masques fang, éclairage cinématique, 8k..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="admin-label">Format de Rendu</label>
                            <div className="flex gap-4">
                                {['1:1', '3:4', '16:9'].map(ratio => (
                                    <button
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`px-8 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                                            aspectRatio === ratio ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'border-white/10 text-white/40 hover:border-white/20'
                                        }`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt}
                            className="btn-premium w-full !py-6 flex items-center justify-center gap-4"
                        >
                            <SparklesIcon className="w-5 h-5" />
                            {isLoading ? "Développement en cours..." : "Générer le Visuel"}
                        </button>
                    </div>
                </div>

                <div className="relative aspect-[4/5] bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden">
                    {generatedImage ? (
                        <img src={generatedImage} className="w-full h-full object-contain animate-fade-in" alt="Generated result" />
                    ) : (
                        <div className="text-center space-y-6">
                            <PhotoIcon className={`w-24 h-24 mx-auto text-white/5 ${isLoading ? 'animate-pulse' : ''}`} />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10">Studio Preview</p>
                        </div>
                    )}
                    {isLoading && (
                        <div className="absolute inset-0 bg-pm-dark/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-12 h-px bg-pm-gold animate-pulse"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGeneration;