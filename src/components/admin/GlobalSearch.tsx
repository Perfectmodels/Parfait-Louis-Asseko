/**
 * GlobalSearch Component
 * 
 * Composant de recherche globale pour le panel admin avec navigation au clavier.
 * Permet de rechercher rapidement dans toutes les pages disponibles du panel admin.
 * 
 * Fonctionnalités:
 * - Recherche fuzzy dans les titres, descriptions et catégories
 * - Navigation au clavier (↑↓ pour naviguer, Enter pour sélectionner, Esc pour fermer)
 * - Raccourci clavier global: Cmd/Ctrl + K
 * - Animations fluides avec Framer Motion
 * - Auto-focus sur l'input à l'ouverture
 * 
 * @author Perfect Models Management
 * @version 2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interface définissant la structure d'un résultat de recherche
 */
interface SearchResult {
    title: string;        // Titre de la page
    description: string;  // Description courte de la page
    path: string;        // Chemin de navigation
    category: string;    // Catégorie (Principal, Recrutement, Contenu, etc.)
}

/**
 * Liste exhaustive de toutes les pages recherchables dans le panel admin
 * Organisée par catégories pour une meilleure navigation
 */
const searchablePages: SearchResult[] = [
    // Pages principales
    { title: 'Dashboard', description: 'Vue d\'ensemble du panel admin', path: '/admin', category: 'Principal' },
    { title: 'Mannequins', description: 'Gérer les profils de mannequins', path: '/admin/models', category: 'Principal' },
    { title: 'Magazine', description: 'Gérer les articles du magazine', path: '/admin/magazine', category: 'Principal' },
    { title: 'Bookings', description: 'Gérer les demandes de booking', path: '/admin/bookings', category: 'Principal' },

    // Pages de recrutement
    { title: 'Candidatures Casting', description: 'Voir les candidatures de casting', path: '/admin/casting-applications', category: 'Recrutement' },
    { title: 'Résultats Casting', description: 'Gérer les résultats de casting', path: '/admin/casting-results', category: 'Recrutement' },
    { title: 'Candidatures PFD', description: 'Candidatures Perfect Fashion Day', path: '/admin/fashion-day-applications', category: 'Recrutement' },

    // Pages de contenu
    { title: 'Actualités', description: 'Publier des actualités', path: '/admin/news', category: 'Contenu' },
    { title: 'Page Agence', description: 'Modifier le contenu de l\'agence', path: '/admin/agency', category: 'Contenu' },
    { title: 'Événements PFD', description: 'Gérer les événements Fashion Day', path: '/admin/fashion-day-events', category: 'Contenu' },
    { title: 'Réservations PFD', description: 'Voir les réservations Fashion Day', path: '/admin/fashion-day-reservations', category: 'Contenu' },
    { title: 'Paramètres', description: 'Configuration du site', path: '/admin/settings', category: 'Contenu' },

    // Outils IA
    { title: 'Générateur d\'Image', description: 'Créer des images avec IA', path: '/admin/generer-image', category: 'Outils IA' },
    { title: 'Analyse d\'Image', description: 'Analyser des images avec IA', path: '/admin/analyser-image', category: 'Outils IA' },
    { title: 'Live Chat IA', description: 'Chat en direct avec IA', path: '/admin/live-chat', category: 'Outils IA' },
    { title: 'Classroom Pro', description: 'Gérer les cours', path: '/admin/classroom', category: 'Formation' },
    { title: 'Suivi Pro', description: 'Suivre la progression', path: '/admin/classroom-progress', category: 'Formation' },
    { title: 'Accès Pro', description: 'Gérer les accès mannequins', path: '/admin/model-access', category: 'Formation' },
    { title: 'Suivi Absences', description: 'Gérer les absences', path: '/admin/absences', category: 'Formation' },
    { title: 'Comptabilité', description: 'Gérer les paiements', path: '/admin/payments', category: 'Formation' },
    { title: 'Direction Artistique', description: 'Gérer les séances photo', path: '/admin/artistic-direction', category: 'Formation' },
    { title: 'Mailing', description: 'Envoyer des emails', path: '/admin/mailing', category: 'Communication' },
    { title: 'Messages', description: 'Messages de contact', path: '/admin/messages', category: 'Communication' },
    { title: 'Commentaires', description: 'Gérer les commentaires', path: '/admin/comments', category: 'Communication' },
    { title: 'Récupération', description: 'Demandes de récupération', path: '/admin/recovery-requests', category: 'Communication' },
];

