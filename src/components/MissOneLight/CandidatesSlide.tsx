import { useState } from 'react';
import { Heart, Search } from 'lucide-react';

interface Candidate {
  id: string;
  number: number;
  name: string;
  photo: string;
  votes: number;
  rank?: number;
  order: number;
}

interface CandidatesSlideProp {
  candidates: Candidate[];
  onVote: (candidateId: string) => void;
  votedCandidates: Set<string>;
}

export default function CandidatesSlide({ candidates, onVote, votedCandidates }: CandidatesSlideProp) {
  const [searchTerm, setSearchTerm] = useState('');

  // Sort by order of passage
  const sorted = [...candidates].sort((a, b) => (a.order ?? a.number) - (b.order ?? b.number));

  const filtered = sorted.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.number.toString().includes(searchTerm)
  );

  const maxVotes = Math.max(...candidates.map((c) => c.votes), 1);

  return (
    <div className="w-full px-6 md:px-12 pt-10 pb-10 bg-pm-dark relative">

      {/* Header */}
      <div className="relative z-10 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#009E60] mb-3 block">Ordre de passage</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white">
            Toutes les <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4]">Candidates</span>
          </h2>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-pm-gold transition-colors" size={16} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pm-gold/50 text-sm"
          />
        </div>
      </div>

      {/* Vertical list */}
      <div className="relative z-10 flex flex-col gap-3">
        {filtered.map((candidate) => (
          <div
            key={candidate.id}
            className="group flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#FCD116]/30 hover:bg-white/[0.07] transition-all duration-300"
          >
            {/* Passage number — very prominent left column */}
            <div className="shrink-0 w-20 md:w-24 self-stretch flex flex-col items-center justify-center bg-white/5 border-r border-white/10 group-hover:bg-[#FCD116]/10 transition-colors">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 group-hover:text-[#FCD116]/60 transition-colors">Passage</span>
              <span className="text-3xl md:text-4xl font-playfair font-black text-white group-hover:text-[#FCD116] transition-colors leading-none">
                {candidate.order ?? candidate.number}
              </span>
            </div>

            {/* Photo */}
            <div className="shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10">
              {candidate.photo
                ? <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 font-playfair text-xl">{candidate.name[0]}</div>
              }
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 py-3">
              <div className="flex items-center gap-2 mb-1">
                {candidate.rank && candidate.rank <= 3 && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#FCD116]/20 text-[#FCD116]">
                    Top {candidate.rank}
                  </span>
                )}
              </div>
              <h3 className="text-white font-playfair font-bold text-base md:text-lg truncate">{candidate.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex-1 bg-white/5 rounded-full h-1 overflow-hidden max-w-[160px]">
                  <div
                    className="bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4] h-full transition-all duration-1000"
                    style={{ width: `${(candidate.votes / maxVotes) * 100}%` }}
                  />
                </div>
                <span className="text-[#FCD116] font-bold text-xs tracking-widest shrink-0">{candidate.votes} votes</span>
              </div>
            </div>

            {/* Vote button */}
            <div className="shrink-0 pr-4">
              <button
                onClick={() => onVote(candidate.id)}
                disabled={votedCandidates.has(candidate.id)}
                aria-label={`Voter pour ${candidate.name}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  votedCandidates.has(candidate.id)
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-[#FCD116] text-pm-dark hover:bg-white active:scale-95 shadow-lg shadow-[#FCD116]/10'
                }`}
              >
                <Heart size={12} fill={votedCandidates.has(candidate.id) ? 'none' : 'currentColor'} />
                <span className="hidden sm:inline">{votedCandidates.has(candidate.id) ? 'Voté' : 'Voter'}</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Search className="text-white/5 mb-3" size={36} />
            <p className="text-white/20 text-sm">Aucune candidate trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
}
