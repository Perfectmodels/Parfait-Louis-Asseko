import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import CountdownTimer from '../components/CountdownTimer';
import { ArrowLongRightIcon, TicketIcon, ChevronLeftIcon, ChevronRightIcon, PhotoIcon, PlayIcon } from '@heroicons/react/24/outline';
import { GalleryAlbum, GalleryItem } from '../types';
import { useFirebaseCollection } from '../hooks/useFirebaseCollection';

const Home: React.FC = () => {
  const { data, isInitialized } = useData();
  const { items: albums } = useFirebaseCollection<GalleryAlbum>('galleryAlbums', { orderBy: 'createdAt' });
  const { items: galleryItems } = useFirebaseCollection<GalleryItem>('gallery', { orderBy: 'createdAt' });
  const galleryTrackRef = useRef<HTMLDivElement>(null);
  const articlesTrackRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (dir: 'left' | 'right') =>
    galleryTrackRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });
  const scrollArticles = (dir: 'left' | 'right') =>
    articlesTrackRef.current?.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' });

  if (!isInitialized || !data) {
    return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse"></div></div>;
  }

  const { agencyInfo, models, siteImages, agencyServices, fashionDayEvents } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);

  const nextEvent = fashionDayEvents
    .filter(e => new Date(e.date).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  return (
    <div className="bg-pm-dark overflow-x-hidden">
      <SEO title="Agence de Mannequins à Libreville, Gabon" description="Redéfinir l'élégance gabonaise." image={siteImages.hero} />

      {/* 1. CINEMATIC HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 2.5, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center grayscale-[0.5]"
            style={{ backgroundImage: `url('${siteImages.hero}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pm-dark/60 via-transparent to-pm-dark"></div>
        
        <div className="relative z-10 text-center px-6">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="section-label"
          >
            Depuis 2021 • Libreville
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.7, ease: "circOut" }}
            className="text-[22vw] sm:text-[18vw] md:text-[14rem] font-playfair font-black text-white leading-none tracking-tighter opacity-10 mix-blend-overlay select-none pointer-events-none"
          >
            PMM
          </motion.h1>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-base sm:text-xl md:text-4xl font-light tracking-[0.08em] sm:tracking-[0.1em] uppercase mt-4 text-pm-gold italic"
          >
            L'Excellence <span className="font-playfair font-black lowercase text-white tracking-normal">en</span> Mouvement
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="mt-10 sm:mt-16 flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center items-center"
          >
             <Link to="/mannequins" className="btn-premium">Voir nos Mannequins</Link>
             <Link to="/agence" className="text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.4em] font-black flex items-center gap-3 sm:gap-4 group text-white/60 hover:text-white transition-colors">
                Notre Histoire 
                <ArrowLongRightIcon className="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:translate-x-3 text-pm-gold" />
             </Link>
          </motion.div>
        </div>

        {/* EVENT BANNER (Countdown) */}
        {nextEvent && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2, duration: 1.2, ease: "circOut" }}
                className="absolute bottom-0 left-0 right-0 z-30 bg-black/40 backdrop-blur-2xl border-t border-white/5"
            >
                <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-4 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-8">
                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden sm:flex w-14 h-14 rounded-full border border-pm-gold/20 items-center justify-center text-pm-gold">
                            <TicketIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-pm-gold">Perfect Fashion Day</h3>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-1 font-bold">Edition {nextEvent.edition} • {nextEvent.theme}</p>
                        </div>
                    </div>
                    <div className="scale-90 lg:scale-100 origin-center">
                        <CountdownTimer targetDate={nextEvent.date} />
                    </div>
                    <Link to="/fashion-day-application" className="btn-premium !py-3 !px-6 sm:!px-8 !text-[9px] bg-pm-gold text-pm-dark border-none shadow-[0_0_40px_rgba(212,175,55,0.15)]">
                        Obtenir mon Pass
                    </Link>
                </div>
            </motion.div>
        )}
      </section>

      {/* 2. MANIFESTO (EDITORIAL STYLE) */}
      <section className="page-container flex flex-col lg:flex-row gap-12 sm:gap-20 lg:gap-32 items-center">
         <div className="lg:w-1/2 relative">
            <span className="section-label">Manifeste</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-playfair font-black leading-[1] italic">
              "Le futur n'est pas <br/> <span className="gold-gradient-text">attendu</span>,<br/> il est créé."
            </h2>
            <div className="absolute -top-10 -left-10 text-[12rem] sm:text-[20rem] font-playfair font-black text-white/[0.02] select-none pointer-events-none">241</div>
         </div>
         <div className="lg:w-1/2 space-y-8 sm:space-y-12">
            <p className="text-lg sm:text-2xl font-light leading-relaxed text-white/50 italic">
              {agencyInfo.about.p1}
            </p>
            <div className="grid grid-cols-2 gap-8 sm:gap-16 pt-8 sm:pt-10 border-t border-white/5">
                <div>
                   <span className="text-4xl sm:text-6xl font-playfair font-bold text-pm-gold">04</span>
                   <p className="text-[10px] uppercase tracking-[0.3em] mt-3 sm:mt-4 font-black text-white/30">Ans de Prestige</p>
                </div>
                <div>
                   <span className="text-4xl sm:text-6xl font-playfair font-bold text-pm-gold">50+</span>
                   <p className="text-[10px] uppercase tracking-[0.3em] mt-3 sm:mt-4 font-black text-white/30">Talents Découverts</p>
                </div>
            </div>
         </div>
      </section>

      {/* 3. NEW TALENTS (ASYMMETRIC GRID) */}
      <section className="bg-white/[0.02] py-20 sm:py-32 lg:py-40">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-24 gap-6 sm:gap-8">
                <div>
                   <span className="section-label">Nos Talents</span>
                   <h2 className="text-4xl sm:text-5xl md:text-7xl font-playfair font-black italic">Nouveaux Visages</h2>
                </div>
                <Link to="/mannequins" className="btn-premium shrink-0">Voir tous les Talents</Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
              {publicModels.map((model, idx) => (
                <div key={model.id} className={idx % 2 !== 0 ? 'lg:translate-y-20' : ''}>
                    <ModelCard model={model} />
                </div>
              ))}
            </div>
        </div>
      </section>

      {/* 4. SERVICES (EDITORIAL BLOCKS) */}
      <section className="page-container">
         <div className="text-center mb-16 sm:mb-32">
            <span className="section-label">Nos Compétences</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-playfair font-black italic">Nos Services</h2>
         </div>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
            {agencyServices.slice(0, 4).map(service => (
                <ServiceCard key={service.slug} service={service} />
            ))}
         </div>
      </section>

      {/* 5. IMMERSIVE CALL TO ACTION */}
      <section className="relative min-h-[60vh] sm:h-[90vh] flex items-center justify-center overflow-hidden border-t border-white/5">
          <div className="absolute inset-0 bg-pm-dark">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-pm-gold rounded-full opacity-[0.03] blur-[120px] animate-glow"></div>
          </div>
          <div className="relative z-10 text-center max-w-5xl px-4 sm:px-6 space-y-8 sm:space-y-12 py-20">
              <h2 className="text-4xl sm:text-5xl md:text-8xl font-playfair font-black italic leading-tight text-white">Prêt à devenir <br/> <span className="gold-gradient-text">Inoubliable</span> ?</h2>
              <p className="text-sm sm:text-xl text-white/30 font-black tracking-[0.3em] sm:tracking-[0.5em] uppercase">Candidatures Ouvertes • Saison 2025</p>
              <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center pt-4 sm:pt-8">
                  <Link to="/casting-formulaire" className="btn-premium bg-white text-pm-dark border-none">Rejoindre l'Agence</Link>
                  <Link to="/contact" className="btn-premium">Devenir Partenaire</Link>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;