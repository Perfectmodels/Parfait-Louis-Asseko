import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

const AdminMailing: React.FC = () => {
    const { data } = useData();
    const [recipientGroup, setRecipientGroup] = useState('all_pro');
    const [customRecipients, setCustomRecipients] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const proModelEmails = useMemo(() => data?.models.filter(m => m.email).map(m => m.email!) || [], [data?.models]);
    // FIX: Removed beginnerEmails as the feature is deprecated.

    const getRecipientList = () => {
        switch (recipientGroup) {
            case 'all_pro': return proModelEmails;
            // FIX: Removed case for 'all_beginner' as the feature is deprecated.
            case 'custom': return customRecipients.split(',').map(e => e.trim()).filter(e => e);
            default: return [];
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        const brevoApiKey = data?.apiKeys?.brevoApiKey;
        if (!brevoApiKey || brevoApiKey === 'VOTRE_CLÉ_API_BREVO_ICI') {
            setStatus('error');
            setStatusMessage('La clé API Brevo n\'est pas configurée dans les paramètres.');
            return;
        }

        const recipients = getRecipientList();
        if (recipients.length === 0) {
            setStatus('error');
            setStatusMessage('Aucun destinataire valide trouvé.');
            return;
        }

        const emailData = {
            sender: {
                name: "Perfect Models Management",
                email: "contact@perfectmodels.ga"
            },
            to: recipients.map(email => ({ email })),
            subject: subject,
            htmlContent: `<p>${message.replace(/\n/g, '<br>')}</p>`
        };
        
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': brevoApiKey,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `Erreur API: ${response.statusText}`);
            }

            setStatus('success');
            setStatusMessage(`Email envoyé avec succès à ${recipients.length} destinataire(s).`);
            setSubject('');
            setMessage('');
            setCustomRecipients('');

        } catch (error: any) {
            setStatus('error');
            setStatusMessage(`Erreur lors de l'envoi : ${error.message}`);
            console.error(error);
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Mailing" noIndex />
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Mailing</h1>
                        <p className="admin-page-subtitle">Envoyez des communications par e-mail.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="admin-section-wrapper mt-8 space-y-6">
                    <div>
                        <label className="admin-label">Destinataires</label>
                        <select
                            value={recipientGroup}
                            onChange={(e) => setRecipientGroup(e.target.value)}
                            className="admin-input"
                        >
                            <option value="all_pro">Tous les mannequins Pro ({proModelEmails.length})</option>
                            {/* FIX: Removed option for beginner students as the feature is deprecated. */}
                            <option value="custom">Adresses personnalisées</option>
                        </select>
                    </div>

                    {recipientGroup === 'custom' && (
                        <div>
                            <label className="admin-label">Adresses personnalisées (séparées par une virgule)</label>
                            <input
                                type="text"
                                value={customRecipients}
                                onChange={(e) => setCustomRecipients(e.target.value)}
                                className="admin-input"
                                placeholder="email1@example.com, email2@example.com"
                            />
                        </div>
                    )}

                    <div>
                        <label className="admin-label">Sujet</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="admin-input"
                            required
                        />
                    </div>

                    <div>
                        <label className="admin-label">Message</label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="admin-textarea"
                            rows={12}
                            required
                        />
                    </div>

                    <div className="flex justify-end items-center gap-4">
                        {statusMessage && (
                            <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {statusMessage}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="inline-flex items-center gap-2 px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white disabled:opacity-50"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                            {status === 'loading' ? 'Envoi...' : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminMailing;


