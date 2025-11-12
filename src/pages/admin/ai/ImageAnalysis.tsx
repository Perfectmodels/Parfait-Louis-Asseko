import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import SEO from '../../../components/SEO';
// Data context is available if needed for future features
// import { useData } from '../../../contexts/DataContext';
import { MagnifyingGlassIcon, PhotoIcon, ArrowUpTrayIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
// ImageUploader is available if needed for future features
// import ImageUploader from '../../../components/ImageUploader';

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

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
            if (!process.env.API_KEY) {
                throw new Error("La clé API n'est pas configurée.");
            }
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = await fileToBase64(file);

            const imagePart = {
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                },
            };
            const textPart = { text: prompt };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
            });
            
            if (response.text) {
                setAnalysisResult(response.text);
            } else {
                throw new Error("Aucune réponse n'a été reçue de l'API.");
            }

        } catch (err: any) {
            console.error("Erreur de l'API Gemini:", err);
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
                        <div className="aspect-square bg-pm-dark/50 border-2 border-dashed border-pm-gold/50 rounded-lg flex items-center justify-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Aperçu" className="max-h-full max-w-full object-contain rounded" />
                            ) : (
                                <div className="text-center text-pm-off-white/50">
                                    <PhotoIcon className="w-16 h-16 mx-auto" />
                                    <p>Votre image apparaîtra ici.</p>
                                </div>
                            )}
                        </div>
                         <label htmlFor="file-upload" className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-pm-gold hover:text-pm-dark cursor-pointer">
                            <ArrowUpTrayIcon className="w-5 h-5"/>
                            Choisir un fichier
                        </label>
                        <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>

                    <div className="bg-black p-6 border border-pm-gold/20 rounded-lg">
                         <label htmlFor="prompt" className="block text-lg font-playfair text-pm-gold mb-4">2. Poser une Question</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="admin-textarea"
                            placeholder="Ex: Décris le style vestimentaire de la personne sur la photo."
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !file || !prompt}
                            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                            {isLoading ? 'Analyse en cours...' : 'Analyser'}
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    {isLoading && (
                        <div className="p-8 bg-black rounded-lg border border-pm-gold/20">
                            <p className="text-pm-gold animate-pulse">L'IA réfléchit...</p>
                        </div>
                    )}
                    {error && <p className="p-4 bg-red-900/50 text-red-300 rounded-md">{error}</p>}
                    {analysisResult && (
                        <div className="animate-fade-in bg-black p-8 border border-pm-gold/20 rounded-lg text-left">
                            <h2 className="text-2xl font-playfair text-pm-gold mb-4">Résultat de l'Analyse</h2>
                            <p className="whitespace-pre-wrap leading-relaxed text-pm-off-white/90">{analysisResult}</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ImageAnalysis;

