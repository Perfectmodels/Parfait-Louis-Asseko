import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import CountdownTimer from '../components/CountdownTimer';
import { UsersIcon, CalendarDaysIcon, StarIcon, TrophyIcon, ArrowLongRightIcon, TicketIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

// --- Sub-components ---

// Hero Slides Data
const heroSlides = [
  {
    image: '/images/hero-1.jpg', // Remplacer par vos vraies images
    title: 'L\'Élégance',
    subtitle: 'Redéfinie',
    description: 'Agence de Mannequins & Événementiel',
    cta: 'Devenir Mannequin',
    ctaLink: '/casting-formulaire'
  },
  {
    image: '/images/hero-2.jpg',
    title: 'Votre Talent',
    subtitle: 'Notre Passion',
    description: 'Révélez votre potentiel avec Perfect Models',
    cta: 'Découvrir',
    ctaLink: '/agence'
  },
  {
    image: '/images/hero-3.jpg',
    title: 'Perfect Fashion',
    subtitle: 'Day #2',
    description: 'L\'événement mode incontournable de l\'année',
    cta: 'Réserver',
    ctaLink: '/fashion-day/reservation'
  },
  {
    image: '/images/hero-4.jpg',
    title: 'Excellence',
    subtitle: 'Professionnelle',
    description: 'Formation & Accompagnement sur mesure',
    cta: 'En savoir plus',
    ctaLink: '/services'
  }
];

const DynamicHero: React.FC<{ event: any }> = ({ event }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = React.useState(true);
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Auto-play slides
  React.useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Parallax */}
      {heroSlides.map((slide, index) => (
        <motion.div
          key={index}
          style={{
            y: index === currentSlide ? y : 0,
            backgroundImage: `url('${slide.image}')`
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentSlide ? 1 : 0,
            scale: index === currentSlide ? 1 : 1.1
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
        />
      ))}

      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.span
          key={`desc-${currentSlide}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="block text-pm-gold uppercase tracking-[0.3em] mb-4 text-sm md:text-base font-bold"
        >
          {currentSlideData.description}
        </motion.span>

        <motion.h1
          key={`title-${currentSlide}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-playfair text-white mb-6 leading-tight"
        >
          {currentSlideData.title} <br />
          <span className="italic text-pm-gold">{currentSlideData.subtitle}</span>
        </motion.h1>

        <motion.div
          key={`cta-${currentSlide}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10"
        >
          <Link to={currentSlideData.ctaLink}>
            <Button className="min-w-[200px]">{currentSlideData.cta}</Button>
          </Link>
        </motion.div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-3 mt-12">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${index === currentSlide
                ? 'w-12 h-2 bg-pm-gold'
                : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                } rounded-full`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Premium Event Card - Floating Glassmorphism Design */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 1, type: "spring", bounce: 0.2 }}
        className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 md:pb-8 pointer-events-none"
      >
        <div className="max-w-5xl mx-auto bg-black/60 backdrop-blur-xl border border-pm-gold/30 rounded-2xl md:rounded-full p-2 md:p-3 shadow-2xl shadow-black/50 pointer-events-auto relative overflow-hidden group">

          {/* Animated Glow Effect */}
          <div className="absolute top-0 left-[-100%] w-[150%] h-full bg-gradient-to-r from-transparent via-pm-gold/10 to-transparent transform skew-x-12 animate-shine" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-4">

            {/* Left: Event Info */}
            <div className="flex items-center gap-6 text-center md:text-left">
              <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-pm-gold text-black rounded-full font-bold shadow-lg shadow-pm-gold/20">
                <span className="text-xs uppercase tracking-tighter leading-none">JAN</span>
                <span className="text-2xl font-playfair leading-none">31</span>
              </div>

              <div className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-widest text-pm-gold">Billetterie Ouverte</span>
                </div>
                <h3 className="text-white font-playfair text-2xl md:text-3xl">
                  Perfect Fashion Day <span className="text-pm-gold italic">#2</span>
                </h3>
                <p className="text-gray-400 text-sm italic">"L'Art de se révéler" • Hôtel Restaurant Bar Casino</p>
              </div>
            </div>

            {/* Right: Countdown & Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
              <div className="hidden lg:block">
                {event && <CountdownTimer targetDate={event.date || "2026-01-31T18:00:00"} />}
              </div>

              <Link to="/fashion-day/reservation" className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto bg-pm-gold text-black hover:bg-white transition-all duration-300 shadow-lg shadow-pm-gold/20 rounded-full px-8"
                  icon={<TicketIcon className="w-5 h-5" />}
                >
                  Réserver
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Marquee: React.FC = () => {
  // Services list for the marquee
  const services = [
    "Mannequinat", "Hôtessariat", "Organisation d'Événements", "Shooting Photo",
    "Production Audiovisuelle", "Casting", "Formation", "Direction Artistique", "Conseil en Image"
  ];

  return (
    <div className="bg-pm-gold py-4 overflow-hidden whitespace-nowrap relative z-20">
      <motion.div
        className="inline-block text-black font-bold text-lg tracking-widest uppercase"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {/* Repeat the list multiple times to ensure continuous scroll */}
        {[...Array(4)].map((_, i) => (
          <React.Fragment key={i}>
            {services.map((service, index) => (
              <span key={`${i}-${index}`} className="mx-8 flex-inline items-center">
                {service} <span className="ml-8 text-black/40">•</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const EditorialSection: React.FC<{ image: string, title: string, content: string, reverse?: boolean }> = ({ image, title, content, reverse = false }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-24 overflow-hidden bg-pm-dark">
      <div className="container mx-auto px-6">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
          <motion.div
            className="w-full lg:w-1/2 relative"
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute top-4 -left-4 w-full h-full border border-pm-gold/30 z-0" />
            <div className="relative z-10 aspect-[3/4] overflow-hidden">
              <motion.img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair text-white mb-8 border-l-4 border-pm-gold pl-6">
              {title}
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              {content}
            </p>
            <Link to="/agence" className="group inline-flex items-center text-pm-gold tracking-widest uppercase text-sm font-bold">
              En savoir plus
              <ArrowLongRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AnimatedCounter: React.FC<{ to: number }> = ({ to }) => {
  const [count, setCount] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  React.useEffect(() => {
    if (isInView) {
      const controls = animate(0, to, {
        duration: 2,
        onUpdate: (value) => setCount(Math.round(value)),
        ease: "easeOut"
      });
      return () => controls.stop();
    }
  }, [isInView, to]);

  return <span ref={ref}>{count}</span>;
}

const StatItem: React.FC<{ icon: any, value: number, label: string }> = ({ icon: Icon, value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-16 h-16 rounded-full bg-pm-gold/10 flex items-center justify-center mb-4 text-pm-gold border border-pm-gold/20">
      <Icon className="w-8 h-8" />
    </div>
    <div className="text-4xl font-playfair font-bold text-white mb-2">
      +<AnimatedCounter to={value} />
    </div>
    <p className="text-sm uppercase tracking-widest text-gray-500">{label}</p>
  </div>
);

// --- Main Page Component ---

const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  const { agencyInfo, siteConfig, socialLinks, fashionDayEvents, models, siteImages, testimonials, agencyServices } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);

  const nextEvent = fashionDayEvents
    .filter(e => new Date(e.date).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const organizationSchema = {
    "@context": "https://schema.org", "@type": "Organization", "name": "Perfect Models Management",
    "url": siteConfig.url, "logo": siteConfig.logo,
    "sameAs": [socialLinks.facebook, socialLinks.instagram, socialLinks.youtube].filter(Boolean)
  };

  return (
    <div className="bg-black text-white selection:bg-pm-gold selection:text-black">
      <SEO
        title="Accueil | L'Élégance Redéfinie"
        description={siteConfig.description}
        keywords={siteConfig.keywords}
        image={siteImages.hero}
        schema={organizationSchema}
      />

      <DynamicHero event={nextEvent} />
      <Marquee />

      <EditorialSection
        title="Notre Vision"
        content={agencyInfo.about.p1}
        image={siteImages.about}
      />

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-pm-dark/50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem icon={UsersIcon} value={models.length} label="Mannequins" />
            <StatItem icon={CalendarDaysIcon} value={fashionDayEvents.length} label="Événements" />
            <StatItem icon={StarIcon} value={agencyServices.length} label="Services" />
            <StatItem icon={TrophyIcon} value={new Date().getFullYear() - 2021} label="Ans d'Excellence" />
          </div>
        </div>
      </section>

      {/* Models Section */}
      <section className="py-24 bg-black relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="section-title text-left mb-2">Nos Visages</h2>
              <p className="text-gray-400 max-w-md">Découvrez les talents qui font rayonner la mode africaine à travers le monde.</p>
            </div>
            <Link to="/mannequins">
              <Button variant="outline">Voir tout le casting</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ModelCard model={model} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-pm-dark">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="section-title">Nos Services</h2>
            <p className="text-gray-400 mt-4">Une expertise complète pour les professionnels de la mode et de l'événementiel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button variant="secondary">Explorer tous nos services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-black overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-pm-gold/5 blur-3xl rounded-full translate-x-1/2" />
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="section-title text-center mb-16">Ce qu'ils disent de nous</h2>
            <TestimonialCarousel />
          </div>
        </section>
      )}

      {/* CTA Layer */}
      <section className="py-32 relative bg-cover bg-fixed bg-center" style={{ backgroundImage: `url('${siteImages.castingBg}')` }}>
        <div className="absolute inset-0 bg-black/80" />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-playfair text-white mb-6">Révélez votre Potentiel</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Vous avez le talent, nous avons l'expertise. Rejoignez l'agence qui transforme les rêves en carrières internationales.
          </p>
          <Link to="/casting-formulaire">
            <Button className="px-10 py-5 text-lg shadow-lg shadow-pm-gold/20">Postuler Maintenant</Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;