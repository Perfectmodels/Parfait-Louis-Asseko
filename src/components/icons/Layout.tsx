
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

  // Si la route commence par /admin, on utilise le layout d'administration.
  if (location.pathname.startsWith('/admin')) {
    return <AdminLayout>{children}</AdminLayout>;
  }
  
  // Sinon, on utilise le layout public standard.
  return (
    <div className="bg-white min-h-screen flex flex-col font-montserrat text-gray-900">
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
