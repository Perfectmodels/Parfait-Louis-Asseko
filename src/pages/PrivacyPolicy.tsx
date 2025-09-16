import React from 'react';
import SEO from '../../components/SEO';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Politique de Confidentialité" noIndex />
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Politique de Confidentialité</h1>
                <div className="prose prose-invert prose-lg max-w-none prose-h2:font-playfair prose-h2:text-pm-gold">
                    <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    
                    <h2>1. Introduction</h2>
                    <p>Perfect Models Management ("nous", "notre") s'engage à protéger la vie privée des visiteurs de notre site web et des utilisateurs de nos services. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.</p>
                    
                    <h2>2. Informations que nous collectons</h2>
                    <p>Nous pouvons collecter des informations personnelles vous concernant lorsque vous :</p>
                    <ul>
                        <li>Remplissez un formulaire de contact ou de candidature sur notre site.</li>
                        <li>Communiquez avec nous par e-mail, téléphone ou via les réseaux sociaux.</li>
                        <li>Naviguez sur notre site web (via les cookies).</li>
                    </ul>
                    <p>Les informations collectées peuvent inclure votre nom, vos coordonnées (email, téléphone), vos mensurations, vos photos et toute autre information que vous choisissez de nous fournir.</p>

                    <h2>3. Utilisation de vos informations</h2>
                    <p>Nous utilisons vos informations pour :</p>
                    <ul>
                        <li>Évaluer votre candidature pour devenir mannequin.</li>
                        <li>Répondre à vos demandes de renseignements.</li>
                        <li>Vous fournir des informations sur nos services et événements.</li>
                        <li>Améliorer notre site web et nos services.</li>
                    </ul>
                    
                    <h2>4. Partage de vos informations</h2>
                    <p>Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Vos informations peuvent être partagées avec des clients potentiels (marques, photographes, etc.) dans le cadre de castings ou de propositions de travail, mais uniquement avec votre consentement préalable.</p>
                    
                    <h2>5. Sécurité des données</h2>
                    <p>Nous mettons en œuvre des mesures de sécurité raisonnables pour protéger vos informations contre l'accès, l'utilisation ou la divulgation non autorisés. Cependant, aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée.</p>

                    <h2>6. Vos droits</h2>
                    <p>Vous avez le droit d'accéder, de corriger ou de supprimer vos informations personnelles que nous détenons. Pour exercer ces droits, veuillez nous contacter à l'adresse indiquée sur notre page de contact.</p>

                    <h2>7. Modifications de cette politique</h2>
                    <p>Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous notifierons de tout changement en publiant la nouvelle politique sur cette page.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
