import { useState, useEffect, useRef } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, push, set } from 'firebase/database';
import { Heart, X, Trophy, Users, Star, ChevronDown } from 'lucide-react';
import SEO from '../components/SEO';

// ── Types ─────────────────────────────────────────────────────────────────
interface Contest {
  id: string;
  name: string;
  description: string;
  date: string;
  location: string;
  status: 'draft' | 'active' | 'closed';
}

interface Candidate {
  id: string;
  order: number;
  name: string;
  photo: string;
  bio: string;
  status: 'active' | 'hidden' | 'winner';
}

interface ScoringCriteria {
  id: string;
  label: string;
  weight: number;
  order: number;
}

interface Score {
  id: string;
  juryId: string;
  candidateId: string;
  scores: Record<string, number>;
}

const RTDB_BASE = 'beautyContests';
const PRICE_PER_VOTE = 100;
const VOTE_SUGGESTIONS = [5, 10, 20, 50, 100];
const calcBonus = (v: number) => Math.floor(v / 10) * 5;
const WHATSAPP_NUMBER = '24174799319';
export default function BeautyContest() {
  const [contests, setContests] = useState<Contest[]>([]);
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [criteria, setCriteria] = useState<ScoringCriteria[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', votes: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ txRef: string; candidateName: string; total: number } | null>(null);
  const submitLock = useRef(false);
  const [activeView, setActiveView] = useState<'ranking' | 'all' | 'jury'>('ranking');

  // Load active contests
  useEffect(() => {
    const unsub = onValue(ref(rtdb, RTDB_BASE), (snap) => {
      const data = snap.val();
      if (data) {
        const list: Contest[] = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
        const active = list.filter(c => c.status === 'active');
        setContests(active);
        if (active.length > 0 && !selectedContest) setSelectedContest(active[0]);
      } else {
        setContests([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Load candidates + criteria + scores for selected contest
  useEffect(() => {
    if (!selectedContest) return;
    const cid = selectedContest.id;
    const unsubs: (() => void)[] = [];

    unsubs.push(onValue(ref(rtdb, RTDB_BASE + '/' + cid + '/candidates'), (snap) => {
      const data = snap.val();
      if (data) {
        const list: Candidate[] = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
        setCandidates(list.filter(c => c.status !== 'hidden').sort((a, b) => a.order - b.order));
      } else { setCandidates([]); }
    }));

    unsubs.push(onValue(ref(rtdb, RTDB_BASE + '/' + cid + '/criteria'), (snap) => {
      const data = snap.val();
      if (data) {
        const list: ScoringCriteria[] = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
        setCriteria(list.sort((a, b) => a.order - b.order));
      } else { setCriteria([]); }
    }));

    unsubs.push(onValue(ref(rtdb, RTDB_BASE + '/' + cid + '/scores'), (snap) => {
      const data = snap.val();
      if (data) {
        const list: Score[] = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
        setScores(list);
      } else { setScores([]); }
    }));

    return () => unsubs.forEach(u => u());
  }, [selectedContest]);
  // Compute jury scores per candidate
  const computeRanking = () => {
    if (criteria.length === 0 || scores.length === 0) return candidates;
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0) || 1;
    return [...candidates].sort((a, b) => {
      const avgA = (() => {
        const cs = scores.filter(s => s.candidateId === a.id);
        if (!cs.length) return 0;
        const juryAvgs = cs.map(s => criteria.reduce((sum, cr) => sum + (s.scores[cr.id] ?? 0) * cr.weight, 0) / totalWeight);
        return juryAvgs.reduce((s, v) => s + v, 0) / juryAvgs.length;
      })();
      const avgB = (() => {
        const cs = scores.filter(s => s.candidateId === b.id);
        if (!cs.length) return 0;
        const juryAvgs = cs.map(s => criteria.reduce((sum, cr) => sum + (s.scores[cr.id] ?? 0) * cr.weight, 0) / totalWeight);
        return juryAvgs.reduce((s, v) => s + v, 0) / juryAvgs.length;
      })();
      return avgB - avgA;
    });
  };

  const getCandidateAvg = (candidateId: string): number | null => {
    if (criteria.length === 0) return null;
    const cs = scores.filter(s => s.candidateId === candidateId);
    if (!cs.length) return null;
    const totalWeight = criteria.reduce((s, c) => s + c.weight, 0) || 1;
    const juryAvgs = cs.map(s => criteria.reduce((sum, cr) => sum + (s.scores[cr.id] ?? 0) * cr.weight, 0) / totalWeight);
    return juryAvgs.reduce((s, v) => s + v, 0) / juryAvgs.length;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || !selectedContest || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);
    try {
      const votes = Math.max(1, Math.floor(Number(form.votes)) || 1);
      const bonusVotes = calcBonus(votes);
      const totalVotesVal = votes + bonusVotes;
      const amount = votes * PRICE_PER_VOTE;
      const txRef = 'VOTE_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const pendingRef = push(ref(rtdb, 'missOneLight/pendingVotes'));
      await set(pendingRef, {
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        voterName: form.name.trim(),
        votes,
        bonusVotes,
        totalVotes: totalVotesVal,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        txRef,
        validated: false,
        timestamp: new Date().toISOString(),
        contestId: selectedContest.id,
        contestName: selectedContest.name,
      });
      await new Promise(r => setTimeout(r, 300));
      const bonusLine = bonusVotes > 0 ? '\n🎁 Bonus : +' + bonusVotes + ' votes\n✅ Total : ' + totalVotesVal + ' votes' : '';
      const msg = 'VOTE ' + selectedContest.name.toUpperCase() + '\n\n👤 Votant : ' + form.name.trim() + '\n👑 Candidate : ' + selectedCandidate.name + '\n🗳️ Votes : ' + votes + bonusLine + '\n💰 Montant : ' + amount + ' FCFA\n📧 Email : ' + form.email + '\n📱 Tél : ' + form.phone + '\n🔖 Réf : ' + txRef + '\n\nMerci de confirmer la réception.';
      window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg), '_blank');
      setSubmitted({ txRef, candidateName: selectedCandidate.name, total: totalVotesVal });
    } catch {
      alert('Une erreur est survenue. Veuillez réessayer.');
      submitLock.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  const ranked = computeRanking();
  const voteCount = Math.max(1, Math.floor(Number(form.votes)) || 1);
  const bonus = calcBonus(voteCount);
  const isClosed = selectedContest?.status === 'closed';
  if (loading) return (
    <div className='w-full min-h-screen bg-pm-dark flex items-center justify-center'>
      <span className='loading loading-ring loading-lg text-pm-gold'></span>
    </div>
  );

  if (contests.length === 0) return (
    <div className='w-full min-h-screen bg-pm-dark flex flex-col items-center justify-center gap-4 px-4'>
      <SEO title='Concours de Beauté — Perfect Models Management' description='Découvrez les concours de beauté organisés par Perfect Models Management.' />
      <Trophy size={64} className='text-white/10' />
      <h1 className='text-3xl font-playfair font-bold text-white text-center'>Aucun concours en cours</h1>
      <p className='text-white/40 text-center max-w-md'>Revenez bientôt pour découvrir nos prochains concours de beauté.</p>
    </div>
  );

  return (
    <div className='bg-pm-dark min-h-screen'>
      <SEO
        title={(selectedContest?.name || 'Concours de Beauté') + ' — Perfect Models Management'}
        description={selectedContest?.description || 'Découvrez les concours de beauté organisés par Perfect Models Management.'}
      />

      {/* ── HERO ── */}
      <section className='relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-pm-dark/80 to-pm-dark pointer-events-none' />
        <div className='relative z-10 max-w-3xl mx-auto'>
          <span className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pm-gold/10 border border-pm-gold/30 text-pm-gold text-[10px] font-black uppercase tracking-[0.3em] mb-6'>
            <span className='w-1.5 h-1.5 rounded-full bg-pm-gold animate-pulse' />
            Perfect Models Management
          </span>
          <h1 className='text-4xl md:text-6xl font-playfair font-black text-white mb-4 leading-tight'>
            {selectedContest?.name || 'Concours de Beauté'}
          </h1>
          {selectedContest?.description && (
            <p className='text-white/50 text-base md:text-lg max-w-xl mx-auto mb-6'>{selectedContest.description}</p>
          )}
          <div className='flex flex-wrap items-center justify-center gap-4 text-sm text-white/40'>
            {selectedContest?.date && <span>📅 {selectedContest.date}</span>}
            {selectedContest?.location && <span>📍 {selectedContest.location}</span>}
            <span>👑 {candidates.length} candidates</span>
          </div>
          {contests.length > 1 && (
            <div className='flex flex-wrap justify-center gap-2 mt-6'>
              {contests.map(c => (
                <button key={c.id} onClick={() => setSelectedContest(c)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${ selectedContest?.id === c.id ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'bg-white/10 text-white/60 border-white/20 hover:border-pm-gold/40' }`}>
                  {c.name}
                </button>
              ))}
            </div>
          )}
          <button onClick={() => document.getElementById('content')?.scrollIntoView({ behavior: 'smooth' })} className='mt-8 flex flex-col items-center gap-1 text-white/30 hover:text-white/60 transition-colors mx-auto'>
            <span className='text-xs uppercase tracking-widest'>Découvrir</span>
            <ChevronDown size={20} className='animate-bounce' />
          </button>
        </div>
      </section>
      {/* ── CONTENT ── */}
      <section id='content' className='px-4 md:px-6 lg:px-12 py-12 max-w-6xl mx-auto'>

        {/* View tabs */}
        <div className='flex gap-2 mb-10 flex-wrap'>
          {[
            { id: 'ranking', label: 'Classement', icon: <Trophy size={14} /> },
            { id: 'all', label: 'Toutes les candidates', icon: <Users size={14} /> },
            ...(criteria.length > 0 && scores.length > 0 ? [{ id: 'jury', label: 'Notes du jury', icon: <Star size={14} /> }] : []),
          ].map((tab: any) => (
            <button key={tab.id} onClick={() => setActiveView(tab.id)} className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${ activeView === tab.id ? 'bg-pm-gold text-pm-dark' : 'bg-white/10 text-white/60 hover:bg-white/20' }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── RANKING VIEW ── */}
        {activeView === 'ranking' && (
          <div className='space-y-4'>
            {ranked.length === 0 && <p className='text-white/30 text-center py-20'>Aucune candidate pour le moment.</p>}
            {ranked.map((c, index) => {
              const avg = getCandidateAvg(c.id);
              const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : null;
              return (
                <div key={c.id} className={`flex items-center gap-5 p-5 rounded-2xl border transition-all ${ index === 0 ? 'border-yellow-500/40 bg-yellow-500/5' : index === 1 ? 'border-gray-400/20 bg-white/5' : index === 2 ? 'border-amber-700/20 bg-white/5' : 'border-white/10 bg-white/5' }`}>
                  <div className='text-2xl font-black w-10 text-center shrink-0'>
                    {medal || <span className='text-white/30 text-lg'>{index + 1}</span>}
                  </div>
                  {c.photo ? <img src={c.photo} alt={c.name} className='h-16 w-16 object-cover rounded-2xl shrink-0' /> : <div className='h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center text-white/30 text-2xl font-bold shrink-0'>{c.name[0]}</div>}
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <p className='text-white font-bold text-lg'>#{c.order} {c.name}</p>
                      {c.status === 'winner' && <span className='text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full font-bold'>Gagnante</span>}
                    </div>
                    {c.bio && <p className='text-white/40 text-sm mt-1 line-clamp-1'>{c.bio}</p>}
                    {criteria.length > 0 && avg !== null && (
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {criteria.map(cr => {
                          const crScores = scores.filter(s => s.candidateId === c.id).map(s => s.scores[cr.id] ?? 0);
                          const crAvg = crScores.length ? crScores.reduce((a, b) => a + b, 0) / crScores.length : null;
                          return crAvg !== null ? (
                            <span key={cr.id} className='text-xs text-white/40'>{cr.label}: <span className='text-white/70 font-semibold'>{crAvg.toFixed(1)}/10</span></span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                  <div className='text-right shrink-0'>
                    {avg !== null ? (
                      <div>
                        <p className={`text-3xl font-black ${ index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-white' }`}>{avg.toFixed(2)}</p>
                        <p className='text-white/30 text-xs'>/ 10</p>
                      </div>
                    ) : !isClosed ? (
                      <button onClick={() => { setSelectedCandidate(c); setForm({ name: '', email: '', phone: '', votes: 5 }); setSubmitted(null); }} className='px-4 py-2 rounded-xl bg-pm-gold text-pm-dark font-bold text-sm hover:bg-pm-gold/80 transition-all flex items-center gap-2'>
                        <Heart size={14} /> Voter
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* ── ALL CANDIDATES VIEW ── */}
        {activeView === 'all' && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {candidates.length === 0 && <p className='text-white/30 col-span-full text-center py-20'>Aucune candidate pour le moment.</p>}
            {candidates.map(c => {
              const avg = getCandidateAvg(c.id);
              return (
                <div key={c.id} className='group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-pm-gold/30 transition-all'>
                  <div className='relative aspect-[3/4] overflow-hidden'>
                    {c.photo ? (
                      <img src={c.photo} alt={c.name} className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                    ) : (
                      <div className='w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-5xl font-bold'>{c.name[0]}</div>
                    )}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent' />
                    <div className='absolute bottom-0 left-0 right-0 p-4'>
                      <p className='text-white font-bold text-lg leading-tight'>#{c.order} {c.name}</p>
                      {c.status === 'winner' && <span className='text-xs bg-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded-full font-bold'>🏆 Gagnante</span>}
                    </div>
                    {avg !== null && (
                      <div className='absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl px-2 py-1 text-center'>
                        <p className='text-pm-gold font-black text-sm'>{avg.toFixed(1)}</p>
                        <p className='text-white/40 text-[9px]'>/10</p>
                      </div>
                    )}
                  </div>
                  <div className='p-4 space-y-3'>
                    {c.bio && <p className='text-white/50 text-xs line-clamp-2'>{c.bio}</p>}
                    {!isClosed && (
                      <button onClick={() => { setSelectedCandidate(c); setForm({ name: '', email: '', phone: '', votes: 5 }); setSubmitted(null); }} className='w-full py-2.5 rounded-xl bg-pm-gold/10 hover:bg-pm-gold text-pm-gold hover:text-pm-dark font-bold text-sm transition-all flex items-center justify-center gap-2 border border-pm-gold/30'>
                        <Heart size={14} /> Voter pour {c.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── JURY SCORES VIEW ── */}
        {activeView === 'jury' && criteria.length > 0 && (
          <div className='space-y-6'>
            <div className='overflow-x-auto'>
              <table className='w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden text-sm'>
                <thead>
                  <tr className='border-b border-white/10 bg-white/5'>
                    <th className='px-4 py-3 text-left text-white/60'>Candidate</th>
                    {criteria.map(cr => <th key={cr.id} className='px-4 py-3 text-center text-white/60 whitespace-nowrap'>{cr.label} <span className='text-pm-gold text-xs'>x{cr.weight}</span></th>)}
                    <th className='px-4 py-3 text-center text-pm-gold font-bold'>Moyenne</th>
                  </tr>
                </thead>
                <tbody>
                  {ranked.map((c, index) => {
                    const avg = getCandidateAvg(c.id);
                    return (
                      <tr key={c.id} className='border-b border-white/10 hover:bg-white/5'>
                        <td className='px-4 py-3'>
                          <div className='flex items-center gap-3'>
                            <span className='text-white/30 text-sm w-5'>{index + 1}</span>
                            {c.photo && <img src={c.photo} alt={c.name} className='h-8 w-8 object-cover rounded-lg' />}
                            <span className='text-white font-semibold'>{c.name}</span>
                          </div>
                        </td>
                        {criteria.map(cr => {
                          const crScores = scores.filter(s => s.candidateId === c.id).map(s => s.scores[cr.id] ?? 0);
                          const crAvg = crScores.length ? crScores.reduce((a, b) => a + b, 0) / crScores.length : null;
                          return <td key={cr.id} className='px-4 py-3 text-center text-white/70'>{crAvg !== null ? crAvg.toFixed(1) : '—'}</td>;
                        })}
                        <td className='px-4 py-3 text-center'>
                          {avg !== null ? <span className='text-pm-gold font-black text-base'>{avg.toFixed(2)}</span> : <span className='text-white/20'>—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
      {/* ── VOTE MODAL ── */}
      {selectedCandidate && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm' onClick={e => { if (e.target === e.currentTarget && !submitting) { setSelectedCandidate(null); setSubmitted(null); submitLock.current = false; } }}>
          <div className='relative w-full max-w-md bg-pm-dark border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto'>
            <button onClick={() => { if (!submitting) { setSelectedCandidate(null); setSubmitted(null); submitLock.current = false; } }} disabled={submitting} className='absolute top-4 right-4 text-white/40 hover:text-white transition-colors disabled:opacity-30'>
              <X size={20} />
            </button>

            {submitted ? (
              <div className='text-center'>
                <div className='w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4'>
                  <Heart size={28} className='text-green-400' fill='currentColor' />
                </div>
                <h2 className='text-2xl font-playfair font-bold text-white mb-2'>Vote soumis !</h2>
                <p className='text-white/50 text-sm mb-4'>Vote pour <strong className='text-pm-gold'>{submitted.candidateName}</strong> enregistré.<br/>Réf : <span className='font-mono text-pm-gold'>{submitted.txRef}</span></p>
                <div className='bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-left mb-4'>
                  <p className='text-white/70 text-xs leading-relaxed'>Effectuez le paiement puis envoyez votre capture d&apos;écran sur WhatsApp pour activer vos <strong className='text-white'>{submitted.total} votes</strong>.</p>
                </div>
                <button onClick={() => { setSelectedCandidate(null); setSubmitted(null); submitLock.current = false; }} className='w-full py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all'>Fermer</button>
              </div>
            ) : (
              <>
                <div className='flex items-center gap-4 mb-6'>
                  {selectedCandidate.photo && <img src={selectedCandidate.photo} alt={selectedCandidate.name} className='w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0' />}
                  <div>
                    <p className='text-[10px] uppercase tracking-widest text-white/40 mb-1'>Voter pour</p>
                    <h2 className='text-xl font-playfair font-bold text-white'>{selectedCandidate.name}</h2>
                    <p className='text-white/30 text-xs'>{selectedContest?.name}</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='block text-[10px] uppercase tracking-widest text-white/40 mb-2'>Nom complet</label>
                    <input type='text' required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder='Votre nom et prénom' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pm-gold/50 text-sm' />
                  </div>
                  <div>
                    <label className='block text-[10px] uppercase tracking-widest text-white/40 mb-2'>Email</label>
                    <input type='email' required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder='votre@email.com' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pm-gold/50 text-sm' />
                  </div>
                  <div>
                    <label className='block text-[10px] uppercase tracking-widest text-white/40 mb-2'>Téléphone</label>
                    <input type='tel' required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder='2417XXXXXXXX' className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pm-gold/50 text-sm' />
                  </div>
                  <div>
                    <label className='block text-[10px] uppercase tracking-widest text-white/40 mb-2'>Nombre de votes</label>
                    <div className='grid grid-cols-5 gap-1.5 mb-3'>
                      {VOTE_SUGGESTIONS.map(n => (
                        <button key={n} type='button' onClick={() => setForm({...form, votes: n})} className={`py-2 rounded-lg text-[10px] font-bold transition-all border flex flex-col items-center leading-tight ${ form.votes === n ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'bg-white/5 text-white/60 border-white/10 hover:border-pm-gold/40' }`}>
                          <span>{n}</span>
                          <span className='font-normal opacity-70 text-[8px]'>{(n * PRICE_PER_VOTE / 1000).toFixed(0)}k F</span>
                        </button>
                      ))}
                    </div>
                    <input type='number' required min={1} value={form.votes} onChange={e => setForm({...form, votes: Math.max(1, parseInt(e.target.value) || 1)})} className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pm-gold/50 text-sm' />
                  </div>
                  <div className='bg-white/5 border border-pm-gold/20 rounded-2xl p-4 space-y-2'>
                    <div className='flex justify-between text-sm'><span className='text-white/40'>Montant</span><span className='text-pm-gold font-bold'>{(voteCount * PRICE_PER_VOTE).toLocaleString()} FCFA</span></div>
                    <div className='flex justify-between text-sm'><span className='text-white/40'>Votes achetés</span><span className='text-white font-bold'>{voteCount}</span></div>
                    {bonus > 0 && <div className='flex justify-between text-sm'><span className='text-green-400'>🎁 Bonus</span><span className='text-green-400 font-bold'>+{bonus}</span></div>}
                    <div className='border-t border-white/10 pt-2 flex justify-between'><span className='text-white/60 text-sm'>Total crédité</span><span className='text-white font-black'>{voteCount + bonus} votes</span></div>
                  </div>
                  <button type='submit' disabled={submitting} className='w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all'>
                    {submitting ? <><span className='loading loading-spinner loading-sm' /> Envoi...</> : <>📱 Soumettre → WhatsApp</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className='border-t border-white/10 py-10 px-4 text-center'>
        <p className='text-white/20 text-xs'>© {new Date().getFullYear()} Perfect Models Management · Libreville, Gabon</p>
      </footer>
    </div>
  );
}
