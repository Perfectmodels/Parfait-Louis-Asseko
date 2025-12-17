/**
 * ScrollToTop Component
 * 
 * Bouton flottant qui apparaît après 500px de scroll
 * Permet de revenir rapidement en haut de la page
 * 
 * Fonctionnalités:
 * - Apparition/disparition animée
 * - Scroll smooth vers le haut
 * - Design moderne avec effet hover
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

const ScrollToTop: React.FC = () => {
    const [visible, setVisible] = useState(false);

    /**
     * Effect: Afficher/masquer le bouton selon la position de scroll
     */
    useEffect(() => {
        const toggleVisible = () => {
            const scrolled = window.scrollY;
            setVisible(scrolled > 500);
        };

        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    /**
     * Gestionnaire: Scroll vers le haut avec animation smooth
     */
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-30 p-3 md:p-4 bg-pm-gold text-black rounded-full shadow-lg shadow-pm-gold/20 hover:shadow-pm-gold/40 transition-shadow duration-300 group"
                    aria-label="Retour en haut"
                >
                    <ArrowUpIcon className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
