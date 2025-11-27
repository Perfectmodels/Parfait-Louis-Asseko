import React from 'react';
import { motion, useInView, useAnimation, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import CountdownTimer from '../components/CountdownTimer';
import { UsersIcon, CalendarDaysIcon, StarIcon, TrophyIcon } from '@heroicons/react/24/outline';

// --- Sub-components for Home Page ---

const AnimatedSection: React.FC<{children: React.ReactNode; className?: string}> = ({ children, className }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    
    return (
        <motion.section
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.section>
    );
};

const AnimatedCounter: React.FC<{ to: number }> = ({ to }) => {
    const [count, setCount] = React.useState(0);
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const controls = useAnimation();

    React.useEffect(() => {
        if (isInView) {
            controls.start({
                opacity: 1,
                transition: { duration: 0.5 }
            }).then(() => {
                const animation = animate(0, to, {
                    duration: 2,
                    onUpdate: (latest) => setCount(Math.round(latest)),
                });
                return () => animation.stop();
            });
        }
    }, [isInView, to, controls]);
    
    return (
        <motion.span ref={ref} initial={{ opacity: 0 }} animate={controls}>
            {count}
        </motion.span>
    );
}

const KeyFigure: React.FC<{ icon: React.ElementType, value: number, label: string }> = ({ icon: Icon, value, label }) => (
    <motion.div 
        className="text-center group"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
    >
        <motion.div
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pm-gold/20 to-pm-gold/10 rounded-full flex items-center justify-center border border-pm-gold/30 group-hover:border-pm-gold transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
        >
            <Icon className="w-8 h-8 text-pm-gold" />
        </motion.div>
        <p className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mb-2">
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                +<AnimatedCounter to={value} />
            </motion.span>
        </p>
        <p className="text-sm uppercase tracking-wider text-pm-off-white/70 font-medium">{label}</p>
    </motion.div>
);


const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, siteConfig, socialLinks, fashionDayEvents, models, siteImages, testimonials, agencyServices } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);
  
  const nextEvent = fashionDayEvents
    .filter(e => new Date(e.date).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const organizationSchema = {
    "@context": "https://schema.org", "@type": "Organization", "name": "Perfect Models Management",
    "url": window.location.origin, "logo": siteConfig.logo,
    "sameAs": [socialLinks.facebook, socialLinks.instagram, socialLinks.youtube].filter(Boolean)
  };

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241"
        image={siteImages.hero}
        schema={organizationSchema}
      />

      {/* 1. Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${siteImages.hero}')` }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-black/80 to-transparent"></div>
        
        {/* Particules animées */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pm-gold rounded-full opacity-60"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                scale: 0
              }}
              animate={{ 
                y: [null, -100, -200],
                opacity: [0.6, 0.8, 0],
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <motion.div 
            className="relative z-10 p-6 flex flex-col items-center justify-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair text-pm-gold font-extrabold" 
                style={{ 
                  textShadow: '0 0 30px rgba(212, 175, 55, 0.8), 0 0 60px rgba(212, 175, 55, 0.4)',
                  letterSpacing: '0.02em'
                }}>
              L'Élégance Redéfinie
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto text-pm-off-white/90 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
          >
            Au cœur de la mode africaine, nous sculptons les carrières et célébrons la beauté sous toutes ses formes.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
          >
              <Link to="/casting-formulaire" className="group relative px-8 py-4 bg-pm-gold text-pm-dark font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pm-gold/50">
                <span className="relative z-10">Devenir Mannequin</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pm-gold to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link to="/agence" className="px-8 py-4 border-2 border-pm-gold text-pm-gold font-bold rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark hover:scale-105">
                  Découvrir l'Agence
              </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-pm-off-white/60"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
        
        {nextEvent && (
            <motion.div 
                className="absolute bottom-20 left-0 right-0 z-10 p-6 bg-black/60 backdrop-blur-md border-t border-pm-gold/20"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
            >
                <div className="container mx-auto text-center">
                    <h3 className="text-xl md:text-2xl font-playfair text-white mb-4">
                        Prochain Événement : <span className="text-pm-gold font-bold">Perfect Fashion Day - Édition {nextEvent.edition}</span>
                    </h3>
                    <CountdownTimer targetDate={nextEvent.date} />
                </div>
            </motion.div>
        )}
      </section>

      <div className="page-container">
        {/* 2. Agency Presentation */}
        <AnimatedSection className="content-section">
            <h2 className="section-title">Notre Agence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mt-8">
                <motion.div className="p-1 border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg"
                    initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}
                >
                    <img src={siteImages.about} alt="L'équipe de Perfect Models Management" className="w-full h-full object-cover rounded-md"/>
                </motion.div>
                <motion.div className="text-center md:text-left"
                    initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }}
                >
                    <p className="text-lg text-pm-off-white/80 mb-6 leading-relaxed">
                        {agencyInfo.about.p1}
                    </p>
                    <div className="flex justify-center md:justify-start gap-x-4 text-sm font-bold text-pm-gold/90 mb-8 uppercase tracking-wider">
                        <span>Professionnalisme</span><span>•</span><span>Excellence</span><span>•</span><span>Éthique</span>
                    </div>
                    <Link to="/agence" className="cta-btn-outline">
                        Notre Histoire
                    </Link>
                </motion.div>
            </div>
        </AnimatedSection>
        
        {/* 3. Key Figures */}
        <AnimatedSection className="py-16 bg-black rounded-lg">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <KeyFigure icon={UsersIcon} value={models.length} label="Mannequins" />
                    <KeyFigure icon={CalendarDaysIcon} value={fashionDayEvents.length} label="Événements PFD" />
                    <KeyFigure icon={StarIcon} value={agencyServices.length} label="Services" />
                    <KeyFigure icon={TrophyIcon} value={new Date().getFullYear() - 2021} label="Ans d'expérience" />
                </div>
            </div>
        </AnimatedSection>

        {/* 4. Services */}
        <AnimatedSection className="content-section">
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="section-title">Nos Prestations</h2>
                <p className="text-pm-off-white/70 max-w-2xl mx-auto mt-4">
                    Découvrez notre gamme complète de services conçus pour propulser votre carrière dans l'industrie de la mode.
                </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {featuredServices.map((service, index) => (
                <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                    <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>
            <motion.div 
                className="text-center mt-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/services" className="group px-8 py-4 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pm-gold/50">
                Découvrir tous nos services
                <svg className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
        </AnimatedSection>
      </div>

      <div className="page-container">
        {/* 5. Models (Full bleed for visual variety) */}
        <AnimatedSection className="bg-black py-20 lg:py-28">
            <div className="container mx-auto px-6">
                <h2 className="section-title">Nos Mannequins</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {publicModels.map(model => (
                    <ModelCard key={model.id} model={model} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <Link to="/mannequins" className="cta-btn-outline">
                    Voir tous les mannequins
                  </Link>
                </div>
            </div>
        </AnimatedSection>

        <div className="page-container">
          {/* 6. Testimonials */}
          {testimonials && testimonials.length > 0 && (
            <AnimatedSection className="content-section">
              <h2 className="section-title">Témoignages</h2>
              <div className="mt-8">
                <TestimonialCarousel />
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>

      <div className="page-container">
        {/* 7. Call to Action */}
        <AnimatedSection className="content-section text-center">
            <h2 className="section-title">Prêts à nous rejoindre ?</h2>
            <p className="section-subtitle">
              Mannequin, styliste ou partenaire, rejoignez l'aventure Perfect Models Management dès aujourd'hui et façonnons ensemble l'avenir de la mode.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/casting-formulaire" className="cta-btn-gold animate-glow">
                Postuler
              </Link>
              <Link to="/contact" className="cta-btn-outline">
                Nous Contacter
              </Link>
            </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Home;