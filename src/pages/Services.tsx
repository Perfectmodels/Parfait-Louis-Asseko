import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CameraIcon, 
  VideoCameraIcon, 
  PresentationChartLineIcon,
  UserGroupIcon,
  SparklesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import { useData } from '../contexts/DataContext';

const Services: React.FC = () => {
  const { data } = useData();

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pm-gold">
        Chargement...
      </div>
    );
  }

  const { agencyServices, siteConfig } = data;

  const serviceCategories = [
    {
      title: "Photographie",
      icon: CameraIcon,
      services: agencyServices.filter(s => s.category === 'photographie'),
      color: "from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400"
    },
    {
      title: "Vidéo",
      icon: VideoCameraIcon,
      services: agencyServices.filter(s => s.category === 'video'),
      color: "from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400"
    },
    {
      title: "Événements",
      icon: CalendarDaysIcon,
      services: agencyServices.filter(s => s.category === 'evenements'),
      color: "from-green-500/10 to-green-500/5 border-green-500/20 text-green-400"
    },
    {
      title: "Formation",
      icon: PresentationChartLineIcon,
      services: agencyServices.filter(s => s.category === 'formation'),
      color: "from-pm-gold/10 to-pm-gold/5 border-pm-gold/20 text-pm-gold"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Consultation",
      description: "Nous analysons vos besoins et définissons ensemble la meilleure approche pour votre projet.",
      icon: UserGroupIcon
    },
    {
      step: "02", 
      title: "Sélection",
      description: "Nous choisissons les mannequins les plus adaptés à votre vision et à votre budget.",
      icon: SparklesIcon
    },
    {
      step: "03",
      title: "Réalisation",
      description: "Notre équipe professionnelle assure la production de votre projet dans les meilleures conditions.",
      icon: CameraIcon
    },
    {
      step: "04",
      title: "Livraison",
      description: "Nous vous livrons le résultat final dans les délais convenus avec un suivi personnalisé.",
      icon: CheckIcon
    }
  ];

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <SEO 
        title="Nos Services | Perfect Models Management"
        description="Découvrez notre gamme complète de services de mannequinat : photographie, vidéo, événements et formation. Des solutions professionnelles pour tous vos projets."
        keywords="services mannequinat gabon, photographie mode, vidéo commerciale, événements mode, formation mannequin"
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
            Nos Services
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-8"
          >
            Des solutions complètes et professionnelles pour tous vos projets de mode, 
            de la photographie à la formation.
          </motion.p>
        </div>
      </section>

      <div className="page-container">
        {/* Services by Category */}
        {serviceCategories.map((category, categoryIndex) => (
          <section key={category.title} className="py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-12"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-full mb-4`}>
                <category.icon className="w-8 h-8" />
              </div>
              <h2 className="text-4xl font-playfair text-pm-gold mb-4">{category.title}</h2>
              <p className="text-pm-off-white/80 max-w-2xl mx-auto">
                Découvrez nos services spécialisés en {category.title.toLowerCase()}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.services.map((service, serviceIndex) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: serviceIndex * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        {/* Process Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-playfair text-pm-gold mb-4">Notre Processus</h2>
            <p className="text-pm-off-white/80 max-w-2xl mx-auto">
              Un accompagnement personnalisé du début à la fin de votre projet
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-pm-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-8 h-8 text-pm-gold" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-pm-gold text-pm-dark rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-playfair text-pm-gold mb-3">{step.title}</h3>
                <p className="text-pm-off-white/70 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-playfair text-pm-gold mb-6">Prêt à commencer votre projet ?</h2>
            <p className="text-pm-off-white/80 mb-8 max-w-2xl mx-auto">
              Contactez-nous dès aujourd'hui pour discuter de vos besoins et obtenir un devis personnalisé.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/contact" 
                className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20"
              >
                Demander un devis
              </Link>
              <Link 
                to="/casting-formulaire" 
                className="px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
              >
                Postuler comme mannequin
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Services;