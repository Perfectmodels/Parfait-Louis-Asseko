import React from 'react';
import { Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import { CalendarDaysIcon, ClockIcon, MapPinIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';

const Casting: React.FC = () => {
  const { data, isInitialized } = useData();
  const castingDate = "2025-09-06T14:00:00";
  
  if (!isInitialized || !data) {
    return <div className="h-screen bg-pm-dark flex items-center justify-center"><div className="w-12 h-px bg-pm-gold animate-pulse"></div></div>;
  }
  
  const { siteImages } = data;

  return (
    <div className="bg-pm-dark text-pm-off-white overflow-x-hidden">
      <SEO title="Become a Face of PMM | Casting" description="Elite scouting Gabonese faces." />

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5 }}
          className="absolute inset-0 bg-cover bg-center grayscale-[0.8] brightness-[0.4]"
          style={{ backgroundImage: `url('${siteImages.castingBg}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pm-dark/80 to-pm-dark"></div>
        
        <div className="relative z-10 text-center px-6 space-y-12">
           <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="section-label"
           >
              National Scouting Tour 2025
           </motion.span>
           <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="text-6xl md:text-[12rem] font-playfair font-black text-white leading-[0.8] tracking-tighter"
           >
              Find Your <br/><span className="italic gold-gradient-text">Spotlight</span>
           </motion.h1>
           <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="max-w-2xl mx-auto text-xl font-light italic text-white/50"
           >
              "We don't look for beauty, we look for presence. We don't find faces, we find icons."
           </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-12 lg:p-20 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="flex gap-12 border-l border-pm-gold/30 pl-12">
                <InfoItem icon={CalendarDaysIcon} label="When" value="6 Sept 2025" />
                <InfoItem icon={MapPinIcon} label="Where" value="Libreville, Gabon" />
            </div>
            <div className="scale-75 md:scale-100 origin-right">
                <CountdownTimer targetDate={castingDate} />
            </div>
        </div>
      </section>

      {/* REQUIREMENTS SECTION */}
      <section className="page-container grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
          <div className="space-y-20">
              <div className="space-y-8">
                  <span className="section-label">Criteria</span>
                  <h2 className="text-6xl font-playfair font-black leading-tight italic">Who are we <br/>looking for?</h2>
                  <p className="text-xl text-white/40 leading-relaxed font-light">Diversity is our strength. We are scouting for runway talents, editorial faces, and commercial models.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-16">
                  <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold pb-4 border-b border-white/10">Female Requirements</h3>
                      <ul className="space-y-4 text-sm font-bold text-white/60">
                          <li>16 - 28 Years Old</li>
                          <li>Minimum 170cm</li>
                          <li>Waist: 60 - 66cm</li>
                          <li>Hips: 90 - 96cm</li>
                      </ul>
                  </div>
                  <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-pm-gold pb-4 border-b border-white/10">Male Requirements</h3>
                      <ul className="space-y-4 text-sm font-bold text-white/60">
                          <li>18 - 30 Years Old</li>
                          <li>Minimum 180cm</li>
                          <li>Athletic Build</li>
                      </ul>
                  </div>
              </div>
          </div>

          <div className="glass-card p-16 space-y-12">
              <h3 className="text-3xl font-playfair font-black italic">The Dress Code</h3>
              <p className="text-sm text-white/40 leading-relaxed">Please arrive ready to work. No makeup, simple styling.</p>
              <div className="space-y-8">
                  <CheckListItem text="Black tank top" />
                  <CheckListItem text="Black slim jeans" />
                  <CheckListItem text="Heels (Female) / Dress shoes (Male)" />
                  <CheckListItem text="Clean skin & natural hair" />
              </div>
              <div className="pt-12">
                  <Link to="/casting-formulaire" className="btn-premium w-full !py-6">Start Online Pre-Selection</Link>
              </div>
          </div>
      </section>

      {/* CTA BOTTOM */}
      <section className="py-40 bg-white text-pm-dark text-center overflow-hidden relative">
          <div className="relative z-10 space-y-12 max-w-5xl mx-auto px-6">
             <h2 className="text-7xl md:text-9xl font-playfair font-black italic">It's your time to shine.</h2>
             <p className="text-xl font-bold uppercase tracking-[0.3em] opacity-40">Apply today and join the elite squad.</p>
             <Link to="/casting-formulaire" className="btn-premium !bg-pm-dark !text-pm-gold !border-none !px-20 !py-8 text-sm">Apply Now</Link>
          </div>
          <div className="absolute -top-10 -left-10 text-[20rem] font-playfair font-black text-black/[0.03] select-none pointer-events-none">2025</div>
      </section>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">{label}</span>
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-pm-gold" />
            <span className="text-xl font-playfair font-bold text-white">{value}</span>
        </div>
    </div>
);

const CheckListItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center gap-4">
        <div className="w-6 h-6 rounded-full border border-pm-gold/30 flex items-center justify-center shrink-0">
            <CheckCircleIcon className="w-4 h-4 text-pm-gold" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-white/80">{text}</span>
    </div>
);

export default Casting;