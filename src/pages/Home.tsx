import React from 'react';
import { motion, useInView, useAnimation, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import CountdownTimer from '../components/CountdownTimer';
import { UsersIcon, CalendarDaysIcon, StarIcon, TrophyIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// --- Sub-components for Home Page ---

const AnimatedSection: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
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
  <div className="text-center">
    <Icon className="w-12 h-12 text-pm-gold mx-auto mb-3" />
    <p className="text-5xl font-playfair font-bold text-pm-off-white">
      +<AnimatedCounter to={value} />
    </p>
    <p className="text-sm uppercase tracking-widest text-pm-off-white/70 mt-1">{label}</p>
  </div>
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
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-black/70 to-transparent"></div>
        <motion.div
          className="relative z-10 p-6 flex flex-col items-center justify-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        >
          <h1 className="text-5xl sm:text-7xl lg:text-9xl font-playfair text-pm-gold font-extrabold px-4" style={{ textShadow: '0 0 20px rgba(212, 175, 55, 0.6)' }}>
            L'Élégance Redéfinie
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-pm-off-white/90">
            Au cœur de la mode africaine, nous sculptons les carrières et célébrons la beauté sous toutes ses formes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/casting-formulaire" className="cta-btn-gold animate-glow">
              Devenir Mannequin
            </Link>
            <Link to="/agence" className="cta-btn-outline">
              Découvrir l'Agence
            </Link>
          </div>
        </motion.div>
        {nextEvent && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-10 p-6 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          >
            <div className="container mx-auto text-center">
              <h3 className="text-xl md:text-2xl font-playfair text-white mb-4">
                Prochain Événement : <span className="text-pm-gold">Perfect Fashion Day - Édition {nextEvent.edition}</span>
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
              <img src={siteImages.about} alt="L'équipe de Perfect Models Management" className="w-full h-full object-cover rounded-md" />
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
          <h2 className="section-title">Nos Prestations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {featuredServices.map(service => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="cta-btn-gold">
              Découvrir tous nos services
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* 5. Models (Full bleed for visual variety) */}
      <AnimatedSection className="bg-black py-20 lg:py-28 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pm-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pm-gold/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-6 relative z-10">
          <h2 className="section-title">Nos Mannequins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {publicModels.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/mannequins" className="cta-btn-outline group">
              Voir tous les mannequins
              <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1 inline-block" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <div className="page-container">

        {/* NEW: Magazine Section */}
        {data.articles && data.articles.length > 0 && (
          <AnimatedSection className="content-section">
            <div className="flex justify-between items-end mb-8">
              <h2 className="section-title !mb-0 text-left">Le Magazine</h2>
              <Link to="/magazine" className="hidden sm:flex items-center text-pm-gold hover:underline">
                Tout lire <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.articles.slice(0, 3).map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link to={`/magazine/${article.slug}`}>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg mb-4">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-xs text-pm-gold uppercase tracking-wider mb-2">{article.category}</p>
                    <h3 className="text-xl font-playfair font-bold text-pm-off-white group-hover:text-pm-gold transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-pm-off-white/60 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link to="/magazine" className="text-pm-gold hover:underline">
                Tout lire &rarr;
              </Link>
            </div>
          </AnimatedSection>
        )}

        {/* 6. Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <AnimatedSection className="content-section">
            <h2 className="section-title">Témoignages</h2>
            <div className="mt-8">
              <TestimonialCarousel />
            </div>
          </AnimatedSection>
        )}

        {/* NEW: Instagram Feed (Simulated) */}
        <AnimatedSection className="content-section">
          <div className="text-center mb-10">
            <h2 className="section-title">Suivez-nous</h2>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pm-gold flex items-center justify-center gap-2 hover:underline">
              @perfectmodels.ga sur Instagram
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[siteImages.castingBg, siteImages.fashionDayBg, siteImages.classroomBg, siteImages.about].map((img, i) => (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" key={i} className="group relative aspect-square overflow-hidden rounded-md block">
                <img src={img} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <i className="fab fa-instagram text-3xl text-white"></i>
                </div>
              </a>
            ))}
          </div>
        </AnimatedSection>

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