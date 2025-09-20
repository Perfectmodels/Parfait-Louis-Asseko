import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../contexts/DataContext';
import { InternalMessage, Model, BeginnerStudent } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, 
    PaperAirplaneIcon, 
    UserGroupIcon, 
    MagnifyingGlassIcon,
    XMarkIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AdminMessaging: React.FC = () => {
    const { data, saveData } = useData();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const [showNewConversationModal, setShowNewConversationModal] = useState(false);
    const [newConversationSearch, setNewConversationSearch] = useState('');
    const [searchResults, setSearchResults] = useState<(Model | BeginnerStudent)[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const internalMessages = data?.internalMessages || [];
    const models = data?.models || [];
    const beginnerStudents = data?.beginnerStudents || [];

    // Obtenir toutes les conversations uniques
    const conversations = React.useMemo(() => {
        const conversationMap = new Map<string, {
            id: string;
            participant: Model | BeginnerStudent | null;
            lastMessage: InternalMessage | null;
            unreadCount: number;
        }>();

        internalMessages.forEach(message => {
            const conversationId = message.conversationId;
            if (!conversationMap.has(conversationId)) {
                // Trouver le participant
                let participant: Model | BeginnerStudent | null = null;
                if (message.senderRole === 'model') {
                    participant = models.find(m => m.id === message.senderId) || null;
                } else if (message.senderRole === 'beginner') {
                    participant = beginnerStudents.find(s => s.id === message.senderId) || null;
                } else if (message.recipientRole === 'model') {
                    participant = models.find(m => m.id === message.recipientId) || null;
                } else if (message.recipientRole === 'beginner') {
                    participant = beginnerStudents.find(s => s.id === message.recipientId) || null;
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
            if (!message.isRead && message.senderRole !== 'admin') {
                conversation.unreadCount++;
            }
        });

        return Array.from(conversationMap.values()).sort((a, b) => {
            if (!a.lastMessage || !b.lastMessage) return 0;
            return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
        });
    }, [internalMessages, models, beginnerStudents]);

    // Obtenir les messages de la conversation sélectionnée
    const currentMessages = React.useMemo(() => {
        if (!selectedConversation) return [];
        return internalMessages
            .filter(msg => msg.conversationId === selectedConversation)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [internalMessages, selectedConversation]);

    // Fonction pour obtenir tous les utilisateurs (modèles et étudiants débutants)
    const getAllUsers = () => {
        return [...models, ...beginnerStudents];
    };

    // Recherche d'utilisateurs pour nouvelle conversation
    useEffect(() => {
        if (newConversationSearch.trim()) {
            const users = getAllUsers();
            const filtered = users.filter(user => 
                user.name.toLowerCase().includes(newConversationSearch.toLowerCase()) ||
                user.email.toLowerCase().includes(newConversationSearch.toLowerCase())
            );
            setSearchResults(filtered);
        } else {
            setSearchResults([]);
        }
    }, [newConversationSearch, models, beginnerStudents]);

    // Créer une nouvelle conversation
    const createNewConversation = async (userId: string, userRole: 'model' | 'beginner') => {
        // Vérifier si une conversation existe déjà
        const existingConversation = conversations.find(conv => {
            if (userRole === 'model') {
                return conv.participant?.id === userId && 'isActive' in conv.participant;
            } else {
                return conv.participant?.id === userId && 'matricule' in conv.participant;
            }
        });

        if (existingConversation) {
            setSelectedConversation(existingConversation.id);
            setShowNewConversationModal(false);
            setNewConversationSearch('');
            return;
        }

        // Créer une nouvelle conversation
        const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSelectedConversation(conversationId);
        setShowNewConversationModal(false);
        setNewConversationSearch('');
    };

    // Envoyer un message
    const sendMessage = async () => {
        if (!messageContent.trim() || !selectedConversation) return;

        const conversation = conversations.find(c => c.id === selectedConversation);
        if (!conversation?.participant) return;

        const newMessage: InternalMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: selectedConversation,
            senderId: 'admin',
            senderName: 'Administrateur',
            senderRole: 'admin',
            recipientId: conversation.participant.id,
            recipientName: conversation.participant.name,
            recipientRole: 'isActive' in conversation.participant ? 'model' : 'beginner',
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
        if (selectedConversation) {
            const unreadMessages = currentMessages.filter(msg => !msg.isRead && msg.senderRole !== 'admin');
            if (unreadMessages.length > 0) {
                const updatedMessages = internalMessages.map(msg => 
                    unreadMessages.some(unread => unread.id === msg.id) 
                        ? { ...msg, isRead: true }
                        : msg
                );
                saveData({ ...data, internalMessages: updatedMessages } as any);
            }
        }
    }, [selectedConversation, currentMessages, internalMessages, data, saveData]);

    // Auto-scroll vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO title="Admin - Messagerie Interne" noIndex />
            <div className="container mx-auto px-6 py-8">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-6 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-playfair text-pm-gold">Messagerie Interne</h1>
                        <p className="text-pm-off-white/70 mt-2">Communiquez avec les modèles et étudiants.</p>
                    </div>
                    <button
                        onClick={() => setShowNewConversationModal(true)}
                        className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        Nouvelle conversation
                    </button>
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
                                                {conversation.participant?.email}
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
                                                    {conversation?.participant?.email}
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
                                            className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] p-3 rounded-lg ${
                                                    message.senderRole === 'admin'
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

            {/* Modal nouvelle conversation */}
            {showNewConversationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-6 w-full max-w-md mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-pm-gold">Nouvelle conversation</h3>
                            <button
                                onClick={() => {
                                    setShowNewConversationModal(false);
                                    setNewConversationSearch('');
                                }}
                                className="text-pm-off-white/70 hover:text-pm-off-white"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="relative mb-4">
                            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-pm-off-white/50" />
                            <input
                                type="text"
                                value={newConversationSearch}
                                onChange={(e) => setNewConversationSearch(e.target.value)}
                                placeholder="Rechercher un utilisateur..."
                                className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {searchResults.map(user => (
                                <div
                                    key={user.id}
                                    onClick={() => createNewConversation(
                                        user.id, 
                                        'isActive' in user ? 'model' : 'beginner'
                                    )}
                                    className="p-3 bg-pm-dark/50 border border-pm-gold/10 rounded-lg cursor-pointer hover:bg-pm-dark transition-colors"
                                >
                                    <p className="font-semibold text-pm-off-white">{user.name}</p>
                                    <p className="text-sm text-pm-off-white/70">{user.email}</p>
                                    <span className="text-xs text-pm-gold">
                                        {'isActive' in user ? 'Modèle Professionnel' : 'Étudiant Débutant'}
                                    </span>
                                </div>
                            ))}
                            {searchResults.length === 0 && newConversationSearch && (
                                <p className="text-pm-off-white/50 text-center py-4">
                                    Aucun utilisateur trouvé
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMessaging;
