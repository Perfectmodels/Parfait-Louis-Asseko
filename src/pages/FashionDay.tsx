import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  SparklesIcon, 
  UserGroupIcon, 
  MicrophoneIcon, 
  XMarkIcon,
  ArrowLongRightIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent } from '../types';

const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  
  // 1. Filtrage strict pour éviter les doublons de données
  const fashionDayEvents = useMemo(() => {
    if (!data?.fashionDayEvents) return [];
    const unique = new Map();
    data.fashionDayEvents.forEach(event => {
      if (!unique.has(event.edition)) {
        unique.set(event.edition, event);
      }
    });
    return Array.from(unique.values()).sort((a, b) => b.edition - a.edition);
  }, [data?.fashionDayEvents]);

  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (fashionDayEvents.length > 0 && !selectedEdition) {
      setSelectedEdition(fashionDayEvents[0]);
    }
  }, [fashionDayEvents, selectedEdition]);

  if (!isInitialized || !data) {
    return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse"></div></div>;
  }

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white overflow-x-hidden">
      <SEO 
        title="Perfect Fashion Day | Editorial Experience" 
        description="L'événement mode majeur au Gabon."
        image={data.siteImages.fashionDayBg}
      />

      {/* BACKGROUND DECORATION */}
      <div className="fixed top-0 right-0 p-20 text-[25vw] font-playfair font-black text-white/[0.02] pointer-events-none select-none leading-none">
        PFD
      </div>

      <div className="page-container relative z-10">
        <header className="mb-24">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="section-label"
          >
            Runway • Culture • Art
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-playfair font-black italic mt-4"
          >
            Perfect Fashion Day
          </motion.h1>
        </header>

        {/* EDITION SELECTOR - LUXURY PILLS */}
        <nav className="flex flex-wrap gap-8 mb-20 border-b border-white/5 pb-8">
          {fashionDayEvents.map((event) => (
            <button
              key={event.edition}
              onClick={() => setSelectedEdition(event)}
              className={`relative py-2 text-xs font-bold uppercase tracking-[0.4em] transition-all duration-500 ${
                selectedEdition?.edition === event.edition ? 'text-pm-gold' : 'text-white/30 hover:text-white'
              }`}
            >
              Édition {String(event.edition).padStart(2, '0')}
              {selectedEdition?.edition === event.edition && (
                <motion.div 
                  layoutId="activeEdition"
                  className="absolute -bottom-8 left-0 right-0 h-0.5 bg-pm-gold" 
                />
              )}
            </button>
          ))}
        </nav>

        <AnimatePresence mode="wait">
          {selectedEdition && (
            <motion.div
              key={selectedEdition.edition}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "circOut" }}
              className="space-y-32"
            >
              {/* HERO OF EDITION */}
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-6xl font-playfair font-black leading-tight">
                    "{selectedEdition.theme}"
                  </h2>
                  <p className="text-xl text-white/60 font-light leading-relaxed">
                    {selectedEdition.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-8">
                    <InfoBlock icon={MapPinIcon} label="Location" value={selectedEdition.location || "TBA"} />
                    <InfoBlock icon={CalendarDaysIcon} label="Timeline" value={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} />
                  </div>
                </div>
                <div className="relative group aspect-[4/5] overflow-hidden bg-pm-gray">
                   <img 
                    src={selectedEdition.stylists?.[0]?.images?.[0] || data.siteImages.fashionDayBg} 
                    className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
                    alt="Main visual"
                   />
                   <div className="absolute inset-0 bg-pm-gold/10 mix-blend-overlay"></div>
                </div>
              </section>

              {/* STYLISTS - EDITORIAL GRID */}
              {selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
                <section>
                  <div className="flex justify-between items-end mb-16">
                    <div>
                      <span className="section-label">Showcase</span>
                      <h3 className="text-5xl font-playfair font-black">Les Créateurs</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 px-4 md:px-0">
                    {selectedEdition.stylists.map((stylist, idx) => (
                      <div 
                        key={stylist.name}
                        className={`group relative h-[500px] overflow-hidden bg-pm-gray ${idx % 2 !== 0 ? 'md:translate-y-12' : ''}`}
                      >
                        <img 
                          src={stylist.images?.[0]} 
                          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                          alt={stylist.name}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                          <h4 className="text-3xl font-playfair font-black text-white">{stylist.name}</h4>
                          <p className="text-[10px] uppercase tracking-widest text-pm-gold mt-2 font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            {stylist.description}
                          </p>
                          <div className="mt-6 flex gap-2 overflow-x-auto no-scrollbar">
                            {stylist.images?.slice(1, 4).map((img, i) => (
                              <button 
                                key={i} 
                                onClick={() => setSelectedImage(img)}
                                className="w-12 h-12 rounded-full border border-white/20 overflow-hidden flex-shrink-0 hover:border-pm-gold transition-colors"
                              >
                                <img src={img} className="w-full h-full object-cover" alt="prev" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* CALL TO ACTION EDITION 2 */}
              {selectedEdition.edition === 2 && (
                <section className="relative py-32 px-12 bg-pm-gold text-pm-dark overflow-hidden">
                   <div className="relative z-10 max-w-4xl mx-auto text-center space-y-12">
                      <h3 className="text-5xl md:text-7xl font-playfair font-black italic">Incarnez la Révélation.</h3>
                      <p className="text-xl font-medium max-w-2xl mx-auto opacity-80 italic">
                        "L'art de se révéler" n'est pas qu'un thème, c'est une invitation à transformer votre talent en icône mondiale.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link to="/fashion-day-application" className="px-12 py-5 bg-pm-dark text-pm-gold font-black uppercase tracking-widest text-sm transition-all hover:bg-white hover:text-pm-dark">
                          Candidature Talent
                        </Link>
                        <Link to="/contact" className="px-12 py-5 border-2 border-pm-dark font-black uppercase tracking-widest text-sm hover:bg-pm-dark hover:text-pm-gold transition-all">
                          Devenir Partenaire
                        </Link>
                      </div>
                   </div>
                   <div className="absolute -bottom-20 -right-20 text-[30rem] font-playfair font-black opacity-5 select-none pointer-events-none">2</div>
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* LIGHTBOX */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-pm-dark/95 z-[200] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button className="absolute top-10 right-10 text-pm-gold hover:text-white transition-colors">
            <XMarkIcon className="w-12 h-12" />
          </button>
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            src={selectedImage} 
            className="max-w-full max-h-[85vh] object-contain shadow-2xl shadow-black"
            alt="Expanded view" 
          />
        </div>
      )}
    </div>
  );
};

const InfoBlock: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-full border border-pm-gold/20 flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-pm-gold" />
    </div>
    <div>
      <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 block mb-1">{label}</span>
      <span className="text-lg font-playfair font-bold text-white">{value}</span>
    </div>
  </div>
);

export default FashionDay;