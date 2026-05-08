import React, { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 p-3 bg-pm-gold text-pm-dark rounded-full shadow-lg hover:bg-pm-gold/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pm-gold focus-visible:ring-offset-2"
      aria-label="Retour en haut"
    >
      <ChevronUpIcon className="w-5 h-5" />
    </button>
  );
};

export default BackToTopButton;
