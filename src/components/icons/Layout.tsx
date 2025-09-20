import React from 'react';
import Header from './Header';
import Footer from './Footer';
import SimpleMobileNav from '../SimpleMobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat">
      <Header />
      <main className="flex-grow pt-20 lg:pt-24 pb-20 lg:pb-0">
        {/* Breadcrumb masqué - décommentez la ligne suivante pour l'activer */}
        {/* <Breadcrumb /> */}
        {children}
      </main>
      <Footer />
      <SimpleMobileNav />
    </div>
  );
};

export default Layout;
