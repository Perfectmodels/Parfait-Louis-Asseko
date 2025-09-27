'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  ClockIcon,
  UserGroupIcon,
  CameraIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import SEO from '../../components/SEO';
import { useData } from '../../contexts/DataContext';

const Casting: React.FC = () => {
  const { data } = useData();
  const [activeCasting, setActiveCasting] = useState(0);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pm-gold">
        Chargement...
      </div>
    );
  }

  const { castingApplications, siteConfig } = data;

  const currentCastings = [
    {
      id: 1,
      title: "Casting Mode Printemps 2024",
      description: "Recherche de mannequins pour notre collection printemps. Photoshoot en studio et extérieur.",
      date: "2024-03-15",
      time: "09:00 - 17:00",
      location: "Studio Perfect Models, Libreville",
      requirements: ["Femme", "18-30 ans", "Taille 34-38", "Expérience souhaitée"],
      type: "Photographie",
      status: "Ouvert",
      image: "/assets/casting-1.jpg"
    },
    {
      id: 2,
      title: "Casting Vidéo Commercial",
      description: "Recherche de mannequins pour une campagne publicitaire télévisée.",
      date: "2024-03-20",
      time: "10:00 - 16:00",
      location: "Studio Perfect Models, Libreville",
      requirements: ["Tous genres", "20-35 ans", "Toutes tailles", "Expérience requise"],
      type: "Vidéo",
      status: "Ouvert",
      image: "/assets/casting-2.jpg"
    },
    {
      id: 3,
      title: "Casting Défilé Fashion Day",
      description: "Recherche de mannequins pour le défilé de mode annuel Perfect Fashion Day.",
      date: "2024-04-01",
      time: "14:00 - 18:00",
      location: "Palais des Congrès, Libreville",
      requirements: ["Femme", "18-28 ans", "Taille 34-36", "Démarche professionnelle"],
      type: "Défilé",
      status: "Bientôt",
      image: "/assets/casting-3.jpg"
    }
  ];

  const castingTypes = [
    { name: "Tous", count: currentCastings.length },
    { name: "Photographie", count: currentCastings.filter(c => c.type === "Photographie").length },
    { name: "Vidéo", count: currentCastings.filter(c => c.type === "Vidéo").length },
    { name: "Défilé", count: currentCastings.filter(c => c.type === "Défilé").length }
  ];

  const requirements = [
    "Avoir entre 16 et 35 ans",
    "Mesures conformes aux standards de l'industrie",
    "Disponibilité pour les créneaux proposés",
    "Portfolio ou photos récentes",
    "Motivation et professionnalisme"
  ];

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title="Castings | Perfect Models Management"
        description="Découvrez nos castings ouverts et postulez pour rejoindre notre agence de mannequins. Opportunités de photographie, vidéo et défilés."
        keywords="casting mannequin gabon, audition mode, postuler mannequin, casting libreville, agence mannequin"
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
            Nos Castings
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-8"
          >
            Rejoignez notre agence et participez à des projets passionnants. 
            Découvrez les opportunités qui vous attendent.
          </motion.p>
        </div>
      </section>

      <div className="page-container">
        {/* Current Castings */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Castings Actuels</h2>
            <p className="text-pm-off-white/80 max-w-2xl mx-auto">
              Découvrez les opportunités disponibles et postulez dès maintenant
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentCastings.map((casting, index) => (
              <motion.div
                key={casting.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl overflow-hidden hover:border-pm-gold/40 transition-all duration-300"
              >
                <div className="relative h-48 bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 flex items-center justify-center">
                  <CameraIcon className="w-16 h-16 text-pm-gold/50" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      casting.status === 'Ouvert' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {casting.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-pm-gold/10 text-pm-gold text-xs font-semibold rounded">
                      {casting.type}
                    </span>
                  </div>

                  <h3 className="text-xl font-playfair text-pm-gold mb-3">{casting.title}</h3>
                  <p className="text-pm-off-white/70 text-sm mb-4">{casting.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-pm-off-white/80">
                      <CalendarDaysIcon className="w-4 h-4 text-pm-gold" />
                      <span>{new Date(casting.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-pm-off-white/80">
                      <ClockIcon className="w-4 h-4 text-pm-gold" />
                      <span>{casting.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-pm-off-white/80">
                      <MapPinIcon className="w-4 h-4 text-pm-gold" />
                      <span>{casting.location}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-pm-gold mb-2">Critères :</h4>
                    <div className="flex flex-wrap gap-1">
                      {casting.requirements.map((req, reqIndex) => (
                        <span key={reqIndex} className="px-2 py-1 bg-pm-gold/10 text-pm-gold text-xs rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/casting-formulaire"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20"
                  >
                    Postuler maintenant
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl p-8"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-playfair text-pm-gold mb-4">Critères de Sélection</h2>
              <p className="text-pm-off-white/80 max-w-2xl mx-auto">
                Voici les critères généraux que nous recherchons chez nos mannequins
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requirements.map((requirement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircleIcon className="w-5 h-5 text-pm-gold mt-0.5 flex-shrink-0" />
                  <span className="text-pm-off-white/80">{requirement}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <h2 className="text-4xl font-playfair text-pm-gold mb-6">Prêt à nous rejoindre ?</h2>
            <p className="text-pm-off-white/80 mb-8 max-w-2xl mx-auto">
              Postulez dès maintenant et donnez vie à vos rêves de mannequinat avec Perfect Models Management.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/casting-formulaire" 
                className="px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20"
              >
                Postuler maintenant
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
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

export default Casting;