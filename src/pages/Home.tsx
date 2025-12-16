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

const ParallaxHero: React.FC<{ image: string, event: any }> = ({ image, event }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ y, backgroundImage: `url('${image}')` }}
        className="absolute inset-0 bg-cover bg-center"
      />
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
      >
        <motion.span
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="block text-pm-gold uppercase tracking-[0.3em] mb-4 text-sm md:text-base font-bold"
        >
          Agence de Mannequins & Événementiel
        </motion.span>
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-6xl md:text-8xl lg:text-9xl font-playfair text-white mb-6 leading-tight"
        >
          L'Élégance <br /><span className="italic text-pm-gold">Redéfinie</span>
        </motion.h1>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-10"
        >
          <Link to="/casting-formulaire">
            <Button className="min-w-[200px]">Devenir Mannequin</Button>
          </Link>
          <Link to="/agence">
            <Button variant="outline" className="min-w-[200px]">Découvrir l'Agence</Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Event Countdown Banner */}
      {event && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent pt-20 pb-8 px-6"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-6">
            <div className="text-center md:text-left flex-1">
              <h3 className="text-pm-gold font-playfair text-xl">Perfect Fashion Day</h3>
              <p className="text-sm text-gray-400">Édition {event.edition} • {new Date(event.date).toLocaleDateString()}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <CountdownTimer targetDate={event.date} />
              <Link to="/fashion-day/reservation">
                <Button
                  className="animate-glow shadow-lg shadow-pm-gold/20"
                  icon={<TicketIcon className="w-5 h-5" />}
                >
                  Réserver ma Place
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const Marquee: React.FC = () => {
  return (
    <div className="bg-pm-gold py-4 overflow-hidden whitespace-nowrap relative z-20">
      <motion.div
        className="inline-block text-black font-bold text-lg tracking-widest uppercase"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        <span className="mx-8">Fashion</span>•<span className="mx-8">Mode</span>•<span className="mx-8">Élégance</span>•<span className="mx-8">Style</span>•
        <span className="mx-8">Casting</span>•<span className="mx-8">Events</span>•<span className="mx-8">Models</span>•<span className="mx-8">Luxury</span>•
        <span className="mx-8">Fashion</span>•<span className="mx-8">Mode</span>•<span className="mx-8">Élégance</span>•<span className="mx-8">Style</span>•
        <span className="mx-8">Casting</span>•<span className="mx-8">Events</span>•<span className="mx-8">Models</span>•<span className="mx-8">Luxury</span>•
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

      <ParallaxHero image={siteImages.hero} event={nextEvent} />
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