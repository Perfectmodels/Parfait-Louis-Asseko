
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ContactMessage, InternalMessage, InternalParticipant, InternalAttachment } from '../types';
import AIAssistant from '../components/AIAssistant';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Lu' | 'Archivé';

const AdminMessages: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');
    const [composeOpen, setComposeOpen] = useState(false);
    const [compose, setCompose] = useState<{to: string; subject: string; body: string; attachments: InternalAttachment[]; template: string}>({ to: '', subject: '', body: '', attachments: [], template: 'plain' });
    const [showAI, setShowAI] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

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
        const htmlBody = renderEmailTemplate(compose.template, compose.subject, compose.body);
        const message: InternalMessage = {
            id: `msg-${Date.now()}`,
            createdAt: new Date().toISOString(),
            from,
            to,
            subject: compose.subject,
            body: htmlBody,
            attachments: compose.attachments,
            readBy: [from.id],
        };
        const updated = [ ...(data.internalMessages || []), message ];
        await saveData({ ...data, internalMessages: updated });
        setCompose({ to: '', subject: '', body: '', attachments: [], template: 'plain' });
        setComposeOpen(false);
        alert('Message envoyé.');
    };

    const handleSendEmail = async () => {
      try {
        setIsSendingEmail(true);
        const tokens = compose.to.split(',').map(s => s.trim()).filter(Boolean);
        const toEmails: string[] = [];
        for (const t of tokens) {
          if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) {
            toEmails.push(t);
            continue;
          }
          const p = resolveParticipant(t);
          if (p?.email) toEmails.push(p.email);
        }
        const unique = Array.from(new Set(toEmails));
        if (unique.length === 0) { alert("Aucune adresse e-mail valide trouvée pour les destinataires."); return; }
        const html = renderEmailTemplate(compose.template, compose.subject, compose.body);
        const resp = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ to: unique, subject: compose.subject || '(Sans objet)', html, attachments: compose.attachments || [] }),
        });
        if (!resp.ok) {
          const t = await resp.text();
          throw new Error(t);
        }
        alert('E-mail envoyé avec succès.');
      } catch (e: any) {
        console.error('send-email failed', e);
        alert("Échec de l'envoi de l'e-mail.");
      } finally {
        setIsSendingEmail(false);
      }
    };

    const renderEmailTemplate = (tpl: string, subject: string, body: string): string => {
      const safeBody = body.replace(/\n/g, '<br/>');
      const base = (content: string) => `
        <div style="font-family:Montserrat,Arial,sans-serif;background:#0b0b0b;color:#f6f6f6;padding:24px">
          <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;background:#111;border:1px solid rgba(212,175,55,0.2)">
            <tr><td style="padding:24px">
              <h1 style="margin:0 0 16px;font-size:22px;color:#D4AF37;font-family:'Playfair Display',serif">${subject || 'Message'}</h1>
              ${content}
              <hr style="border:none;border-top:1px solid rgba(212,175,55,0.2);margin:24px 0"/>
              <p style="font-size:12px;color:#aaa;margin:0">Perfect Models Management • Libreville, Gabon</p>
            </td></tr>
          </table>
        </div>`;
      if (tpl === 'partnership') {
        return base(`
          <p style="margin:0 0 12px">Bonjour,</p>
          <p style="margin:0 0 12px">${safeBody}</p>
          <div style="margin-top:16px;padding:12px;border:1px solid rgba(212,175,55,0.3);background:#0f0f0f;border-radius:8px">
            <p style="margin:0;color:#D4AF37;font-weight:700">Proposition de Partenariat</p>
            <p style="margin:8px 0 0;color:#ddd">Découvrons comment créer de la valeur ensemble autour de la mode.</p>
          </div>
        `);
      }
      if (tpl === 'sponsorship') {
        return base(`
          <p style="margin:0 0 12px">Bonjour,</p>
          <p style="margin:0 0 12px">${safeBody}</p>
          <ul style="margin:12px 0;padding-left:20px;color:#ddd">
            <li>Visibilité événementielle (logo, annonces)</li>
            <li>Activation de marque (stands, contenus)</li>
            <li>Relations presse et influence</li>
          </ul>
        `);
      }
      return base(`<p style="margin:0 0 12px">${safeBody}</p>`);
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
                        <div className="mt-3 text-sm text-pm-off-white/90" dangerouslySetInnerHTML={{ __html: m.body }} />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="admin-label">Objet</label>
                    <input className="admin-input" value={compose.subject} onChange={e => setCompose(c => ({...c, subject: e.target.value}))} />
                  </div>
                  <div>
                    <label className="admin-label">Template</label>
                    <select className="admin-input" value={compose.template} onChange={e => setCompose(c => ({...c, template: e.target.value}))}>
                      <option value="plain">Générique</option>
                      <option value="partnership">Demande de Partenariat</option>
                      <option value="sponsorship">Demande de Sponsoring</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="admin-label">Message</label>
                  <div className="flex items-center justify-end mb-2">
                    <button type="button" onClick={() => setShowAI(true)} className="text-xs text-pm-gold hover:underline">Assistance IA</button>
                  </div>
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
                <div>
                  <label className="admin-label">Prévisualisation</label>
                  <div className="p-4 bg-black border border-pm-gold/20 rounded min-h-[120px]" dangerouslySetInnerHTML={{ __html: renderEmailTemplate(compose.template, compose.subject, compose.body) }} />
                </div>
                <div className="flex flex-wrap gap-3 justify-end">
                  <button onClick={handleSendInternal} className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white">Envoyer (interne)</button>
                  <button onClick={handleSendEmail} disabled={isSendingEmail} className="px-6 py-2 border border-pm-gold text-pm-gold rounded-full font-bold uppercase tracking-widest text-sm hover:bg-pm-gold/10 disabled:opacity-50">
                    {isSendingEmail ? 'Envoi…' : 'Envoyer par e-mail'}
                  </button>
                </div>
              </div>
            </div>
            {showAI && (
              <AIAssistant
                isOpen={showAI}
                onClose={() => setShowAI(false)}
                onInsertContent={(content) => setCompose(c => ({...c, body: content }))}
                fieldName="Email"
                initialPrompt="Transforme ce texte en email HTML élégant pour une demande de partenariat/sponsoring, ton professionnel et chaleureux."
              />
            )}
          </div>
        )}
    );
};

export default AdminMessages;
