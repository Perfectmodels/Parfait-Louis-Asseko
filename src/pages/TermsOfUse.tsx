import React from 'react';
import SEO from '../../components/SEO';

const TermsOfUse: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Conditions d'Utilisation" noIndex />
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Conditions d'Utilisation</h1>
                <div className="prose prose-invert prose-lg max-w-none prose-h2:font-playfair prose-h2:text-pm-gold">
                    <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                    <h2>1. Acceptation des conditions</h2>
                    <p>En accédant et en utilisant le site web de Perfect Models Management (le "Site"), vous acceptez d'être lié par les présentes Conditions d'Utilisation. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne devez pas utiliser notre Site.</p>
                    
                    <h2>2. Utilisation du Site</h2>
                    <p>Vous vous engagez à utiliser le Site uniquement à des fins légales et d'une manière qui ne porte pas atteinte aux droits d'autrui, ni ne restreint ou n'empêche l'utilisation et la jouissance du Site par quiconque.</p>
                    <p>Le contenu de ce Site, y compris les images, textes, logos et designs, est la propriété de Perfect Models Management ou de ses concédants de licence et est protégé par les lois sur le droit d'auteur et la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est strictement interdite.</p>
                    
                    <h2>3. Contenu Utilisateur</h2>
                    <p>En soumettant des informations, des photos ou tout autre contenu via nos formulaires de candidature ou de contact, vous nous accordez une licence non exclusive, mondiale et libre de droits pour utiliser ce contenu dans le but d'évaluer votre candidature et de promouvoir vos services auprès de clients potentiels si vous êtes accepté(e) dans notre agence.</p>
                    
                    <h2>4. Limitation de responsabilité</h2>
                    <p>Le Site et son contenu sont fournis "en l'état". Nous ne garantissons pas que le Site sera exempt d'erreurs ou ininterrompu. Dans toute la mesure permise par la loi, Perfect Models Management décline toute responsabilité pour tout dommage direct ou indirect résultant de l'utilisation de ce Site.</p>
                    
                    <h2>5. Liens vers des sites tiers</h2>
                    <p>Notre Site peut contenir des liens vers des sites web tiers. Ces liens sont fournis pour votre commodité uniquement. Nous n'avons aucun contrôle sur le contenu de ces sites et n'assumons aucune responsabilité à leur égard.</p>

                    <h2>6. Modifications des conditions</h2>
                    <p>Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Votre utilisation continue du Site après de telles modifications constitue votre acceptation des nouvelles conditions.</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
