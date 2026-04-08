import { useState, useEffect } from 'react';
import { Heart, Users, Calendar, ChevronDown } from 'lucide-react';

interface HeroSlideProps {
  totalVotes: number;
  candidatesCount: number;
  onDiscover: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function HeroSlide({ totalVotes, candidatesCount, onDiscover }: HeroSlideProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      // Finale le 17 avril 2026 à 20h00 (heure du Gabon UTC+1)
      const deadline = new Date(2026, 3, 17, 20, 0, 0); // Month is 0-indexed: 3 = April
      const diff = deadline.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsFinished(false);
      } else {
        setIsFinished(true);
      }
    };
    update();
    const id = setInterval(update, 1000);
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

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-[#3A75C4]/10 text-[#3A75C4] mx-auto mb-2 md:mb-3">
              <Calendar size={16} className="md:hidden" />
              <Calendar size={24} className="hidden md:block" />
            </div>
            {isFinished ? (
              <p className="text-lg md:text-2xl font-playfair font-bold text-white mb-0.5 leading-tight text-center">🎉 Finale !</p>
            ) : (
              <div className="flex gap-2 md:gap-3 justify-center">
                <div className="text-center">
                  <span className="countdown font-mono text-xl md:text-3xl text-white">
                    <span style={{ '--value': timeLeft.days } as React.CSSProperties} aria-live="polite">{timeLeft.days}</span>
                  </span>
                  <p className="text-[7px] md:text-[9px] uppercase tracking-widest text-white/40 mt-0.5">j</p>
                </div>
                <div className="text-center">
                  <span className="countdown font-mono text-xl md:text-3xl text-white">
                    <span style={{ '--value': timeLeft.hours } as React.CSSProperties} aria-live="polite">{timeLeft.hours}</span>
                  </span>
                  <p className="text-[7px] md:text-[9px] uppercase tracking-widest text-white/40 mt-0.5">h</p>
                </div>
                <div className="text-center">
                  <span className="countdown font-mono text-xl md:text-3xl text-white">
                    <span style={{ '--value': timeLeft.minutes } as React.CSSProperties} aria-live="polite">{timeLeft.minutes}</span>
                  </span>
                  <p className="text-[7px] md:text-[9px] uppercase tracking-widest text-white/40 mt-0.5">m</p>
                </div>
                <div className="text-center">
                  <span className="countdown font-mono text-xl md:text-3xl text-[#FCD116]">
                    <span style={{ '--value': timeLeft.seconds } as React.CSSProperties} aria-live="polite">{timeLeft.seconds}</span>
                  </span>
                  <p className="text-[7px] md:text-[9px] uppercase tracking-widest text-white/40 mt-0.5">s</p>
                </div>
              </div>
            )}
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-white/40 mt-1 text-center">17 avril 20h</p>
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

      {/* DaisyUI Countdown Animation Styles */}
      <style>{`
        .countdown {
          display: inline-flex;
          overflow: hidden;
        }
        .countdown > * {
          display: inline-block;
          transition: all 0.3s ease;
        }
        @keyframes countdown-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .countdown span {
          animation: countdown-bounce 1s ease infinite;
          animation-delay: calc(var(--value) * 0.1s);
        }
      `}</style>
    </div>
  );
}
