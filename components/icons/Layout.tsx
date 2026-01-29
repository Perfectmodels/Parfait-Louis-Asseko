
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header, { Breadcrumb } from './Header';
import Footer from './Footer';
import Marquee from './Marquee';
import AdminLayout from '../admin/AdminLayout';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // On vérifie si on est dans l'administration pour changer de layout
  if (location.pathname.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat overflow-x-hidden">
      <Marquee />
      <Header />
      <main className="flex-grow pt-24 lg:pt-32">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