/**
 * Props du composant GlobalSearch
 */
interface GlobalSearchProps {
    isOpen: boolean;   // Contrôle l'affichage du modal
    onClose: () => void; // Callback pour fermer le modal
}

/**
 * Composant principal de recherche globale
 */
const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
    // État pour la requête de recherche
    const [query, setQuery] = useState('');

    // État pour les résultats filtrés
    const [results, setResults] = useState<SearchResult[]>([]);

    // Index de l'élément sélectionné pour la navigation au clavier
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Hook de navigation React Router
    const navigate = useNavigate();

    // Référence pour l'input de recherche (auto-focus)
    const inputRef = useRef<HTMLInputElement>(null);

    /**
     * Effect: Auto-focus sur l'input quand le modal s'ouvre
     * Améliore l'UX en permettant de taper immédiatement
     */
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    /**
     * Effect: Filtrage des résultats en fonction de la requête
     * - Si la requête est vide, affiche les 8 premières pages
     * - Sinon, filtre par titre, description ou catégorie
     * - Réinitialise l'index sélectionné à chaque changement
     */
    useEffect(() => {
        if (query.trim() === '') {
            // Afficher les pages les plus populaires par défaut
            setResults(searchablePages.slice(0, 8));
        } else {
            // Recherche fuzzy dans tous les champs
            const filtered = searchablePages.filter(page =>
                page.title.toLowerCase().includes(query.toLowerCase()) ||
                page.description.toLowerCase().includes(query.toLowerCase()) ||
                page.category.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        }
        // Réinitialiser la sélection
        setSelectedIndex(0);
    }, [query]);

    /**
     * Gestionnaire de navigation au clavier
     * @param e - Événement clavier React
     * 
     * Touches supportées:
     * - ArrowDown: Descendre dans la liste (avec wrap-around)
     * - ArrowUp: Monter dans la liste (avec wrap-around)
     * - Enter: Sélectionner le résultat actuel
     * - Escape: Fermer le modal
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            // Modulo pour revenir au début si on est à la fin
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            // Modulo pour aller à la fin si on est au début
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    /**
     * Gestionnaire de sélection d'un résultat
     * @param result - Le résultat sélectionné
     * 
     * Actions:
     * 1. Navigue vers la page sélectionnée
     * 2. Ferme le modal
     * 3. Réinitialise la requête de recherche
     */
    const handleSelect = (result: SearchResult) => {
        navigate(result.path);
        onClose();
        setQuery('');
    };

    // Ne rien afficher si le modal est fermé
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-2xl bg-pm-dark border border-pm-gold/30 rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-pm-gold/20">
                        <MagnifyingGlassIcon className="w-6 h-6 text-pm-gold/60" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Rechercher dans le panel admin..."
                            className="flex-1 bg-transparent text-pm-off-white placeholder-pm-off-white/40 outline-none text-lg"
                        />
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-pm-gold/10 rounded-md transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-pm-off-white/60" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-96 overflow-y-auto">
                        {results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result, index) => (
                                    <button
                                        key={result.path}
                                        onClick={() => handleSelect(result)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${index === selectedIndex
                                            ? 'bg-pm-gold/10 border-l-2 border-pm-gold'
                                            : 'border-l-2 border-transparent hover:bg-pm-gold/5'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-pm-off-white">{result.title}</h3>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-pm-gold/20 text-pm-gold">
                                                    {result.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-pm-off-white/60 mt-1">{result.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 text-center text-pm-off-white/60">
                                <p>Aucun résultat trouvé pour "{query}"</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-pm-gold/20 bg-black/30 flex items-center justify-between text-xs text-pm-off-white/50">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">↑</kbd>
                                <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">↓</kbd>
                                pour naviguer
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">Enter</kbd>
                                pour sélectionner
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">Esc</kbd>
                            pour fermer
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GlobalSearch;
