import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, Type } from '@google/genai';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { SparklesIcon } from '@heroicons/react/24/solid';

const Motivation: React.FC = () => {
    const { data } = useData();
    const [phrases, setPhrases] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMotivationalPhrases = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: "Génère 5 phrases de motivation courtes et percutantes pour des mannequins et des créateurs de mode. Les phrases doivent être inspirantes, originales et en français. Fournis le résultat dans un objet JSON avec une seule clé 'phrases' qui est un tableau de chaînes de caractères.",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            phrases: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        }
                    }
                }
            });

            const jsonResponse = JSON.parse(response.text);
            if (jsonResponse.phrases && jsonResponse.phrases.length > 0) {
                setPhrases(jsonResponse.phrases);
                setCurrentIndex(0);
            } else {
                throw new Error("La réponse de l'IA est invalide.");
            }
        } catch (err: any) {
            console.error("Erreur de l'API Gemini:", err);
            setError("Impossible de générer de nouvelles phrases pour le moment.");
            setPhrases(["L'élégance est la seule beauté qui ne se fane jamais."]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMotivationalPhrases();
        const fetchInterval = setInterval(fetchMotivationalPhrases, 120000); // 2 minutes
        return () => clearInterval(fetchInterval);
    }, [fetchMotivationalPhrases]);

    useEffect(() => {
        if (phrases.length === 0) return;
        const phraseInterval = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % phrases.length);
        }, 8000); // Change phrase every 8 seconds
        return () => clearInterval(phraseInterval);
    }, [phrases]);

    return (
        <>
            <SEO
                title="Motivation"
                description="Votre dose d'inspiration quotidienne pour rester motivé et créatif dans le monde de la mode."
                image={data?.siteImages.classroomBg}
            />
            <div 
                className="relative min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center text-white p-6"
                style={{ backgroundImage: `url('${data?.siteImages.classroomBg}')` }}
            >
                <div className="absolute inset-0 bg-pm-dark/80 backdrop-blur-sm"></div>
                <div className="relative z-10 w-full max-w-4xl">
                    <SparklesIcon className="w-16 h-16 text-pm-gold mx-auto mb-4" />
                    <h1 className="text-4xl md:text-5xl font-playfair text-pm-gold font-extrabold mb-8">
                        Votre Dose de Motivation
                    </h1>
                    
                    <div className="h-48 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            {isLoading && phrases.length === 0 ? (
                                <motion.p
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xl text-pm-off-white/80 animate-pulse"
                                >
                                    Recherche de l'inspiration...
                                </motion.p>
                            ) : error ? (
                                <motion.p
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-xl text-red-400"
                                >
                                    {error}
                                </motion.p>
                            ) : (
                                <motion.p
                                    key={currentIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-2xl md:text-3xl lg:text-4xl font-light italic leading-relaxed"
                                >
                                    "{phrases[currentIndex]}"
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 text-xs text-pm-off-white/60">
                        <p>Nouvelles inspirations toutes les 2 minutes.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Motivation;