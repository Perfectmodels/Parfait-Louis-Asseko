
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Marquee from './Marquee';
import AIAssistantIcon from './AIAssistantIcon';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const hideOnPaths = ['/chat', '/login'];
  const showAIAssistant = !hideOnPaths.includes(location.pathname) && !location.pathname.startsWith('/admin');

  return (
    <div className="bg-pm-dark min-h-screen flex flex-col font-montserrat">
      <Marquee />
      <Header />
      <main className="flex-grow pt-28">
        {children}
      </main>
      <Footer />
      {showAIAssistant && <AIAssistantIcon />}
    </div>
  );
};

export default Layout;