import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components';

const NotFound: React.FC = () => {
    return (
        <>
            <SEO title="Page Non Trouvée" noIndex />
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-6xl font-playfair text-pm-gold mb-4">404</h1>
                <p className="text-xl mb-8">Oups ! La page que vous recherchez n'existe pas.</p>
                <Link to="/" className="bg-pm-gold text-pm-dark px-6 py-3 rounded-full font-semibold hover:bg-white transition-colors">
                    Retour à l'accueil
                </Link>
            </div>
        </>
    );
};

export default NotFound;
