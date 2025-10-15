
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ContactMessage, InternalMessage, InternalParticipant, InternalAttachment } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Lu' | 'Archivé';

const AdminMessages: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');
    const [composeOpen, setComposeOpen] = useState(false);
    const [compose, setCompose] = useState<{to: string; subject: string; body: string; attachments: InternalAttachment[]}>({ to: '', subject: '', body: '', attachments: [] });

    const messages = useMemo(() => {
        return [...(data?.contactMessages || [])].sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
    }, [data?.contactMessages]);

    const filteredMessages = useMemo(() => {
        if (filter === 'Toutes') return messages;
        return messages.filter(req => req.status === filter);
    }, [filter, messages]);

    const handleUpdateStatus = async (messageId: string, status: ContactMessage['status']) => {
        if (!data) return;
        const updatedMessages = messages.map(msg => msg.id === messageId ? { ...msg, status } : msg);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleDelete = async (messageId: string) => {
        if (!data || !window.confirm("Supprimer ce message ?")) return;
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    // Internal messaging helpers
    const currentAdminId = typeof window !== 'undefined' ? sessionStorage.getItem('admin_id') || '' : '';
    const allParticipants: InternalParticipant[] = [
        ...(data?.adminUsers || []).map(a => ({ kind: 'admin', id: a.id, name: a.name, email: a.email })),
        ...(data?.models || []).map(m => ({ kind: 'model', id: m.id, name: m.name, email: m.email })),
        ...(data?.beginnerStudents || []).map(b => ({ kind: 'beginner', id: b.id, name: b.name })),
        ...(data?.juryMembers || []).map(j => ({ kind: 'jury', id: j.id, name: j.name })),
        ...(data?.registrationStaff || []).map(r => ({ kind: 'registration', id: r.id, name: r.name })),
    ];
    const resolveParticipant = (nameOrId: string): InternalParticipant | null => {
        const needle = nameOrId.toLowerCase().trim();
        return allParticipants.find(p => p.id === nameOrId || p.name.toLowerCase() === needle) || null;
    };

    const handleSendInternal = async () => {
        if (!data) return;
        const to = compose.to.split(',').map(s => s.trim()).filter(Boolean).map(resolveParticipant).filter(Boolean) as InternalParticipant[];
        if (to.length === 0) { alert('Destinataire introuvable'); return; }
        const from = resolveParticipant(currentAdminId) || { kind: 'admin', id: currentAdminId, name: 'Administrateur' };
        const message: InternalMessage = {
            id: `msg-${Date.now()}`,
            createdAt: new Date().toISOString(),
            from,
            to,
            subject: compose.subject,
            body: compose.body,
            attachments: compose.attachments,
            readBy: [from.id],
        };
        const updated = [ ...(data.internalMessages || []), message ];
        await saveData({ ...data, internalMessages: updated });
        setCompose({ to: '', subject: '', body: '', attachments: [] });
        setComposeOpen(false);
        alert('Message envoyé.');
    };

    const getStatusColor = (status: ContactMessage['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Lu': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Archivé': return 'bg-gray-500/20 text-gray-400 border-gray-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Messages de Contact" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <div className="flex items-end justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-4xl font-playfair text-pm-gold">Messagerie & Contact</h1>
                    <p className="text-pm-off-white/70 mt-2">Gérez les messages reçus et envoyez des messages internes.</p>
                  </div>
                  <button onClick={() => setComposeOpen(true)} className="px-4 py-2 bg-pm-gold text-pm-dark rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white">Nouveau Message</button>
                </div>

                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    {(['Toutes', 'Nouveau', 'Lu', 'Archivé'] as const).map(f => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 text-sm uppercase tracking-wider rounded-full transition-all ${filter === f ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold/20'}`}>
                            {f}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredMessages.map(msg => (
                        <div key={msg.id} className="bg-black p-4 border border-pm-gold/10 rounded-lg">
                            <div className="flex justify-between items-start flex-wrap gap-4">
                                <div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusColor(msg.status)}`}>{msg.status}</span>
                                    <h2 className="text-xl font-bold text-pm-gold mt-2">{msg.subject}</h2>
                                    <p className="text-sm text-pm-off-white/80">de <span className="font-semibold">{msg.name}</span> ({msg.email})</p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-xs text-pm-off-white/60">Reçu le {new Date(msg.submissionDate).toLocaleString('fr-FR')}</p>
                                </div>
                            </div>
                            <p className="mt-4 pt-3 border-t border-pm-gold/10 text-sm text-pm-off-white/90 whitespace-pre-wrap bg-pm-dark/50 p-3 rounded-md">
                                {msg.message}
                            </p>
                            <div className="mt-4 flex justify-end items-center gap-2">
                                {msg.status === 'Nouveau' && (
                                    <button onClick={() => handleUpdateStatus(msg.id, 'Lu')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-yellow-500 text-yellow-300 rounded-full hover:bg-yellow-500/20">
                                        Marquer comme Lu
                                    </button>
                                )}
                                {msg.status !== 'Archivé' && (
                                     <button onClick={() => handleUpdateStatus(msg.id, 'Archivé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-500 text-gray-400 rounded-full hover:bg-gray-500/20">
                                        Archiver
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                     {filteredMessages.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <EyeIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucun message dans cette catégorie.</p>
                        </div>
                    )}
                </div>

                {/* Internal messages (simple list) */}
                <div className="mt-12">
                  <h2 className="admin-section-title">Messages Internes</h2>
                  <div className="space-y-3">
                    {(data?.internalMessages || []).slice().reverse().map(m => (
                      <div key={m.id} className="bg-black p-4 border border-pm-gold/10 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-pm-off-white/70">De <span className="font-semibold">{m.from.name}</span> ➜ {m.to.map(t => t.name).join(', ')}</p>
                            <h3 className="text-lg font-bold text-pm-gold mt-1">{m.subject || '(Sans objet)'}</h3>
                          </div>
                          <p className="text-xs text-pm-off-white/60">{new Date(m.createdAt).toLocaleString('fr-FR')}</p>
                        </div>
                        <p className="mt-3 whitespace-pre-wrap text-sm text-pm-off-white/90">{m.body}</p>
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-3 text-xs text-pm-off-white/70">Pièces jointes: {m.attachments.map(a => a.filename).join(', ')}</div>
                        )}
                      </div>
                    ))}
                    {(data?.internalMessages || []).length === 0 && <p className="text-pm-off-white/60">Aucun message interne.</p>}
                  </div>
                </div>
            </div>
        </div>

        {/* Compose Modal */}
        {composeOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg shadow-2xl w-full max-w-2xl">
              <div className="p-4 border-b border-pm-gold/20 flex items-center justify-between">
                <h3 className="text-xl font-playfair text-pm-gold">Nouveau message</h3>
                <button onClick={() => setComposeOpen(false)} className="text-pm-off-white/70 hover:text-white">Fermer</button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="admin-label">À (noms ou IDs, séparés par des virgules)</label>
                  <input className="admin-input" value={compose.to} onChange={e => setCompose(c => ({...c, to: e.target.value}))} placeholder="ex: Administrateur, Noemi Kim" />
                </div>
                <div>
                  <label className="admin-label">Objet</label>
                  <input className="admin-input" value={compose.subject} onChange={e => setCompose(c => ({...c, subject: e.target.value}))} />
                </div>
                <div>
                  <label className="admin-label">Message</label>
                  <textarea className="admin-input admin-textarea" rows={6} value={compose.body} onChange={e => setCompose(c => ({...c, body: e.target.value}))} />
                </div>
                <div>
                  <label className="admin-label">Pièces jointes (URL publiques pour l'instant)</label>
                  <input className="admin-input" placeholder="https://..." onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const url = (e.target as HTMLInputElement).value.trim();
                      if (!url) return;
                      const filename = url.split('/').pop() || 'fichier';
                      setCompose(c => ({...c, attachments: [ ...(c.attachments || []), { filename, contentType: 'application/octet-stream', url } ]}));
                      (e.target as HTMLInputElement).value = '';
                    }
                  }} />
                  {compose.attachments.length > 0 && (
                    <p className="text-xs text-pm-off-white/60 mt-2">{compose.attachments.map(a => a.filename).join(', ')}</p>
                  )}
                </div>
                <div className="text-right">
                  <button onClick={handleSendInternal} className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white">Envoyer</button>
                </div>
              </div>
            </div>
          </div>
        )}
    );
};

export default AdminMessages;
