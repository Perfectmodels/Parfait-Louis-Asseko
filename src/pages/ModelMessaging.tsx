import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { 
    ChatBubbleLeftRightIcon, 
    PaperAirplaneIcon,
    UserIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { InternalMessage, Conversation } from '../types';
import SEO from '../components/SEO';

const ModelMessaging: React.FC = () => {
    const { data, saveData } = useData();
    const [messageContent, setMessageContent] = useState('');
    const [currentUser] = useState(() => {
        // Récupérer l'utilisateur actuel depuis le localStorage
        const userData = localStorage.getItem('pmm_user');
        return userData ? JSON.parse(userData) : null;
    });

    // Récupérer la conversation de l'utilisateur actuel
    const conversation = useMemo(() => {
        if (!currentUser || !data?.internalMessages) return null;

        const conversationId = `${currentUser.role === 'model' ? 'model' : 'beginner'}_${currentUser.id}`;
        const messages = data.internalMessages.filter(msg => 
            msg.conversationId === conversationId
        ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        return {
            id: conversationId,
            messages,
            unreadCount: messages.filter(msg => !msg.isRead && msg.senderRole !== currentUser.role).length
        };
    }, [currentUser, data?.internalMessages]);

    // Marquer les messages comme lus en temps réel
    useEffect(() => {
        if (conversation?.messages) {
            const unreadMessages = conversation.messages.filter(msg => 
                !msg.isRead && msg.senderRole !== currentUser?.role
            );
            
            if (unreadMessages.length > 0) {
                // Marquer automatiquement comme lus après 2 secondes
                const timer = setTimeout(() => {
                    unreadMessages.forEach(message => {
                        markAsRead(message.id);
                    });
                }, 2000);
                
                return () => clearTimeout(timer);
            }
        }
    }, [conversation?.messages, currentUser?.role]);

    const sendMessage = async () => {
        if (!messageContent.trim() || !conversation || !data || !currentUser) return;

        const newMessage: InternalMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: conversation.id,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            recipientId: 'admin',
            recipientName: 'Administrateur',
            recipientRole: 'admin',
            content: messageContent.trim(),
            timestamp: new Date().toISOString(),
            isRead: true,
            messageType: 'text'
        };

        const updatedMessages = [...(data.internalMessages || []), newMessage];
        await saveData({ ...data, internalMessages: updatedMessages });
        setMessageContent('');
    };

    const markAsRead = async (messageId: string) => {
        if (!data) return;

        const updatedMessages = data.internalMessages?.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
        ) || [];

        await saveData({ ...data, internalMessages: updatedMessages });
    };

    // Marquer les messages comme lus quand ils sont affichés
    useEffect(() => {
        if (conversation?.messages) {
            conversation.messages.forEach(message => {
                if (!message.isRead && message.senderRole !== currentUser?.role) {
                    markAsRead(message.id);
                }
            });
        }
    }, [conversation?.messages, currentUser?.role]);

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black flex items-center justify-center">
                <div className="text-center text-pm-off-white/70">
                    <UserIcon className="w-16 h-16 mx-auto mb-4 text-pm-gold/50" />
                    <h2 className="text-xl font-playfair text-pm-gold mb-2">
                        Accès non autorisé
                    </h2>
                    <p>Vous devez être connecté pour accéder à la messagerie.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black">
            <SEO title="Messagerie - Perfect Models Management" />
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold mb-4">
                        Messagerie Interne
                    </h1>
                    <p className="text-pm-off-white/70">
                        Communiquez directement avec l'administration
                    </p>
                </div>

                {/* Zone de chat */}
                <div className="bg-black/50 border border-pm-gold/20 rounded-2xl overflow-hidden">
                    {/* Header de la conversation */}
                    <div className="p-6 border-b border-pm-gold/20 bg-pm-gold/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-pm-gold/20 flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-pm-gold" />
                            </div>
                            <div>
                                <h3 className="text-xl font-playfair text-pm-gold">
                                    Administration
                                </h3>
                                <p className="text-pm-off-white/70">
                                    {conversation?.unreadCount > 0 && (
                                        <span className="text-pm-gold">
                                            {conversation.unreadCount} message(s) non lu(s)
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-6 space-y-4">
                        {!conversation || conversation.messages.length === 0 ? (
                            <div className="text-center text-pm-off-white/70 py-8">
                                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4 text-pm-gold/50" />
                                <p>Aucun message dans cette conversation</p>
                                <p className="text-sm mt-2">
                                    Envoyez un message pour commencer la conversation
                                </p>
                            </div>
                        ) : (
                            conversation.messages.map(message => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.senderRole === currentUser.role ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                            message.senderRole === currentUser.role
                                                ? 'bg-pm-gold text-pm-dark'
                                                : 'bg-pm-off-white/10 text-pm-off-white'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className={`text-xs ${
                                                message.senderRole === currentUser.role 
                                                    ? 'text-pm-dark/70' 
                                                    : 'text-pm-off-white/50'
                                            }`}>
                                                {message.senderName}
                                            </p>
                                            <p className={`text-xs ${
                                                message.senderRole === currentUser.role 
                                                    ? 'text-pm-dark/70' 
                                                    : 'text-pm-off-white/50'
                                            }`}>
                                                {new Date(message.timestamp).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Zone de saisie */}
                    <div className="p-6 border-t border-pm-gold/20">
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={messageContent}
                                onChange={(e) => setMessageContent(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Tapez votre message..."
                                className="flex-1 px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-xl text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!messageContent.trim()}
                                className="px-6 py-3 bg-pm-gold text-pm-dark rounded-xl hover:bg-yellow-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                Envoyer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Informations */}
                <div className="mt-8 text-center text-pm-off-white/60 text-sm">
                    <p>
                        💡 <strong>Astuce :</strong> Vous pouvez poser des questions, demander des informations 
                        ou signaler des problèmes directement à l'administration.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ModelMessaging;
