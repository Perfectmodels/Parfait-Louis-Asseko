import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

// Définition des types pour les icônes de médias sociaux
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
  </svg>
);

interface SocialLink {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

interface QuickLink {
  name: string;
  to: string;
}

interface ContactInfo {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  url: string;
}

const NewFooter: React.FC = () => {
  const siteConfig = {
    siteName: 'Perfect Models',
    description: 'Agence de mannequins professionnels'
  };
  
  const navLinks = [
    { name: 'Accueil', to: '/', inFooter: true, footerLabel: 'Accueil', label: 'Accueil', path: '/' },
    { name: 'Services', to: '/services', inFooter: true, footerLabel: 'Services', label: 'Services', path: '/services' },
    { name: 'Modèles', to: '/models', inFooter: true, footerLabel: 'Modèles', label: 'Modèles', path: '/models' },
    { name: 'Contact', to: '/contact', inFooter: true, footerLabel: 'Contact', label: 'Contact', path: '/contact' }
  ];
  
  const socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: FacebookIcon, url: '#' },
    { name: 'Instagram', icon: InstagramIcon, url: '#' }
  ];
  
  const contactInfo: ContactInfo[] = [
    { 
      icon: EnvelopeIcon, 
      text: 'contact@example.com',
      url: 'mailto:contact@example.com'
    },
    { 
      icon: PhoneIcon, 
      text: '+1 234 567 8900',
      url: 'tel:+12345678900'
    },
    { 
      icon: MapPinIcon, 
      text: '123 Fashion St, Paris, France',
      url: 'https://maps.google.com/'
    }
  ];

  const footerLinks: QuickLink[] = navLinks
    .filter(link => link.inFooter)
    .map(link => ({
      name: link.footerLabel || link.label,
      to: link.path
    }));

  const keyServices: QuickLink[] = [
    { name: "Booking Mannequins", to: "/contact?service=Booking+Mannequins" },
    { name: "Candidature Casting", to: "/casting-formulaire" },
    { name: "Organisation Défilés", to: "/contact?service=Organisation+D%C3%A9fil%C3%A9s+de+Mode" },
    { name: "Formation Mannequins", to: "/contact?service=Formation+Mannequins" },
  ];

  const renderSocialIcons = () => (
    <div className="flex space-x-4">
      {socialLinks.map((link: SocialLink) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pm-off-white/70 hover:text-pm-gold transition-colors"
          aria-label={link.name}
        >
          <link.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );

  const renderQuickLinks = (links: QuickLink[]) => (
    <ul className="space-y-3">
      {links.map((link: QuickLink) => (
        <li key={link.name}>
          <Link to={link.to} className="hover:text-pm-gold transition-colors text-sm">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderContactInfo = () => (
    <ul className="space-y-4">
      {contactInfo.map((item: ContactInfo, index: number) => (
        <li key={index} className="flex items-start gap-3">
          <item.icon className="w-5 h-5 mt-0.5 text-pm-gold flex-shrink-0" />
          <a href={item.url} className="text-pm-off-white/80 hover:text-pm-gold transition-colors">
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="bg-pm-dark text-pm-off-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Perfect Models</h3>
            <p className="text-pm-off-white/70 mb-4">
              Votre agence de mannequins professionnels
            </p>
            {renderSocialIcons()}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
            {renderQuickLinks(footerLinks)}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Services clés</h4>
            {renderQuickLinks(keyServices)}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            {renderContactInfo()}
          </div>
        </div>
        
        <div className="border-t border-pm-off-white/10 mt-12 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Perfect Models. Tous droits réservés.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/terms" className="hover:text-pm-gold transition-colors">Conditions d'utilisation</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-pm-gold transition-colors">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
