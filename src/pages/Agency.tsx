import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { AchievementCategory, ModelDistinction } from '../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const faqs = [
    {
        question: "Quels sont les critères pour devenir mannequin chez PMM ?",
        answer: "Nous recherchons des profils variés. Pour les femmes, une taille minimale de 1m70 est généralement requise, et 1m80 pour les hommes. Cependant, nous sommes avant tout à la recherche de personnalités uniques, d'un charisme et d'une grande motivation. N'hésitez pas à postuler même si vous ne correspondez pas exactement à ces critères."
    },
    {
        question: "Comment se déroule le processus de casting ?",
        answer: "Le processus commence par une candidature en ligne via notre formulaire. Si votre profil est présélectionné, vous serez invité à un casting physique où nous évaluerons votre démarche, votre aisance devant l'objectif et votre personnalité. Les candidats retenus intègrent ensuite notre programme de formation."
    },
    {
        question: "L'agence prend-elle en charge les frais de book photo ?",
        answer: "Pour les mannequins que nous signons, l'agence investit dans la création de leur premier book professionnel. Nous organisons les shootings avec nos photographes partenaires. Ces frais sont généralement avancés par l'agence et récupérés sur les premiers contrats du mannequin."
    },
    {
        question: "Proposez-vous des formations pour les débutants ?",
        answer: "Oui, la formation est au cœur de notre mission. Tous nos mannequins, même les plus expérimentés, bénéficient d'un suivi continu. Pour les débutants, nous avons un programme complet, la 'PMM Classroom', qui couvre tous les aspects du métier : démarche, pose, nutrition, gestion de carrière, etc."
    },
    {
        question: "Comment puis-je booker un de vos mannequins pour un projet ?",
        answer: "Le plus simple est de nous contacter via le formulaire sur notre page Contact ou de remplir le formulaire de booking dédié. Décrivez-nous votre projet (type de shooting, dates, budget) et les profils que vous recherchez, et notre équipe reviendra vers vous rapidement avec une sélection de mannequins adaptés."
    }
];

interface FaqItemProps {
  faq: { question: string; answer: string };
  id: number;
}

