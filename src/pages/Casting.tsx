
import React from 'react';
import { Link } from 'react-router-dom';
import { 
    CalendarDaysIcon, 
    ClockIcon, 
    MapPinIcon, 
    CheckCircleIcon,
    SparklesIcon,
    AcademicCapIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import PublicPageLayout from '../components/PublicPageLayout';

const Casting: React.FC = () => {
  const { data, isInitialized } = useData();
  
  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark" />;
  }
  
  const { siteImages } = data;

  const conditions = {
    filles: [
      { label: "Âge", value: "16 à 28 ans" },
      { label: "Taille", value: "1m70 minimum" },
      { label: "Tour de taille", value: "60 à 66 cm" },
      { label: "Tour de hanche", value: "90 à 96 cm" },
    ],
    garcons: [
      { label: "Âge", value: "18 à 30 ans" },
      { label: "Taille", value: "1m80 minimum" },
    ],
  };
  
  const dressCode = [
    "Débardeur noir",
    "Jean slim noir",
    "Talons (pour les filles)",
    "Chaussures de ville (pour les garçons)",
  ];

  return (
    <PublicPageLayout
        title="Grand Casting National"
        subtitle="Nous recherchons les futurs visages de la mode. Saisissez votre chance de rejoindre une agence d'élite et de lancer votre carrière."
        heroImage={siteImages.castingHero}
        callToAction={{ text: "Postuler en ligne", link: "/casting-formulaire"}}
    >
      <div className="space-y-20">
        
        {/* Informations Clés */}
        <section className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 text-center">
            <InfoCard icon={CalendarDaysIcon} title="Date du Casting" content="Bientôt Annoncée" />
            <InfoCard icon={MapPinIcon} title="Lieu" content="Libreville, Gabon" />
            <InfoCard icon={ClockIcon} title="Heure" content="À déterminer" />
        </section>

        {/* Conditions de participation */}
        <section>
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Conditions de Participation</h2>
            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                <ConditionBlock title="Pour les Filles" conditions={conditions.filles} />
                <ConditionBlock title="Pour les Garçons" conditions={conditions.garcons} />
            </div>
        </section>

        {/* Dress Code */}
        <section className="text-center max-w-2xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-8 text-pm-off-white">Tenue Exigée</h2>
             <ul className="space-y-3 text-lg text-pm-off-white/80">
                {dressCode.map((item, index) => (
                    <li key={index} className="flex items-center justify-center gap-3">
                        <CheckCircleIcon className="w-6 h-6 text-pm-gold"/>
                        <span>{item}</span>
                    </li>
                ))}
             </ul>
        </section>

        {/* Pourquoi Nous Rejoindre? */}
        <section>
            <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Pourquoi nous rejoindre ?</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <FeatureCard 
                    icon={AcademicCapIcon}
                    title="Formation d'Élite"
                    description="Accédez à une formation complète couvrant la démarche, la posture, la photogénie et les standards internationaux."
                />
                <FeatureCard 
                    icon={SparklesIcon}
                    title="Opportunités Uniques"
                    description="Participez à des défilés, des campagnes publicitaires et des événements prestigieux comme la Perfect Fashion Day."
                />
                <FeatureCard 
                    icon={UserGroupIcon}
                    title="Encadrement Professionnel"
                    description="Bénéficiez du suivi d'une équipe de professionnels passionnés et dévoués à votre succès."
                />
            </div>
        </section>
      </div>
    </PublicPageLayout>
  );
};

const InfoCard: React.FC<{ icon: React.ElementType, title: string, content: string }> = ({ icon: Icon, title, content }) => (
    <div className="bg-black/30 border border-pm-gold/20 rounded-xl p-6">
        <Icon className="w-10 h-10 text-pm-gold mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-pm-off-white mb-1">{title}</h3>
        <p className="text-lg text-pm-gold">{content}</p>
    </div>
);

const ConditionBlock: React.FC<{ title: string, conditions: {label: string, value: string}[] }> = ({ title, conditions }) => (
    <div className="bg-black/30 border border-pm-gold/20 rounded-xl p-8">
        <h3 className="text-2xl font-playfair text-pm-gold mb-6">{title}</h3>
        <ul className="space-y-4">
            {conditions.map(c => (
                <li key={c.label} className="flex justify-between border-b border-pm-gold/10 pb-2">
                    <span className="text-pm-off-white/80">{c.label}</span>
                    <span className="font-semibold text-pm-off-white">{c.value}</span>
                </li>
            ))}
        </ul>
    </div>
);

const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string }> = ({ icon: Icon, title, description }) => (
    <div className="bg-black/30 border border-pm-gold/20 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-pm-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-8 h-8 text-pm-gold" />
        </div>
        <h3 className="text-2xl font-playfair text-pm-gold mb-3">{title}</h3>
        <p className="text-pm-off-white/70">{description}</p>
    </div>
);

export default Casting;
