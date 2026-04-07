import { useState, useEffect } from 'react';
import { Heart, Users, Calendar, ChevronDown } from 'lucide-react';

interface HeroSlideProps {
  totalVotes: number;
  candidatesCount: number;
  onDiscover: () => void;
}

export default function HeroSlide({ totalVotes, candidatesCount, onDiscover }: HeroSlideProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const deadline = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      const diff = deadline.getTime() - now.getTime();
      if (diff > 0) {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        setTimeLeft(`${d}j ${h}h ${m}m`);
      } else {
        setTimeLeft('Terminé');
      }
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 md:py-24 overflow-hidden bg-pm-dark">
      {/* Top color bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4]" />

      {/* Glows */}
      <div className="absolute top-1/4 -left-20 w-72 md:w-96 h-72 md:h-96 bg-[#009E60]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 md:w-96 h-72 md:h-96 bg-[#3A75C4]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-4xl w-full">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FCD116] animate-ping" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-pm-gold">Événement Live</span>
        </div>

        {/* Title — scales from 3xl on mobile to 9xl on desktop */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-playfair font-bold text-white mb-4 leading-none">
          Miss{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4]">
            One Light
          </span>
        </h1>

        <p className="text-sm md:text-lg text-white/60 max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed px-2">
          Célébrons l'élégance et le talent. Votez pour la candidate qui incarne le mieux la lumière du Gabon.
        </p>

        {/* Stats — 3 cols on all sizes, compact on mobile */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#009E60]/10 text-[#009E60] mx-auto mb-2 md:mb-4">
              <Users size={16} className="md:hidden" />
              <Users size={24} className="hidden md:block" />
            </div>
            <p className="text-xl md:text-3xl font-playfair font-bold text-white mb-0.5">{candidatesCount}</p>
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40">Candidates</p>
          </div>

          <div className="bg-white/5 border border-[#FCD116]/30 rounded-2xl p-4 md:p-8">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#FCD116]/10 text-[#FCD116] mx-auto mb-2 md:mb-4">
              <Heart size={16} fill="currentColor" className="md:hidden" />
              <Heart size={24} fill="currentColor" className="hidden md:block" />
            </div>
            <p className="text-xl md:text-3xl font-playfair font-bold text-white mb-0.5">{totalVotes.toLocaleString()}</p>
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-[#FCD116]">Votes</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-8">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#3A75C4]/10 text-[#3A75C4] mx-auto mb-2 md:mb-4">
              <Calendar size={16} className="md:hidden" />
              <Calendar size={24} className="hidden md:block" />
            </div>
            <p className="text-lg md:text-3xl font-playfair font-bold text-white mb-0.5 leading-tight">{timeLeft}</p>
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40">Clôture</p>
          </div>
        </div>

        <button
          onClick={onDiscover}
          className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white text-pm-dark font-black text-[10px] md:text-xs uppercase tracking-widest rounded-full hover:bg-[#FCD116] transition-all active:scale-95"
        >
          Voir le classement
          <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
