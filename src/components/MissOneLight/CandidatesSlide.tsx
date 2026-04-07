import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, ChevronLeft, ChevronRight, Trophy, Medal, Award, User } from 'lucide-react';

interface Candidate {
  id: string;
  number: number;
  name: string;
  photo: string;
  votes: number;
  rank?: number;
  order: number;
}

interface Props {
  candidates: Candidate[];
  onVote: (candidateId: string) => void;
  votedCandidates: Set<string>;
}

const PAGE_SIZE = 4;
const AUTO_INTERVAL = 3500; // ms

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return (
    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-gradient-to-r from-[#FCD116] to-[#D4AF37] text-pm-dark px-2 py-0.5 rounded-lg shadow-lg">
      <Trophy size={10} />
      <span className="text-[9px] font-black uppercase tracking-tight">1er</span>
    </div>
  );
  if (rank === 2) return (
    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-900 px-2 py-0.5 rounded-lg shadow-lg">
      <Medal size={10} />
      <span className="text-[9px] font-black uppercase tracking-tight">2e</span>
    </div>
  );
  if (rank === 3) return (
    <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-2 py-0.5 rounded-lg shadow-lg">
      <Award size={10} />
      <span className="text-[9px] font-black uppercase tracking-tight">3e</span>
    </div>
  );
  if (rank <= 5) return (
    <div className="absolute top-2 left-2 z-20 bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-lg">
      <span className="text-[9px] font-black">Top {rank}</span>
    </div>
  );
  return (
    <div className="absolute top-2 left-2 z-20 bg-pm-dark/60 backdrop-blur-md text-white/50 px-2 py-0.5 rounded-lg">
      <span className="text-[9px] font-bold">#{rank}</span>
    </div>
  );
}

export default function CandidatesSlide({ candidates, onVote, votedCandidates }: Props) {
  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sort by rank (votes desc) — same order as the rest of the page
  const sorted = [...candidates].sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = page % totalPages;
  const visible = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);
  const maxVotes = Math.max(...candidates.map(c => c.votes), 1);

  const next = useCallback(() => setPage(p => (p + 1) % totalPages), [totalPages]);
  const prev = () => setPage(p => (p - 1 + totalPages) % totalPages);

  // Auto-advance
  useEffect(() => {
    if (paused || totalPages <= 1) return;
    timerRef.current = setInterval(next, AUTO_INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, totalPages, next]);

  // Reset page when candidates change (new data)
  useEffect(() => { setPage(0); }, [candidates.length]);

  return (
    <div className="w-full px-4 md:px-12 py-8 md:py-10 bg-pm-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="min-w-0">
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-[#009E60] mb-1 block">
            Classement en direct
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-playfair font-bold text-white leading-tight">
            Toutes les{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4]">
              Candidates
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-4">
          <button onClick={prev} aria-label="Précédent"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#FCD116]/60 transition-all active:scale-90">
            <ChevronLeft size={18} />
          </button>
          <span className="text-white/40 text-xs font-mono tabular-nums w-10 text-center">
            {safePage + 1}/{totalPages}
          </span>
          <button onClick={next} aria-label="Suivant"
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-[#FCD116]/60 transition-all active:scale-90">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {visible.map((candidate) => (
          <div key={candidate.id}
            className="group relative bg-white/5 border border-white/10 rounded-xl md:rounded-2xl overflow-hidden hover:border-[#FCD116]/30 transition-all duration-300 flex flex-col">

            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {candidate.photo
                ? <img src={candidate.photo} alt={candidate.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                : <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <User size={28} className="text-white/20" />
                  </div>
              }
              <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-transparent to-transparent opacity-70" />

              {/* Rank badge — top left */}
              {candidate.rank && <RankBadge rank={candidate.rank} />}

              {/* Passage number — top right */}
              <div className="absolute top-2 right-2 bg-pm-dark/70 backdrop-blur-md border border-white/20 rounded-lg w-9 h-9 md:w-10 md:h-10 flex flex-col items-center justify-center group-hover:bg-[#FCD116] group-hover:border-[#FCD116] transition-colors duration-300">
                <span className="text-[7px] font-black uppercase text-white/40 group-hover:text-pm-dark/60 leading-none">N°</span>
                <span className="text-sm font-black text-white group-hover:text-pm-dark leading-none">{candidate.order ?? candidate.number}</span>
              </div>
            </div>

            {/* Info */}
            <div className="p-3 md:p-4 flex flex-col flex-1">
              <h3 className="text-white font-playfair font-bold text-sm md:text-base truncate mb-2">
                {candidate.name}
              </h3>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] uppercase tracking-widest text-white/30">Votes</span>
                  <span className="text-[#FCD116] font-bold text-[10px]">{candidate.votes}</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#009E60] via-[#FCD116] to-[#3A75C4] h-full transition-all duration-700"
                    style={{ width: `${(candidate.votes / maxVotes) * 100}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => onVote(candidate.id)}
                disabled={votedCandidates.has(candidate.id)}
                aria-label={`Voter pour ${candidate.name}`}
                className={`mt-auto w-full py-2.5 rounded-xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  votedCandidates.has(candidate.id)
                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                    : 'bg-[#FCD116] text-pm-dark hover:bg-white shadow-md shadow-[#FCD116]/10'
                }`}
              >
                <Heart size={11} fill={votedCandidates.has(candidate.id) ? 'none' : 'currentColor'} />
                {votedCandidates.has(candidate.id) ? 'Voté' : 'Voter'}
              </button>
            </div>
          </div>
        ))}

        {/* Stable placeholders on last page (desktop only) */}
        {Array.from({ length: PAGE_SIZE - visible.length }).map((_, i) => (
          <div key={`ph-${i}`} className="rounded-2xl bg-white/[0.02] border border-white/5 aspect-[3/4] hidden lg:block" />
        ))}
      </div>

      {/* Dot pagination + auto-play indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} aria-label={`Page ${i + 1}`}
              className={`rounded-full transition-all ${i === safePage ? 'w-5 h-2 bg-[#FCD116]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
          <span className="ml-2 text-white/20 text-[9px] uppercase tracking-widest">
            {paused ? 'En pause' : 'Auto'}
          </span>
        </div>
      )}
    </div>
  );
}
