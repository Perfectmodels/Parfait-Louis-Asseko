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
}

export default function Top5Slide({ candidates, onVote, votedCandidates }: Top5SlideProps) {
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
    <div className="relative px-6 md:px-12 py-10 bg-pm-dark">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#3A75C4]/5 blur-[150px] pointer-events-none" />

      {/* Title */}
      <div className="relative z-10 text-center mb-16">
        <span className="text-pm-gold text-[10px] font-black tracking-[0.5em] uppercase mb-4 block">Fierté Nationale</span>
        <h2 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-4">
          Le <span className="text-[#FCD116]">Top 5</span> Direct
        </h2>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          Le classement évolue en temps réel selon vos votes.
        </p>
      </div>

      {/* Podium */}
      <div className="relative z-10 flex items-end justify-center gap-4 md:gap-8 mb-16 w-full max-w-5xl mx-auto">
        {podium.map((candidate) => {
          const rank = candidate.rank ?? 0;
          const isWinner = rank === 1;
          return (
            <div
              key={candidate.id}
              className={`flex flex-col items-center ${isWinner ? 'w-[38%]' : 'w-[28%]'}`}
            >
              {/* Card */}
              <div className="relative w-full mb-4 mt-8">
                {/* Rank badge */}
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br ${getRankGradient(rank)} flex items-center justify-center z-20 border-2 border-pm-dark shadow-lg`}>
                  {rank === 1
                    ? <Trophy size={18} className="text-pm-dark" />
                    : <span className="text-pm-dark font-black text-sm">{rank}</span>
                  }
                </div>

                {/* Number badge */}
                <div className="absolute top-3 left-3 z-20 bg-pm-dark/80 backdrop-blur-md border border-white/20 text-white font-black text-xs px-2 py-1 rounded-full">
                  <span className="text-[9px] text-white/40">NO.</span>{candidate.number}
                </div>

                {/* Photo */}
                <div className={`relative rounded-2xl overflow-hidden border-2 ${getRankBorder(rank)} shadow-2xl ${isWinner ? 'aspect-[3/4]' : 'aspect-[3/4]'}`}>
                  {candidate.photo ? (
                    <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-4xl font-playfair">
                      {candidate.name[0]}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-4 left-0 right-0 px-4 text-center">
                    <h3 className="text-white font-playfair font-bold text-sm md:text-base mb-1 truncate">{candidate.name}</h3>
                    <span className="text-[#FCD116] font-bold text-xs tracking-widest">{candidate.votes} VOTES</span>
                  </div>
                </div>

                {/* Vote button */}
                <button
                  onClick={() => onVote(candidate.id)}
                  disabled={votedCandidates.has(candidate.id)}
                  className={`mt-3 w-full py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                    votedCandidates.has(candidate.id)
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-white text-pm-dark hover:bg-[#FCD116]'
                  }`}
                >
                  <Heart size={12} fill={votedCandidates.has(candidate.id) ? 'none' : 'currentColor'} />
                  {votedCandidates.has(candidate.id) ? 'Voté' : 'Voter'}
                </button>
              </div>

              {/* Podium base */}
              <div className={`w-full bg-white/5 border-x border-t border-white/10 rounded-t-2xl flex items-center justify-center ${
                rank === 1 ? 'h-24' : rank === 2 ? 'h-16' : 'h-10'
              }`} />
            </div>
          );
        })}
      </div>

      {/* Ranks 4-5 */}
      {rest.length > 0 && (
        <div className="relative z-10 w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {rest.map((candidate) => (
            <div key={candidate.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 hover:border-[#009E60]/30 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white/60 shrink-0">
                {candidate.rank}
              </div>
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0">
                {candidate.photo
                  ? <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-playfair">{candidate.name[0]}</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-playfair font-bold truncate">{candidate.name}</h4>
                <span className="text-[10px] font-bold text-[#009E60] tracking-widest">{candidate.votes} Votes</span>
              </div>
              <button
                onClick={() => onVote(candidate.id)}
                disabled={votedCandidates.has(candidate.id)}
                className={`p-3 rounded-xl transition-all shrink-0 ${
                  votedCandidates.has(candidate.id)
                    ? 'bg-white/5 text-white/20'
                    : 'bg-white/10 text-white hover:bg-[#009E60]'
                }`}
              >
                <Heart size={16} fill={votedCandidates.has(candidate.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

