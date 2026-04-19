import { useState, useEffect } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue } from 'firebase/database';
import { Trophy, Users, Award, Flag } from 'lucide-react';
import SEO from '../components/SEO';
import { STAGE_LABELS, STAGE_ORDER, STAGE_COLORS, type ContestStage } from './AdminBeautyContest';

interface Contest { id: string; name: string; description: string; date: string; location: string; status: string; currentStage: ContestStage; createdAt?: string; }
interface Candidate { id: string; order: number; name: string; photo: string; bio: string; status: string; }
interface ScoringCriteria { id: string; passageId?: string; label: string; weight: number; order: number; }
interface Passage { id: string; order: number; name: string; description: string; }
interface Score { id: string; juryId: string; candidateId: string; passageId: string; scores: Record<string,number>; }

const RTDB_BASE = 'beautyContests';
const stagePath = (cid: string, stage: ContestStage) => `${RTDB_BASE}/${cid}/stages/${stage}`;

// ── Per-contest live view ─────────────────────────────────────────────────
function ContestView({ contest }: { contest: Contest }) {
  const [activeStage, setActiveStage] = useState<ContestStage>(contest.currentStage || 'preselection');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [criteria, setCriteria] = useState<ScoringCriteria[]>([]);
  const [passages, setPassages] = useState<Passage[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [view, setView] = useState<'ranking' | 'grid'>('ranking');

  useEffect(() => {
    const sp = stagePath(contest.id, activeStage);
    const u: (()=>void)[] = [];
    u.push(onValue(ref(rtdb, `${sp}/candidates`), (snap) => {
      const d = snap.val();
      if (d) { const l: Candidate[] = Object.entries(d).map(([id,v]:any)=>({id,...v})); setCandidates(l.filter(c=>c.status!=='hidden').sort((a,b)=>a.order-b.order)); }
      else setCandidates([]);
    }));
    u.push(onValue(ref(rtdb, `${sp}/criteria`), (snap) => {
      const d = snap.val();
      if (d) { const l: ScoringCriteria[] = Object.entries(d).map(([id,v]:any)=>({id,...v})); setCriteria(l.sort((a,b)=>a.order-b.order)); }
      else setCriteria([]);
    }));
    u.push(onValue(ref(rtdb, `${sp}/passages`), (snap) => {
      const d = snap.val();
      if (d) { const l: Passage[] = Object.entries(d).map(([id,v]:any)=>({id,...v})); setPassages(l.sort((a,b)=>a.order-b.order)); }
      else setPassages([]);
    }));
    u.push(onValue(ref(rtdb, `${sp}/scores`), (snap) => {
      const d = snap.val();
      setScores(d ? Object.entries(d).map(([id,v]:any)=>({id,...v})) : []);
    }));
    return () => u.forEach(f=>f());
  }, [contest.id, activeStage]);

  // Compute average for a candidate — aggregate across all jury scores, anonymised
  const getAvg = (candidateId: string): number | null => {
    const cs = scores.filter(s => s.candidateId === candidateId);
    if (!cs.length || !criteria.length) return null;
    const totalWeight = criteria.reduce((s,c)=>s+c.weight,0) || 1;
    const juryAvgs = cs.map(s => criteria.reduce((sum,cr)=>sum+(s.scores[cr.id]??0)*cr.weight,0)/totalWeight);
    return juryAvgs.reduce((a,b)=>a+b,0)/juryAvgs.length;
  };

  // Per-criteria average (anonymised — no jury names)
  const getCriteriaAvg = (candidateId: string, criteriaId: string): number | null => {
    const vals = scores.filter(s=>s.candidateId===candidateId).map(s=>s.scores[criteriaId]??0);
    return vals.length ? vals.reduce((a,b)=>a+b,0)/vals.length : null;
  };

  const ranked = [...candidates].sort((a,b) => {
    const avgA = getAvg(a.id) ?? -1;
    const avgB = getAvg(b.id) ?? -1;
    return avgB - avgA;
  });

  const hasScores = scores.length > 0 && criteria.length > 0;
  const currentStageIdx = STAGE_ORDER.indexOf(contest.currentStage || 'preselection');
  return (
    <div className='space-y-8'>
      {/* Stage selector */}
      <div className='flex items-center gap-2 flex-wrap'>
        <span className='text-white/30 text-xs uppercase tracking-widest mr-1 flex items-center gap-1'><Flag size={10}/>Étape :</span>
        {STAGE_ORDER.map((stage, i) => {
          const accessible = i <= currentStageIdx;
          return (
            <button key={stage} onClick={() => accessible && setActiveStage(stage)} disabled={!accessible}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border flex items-center gap-2 ${
                stage === activeStage
                  ? STAGE_COLORS[stage] + ' ring-2 ring-offset-1 ring-offset-pm-dark'
                  : accessible
                  ? 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                  : 'bg-white/5 border-white/5 text-white/15 cursor-not-allowed'
              }`}
            >
              {stage === contest.currentStage && <span className='w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse'/>}
              {STAGE_LABELS[stage]}
              {stage === contest.currentStage && <span className='text-[9px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full font-black'>En cours</span>}
            </button>
          );
        })}
      </div>

      {/* View toggle */}
      <div className='flex gap-2'>
        <button onClick={()=>setView('ranking')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view==='ranking'?'bg-pm-gold text-pm-dark':'bg-white/10 text-white/60 hover:bg-white/20'}`}><Trophy size={14}/>Classement</button>
        <button onClick={()=>setView('grid')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${view==='grid'?'bg-pm-gold text-pm-dark':'bg-white/10 text-white/60 hover:bg-white/20'}`}><Users size={14}/>Candidates</button>
      </div>

      {/* ── RANKING VIEW ── */}
      {view === 'ranking' && (
        <div className='space-y-3'>
          {candidates.length === 0 && <p className='text-white/30 text-center py-16 border border-white/10 rounded-2xl'>Aucune candidate pour la {STAGE_LABELS[activeStage]}.</p>}
          {ranked.map((c, i) => {
            const avg = getAvg(c.id);
            const medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':null;
            return (
              <div key={c.id} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                i===0?'border-yellow-500/40 bg-yellow-500/5':i===1?'border-gray-400/20 bg-white/5':i===2?'border-amber-700/20 bg-white/5':'border-white/10 bg-white/5'
              }`}>
                <div className='text-2xl font-black w-10 text-center shrink-0'>
                  {medal || <span className='text-white/30 text-lg font-bold'>{i+1}</span>}
                </div>
                {c.photo
                  ? <img src={c.photo} alt={c.name} className='h-16 w-16 object-cover rounded-2xl shrink-0'/>
                  : <div className='h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-white/30 text-2xl font-bold shrink-0'>{c.name[0]}</div>
                }
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <p className='text-white font-bold text-lg'>#{c.order} {c.name}</p>
                    {c.status==='winner' && <span className='text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold'>🏆 Gagnante</span>}
                  </div>
                  {c.bio && <p className='text-white/40 text-sm mt-1 line-clamp-1'>{c.bio}</p>}
                  {/* Per-criteria averages — no jury names shown */}
                  {hasScores && avg !== null && criteria.length > 0 && (
                    <div className='flex flex-wrap gap-x-4 gap-y-1 mt-2'>
                      {criteria.filter(cr=>!cr.passageId).map(cr => {
                        const crAvg = getCriteriaAvg(c.id, cr.id);
                        return crAvg !== null ? (
                          <span key={cr.id} className='text-xs text-white/40'>{cr.label}: <span className='text-white/70 font-semibold'>{crAvg.toFixed(1)}/10</span></span>
                        ) : null;
                      })}
                    </div>
                  )}
                  {/* Passage breakdown */}
                  {passages.length > 0 && hasScores && (
                    <div className='flex flex-wrap gap-x-4 gap-y-1 mt-1'>
                      {passages.map(p => {
                        const passageScores = scores.filter(s=>s.candidateId===c.id&&s.passageId===p.id);
                        if (!passageScores.length) return null;
                        const crits = criteria.filter(cr=>cr.passageId===p.id||!cr.passageId);
                        const tw = crits.reduce((s,cr)=>s+cr.weight,0)||1;
                        const avg = passageScores.map(s=>crits.reduce((sum,cr)=>sum+(s.scores[cr.id]??0)*cr.weight,0)/tw).reduce((a,b)=>a+b,0)/passageScores.length;
                        return <span key={p.id} className='text-xs text-white/30'>{p.name}: <span className='text-white/60 font-semibold'>{avg.toFixed(1)}/10</span></span>;
                      })}
                    </div>
                  )}
                </div>
                <div className='text-right shrink-0'>
                  {avg !== null ? (
                    <div>
                      <p className={`text-3xl font-black ${i===0?'text-yellow-400':i===1?'text-gray-300':i===2?'text-amber-600':'text-white'}`}>{avg.toFixed(2)}</p>
                      <p className='text-white/30 text-xs'>/10</p>
                      {scores.filter(s=>s.candidateId===c.id).length > 0 && (
                        <p className='text-white/20 text-[10px] mt-0.5'>{scores.filter(s=>s.candidateId===c.id).length} éval.</p>
                      )}
                    </div>
                  ) : (
                    <span className='text-white/20 text-sm'>En attente</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* ── GRID VIEW ── */}
      {view === 'grid' && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {candidates.length === 0 && <p className='text-white/30 col-span-full text-center py-16'>Aucune candidate pour la {STAGE_LABELS[activeStage]}.</p>}
          {candidates.map(c => {
            const avg = getAvg(c.id);
            return (
              <div key={c.id} className='group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-pm-gold/30 transition-all'>
                <div className='relative aspect-[3/4] overflow-hidden'>
                  {c.photo
                    ? <img src={c.photo} alt={c.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'/>
                    : <div className='w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-5xl font-bold'>{c.name[0]}</div>
                  }
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent'/>
                  <div className='absolute bottom-0 left-0 right-0 p-4'>
                    <p className='text-white font-bold text-lg leading-tight'>#{c.order} {c.name}</p>
                    {c.status==='winner' && <span className='text-xs bg-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded-full font-bold'>🏆 Gagnante</span>}
                  </div>
                  {avg !== null && (
                    <div className='absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-xl px-2.5 py-1.5 text-center'>
                      <p className='text-pm-gold font-black text-base leading-none'>{avg.toFixed(1)}</p>
                      <p className='text-white/40 text-[9px]'>/10</p>
                    </div>
                  )}
                </div>
                {c.bio && <div className='p-4'><p className='text-white/50 text-xs line-clamp-2'>{c.bio}</p></div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Live indicator */}
      {hasScores && (
        <div className='flex items-center justify-center gap-2 py-4 text-white/20 text-xs'>
          <span className='relative flex h-2 w-2'><span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'/><span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'/></span>
          Résultats en temps réel · {scores.length} évaluation(s) · {candidates.length} candidate(s)
        </div>
      )}
    </div>
  );
}
// ── Main page ─────────────────────────────────────────────────────────────
export default function BeautyContest() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [activeContestId, setActiveContestId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onValue(ref(rtdb, RTDB_BASE), (snap) => {
      const d = snap.val();
      if (d) {
        const list: Contest[] = Object.entries(d).map(([id,v]:any) => ({ id, ...v }));
        const active = list.filter(c => c.status === 'active' || c.status === 'closed');
        active.sort((a,b) => new Date(b.createdAt||0).getTime() - new Date(a.createdAt||0).getTime());
        setContests(active);
        if (active.length > 0 && !activeContestId) setActiveContestId(active[0].id);
      } else setContests([]);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const activeContest = contests.find(c => c.id === activeContestId) || null;

  if (loading) return (
    <div className='w-full min-h-screen bg-pm-dark flex items-center justify-center'>
      <span className='loading loading-ring loading-lg text-pm-gold'></span>
    </div>
  );

  if (contests.length === 0) return (
    <div className='w-full min-h-screen bg-pm-dark flex flex-col items-center justify-center gap-4 px-4 text-center'>
      <SEO title='Concours de Beauté — Perfect Models Management' description='Concours de beauté organisés par Perfect Models Management.'/>
      <Trophy size={64} className='text-white/10'/>
      <h1 className='text-3xl font-playfair font-bold text-white'>Aucun concours en cours</h1>
      <p className='text-white/40 max-w-md'>Revenez bientôt pour découvrir nos prochains concours.</p>
    </div>
  );

  return (
    <div className='bg-pm-dark min-h-screen'>
      <SEO
        title={(activeContest?.name || 'Concours de Beauté') + ' — Perfect Models Management'}
        description={activeContest?.description || 'Concours de beauté organisés par Perfect Models Management.'}
      />

      {/* ── HERO ── */}
      <section className='relative py-24 px-4 text-center overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/40 to-pm-dark pointer-events-none'/>
        <div className='relative z-10 max-w-2xl mx-auto'>
          <span className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pm-gold/10 border border-pm-gold/30 text-pm-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6'>
            <span className='w-1.5 h-1.5 rounded-full bg-pm-gold animate-pulse'/>
            Perfect Models Management
          </span>
          <h1 className='text-4xl md:text-5xl font-playfair font-black text-white mb-3'>Concours de Beauté</h1>
          <p className='text-white/40'>Résultats en direct · Classements officiels</p>
        </div>
      </section>

      {/* ── CONTEST TABS ── */}
      <div className='sticky top-0 z-30 bg-pm-dark/95 backdrop-blur-xl border-b border-white/5'>
        <div className='max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto no-scrollbar py-3'>
          {contests.map(c => {
            const stage = (c.currentStage || 'preselection') as ContestStage;
            const isActive = c.id === activeContestId;
            return (
              <button key={c.id} onClick={() => setActiveContestId(c.id)}
                className={`shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                  isActive ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-transparent text-white/40 hover:text-white/70 hover:border-white/10'
                }`}
              >
                <Award size={14} className={isActive ? 'text-pm-gold' : 'text-white/30'}/>
                <span>{c.name}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${STAGE_COLORS[stage]}`}>{STAGE_LABELS[stage]}</span>
                {c.status === 'closed' && <span className='text-[9px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full'>Clôturé</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── ACTIVE CONTEST INFO ── */}
      {activeContest && (
        <div className='max-w-6xl mx-auto px-4 pt-6 pb-2'>
          <div className='flex flex-wrap items-center gap-4 mb-2'>
            <div>
              <h2 className='text-2xl font-playfair font-black text-white'>{activeContest.name}</h2>
              <div className='flex flex-wrap items-center gap-3 mt-1 text-white/40 text-sm'>
                {activeContest.date && <span>📅 {activeContest.date}</span>}
                {activeContest.location && <span>📍 {activeContest.location}</span>}
              </div>
            </div>
          </div>
          {activeContest.description && <p className='text-white/40 text-sm mb-4'>{activeContest.description}</p>}
        </div>
      )}

      {/* ── CONTEST VIEW ── */}
      <div className='max-w-6xl mx-auto px-4 pb-16'>
        {activeContest && <ContestView key={activeContest.id} contest={activeContest}/>}
      </div>

      <footer className='border-t border-white/10 py-8 px-4 text-center'>
        <p className='text-white/20 text-xs'>© {new Date().getFullYear()} Perfect Models Management · Libreville, Gabon</p>
      </footer>
    </div>
  );
}
