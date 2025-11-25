import React, { useState, useEffect } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-pm-gold text-pm-dark p-3 rounded-full shadow-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold focus:ring-offset-pm-dark transition-all duration-300 z-50"
          aria-label="Retour en haut de la page"
        >
          <ArrowUpIcon className="h-6 w-6" />
        </button>
      )}
    </>
  );
};

export default BackToTopButton;
