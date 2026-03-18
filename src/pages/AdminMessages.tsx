import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeftIcon, TrashIcon, XMarkIcon, PaperAirplaneIcon,
  EnvelopeIcon, MagnifyingGlassIcon,
  ArrowUturnLeftIcon, CheckCircleIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ContactMessage } from '../types';
import { sendReplyToContact } from '../utils/brevoService';

const STATUS_STYLES: Record<ContactMessage['status'], string> = {
  Nouveau: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  Lu: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
  Archivé: 'bg-white/5 text-white/30 border-white/10',
};

const AdminMessages: React.FC = () => {
  const { data, saveData } = useData();
  const messages = useMemo(
    () => [...(data?.contactMessages ?? [])].sort(
      (a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    ),
    [data?.contactMessages]
  );

  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<ContactMessage['status'] | 'all'>('all');
  const [replyBody, setReplyBody] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyDone, setReplyDone] = useState(false);
  const [replyError, setReplyError] = useState('');

  const filtered = useMemo(() => messages.filter(m => {
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  }), [messages, filterStatus, search]);

  const newCount = messages.filter(m => m.status === 'Nouveau').length;

  const updateStatus = (id: string, status: ContactMessage['status']) => {
    if (!data) return;
    saveData({ ...data, contactMessages: data.contactMessages.map(m => m.id === id ? { ...m, status } : m) });
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const deleteMsg = (id: string) => {
    if (!data || !window.confirm('Supprimer ce message ?')) return;
    saveData({ ...data, contactMessages: data.contactMessages.filter(m => m.id !== id) });
    if (selected?.id === id) setSelected(null);
  };

  const openMessage = (msg: ContactMessage) => {
    setSelected(msg);
    setReplyBody('');
    setReplyDone(false);
    setReplyError('');
    if (msg.status === 'Nouveau') updateStatus(msg.id, 'Lu');
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !replyBody.trim()) return;
    setReplySending(true);
    setReplyError('');
    try {
      await sendReplyToContact({
        toName: selected.name,
        toEmail: selected.email,
        originalSubject: selected.subject,
        replyBody,
        adminName: data?.adminProfile?.name,
      });
      setReplyDone(true);
      setReplyBody('');
      updateStatus(selected.id, 'Archivé');
    } catch (err: any) {
      setReplyError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setReplySending(false);
    }
  };

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white">
      <SEO title="Admin — Messages" noIndex />

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold/60 hover:text-pm-gold text-xs uppercase tracking-widest font-black mb-10 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" /> Tableau de bord
        </Link>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-playfair font-black italic">Messages</h1>
            {newCount > 0 && (
              <p className="text-sm text-blue-300 mt-1">{newCount} nouveau{newCount > 1 ? 'x' : ''} message{newCount > 1 ? 's' : ''}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-220px)] min-h-[500px]">

          {/* ── Sidebar liste ── */}
          <div className="lg:col-span-2 flex flex-col bg-black border border-pm-gold/20 rounded-2xl overflow-hidden">
            {/* Filtres */}
            <div className="p-4 border-b border-pm-gold/10 space-y-3">
              <div className="relative">
                <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher…"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-pm-off-white placeholder:text-white/20 focus:outline-none focus:border-pm-gold"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'Nouveau', 'Lu', 'Archivé'] as const).map(s => (
                  <button key={s} onClick={() => setFilterStatus(s)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterStatus === s ? 'bg-pm-gold text-pm-dark border-pm-gold font-bold' : 'border-white/10 text-white/40 hover:border-pm-gold/40'}`}>
                    {s === 'all' ? 'Tous' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 && (
                <p className="text-center text-white/30 text-sm p-8">Aucun message</p>
              )}
              {filtered.map(m => (
                <button key={m.id} onClick={() => openMessage(m)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors hover:bg-white/5 ${selected?.id === m.id ? 'bg-pm-gold/10 border-l-2 border-l-pm-gold' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className={`text-sm font-bold truncate ${m.status === 'Nouveau' ? 'text-white' : 'text-white/60'}`}>{m.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[m.status]}`}>{m.status}</span>
                  </div>
                  <p className={`text-xs truncate mb-1 ${m.status === 'Nouveau' ? 'text-pm-gold' : 'text-white/40'}`}>{m.subject}</p>
                  <p className="text-[10px] text-white/25">{fmt(m.submissionDate)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Panneau détail ── */}
          <div className="lg:col-span-3 flex flex-col bg-black border border-pm-gold/20 rounded-2xl overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex flex-col items-center justify-center text-white/20 gap-3">
                <EnvelopeIcon className="w-12 h-12" />
                <p className="text-sm">Sélectionnez un message</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 border-b border-pm-gold/10 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white truncate">{selected.subject}</h2>
                    <p className="text-sm text-white/50 mt-1">
                      De <span className="text-pm-gold">{selected.name}</span>
                      {' · '}<a href={`mailto:${selected.email}`} className="text-pm-gold/70 hover:text-pm-gold">{selected.email}</a>
                    </p>
                    <p className="text-xs text-white/25 mt-1">{fmt(selected.submissionDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <select value={selected.status}
                      onChange={e => updateStatus(selected.id, e.target.value as ContactMessage['status'])}
                      className="text-xs bg-pm-dark border border-pm-gold/30 rounded-lg px-2 py-1.5 text-pm-off-white focus:outline-none focus:border-pm-gold">
                      <option value="Nouveau">Nouveau</option>
                      <option value="Lu">Lu</option>
                      <option value="Archivé">Archivé</option>
                    </select>
                    <button onClick={() => deleteMsg(selected.id)} className="p-1.5 text-red-500/50 hover:text-red-400 transition-colors">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setSelected(null)} className="p-1.5 text-white/30 hover:text-white transition-colors">
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Corps du message */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="bg-white/3 border border-white/5 rounded-xl p-5 text-pm-off-white/80 leading-relaxed whitespace-pre-wrap text-sm">
                    {selected.message}
                  </div>

                  {/* Zone de réponse */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUturnLeftIcon className="w-4 h-4 text-pm-gold" />
                      <span className="text-xs font-black uppercase tracking-widest text-pm-gold">Répondre</span>
                    </div>

                    {replyDone ? (
                      <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <CheckCircleIcon className="w-5 h-5 text-green-400 shrink-0" />
                        <p className="text-sm text-green-300">Réponse envoyée à <strong>{selected.email}</strong></p>
                      </div>
                    ) : (
                      <form onSubmit={handleReply} className="space-y-3">
                        <div className="text-xs text-white/30 bg-white/3 rounded-lg px-3 py-2">
                          À : <span className="text-pm-gold">{selected.email}</span>
                          {' · '}Objet : <span className="text-white/50">Re: {selected.subject}</span>
                        </div>
                        <textarea
                          value={replyBody} onChange={e => setReplyBody(e.target.value)}
                          required rows={5}
                          placeholder="Rédigez votre réponse…"
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-pm-off-white placeholder:text-white/20 focus:outline-none focus:border-pm-gold resize-none"
                        />
                        {replyError && (
                          <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{replyError}</p>
                        )}
                        <button type="submit" disabled={replySending || !replyBody.trim()}
                          className="flex items-center gap-2 px-5 py-2.5 bg-pm-gold text-pm-dark font-black text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                          {replySending
                            ? <><span className="w-3 h-3 border-2 border-pm-dark/30 border-t-pm-dark rounded-full animate-spin" />Envoi…</>
                            : <><PaperAirplaneIcon className="w-4 h-4" />Envoyer la réponse</>}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
