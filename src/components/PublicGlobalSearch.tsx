/**
 * PublicGlobalSearch Component
 *
 * Composant de recherche globale pour le site public avec navigation au clavier.
 * Permet de rechercher rapidement des mannequins, articles et services.
 *
 * Fonctionnalités:
 * - Recherche fuzzy
 * - Navigation au clavier (Cmd+K)
 * - Auto-focus
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon, UserIcon, NewspaperIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../contexts/DataContext';

interface SearchResult {
    id: string;
    title: string;
    description: string;
    path: string;
    category: 'Mannequin' | 'Magazine' | 'Service' | 'Page';
    image?: string;
}

const staticPages: SearchResult[] = [
    { id: 'home', title: 'Accueil', description: 'Page d\'accueil', path: '/', category: 'Page' },
    { id: 'agency', title: 'Agence', description: 'À propos de nous', path: '/agence', category: 'Page' },
    { id: 'models', title: 'Mannequins', description: 'Notre portfolio', path: '/mannequins', category: 'Page' },
    { id: 'magazine', title: 'Magazine', description: 'Actualités mode', path: '/magazine', category: 'Page' },
    { id: 'services', title: 'Services', description: 'Nos prestations', path: '/services', category: 'Page' },
    { id: 'contact', title: 'Contact', description: 'Nous contacter', path: '/contact', category: 'Page' },
    { id: 'casting', title: 'Casting', description: 'Devenir mannequin', path: '/casting-formulaire', category: 'Page' },
];

interface PublicGlobalSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const PublicGlobalSearch: React.FC<PublicGlobalSearchProps> = ({ isOpen, onClose }) => {
    const { data } = useData();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        let found: SearchResult[] = [];

        if (query.trim() === '') {
            found = staticPages;
        } else {
            const q = query.toLowerCase();

            // Static Pages
            const pages = staticPages.filter(p =>
                p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            );

            // Models (if data available)
            const models = data?.models
                .filter(m => m.isPublic && m.name.toLowerCase().includes(q))
                .map(m => ({
                    id: m.id,
                    title: m.name,
                    description: `Mannequin ${m.gender}`,
                    path: `/mannequins/${m.id}`,
                    category: 'Mannequin' as const,
                    image: m.imageUrl
                })) || [];

            // Articles (if data available)
            const articles = (data?.articles || [])
                .filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
                .map(a => ({
                    id: a.slug,
                    title: a.title,
                    description: a.category,
                    path: `/magazine/${a.slug}`,
                    category: 'Magazine' as const,
                    image: a.imageUrl
                })) || [];

             // Services (if data available)
             const services = (data?.agencyServices || [])
                .filter(s => s.title.toLowerCase().includes(q))
                .map(s => ({
                    id: s.slug,
                    title: s.title,
                    description: s.description,
                    path: `/services/${s.slug}`,
                    category: 'Service' as const
                })) || [];

            found = [...pages, ...models, ...articles, ...services];
        }

        setResults(found.slice(0, 10)); // Limit to 10 results
        setSelectedIndex(0);
    }, [query, data]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const handleSelect = (result: SearchResult) => {
        navigate(result.path);
        onClose();
        setQuery('');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full max-w-2xl bg-pm-dark border border-pm-gold/30 rounded-xl shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center gap-3 px-4 py-4 border-b border-pm-gold/20">
                        <MagnifyingGlassIcon className="w-6 h-6 text-pm-gold/60" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Rechercher (Mannequins, Articles, Services)..."
                            className="flex-1 bg-transparent text-pm-off-white placeholder-pm-off-white/40 outline-none text-lg"
                        />
                        <button onClick={onClose} className="p-1 hover:bg-pm-gold/10 rounded-md transition-colors">
                            <XMarkIcon className="w-5 h-5 text-pm-off-white/60" />
                        </button>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto">
                        {results.length > 0 ? (
                            <div className="py-2">
                                {results.map((result, index) => (
                                    <button
                                        key={`${result.category}-${result.id}`}
                                        onClick={() => handleSelect(result)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`w-full text-left px-4 py-3 flex items-center gap-4 transition-colors ${index === selectedIndex
                                            ? 'bg-pm-gold/10 border-l-2 border-pm-gold'
                                            : 'border-l-2 border-transparent hover:bg-pm-gold/5'
                                            }`}
                                    >
                                        {result.image ? (
                                            <img src={result.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center text-pm-gold">
                                                {result.category === 'Mannequin' && <UserIcon className="w-5 h-5"/>}
                                                {result.category === 'Magazine' && <NewspaperIcon className="w-5 h-5"/>}
                                                {result.category === 'Service' && <BriefcaseIcon className="w-5 h-5"/>}
                                                {result.category === 'Page' && <MagnifyingGlassIcon className="w-5 h-5"/>}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-pm-off-white truncate">{result.title}</h3>
                                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pm-gold/20 text-pm-gold uppercase tracking-wider">
                                                    {result.category}
                                                </span>
                                            </div>
                                            <p className="text-sm text-pm-off-white/60 mt-0.5 truncate">{result.description}</p>
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
                     <div className="px-4 py-3 border-t border-pm-gold/20 bg-black/30 flex items-center justify-between text-xs text-pm-off-white/50 hidden md:flex">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">↑</kbd>
                                <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">↓</kbd>
                                naviguer
                            </span>
                            <span className="flex items-center gap-1">
                                <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">Enter</kbd>
                                sélectionner
                            </span>
                        </div>
                        <span className="flex items-center gap-1">
                            <kbd className="px-2 py-1 bg-pm-dark border border-pm-gold/20 rounded">Esc</kbd>
                            fermer
                        </span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PublicGlobalSearch;
