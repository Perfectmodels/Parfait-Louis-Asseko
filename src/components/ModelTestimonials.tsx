import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';

interface ModelTestimonial {
    id: string;
    name: string;
    content: string;
    achievement: string;
    rating: number;
}

const ModelTestimonials: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const modelTestimonials: ModelTestimonial[] = [
        {
            id: '1',
            name: 'Akoma Ayo Rosnel',
            content: 'Perfect Models Management m\'a donné la confiance nécessaire pour percer dans le mannequinat. Grâce à leur formation et leur accompagnement, j\'ai pu participer à des défilés internationaux et travailler avec les plus grandes marques du Gabon.',
            achievement: 'Défilé Perfect Fashion Day 2025',
            rating: 5
        },
        {
            id: '2',
            name: 'Grace Mboumba',
            content: 'Rejoindre Perfect Models Management a changé ma vie. L\'équipe m\'a appris que la beauté vient de l\'intérieur et que chaque femme peut être un modèle. Aujourd\'hui, je suis fière de représenter la beauté gabonaise.',
            achievement: 'Campagne publicitaire nationale',
            rating: 5
        },
        {
            id: '3',
            name: 'Kevin Minko',
            content: 'En tant qu\'homme, je pensais que le mannequinat n\'était pas pour moi. Perfect Models Management m\'a prouvé le contraire. Leur vision inclusive et leur professionnalisme m\'ont permis de m\'épanouir dans ce métier.',
            achievement: 'Shooting mode masculine 2024',
            rating: 5
        },
        {
            id: '4',
            name: 'Aïcha Diallo',
            content: 'Perfect Models Management m\'a appris que le mannequinat va au-delà des apparences. C\'est un art, une passion, une façon d\'exprimer sa personnalité. L\'équipe m\'a guidée et m\'a donné les outils pour réussir.',
            achievement: 'Défilé haute couture',
            rating: 5
        },
        {
            id: '5',
            name: 'Marc Nguema',
            content: 'Grâce à Perfect Models Management, j\'ai découvert un nouveau monde. Leur formation est complète et leur accompagnement personnalisé. Aujourd\'hui, je suis fier de faire partie de cette famille exceptionnelle.',
            achievement: 'Campagne magazine Focus Model 241',
            rating: 5
        }
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % modelTestimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + modelTestimonials.length) % modelTestimonials.length);
    };

    const currentTestimonial = modelTestimonials[currentIndex];

    return (
        <section className="py-16 bg-gradient-to-b from-black to-pm-dark">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-playfair text-pm-gold mb-4">
                        Témoignages de nos Mannequins
                    </h2>
                    <p className="text-lg text-pm-off-white/80 max-w-2xl mx-auto">
                        Découvrez les parcours inspirants de nos mannequins et leur expérience avec Perfect Models Management.
                    </p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 md:p-10 relative"
                        >
                            {/* Mannequin Badge */}
                            <div className="absolute top-4 right-4">
                                <span className="bg-pm-gold/20 text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                                    Mannequin
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 border border-pm-gold/30 flex items-center justify-center">
                                        <span className="text-3xl font-bold text-pm-gold">
                                            {currentTestimonial.name.charAt(0)}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 text-center md:text-left">
                                    {/* Rating */}
                                    <div className="flex justify-center md:justify-start gap-1 mb-4">
                                        {[...Array(currentTestimonial.rating)].map((_, i) => (
                                            <StarIcon key={i} className="w-5 h-5 text-pm-gold fill-current" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="text-lg md:text-xl text-pm-off-white/90 mb-6 leading-relaxed">
                                        "{currentTestimonial.content}"
                                    </blockquote>

                                    {/* Author & Achievement */}
                                    <div>
                                        <div className="font-semibold text-pm-gold text-xl mb-2">
                                            {currentTestimonial.name}
                                        </div>
                                        <div className="text-pm-off-white/70 mb-2">
                                            Mannequin Perfect Models
                                        </div>
                                        <div className="text-pm-gold/80 text-sm font-medium">
                                            ✨ {currentTestimonial.achievement}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-center items-center gap-4 mt-8">
                        <button
                            onClick={prevTestimonial}
                            className="p-3 rounded-full bg-pm-gold/10 border border-pm-gold/30 text-pm-gold hover:bg-pm-gold hover:text-pm-dark transition-all duration-300"
                            aria-label="Témoignage précédent"
                        >
                            <ChevronLeftIcon className="w-5 h-5" />
                        </button>

                        {/* Dots */}
                        <div className="flex gap-2">
                            {modelTestimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'bg-pm-gold'
                                            : 'bg-pm-gold/30 hover:bg-pm-gold/50'
                                    }`}
                                    aria-label={`Aller au témoignage ${index + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextTestimonial}
                            className="p-3 rounded-full bg-pm-gold/10 border border-pm-gold/30 text-pm-gold hover:bg-pm-gold hover:text-pm-dark transition-all duration-300"
                            aria-label="Témoignage suivant"
                        >
                            <ChevronRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ModelTestimonials;
