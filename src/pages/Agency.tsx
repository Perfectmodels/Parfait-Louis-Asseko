import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { AchievementCategory, ModelDistinction, FAQCategory } from '../../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const FAQ: React.FC<{ faqData: FAQCategory[] }> = ({ faqData }) => {
    const [openFAQ, setOpenFAQ] = useState<string | null>('0-0'); // Open the first question by default

    const toggleFAQ = (id: string) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    if (!faqData || faqData.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="section-title">Questions Fréquemment Posées</h2>
            <div className="max-w-4xl mx-auto space-y-8">
                {faqData.map((category, catIndex) => (
                    <div key={catIndex}>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-4">{category.category}</h3>
                        <div className="space-y-3">
                            {category.items.map((item, itemIndex) => {
                                const faqId = `${catIndex}-${itemIndex}`;
                                const isOpen = openFAQ === faqId;
                                return (
                                    <div key={itemIndex} className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleFAQ(faqId)}
                                            className="w-full flex justify-between items-center p-5 text-left"
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${faqId}`}
                                        >
                                            <span className="font-bold text-lg text-pm-off-white">{item.question}</span>
                                            <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div
                                            id={`faq-answer-${faqId}`}
                                            className="grid transition-all duration-500 ease-in-out"
                                            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-5 pb-5 text-pm-off-white/80">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


const Agency: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  const { agencyInfo, modelDistinctions, agencyTimeline, agencyAchievements, agencyPartners, siteImages, faqData } = data;

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="L'Agence | Notre Histoire et Nos Valeurs"
        description="Plongez au cœur de Perfect Models Management. Découvrez notre histoire, nos valeurs de professionnalisme et d'excellence, et les services qui font de nous un leader de la mode au Gabon."
        keywords="histoire agence pmm, valeurs mannequinat, services agence de mannequins, agence de mode gabon, parfait asseko"
        image={siteImages.agencyHistory}
      />
      <div className="page-container space-y-20 lg:space-y-28">

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
                <p key={index} className="text-lg font-normal text-pm-off-white/80">{partner.name}</p>
            ))}
          </div>
        </section>
        
        {/* FAQ Section */}
        <FAQ faqData={faqData} />

        {/* Contact CTA */}
        <section className="text-center content-section">
          <h3 className="text-2xl font-playfair text-pm-gold mb-4">Une question ? Un projet ?</h3>
          <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
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
    <div className="card-base p-6 text-center h-full flex flex-col justify-center items-center">
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
        <div>
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
                    className={`transition-opacity duration-300 ${activeTab === index ? 'opacity-100' : 'opacity-0'}`}
                >
                    {activeTab === index && (
                        <div className="content-section animate-fade-in">
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-pm-off-white/90">
                                {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="bg-pm-dark/50 p-4 rounded-lg flex items-start gap-3 border border-pm-gold/10">
                                        <CheckBadgeIcon className="w-6 h-6 text-pm-gold flex-shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                            {category.name === "Défilés de Mode" && 
                                <p className="text-center mt-10 text-pm-gold/90 italic text-sm md:text-base bg-pm-dark/50 p-4 rounded-md">
                                    "Notre agence a participé à tous les événements de mode depuis 2021, son année de création."
                                </p>
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


export default Agency;