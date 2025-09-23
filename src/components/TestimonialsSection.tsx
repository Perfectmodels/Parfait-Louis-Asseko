import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    image: string;
}

const TestimonialsSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials: Testimonial[] = [
        // Témoignages des mannequins
        {
            id: '1',
            name: 'Noemi Kim',
            role: 'Mannequin',
            company: 'Perfect Models Management',
            content: 'PMM est bien plus qu\'une agence, c\'est une famille qui nous pousse à donner le meilleur de nous-mêmes. La formation et l\'encadrement sont exceptionnels. Grâce à eux, j\'ai pu devenir Miss Gabon 2022 et Top Model Afrique Centrale 2023.',
            rating: 5,
            image: 'https://i.ibb.co/mCcD1Gfq/DSC-0272.jpg'
        },
        {
            id: '2',
            name: 'AJ Caramela',
            role: 'Mannequin',
            company: 'Perfect Models Management',
            content: 'Perfect Models Management m\'a appris que la beauté va au-delà des apparences. Grâce à leur formation et leur accompagnement, j\'ai développé ma confiance en moi et j\'ai pu participer à des projets incroyables. C\'est une famille !',
            rating: 5,
            image: '/api/placeholder/80/80'
        },
        {
            id: '3',
            name: 'Donatien Anani',
            role: 'Mannequin',
            company: 'Perfect Models Management',
            content: 'En tant qu\'homme, je pensais que le mannequinat n\'était pas pour moi. Perfect Models Management m\'a prouvé le contraire. Leur professionnalisme et leur vision inclusive m\'ont permis de m\'épanouir dans ce métier et de devenir Mannequin Homme de l\'Année aux PFD Awards 2025.',
            rating: 5,
            image: 'https://i.ibb.co/Rk1fG3ph/farelmd-37.jpg'
        },
        // Témoignages des partenaires (utilisant uniquement les vrais noms trouvés)
        {
            id: '4',
            name: 'Miguel Fashion Style',
            role: 'Créateur de Mode',
            company: 'Miguel Fashion Style',
            content: 'Collaborer avec Perfect Models Management est un gage de professionnalisme. Leurs mannequins sont non seulement magnifiques mais aussi incroyablement bien formés et ponctuels. Un vrai plaisir.',
            rating: 5,
            image: 'https://i.ibb.co/s5zW7gZ/testimonial-1.jpg'
        },
        {
            id: '5',
            name: 'Fave GLAO',
            role: 'Directrice Artistique',
            company: 'Perfect Models Management',
            content: 'L\'agence a un œil incroyable pour dénicher des talents uniques. Leur catalogue est diversifié et répond parfaitement aux besoins créatifs de nos campagnes publicitaires.',
            rating: 5,
            image: 'https://i.ibb.co/y4x9Y8X/testimonial-2.jpg'
        }
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className="py-20 bg-gradient-to-b from-pm-dark to-black relative z-30">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-playfair text-pm-gold mb-6">
                        Ce Que Disent Nos Clients
                    </h2>
                    <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto">
                        Découvrez les témoignages de nos partenaires et clients satisfaits.
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
                            className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 md:p-12 relative"
                        >
                            {/* Type Badge */}
                            <div className="absolute top-4 right-4">
                                {currentTestimonial.company === 'Perfect Models Management' ? (
                                    <span className="bg-pm-gold/20 text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                                        Mannequin
                                    </span>
                                ) : (
                                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-blue-500/50">
                                        Partenaire
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                {/* Image */}
                                <div className="flex-shrink-0">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 border border-pm-gold/30 flex items-center justify-center">
                                        <span className="text-2xl font-bold text-pm-gold">
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

                                    {/* Author */}
                                    <div>
                                        <div className="font-semibold text-pm-gold text-lg">
                                            {currentTestimonial.name}
                                        </div>
                                        <div className="text-pm-off-white/70">
                                            {currentTestimonial.role} {currentTestimonial.company === 'Perfect Models Management' ? '' : `chez ${currentTestimonial.company}`}
                                        </div>
                                        {currentTestimonial.company === 'Perfect Models Management' && (
                                            <div className="text-pm-gold/80 text-sm font-medium mt-1">
                                                ✨ Mannequin Perfect Models
                                            </div>
                                        )}
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
                            {testimonials.map((_, index) => (
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

export default TestimonialsSection;
