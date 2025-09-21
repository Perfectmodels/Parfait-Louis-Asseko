
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumb from '../Breadcrumb';
import SimpleMobileNav from '../SimpleMobileNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow">
        {/* The pt-20 on main is to push content below the fixed header */}
        <main className="pt-20 lg:pt-0">
            <Breadcrumb />
            {children}
        </main>
      </div>

      <Footer />
      <SimpleMobileNav />

      {/* Spacer for mobile nav */}
      <div className="h-20 lg:hidden print-hide" />
    </div>
  );
};

export default Layout;
