
import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  altText: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full aspect-square group">
      <div className="w-full h-full rounded-lg overflow-hidden">
        <img 
          src={images[currentIndex]} 
          alt={`${altText} ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-opacity duration-500"
        />
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-2 text-white/50 group-hover:text-white cursor-pointer p-2 bg-black/30 rounded-full transition-all" onClick={goToPrevious}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 text-white/50 group-hover:text-white cursor-pointer p-2 bg-black/30 rounded-full transition-all" onClick={goToNext}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div key={index} className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-pm-gold' : 'bg-white/50'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
