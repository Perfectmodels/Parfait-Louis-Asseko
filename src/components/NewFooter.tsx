import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
// Import des icônes avec les noms corrects pour Heroicons v2.2.0
import { 
  FaceSmileIcon as FacebookIcon,
  PhotoIcon as InstagramIcon,
  ChatBubbleLeftRightIcon as TwitterIcon,
  VideoCameraIcon as YoutubeIcon,
  UserGroupIcon as LinkedinIcon
} from '@heroicons/react/24/outline';

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children, icon: Icon, className = '' }) => (
  <motion.li
    whileHover={{ x: 5 }}
    className="group"
  >
    <Link
      to={to}
      className={`flex items-center gap-2 text-pm-off-white/80 hover:text-pm-gold transition-colors ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{children}</span>
    </Link>
  </motion.li>
);

const NewFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail('');
    } catch (error) {
      console.error('Erreur lors de l\'abonnement :', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, url: '#' },
    { name: 'Instagram', icon: InstagramIcon, url: '#' },
    { name: 'Twitter', icon: TwitterIcon, url: '#' },
    { name: 'YouTube', icon: YoutubeIcon, url: '#' },
    { name: 'LinkedIn', icon: LinkedinIcon, url: '#' },
  ];

  const quickLinks = [
    { name: 'Accueil', to: '/' },
    { name: 'À propos', to: '/about' },
    { name: 'Services', to: '/services' },
    { name: 'Modèles', to: '/models' },
    { name: 'Contact', to: '/contact' },
  ];

  const legalLinks = [
    { name: 'Mentions légales', to: '/legal' },
    { name: 'Politique de confidentialité', to: '/privacy' },
    { name: 'Conditions d\'utilisation', to: '/terms' },
    { name: 'Politique des cookies', to: '/cookies' },
  ];

  const contactInfo = [
    { 
      icon: EnvelopeIcon, 
      text: 'contact@perfectmodels.com',
      url: 'mailto:contact@perfectmodels.com'
    },
    { 
      icon: PhoneIcon, 
      text: '+33 1 23 45 67 89',
      url: 'tel:+33123456789'
    },
    { 
      icon: MapPinIcon, 
      text: '123 Avenue des Champs-Élysées, 75008 Paris',
      url: 'https://maps.google.com'
    },
  ];

  return (
    <footer className="bg-pm-dark text-pm-off-white">
      {/* Bandeau supérieur */}
      <div className="bg-pm-gold/10 border-b border-pm-gold/20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-pm-gold mb-2">Restez informé</h3>
              <p className="text-pm-off-white/80">Abonnez-vous à notre newsletter pour ne rien manquer</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="px-4 py-2 rounded-full bg-pm-off-white/5 border border-pm-off-white/10 text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 flex-grow"
                  required
                  disabled={isLoading || isSubscribed}
                />
                <button
                  type="submit"
                  disabled={isLoading || isSubscribed}
                  className="px-6 py-2 bg-pm-gold hover:bg-pm-gold/90 text-pm-dark font-medium rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    'Envoi...'
                  ) : isSubscribed ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Merci !
                    </>
                  ) : (
                    <>
                      <span>S&apos;abonner</span>
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Colonne 1: Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-pm-gold">Perfect Models</span>
            </div>
            <p className="text-pm-off-white/80">
              Agence de mannequins d'exception, façonnant l'avenir de la mode avec élégance et professionnalisme.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pm-off-white/60 hover:text-pm-gold transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Colonne 2: Liens rapides */}
          <div>
            <h4 className="text-lg font-semibold text-pm-gold mb-4">Navigation</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <FooterLink key={link.name} to={link.to}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Colonne 3: Liens légaux */}
          <div>
            <h4 className="text-lg font-semibold text-pm-gold mb-4">Légal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <FooterLink key={link.name} to={link.to}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Colonne 4: Contact */}
          <div>
            <h4 className="text-lg font-semibold text-pm-gold mb-4">Contact</h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li 
                    key={index}
                    className="flex items-start gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <Icon className="w-5 h-5 text-pm-gold mt-0.5 flex-shrink-0" />
                    <a 
                      href={item.url} 
                      className="text-pm-off-white/80 hover:text-pm-gold transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.text}
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-pm-off-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-pm-off-white/60">
              &copy; {currentYear} Perfect Models. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-pm-off-white/60">
                Développé avec <span className="text-red-500">❤</span> par votre agence
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
