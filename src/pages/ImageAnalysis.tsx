import React, { useState, useCallback } from 'react';
import SEO from '../components/SEO';
import { PhotoIcon, PaperAirplaneIcon, ArrowUpTrayIcon } from '@heroicons/react/24/solid';
import { geminiService } from '../services/geminiService';
import Button from '../components/ui/Button';

const ImageAnalysis: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [analysisResult, setAnalysisResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setAnalysisResult('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!file || !prompt) {
            setError('Veuillez téléverser une image et poser une question.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult('');

        try {
            const result = await geminiService.analyzeImage(file, prompt);
            setAnalysisResult(result || "Aucune réponse de l'IA.");

        } catch (err: any) {
            console.error("Erreur Gemini:", err);
            setError(err.message || "Une erreur est survenue lors de l'analyse.");
        } finally {
            setIsLoading(false);
        }
    }, [file, prompt]);

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Analyse d'Image par IA" description="Téléversez une image et posez une question à Gemini pour obtenir une analyse détaillée de son contenu." />
            <div className="container mx-auto px-6 max-w-4xl text-center">
                <h1 className="page-title">Analyse d'Image par IA</h1>
                <p className="page-subtitle">
                    Téléversez une photo et interrogez l'IA sur son contenu, son style, ou tout autre détail visuel.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="bg-black p-6 border border-pm-gold/20 rounded-lg">
                        <label htmlFor="file-upload" className="block text-lg font-playfair text-pm-gold mb-4">1. Téléverser une Image</label>
                        <div className="aspect-square bg-pm-dark/50 border-2 border-dashed border-pm-gold/50 rounded-lg flex items-center justify-center relative overflow-hidden group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover rounded transition-transform duration-500 group-hover:scale-110" />
                            ) : (
                                <div className="text-center text-pm-off-white/50">
                                    <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
                                    <p>Votre image apparaîtra ici.</p>
                                </div>
                            )}
                        </div>
                        <label htmlFor="file-upload" className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-pm-gold hover:text-pm-dark cursor-pointer transition-colors duration-300">
                            <ArrowUpTrayIcon className="w-5 h-5" />
                            Choisir un fichier
                        </label>
                        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    <div className="bg-black p-6 border border-pm-gold/20 rounded-lg flex flex-col h-full">
                        <label htmlFor="prompt" className="block text-lg font-playfair text-pm-gold mb-4">2. Poser une Question</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={6}
                            className="admin-textarea mb-4 flex-grow"
                            placeholder="Ex: Décris le style vestimentaire de la personne sur la photo."
                        />

                        <Button
                            onClick={handleAnalyze}
                            disabled={!file || !prompt}
                            isLoading={isLoading}
                            className="w-full mt-auto"
                            icon={<PaperAirplaneIcon className="w-5 h-5" />}
                        >
                            Analyser
                        </Button>
                    </div>
                </div>

                <div className="mt-12">
                    {isLoading && (
                        <div className="p-8 bg-black rounded-lg border border-pm-gold/20 flex items-center justify-center gap-4">
                            <div className="w-6 h-6 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" />
                            <p className="text-pm-gold animate-pulse">L'IA analyse votre image...</p>
                        </div>
                    )}
                    {error && <p className="p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-md">{error}</p>}
                    {analysisResult && (
                        <div className="animate-fade-in bg-black p-8 border border-pm-gold/20 rounded-lg text-left shadow-2xl shadow-pm-gold/5">
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6 border-b border-pm-gold/20 pb-4">Résultat de l'Analyse</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-wrap leading-relaxed text-pm-off-white/90 text-lg">{analysisResult}</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ImageAnalysis;