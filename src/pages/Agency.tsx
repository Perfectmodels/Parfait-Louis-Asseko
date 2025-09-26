import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  TrophyIcon, 
  HeartIcon, 
  SparklesIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const Agency: React.FC = () => {
  const { data } = useData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pm-gold">
        Chargement...
      </div>
    );
  }

  const { agencyInfo, siteConfig, socialLinks, contactInfo, siteImages } = data;

  const stats = [
    { number: "50+", label: "Mannequins", icon: UserGroupIcon },
    { number: "100+", label: "Projets", icon: TrophyIcon },
    { number: "5+", label: "Années d'expérience", icon: HeartIcon },
    { number: "20+", label: "Partenaires", icon: SparklesIcon }
  ];

  const values = [
    {
      title: "Excellence",
      description: "Nous nous engageons à maintenir les plus hauts standards de qualité dans tous nos services.",
      icon: TrophyIcon
    },
    {
      title: "Professionnalisme",
      description: "Une approche rigoureuse et professionnelle pour chaque projet et chaque client.",
      icon: UserGroupIcon
    },
    {
      title: "Innovation",
      description: "Nous repoussons constamment les limites de la créativité et de l'innovation.",
      icon: SparklesIcon
    },
    {
      title: "Passion",
      description: "Notre passion pour la mode et l'art guide chacune de nos décisions.",
      icon: HeartIcon
    }
  ];

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title="Notre Agence | Perfect Models Management"
        description="Découvrez l'histoire, les valeurs et l'équipe de Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon."
        keywords="agence mannequins gabon, perfect models management, équipe mode, histoire agence, valeurs entreprise"
      />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6"
          >
            Notre Agence
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-8"
          >
            Depuis notre création, nous façonnons l'avenir de la mode gabonaise avec passion, 
            professionnalisme et innovation.
          </motion.p>
        </div>
      </section>

      <div className="page-container">
        {/* Stats Section */}
        <section className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-pm-gold/10 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-pm-gold" />
                </div>
                <div className="text-3xl font-bold text-pm-gold mb-2">{stat.number}</div>
                <div className="text-pm-off-white/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-4xl font-playfair text-pm-gold mb-6">Notre Histoire</h2>
              <div className="space-y-4 text-pm-off-white/80">
                <p>{agencyInfo.about.p1}</p>
                <p>{agencyInfo.about.p2}</p>
                <p>{agencyInfo.about.p3}</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <div className="p-1 border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg">
                <img 
                  src={siteConfig.aboutImage || siteImages.about} 
                  alt="L'équipe de Perfect Models Management" 
                  className="w-full h-96 object-cover rounded-md"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Nos Valeurs</h2>
            <p className="text-pm-off-white/80 max-w-2xl mx-auto">
              Les principes qui guident notre travail et définissent notre identité.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-xl p-6 text-center hover:border-pm-gold/40 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-pm-gold/10 rounded-full mb-4">
                  <value.icon className="w-6 h-6 text-pm-gold" />
                </div>
                <h3 className="text-xl font-playfair text-pm-gold mb-3">{value.title}</h3>
                <p className="text-pm-off-white/70 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-playfair text-pm-gold mb-6">Rejoignez-nous</h2>
            <p className="text-pm-off-white/80 mb-8 max-w-2xl mx-auto">
              Que vous soyez mannequin, styliste, photographe ou partenaire, 
              nous sommes toujours à la recherche de nouveaux talents pour enrichir notre écosystème.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center gap-3">
                <MapPinIcon className="w-5 h-5 text-pm-gold" />
                <span className="text-pm-off-white/80">{contactInfo.address}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <PhoneIcon className="w-5 h-5 text-pm-gold" />
                <span className="text-pm-off-white/80">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <EnvelopeIcon className="w-5 h-5 text-pm-gold" />
                <span className="text-pm-off-white/80">{contactInfo.email}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/casting-formulaire" 
                className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20"
              >
                Postuler maintenant
              </Link>
              <Link 
                to="/contact" 
                className="px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
              >
                Nous contacter
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Agency;