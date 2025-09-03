import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useData } from '../contexts/DataContext';

const TestimonialCarousel: React.FC = () => {
  const { data } = useData();
  const testimonials = data?.testimonials || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    if (testimonials.length === 0) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (testimonials.length === 0) return;
    const isLastSlide = currentIndex === testimonials.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };
  
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(goToNext, 7000); // Change slide every 7 seconds
    return () => clearInterval(interval);
  }, [currentIndex, testimonials.length]);

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-black border border-pm-gold/20 p-8 md:p-12 text-center">
      <div className="flex flex-col items-center">
        <img 
          src={currentTestimonial.imageUrl} 
          alt={currentTestimonial.name} 
          className="w-28 h-28 rounded-full object-cover border-4 border-pm-gold mb-6"
        />
        <blockquote className="max-w-2xl mx-auto">
          <p className="text-xl italic text-pm-off-white/90">
            "{currentTestimonial.quote}"
          </p>
        </blockquote>
        <footer className="mt-6">
          <p className="font-bold text-2xl text-pm-gold font-playfair">{currentTestimonial.name}</p>
          <p className="text-sm text-pm-off-white/60 uppercase tracking-widest">{currentTestimonial.role}</p>
        </footer>
      </div>

      {/* Navigation */}
      <button onClick={goToPrevious} className="absolute top-1/2 -translate-y-1/2 left-4 text-pm-gold/50 hover:text-pm-gold transition-colors p-2" aria-label="Témoignage précédent">
        <ChevronLeftIcon className="w-8 h-8" />
      </button>
      <button onClick={goToNext} className="absolute top-1/2 -translate-y-1/2 right-4 text-pm-gold/50 hover:text-pm-gold transition-colors p-2" aria-label="Témoignage suivant">
        <ChevronRightIcon className="w-8 h-8" />
      </button>
      
      {/* Dots */}
      <div className="flex justify-center space-x-3 mt-8">
        {testimonials.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-pm-gold' : 'bg-pm-off-white/40 hover:bg-pm-off-white/70'}`}
            aria-label={`Aller au témoignage ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;