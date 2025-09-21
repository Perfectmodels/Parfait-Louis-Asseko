
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import EnhancedModelCard from '../components/EnhancedModelCard';
import { ArrowRightIcon, StarIcon, UserGroupIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { models, agencyServices, testimonials, siteImages } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 3);

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="Perfect Models Management - L'Élégance Redéfinie"
        description="L'agence de mannequins de référence au Gabon. Découvrez nos talents, nos services et notre vision qui façonne l'avenir de la mode."
        image={siteImages.hero}
      />

      {/* Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${siteImages.hero})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 p-6 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white leading-tight"
          >
            L'Élégance Redéfinie
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-6 text-lg md:text-xl text-pm-off-white/90 max-w-2xl mx-auto"
          >
            Perfect Models Management : l'agence qui révèle les talents et sublime la beauté africaine.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="mt-10"
          >
            <Link to="/contact" className="inline-flex items-center gap-3 bg-pm-gold text-pm-dark font-bold px-8 py-4 rounded-full text-lg hover:bg-white transition-all shadow-lg shadow-pm-gold/20">
              Démarrez votre projet
              <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="py-20 md:py-28 space-y-20 md:space-y-28">

        {/* About Section */}
        <FeatureSection
            title="Notre Agence"
            description="Fondée sur l'excellence et la passion, Perfect Models Management est le leader de la mode au Gabon, dédiée à la promotion de talents exceptionnels."
            link={{ to: "/agence", text: "Découvrir l'agence" }}
            image={siteImages.about}
        />

        {/* Services Section */}
        <section className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Nos Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {featuredServices.map((service, index) => (
                    <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="bg-black/30 border border-pm-gold/20 rounded-xl p-8 text-center transition-all duration-300 hover:border-pm-gold hover:shadow-xl hover:shadow-pm-gold/10"
                    >
                        <div className="w-16 h-16 bg-pm-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BriefcaseIcon className="w-8 h-8 text-pm-gold" />
                        </div>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-3">{service.title}</h3>
                        <p className="text-pm-off-white/70 line-clamp-3">{service.description}</p>
                    </motion.div>
                ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/services" className="text-pm-gold font-semibold text-lg inline-flex items-center gap-2 group">
                Voir tous les services
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
        </section>

        {/* Models Section */}
        <section className="bg-black/20 py-20 md:py-28">
            <div className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Nos Mannequins</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {publicModels.map((model, index) => (
                        <EnhancedModelCard key={model.id} model={model} index={index} viewMode='grid' />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link to="/mannequins" className="text-pm-gold font-semibold text-lg inline-flex items-center gap-2 group">
                        Découvrir tous les talents
                        <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        {testimonials && testimonials.length > 0 && (
            <section className="container mx-auto px-6">
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Ce qu'ils disent de nous</h2>
                <TestimonialCarousel />
            </section>
        )}

        {/* Final CTA */}
        <section className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-pm-gold to-yellow-400 rounded-2xl p-12 md:p-16 text-center shadow-2xl shadow-pm-gold/20">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à créer l'exceptionnel ?</h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">Contactez-nous pour donner vie à vos projets les plus ambitieux.</p>
                <Link to="/contact" className="inline-flex items-center gap-3 bg-white text-pm-gold font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-100 transition-all">
                    Contactez notre équipe
                </Link>
            </div>
        </section>
      </div>
    </div>
  );
};

const FeatureSection: React.FC<{
    title: string;
    description: string;
    link: { to: string; text: string; };
    image: string;
}> = ({ title, description, link, image }) => (
    <section className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-2xl"
            >
                <img src={image} alt={title} className="w-full h-auto object-cover" />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                viewport={{ once: true }}
            >
                <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-pm-off-white">{title}</h2>
                <p className="text-lg text-pm-off-white/80 mb-8 leading-relaxed">{description}</p>
                <Link to={link.to} className="text-pm-gold font-semibold text-lg inline-flex items-center gap-2 group">
                    {link.text}
                    <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>
        </div>
    </section>
);

export default Home;
