
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO title="Page Introuvable - 404" />
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-8 bg-pm-gold/10 rounded-full flex items-center justify-center">
            <ExclamationTriangleIcon className="w-20 h-20 text-pm-gold" />
          </div>
          <h1 className="text-8xl md:text-9xl font-playfair text-pm-gold font-bold mb-4">404</h1>
          <p className="text-xl md:text-2xl text-pm-off-white/80 max-w-md mx-auto mb-12">
            Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all"
          >
            <HomeIcon className="w-6 h-6" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
