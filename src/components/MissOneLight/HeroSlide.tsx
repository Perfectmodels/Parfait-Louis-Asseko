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
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24 overflow-hidden bg-pm-dark">
      {/* Top color bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4]" />

      {/* Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#009E60]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#3A75C4]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl w-full">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-[#FCD116] animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pm-gold">Événement Live</span>
        </div>

        <h1 className="text-6xl md:text-9xl font-playfair font-bold text-white mb-6 leading-none">
          Miss{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4]">
            One Light
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-16 leading-relaxed">
          Célébrons l'élégance et le talent. Votez pour la candidate qui incarne le mieux la lumière du Gabon.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#009E60]/10 text-[#009E60] mx-auto mb-4">
              <Users size={24} />
            </div>
            <p className="text-3xl font-playfair font-bold text-white mb-1">{candidatesCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Candidates</p>
          </div>

          <div className="bg-white/5 border border-[#FCD116]/30 rounded-3xl p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FCD116]/10 text-[#FCD116] mx-auto mb-4">
              <Heart size={24} fill="currentColor" />
            </div>
            <p className="text-3xl font-playfair font-bold text-white mb-1">{totalVotes.toLocaleString()}</p>
            <p className="text-[10px] uppercase tracking-widest text-[#FCD116]">Votes Totaux</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#3A75C4]/10 text-[#3A75C4] mx-auto mb-4">
              <Calendar size={24} />
            </div>
            <p className="text-3xl font-playfair font-bold text-white mb-1">{timeLeft}</p>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Clôture</p>
          </div>
        </div>

        <button
          onClick={onDiscover}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-pm-dark font-black text-xs uppercase tracking-widest rounded-full hover:bg-[#FCD116] transition-all"
        >
          Découvrir le classement
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
