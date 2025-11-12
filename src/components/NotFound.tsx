import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-off-white p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-pm-gold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page non trouvée</h2>
        <p className="mb-8">Désolé, la page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link 
          to="/" 
          className="inline-block bg-pm-gold text-pm-dark font-medium py-2 px-6 rounded-full hover:bg-white transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
