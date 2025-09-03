import React, { useState, useEffect } from 'react';
import { CalendarIcon, ClockIcon, MapPinIcon, AcademicCapIcon, CameraIcon, SparklesIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from '../components/icons/SocialIcons';
import BackToTopButton from '../components/BackToTopButton';
import CountdownTimer from '../components/CountdownTimer';

const Activity: React.FC = () => {
  const modules = [
    { name: "La démarche (catwalk)", description: "Maîtrisez l'art de défiler avec assurance et élégance." },
    { name: "La posture", description: "Adoptez une posture parfaite pour valoriser chaque tenue." },
    { name: "Les expressions faciales", description: "Apprenez à communiquer des émotions avec votre visage." },
    { name: "Les techniques de poses photo", description: "Découvrez les secrets pour captiver l'objectif." },
    { name: "La confiance en soi", description: "Développez une assurance inébranlable sur et hors du podium." },
  ];

  const benefits = [
    { icon: AcademicCapIcon, text: "Attestation de participation" },
    { icon: CameraIcon, text: "Shooting photo professionnel" },
    { icon: SparklesIcon, text: "Suivi post-formation" },
  ];
  
  const [shareUrl, setShareUrl] = useState('');
  const workshopDate = "2024-07-27T10:00:00";

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const shareTitle = "Découvrez l'atelier de formation au mannequinat de Perfect Models Management ! Une journée pour révéler le top model en vous. #PerfectModels #Mannequinat #Formation #ModeGabon";

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`;

  return (
    <div className="bg-pm-dark text-pm-off-white">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://i.ibb.co/8nq5gBTW/485976709-640513238697791-5779836737383586501-n.jpg')" }}
        aria-labelledby="activity-title"
      >
        <div className="absolute inset-0 bg-pm-dark/80 backdrop-blur-sm"></div>
        <div className="relative z-10 p-6">
          <h1 id="activity-title" className="text-4xl md:text-6xl font-playfair text-pm-gold font-extrabold" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
            Atelier de Formation au Mannequinat Professionnel
          </h1>
          <p className="mt-4 text-lg md:text-xl text-pm-off-white/90">
            Une journée immersive pour révéler le top model qui est en vous.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="space-y-20">
            {/* Event Info Section */}
            <section aria-label="Informations sur l'événement" className="bg-black p-8 border border-pm-gold/20 -mt-40 relative z-20 max-w-5xl mx-auto shadow-2xl shadow-pm-gold/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <InfoItem icon={CalendarIcon} title="Date" content="Samedi 27 Juillet 2024" />
                    <InfoItem icon={ClockIcon} title="Heure" content="10h - 17h" />
                    <InfoItem icon={MapPinIcon} title="Lieu" content="Ancien Sobraga, Libreville" />
                </div>
            </section>
            
            {/* Countdown Timer Section */}
            <section aria-labelledby="countdown-title" className="text-center">
                <h2 id="countdown-title" className="text-2xl font-playfair text-pm-gold mb-6">Le workshop commence dans...</h2>
                <CountdownTimer targetDate={workshopDate} />
            </section>

            {/* Modules Section */}
            <section aria-labelledby="modules-title">
              <h2 id="modules-title" className="text-4xl font-playfair text-pm-gold text-center mb-12">Modules de Formation</h2>
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {modules.map((module, index) => (
                  <div key={index} className="bg-black p-6 border-l-4 border-pm-gold">
                    <h3 className="text-xl font-bold text-pm-off-white">{module.name}</h3>
                    <p className="mt-2 text-pm-off-white/70">{module.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Benefits Section */}
            <section aria-labelledby="benefits-title" className="bg-black p-12 border-t border-b border-pm-gold/10">
                <h2 id="benefits-title" className="text-4xl font-playfair text-pm-gold text-center mb-12">Ce que vous obtiendrez</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-pm-dark p-8 border border-pm-gold/20 text-center flex flex-col items-center transition-all duration-300 hover:border-pm-gold hover:-translate-y-2 hover:shadow-xl hover:shadow-pm-gold/10">
                            <benefit.icon className="w-16 h-16 text-pm-gold mb-4" aria-hidden="true" />
                            <p className="text-lg font-semibold">{benefit.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Registration/CTA Section */}
            <section aria-labelledby="registration-title">
              <div className="max-w-3xl mx-auto bg-pm-gold text-pm-dark p-8 text-center shadow-lg shadow-pm-gold/30">
                <h2 id="registration-title" className="text-4xl font-playfair font-bold mb-4">Inscrivez-vous !</h2>
                <p className="text-xl font-semibold mb-2">Tarif unique : <span className="text-3xl font-bold">15.000 FCFA</span></p>
                <p className="mb-6 bg-pm-dark text-pm-gold font-bold inline-block px-3 py-1">Offre spéciale : 10.000 FCFA jusqu'au 20 Juillet !</p>
                
                <p className="text-lg mb-6">Les places sont limitées. Réservez la vôtre dès maintenant.</p>
                <a href="tel:+241074066461" className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-pm-dark text-pm-gold font-bold uppercase tracking-widest transition-transform duration-300 hover:scale-105">
                    <PhoneIcon className="w-6 h-6" aria-hidden="true" />
                    Contactez-nous : 074 06 64 61
                </a>
              </div>
            </section>
        </div>
        
        {/* Social Share Section */}
        <section aria-labelledby="share-title" className="pt-20">
            <div className="max-w-3xl mx-auto text-center border-t border-pm-gold/20 pt-12">
                <h2 id="share-title" className="text-2xl font-playfair text-pm-gold mb-6">Partagez l'événement</h2>
                <p className="text-pm-off-white/70 mb-8">
                    Aidez-nous à faire connaître cette opportunité unique. Partagez avec vos amis et sur vos réseaux !
                </p>
                <div className="flex justify-center items-center gap-8">
                    <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager sur Facebook">
                        <FacebookIcon className="w-8 h-8"/>
                    </a>
                    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager sur Twitter">
                        <TwitterIcon className="w-8 h-8"/>
                    </a>
                    <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager sur WhatsApp">
                        <WhatsAppIcon className="w-8 h-8"/>
                    </a>
                </div>
            </div>
        </section>

      </div>
      <BackToTopButton />
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

export default Activity;