
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import HeroCarousel from '../components/HeroCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import { HeroSlide } from '../types';

const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return (
      <div className="min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-pm-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-pm-gold text-xl font-playfair animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  const { agencyInfo, agencyPartners, fashionDayEvents, models, siteImages, testimonials, agencyServices, heroSlides } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);

  // Fallback if heroSlides is empty or undefined
  const effectiveHeroSlides: HeroSlide[] = (heroSlides && heroSlides.length > 0) ? heroSlides : [
    {
      id: 'default',
      image: siteImages.hero,
      title: "L'Élégance Redéfinie",
      subtitle: "Nous révélons les talents et valorisons la beauté africaine.",
      buttonText: "Découvrir nos mannequins",
      buttonLink: "/mannequins",
      secondButtonText: "Nous rejoindre",
      secondButtonLink: "/casting-formulaire",
      order: 1
    }
  ];

  return (
    <div className="text-pm-off-white">

      <SEO 
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241"
        image={effectiveHeroSlides[0].image}
      />

      {/* 1. Hero Section */}
      <HeroCarousel slides={effectiveHeroSlides} />

      {/* 2. Agency Presentation */}
      <section className="page-container bg-black">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2 p-2 border-2 border-pm-gold/50 hover:border-pm-gold transition-all duration-300">
            <img src={siteImages.about} alt="Perfect Models Management" className="w-full h-full object-cover"/>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-pm-off-white/80 mb-6 leading-relaxed">
              {agencyInfo.about.p1}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 font-bold text-pm-gold/90 mb-8 text-sm md:text-base">
              <span>PROFESSIONNALISME</span><span className="hidden md:inline">•</span><span>EXCELLENCE</span><span className="hidden md:inline">•</span><span>ÉTHIQUE</span>
            </div>
            <Link to="/agence" className="inline-block w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
              Découvrir l'agence
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section className="page-container bg-pm-dark">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {featuredServices.map(service => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      {/* 4. Models */}
      <section className="page-container bg-black">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {publicModels.map(model => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/mannequins" className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
            Voir tous les mannequins
          </Link>
        </div>
      </section>

      {/* 5. Events */}
      <section 
        className="py-20 lg:py-28 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.fashionDayBg}')` }}
      >
        <div className="container mx-auto px-6 text-center bg-black/80 py-16 md:py-20 backdrop-blur-sm">
          <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
            {fashionDayEvents.find(e => e.edition === 2)?.description || "Nous créons des moments inoubliables où la mode prend vie. Découvrez nos événements phares."}
          </p>
          <Link to="/fashion-day" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
            Découvrir le Perfect Fashion Day
          </Link>
        </div>
      </section>

      {/* 7. Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="page-container bg-black">
          <TestimonialCarousel />
        </section>
      )}

      {/* 8. Call to Action */}
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
  );
};

export default Home;
