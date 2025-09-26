import React from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../components/SEO';

const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title={`Service ${slug} | Perfect Models Management`}
        description={`Découvrez notre service ${slug}`}
      />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-playfair text-pm-gold mb-8">Service {slug}</h1>
        <p className="text-lg text-pm-off-white/80">
          Page en construction...
        </p>
      </div>
    </div>
  );
};

export default ServiceDetail;