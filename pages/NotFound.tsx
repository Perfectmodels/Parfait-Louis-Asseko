
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-pm-dark text-center">
      <div>
        <h1 className="text-8xl font-playfair text-pm-gold">404</h1>
        <p className="text-2xl mt-4 text-pm-off-white">Page non trouvée</p>
        <p className="mt-2 text-pm-off-white/70">Désolé, la page que vous recherchez n'existe pas.</p>
        <Link to="/" className="inline-block mt-8 px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
