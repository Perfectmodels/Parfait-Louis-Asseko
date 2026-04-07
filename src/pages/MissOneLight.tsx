import { useState, useEffect, useRef } from 'react';
import { rtdb } from '../firebase';
import { ref, onValue, push, set } from 'firebase/database';
import { Heart, MessageCircle, X } from 'lucide-react';
import HeroSlide from '../components/MissOneLight/HeroSlide';
import Top5Slide from '../components/MissOneLight/Top5Slide';
import CandidatesSlide from '../components/MissOneLight/CandidatesSlide';
import { sendVoteConfirmation } from '../utils/brevoService';

const WHATSAPP_NUMBER = '24174799319';
const PRICE_PER_VOTE = 100;
const VOTE_SUGGESTIONS = [5, 10, 20, 50, 100];
const calcBonus = (v: number) => Math.floor(v / 10) * 5;

interface Candidate {
  id: string; number: number; name: string; photo: string;
  votes: number; status: string; order: number; rank?: number;
}
interface VoteForm { email: string; phone: string; votes: number; }

export default function MissOneLight() {
  const [rawCandidates, setRawCandidates] = useState<Candidate[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [form, setForm] = useState<VoteForm>({ email: '', phone: '', votes: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ txRef: string; candidateName: string; total: number } | null>(null);
  const submitLock = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce RTDB updates — with hundreds of concurrent voters the realtime
  // listener fires very frequently; cap re-renders to every 800ms.
  useEffect(() => {
    const candidatesRef = ref(rtdb, 'missOneLight/candidates');
    const unsubscribe = onValue(candidatesRef, (snapshot) => {
      const data = snapshot.val();
      const list: Candidate[] = data
        ? Object.entries(data)
            .map(([id, val]) => ({ id, ...(val as Omit<Candidate, 'id'>) }))
            .filter((c) => c.status !== 'hidden')
            .sort((a, b) => b.votes - a.votes)
            .map((c, i) => ({ ...c, rank: i + 1 }))
        : [];
      setRawCandidates(list);
      setLoading(false);
    }, (err) => {
      console.error('RTDB error:', err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Debounce: apply rawCandidates to display state max every 800ms
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setCandidates(rawCandidates), 800);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [rawCandidates]);

  const totalVotes = candidates.reduce((s, c) => s + (c.votes || 0), 0);

  const openVoteModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setForm({ email: '', phone: '', votes: 5 });
    setSubmitted(null);
  };

  const closeModal = () => {
    if (submitting) return; // prevent accidental close during submit
    setSelectedCandidate(null);
    setSubmitted(null);
    submitLock.current = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || submitLock.current) return;
    submitLock.current = true;
    setSubmitting(true);

    try {
      const votes = Math.max(1, Math.floor(Number(form.votes)) || 1);
      const bonusVotes = calcBonus(votes);
      const totalVotesVal = votes + bonusVotes;
      const amount = votes * PRICE_PER_VOTE;
      const txRef = `VOTE_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Write to RTDB — push() generates a unique key server-side,
      // safe for concurrent writes from hundreds of users simultaneously.
      const pendingRef = push(ref(rtdb, 'missOneLight/pendingVotes'));
      await set(pendingRef, {
        candidateId: selectedCandidate.id,
        candidateName: selectedCandidate.name,
        votes,
        bonusVotes,
        totalVotes: totalVotesVal,
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        txRef,
        validated: false,
        timestamp: new Date().toISOString(),
      });

      // Non-blocking email — failure must not block the user flow
      sendVoteConfirmation({
        email: form.email.trim().toLowerCase(),
        candidateName: selectedCandidate.name,
        votes,
        txRef,
      }).catch(() => {});

      // WhatsApp pre-filled message
      const bonusLine = bonusVotes > 0
        ? `\n🎁 Bonus : +${bonusVotes} votes offerts\n✅ Total crédité : ${totalVotesVal} votes`
        : '';
      const msg = `VOTE MISS ONE LIGHT 2026\n\n👑 Candidate : ${selectedCandidate.name}\n🗳️ Votes achetés : ${votes}${bonusLine}\n💰 Montant : ${amount} FCFA\n📧 Email : ${form.email}\n📱 Téléphone : ${form.phone}\n🔖 Réf : ${txRef}\n\nJe souhaite voter pour cette candidate.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

      setSubmitted({ txRef, candidateName: selectedCandidate.name, total: totalVotesVal });
    } catch (err) {
      console.error('Vote error:', err);
      alert('Une erreur est survenue. Veuillez réessayer.');
      submitLock.current = false;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-pm-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-pm-gold font-playfair animate-pulse">Chargement Miss One Light...</p>
        </div>
      </div>
    );
  }

  const voteCount = Math.max(1, Math.floor(Number(form.votes)) || 1);
  const bonus = calcBonus(voteCount);

  return (
    <div className="bg-pm-dark min-h-screen">
      <section className="min-h-screen">
        <HeroSlide
          totalVotes={totalVotes}
          candidatesCount={candidates.length}
          onDiscover={() => document.getElementById('top5')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </section>

      <section id="top5">
        <Top5Slide
          candidates={candidates.slice(0, 5)}
          onVote={(id) => { const c = candidates.find(c => c.id === id); if (c) openVoteModal(c); }}
          votedCandidates={new Set()}
        />
      </section>

      <section id="candidates">
        <CandidatesSlide
          candidates={candidates}
          onVote={(id) => { const c = candidates.find(c => c.id === id); if (c) openVoteModal(c); }}
          votedCandidates={new Set()}
        />
      </section>

      {/* Vote Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="relative w-full max-w-md bg-pm-dark border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl max-h-[92vh] overflow-y-auto"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            <button
              onClick={closeModal}
              disabled={submitting}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors disabled:opacity-30"
            >
              <X size={20} />
            </button>

            {submitted ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#009E60]/20 flex items-center justify-center mx-auto mb-6">
                  <Heart size={28} className="text-[#009E60]" fill="currentColor" />
                </div>
                <h2 className="text-2xl font-playfair font-bold text-white mb-3">Demande envoyée !</h2>
                <p className="text-white/50 text-sm mb-4 leading-relaxed">
                  Vote pour <strong className="text-[#FCD116]">{submitted.candidateName}</strong> soumis.<br />
                  <span className="font-mono text-[#FCD116]">{submitted.txRef}</span>
                </p>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Prochaines étapes</p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    1. Payez via Airtel Money <strong>074799319</strong> ou Moov Money <strong>062708998</strong><br />
                    2. Envoyez la confirmation WhatsApp avec votre capture d'ecran<br />
                    3. L'admin validera vos <strong className="text-white">{submitted.total} votes</strong> sous 24h
                  </p>
                </div>
                <button onClick={closeModal} className="w-full py-3 rounded-2xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all">
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  {selectedCandidate.photo && (
                    <img src={selectedCandidate.photo} alt={selectedCandidate.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Voter pour</p>
                    <h2 className="text-xl font-playfair font-bold text-white">{selectedCandidate.name}</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Email</label>
                    <input type="email" required value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      placeholder="votre@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#FCD116]/50 text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Téléphone</label>
                    <input type="tel" required value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="2417XXXXXXXX"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#FCD116]/50 text-sm" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2">Nombre de votes</label>
                    <div className="grid grid-cols-5 gap-1.5 mb-3">
                      {VOTE_SUGGESTIONS.map(n => (
                        <button key={n} type="button"
                          onClick={() => setForm({ ...form, votes: n })}
                          className={`py-2 rounded-lg text-[10px] font-bold transition-all border flex flex-col items-center leading-tight ${
                            form.votes === n
                              ? 'bg-[#FCD116] text-pm-dark border-[#FCD116]'
                              : 'bg-white/5 text-white/60 border-white/10 hover:border-[#FCD116]/40 hover:text-white'
                          }`}>
                          <span>{n}</span>
                          <span className="font-normal opacity-70 text-[8px]">{(n * PRICE_PER_VOTE / 1000).toFixed(0)}k F</span>
                        </button>
                      ))}
                    </div>
                    <input type="number" required min={1} value={form.votes}
                      onChange={e => setForm({ ...form, votes: Math.max(1, parseInt(e.target.value) || 1) })}
                      placeholder="Saisir un nombre libre..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FCD116]/50 text-sm" />
                  </div>

                  {/* Price + bonus summary */}
                  <div className="bg-white/5 border border-[#FCD116]/20 rounded-2xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Montant</span>
                      <span className="text-[#FCD116] font-bold">{(voteCount * PRICE_PER_VOTE).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Votes achetés</span>
                      <span className="text-white font-bold">{voteCount}</span>
                    </div>
                    {bonus > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[#009E60]">🎁 Bonus (+5 / 10 votes)</span>
                        <span className="text-[#009E60] font-bold">+{bonus}</span>
                      </div>
                    )}
                    <div className="border-t border-white/10 pt-2 flex justify-between">
                      <span className="text-white/60 text-sm">Total crédité</span>
                      <span className="text-white font-black">{voteCount + bonus} votes</span>
                    </div>
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] disabled:opacity-50 text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all">
                    {submitting
                      ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Envoi...</>
                      : <><MessageCircle size={18} /> Soumettre → WhatsApp</>
                    }
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
