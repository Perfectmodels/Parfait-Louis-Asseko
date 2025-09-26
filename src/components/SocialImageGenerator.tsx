import React from 'react';

interface SocialImageGeneratorProps {
  title: string;
  subtitle?: string;
  logo?: string;
  backgroundImage?: string;
  width?: number;
  height?: number;
  className?: string;
}

const SocialImageGenerator: React.FC<SocialImageGeneratorProps> = ({
  title,
  subtitle = "Perfect Models Management",
  logo = "/assets/logo.png",
  backgroundImage,
  width = 1200,
  height = 630,
  className = ""
}) => {
  const backgroundStyle = backgroundImage 
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)'
      };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...backgroundStyle
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full p-12 text-center">
        {/* Logo */}
        {logo && (
          <div className="mb-8">
            <img 
              src={logo} 
              alt="Perfect Models Management" 
              className="h-20 w-auto mx-auto"
            />
          </div>
        )}
        
        {/* Titre principal */}
        <h1 className="text-5xl font-playfair font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        
        {/* Sous-titre */}
        <p className="text-2xl text-pm-gold font-montserrat font-medium">
          {subtitle}
        </p>
        
        {/* Éléments décoratifs */}
        <div className="absolute top-8 right-8 w-32 h-32 border-2 border-pm-gold/30 rounded-full" />
        <div className="absolute bottom-8 left-8 w-24 h-24 border border-pm-gold/20 rounded-full" />
      </div>
      
      {/* Pattern décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M30 0L35 20L55 25L35 30L30 50L25 30L5 25L25 20Z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>
    </div>
  );
};

export default SocialImageGenerator;
