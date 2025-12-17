/**
 * ReadingProgress Component
 * 
 * Barre de progression de lecture pour les articles longs
 * Affiche visuellement la progression de lecture de l'utilisateur
 * 
 * Fonctionnalités:
 * - Calcul automatique de la progression
 * - Animation fluide
 * - Design minimaliste
 * - Fixé en haut de la page
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ReadingProgressProps {
    /**
     * Couleur de la barre de progression
     * @default 'bg-pm-gold'
     */
    color?: string;

    /**
     * Hauteur de la barre en pixels
     * @default 3
     */
    height?: number;
}

const ReadingProgress: React.FC<ReadingProgressProps> = ({
    color = 'bg-pm-gold',
    height = 3
}) => {
    const [progress, setProgress] = useState(0);

    // Utiliser useScroll de Framer Motion pour une meilleure performance
    const { scrollYProgress } = useScroll();

    // Ajouter un effet de spring pour une animation plus fluide
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    /**
     * Effect: Mettre à jour la progression au scroll
     */
    useEffect(() => {
        const updateProgress = () => {
            const scrolled = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progressValue = (scrolled / height) * 100;
            setProgress(Math.min(progressValue, 100));
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress(); // Calcul initial

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <>
            {/* Version avec Framer Motion (plus performante) */}
            <motion.div
                className={`fixed top-0 left-0 right-0 ${color} z-50 origin-left`}
                style={{
                    height: `${height}px`,
                    scaleX
                }}
            />

            {/* Version alternative sans Framer Motion */}
            {/* <div className="fixed top-0 left-0 w-full h-1 bg-gray-900 z-50">
                <div 
                    className={`h-full ${color} transition-all duration-150 ease-out`}
                    style={{ width: `${progress}%` }}
                />
            </div> */}
        </>
    );
};

export default ReadingProgress;
