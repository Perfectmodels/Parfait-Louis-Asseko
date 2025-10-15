import React from 'react';
import { Outlet } from 'react-router-dom';
import Header, { Breadcrumb } from './Header';
import Footer from './Footer';
import Marquee from './Marquee';

const Layout: React.FC = () => {
  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat">
      <Marquee />
      <Header />
      <main className="flex-grow pt-24 lg:pt-28">
        <Breadcrumb />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;