import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useDataStore } from '../hooks/useDataStore';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PaperAirplaneIcon, EyeIcon, DocumentIcon, CalendarIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { sendBulkEmail, buildEmailTemplate, getBrevoDailyUsage } from '../utils/brevoService';
import { Newsletter } from '../types';

const AdminNewsletters: React.FC = () => {
    const { data } = useDataStore();
    const [recipientGroup, setRecipientGroup] = useState<'all_pro' | 'all_beginner' | 'custom'>('all_pro');
    const [customRecipients, setCustomRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [scheduledDate, setScheduledDate] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'compose' | 'drafts' | 'scheduled'>('compose');
    const [drafts, setDrafts] = useState<Newsletter[]>([]);
    const [scheduled, setScheduled] = useState<Newsletter[]>([]);
    const [editingDraft, setEditingDraft] = useState<Newsletter | null>(null);

    const proModelEmails = useMemo(() => data?.models.filter(m => m.email && m.level === 'Pro').map(m => ({ email: m.email!, name: m.name })) || [], [data?.models]);
    const allModelEmails = useMemo(() => data?.models.filter(m => m.email).map(m => ({ email: m.email!, name: m.name })) || [], [data?.models]);

    const loadNewsletters = () => {
        const savedDrafts = JSON.parse(localStorage.getItem('newsletter_drafts') || '[]');
        const savedScheduled = JSON.parse(localStorage.getItem('newsletter_scheduled') || '[]');
        setDrafts(savedDrafts);
        setScheduled(savedScheduled);
    };

    useEffect(() => {
        loadNewsletters();
    }, []);

    const getRecipientList = () => {
        switch (recipientGroup) {
            case 'all_pro': return proModelEmails;
            case 'all_beginner': return allModelEmails;
            case 'custom': return customRecipients.split(',').map(e => {
                const [email, name] = e.trim().split('|');
                return { email: email.trim(), name: name?.trim() || email.trim() };
            }).filter(r => r.email);
            default: return [];
        }
    };

    const handleSaveDraft = () => {
        if (!subject.trim() && !htmlContent.trim()) {
            setStatus('error');
            setStatusMessage('Le sujet et le contenu sont requis pour sauvegarder un brouillon.');
            return;
        }
        
        const draft: Newsletter = {
            id: editingDraft?.id || `draft_${Date.now()}`,
            subject: subject,
            htmlContent: htmlContent,
            status: 'draft',
            createdAt: editingDraft?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            scheduledFor: scheduledDate || undefined,
        };

        const updatedDrafts = editingDraft 
            ? drafts.map(d => d.id === editingDraft.id ? draft : d)
            : [...drafts, draft];
        
        localStorage.setItem('newsletter_drafts', JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
        setEditingDraft(null);
        setStatus('success');
        setStatusMessage('Brouillon sauvegardé avec succès.');
    };

    const handleSchedule = () => {
        if (!subject.trim() && !htmlContent.trim()) {
            setStatus('error');
            setStatusMessage('Le sujet et le contenu sont requis pour programmer l\'envoi.');
            return;
        }
        
        if (!scheduledDate) {
            setStatus('error');
            setStatusMessage('Veuillez sélectionner une date de programmation.');
            return;
        }

        const scheduledNewsletter: Newsletter = {
            id: `scheduled_${Date.now()}`,
            subject: subject,
            htmlContent: htmlContent,
            status: 'scheduled',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            scheduledFor: scheduledDate,
        };

        const updatedScheduled = [...scheduled, scheduledNewsletter];
        localStorage.setItem('newsletter_scheduled', JSON.stringify(updatedScheduled));
        setScheduled(updatedScheduled);
        clearForm();
        setStatus('success');
        setStatusMessage(`Newsletter programmé pour le ${new Date(scheduledDate).toLocaleString('fr-FR')}.`);
    };

    const handleSendNow = async () => {
        const brevoApiKey = data?.apiKeys?.brevoApiKey;
        if (!brevoApiKey) {
            setStatus('error');
            setStatusMessage('La clé API Brevo n\'est pas configurée.');
            return;
        }

        const recipients = getRecipientList();
        if (recipients.length === 0) {
            setStatus('error');
            setStatusMessage('Aucun destinataire valide trouvé.');
            return;
        }

        setStatus('loading');
        setStatusMessage('');

        try {
            const fullHtmlContent = buildEmailTemplate(htmlContent || `<p>${htmlContent.replace(/<br>/g, '</p><p>')}</p>`);
            const result = await sendBulkEmail({
                to: recipients,
                subject: subject,
                bodyHtml: htmlContent,
                apiKey: brevoApiKey,
                onProgress: (sent, total) => setStatusMessage(`Envoi en cours... ${sent}/${total}`),
            });

            const sentNewsletter: Newsletter = {
                id: `sent_${Date.now()}`,
                subject: subject,
                htmlContent: htmlContent,
                status: 'sent',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                sentAt: new Date().toISOString(),
                sentToCount: result.sent,
            };
            
            const sentNewsletters = JSON.parse(localStorage.getItem('newsletter_sent') || '[]');
            localStorage.setItem('newsletter_sent', JSON.stringify([...sentNewsletters, sentNewsletter]));

            clearForm();
            setStatus('success');
            setStatusMessage(`Newsletter envoyé à ${result.sent} destinataire(s). ${result.remainingToday} envois restants aujourd'hui.`);
        } catch (error: any) {
            setStatus('error');
            setStatusMessage(`Erreur lors de l'envoi : ${error.message}`);
            console.error(error);
        }
    };

    const clearForm = () => {
        setSubject('');
        setHtmlContent('');
        setScheduledDate('');
        setEditingDraft(null);
    };

    const loadDraft = (draft: Newsletter) => {
        setSubject(draft.subject);
        setHtmlContent(draft.htmlContent);
        setScheduledDate(draft.scheduledFor || '');
        setEditingDraft(draft);
        setActiveTab('compose');
    };

    const deleteDraft = (id: string) => {
        if (window.confirm('Supprimer ce brouillon ?')) {
            const updated = drafts.filter(d => d.id !== id);
            localStorage.setItem('newsletter_drafts', JSON.stringify(updated));
            setDrafts(updated);
        }
    };

    const deleteScheduled = (id: string) => {
        if (window.confirm('Supprimer cette programmation ?')) {
            const updated = scheduled.filter(s => s.id !== id);
            localStorage.setItem('newsletter_scheduled', JSON.stringify(updated));
            setScheduled(updated);
        }
    };

    const dailyUsage = getBrevoDailyUsage();

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Admin - Newsletters" noIndex />
            <div className="container mx-auto px-6 py-20">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Newsletters</h1>
                        <p className="admin-page-subtitle">Créez, prévisualisez, sauvegardez et programmez vos newsletters HTML.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-pm-off-white/50">Envois Brevo quotidiens</p>
                        <p className="text-sm"><span className="text-pm-gold">{dailyUsage.used}</span>/<span className="text-white">{dailyUsage.limit}</span></p>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('compose')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all ${
                            activeTab === 'compose' ? 'bg-pm-gold text-pm-dark' : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                    >
                        Rédiger
                    </button>
                    <button
                        onClick={() => setActiveTab('drafts')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${
                            activeTab === 'drafts' ? 'bg-pm-gold text-pm-dark' : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                    >
                        <DocumentIcon className="w-4 h-4" />
                        Brouillons ({drafts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('scheduled')}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${
                            activeTab === 'scheduled' ? 'bg-pm-gold text-pm-dark' : 'bg-white/5 text-white/40 hover:bg-white/10'
                        }`}
                    >
                        <CalendarIcon className="w-4 h-4" />
                        Programmés ({scheduled.length})
                    </button>
                </div>

                {statusMessage && (
                    <div className={`p-4 rounded-lg mb-6 ${status === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {statusMessage}
                    </div>
                )}

                {activeTab === 'compose' && (
                    <div className="space-y-6">
                        <div className="admin-section-wrapper">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="admin-label">Destinataires</label>
                                    <select
                                        value={recipientGroup}
                                        onChange={(e) => setRecipientGroup(e.target.value as any)}
                                        className="admin-input"
                                    >
                                        <option value="all_pro">Mannequins Pro ({proModelEmails.length})</option>
                                        <option value="custom">Adresses personnalisées</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="admin-label">Date de programmation (optionnel)</label>
                                    <input
                                        type="datetime-local"
                                        value={scheduledDate}
                                        onChange={(e) => setScheduledDate(e.target.value)}
                                        className="admin-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {recipientGroup === 'custom' && (
                            <div className="admin-section-wrapper">
                                <label className="admin-label">Adresses personnalisées (email|nom, séparées par virgule)</label>
                                <input
                                    type="text"
                                    value={customRecipients}
                                    onChange={(e) => setCustomRecipients(e.target.value)}
                                    className="admin-input"
                                    placeholder="email1@exemple.com|Nom 1, email2@exemple.com"
                                />
                            </div>
                        )}

                        <div className="admin-section-wrapper">
                            <label className="admin-label">Sujet</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="admin-input"
                                required
                            />
                        </div>

                        <div className="admin-section-wrapper">
                            <label className="admin-label">Contenu HTML</label>
                            <textarea
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                                className="admin-textarea font-mono text-xs"
                                rows={15}
                                placeholder="<h1>Titre</h1><p>Contenu de votre newsletter...</p>"
                            />
                        </div>

                        <div className="admin-section-wrapper">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-pm-gold uppercase tracking-widest">Prévisualisation</h3>
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="px-3 py-1 text-xs bg-white/5 text-white/70 rounded hover:bg-white/10"
                                >
                                    {showPreview ? 'Masquer' : 'Afficher'}
                                </button>
                            </div>
                            {showPreview && (
                                <div 
                                    className="bg-white rounded-lg max-h-96 overflow-y-auto p-4"
                                    dangerouslySetInnerHTML={{ __html: buildEmailTemplate(htmlContent) }}
                                />
                            )}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={clearForm}
                                className="px-6 py-2 bg-white/5 text-white rounded-full hover:bg-white/10"
                            >
                                Effacer
                            </button>
                            <button
                                onClick={handleSaveDraft}
                                disabled={status === 'loading'}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 text-pm-off-white rounded-full hover:bg-white/20 disabled:opacity-50"
                            >
                                <DocumentIcon className="w-5 h-5" />
                                Sauvegarder brouillon
                            </button>
                            {scheduledDate && (
                                <button
                                    onClick={handleSchedule}
                                    disabled={status === 'loading'}
                                    className="inline-flex items-center gap-2 px-6 py-2 bg-pm-gold/20 text-pm-gold rounded-full hover:bg-pm-gold/30 disabled:opacity-50"
                                >
                                    <CalendarIcon className="w-5 h-5" />
                                    Programmer
                                </button>
                            )}
                            <button
                                onClick={handleSendNow}
                                disabled={status === 'loading'}
                                className="inline-flex items-center gap-2 px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full hover:bg-white disabled:opacity-50"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                {status === 'loading' ? 'Envoi...' : 'Envoyer maintenant'}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'drafts' && (
                    <div className="admin-section-wrapper">
                        {drafts.length === 0 ? (
                            <p className="text-center text-white/40 py-8">Aucun brouillon sauvegardé.</p>
                        ) : (
                            <div className="space-y-3">
                                {drafts.map(draft => (
                                    <div key={draft.id} className="bg-pm-dark/50 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-pm-off-white">{draft.subject || 'Sans sujet'}</p>
                                            <p className="text-xs text-white/40">Modifié le {new Date(draft.updatedAt).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => loadDraft(draft)}
                                                className="px-3 py-1 text-xs bg-pm-gold/20 text-pm-gold rounded hover:bg-pm-gold/30"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => deleteDraft(draft.id)}
                                                className="p-1 text-red-400/70 hover:text-red-400"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'scheduled' && (
                    <div className="admin-section-wrapper">
                        {scheduled.length === 0 ? (
                            <p className="text-center text-white/40 py-8">Aucune newsletter programmée.</p>
                        ) : (
                            <div className="space-y-3">
                                {scheduled.map(item => (
                                    <div key={item.id} className="bg-pm-dark/50 border border-white/10 rounded-lg p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-pm-off-white">{item.subject || 'Sans sujet'}</p>
                                            <p className="text-xs text-white/40">
                                                Programmé pour le {item.scheduledFor && new Date(item.scheduledFor).toLocaleString('fr-FR')}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => deleteScheduled(item.id)}
                                            className="p-1 text-red-400/70 hover:text-red-400"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNewsletters;