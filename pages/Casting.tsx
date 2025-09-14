

import React from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const Casting: React.FC = () => {
  const { data, isInitialized } = useData();
  const castingDate = "2025-09-06T14:00:00";
  
  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark" />;
  }
  
  const { siteImages } = data;
  const posterUrl = siteImages.castingBg;

  const conditionsFilles = [
    "Âge : 16 à 28 ans",
    "Taille : 1m70 minimum",
    "Tour de taille : 60 à 66 cm",
    "Tour de hanche : 90 à 96 cm",
  ];

  const conditionsGarcons = [
    "Âge : 18 à 30 ans",
    "Taille : 1m80 minimum",
  ];
  
  const dressCode = [
    "Débardeur noir",
    "Jean slim noir",
    "Talons (pour les filles)",
    "Chaussures de ville (pour les garçons)",
  ];

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="Grand Casting National | Devenez Mannequin PMM"
        description="Saisissez votre chance ! Participez au grand casting national de Perfect Models Management pour devenir notre prochain visage. Découvrez les dates, lieux et conditions pour lancer votre carrière."
        keywords="casting mannequin gabon 2025, devenir mannequin libreville, casting pmm, agence de casting gabon, comment devenir mannequin"
        image={posterUrl}
      />
      {/* Hero Section */}
      <section 
        className="relative min-h-[70vh] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${posterUrl}')` }}
        aria-labelledby="casting-title"
      >
        <div className="absolute inset-0 bg-pm-dark/80 backdrop-blur-sm"></div>
        <div className="relative z-10 p-6">
          <h1 id="casting-title" className="text-4xl md:text-6xl font-playfair text-pm-gold font-extrabold" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
            Grand Casting National 2025
          </h1>
          <p className="mt-4 text-lg md:text-xl text-pm-off-white/90 max-w-2xl mx-auto">
            Perfect Models Management recherche ses nouveaux visages. Saisissez votre chance de rejoindre l'élite de la mode.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="space-y-20">
            {/* Event Info Section */}
            <section aria-label="Informations sur le casting" className="bg-black p-8 border border-pm-gold/20 -mt-40 relative z-20 max-w-5xl mx-auto shadow-2xl shadow-pm-gold/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <InfoItem icon={CalendarDaysIcon} title="Date" content="Samedi 6 Sept. 2025" />
                    <InfoItem icon={ClockIcon} title="Heure" content="14h00" />
                    <InfoItem icon={MapPinIcon} title="Lieu" content="Complexe Eli, Ancien Sobraga" />
                </div>
            </section>
            
            {/* Countdown Timer Section */}
            <section aria-labelledby="countdown-title" className="text-center">
                <h2 id="countdown-title" className="text-2xl font-playfair text-pm-gold mb-6">Le casting commence dans...</h2>
                <CountdownTimer targetDate={castingDate} />
            </section>

            {/* Details Section */}
            <section aria-labelledby="details-title" className="max-w-5xl mx-auto">
                <h2 id="details-title" className="text-4xl font-playfair text-pm-gold text-center mb-12">Modalités de Participation</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Conditions */}
                    <div className="bg-black p-8 border border-pm-gold/10">
                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Conditions de Participation</h3>
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-lg text-pm-off-white mb-3">Pour les Filles :</h4>
                                <ul className="space-y-2 text-pm-off-white/80">
                                    {conditionsFilles.map((item, index) => <li key={index} className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-pm-gold"/>{item}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-pm-off-white mb-3">Pour les Garçons :</h4>
                                <ul className="space-y-2 text-pm-off-white/80">
                                    {conditionsGarcons.map((item, index) => <li key={index} className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-pm-gold"/>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Dress Code */}
                    <div className="bg-black p-8 border border-pm-gold/10">
                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Tenue Exigée</h3>
                        <p className="text-pm-off-white/80 mb-4">
                            Veuillez vous présenter avec la tenue suivante pour garantir une évaluation optimale :
                        </p>
                        <ul className="space-y-2 text-pm-off-white/80">
                           {dressCode.map((item, index) => <li key={index} className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-pm-gold"/>{item}</li>)}
                        </ul>
                         <p className="mt-6 text-sm text-pm-gold/80 italic">
                           Le non-respect de la tenue peut être un motif d'élimination.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* CTA Section */}
            <section aria-labelledby="application-title">
              <div className="max-w-3xl mx-auto bg-pm-gold text-pm-dark p-8 text-center shadow-lg shadow-pm-gold/30">
                <h2 id="application-title" className="text-4xl font-playfair font-bold mb-4">Prêt(e) à défiler ?</h2>
                <p className="text-lg mb-6">Ne manquez pas cette opportunité unique. Soumettez votre candidature en ligne pour pré-valider votre participation.</p>
                <ReactRouterDOM.Link to="/casting-formulaire" className="inline-block px-10 py-4 bg-pm-dark text-pm-gold font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105">
                    Postuler en Ligne
                </ReactRouterDOM.Link>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
    icon: React.ElementType;
    title: string;
    content: string;
}
const InfoItem: React.FC<InfoItemProps> = ({ icon: Icon, title, content }) => (
    <div className="flex flex-col items-center">
        <Icon className="w-10 h-10 text-pm-gold mb-3" aria-hidden="true" />
        <h3 className="font-bold text-lg uppercase tracking-wider text-pm-off-white/80">{title}</h3>
        <p className="text-pm-off-white">{content}</p>
    </div>
);

export default Casting;
