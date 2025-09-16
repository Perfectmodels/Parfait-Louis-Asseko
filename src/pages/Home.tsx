import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import { ApiKeys, NewsItem } from '../types';

const Home: React.FC = () => {
  const { data, isInitialized } = useData();
  const [apiKeys] = useState<ApiKeys | undefined>(undefined);
  const [newsItems] = useState<NewsItem[]>([]);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, models, siteImages, testimonials, agencyServices } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);

  return (
    <div className="text-pm-off-white">
      <SEO 
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241"
        image={siteImages.hero}
      />

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.hero}')` }}
      >
        <div className="absolute inset-0 bg-pm-dark/80"></div>
        <div className="relative z-10 p-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair text-pm-gold font-extrabold leading-tight tracking-tighter" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
            L'Élégance Redéfinie
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-pm-off-white/90">
            Nous révélons les talents et valorisons la beauté africaine.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/mannequins" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
              Découvrir nos mannequins
            </Link>
            <Link to="/casting-formulaire" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark hover:scale-105 transform">
              Nous rejoindre
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Agency Presentation */}
        <section>
          <div className="content-section">
            <h2 className="section-title">Notre Agence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mt-8">
              <div className="p-1 border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg">
                <img src={siteImages.about} alt="L'équipe de Perfect Models Management" className="w-full h-full object-cover rounded-md"/>
              </div>
              <div className="text-center md:text-left">
                <p className="text-lg text-pm-off-white/80 mb-6 leading-relaxed">
                  {agencyInfo.about.p1}
                </p>
                <div className="flex justify-center md:justify-start gap-x-4 text-sm font-bold text-pm-gold/90 mb-8 uppercase tracking-wider">
                  <span>Professionnalisme</span><span>•</span><span>Excellence</span><span>•</span><span>Éthique</span>
                </div>
                <Link to="/agence" className="inline-block px-10 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                  Découvrir l'agence
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section>
          <div className="content-section">
            <h2 className="section-title">Nos Prestations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {featuredServices.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/services" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                Découvrir tous nos services
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Models Section */}
      <section className="bg-black py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <h2 className="section-title">Nos Mannequins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {publicModels.map((model, index) => (
              <ModelCard key={index} model={model} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/mannequins" className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
              Voir tous les mannequins
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container">
        {/* Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <section>
            <div className="content-section">
              <h2 className="section-title">Témoignages</h2>
              <div className="mt-8">
                <TestimonialCarousel />
              </div>
            </div>
          </section>
        )}

        {/* Call to Action */}
        <section className="page-container bg-pm-dark text-center">
          <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
            Mannequin, styliste ou partenaire, rejoignez l'aventure Perfect Models Management dès aujourd'hui et façonnons ensemble l'avenir de la mode.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/casting-formulaire" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
              Postuler
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
              Nous Contacter
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
