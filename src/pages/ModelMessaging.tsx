import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { InternalMessage, Model, BeginnerStudent } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, 
    PaperAirplaneIcon, 
    UserGroupIcon, 
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const ModelMessaging: React.FC = () => {
    const { data, saveData } = useData();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Obtenir l'utilisateur actuel (modèle ou étudiant débutant)
    const currentUser = React.useMemo(() => {
        if (!data?.currentUser) return null;
        
        // Vérifier si c'est un modèle professionnel
        const model = data.models?.find(m => m.id === data.currentUser.id);
        if (model) return { ...model, role: 'model' as const };
        
        // Vérifier si c'est un étudiant débutant
        const student = data.beginnerStudents?.find(s => s.id === data.currentUser.id);
        if (student) return { ...student, role: 'beginner' as const };
        
        return null;
    }, [data?.currentUser, data?.models, data?.beginnerStudents]);

    const internalMessages = data?.internalMessages || [];

    // Obtenir les conversations de l'utilisateur actuel
    const conversations = React.useMemo(() => {
        if (!currentUser) return [];

        const conversationMap = new Map<string, {
            id: string;
            participant: { name: string; email: string; role: string } | null;
            lastMessage: InternalMessage | null;
            unreadCount: number;
        }>();

        internalMessages.forEach(message => {
            // Vérifier si l'utilisateur actuel est impliqué dans cette conversation
            const isInvolved = (
                (message.senderId === currentUser.id && message.senderRole === currentUser.role) ||
                (message.recipientId === currentUser.id && message.recipientRole === currentUser.role)
            );

            if (!isInvolved) return;

            const conversationId = message.conversationId;
            if (!conversationMap.has(conversationId)) {
                // Déterminer l'autre participant
                let participant: { name: string; email: string; role: string } | null = null;
                
                if (message.senderId === currentUser.id) {
                    // L'utilisateur actuel est l'expéditeur, l'autre participant est le destinataire
                    participant = {
                        name: message.recipientName,
                        email: message.recipientId,
                        role: message.recipientRole
                    };
                } else {
                    // L'utilisateur actuel est le destinataire, l'autre participant est l'expéditeur
                    participant = {
                        name: message.senderName,
                        email: message.senderId,
                        role: message.senderRole
                    };
                }

                conversationMap.set(conversationId, {
                    id: conversationId,
                    participant,
                    lastMessage: null,
                    unreadCount: 0
                });
            }

            const conversation = conversationMap.get(conversationId)!;
            if (!conversation.lastMessage || new Date(message.timestamp) > new Date(conversation.lastMessage.timestamp)) {
                conversation.lastMessage = message;
            }
            if (!message.isRead && message.senderId !== currentUser.id) {
                conversation.unreadCount++;
            }
        });

        return Array.from(conversationMap.values()).sort((a, b) => {
            if (!a.lastMessage || !b.lastMessage) return 0;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [internalMessages, currentUser]);

    // Obtenir les messages de la conversation sélectionnée
    const currentMessages = React.useMemo(() => {
        if (!selectedConversation || !currentUser) return [];
        return internalMessages
            .filter(msg => msg.conversationId === selectedConversation)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [internalMessages, selectedConversation, currentUser]);

    // Envoyer un message
    const sendMessage = async () => {
        if (!messageContent.trim() || !selectedConversation || !currentUser) return;

        const conversation = conversations.find(c => c.id === selectedConversation);
        if (!conversation?.participant) return;

        const newMessage: InternalMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: selectedConversation,
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderRole: currentUser.role,
            recipientId: conversation.participant.email, // L'ID du destinataire
            recipientName: conversation.participant.name,
            recipientRole: conversation.participant.role as 'admin' | 'model' | 'beginner',
            content: messageContent,
            timestamp: new Date().toISOString(),
            isRead: true,
            messageType: 'text'
        };

        const updatedData = {
            ...data,
            internalMessages: [...internalMessages, newMessage]
        };

        await saveData(updatedData as any);
        setMessageContent('');
    };

    // Marquer les messages comme lus
    useEffect(() => {
        if (selectedConversation && currentUser) {
            const unreadMessages = currentMessages.filter(msg => !msg.isRead && msg.senderId !== currentUser.id);
            if (unreadMessages.length > 0) {
                const updatedMessages = internalMessages.map(msg => 
                    unreadMessages.some(unread => unread.id === msg.id) 
                        ? { ...msg, isRead: true }
                        : msg
                );
                saveData({ ...data, internalMessages: updatedMessages } as any);
            }
        }
    }, [selectedConversation, currentMessages, internalMessages, currentUser, data, saveData]);

    // Auto-scroll vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    if (!currentUser) {
        return (
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-pm-off-white/70">Vous devez être connecté pour accéder à la messagerie.</p>
                    <Link to="/login" className="text-pm-gold hover:underline mt-4 inline-block">
                        Se connecter
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Messagerie Interne | PMM" />
            <div className="container mx-auto px-6 py-8">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-pm-gold mb-6 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Messagerie Interne</h1>
                        <p className="text-pm-off-white/70 mt-2">
                            Communiquez avec l'équipe PMM
                            {currentUser.role === 'model' && ' (Modèle Professionnel)'}
                            {currentUser.role === 'beginner' && ' (Étudiant Débutant)'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    {/* Liste des conversations */}
                    <div className="bg-black border border-pm-gold/10 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-pm-gold mb-4">Conversations</h3>
                        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
                            {conversations.map(conversation => (
                                <div
                                    key={conversation.id}
                                    onClick={() => setSelectedConversation(conversation.id)}
                                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                        selectedConversation === conversation.id
                                            ? 'bg-pm-gold/20 border border-pm-gold'
                                            : 'bg-pm-dark/50 hover:bg-pm-dark border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-pm-off-white">
                                                {conversation.participant?.name || 'Utilisateur inconnu'}
                                            </p>
                                            <p className="text-sm text-pm-off-white/70">
                                                {conversation.participant?.role === 'admin' ? 'Administrateur' : 
                                                 conversation.participant?.role === 'model' ? 'Modèle Professionnel' : 
                                                 'Étudiant Débutant'}
                                            </p>
                                        </div>
                                        {conversation.unreadCount > 0 && (
                                            <span className="bg-pm-gold text-pm-dark text-xs font-bold px-2 py-1 rounded-full">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    {conversation.lastMessage && (
                                        <p className="text-xs text-pm-off-white/60 mt-1 truncate">
                                            {conversation.lastMessage.content}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {conversations.length === 0 && (
                                <p className="text-pm-off-white/50 text-center py-8">
                                    Aucune conversation
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Zone de chat */}
                    <div className="lg:col-span-2 bg-black border border-pm-gold/10 rounded-lg flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* En-tête de la conversation */}
                                <div className="p-4 border-b border-pm-gold/10">
                                    {(() => {
                                        const conversation = conversations.find(c => c.id === selectedConversation);
                                        return (
                                            <div>
                                                <h3 className="text-lg font-semibold text-pm-gold">
                                                    {conversation?.participant?.name || 'Utilisateur inconnu'}
                                                </h3>
                                                <p className="text-sm text-pm-off-white/70">
                                                    {conversation?.participant?.role === 'admin' ? 'Administrateur' : 
                                                     conversation?.participant?.role === 'model' ? 'Modèle Professionnel' : 
                                                     'Étudiant Débutant'}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                    {currentMessages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] p-3 rounded-lg ${
                                                    message.senderId === currentUser.id
                                                        ? 'bg-pm-gold text-pm-dark'
                                                        : 'bg-pm-dark/50 text-pm-off-white border border-pm-gold/20'
                                                }`}
                                            >
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                                <p className="text-xs opacity-70 mt-1">
                                                    {new Date(message.timestamp).toLocaleString('fr-FR')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Formulaire d'envoi */}
                                <div className="p-4 border-t border-pm-gold/10">
                                    <div className="flex gap-2">
                                        <textarea
                                            value={messageContent}
                                            onChange={(e) => setMessageContent(e.target.value)}
                                            placeholder="Tapez votre message..."
                                            className="flex-1 px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none"
                                            rows={2}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }
                                            }}
                                        />
                                        <button
                                            onClick={sendMessage}
                                            disabled={!messageContent.trim()}
                                            className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <PaperAirplaneIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4" />
                                    <p className="text-pm-off-white/70">Sélectionnez une conversation pour commencer</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelMessaging;
