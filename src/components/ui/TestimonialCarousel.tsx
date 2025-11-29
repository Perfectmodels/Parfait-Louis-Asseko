import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        id: 1,
        name: "Sarah M.",
        role: "Mannequin",
        content: "Une agence incroyable qui m'a permis de réaliser mon rêve. L'accompagnement est professionnel et bienveillant.",
    },
    {
        id: 2,
        name: "Jean P.",
        role: "Directeur Artistique",
        content: "Perfect Models est la référence au Gabon. Leurs mannequins sont toujours bien formés et professionnels.",
    },
    {
        id: 3,
        name: "Marie L.",
        role: "Partenaire",
        content: "Une collaboration fructueuse depuis des années. Je recommande vivement leurs services pour tout événement de mode.",
    }
];

const TestimonialCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto h-64 overflow-hidden">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
                >
                    <p className="text-xl md:text-2xl font-playfair italic mb-4 text-pm-off-white">"{testimonials[currentIndex].content}"</p>
                    <h4 className="text-lg font-bold text-pm-gold">{testimonials[currentIndex].name}</h4>
                    <p className="text-sm text-gray-400">{testimonials[currentIndex].role}</p>
                </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-pm-gold' : 'bg-gray-600'}`}
                        aria-label={`Aller au témoignage ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialCarousel;
