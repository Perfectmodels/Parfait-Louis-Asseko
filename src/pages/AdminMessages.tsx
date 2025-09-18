import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { ContactMessage, InternalMessage } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, EyeIcon, PaperAirplaneIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

type StatusFilter = 'Toutes' | 'Nouveau' | 'Lu' | 'Archivé';

const AdminMessages: React.FC = () => {
    const { data, saveData } = useData();
    const [filter, setFilter] = useState<StatusFilter>('Toutes');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const messages = data?.contactMessages || [];

    const filteredMessages = useMemo(() => {
        if (filter === 'Toutes') return messages;
        return messages.filter(msg => msg.status === filter);
    }, [messages, filter]);

    const handleUpdateStatus = async (messageId: string, newStatus: ContactMessage['status']) => {
        if (!data) return;
        
        const updatedMessages = messages.map(msg => 
            msg.id === messageId ? { ...msg, status: newStatus } : msg
        );
        
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleDelete = async (messageId: string) => {
        if (!data) return;
        
        const updatedMessages = messages.filter(msg => msg.id !== messageId);
        await saveData({ ...data, contactMessages: updatedMessages });
    };

    const handleReply = async (messageId: string) => {
        if (!replyContent.trim()) return;
        
        const message = messages.find(m => m.id === messageId);
        if (!message) {
            alert('Erreur: Message introuvable.');
            return;
        }

        const apiKey = data?.apiKeys?.brevoApiKey || (import.meta as any).env?.VITE_BREVO_API_KEY;
        if (!apiKey) {
            alert('Erreur: Clé API Brevo non configurée. Veuillez configurer la clé API dans les paramètres admin.');
            return;
        }

        try {
            // Envoyer l'email de réponse via Brevo
            await sendReplyEmail(message, replyContent, apiKey);
            
            // Créer un message interne pour sauvegarder la réponse
            const replyMessage: InternalMessage = {
                id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                conversationId: `contact_${messageId}`,
                senderId: 'admin',
                senderName: 'Administrateur',
                senderRole: 'admin',
                recipientId: message.email,
                recipientName: message.name,
                recipientRole: 'model',
                content: replyContent,
                timestamp: new Date().toISOString(),
                isRead: true,
                messageType: 'text',
                replyTo: messageId
            };

            // Sauvegarder le message de réponse dans les données
            const updatedData = {
                ...data,
                internalMessages: [...(data?.internalMessages || []), replyMessage]
            };
            await saveData(updatedData as any);
            
            // Marquer le message comme lu après réponse
            await handleUpdateStatus(messageId, 'Lu');
            
            // Réinitialiser le formulaire de réponse
            setReplyingTo(null);
            setReplyContent('');
            
            alert(`Réponse envoyée avec succès à ${message.name}`);
        } catch (error) {
            console.error('Erreur envoi réponse:', error);
            const errorMessage = (error as Error).message || 'Erreur inconnue';
            alert(`Erreur lors de l'envoi de la réponse: ${errorMessage}\n\nVeuillez vérifier la configuration Brevo dans /admin/email-diagnostic`);
        }
    };

    const getStatusColor = (status: ContactMessage['status']) => {
        switch (status) {
            case 'Nouveau': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            case 'Lu': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'Archivé': return 'bg-gray-500/20 text-gray-400 border-gray-500';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    // Fonction pour récupérer les réponses liées à un message
    const getRepliesForMessage = (messageId: string) => {
        return data?.internalMessages?.filter(msg => 
            msg.replyTo === messageId && msg.senderRole === 'admin'
        ) || [];
    };
    
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Messages de Contact" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Messages de Contact</h1>
                        <p className="text-pm-off-white/70 mt-2">Gérez les messages reçus via le formulaire de contact public.</p>
                    </div>
                    <Link 
                        to="/admin/email-diagnostic" 
                        className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        Diagnostic Email
                    </Link>
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
                                    <button onClick={() => setReplyingTo(replyingTo === msg.id ? null : msg.id)} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-blue-500 text-blue-300 rounded-full hover:bg-blue-500/20 flex items-center gap-1">
                                        <ArrowUturnLeftIcon className="w-3 h-3" />
                                        Répondre
                                    </button>
                                )}
                                {msg.status !== 'Archivé' && (
                                     <button onClick={() => handleUpdateStatus(msg.id, 'Archivé')} className="px-3 py-1 text-xs font-bold uppercase tracking-wider border border-gray-500 text-gray-400 rounded-full hover:bg-gray-500/20">
                                        Archiver
                                    </button>
                                )}
                                <button onClick={() => handleDelete(msg.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                            
                            {/* Formulaire de réponse */}
                            {replyingTo === msg.id && (
                                <div className="mt-4 p-4 bg-pm-dark/50 border border-pm-gold/20 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ArrowUturnLeftIcon className="w-4 h-4 text-pm-gold" />
                                        <span className="text-sm font-semibold text-pm-gold">Répondre à {msg.name}</span>
                                    </div>
                                    <textarea
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        placeholder="Tapez votre réponse..."
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none"
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button
                                            onClick={() => {
                                                setReplyingTo(null);
                                                setReplyContent('');
                                            }}
                                            className="px-3 py-1 text-sm text-pm-off-white/70 hover:text-pm-off-white transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            onClick={() => handleReply(msg.id)}
                                            disabled={!replyContent.trim()}
                                            className="px-4 py-1 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                                        >
                                            <PaperAirplaneIcon className="w-4 h-4" />
                                            Envoyer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Affichage des réponses envoyées */}
                            {getRepliesForMessage(msg.id).length > 0 && (
                                <div className="mt-4 pt-4 border-t border-pm-gold/20">
                                    <h4 className="text-sm font-semibold text-pm-gold mb-3 flex items-center gap-2">
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        Réponses envoyées ({getRepliesForMessage(msg.id).length})
                                    </h4>
                                    <div className="space-y-3">
                                        {getRepliesForMessage(msg.id)
                                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                                            .map((reply) => (
                                                <div key={reply.id} className="bg-pm-gold/10 border border-pm-gold/30 rounded-lg p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs font-semibold text-pm-gold">
                                                            Réponse envoyée par {reply.senderName}
                                                        </span>
                                                        <span className="text-xs text-pm-off-white/60">
                                                            {new Date(reply.timestamp).toLocaleString('fr-FR')}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-pm-off-white/90 whitespace-pre-wrap">
                                                        {reply.content}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                     {filteredMessages.length === 0 && (
                        <div className="text-center p-16 bg-black rounded-lg border border-pm-gold/10">
                            <EyeIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucun message dans cette catégorie.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Fonction pour envoyer une réponse par email via Brevo
async function sendReplyEmail(message: ContactMessage, replyContent: string, apiKey: string) {
    if (!apiKey) {
        throw new Error('Clé API Brevo manquante');
    }

    const emailHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 20px; border-radius: 10px;">
                <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">Perfect Models Management</h1>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Réponse à votre message</h2>
                    <p style="color: #666; margin-bottom: 15px;">Bonjour ${message.name},</p>
                    <p style="color: #333; white-space: pre-wrap; line-height: 1.6;">${replyContent}</p>
                </div>
                
                <div style="background: #e9ecef; padding: 15px; border-radius: 5px; border-left: 4px solid #D4AF37;">
                    <h3 style="color: #495057; margin-top: 0;">Votre message original :</h3>
                    <p style="color: #6c757d; margin-bottom: 5px;"><strong>Sujet :</strong> ${message.subject}</p>
                    <p style="color: #6c757d; white-space: pre-wrap; font-style: italic;">${message.message}</p>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    <p style="color: #6c757d; font-size: 0.9em; margin: 0;">
                        Cet email a été envoyé depuis le système de gestion de Perfect Models Management.<br>
                        Pour toute question, contactez-nous à <a href="mailto:contact@perfectmodels.ga" style="color: #D4AF37;">contact@perfectmodels.ga</a>
                    </p>
                </div>
            </div>
        </div>
    `;

    const emailData = {
        sender: { 
            name: "Perfect Models Management", 
            email: "Contact@perfectmodels.ga" 
        },
        to: [{ 
            email: message.email, 
            name: message.name 
        }],
        subject: `Re: ${message.subject}`,
        htmlContent: emailHtml
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Erreur Brevo: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        console.log('Email de réponse envoyé avec succès:', result);
        return result;
    } catch (error) {
        console.error('Erreur envoi email de réponse:', error);
        throw error;
    }
}

export default AdminMessages;