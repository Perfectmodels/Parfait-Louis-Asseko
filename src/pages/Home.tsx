import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import { NewsItem } from '../types';

// --- News Carousel Component ---
interface NewsCarouselProps {
    newsItems: NewsItem[];
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ newsItems }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (newsItems.length < 2) return;
        
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % newsItems.length);
        }, 30000); // 30 seconds

        return () => clearInterval(intervalId);
    }, [newsItems.length]);

    const goToNews = (index: number) => {
        setCurrentIndex(index);
    };

    const currentNews = newsItems[currentIndex];
    if (!currentNews) return null;

    return (
        <div className="relative max-w-6xl mx-auto bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-2xl shadow-black/50">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-video w-full flex items-end justify-start text-left"
                >
                    <img src={currentNews.imageUrl} alt={currentNews.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                    <div className="relative z-10 p-6 md:p-10 lg:p-12 text-white md:w-3/4 lg:w-2/3">
                        <h3 className="text-2xl md:text-4xl font-playfair text-pm-gold font-extrabold mb-3">{currentNews.title}</h3>
                        <p className="text-sm md:text-base text-pm-off-white/90 mb-5">{currentNews.excerpt}</p>
                        {currentNews.link && (
                            <Link to={currentNews.link} className="inline-block px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                                Lire la suite
                            </Link>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            {newsItems.length > 1 && (
                <>
                    {/* Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                        {newsItems.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToNews(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-pm-gold scale-125' : 'bg-white/40 hover:bg-white/80'}`}
                                aria-label={`Aller à l'actualité ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-pm-gold/20 z-10">
                         <motion.div
                            key={currentIndex} // Reset animation on change
                            className="h-full bg-pm-gold"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 30, ease: 'linear' }}
                         />
                    </div>
                </>
            )}
        </div>
    );
};


const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, siteConfig, socialLinks, fashionDayEvents, models, siteImages, testimonials, agencyServices, newsItems } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Perfect Models Management",
    "url": window.location.origin,
    "logo": siteConfig.logo,
    "sameAs": [
      socialLinks.facebook,
      socialLinks.instagram,
      socialLinks.youtube
    ].filter(Boolean)
  };

  return (
    <div className="bg-pm-dark text-pm-off-white">

      <SEO 
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241, mannequinat gabonais, agence mode libreville, mannequin professionnel gabon"
        image={siteImages.hero}
        type="website"
        locale="fr_FR"
        siteName="Perfect Models Management"
        twitterCard="summary_large_image"
        twitterSite="@PerfectModelsGA"
        twitterCreator="@PerfectModelsGA"
        schema={organizationSchema}
      />

      {/* 1. Hero Section */}
      <section 
        className="relative h-[80vh] flex items-center justify-center text-center bg-cover bg-center" 
        style={{ backgroundImage: `url('${siteImages.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/80 to-transparent"></div>
        <div className="relative z-10 p-6 animate-fade-in">
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
        {/* 2. Agency Presentation */}
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

        {/* News Carousel Section */}
        {newsItems && newsItems.length > 0 && (
            <section>
                <h2 className="section-title">Nos Actualités</h2>
                <NewsCarousel newsItems={newsItems} />
            </section>
        )}

        {/* 3. Services */}
        <section>
          <div className="content-section">
            <h2 className="section-title">Nos Prestations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {featuredServices.map(service => (
                <ServiceCard key={service.title} service={service} />
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
      
      {/* 4. Models (Full bleed for visual variety) */}
      <section className="bg-black py-20 lg:py-28">
        <div className="container mx-auto px-6">
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
        </div>
      </section>

      {/* 5. Events */}
      <section 
        className="py-20 lg:py-28 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.fashionDayBg}')` }}
      >
        <div className="container mx-auto px-6 text-center bg-black/80 py-16 md:py-20 backdrop-blur-sm rounded-lg border border-pm-gold/20">
          <h2 className="section-title">Notre Événement Phare</h2>
          <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
            {fashionDayEvents.find(e => e.edition === 2)?.description || "Nous créons des moments inoubliables où la mode prend vie. Découvrez nos événements phares."}
          </p>
          <Link to="/fashion-day" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
            Découvrir le Perfect Fashion Day
          </Link>
        </div>
      </section>

      <div className="page-container">
        {/* 7. Testimonials */}
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

        {/* 8. Call to Action */}
        <section>
          <div className="content-section text-center">
            <h2 className="section-title">Prêts à nous rejoindre ?</h2>
            <p className="section-subtitle">
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
          </div>
        </section>
      </div>

    </div>
  );
};

export default Home;
