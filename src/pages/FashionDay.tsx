import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, TicketIcon, XMarkIcon, UserGroupIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent } from '../types';
import Button from '../components/ui/Button';
import { MODEL_IMAGES } from '../constants/modelImages';

// --- Sub-Components ---

const Hero: React.FC<{ image: string, title?: string }> = ({ image, title = "Le Rendez-vous Mode" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={ref} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, backgroundImage: `url('${image}')` }} className="absolute inset-0 bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center px-4 max-w-5xl">
        <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8 }} className="block text-pm-gold uppercase tracking-[0.3em] font-bold mb-4">
          Perfect Fashion Day
        </motion.span>
        <motion.h1 initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="text-5xl md:text-7xl lg:text-8xl font-playfair text-white mb-6 leading-tight">
          {title}
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 1 }} className="text-xl text-gray-300 max-w-2xl mx-auto">
          La célébration ultime de l'élégance et de la créativité gabonaise.
        </motion.p>
      </div>
    </div>
  );
};

const InfoCard: React.FC<{ icon: any, title: string, content: string, delay: number }> = ({ icon: Icon, title, content, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
    className="bg-white/5 border border-white/10 p-8 text-center"
  >
    <Icon className="w-8 h-8 text-pm-gold mx-auto mb-4" />
    <h3 className="text-white font-playfair text-xl mb-2">{title}</h3>
    <p className="text-gray-400">{content}</p>
  </motion.div>
);

// --- Main Layout ---

const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fashionDayEvents = data?.fashionDayEvents || [];
  const sortedEvents = [...fashionDayEvents].sort((a, b) => {
    // Priority to edition 2 (Next Event), then descending
    if (a.edition === 2) return -1;
    if (b.edition === 2) return 1;
    return b.edition - a.edition;
  });

  useEffect(() => {
    if (sortedEvents.length > 0) {
      const nextEdition = sortedEvents.find(e => e.edition === 2);
      setSelectedEdition(nextEdition || sortedEvents[0]);
    }
  }, [fashionDayEvents]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!isInitialized || !selectedEdition) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" /></div>;
  }

  const isUpcoming = selectedEdition.edition === 2;

  return (
    <div className="bg-black text-white selection:bg-pm-gold selection:text-black">
      <SEO
        title={`Perfect Fashion Day | Édition ${selectedEdition.edition}`}
        description={`Découvrez le Perfect Fashion Day, l'événement mode de référence. Édition ${selectedEdition.edition} : ${selectedEdition.theme}.`}
        keywords="fashion day, mode gabon, défilé, createurs"
        image={data?.siteImages.fashionDayBg}
      />

      <Hero image={data?.siteImages.fashionDayBg || ''} />

      {/* Navigation / Edition Selector */}
      <div className="sticky top-20 z-30 bg-black/80 backdrop-blur border-y border-white/10 py-4">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex justify-center gap-6 min-w-max">
            {sortedEvents.map(event => (
              <button
                key={event.edition}
                onClick={() => setSelectedEdition(event)}
                className={`text-sm uppercase tracking-widest py-2 px-4 border-b-2 transition-colors ${selectedEdition.edition === event.edition
                  ? 'border-pm-gold text-white'
                  : 'border-transparent text-gray-500 hover:text-white'
                  }`}
              >
                Édition {event.edition}
                {event.edition === 2 && <span className="ml-2 text-[10px] bg-pm-gold text-black px-1.5 py-0.5 rounded font-bold">NEXT</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24">

        {/* Main Content */}
        <motion.div
          key={selectedEdition.edition} // Trigger animation on change
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-24"
        >

          {/* Header Info */}
          <div className="text-center max-w-4xl mx-auto">
            <span className="text-pm-gold uppercase tracking-widest text-sm font-bold block mb-4">
              {new Date(selectedEdition.date).getFullYear()}
            </span>
            <h2 className="text-4xl md:text-6xl font-playfair text-white mb-8">
              "{selectedEdition.theme}"
            </h2>
            <p className="text-xl text-gray-400 leading-relaxed mb-12">
              {selectedEdition.description}
            </p>

            {isUpcoming && (
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <Link to="/fashion-day/reservation">
                  <Button variant="primary" className="px-8 py-3" icon={<TicketIcon className="w-5 h-5" />}>Réserver</Button>
                </Link>
                <Link to="/fashion-day-application">
                  <Button variant="outline" className="px-8 py-3">Candidater</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Practical Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <InfoCard
              icon={CalendarDaysIcon}
              title="Date"
              content={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              delay={0}
            />
            <InfoCard
              icon={MapPinIcon}
              title="Lieu"
              content={selectedEdition.location || 'Secret'}
              delay={0.2}
            />
            <InfoCard
              icon={SparklesIcon}
              title="Vision"
              content="Excellence & Avant-Garde"
              delay={0.4}
            />
          </div>

          {/* Designers / Artists Section */}
          <div className="py-12 border-t border-white/10">
            <h3 className="text-3xl font-playfair text-white mb-12 text-center">Les Créateurs</h3>
            {(selectedEdition.stylists?.length || 0) > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {selectedEdition.stylists?.map((stylist, idx) => (
                  <div key={idx} className="group relative overflow-hidden bg-white/5 aspect-[4/5]">
                    {stylist.images?.[0] ? (
                      <img src={stylist.images[0]} alt={stylist.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-white/5 to-white/10 text-pm-gold p-6 text-center">
                        <span className="text-6xl font-playfair opacity-20 mb-4">{stylist.name.charAt(0)}</span>
                        <span className="uppercase tracking-widest text-xs font-bold opacity-50">Collection à venir</span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black to-transparent">
                      <h4 className="text-2xl font-playfair text-white">{stylist.name}</h4>
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">{stylist.description}</p>
                      {stylist.images && stylist.images.length > 0 && (
                        <button
                          onClick={() => setSelectedImage(stylist.images[0])}
                          className="mt-4 text-xs uppercase tracking-widest text-pm-gold hover:text-white transition-colors"
                        >
                          Voir Galerie
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-lg">
                <SparklesIcon className="w-12 h-12 text-pm-gold mx-auto mb-6 opacity-50" />
                <h4 className="text-2xl font-playfair text-white mb-2">Sélection en cours</h4>
                <p className="text-gray-400">Les créateurs de cette édition seront révélés très prochainement.</p>
              </div>
            )}
          </div>

          {/* Models Section (Edition 2) - Carousel */}
          {selectedEdition.edition === 2 && (
            <div className="py-12 border-t border-white/10 relative group/carousel">
              <h3 className="text-3xl font-playfair text-white mb-12 text-center">Les Mannequins</h3>

              {/* Controls */}
              <button
                aria-label="Previous slide"
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-pm-gold text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 -ml-4 md:ml-0"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>

              <button
                aria-label="Next slide"
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-pm-gold text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover/carousel:opacity-100 -mr-4 md:mr-0"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto gap-6 snap-x snap-mandatory no-scrollbar pb-8 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {Object.entries(MODEL_IMAGES).map(([key, url], idx) => (
                  <div
                    key={key}
                    className="flex-none h-64 md:h-96 w-auto snap-center group relative overflow-hidden cursor-pointer rounded-lg"
                    onClick={() => setSelectedImage(url)}
                  >
                    <img
                      src={url}
                      alt={`Mannequin ${key}`}
                      className="h-full w-auto block transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-pm-gold text-xs uppercase tracking-widest font-bold">
                          Modèle {key}
                        </span>
                        <span className="text-white bg-pm-gold/20 p-2 rounded-full">
                          <SparklesIcon className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Artists Section */}
          {(selectedEdition.artists?.length || 0) > 0 && (
            <div className="py-12 border-t border-white/10">
              <h3 className="text-3xl font-playfair text-white mb-12 text-center">Performances Artistiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {selectedEdition.artists?.map((artist, idx) => (
                  <div key={idx} className="bg-white/5 p-8 flex flex-col items-center text-center">
                    <h4 className="text-2xl font-playfair text-white mb-2">{artist.name}</h4>
                    <p className="text-gray-400">{artist.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing & Reservations */}
          {selectedEdition.pricingPackages && selectedEdition.pricingPackages.length > 0 && (
            <div className="py-24 border-t border-white/10">
              <h3 className="text-3xl font-playfair text-white mb-4 text-center">Tarifs & Réservations</h3>
              <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                Réservez votre table pour vivre cette expérience unique. Places limitées.
              </p>
              <div className="space-y-16">
                {selectedEdition.pricingPackages.map((pkg, idx) => (
                  <div key={idx}>
                    <h4 className="text-xl text-pm-gold uppercase tracking-widest font-bold mb-8 text-center border-b border-white/10 pb-4 inline-block mx-auto px-8">{pkg.category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {pkg.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="bg-white/5 border border-white/10 p-8 hover:border-pm-gold transition-all duration-300 relative group flex flex-col">
                          <div className="flex-grow">
                            <h5 className="text-2xl font-playfair text-white mb-4">{item.name}</h5>
                            <div className="text-sm text-gray-400 mb-6 flex items-center gap-2 bg-black/20 py-2 px-3 rounded-full w-fit">
                              <UserGroupIcon className="w-4 h-4 text-pm-gold" /> {item.capacity}
                            </div>
                            <p className="text-gray-300 mb-8 border-t border-white/10 pt-4 leading-relaxed">{item.contents}</p>
                          </div>
                          <div className="mt-auto">
                            <div className="text-3xl text-pm-gold font-bold mb-6">{item.price}</div>
                            <Link to="/fashion-day/reservation" className="block">
                              <button className="w-full py-3 border border-pm-gold text-pm-gold uppercase tracking-widest text-xs font-bold hover:bg-pm-gold hover:text-black transition-colors">
                                Choisir
                              </button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Pricing Notes */}
                <div className="text-center text-sm text-gray-500 space-y-2 italic border-t border-white/10 pt-8 max-w-2xl mx-auto">
                  <p>* Les tarifs incluent les boissons mentionnées sur la table.</p>
                  <p>* Réservation requise à l'avance.</p>
                  <p>* Places limitées - Premier arrivé, premier servi.</p>
                </div>
              </div>
            </div>
          )}

          {/* Partners */}
          <div className="text-center py-12 border-t border-white/10">
            <span className="text-gray-500 uppercase tracking-widest text-xs font-bold block mb-8">Partenaires Officiels</span>
            {(selectedEdition.partners?.length || 0) > 0 ? (
              <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {selectedEdition.partners?.map((partner, idx) => (
                  <div key={idx} className="text-center">
                    <span className="block text-xl md:text-2xl font-playfair text-white">{partner.name}</span>
                    <span className="text-xs text-pm-gold mt-1 uppercase tracking-wider">{partner.type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 bg-white/5 border border-white/10 rounded-lg max-w-3xl mx-auto">
                <p className="text-xl font-playfair text-white mb-4">Devenez Partenaire</p>
                <p className="text-gray-400 mb-6">Associez votre image à l'événement mode de l'année.</p>
                <Link to="/contact">
                  <Button variant="outline" className="px-6 py-2">Nous Contacter</Button>
                </Link>
              </div>
            )}
          </div>

        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={selectedImage}
              className="max-h-[85vh] max-w-full object-contain rounded-sm shadow-2xl"
            />
            <button aria-label="Close lightbox" className="absolute top-6 right-6 text-white hover:text-pm-gold transition-colors">
              <XMarkIcon className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default FashionDay;