import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, MicrophoneIcon, XMarkIcon, ClockIcon, TicketIcon, UsersIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent } from '../types';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  const fashionDayEvents = data?.fashionDayEvents || [];
  
  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);

  // Calcul du temps restant avant le prochain événement
  useEffect(() => {
    if (!selectedEdition) return;
    
    const eventDate = new Date(selectedEdition.date);
    const timer = setInterval(() => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [selectedEdition]);

  useEffect(() => {
    if (fashionDayEvents.length > 0) {
      setSelectedEdition(fashionDayEvents[0]);
    }
  }, [fashionDayEvents]);

  useEffect(() => {
    if (selectedImage) {
        prevActiveElement.current = document.activeElement as HTMLElement;
        setTimeout(() => {
            modalRef.current?.focus();
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setSelectedImage('');
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                prevActiveElement.current?.focus();
            };
        }, 100);
    }
  }, [selectedImage]);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  if (fashionDayEvents.length === 0 || !selectedEdition) {
    return <div className="min-h-screen flex items-center justify-center">Aucun événement à afficher.</div>;
  }

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="pt-24 pb-12"
      >
        <SEO 
          title="Perfect Fashion Day | L'Événement Mode de Référence"
          description="Vibrez au rythme du Perfect Fashion Day, l'événement mode incontournable à Libreville. Revivez les éditions, découvrez les créateurs gabonais et les moments forts qui célèbrent la mode africaine."
          keywords="perfect fashion day, défilé de mode gabon, événement mode libreville, créateurs gabonais, mode africaine, fashion week gabon"
          image={data?.siteImages.fashionDayBg}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-pm-gold mb-4"
            >
              Perfect Fashion Day
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-pm-off-white/80 max-w-3xl mx-auto leading-relaxed"
            >
              Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise.
            </motion.p>
          </div>

          {/* Edition Selector */}
          <motion.div 
            variants={itemVariants}
            className="mb-16 px-4 sm:px-6 lg:px-8"
          >
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4" role="group" aria-label="Sélection de l'édition">
              {fashionDayEvents.map(event => (
                <motion.button
                  key={event.edition}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedEdition(event)}
                  aria-pressed={selectedEdition.edition === event.edition}
                  className={`px-5 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-wider rounded-full transition-all duration-300 transform ${
                    selectedEdition.edition === event.edition 
                      ? 'bg-pm-gold text-pm-dark shadow-lg shadow-pm-gold/30' 
                      : 'bg-pm-dark/70 border border-pm-gold/30 text-pm-gold hover:bg-pm-gold/10 hover:border-pm-gold/70 hover:text-white backdrop-blur-sm'
                  }`}
                >
                  <span className="font-semibold">Édition {event.edition}</span>
                  <span className="ml-1.5 opacity-90">({event.date.split(' ').pop()})</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Event Details */}
          <div className="bg-pm-darker/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-10 mb-16 border border-pm-gold/10 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedEdition.edition}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-8"
              >
                <div className="text-center">
                  <motion.h2 
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-pm-gold mb-3 leading-tight"
                  >
                    {selectedEdition.theme}
                  </motion.h2>
                  <p className="text-pm-gold/80 text-sm sm:text-base font-medium tracking-wider mb-6">
                    {selectedEdition.date}
                  </p>
                  <div className="w-24 h-1 bg-gradient-to-r from-pm-gold/30 via-pm-gold to-pm-gold/30 mx-auto my-6 rounded-full"></div>
                  <p className="text-pm-off-white/90 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto">
                    {selectedEdition.description}
                  </p>
                  
                  {/* Compteur pour le prochain événement */}
                  <div className="mt-12 bg-gradient-to-r from-pm-gold/5 to-pm-gold/10 p-6 rounded-2xl border border-pm-gold/20">
                    <h3 className="text-2xl font-playfair font-bold text-pm-gold text-center mb-6">
                      Prochaine édition dans...
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                      <div className="text-center p-4 bg-pm-dark/30 rounded-lg">
                        <div className="text-3xl font-bold text-pm-gold">{timeLeft.days}</div>
                        <div className="text-sm text-pm-off-white/80 mt-1">Jours</div>
                      </div>
                      <div className="text-center p-4 bg-pm-dark/30 rounded-lg">
                        <div className="text-3xl font-bold text-pm-gold">{timeLeft.hours}</div>
                        <div className="text-sm text-pm-off-white/80 mt-1">Heures</div>
                      </div>
                      <div className="text-center p-4 bg-pm-dark/30 rounded-lg">
                        <div className="text-3xl font-bold text-pm-gold">{timeLeft.minutes}</div>
                        <div className="text-sm text-pm-off-white/80 mt-1">Minutes</div>
                      </div>
                      <div className="text-center p-4 bg-pm-dark/30 rounded-lg">
                        <div className="text-3xl font-bold text-pm-gold">{timeLeft.seconds}</div>
                        <div className="text-sm text-pm-off-white/80 mt-1">Secondes</div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                      <button className="flex items-center justify-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors duration-300">
                        <TicketIcon className="w-5 h-5" />
                        <span>Réserver ma place</span>
                      </button>
                      <button className="flex items-center justify-center gap-2 px-6 py-3 border border-pm-gold text-pm-gold font-semibold rounded-full hover:bg-pm-gold/10 transition-colors duration-300">
                        <UsersIcon className="w-5 h-5" />
                        <span>Devenir partenaire</span>
                      </button>
                    </div>
                  </div>
                </div>
            
                {selectedEdition.location && (
                  <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-12 p-6 bg-pm-dark/40 rounded-xl border border-pm-gold/10"
                  >
                    <InfoPill 
                      icon={CalendarDaysIcon} 
                      title="Date" 
                      content={selectedEdition.date} 
                    />
                    <InfoPill 
                      icon={MapPinIcon} 
                      title="Lieu" 
                      content={selectedEdition.location} 
                    />
                    <div className="sm:col-span-2 lg:col-span-1">
                      <InfoPill 
                        icon={SparklesIcon} 
                        title="Promoteur" 
                        content={selectedEdition.promoter || 'Parfait Asseko'} 
                      />
                    </div>
                  </motion.div>
                )}
                
                {selectedEdition.edition === 2 && (
                  <motion.div 
                    variants={itemVariants}
                    className="relative my-16 p-8 md:p-12 rounded-2xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/5 to-pm-gold/10 backdrop-blur-sm rounded-2xl border border-pm-gold/20"></div>
                    <div className="relative z-10 text-center">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-pm-gold mb-6">
                        Rejoignez l'Aventure de l'Édition 2
                      </h3>
                      <p className="text-pm-off-white/90 text-base sm:text-lg max-w-4xl mx-auto mb-8 leading-relaxed">
                        Pour cette nouvelle édition, nous recherchons des talents visionnaires pour donner vie au thème "L'Art de Se Révler". Que vous soyez mannequin, styliste, partenaire, photographe ou que vous ayez un autre talent à partager, nous vous invitons à rejoindre cette célébration de la mode.
                      </p>
                      <div className="mt-10">
                        <Link 
                          to="/fashion-day-application" 
                          className="group relative inline-flex items-center px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-wider text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-pm-gold/30 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold/50"
                        >
                          <span className="relative z-10">Participer à l'événement</span>
                          <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Artists & Models Section */}
                {selectedEdition.artists && selectedEdition.featuredModels && (
                  <motion.div 
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16 py-12 border-t border-b border-pm-gold/10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pm-gold/10 rounded-lg">
                          <MicrophoneIcon className="w-6 h-6 text-pm-gold" aria-hidden="true"/>
                        </div>
                        <h3 className="text-2xl font-playfair font-bold text-pm-gold">Artistes en Live</h3>
                      </div>
                      <div className="space-y-4">
                        {selectedEdition.artists.map((artist, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-pm-dark/30 rounded-lg hover:bg-pm-dark/50 transition-colors duration-300">
                            <div className="w-10 h-10 rounded-full bg-pm-gold/10 flex items-center justify-center flex-shrink-0">
                              <SparklesIcon className="w-5 h-5 text-pm-gold"/>
                            </div>
                            <p className="text-pm-off-white/90">{artist}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-pm-gold/10 rounded-lg">
                          <UserGroupIcon className="w-6 h-6 text-pm-gold" aria-hidden="true"/>
                        </div>
                        <h3 className="text-2xl font-playfair font-bold text-pm-gold">Mannequins Vedettes</h3>
                      </div>
                      <p className="text-pm-off-white/90 pl-2">
                        {selectedEdition.featuredModels.join(', ')} et toute la 
                        <span className="text-pm-gold font-medium"> Perfect Models Squad</span>.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Stylists Gallery */}
                {selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="mt-20"
                  >
                    <div className="text-center mb-12">
                      <h3 className="inline-block text-3xl font-playfair font-bold text-pm-gold relative">
                        Stylistes Participants
                        <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pm-gold to-transparent"></span>
                      </h3>
                    </div>
                    <div className="space-y-12">
                      {selectedEdition.stylists.map((stylist) => (
                        <div 
                          key={stylist.name} 
                          className="bg-pm-darker/30 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-pm-gold/10 shadow-lg hover:border-pm-gold/20 transition-all duration-300"
                        >
                          <div className="text-center mb-8">
                            <h4 className="text-2xl md:text-3xl font-playfair font-bold text-pm-gold mb-2">
                              {stylist.name}
                            </h4>
                            <p className="text-pm-off-white/80 max-w-3xl mx-auto">
                              {stylist.description}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                            {stylist.images.map((img, idx) => (
                              <motion.button
                                key={idx}
                                whileHover={{ scale: 1.02, zIndex: 10 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedImage(img)}
                                aria-label={`Agrandir l'image de la création ${idx + 1} de ${stylist.name}`}
                                className="relative aspect-square block bg-black/50 group overflow-hidden rounded-lg border border-pm-gold/10 hover:border-pm-gold/40 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:ring-offset-2 focus:ring-offset-pm-dark/80"
                              >
                                <img
                                  src={img}
                                  alt={`${stylist.name} - création ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                  <span className="text-xs text-white/90 font-medium">
                                    Voir en grand
                                  </span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Partners Section */}
                {/* Section Galerie Vidéo */}
                <motion.div 
                  variants={itemVariants}
                  className="mt-20"
                >
                  <div className="text-center mb-12">
                    <h3 className="inline-block text-3xl font-playfair font-bold text-pm-gold relative">
                      Galerie Vidéo
                      <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pm-gold to-transparent"></span>
                    </h3>
                    <p className="mt-4 text-pm-off-white/80 max-w-2xl mx-auto">
                      Revivez les moments forts des précédentes éditions à travers nos vidéos exclusives.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      {
                        id: 'video1',
                        title: 'Best Of - Édition 2023',
                        thumbnail: '/images/thumbnails/video1.jpg',
                        duration: '2:45',
                        views: '24K vues'
                      },
                      {
                        id: 'video2',
                        title: 'Défilé de clôture',
                        thumbnail: '/images/thumbnails/video2.jpg',
                        duration: '4:12',
                        views: '18K vues'
                      },
                      {
                        id: 'video3',
                        title: 'Backstage - Les coulisses',
                        thumbnail: '/images/thumbnails/video3.jpg',
                        duration: '3:28',
                        views: '32K vues'
                      },
                      {
                        id: 'video4',
                        title: 'Interviews des créateurs',
                        thumbnail: '/images/thumbnails/video4.jpg',
                        duration: '5:15',
                        views: '15K vues'
                      }
                    ].map((video, index) => (
                      <motion.div 
                        key={video.id}
                        className="group relative rounded-xl overflow-hidden bg-pm-darker/30 hover:bg-pm-darker/50 transition-all duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="relative aspect-video">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-pm-gold/10 group-hover:bg-transparent transition-colors duration-300 flex items-center justify-center">
                            <button 
                              className="w-16 h-16 bg-pm-gold/80 hover:bg-pm-gold rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:scale-110"
                              aria-label={`Lire la vidéo : ${video.title}`}
                            >
                              <svg className="w-8 h-8 text-pm-darker" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                              </svg>
                            </button>
                          </div>
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-pm-off-white group-hover:text-pm-gold transition-colors duration-300">
                            {video.title}
                          </h4>
                          <div className="flex items-center mt-2 text-sm text-pm-off-white/60">
                            <span>{video.views}</span>
                            <span className="mx-2">•</span>
                            <span>Il y a 2 semaines</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {selectedEdition.partners && selectedEdition.partners.length > 0 && (
                  <motion.div 
                    variants={itemVariants}
                    className="mt-20"
                  >
                    <div className="text-center mb-12">
                      <h3 className="inline-block text-3xl font-playfair font-bold text-pm-gold relative">
                        Partenaires & Sponsors
                        <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pm-gold to-transparent"></span>
                      </h3>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 px-4">
                      {selectedEdition.partners.map((p, index) => (
                        <motion.div 
                          key={p.name} 
                          className="group relative p-4 rounded-xl hover:bg-pm-darker/30 transition-colors duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                        >
                          <p className="text-pm-gold/80 text-xs sm:text-sm font-medium mb-1 sm:mb-2 text-center">
                            {p.type.toUpperCase()}
                          </p>
                          <p className="text-xl sm:text-2xl font-bold tracking-wide text-center text-pm-off-white group-hover:text-white transition-colors duration-300">
                            {p.name}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={modalRef}
            tabIndex={-1}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedImage('')}
            role="dialog"
            aria-modal="true"
            aria-label="Vue agrandie de l'image"
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-pm-gold transition-colors z-10" 
              aria-label="Fermer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage('');
              }}
            >
              <XMarkIcon className="w-8 h-8"/>
            </button>
            <motion.div 
              className="relative max-w-5xl max-h-[90vh] w-full mx-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img 
                src={selectedImage} 
                alt="Vue agrandie" 
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-pm-gold/20 mx-auto" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface InfoPillProps {
  icon: React.ElementType;
  title: string;
  content: string;
}

const InfoPill: React.FC<InfoPillProps> = ({ icon: Icon, title, content }) => (
  <div className="flex items-start sm:items-center gap-4 p-4 bg-pm-dark/40 hover:bg-pm-dark/60 rounded-xl transition-colors duration-300 h-full">
    <div className="p-2.5 bg-pm-gold/10 rounded-lg text-pm-gold">
      <Icon className="w-6 h-6" aria-hidden="true"/>
    </div>
    <div className="flex-1">
      <span className="text-sm font-medium text-pm-gold/90 block mb-0.5">{title}</span>
      <span className="text-base font-medium text-pm-off-white block">{content}</span>
    </div>
  </div>
);

export default FashionDay;
