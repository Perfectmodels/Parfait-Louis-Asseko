
import React from 'react';
import PublicPageLayout from '../components/PublicPageLayout';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <PublicPageLayout
      title="Politique de Confidentialité"
      subtitle={`Dernière mise à jour : ${lastUpdated}`}
    >
      <div className="max-w-3xl mx-auto prose prose-invert prose-lg text-pm-off-white/80 leading-relaxed">
          <p>Perfect Models Management ("nous", "notre") s'engage à protéger la vie privée des visiteurs de notre site web et des utilisateurs de nos services. Cette politique de confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations.</p>
          
          <h2 className="text-pm-gold font-playfair">1. Informations que nous collectons</h2>
          <p>Nous pouvons collecter des informations personnelles vous concernant lorsque vous :</p>
          <ul>
              <li>Remplissez un formulaire de contact ou de candidature (casting, fashion day).</li>
              <li>Communiquez avec nous par e-mail ou téléphone.</li>
              <li>Naviguez sur notre site web (via des cookies essentiels au fonctionnement).</li>
          </ul>
          <p>Les informations collectées peuvent inclure votre nom, coordonnées (email, téléphone), mensurations, photos et toute autre information que vous choisissez de nous fournir.</p>

          <h2 className="text-pm-gold font-playfair">2. Utilisation de vos informations</h2>
          <p>Nous utilisons vos informations pour :</p>
          <ul>
              <li>Évaluer votre candidature pour devenir mannequin ou participer à nos événements.</li>
              <li>Répondre à vos demandes de renseignements (booking, contact).</li>
              <li>Vous fournir des informations relatives à votre candidature ou à nos services.</li>
              <li>Améliorer notre site web et nos services.</li>
          </ul>
          
          <h2 className="text-pm-gold font-playfair">3. Partage de vos informations</h2>
          <p>Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Vos informations peuvent être partagées avec des clients potentiels (marques, directeurs de casting, etc.) uniquement dans le cadre de propositions de travail et avec votre consentement préalable.</p>
          
          <h2 className="text-pm-gold font-playfair">4. Sécurité des données</h2>
          <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos informations contre l'accès, l'utilisation ou la divulgation non autorisés. Les données sont stockées sur des serveurs sécurisés.</p>

          <h2 className="text-pm-gold font-playfair">5. Vos droits</h2>
          <p>Conformément à la réglementation, vous avez le droit d'accéder, de corriger ou de demander la suppression de vos informations personnelles. Pour exercer ces droits, veuillez nous contacter via l'adresse email fournie sur notre page de contact.</p>

          <h2 className="text-pm-gold font-playfair">6. Modifications de cette politique</h2>
          <p>Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous encourageons à consulter cette page régulièrement pour vous tenir informé de tout changement.</p>
      </div>
    </PublicPageLayout>
  );
};

export default PrivacyPolicy;
