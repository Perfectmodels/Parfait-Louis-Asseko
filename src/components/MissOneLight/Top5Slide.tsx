import { Heart, Trophy } from 'lucide-react';

interface Candidate {
  id: string;
  number: number;
  name: string;
  photo: string;
  votes: number;
  rank?: number;
}

interface Top5SlideProps {
  candidates: Candidate[];
  onVote: (candidateId: string) => void;
  votedCandidates: Set<string>;
  votingEnabled?: boolean;
}

export default function Top5Slide({ candidates, onVote, votedCandidates, votingEnabled = true }: Top5SlideProps) {
  const podium = [candidates[1], candidates[0], candidates[2]].filter(Boolean);
  const rest = candidates.slice(3, 5);

  const getRankGradient = (rank: number) => {
    if (rank === 1) return 'from-[#FCD116] to-[#D4AF37]';
    if (rank === 2) return 'from-slate-300 to-slate-500';
    if (rank === 3) return 'from-orange-400 to-orange-700';
    return 'from-white/10 to-white/5';
  };

  const getRankBorder = (rank: number) => {
    if (rank === 1) return 'border-[#FCD116]/50';
    if (rank === 2) return 'border-slate-400/50';
    if (rank === 3) return 'border-orange-500/50';
    return 'border-white/10';
  };

  return (
    <div className="relative px-4 md:px-12 py-8 md:py-10 bg-pm-dark">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#3A75C4]/5 blur-[150px] pointer-events-none" />

      {/* Title */}
      <div className="relative z-10 text-center mb-8 md:mb-12">
        <span className="text-pm-gold text-[9px] md:text-[10px] font-black tracking-[0.4em] uppercase mb-2 block">Fierté Nationale</span>
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-playfair font-bold text-white mb-2">
          Le <span className="text-[#FCD116]">Top 5</span> Direct
        </h2>
        <p className="text-white/40 text-xs md:text-sm max-w-xs mx-auto">
          Classement en temps réel.
        </p>
      </div>

      {/* Podium — tighter on mobile */}
      <div className="relative z-10 flex items-end justify-center gap-2 md:gap-8 mb-6 md:mb-10 w-full max-w-2xl mx-auto">
        {podium.map((candidate) => {
          const rank = candidate.rank ?? 0;
          const isWinner = rank === 1;
          return (
            <div key={candidate.id} className={`flex flex-col items-center ${isWinner ? 'w-[38%]' : 'w-[28%]'}`}>
              <div className="relative w-full mb-2 mt-6">
                {/* Rank badge */}
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${getRankGradient(rank)} flex items-center justify-center z-20 border-2 border-pm-dark shadow-lg`}>
                  {rank === 1
                    ? <Trophy size={14} className="text-pm-dark" />
                    : <span className="text-pm-dark font-black text-xs">{rank}</span>
                  }
                </div>

                {/* Number badge */}
                <div className="absolute top-2 left-2 z-20 bg-pm-dark/80 backdrop-blur-md border border-white/20 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full">
                  {candidate.number}
                </div>

                {/* Photo */}
                <div className={`relative rounded-xl md:rounded-2xl overflow-hidden border-2 ${getRankBorder(rank)} shadow-xl aspect-[3/4]`}>
                  {candidate.photo ? (
                    <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-2xl font-playfair">
                      {candidate.name[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-2 left-0 right-0 px-2 text-center">
                    <h3 className="text-white font-playfair font-bold text-[10px] md:text-sm truncate">{candidate.name}</h3>
                    <span className="text-[#FCD116] font-bold text-[9px] md:text-xs">{candidate.votes}</span>
                  </div>
                </div>

                {/* Vote button */}
                {votingEnabled ? (
                  <button
                    onClick={() => onVote(candidate.id)}
                    disabled={votedCandidates.has(candidate.id)}
                    className={`mt-2 w-full py-2 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                      votedCandidates.has(candidate.id)
                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                        : 'bg-white text-pm-dark hover:bg-[#FCD116]'
                    }`}
                  >
                    <Heart size={10} fill={votedCandidates.has(candidate.id) ? 'none' : 'currentColor'} />
                    {votedCandidates.has(candidate.id) ? 'Voté' : 'Voter'}
                  </button>
                ) : (
                  <div className="mt-2 w-full py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 font-bold text-[9px] md:text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5">
                    🔒 Votes fermés
                  </div>
                )}
              </div>

              {/* Podium base */}
              <div className={`w-full bg-white/5 border-x border-t border-white/10 rounded-t-xl ${
                rank === 1 ? 'h-16 md:h-24' : rank === 2 ? 'h-10 md:h-16' : 'h-6 md:h-10'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Ranks 4-5 */}
      {rest.length > 0 && (
        <div className="relative z-10 w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rest.map((candidate) => (
            <div key={candidate.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white/60 shrink-0">
                {candidate.rank}
              </div>
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                {candidate.photo
                  ? <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-playfair text-sm">{candidate.name[0]}</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-playfair font-bold text-sm truncate">{candidate.name}</h4>
                <span className="text-[9px] font-bold text-[#009E60] tracking-widest">{candidate.votes} Votes</span>
              </div>
              {votingEnabled ? (
                <button
                  onClick={() => onVote(candidate.id)}
                  disabled={votedCandidates.has(candidate.id)}
                  className={`p-2.5 rounded-xl transition-all shrink-0 active:scale-95 ${
                    votedCandidates.has(candidate.id)
                      ? 'bg-white/5 text-white/20'
                      : 'bg-white/10 text-white hover:bg-[#009E60]'
                  }`}
                >
                  <Heart size={14} fill={votedCandidates.has(candidate.id) ? 'currentColor' : 'none'} />
                </button>
              ) : (
                <div className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 text-[8px] font-bold uppercase">
                  Fermé
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
