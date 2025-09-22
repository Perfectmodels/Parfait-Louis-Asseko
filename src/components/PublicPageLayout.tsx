import React from 'react';
import SEO from './SEO';

interface PublicPageLayoutProps {
  title: string;
  subtitle?: string;
  heroImage?: string;
  callToAction?: {
    text: string;
    onClick: () => void;
  };
  children: React.ReactNode;
}

const PublicPageLayout: React.FC<PublicPageLayoutProps> = ({
  title,
  subtitle = '',
  heroImage,
  callToAction,
  children
}) => {
  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO title={title} />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] text-white overflow-hidden">
        <div className="absolute inset-0">
          {heroImage && (
            <img 
              src={heroImage} 
              alt={title}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-16 relative">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-6">
                {subtitle}
              </p>
            )}
            {callToAction && (
              <button 
                onClick={callToAction.onClick}
                className="px-8 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
              >
                {callToAction.text}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        {children}
      </div>
    </div>
  );
};

export default PublicPageLayout;
