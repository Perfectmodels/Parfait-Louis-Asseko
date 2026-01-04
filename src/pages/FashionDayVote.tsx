import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrophyIcon,
    UserGroupIcon,
    SparklesIcon,
    CheckBadgeIcon,
    ExclamationTriangleIcon,
    HandThumbUpIcon,
    ShieldCheckIcon,
    LockClosedIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';

import { MODEL_IMAGES } from '../constants/modelImages';

// --- Types & Interfaces ---

export interface VoteCategory {
    id: string;
    title: string;
    description: string;
    icon: any;
    nominees: Nominee[];
}

export interface Nominee {
    id: string;
    name: string;
    imageUrl: string;
    description?: string;
    votes?: number; // In a real scenario, this would come from the backend aggregation
}

// Temporary Mock Data for Categories (Consolidated with real images where possible)
const VOTING_CATEGORIES: VoteCategory[] = [
    {
        id: 'top-modele-femme',
        title: 'Top Modèle Femme',
        description: "La mannequin qui a le plus marqué l'année par son élégance et ses performances.",
        icon: SparklesIcon,
        nominees: [
            { id: '1', name: 'Mannequin 1', imageUrl: MODEL_IMAGES[1] || '/images/fashion-day/models/1.png' },
            { id: '2', name: 'Mannequin 2', imageUrl: MODEL_IMAGES[2] || '/images/fashion-day/models/2.png' },
            { id: '3', name: 'Mannequin 3', imageUrl: MODEL_IMAGES[3] || '/images/fashion-day/models/3.png' },
            { id: '4', name: 'Mannequin 4', imageUrl: MODEL_IMAGES[4] || '/images/fashion-day/models/4.png' },
            { id: '5', name: 'Mannequin 5', imageUrl: MODEL_IMAGES[5] || '/images/fashion-day/models/5.png' },
        ]
    },
    {
        id: 'top-modele-homme',
        title: 'Top Modèle Homme',
        description: "Le mannequin homme qui s'est distingué par son charisme et sa présence.",
        icon: UserGroupIcon,
        nominees: [
            { id: '6', name: 'Mannequin 6', imageUrl: MODEL_IMAGES[6] || '/images/fashion-day/models/6.png' },
            { id: '7', name: 'Mannequin 7', imageUrl: MODEL_IMAGES[7] || '/images/fashion-day/models/7.png' },
            { id: '8', name: 'Mannequin 8', imageUrl: MODEL_IMAGES[8] || '/images/fashion-day/models/8.png' },
            { id: '9', name: 'Mannequin 9', imageUrl: MODEL_IMAGES[9] || '/images/fashion-day/models/9.png' },
            { id: '10', name: 'Mannequin 10', imageUrl: MODEL_IMAGES[10] || '/images/fashion-day/models/10.png' },
        ]
    },
    {
        id: 'revelation-annee',
        title: 'Révélation de l\'Année',
        description: "Le nouveau visage qui a surpris tout le monde cette saison.",
        icon: TrophyIcon,
        nominees: [
            { id: '11', name: 'Mannequin 11', imageUrl: MODEL_IMAGES[11] || '/images/fashion-day/models/11.png' },
            { id: '12', name: 'Mannequin 12', imageUrl: MODEL_IMAGES[12] || '/images/fashion-day/models/12.png' },
        ]
    }
];

// --- Sub-Components ---

const HeroSection = () => (
    <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1537832816519-689ad163238b?q=80&w=2059&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="relative z-10 text-center px-4 max-w-4xl">
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <span className="block text-pm-gold uppercase tracking-[0.3em] font-bold mb-4 text-sm md:text-base">
                    Perfect Fashion Awards
                </span>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-playfair text-white mb-6 leading-tight">
                    Votez pour Vos Favoris
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                    Célébrez l'excellence de la mode gabonaise. Votre voix compte pour élire les talents qui ont marqué cette édition.
                </p>
            </motion.div>
        </div>
    </div>
);