const FaqItem: React.FC<FaqItemProps> = ({ faq, id }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-black border border-pm-gold/20 rounded-lg">
            <h2>
                <button
                    type="button"
                    className="flex justify-between items-center w-full p-6 text-left font-semibold text-pm-off-white"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-content-${id}`}
                >
                    <span>{faq.question}</span>
                    <ChevronDownIcon className={`w-5 h-5 text-pm-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </h2>
            <div
                id={`faq-content-${id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                hidden={!isOpen}
            >
                <div className="p-6 pt-0 text-pm-off-white/80">
                    <p>{faq.answer}</p>
                </div>
            </div>
        </div>
    );
};


const Agency: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  const { agencyInfo, modelDistinctions, agencyTimeline, agencyAchievements, agencyPartners, siteImages } = data;

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="L'Agence | Notre Histoire et Nos Valeurs"
        description="Plongez au cœur de Perfect Models Management. Découvrez notre histoire, nos valeurs de professionnalisme et d'excellence, et les services qui font de nous un leader de la mode au Gabon."
        keywords="histoire agence pmm, valeurs mannequinat, services agence de mannequins, agence de mode gabon, parfait asseko"
        image={siteImages.agencyHistory}
      />
      <div className="page-container">

        {/* À Propos */}
        <section>
          <h2 className="section-title">Notre Histoire</h2>
          <div className="content-section flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 p-2 border-2 border-pm-gold">
              <img src={siteImages.agencyHistory} alt="L'équipe Perfect Models" className="w-full h-full object-cover"/>
            </div>
            <div className="md:w-1/2 text-lg leading-relaxed text-pm-off-white/90">
              <p className="mb-4">{agencyInfo.about.p1}</p>
              <p>{agencyInfo.about.p2}</p>
            </div>
          </div>
        </section>

        {/* Distinctions */}
        <section>
          <h2 className="section-title">Distinctions de nos Mannequins</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modelDistinctions.map((distinction, index) => (
              <DistinctionCard key={index} distinction={distinction} />
            ))}
          </div>
        </section>

        {/* Parcours (Timeline) */}
        <section>
          <h2 className="section-title">Notre Parcours</h2>
           <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 h-full w-0.5 bg-pm-gold/30 transform -translate-x-1/2"></div>
                {agencyTimeline.map((item, index) => (
                    <div key={index} className={`relative flex items-center w-full my-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                            <div className="bg-black p-4 border border-pm-gold/20 rounded-lg card-base">
                                <h3 className="text-xl font-bold text-pm-gold">{item.year}</h3>
                                <p className="text-pm-off-white/80 mt-1">{item.event}</p>
                            </div>
                        </div>
                        <div className="absolute left-1/2 w-6 h-6 bg-pm-dark border-2 border-pm-gold rounded-full transform -translate-x-1/2 z-10"></div>
                    </div>
                ))}
            </div>
        </section>

         {/* Réalisations */}
        <section>
            <h2 className="section-title">Nos Réalisations</h2>
            <AchievementsTabs achievements={agencyAchievements} />
        </section>

         {/* Partenaires */}
        <section>
          <h2 className="section-title">Nos Partenaires Clé</h2>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-center">
            {agencyPartners.map((partner, index) => (
                <p key={index} className="text-xl font-semibold text-pm-off-white/80 border-b-2 border-pm-gold/30 pb-1">{partner.name}</p>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
            <h2 className="section-title">Questions Fréquemment Posées</h2>
            <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => (
                    <FaqItem key={index} faq={faq} id={index} />
                ))}
            </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <h2 className="section-title">Une Question ? Un Projet ?</h2>
          <p className="page-subtitle !mb-8 !mt-0 max-w-2xl">
              Nous serions ravis d'échanger avec vous. Visitez notre page de contact pour nous envoyer un message ou trouver nos coordonnées.
          </p>
          <Link to="/contact" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30">
              Nous Contacter
          </Link>
        </section>

      </div>
    </div>
  );
};

const DistinctionCard: React.FC<{ distinction: ModelDistinction }> = ({ distinction }) => (
    <div className="p-6 text-center h-full flex flex-col justify-center items-center card-base">
        <CheckBadgeIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-playfair text-pm-gold">{distinction.name}</h3>
        <ul className="mt-2 text-sm text-pm-off-white/80 space-y-1">
            {distinction.titles.map((title, index) => <li key={index}>✦ {title}</li>)}
        </ul>
    </div>
);

const AchievementsTabs: React.FC<{ achievements: AchievementCategory[] }> = ({ achievements }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="content-section">
            <div role="tablist" aria-label="Nos réalisations" className="flex justify-center border-b border-pm-gold/20 mb-8">
                {achievements.map((category, index) => (
                    <button
                        key={index}
                        role="tab"
                        id={`tab-${index}`}
                        aria-controls={`tab-panel-${index}`}
                        aria-selected={activeTab === index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 text-sm uppercase tracking-wider font-bold transition-colors relative ${activeTab === index ? 'text-pm-gold' : 'text-pm-off-white/70 hover:text-pm-gold'}`}
                    >
                        {category.name}
                        {activeTab === index && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold"/>}
                    </button>
                ))}
            </div>
            {achievements.map((category, index) => (
                 <div
                    key={index}
                    id={`tab-panel-${index}`}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    aria-labelledby={`tab-${index}`}
                >
                    {activeTab === index && (
                        <>
                           <ul className="columns-1 md:columns-2 lg:columns-3 gap-x-8 text-pm-off-white/80">
                                {category.items.map((item, itemIndex) => (
                                    <li key={itemIndex} className="mb-2 break-inside-avoid">{item}</li>
                                ))}
                            </ul>
                            {category.name === "Défilés de Mode" && 
                                <p className="text-center mt-8 text-pm-gold italic">"Notre agence a participé à tous les événements de mode depuis 2021, son année de création."</p>
                            }
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};


export default Agency;