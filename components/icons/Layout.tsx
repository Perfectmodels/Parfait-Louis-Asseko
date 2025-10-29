import React from 'react';
import { useLocation } from 'react-router-dom';
import Header, { Breadcrumb } from './Header';
import Footer from './Footer';
import Marquee from './Marquee';
import AIAssistantIcon from '../AIAssistantIcon';
import AdminLayout from '../admin/AdminLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Si la route commence par /admin, on utilise le layout d'administration.
  if (location.pathname.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  
  // Sinon, on utilise le layout public standard.
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat">
      <Marquee />
      <Header />
      <main className="flex-grow pt-24 lg:pt-28">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
      <AIAssistantIcon />
    </div>
  );
};

export default Layout;