const SecurityBadge = () => (
    <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/10 w-fit mx-auto mt-8">
        <ShieldCheckIcon className="w-4 h-4 text-green-500" />
        <span>Système de vote sécurisé & anti-fraude actif</span>
    </div>
);

// --- Main Pages Component ---

const FashionDayVote: React.FC = () => {
    // const { data } = useData(); // Unused
    const [activeCategory, setActiveCategory] = useState<string>(VOTING_CATEGORIES[0].id);
    const [votes, setVotes] = useState<Record<string, string>>({}); // categoryId -> nomineeId
    // const [isSubmitting, setIsSubmitting] = useState(false); // Unused
    const [showCaptcha, setShowCaptcha] = useState(false);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    const [pendingVote, setPendingVote] = useState<{ categoryId: string, nomineeId: string } | null>(null);
    const [hasVotedToday, setHasVotedToday] = useState(false);

    // Anti-fraud: Load local storage state
    useEffect(() => {
        const storedVotes = localStorage.getItem('pfd_votes_2025');
        if (storedVotes) {
            setVotes(JSON.parse(storedVotes));
        }

        const lastVoteDate = localStorage.getItem('pfd_last_vote_date');
        const today = new Date().toDateString();
        if (lastVoteDate === today) {
            setHasVotedToday(true);
        }
    }, []);

    const handleVoteClick = (categoryId: string, nomineeId: string) => {
        if (votes[categoryId]) return; // Already voted in this category

        // Anti-fraud check: 1 vote per day limitation (simple client-side check)
        if (hasVotedToday) {
            alert("Vous avez déjà voté aujourd'hui. Revenez demain !");
            return;
        }

        setPendingVote({ categoryId, nomineeId });
        setShowCaptcha(true);
    };

    const confirmVote = () => {
        if (captchaAnswer !== '4') { // Very simple Mock Captcha for MVP (2 + 2)
            alert("Captcha incorrect. Veuillez réessayer.");
            return;
        }

        if (pendingVote) {
            const newVotes = { ...votes, [pendingVote.categoryId]: pendingVote.nomineeId };
            setVotes(newVotes);

            // Persist to Local Storage
            localStorage.setItem('pfd_votes_2025', JSON.stringify(newVotes));
            localStorage.setItem('pfd_last_vote_date', new Date().toDateString());

            setHasVotedToday(true);
            setShowCaptcha(false);
            setPendingVote(null);
            setCaptchaAnswer('');

            // TODO: Here you would send the vote to the backend (Firebase)
            // await dbService.submitVote(...) 
            alert("Votre vote a été pris en compte !");
        }
    };

    const activeCategoryData = VOTING_CATEGORIES.find(c => c.id === activeCategory);

    return (
        <div className="bg-black min-h-screen text-white pb-24">
            <SEO
                title="Votes & Récompenses | Perfect Fashion Day"
                description="Votez pour vos mannequins et créateurs préférés pour les Perfect Fashion Awards."
            />

            <HeroSection />

            <div className="container mx-auto px-6 -mt-20 relative z-20">

                {/* Anti-Fraud Notice */}
                <div className="bg-pm-dark/95 backdrop-blur border border-white/10 p-6 rounded-lg shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-pm-gold/10 rounded-full">
                            <ExclamationTriangleIcon className="w-6 h-6 text-pm-gold" />
                        </div>
                        <div>
                            <h3 className="text-lg font-playfair text-white mb-1">Règles de Vote</h3>
                            <p className="text-gray-400 text-sm">
                                Le vote est limité à une fois par jour et par personne. Tout comportement suspect entraînera l'annulation des votes.
                            </p>
                        </div>
                    </div>
                    <SecurityBadge />
                </div>

                {/* Categories Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {VOTING_CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${activeCategory === cat.id
                                ? 'bg-pm-gold text-black border-pm-gold font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                : 'bg-transparent text-gray-400 border-white/20 hover:border-white hover:text-white'
                                }`}
                        >
                            <cat.icon className="w-5 h-5" />
                            <span className="uppercase tracking-widest text-xs">{cat.title}</span>
                        </button>
                    ))}
                </div>

                {/* Nominees Grid */}
                <AnimatePresence mode="wait">
                    {activeCategoryData && (
                        <motion.div
                            key={activeCategory}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-playfair text-white mb-4">{activeCategoryData.title}</h2>
                                <p className="text-gray-400 max-w-xl mx-auto">{activeCategoryData.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {activeCategoryData.nominees.map((nominee) => {
                                    const isVoted = votes[activeCategoryData.id] === nominee.id;
                                    const isDisabled = !!votes[activeCategoryData.id]; // Disable if any vote cast in this category

                                    return (
                                        <div key={nominee.id} className={`group relative bg-white/5 border ${isVoted ? 'border-pm-gold' : 'border-white/10'} overflow-hidden transition-all duration-300 hover:bg-white/10`}>

                                            {/* Image */}
                                            <div className="aspect-[3/4] overflow-hidden relative">
                                                <img
                                                    src={nominee.imageUrl}
                                                    alt={nominee.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {isVoted && (
                                                    <div className="absolute inset-0 bg-pm-gold/80 flex items-center justify-center backdrop-blur-sm">
                                                        <div className="bg-white text-black p-3 rounded-full shadow-lg">
                                                            <CheckBadgeIcon className="w-8 h-8" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 text-center">
                                                <h3 className="text-xl font-playfair text-white mb-2">{nominee.name}</h3>

                                                <button
                                                    onClick={() => handleVoteClick(activeCategoryData.id, nominee.id)}
                                                    disabled={isDisabled}
                                                    className={`w-full mt-4 py-3 px-4 flex items-center justify-center gap-2 uppercase tracking-widest text-xs font-bold transition-all ${isVoted
                                                        ? 'bg-pm-gold text-black cursor-default'
                                                        : isDisabled
                                                            ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                                            : 'bg-transparent border border-white/30 text-white hover:bg-white hover:text-black hover:border-white'
                                                        }`}
                                                >
                                                    {isVoted ? (
                                                        <>
                                                            <CheckBadgeIcon className="w-4 h-4" /> Voté
                                                        </>
                                                    ) : isDisabled ? (
                                                        <>
                                                            <LockClosedIcon className="w-4 h-4" /> Vote Clos
                                                        </>
                                                    ) : (
                                                        <>
                                                            <HandThumbUpIcon className="w-4 h-4" /> Voter
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Captcha / Confirmation Modal */}
            <AnimatePresence>
                {showCaptcha && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-pm-dark border border-white/20 p-8 rounded-lg max-w-sm w-full text-center"
                        >
                            <h3 className="text-2xl font-playfair text-white mb-4">Confirmer le Vote</h3>
                            <p className="text-gray-400 mb-6">Pour éviter les votes automatisés, veuillez répondre à cette question simple :</p>

                            <div className="bg-white/5 p-4 rounded mb-6">
                                <span className="text-xl font-bold text-pm-gold block mb-2">Combien font 2 + 2 ?</span>
                                <input
                                    type="text"
                                    value={captchaAnswer}
                                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                                    className="w-full bg-black border border-white/30 rounded p-2 text-white text-center focus:border-pm-gold outline-none"
                                    placeholder="Votre réponse"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowCaptcha(false)}
                                    className="flex-1 py-3 border border-white/20 text-gray-400 hover:bg-white/10 hover:text-white transition-colors uppercase text-xs font-bold tracking-widest"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={confirmVote}
                                    className="flex-1 py-3 bg-pm-gold text-black hover:bg-white transition-colors uppercase text-xs font-bold tracking-widest"
                                >
                                    Confirmer
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default FashionDayVote;
