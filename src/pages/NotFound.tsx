import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center px-4 text-center py-32">
            <SEO title="Page Introuvable | Perfect Models Management" />

            <h1 className="text-9xl font-playfair italic font-black text-pm-gold mb-6">404</h1>
            <h2 className="text-3xl md:text-5xl font-playfair font-black text-white mb-8">Page Introuvable</h2>
            <p className="text-white/60 font-montserrat max-w-lg mb-12">
                La page que vous recherchez semble avoir disparu des podiums.
                Elle a peut-être été déplacée ou n'existe plus.
            </p>

            <Link
                to="/"
                className="btn-primary"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
};

export default NotFound;