
import React, { useEffect } from 'react';
import Header, { Breadcrumb } from './Header';
import Footer from '../Footer';
import Marquee from './Marquee';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Fonction pour animer les éléments au scroll
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      
      elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('visible');
        }
      });
    };
    
    // Exécuter une fois au chargement
    animateOnScroll();
    
    // Ajouter l'écouteur d'événement
    window.addEventListener('scroll', animateOnScroll);
    
    // Nettoyer l'écouteur d'événement
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, []);
  
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat">
      <Marquee />
      <Header />
      <main className="flex-grow pt-24 lg:pt-28">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
