import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
    CheckBadgeIcon, 
    ArrowLongRightIcon,
    SparklesIcon,
    GlobeAltIcon,
    TrophyIcon,
    ShieldCheckIcon,
    AcademicCapIcon
} from '@heroicons/react/24/outline';

const Agency: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse"></div></div>;
  }
  
  const { agencyInfo, modelDistinctions, agencyTimeline, siteImages } = data;

  const commitments = [
    {
      title: "Intégrité Absolue",
      description: "Nous garantissons une transparence totale dans la gestion des carrières et une éthique contractuelle stricte pour protéger nos talents.",
      icon: ShieldCheckIcon
    },
    {
      title: "Standard International",
      description: "Notre mission est d'élever les visages du Gabon aux sommets des exigences de la mode mondiale, sans compromis sur la qualité.",
      icon: GlobeAltIcon
    },
    {
      title: "Accompagnement Elite",
      description: "Plus qu'une agence, nous sommes un mentor. Nous investissons dans la formation continue et le bien-être psychologique de nos mannequins.",
      icon: AcademicCapIcon
    }
  ];

  return (
    <div className="bg-pm-dark overflow-x-hidden">
      <SEO title="Our Heritage | PMM Agency" description="Elite modeling agency in Gabon." />
      
      {/* 1. EDITORIAL HEADER */}
      <section className="relative pt-40 pb-20 px-6 sm:px-12 lg:px-20">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="section-label"
        >
          Since 2021
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-7xl md:text-[14rem] font-playfair font-black text-white leading-[0.85] tracking-tighter"
        >
          Built on <br/><span className="italic gold-gradient-text">Excellence</span>
        </motion.h1>
      </section>

      {/* 2. CORE NARRATIVE */}
      <section className="page-container flex flex-col lg:flex-row gap-32">
        <div className="lg:w-1/2">
           <div className="relative aspect-[3/4] overflow-hidden bg-pm-gray">
              <img src={siteImages.agencyHistory} alt="Heritage" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-10 left-10 text-[10rem] font-playfair font-black text-white/5 pointer-events-none">PMM</div>
           </div>
        </div>
        <div className="lg:w-1/2 space-y-16 lg:pt-32">
            <div className="space-y-8">
                <h2 className="text-4xl md:text-6xl font-playfair font-black italic">"Redefining the standards of African beauty."</h2>
                <div className="h-px w-24 bg-pm-gold"></div>
            </div>
            <div className="space-y-12 text-xl font-light leading-relaxed text-white/60 italic">
                <p>{agencyInfo.about.p1}</p>
                <p>{agencyInfo.about.p2}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 border-t border-white/5 pt-12">
                {agencyInfo.values.map(val => (
                    <div key={val.name} className="space-y-4">
                        <h3 className="text-pm-gold font-black uppercase tracking-[0.3em] text-[10px]">{val.name}</h3>
                        <p className="text-xs text-white/40 leading-relaxed uppercase tracking-widest">{val.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* 3. NOS ENGAGEMENTS */}
      <section className="bg-[#050505] py-40 border-y border-white/5">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-20">
          <div className="text-center mb-24">
            <span className="section-label">The Promise</span>
            <h2 className="text-6xl md:text-8xl font-playfair font-black italic">Nos Engagements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {commitments.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="group p-12 border border-white/5 bg-pm-dark hover:bg-pm-gold/[0.02] transition-all duration-700"
              >
                <div className="mb-10 inline-block">
                  <item.icon className="w-14 h-14 text-pm-gold/30 group-hover:text-pm-gold group-hover:scale-110 transition-all duration-700" strokeWidth={1} />
                </div>
                <h3 className="text-3xl font-playfair font-bold text-white mb-6 group-hover:text-pm-gold transition-colors">{item.title}</h3>
                <p className="text-white/40 leading-relaxed font-light group-hover:text-white/60 transition-colors">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TIMELINE */}
      <section className="py-40 overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-20 mb-24">
            <span className="section-label">Chronology</span>
            <h2 className="text-6xl font-playfair font-black">Our Journey</h2>
        </div>
        <div className="flex gap-8 overflow-x-auto px-6 lg:px-20 pb-12 no-scrollbar">
            {agencyTimeline.map((item, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex-shrink-0 w-[350px] p-10 glass-card"
                >
                    <span className="text-5xl font-playfair font-black text-pm-gold/20 block mb-6">{item.year}</span>
                    <p className="text-lg font-bold text-white leading-snug">{item.event}</p>
                    <div className="mt-8 flex justify-end">
                        <div className="w-10 h-[2px] bg-pm-gold/20"></div>
                    </div>
                </motion.div>
            ))}
        </div>
      </section>

      {/* 5. DISTINCTIONS */}
      <section className="page-container">
         <div className="text-center mb-32">
            <span className="section-label">Accolades</span>
            <h2 className="text-7xl font-playfair font-black italic">Distinctions</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
            {modelDistinctions.map((dist, idx) => (
                <div key={idx} className="p-12 border border-white/5 hover:bg-pm-gold/5 transition-all duration-700 text-center group">
                    <TrophyIcon className="w-12 h-12 text-pm-gold/20 mx-auto mb-10 group-hover:text-pm-gold group-hover:scale-110 transition-all duration-700" strokeWidth={1} />
                    <h3 className="text-2xl font-playfair font-bold text-white mb-6 leading-tight">{dist.name}</h3>
                    <ul className="space-y-2">
                        {dist.titles.map((t, i) => (
                            <li key={i} className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 group-hover:text-white/60 transition-colors">{t}</li>
                        ))}
                    </ul>
                </div>
            ))}
         </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="relative h-[80vh] flex items-center justify-center border-t border-white/5 overflow-hidden">
          <div className="absolute inset-0 bg-pm-dark">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-pm-gold rounded-full opacity-[0.02] blur-[150px] animate-glow"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6 space-y-16">
              <h2 className="text-6xl md:text-9xl font-playfair font-black italic">Ready to leave <br/><span className="gold-gradient-text">your mark</span>?</h2>
              <div className="flex flex-col sm:flex-row gap-12 justify-center">
                  <Link to="/contact" className="btn-premium">Contact the Agency</Link>
                  <Link to="/mannequins" className="btn-premium bg-white text-pm-dark border-none">View Talents</Link>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Agency;