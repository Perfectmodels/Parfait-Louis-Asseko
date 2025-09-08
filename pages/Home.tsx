import React from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
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
      <section 
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.hero}')`}}
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

      {/* 2. Agency Presentation */}
      <section className="page-container bg-black">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 p-2 border-2 border-pm-gold/50 hover:border-pm-gold transition-all duration-300">
            <img src={siteImages.about} alt="Perfect Models Management" className="w-full h-full object-cover"/>
          </div>
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Perfect Models Management</h2>
            <p className="text-pm-off-white/80 mb-6 leading-relaxed">
              {agencyInfo.about.p1}
            </p>
            <div className="flex justify-center md:justify-start gap-6 font-bold text-pm-gold/90 mb-8">
              <span>PROFESSIONNALISME</span><span>•</span><span>EXCELLENCE</span><span>•</span><span>ÉTHIQUE</span>
            </div>
            <Link to="/agence" className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
              Découvrir l'agence
            </Link>
          </div>
        </div>
      </section>
      
      {/* 3. Our Services */}
      <section className="page-container bg-pm-dark">
        <h2 className="section-title">Nos Services</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {featuredServices.map(service => (
                <ServiceCard key={service.title} service={service} />
            ))}
        </div>
        <div className="text-center mt-12">
            <Link to="/services" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
              Découvrir tous nos services
            </Link>
        </div>
      </section>

      {/* 4. Our Models */}
      <section className="page-container bg-black">
        <h2 className="section-title">Nos Mannequins</h2>
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

      {/* 5. Our Events */}
      <section 
        className="py-20 lg:py-28 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.fashionDayBg}')`}}
      >
        <div className="container mx-auto px-6 text-center bg-black/80 py-16 md:py-20 backdrop-blur-sm">
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Événements & Défilés</h2>
            <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
                {fashionDayEvents.find(e => e.edition === 2)?.description || "Nous créons des moments inoubliables où la mode prend vie. Découvrez nos événements phares."}
            </p>
            <Link to="/fashion-day" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
                Découvrir le Perfect Fashion Day
            </Link>
        </div>
      </section>

      {/* 6. Partners & Collaborations */}
      <section className="page-container bg-pm-dark">
        <h2 className="section-title">Partenaires & Collaborations</h2>
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {agencyPartners.map(partner => (
                <p key={partner.name} className="text-xl font-semibold text-pm-off-white/70 transition-all duration-300 hover:text-pm-gold hover:scale-105">{partner.name}</p>
            ))}
        </div>
      </section>

      {/* 7. Testimonials */}
       {testimonials && testimonials.length > 0 && (
        <section className="page-container bg-black">
            <h2 className="section-title">Témoignages</h2>
            <TestimonialCarousel />
        </section>
       )}

      {/* 8. Call to Action */}
       <section className="page-container bg-pm-dark text-center">
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Prêt(e) à lancer votre carrière ?</h2>
            <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
                Mannequin, styliste ou partenaire, rejoignez l'aventure Perfect Models Management dès aujourd'hui et façonnons ensemble l'avenir de la mode.
            </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/casting-formulaire" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                    Postuler
                </Link>
                <Link to="/contact" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                    Nous Contacter
                </Link>const safeUrl = siteImages.hero?.startsWith('https://') ? siteImages.hero : '/placeholder-hero.jpg';
             </div>
        </section>

    </div>
  );
};

export default Home;