import React, { useState } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import { AchievementCategory, ModelDistinction } from '../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

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
      <div className="page-container space-y-20 lg:space-y-28">

        {/* À Propos */}
        <section>
          <h2 className="section-title">Notre Histoire</h2>
          <div className="content-section flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 p-2 border-2 border-pm-gold img-frame">
              <img src={siteImages.agencyHistory} alt="L'équipe Perfect Models" className="w-full h-full object-cover"/>
            </div>
            <div className="md:w-1/2 text-lg leading-relaxed text-pm-off-white/90">
              <p className="mb-6">Fondée en 2021 par Parfait-Louis Asseko, Perfect Models Management est née d'une vision audacieuse : créer une agence de mannequins qui valorise authentiquement la beauté et le talent africains sur la scène internationale. Notre parcours a débuté avec une poignée de mannequins passionnés et s'est transformé en une référence incontournable dans l'industrie de la mode au Gabon.</p>
              <p className="mb-6">Au fil des années, nous avons développé une expertise unique dans la découverte et la formation de talents exceptionnels. Notre approche holistique du mannequinat combine formation professionnelle, développement personnel et opportunités concrètes, permettant à nos modèles de briller dans un secteur exigeant tout en restant fidèles à leurs racines.</p>
              <p>Aujourd'hui, Perfect Models Management représente l'excellence et l'innovation dans le mannequinat africain, avec une empreinte qui s'étend bien au-delà des frontières gabonaises. Notre mission reste inchangée : révéler la beauté dans toute sa diversité et redéfinir les standards de l'élégance à travers une vision authentiquement africaine.</p>
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

         {/* Section supprimée: Partenaires */}

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
                    className="content-section"
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
