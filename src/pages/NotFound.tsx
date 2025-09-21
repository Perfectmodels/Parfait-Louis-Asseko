
import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../components/PublicPageLayout';
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  return (
    <PublicPageLayout
      title="Page Introuvable"
      subtitle=""
    >
      <div className="text-center py-20">
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
    </PublicPageLayout>
  );
};

export default NotFound;
