/**
 * CookieConsent Component
 * 
 * Bannière de consentement des cookies conforme RGPD
 * Affiche un message informatif avec lien vers la politique de confidentialité
 * 
 * Fonctionnalités:
 * - Stockage du consentement dans localStorage
 * - Animation d'apparition depuis le bas
 * - Lien vers la politique de confidentialité
 * - Design moderne et non-intrusif
 * 
 * @author Perfect Models Management
 * @version 1.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CookieConsent: React.FC = () => {
    const [show, setShow] = useState(false);

    /**
     * Effect: Vérifier si l'utilisateur a déjà donné son consentement
     */
    useEffect(() => {
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Afficher après 2 secondes pour ne pas être trop intrusif
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    /**
     * Gestionnaire: Accepter les cookies
     */
    const acceptCookies = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setShow(false);
    };

    /**
     * Gestionnaire: Refuser les cookies
     */
    const declineCookies = () => {
        localStorage.setItem('cookie-consent', 'declined');
        localStorage.setItem('cookie-consent-date', new Date().toISOString());
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="container mx-auto max-w-6xl">
                        <div className="bg-pm-dark/95 backdrop-blur-xl border border-pm-gold/30 rounded-2xl shadow-2xl shadow-black/50 p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                {/* Contenu */}
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                        <span className="text-2xl">🍪</span>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">
                                                Nous utilisons des cookies
                                            </h3>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Nous utilisons des cookies pour améliorer votre expérience de navigation,
                                                analyser le trafic du site et personnaliser le contenu. En cliquant sur
                                                "Accepter", vous consentez à l'utilisation de tous les cookies.
                                                {' '}
                                                <Link
                                                    to="/privacy"
                                                    className="text-pm-gold hover:text-white transition-colors underline"
                                                >
                                                    En savoir plus
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <button
                                        onClick={declineCookies}
                                        className="flex-1 md:flex-none px-6 py-3 bg-transparent border border-pm-gold/30 text-pm-off-white rounded-lg font-medium hover:bg-pm-gold/10 transition-colors duration-300"
                                    >
                                        Refuser
                                    </button>
                                    <button
                                        onClick={acceptCookies}
                                        className="flex-1 md:flex-none px-6 py-3 bg-pm-gold text-black rounded-lg font-bold hover:bg-white transition-colors duration-300 shadow-lg shadow-pm-gold/20"
                                    >
                                        Accepter
                                    </button>
                                </div>

                                {/* Bouton fermer (mobile) */}
                                <button
                                    onClick={declineCookies}
                                    className="absolute top-4 right-4 md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Fermer"
                                >
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
