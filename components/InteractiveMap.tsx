import React from 'react';

interface InteractiveMapProps {
  address: string;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ address, className = '' }) => {
  // Encoder l'adresse pour l'URL de Google Maps
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`;

  return (
    <div className={`w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg ${className}`}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={mapUrl}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation de l'agence"
      ></iframe>
    </div>
  );
};

export default InteractiveMap;
