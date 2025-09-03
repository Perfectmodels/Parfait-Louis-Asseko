import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { AchievementCategory, ModelDistinction, Service } from '../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-4xl font-playfair text-pm-gold text-center mb-12">{children}</h2>
);

const Agency: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  const { agencyInfo, modelDistinctions, agencyTimeline, agencyServices, agencyAchievements, agencyPartners } = data;

  return (
    <div className="bg-pm-dark text-pm-off-white py-20">
      <SEO 
        title="L'Agence"
        description="Découvrez l'histoire, les valeurs, les services et les réalisations de Perfect Models Management, l'agence qui façonne l'avenir de la mode au Gabon."
        keywords="histoire agence mannequin, services mannequinat, valeurs PMM, agence de mode Gabon"
      />
      <div className="container mx-auto px-6 space-y-24">

        {/* À Propos */}
        <section>
          <SectionTitle>Notre Histoire</SectionTitle>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 p-4 border-2 border-pm-gold">
              <img src="https://i.ibb.co/hR9Sfy5Q/agstyle-15.jpg" alt="L'équipe Perfect Models" className="w-full h-full object-cover"/>
            </div>
            <div className="md:w-1/2 text-lg leading-relaxed text-pm-off-white/90">
              <p className="mb-4">{agencyInfo.about.p1}</p>
              <p>{agencyInfo.about.p2}</p>
            </div>
          </div>
        </section>

        {/* Distinctions */}
        <section>
          <SectionTitle>Distinctions de nos Mannequins</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modelDistinctions.map((distinction, index) => (
              <DistinctionCard key={index} distinction={distinction} />
            ))}
          </div>
        </section>

        {/* Parcours (Timeline) */}
        <section>
          <SectionTitle>Notre Parcours</SectionTitle>
           <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 h-full w-0.5 bg-pm-gold/30 transform -translate-x-1/2"></div>
                {agencyTimeline.map((item, index) => (
                    <div key={index} className={`relative flex items-center w-full my-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                            <div className="bg-black p-4 border border-pm-gold/20 rounded-lg">
                                <h3 className="text-xl font-bold text-pm-gold">{item.year}</h3>
                                <p className="text-pm-off-white/80 mt-1">{item.event}</p>
                            </div>
                        </div>
                        <div className="absolute left-1/2 w-6 h-6 bg-pm-dark border-2 border-pm-gold rounded-full transform -translate-x-1/2 z-10"></div>
                    </div>
                ))}
            </div>
        </section>

        {/* Services */}
        <section>
          <SectionTitle>Nos Services</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agencyServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </section>

         {/* Réalisations */}
        <section>
            <SectionTitle>Nos Réalisations</SectionTitle>
            <AchievementsTabs achievements={agencyAchievements} />
        </section>

         {/* Partenaires */}
        <section>
          <SectionTitle>Nos Partenaires Clé</SectionTitle>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-center">
            {agencyPartners.map((partner, index) => (
                <p key={index} className="text-xl font-semibold text-pm-off-white/80 border-b-2 border-pm-gold/30 pb-1">{partner}</p>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section>
          <SectionTitle>Contactez-Nous</SectionTitle>
          <div className="text-center bg-black p-12 border border-pm-gold/20">
            <h3 className="text-2xl font-playfair text-pm-gold mb-4">Une question ? Un projet ?</h3>
            <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
                Nous serions ravis d'échanger avec vous. Visitez notre page de contact pour nous envoyer un message ou trouver nos coordonnées.
            </p>
            <Link to="/contact" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30">
                Nous Contacter
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

const DistinctionCard: React.FC<{ distinction: ModelDistinction }> = ({ distinction }) => (
    <div className="bg-black p-6 border border-pm-gold/30 text-center">
        <CheckBadgeIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
        <h3 className="text-xl font-bold text-pm-gold">{distinction.name}</h3>
        <ul className="mt-2 text-sm text-pm-off-white/80 space-y-1">
            {distinction.titles.map((title, index) => <li key={index}>✦ {title}</li>)}
        </ul>
    </div>
);

// Note: The icon mapping is tricky. This is a simplified approach.
// For a full CMS, you would store the icon name and map it.
import { AcademicCapIcon, CameraIcon, FilmIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';
const icons: { [key: string]: React.ElementType } = {
  "Développement de carrière": UserGroupIcon,
  "Formations & Coaching": AcademicCapIcon,
  "Production Photo & Vidéo": CameraIcon,
  "Événementiel & Défilés": SparklesIcon,
  "Services aux Entreprises": ScaleIcon,
  "International & Prestige": GlobeAltIcon,
};
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = icons[service.title] || HeartIcon;
    return (
        <div className="bg-black p-8 text-center border border-transparent transition-all duration-300 hover:border-pm-gold/50 hover:shadow-2xl hover:shadow-pm-gold/10 hover:-translate-y-2">
            <Icon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-pm-gold mb-2">{service.title}</h3>
            <p className="text-pm-off-white/70">{service.description}</p>
        </div>
    );
};

const AchievementsTabs: React.FC<{ achievements: AchievementCategory[] }> = ({ achievements }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex justify-center border-b border-pm-gold/20 mb-8">
                {achievements.map((category, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 text-sm uppercase tracking-wider font-bold transition-colors ${activeTab === index ? 'text-pm-gold border-b-2 border-pm-gold' : 'text-pm-off-white/70 hover:text-pm-gold'}`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            <div className="bg-black p-8 border border-pm-gold/10">
                <ul className="columns-1 md:columns-2 lg:columns-3 gap-x-8 text-pm-off-white/80">
                    {achievements[activeTab].items.map((item, index) => (
                        <li key={index} className="mb-2 break-inside-avoid">{item}</li>
                    ))}
                </ul>
                {achievements[activeTab].name === "Défilés de Mode" && 
                    <p className="text-center mt-8 text-pm-gold italic">"Notre agence a participé à tous les événements de mode depuis 2021, son année de création."</p>
                }
            </div>
        </div>
    );
};


export default Agency;