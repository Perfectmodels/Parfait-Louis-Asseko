import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { 
    CalendarDaysIcon, 
    ClockIcon, 
    MapPinIcon, 
    CheckCircleIcon,
    SparklesIcon,
    AcademicCapIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ScrollReveal } from '../components/ScrollAnimations';

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
        style={{ 
          backgroundImage: data?.siteImages?.castingHero ? `url(${data.siteImages.castingHero})` : `url('${posterUrl}')` 
        }}
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

      <div className="container mx-auto px-6 py-20 space-y-24">

        {/* Event Info Section */}
        <ScrollReveal>
          <section aria-label="Informations sur le casting" className="bg-black/40 backdrop-blur-sm p-8 border border-pm-gold/20 -mt-48 relative z-20 max-w-5xl mx-auto shadow-2xl shadow-pm-gold/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-pm-gold/20">
                  <InfoItem icon={CalendarDaysIcon} title="Date" content="Samedi 6 Sept. 2025" />
                  <InfoItem icon={ClockIcon} title="Heure" content="14h00" />
                  <InfoItem icon={MapPinIcon} title="Lieu" content="Complexe Eli, Ancien Sobraga" />
              </div>
          </section>
        </ScrollReveal>
        
        {/* Countdown Timer Section */}
        <ScrollReveal>
          <section aria-labelledby="countdown-title" className="text-center">
              <h2 id="countdown-title" className="section-title">Le casting commence dans...</h2>
              <div className="mt-8">
                <CountdownTimer targetDate={castingDate} />
              </div>
          </section>
        </ScrollReveal>

        {/* Details Section */}
        <ScrollReveal>
          <section aria-labelledby="details-title" className="max-w-6xl mx-auto">
              <h2 id="details-title" className="section-title">Modalités de Participation</h2>
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {/* Conditions */}
                  <div className="bg-black/30 backdrop-blur-sm p-8 border border-pm-gold/10 rounded-lg space-y-8">
                      <div>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Pour les Filles</h3>
                        <ul className="space-y-3 text-pm-off-white/80">
                            {conditionsFilles.map((item, index) => <li key={index} className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-pm-gold flex-shrink-0"/><span>{item}</span></li>)}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-6">Pour les Garçons</h3>
                        <ul className="space-y-3 text-pm-off-white/80">
                            {conditionsGarcons.map((item, index) => <li key={index} className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-pm-gold flex-shrink-0"/><span>{item}</span></li>)}
                        </ul>
                      </div>
                  </div>
                  {/* Dress Code */}
                  <div className="bg-black/30 backdrop-blur-sm p-8 border border-pm-gold/10 rounded-lg">
                      <h3 className="text-2xl font-playfair text-pm-gold mb-6">Tenue Exigée (Dress Code)</h3>
                      <p className="text-pm-off-white/80 mb-6">
                          Présentez-vous avec la tenue suivante pour une évaluation optimale :
                      </p>
                      <ul className="space-y-3 text-pm-off-white/80 mb-6">
                         {dressCode.map((item, index) => <li key={index} className="flex items-center gap-3"><CheckCircleIcon className="w-5 h-5 text-pm-gold flex-shrink-0"/><span>{item}</span></li>)}
                      </ul>
                       <p className="mt-6 text-sm text-pm-gold/80 italic border-l-2 border-pm-gold/50 pl-4">
                         Le non-respect de la tenue peut être un motif d'élimination. Soyez professionnel(le) dès le premier contact.
                      </p>
                  </div>
              </div>
          </section>
        </ScrollReveal>

        {/* Why Join Us Section */}
        <ScrollReveal>
            <section aria-labelledby="why-join-title" className="max-w-6xl mx-auto">
                <h2 id="why-join-title" className="section-title">Pourquoi nous rejoindre ?</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <FeatureCard 
                        icon={AcademicCapIcon}
                        title="Formation d'Élite"
                        description="Accédez à une formation complète couvrant la démarche, la posture, la photogénie et les standards internationaux."
                    />
                    <FeatureCard 
                        icon={SparklesIcon}
                        title="Opportunités Uniques"
                        description="Participez à des défilés de créateurs, des campagnes publicitaires et des événements prestigieux comme la Perfect Fashion Day."
                    />
                    <FeatureCard 
                        icon={UserGroupIcon}
                        title="Encadrement Professionnel"
                        description="Bénéficiez du suivi d'une équipe de professionnels passionnés et dévoués à votre succès et votre bien-être."
                    />
                </div>
            </section>
        </ScrollReveal>
        
        {/* CTA Section */}
        <ScrollReveal>
          <section aria-labelledby="application-title">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-pm-gold to-yellow-600 text-pm-dark p-10 text-center shadow-2xl shadow-pm-gold/40 rounded-lg">
              <h2 id="application-title" className="text-4xl font-playfair font-bold mb-4">Prêt(e) à défiler ?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">Ne manquez pas cette opportunité unique. Soumettez votre candidature en ligne pour pré-valider votre participation et éviter les files d'attente.</p>
              <Link to="/casting-formulaire" className="inline-block px-12 py-4 bg-pm-dark text-pm-gold font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105 rounded-full shadow-lg">
                  Postuler en Ligne
              </Link>
            </div>
          </section>
        </ScrollReveal>
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
    <div className="flex flex-col items-center p-4">
        <Icon className="w-10 h-10 text-pm-gold mb-4" aria-hidden="true" />
        <h3 className="font-bold text-lg uppercase tracking-wider text-pm-off-white/80">{title}</h3>
        <p className="text-pm-off-white text-lg">{content}</p>
    </div>
);

const FeatureCard: React.FC<InfoItemProps & { description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-black/20 p-6 rounded-lg border border-pm-gold/10">
        <Icon className="w-12 h-12 text-pm-gold mb-4 mx-auto" />
        <h3 className="text-xl font-playfair text-pm-gold mb-3">{title}</h3>
        <p className="text-pm-off-white/70 text-sm leading-relaxed">{description}</p>
    </div>
);

export default Casting;
