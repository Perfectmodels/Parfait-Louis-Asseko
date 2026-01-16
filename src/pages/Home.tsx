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
import FadeIn from '../components/ui/FadeIn';
import Reveal from '../components/ui/Reveal';
import ParallaxHero from '../components/ui/ParallaxHero';

// --- Sub-components for Home Page ---

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
  <div className="text-center group p-6 rounded-lg transition-colors hover:bg-white/5">
    <Icon className="w-12 h-12 text-pm-gold mx-auto mb-4 transition-transform group-hover:scale-110 duration-500" />
    <p className="text-5xl md:text-6xl font-playfair font-bold text-white mb-2" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}>
      +<AnimatedCounter to={value} />
    </p>
    <p className="text-sm uppercase tracking-widest text-pm-off-white/70 font-semibold">{label}</p>
  </div>
);


const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return (
      <div className="min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-pm-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
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
    <div className="bg-pm-dark text-pm-off-white overflow-hidden">
      <SEO
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241"
        image={siteImages.hero}
        schema={organizationSchema}
      />

      {/* 1. Enhanced Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <ParallaxHero
          image={siteImages.hero}
          title=""
          subtitle=""
          height="h-screen"
          overlayOpacity={0.4}
        >
          <div className="flex flex-col items-center justify-center space-y-6 -mt-20">
            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-playfair font-black text-transparent bg-clip-text bg-gradient-to-b from-pm-gold to-[#a38018] uppercase tracking-tighter" style={{ filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))' }}>
                PMM Agency
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-xl md:text-2xl font-light tracking-widest text-white uppercase border-y border-white/20 py-2">
                L'Élégance Redéfinie
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <p className="text-lg text-pm-off-white/80 max-w-2xl mx-auto leading-relaxed mt-4 hidden md:block">
                Au cœur de la mode africaine, nous sculptons les carrières et célébrons la beauté sous toutes ses formes.
              </p>
            </FadeIn>

            <FadeIn delay={0.8} className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              {nextEvent ? (
                <Link to="/fashion-day" className="cta-btn-gold animate-glow px-12 py-4 text-base shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Réserver votre Table
                </Link>
              ) : (
                <Link to="/casting-formulaire" className="cta-btn-gold animate-glow px-12 py-4 text-base shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                  Devenir Mannequin
                </Link>
              )}
              <Link to="/agence" className="cta-btn-outline px-12 py-4 text-base hover:bg-white hover:text-black hover:border-white">
                Découvrir l'Agence
              </Link>
            </FadeIn>
          </div>
        </ParallaxHero>

        {/* Next Event Sticky Bar */}
        {nextEvent && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black via-black/90 to-transparent pt-12 pb-6 px-6"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5, ease: 'easeOut' }}
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 border-t border-pm-gold/30 pt-4">
              <div className="text-center md:text-left">
                <p className="text-pm-gold text-sm uppercase tracking-widest font-bold">Prochain Événement</p>
                <h3 className="text-2xl font-playfair text-white">Perfect Fashion Day <span className="text-pm-off-white/60">- Édition {nextEvent.edition}</span></h3>
              </div>
              <div className="scale-90 md:scale-100">
                <CountdownTimer targetDate={nextEvent.date} />
              </div>
              <Link to="/fashion-day" className="hidden md:inline-flex items-center text-pm-gold uppercase text-xs font-bold tracking-widest hover:underline">
                En savoir plus <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        )}
      </section>

      <div className="page-container space-y-24 lg:space-y-32">
        {/* 2. Agency Presentation */}
        <section className="relative">
          {/* Abstract BG */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-pm-gold/5 to-transparent opacity-50 blur-3xl rounded-full pointer-events-none -z-10 bg-blend-screen"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="right" className="relative group">
              <div className="absolute -inset-4 border border-pm-gold/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-90 group-hover:scale-100"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-pm-gold/10 mix-blend-overlay z-10"></div>
                <img src={siteImages.about} alt="L'équipe de Perfect Models Management" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            </FadeIn>

            <div className="text-center md:text-left">
              <Reveal>
                <h2 className="section-title text-left !mb-2">L'Agence</h2>
              </Reveal>
              <FadeIn delay={0.2}>
                <h3 className="text-2xl font-playfair text-white mb-6">Excellence, Élégance & Authenticité</h3>
                <p className="text-lg text-pm-off-white/80 mb-8 leading-relaxed">
                  {agencyInfo.about.p1}
                </p>
                <div className="grid grid-cols-3 gap-4 mb-10 border-y border-white/10 py-6">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-pm-gold mb-1">2021</span>
                    <span className="text-xs uppercase tracking-wider text-pm-off-white/60">Fondation</span>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <span className="block text-2xl font-bold text-pm-gold mb-1">{models.length}+</span>
                    <span className="text-xs uppercase tracking-wider text-pm-off-white/60">Talents</span>
                  </div>
                  <div className="text-center border-l border-white/10">
                    <span className="block text-2xl font-bold text-pm-gold mb-1">100%</span>
                    <span className="text-xs uppercase tracking-wider text-pm-off-white/60">Passion</span>
                  </div>
                </div>
                <Link to="/agence" className="cta-btn-outline inline-flex items-center gap-2 group">
                  Notre Histoire
                  <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* 3. Key Figures (Dark Section) */}
        <section className="relative">
          <div className="absolute inset-x-[-50vw] inset-y-0 bg-white/5 skew-y-3 -z-10"></div>
          <FadeIn className="py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
              <KeyFigure icon={UsersIcon} value={models.length} label="Mannequins" />
              <KeyFigure icon={CalendarDaysIcon} value={fashionDayEvents.length} label="Événements PFD" />
              <KeyFigure icon={StarIcon} value={agencyServices.length} label="Services" />
              <KeyFigure icon={TrophyIcon} value={new Date().getFullYear() - 2021} label="Ans d'expérience" />
            </div>
          </FadeIn>
        </section>

        {/* 4. Services */}
        <section>
          <FadeIn>
            <div className="text-center mb-16">
              <Reveal width="100%" className='flex justify-center'>
                <h2 className="section-title !mb-4">Nos Prestations</h2>
              </Reveal>
              <p className="text-lg text-pm-off-white/60 max-w-2xl mx-auto">
                Une expertise complète au service de votre image et de vos événements.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {featuredServices.map((service, index) => (
              <FadeIn key={service.title} delay={index * 0.1}>
                <ServiceCard service={service} />
              </FadeIn>
            ))}
          </div>

          <FadeIn className="text-center mt-16">
            <Link to="/services" className="cta-btn-gold px-12">
              Découvrir tous nos services
            </Link>
          </FadeIn>
        </section>
      </div>

      {/* 5. Models (Full bleed parallax-like) */}
      <section className="relative py-32 mt-20 bg-fixed bg-center bg-cover" style={{ backgroundImage: "url('https://i.ibb.co/C5rcPJHz/titostyle-53.jpg')" }}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <Reveal blockColor="#fff">
                  <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-2">Nos Visages</h2>
                </Reveal>
                <p className="text-pm-off-white/70">Les talents qui incarnent la diversité et la beauté gabonaise.</p>
              </div>
              <Link to="/mannequins" className="hidden md:flex items-center text-white hover:text-pm-gold transition-colors font-bold uppercase tracking-widest text-sm">
                Voir tout le board <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicModels.map((model, index) => (
              <FadeIn key={model.id} delay={index * 0.1} viewportAmount={0.2}>
                <ModelCard model={model} />
              </FadeIn>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link to="/mannequins" className="cta-btn-outline border-white text-white hover:bg-white hover:text-black">
              Voir tout le board
            </Link>
          </div>
        </div>
      </section>

      <div className="page-container space-y-24">

        {/* NEW: Magazine Section */}
        {data.articles && data.articles.length > 0 && (
          <section>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <FadeIn>
                <Reveal>
                  <h2 className="section-title !mb-2 text-left">Le Magazine</h2>
                </Reveal>
              </FadeIn>
              <FadeIn delay={0.2}>
                <Link to="/magazine" className="hidden sm:flex items-center text-pm-gold border-b border-pm-gold/50 pb-1 hover:text-white hover:border-white transition-all">
                  Toute l'actualité <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </FadeIn>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.articles.slice(0, 3).map((article, index) => (
                <FadeIn key={article.slug} delay={index * 0.15}>
                  <div className="group cursor-pointer h-full flex flex-col">
                    <Link to={`/magazine/${article.slug}`} className="block overflow-hidden rounded-lg mb-5 relative aspect-[4/3]">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-pm-gold text-pm-dark text-xs font-bold px-3 py-1 uppercase tracking-widest z-20">
                        {article.category}
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <span className="text-pm-off-white/40 text-xs mb-3 flex items-center gap-2">
                        <CalendarDaysIcon className="w-3 h-3" /> {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <h3 className="text-xl font-playfair font-bold text-white group-hover:text-pm-gold transition-colors mb-3 leading-tight">
                        <Link to={`/magazine/${article.slug}`}>{article.title}</Link>
                      </h3>
                      <p className="text-pm-off-white/60 text-sm line-clamp-3 mb-4 flex-grow leading-relaxed">
                        {article.excerpt}
                      </p>
                      <Link to={`/magazine/${article.slug}`} className="text-pm-gold text-xs font-bold uppercase tracking-widest mt-auto inline-flex items-center opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        Lire l'article <ArrowRightIcon className="w-3 h-3 ml-2" />
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link to="/magazine" className="cta-btn-outline">
                Toute l'actualité
              </Link>
            </div>
          </section>
        )}

        {/* 6. Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <section className="bg-white/5 rounded-2xl p-8 md:p-16 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5">
              <svg className="w-40 h-40 text-pm-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.067 14.929 15.513C15.537 14.959 16.485 14.682 17.773 14.682V12.636C16.841 12.636 16.095 12.513 15.535 12.267C14.975 12.021 14.695 11.458 14.695 10.578V7H20V15H17.279C16.861 15 16.599 15.088 16.493 15.264C16.387 15.44 16.334 15.776 16.334 16.272V21H14.017ZM5.017 21L5.017 18C5.017 16.896 5.321 16.067 5.929 15.513C6.537 14.959 7.485 14.682 8.773 14.682V12.636C7.841 12.636 7.095 12.513 6.535 12.267C5.975 12.021 5.695 11.458 5.695 10.578V7H11V15H8.279C7.861 15 7.599 15.088 7.493 15.264C7.387 15.44 7.334 15.776 7.334 16.272V21H5.017Z" /></svg>
            </div>

            <FadeIn>
              <div className="text-center mb-10">
                <h2 className="section-title !mb-2">Témoignages</h2>
                <p className="text-pm-off-white/60">Ce que nos partenaires et talents disent de nous.</p>
              </div>
            </FadeIn>

            <div className="mt-8 relative z-10">
              <TestimonialCarousel />
            </div>
          </section>
        )}

        {/* 7. Enhanced Call to Action */}
        <section className="relative py-24 text-center overflow-hidden">
          {/* Dynamic background lines */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-pm-gold to-transparent"></div>
            <div className="absolute top-0 left-1/2 h-full w-[1px] bg-gradient-to-b from-transparent via-pm-gold to-transparent"></div>
          </div>

          <FadeIn>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-black text-white mb-6 uppercase tracking-tight">
              Prêts à faire <span className="text-pm-gold">l'histoire</span> ?
            </h2>
            <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-12 font-light">
              Mannequin, créateur ou partenaire, rejoignez l'excellence.
              L'aventure Perfect Models Management commence ici.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/casting-formulaire" className="cta-btn-gold px-12 py-5 text-lg shadow-[0_0_30px_rgba(212,175,55,0.3)] animate-glow">
                Postuler maintenant
              </Link>
              <Link to="/contact" className="cta-btn-outline px-12 py-5 text-lg border-white/20 text-white hover:bg-white hover:text-black">
                Nous Contacter
              </Link>
            </div>
          </FadeIn>
        </section>
      </div>
    </div>
  );
};

export default Home;