import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-pm-dark text-pm-off-white">
            <SEO title="Page Non Trouvée" noIndex />
            <div className="text-center">
                <h1 className="text-6xl font-playfair text-pm-gold mb-4">404</h1>
                <p className="mb-8">La page que vous recherchez n'existe pas.</p>
                <Link to="/" className="text-pm-gold hover:underline">Retour à l'accueil</Link>
            </div>
        </div>
    );
};

export default NotFound;
