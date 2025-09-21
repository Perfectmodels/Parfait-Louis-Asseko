
import React from 'react';
import PublicPageLayout from '../components/PublicPageLayout';

const TermsOfUse: React.FC = () => {
  const lastUpdated = new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <PublicPageLayout
      title="Conditions d'Utilisation"
      subtitle={`Dernière mise à jour : ${lastUpdated}`}
    >
      <div className="max-w-3xl mx-auto prose prose-invert prose-lg text-pm-off-white/80 leading-relaxed">
          <p>En accédant et en utilisant le site web de Perfect Models Management (le "Site"), vous acceptez d'être lié par les présentes Conditions d'Utilisation. Si vous n'êtes pas d'accord avec une partie de ces conditions, vous ne devez pas utiliser notre Site.</p>
          
          <h2 className="text-pm-gold font-playfair">1. Utilisation du Site</h2>
          <p>Vous vous engagez à utiliser le Site uniquement à des fins légales et d'une manière qui ne porte pas atteinte aux droits d'autrui. Le contenu de ce Site, y compris les images, textes, logos et designs, est la propriété de Perfect Models Management et est protégé par les lois sur la propriété intellectuelle. Toute reproduction ou utilisation non autorisée est strictement interdite.</p>
          
          <h2 className="text-pm-gold font-playfair">2. Soumissions de contenu</h2>
          <p>En soumettant des informations, des photos ou tout autre contenu via nos formulaires, vous nous accordez une licence non exclusive et libre de droits pour utiliser ce contenu dans le but d'évaluer votre candidature et, si vous êtes accepté(e), de promouvoir vos services auprès de clients potentiels.</p>
          
          <h2 className="text-pm-gold font-playfair">3. Limitation de responsabilité</h2>
          <p>Le Site et son contenu sont fournis "en l'état". Nous ne garantissons pas que le Site sera exempt d'erreurs ou ininterrompu. Perfect Models Management décline toute responsabilité pour tout dommage résultant de l'utilisation de ce Site.</p>

          <h2 className="text-pm-gold font-playfair">4. Liens vers des sites tiers</h2>
          <p>Notre Site peut contenir des liens vers des sites web tiers. Ces liens sont fournis pour votre commodité. Nous n'avons aucun contrôle sur le contenu de ces sites et n'assumons aucune responsabilité à leur égard.</p>

          <h2 className="text-pm-gold font-playfair">5. Modifications des conditions</h2>
          <p>Nous nous réservons le droit de modifier ces Conditions d'Utilisation à tout moment. Votre utilisation continue du Site après de telles modifications constitue votre acceptation des nouvelles conditions.</p>
      </div>
    </PublicPageLayout>
  );
};

export default TermsOfUse;
