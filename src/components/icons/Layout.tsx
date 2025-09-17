import React from 'react';
import Header, { Breadcrumb } from './Header';
import Footer from './Footer';
import Marquee from './Marquee';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat">
      <Marquee />
      <Header />
      <main className="flex-grow pt-32 lg:pt-36">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
