import React from 'react';

const Marquee: React.FC = () => {
  return (
    <div className="bg-pm-gold text-pm-dark py-1 overflow-hidden whitespace-nowrap">
      <div className="animate-marquee inline-block">
        <span className="mx-4 font-bold uppercase tracking-widest text-xs">Bienvenue chez Perfect Models Management</span>
        <span className="mx-4 font-bold uppercase tracking-widest text-xs">•</span>
        <span className="mx-4 font-bold uppercase tracking-widest text-xs">Casting Ouvert</span>
        <span className="mx-4 font-bold uppercase tracking-widest text-xs">•</span>
      </div>
    </div>
  );
};

export default Marquee;
