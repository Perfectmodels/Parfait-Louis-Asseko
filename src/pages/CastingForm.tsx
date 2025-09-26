import React from 'react';
import SEO from '../components/SEO';

const CastingForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title="Formulaire de Casting | Perfect Models Management"
        description="Postulez à nos castings"
      />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-playfair text-pm-gold mb-8">Formulaire de Casting</h1>
        <p className="text-lg text-pm-off-white/80">
          Page en construction...
        </p>
      </div>
    </div>
  );
};

export default CastingForm;