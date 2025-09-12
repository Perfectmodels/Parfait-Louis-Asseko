
import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';

const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, agencyPartners, fashionDayEvents, models, siteImages, testimonials, agencyServices } = data;
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

      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-pm-dark/95 via-pm-dark/70 to-pm-dark/95"></div>
        <div className="relative z-10 p-6 animate-on-scroll">
          <div className="mb-4 flex justify-center">
            <span className="inline-block px-6 py-2 bg-black/40 border border-pm-gold/30 rounded-full text-pm-gold/90 text-sm font-medium tracking-wider uppercase">Perfect Models Management</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair text-pm-gold font-extrabold leading-tight tracking-tighter mb-2" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
            L'Élégance Redéfinie
          </h1>
          <div className="flex justify-center mb-8">
            <span className="w-24 h-[2px] bg-pm-gold/40"></span>
          </div>
          <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto text-pm-off-white/90 leading-relaxed">
            L'agence de référence qui révèle et façonne les talents d'exception dans l'univers du mannequinat et de la mode au Gabon. Notre expertise unique valorise l'élégance africaine sur la scène internationale.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/mannequins" className="px-8 py-4 bg-gradient-to-r from-pm-gold/90 to-pm-gold/70 text-pm-dark font-medium rounded-full hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto">
              Découvrir nos talents
            </Link>
            <Link to="/casting-formulaire" className="px-8 py-4 bg-black/50 border border-pm-gold/50 text-pm-gold font-medium rounded-full hover:bg-black/70 hover:border-pm-gold transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto">
              Collaborer avec nous
            </Link>
          </div>
        </div>
      </section>

      {/* 2. About */}
      <section className="py-28 bg-gradient-to-b from-pm-dark to-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16 animate-on-scroll">
            <div className="md:w-1/2 p-3 border-2 border-pm-gold/50 hover:border-pm-gold transition-all duration-500 shadow-xl hover:shadow-pm-gold/10 transform hover:scale-[1.02]">
              <img src={siteImages.about} alt="Perfect Models Management" className="w-full h-full object-cover"/>
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-block mb-6">
                <h2 className="text-4xl font-playfair text-pm-gold mb-3 relative inline-block">
                  À Propos de Nous
                  <span className="absolute -bottom-2 left-0 w-24 h-[2px] bg-pm-gold/30"></span>
                </h2>
              </div>
              <p className="text-pm-off-white/90 mb-6 leading-relaxed text-lg">
                Perfect Models Management est l'agence de mannequins pionnière au Gabon qui révolutionne l'industrie de la mode en Afrique centrale. Notre vision unique allie expertise internationale et valorisation authentique des talents africains.
              </p>
              <p className="text-pm-off-white/90 mb-8 leading-relaxed text-lg">
                Fondée par Parfait-Louis Asseko, visionnaire passionné de mode, notre agence a développé une approche holistique qui transforme de simples aspirants en mannequins professionnels reconnus. Nous créons un écosystème complet où formation d'excellence, opportunités concrètes et accompagnement personnalisé permettent à chaque talent de s'épanouir pleinement.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 font-bold text-pm-gold/90 mb-10 bg-black/30 py-4 px-6 rounded-lg border border-pm-gold/10">
                <span className="hover:text-pm-gold transition-colors duration-300">PROFESSIONNALISME</span>
                <span className="text-pm-gold/50">•</span>
                <span className="hover:text-pm-gold transition-colors duration-300">EXCELLENCE</span>
                <span className="text-pm-gold/50">•</span>
                <span className="hover:text-pm-gold transition-colors duration-300">ÉTHIQUE</span>
              </div>
              <Link to="/agence" className="px-10 py-4 bg-black/50 border border-pm-gold/50 text-pm-gold font-medium uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold/10 hover:border-pm-gold hover:shadow-lg hover:shadow-pm-gold/10 transform hover:-translate-y-1">
                Découvrir notre histoire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section className="py-28 bg-gradient-radial from-black to-pm-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-6 py-2 bg-black/40 border border-pm-gold/30 rounded-full text-pm-gold/90 text-sm font-medium tracking-wider uppercase mb-6">Expertise</span>
            <h2 className="text-4xl font-playfair text-pm-gold mb-4 relative inline-block">
              Nos Services
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-[2px] bg-pm-gold/30"></span>
            </h2>
            <p className="text-center text-pm-off-white/80 max-w-3xl mx-auto mt-8 text-lg leading-relaxed">
              Découvrez notre gamme complète de services professionnels pour l'industrie de la mode et du mannequinat, conçus pour valoriser chaque talent et répondre aux besoins des professionnels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 animate-on-scroll delay-100">
            {featuredServices.map((service, index) => (
              <div key={index} className="transform transition-all duration-500 hover:translate-y-[-10px]" style={{animationDelay: `${(index + 1) * 150}ms`}}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-on-scroll delay-200">
            <Link to="/services" className="px-8 py-4 bg-black/50 border border-pm-gold/50 text-pm-gold font-medium rounded-full hover:bg-black/70 hover:border-pm-gold transition-all duration-300 transform hover:-translate-y-1 inline-block">
              Découvrir tous nos services
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Models */}
      <section className="py-28 bg-gradient-to-b from-black to-pm-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-on-scroll">
            <span className="inline-block px-6 py-2 bg-black/40 border border-pm-gold/30 rounded-full text-pm-gold/90 text-sm font-medium tracking-wider uppercase mb-6">Portfolio</span>
            <h2 className="text-4xl font-playfair text-pm-gold mb-4 relative inline-block">
              Nos Talents d'Exception
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-[2px] bg-pm-gold/30"></span>
            </h2>
            <p className="text-center text-pm-off-white/80 max-w-3xl mx-auto mt-8 text-lg leading-relaxed">
              Découvrez notre sélection de mannequins professionnels aux profils uniques et diversifiés. Chaque talent est rigoureusement formé selon les standards internationaux pour incarner parfaitement l'essence de votre marque et sublimer vos projets créatifs avec authenticité et élégance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 animate-on-scroll delay-100">
            {publicModels.map((model, index) => (
              <div key={model.id} className="transform transition-all duration-500 hover:translate-y-[-10px] hover:shadow-xl hover:shadow-pm-gold/5" style={{animationDelay: `${(index + 1) * 150}ms`}}>
                <ModelCard model={model} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16 animate-on-scroll delay-200">
            <Link to="/mannequins" className="px-8 py-4 bg-gradient-to-r from-pm-gold/90 to-pm-gold/70 text-pm-dark font-medium rounded-full hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-300 transform hover:-translate-y-1 inline-block">
              Explorer tous nos talents
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Events */}
      <section 
        className="py-24 lg:py-32 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.fashionDayBg}')` }}
      >
        <div className="container mx-auto px-6 text-center bg-gradient-to-br from-black/80 to-black/70 py-20 md:py-24 backdrop-blur-sm rounded-xl border border-pm-gold/20 shadow-2xl animate-on-scroll">
          <span className="inline-block px-6 py-2 bg-black/60 border border-pm-gold/40 rounded-full text-pm-gold/90 text-sm font-medium tracking-wider uppercase mb-6">Événement Exclusif</span>
          <h2 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6 relative inline-block">
            Perfect Fashion Day
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-[2px] bg-pm-gold/30"></span>
          </h2>
          <p className="text-pm-off-white/90 max-w-3xl mx-auto mt-10 mb-12 text-lg md:text-xl leading-relaxed">
            Notre événement phare qui révolutionne la scène mode au Gabon. Une célébration spectaculaire où talents émergents et créateurs établis se rencontrent pour présenter des collections innovantes dans une ambiance électrisante. Perfect Fashion Day est bien plus qu'un défilé - c'est une expérience immersive qui redéfinit l'excellence et propulse la mode gabonaise vers de nouveaux sommets.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <span className="inline-block px-6 py-3 bg-black/50 text-pm-gold rounded-full text-sm font-medium border border-pm-gold/30 hover:bg-black/70 hover:border-pm-gold/50 transition-all duration-300 transform hover:scale-105">Défilés Exclusifs</span>
            <span className="inline-block px-6 py-3 bg-black/50 text-pm-gold rounded-full text-sm font-medium border border-pm-gold/30 hover:bg-black/70 hover:border-pm-gold/50 transition-all duration-300 transform hover:scale-105">Talents Émergents</span>
            <span className="inline-block px-6 py-3 bg-black/50 text-pm-gold rounded-full text-sm font-medium border border-pm-gold/30 hover:bg-black/70 hover:border-pm-gold/50 transition-all duration-300 transform hover:scale-105">Networking</span>
            <span className="inline-block px-6 py-3 bg-black/50 text-pm-gold rounded-full text-sm font-medium border border-pm-gold/30 hover:bg-black/70 hover:border-pm-gold/50 transition-all duration-300 transform hover:scale-105">Expérience VIP</span>
          </div>
          <Link to="/fashion-day" className="px-10 py-4 bg-gradient-to-r from-pm-gold/90 to-pm-gold/70 text-pm-dark font-medium rounded-full hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-300 transform hover:-translate-y-1 inline-block">
            Découvrir l'événement
          </Link>
        </div>
      </section>

      {/* 7. Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 lg:py-28 bg-gradient-to-b from-black to-pm-dark">
          <div className="container mx-auto px-6 text-center mb-12">
            <span className="inline-block px-6 py-2 bg-black/60 border border-pm-gold/40 rounded-full text-pm-gold/90 text-sm font-medium tracking-wider uppercase mb-6 animate-on-scroll">Témoignages</span>
            <h2 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6 relative inline-block animate-on-scroll">
              Ils nous font confiance
              <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-[2px] bg-pm-gold/30"></span>
            </h2>
          </div>
          <TestimonialCarousel />
        </section>
      )}

      {/* 8. Call to Action */}
      <section className="py-28 lg:py-32 bg-gradient-to-b from-pm-dark to-black text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-gold.png')] opacity-5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <span className="inline-block px-6 py-2 bg-black/60 border border-pm-gold/40 rounded-full text-pm-gold/90 text-sm font-medium tracking-wider uppercase mb-6 animate-on-scroll">Votre Avenir</span>
          <h2 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-8 relative inline-block animate-on-scroll">
            Rejoignez l'Excellence
            <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-[2px] bg-pm-gold/30"></span>
          </h2>
          <p className="text-pm-off-white/90 max-w-3xl mx-auto mb-14 text-lg leading-relaxed animate-on-scroll delay-100">
            Que vous soyez un mannequin aspirant à une carrière internationale, un styliste visionnaire cherchant à collaborer avec les meilleurs talents, ou une marque désireuse de créer un impact mémorable, Perfect Models Management vous ouvre ses portes. Ensemble, redéfinissons les standards de la mode gabonaise et africaine sur la scène mondiale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 animate-on-scroll delay-200">
            <Link to="/contact" className="px-10 py-4 bg-gradient-to-r from-pm-gold/90 to-pm-gold/70 text-pm-dark font-medium rounded-full hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-300 transform hover:-translate-y-1 inline-block">
              Discuter de votre projet
            </Link>
            <Link to="/casting-formulaire" className="px-10 py-4 bg-black/50 text-pm-gold border border-pm-gold/30 rounded-full hover:bg-black/70 hover:border-pm-gold/50 transition-all duration-300 transform hover:-translate-y-1 inline-block">
              Rejoindre notre agence
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
