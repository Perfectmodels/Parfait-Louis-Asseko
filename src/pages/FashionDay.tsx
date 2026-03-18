import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, XMarkIcon, ArrowLongRightIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent } from '../types';
import Marquee from '../components/icons/Marquee';

const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();

  const fashionDayEvents = useMemo(() => {
    if (!data?.fashionDayEvents) return [];
    const unique = new Map();
    data.fashionDayEvents.forEach(e => { if (!unique.has(e.edition)) unique.set(e.edition, e); });
    return Array.from(unique.values()).sort((a, b) => b.edition - a.edition);
  }, [data?.fashionDayEvents]);

  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeStylist, setActiveStylist] = useState<number>(0);

  useEffect(() => {
    if (fashionDayEvents.length > 0 && !selectedEdition) setSelectedEdition(fashionDayEvents[0]);
  }, [fashionDayEvents, selectedEdition]);

  // Reset stylist index on edition change
  useEffect(() => { setActiveStylist(0); }, [selectedEdition]);

  if (!isInitialized || !data) {
    return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse" /></div>;
  }

  const heroImage = selectedEdition?.stylists?.[activeStylist]?.images?.[0]
    || selectedEdition?.stylists?.[0]?.images?.[0]
    || data.siteImages.fashionDayBg;

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white overflow-x-hidden">
      <SEO title="Perfect Fashion Day" description="L'événement mode majeur au Gabon — Perfect Fashion Day." image={data.siteImages.fashionDayBg} />

      {/* ── HERO IMMERSIF ─────────────────────────────────────────── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/40 to-transparent" />

        {/* Edition switcher en overlay */}
        <div className="relative z-10 w-full px-6 lg:px-20 pb-16">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label">
            Runway • Culture • Art
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-[12rem] font-playfair font-black italic leading-none mt-2 mb-10"
          >
            PFD
          </motion.h1>

          {/* Pills éditions */}
          <div className="flex flex-wrap gap-3">
            {fashionDayEvents.map(event => (
              <button
                key={event.edition}
                onClick={() => setSelectedEdition(event)}
                className={`relative px-6 py-3 text-[10px] font-black uppercase tracking-[0.4em] border transition-all duration-500 ${
                  selectedEdition?.edition === event.edition
                    ? 'bg-pm-gold text-pm-dark border-pm-gold'
                    : 'bg-transparent text-white/50 border-white/10 hover:border-white/40 hover:text-white'
                }`}
              >
                Édition {String(event.edition).padStart(2, '0')}
                {selectedEdition?.edition === event.edition && (
                  <span className="ml-3 text-pm-dark/60 italic font-normal normal-case tracking-normal">
                    {event.theme}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENU PAR ÉDITION ───────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {selectedEdition && (
          <motion.div
            key={selectedEdition.edition}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: 'circOut' }}
          >
            {/* ── INFO ÉDITION ── */}
            <section className="page-container grid grid-cols-1 lg:grid-cols-3 gap-16 border-b border-white/5 pb-24">
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <span className="section-label">Édition {String(selectedEdition.edition).padStart(2, '0')}</span>
                  <h2 className="text-5xl md:text-7xl font-playfair font-black italic mt-2 leading-tight">
                    "{selectedEdition.theme}"
                  </h2>
                </div>
                <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl">
                  {selectedEdition.description}
                </p>
              </div>
              <div className="space-y-8 lg:pt-16">
                <InfoBlock icon={CalendarDaysIcon} label="Date"
                  value={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <InfoBlock icon={MapPinIcon} label="Lieu" value={selectedEdition.location || 'À confirmer'} />
                {selectedEdition.promoter && (
                  <InfoBlock icon={UserGroupIcon} label="Promoteur" value={selectedEdition.promoter} />
                )}
              </div>
            </section>

            {/* ── STYLISTES — sélecteur + galerie ── */}
            {selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
              <section className="bg-[#080808] py-24">
                <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
                  <div className="mb-16">
                    <span className="section-label">Showcase</span>
                    <h3 className="text-5xl font-playfair font-black">Les Créateurs</h3>
                  </div>

                  {/* Tabs stylistes */}
                  <div className="flex flex-wrap gap-2 mb-12 border-b border-white/5 pb-8">
                    {selectedEdition.stylists.map((s, idx) => (
                      <button
                        key={s.name}
                        onClick={() => setActiveStylist(idx)}
                        className={`px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                          activeStylist === idx
                            ? 'text-pm-dark bg-pm-gold'
                            : 'text-white/40 hover:text-white border border-white/5 hover:border-white/20'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>

                  {/* Galerie du styliste actif */}
                  <AnimatePresence mode="wait">
                    {selectedEdition.stylists[activeStylist] && (
                      <motion.div
                        key={activeStylist}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                          <h4 className="text-3xl font-playfair font-black italic text-white">
                            {selectedEdition.stylists[activeStylist].name}
                          </h4>
                          <p className="text-white/40 font-light md:pt-2">
                            {selectedEdition.stylists[activeStylist].description}
                          </p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1">
                          {selectedEdition.stylists[activeStylist].images?.map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedImage(img)}
                              className={`overflow-hidden bg-pm-gray group ${i === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'}`}
                            >
                              <img
                                src={img}
                                alt={`${selectedEdition.stylists![activeStylist].name} ${i + 1}`}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 grayscale-[0.3]"
                              />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {/* ── MANNEQUINS — bannière défilante ── */}
            {selectedEdition.featuredModels && selectedEdition.featuredModels.length > 0 && (
              <section className="py-20 border-y border-white/5 overflow-hidden">
                <div className="max-w-[1800px] mx-auto px-6 lg:px-20 mb-10">
                  <span className="section-label">On the Runway</span>
                  <h3 className="text-4xl font-playfair font-black">Les Mannequins</h3>
                </div>
                <Marquee
                  items={selectedEdition.featuredModels}
                  duration={28}
                  itemClassName="text-3xl md:text-4xl font-playfair font-black italic text-white/50 hover:text-white transition-colors cursor-default"
                  separator={<span className="mx-10 text-pm-gold">◆</span>}
                />
              </section>
            )}

            {/* ── ARTISTES ── */}
            {selectedEdition.artists && selectedEdition.artists.length > 0 && (
              <section className="page-container">
                <div className="mb-16">
                  <span className="section-label">Performances</span>
                  <h3 className="text-5xl font-playfair font-black">Les Artistes</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  {selectedEdition.artists.map((artist, idx) => (
                    <div key={idx} className="group border border-white/5 p-10 hover:bg-white/[0.02] transition-all duration-500">
                      <h4 className="text-2xl font-playfair font-bold text-white mb-3 group-hover:text-pm-gold transition-colors">{artist.name}</h4>
                      <p className="text-white/40 font-light leading-relaxed">{artist.description}</p>
                      {artist.images && artist.images.length > 0 && (
                        <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar">
                          {artist.images.slice(0, 5).map((img, i) => (
                            <button key={i} onClick={() => setSelectedImage(img)}
                              className="w-14 h-14 rounded-full overflow-hidden border border-white/10 hover:border-pm-gold transition-colors flex-shrink-0">
                              <img src={img} className="w-full h-full object-cover" alt={artist.name} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── PARTENAIRES — bannière défilante ── */}
            {selectedEdition.partners && selectedEdition.partners.length > 0 && (
              <section className="py-20 border-y border-white/5 overflow-hidden bg-[#080808]">
                <div className="max-w-[1800px] mx-auto px-6 lg:px-20 mb-10">
                  <span className="section-label">They Believe in Us</span>
                  <h3 className="text-4xl font-playfair font-black">Partenaires</h3>
                </div>
                <Marquee
                  items={selectedEdition.partners.map(p => p.name)}
                  renderItem={(name, i) => {
                    const p = selectedEdition.partners![i % selectedEdition.partners!.length];
                    return (
                      <span className="flex flex-col items-center gap-1.5 px-4">
                        <span className="text-[8px] uppercase tracking-[0.5em] font-black text-pm-gold/40">{p?.type}</span>
                        <span className="text-xl md:text-2xl font-playfair font-black text-white/60 hover:text-white transition-colors">{name}</span>
                      </span>
                    );
                  }}
                  duration={22}
                  separator={<span className="mx-12 text-white/10 text-2xl font-thin">|</span>}
                />
              </section>
            )}

            {/* ── CTA ÉDITION À VENIR ── */}
            {new Date(selectedEdition.date) > new Date() && (
              <section className="relative py-40 overflow-hidden bg-pm-gold text-pm-dark">
                <div className="relative z-10 max-w-4xl mx-auto text-center px-6 space-y-10">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-50">
                    {new Date(selectedEdition.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="text-5xl md:text-8xl font-playfair font-black italic leading-tight">
                    Incarnez la Révélation.
                  </h3>
                  <p className="text-xl font-light max-w-xl mx-auto opacity-70 italic">
                    "{selectedEdition.theme}" — rejoignez l'aventure.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
                    <Link to="/fashion-day-application"
                      className="px-12 py-5 bg-pm-dark text-pm-gold font-black uppercase tracking-widest text-sm hover:bg-white hover:text-pm-dark transition-all">
                      Candidature Talent
                    </Link>
                    <Link to="/contact"
                      className="px-12 py-5 border-2 border-pm-dark font-black uppercase tracking-widest text-sm hover:bg-pm-dark hover:text-pm-gold transition-all">
                      Devenir Partenaire
                    </Link>
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-10 text-[30rem] font-playfair font-black opacity-[0.04] select-none pointer-events-none leading-none">
                  {selectedEdition.edition}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[200] flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
              <XMarkIcon className="w-10 h-10" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              src={selectedImage}
              className="max-w-full max-h-[88vh] object-contain shadow-2xl"
              alt="Vue agrandie"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoBlock: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="w-10 h-10 rounded-full border border-pm-gold/20 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-pm-gold" />
    </div>
    <div>
      <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 block mb-1">{label}</span>
      <span className="font-playfair font-bold text-white leading-snug">{value}</span>
    </div>
  </div>
);

export default FashionDay;
