import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import { 
    ChatBubbleLeftRightIcon, 
    MagnifyingGlassIcon, 
    PlusIcon,
    PaperAirplaneIcon,
    UserIcon,
    ClockIcon
} from '@heroicons/react/24/outline';
import { InternalMessage, Conversation, Model, BeginnerStudent } from '../types';

const AdminMessaging: React.FC = () => {
    const { data, saveData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const [isCreatingConversation, setIsCreatingConversation] = useState(false);
    const [newConversationUser, setNewConversationUser] = useState('');

    // Récupérer les conversations depuis les données
    const conversations = useMemo(() => {
        const convs: Conversation[] = [];
        
        // Conversations avec les modèles
        if (data?.models) {
            data.models.forEach(model => {
                const conversationId = `model_${model.id}`;
                const messages = data.internalMessages?.filter(msg => 
                    msg.conversationId === conversationId
                ) || [];
                
                const lastMessage = messages[messages.length - 1];
                const unreadCount = messages.filter(msg => 
                    !msg.isRead && msg.senderRole !== 'admin'
                ).length;

                convs.push({
                    id: conversationId,
                    participant: {
                        id: model.id,
                        name: model.name,
                        role: 'model',
                        imageUrl: model.imageUrl
                    },
                    lastMessage,
                    unreadCount,
                    updatedAt: lastMessage?.timestamp || new Date().toISOString()
                });
            });
        }

        // Conversations avec les débutants
        if (data?.beginnerStudents) {
            data.beginnerStudents.forEach(student => {
                const conversationId = `beginner_${student.id}`;
                const messages = data.internalMessages?.filter(msg => 
                    msg.conversationId === conversationId
                ) || [];
                
                const lastMessage = messages[messages.length - 1];
                const unreadCount = messages.filter(msg => 
                    !msg.isRead && msg.senderRole !== 'admin'
                ).length;

                convs.push({
                    id: conversationId,
                    participant: {
                        id: student.id,
                        name: student.name,
                        role: 'beginner',
                        imageUrl: undefined
                    },
                    lastMessage,
                    unreadCount,
                    updatedAt: lastMessage?.timestamp || new Date().toISOString()
                });
            });
        }

        return convs.sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [data]);

    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        
        return conversations.filter(conv => 
            conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [conversations, searchQuery]);

    const selectedConv = conversations.find(c => c.id === selectedConversation);
    const conversationMessages = useMemo(() => {
        if (!selectedConversation || !data?.internalMessages) return [];
        
        return data.internalMessages
            .filter(msg => msg.conversationId === selectedConversation)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [selectedConversation, data?.internalMessages]);

    const sendMessage = async () => {
        if (!messageContent.trim() || !selectedConv || !data) return;

        const newMessage: InternalMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: selectedConversation!,
            senderId: 'admin',
            senderName: 'Administrateur',
            senderRole: 'admin',
            recipientId: selectedConv.participant.id,
            recipientName: selectedConv.participant.name,
            recipientRole: selectedConv.participant.role,
            content: messageContent.trim(),
            timestamp: new Date().toISOString(),
            isRead: true,
            messageType: 'text'
        };

        const updatedMessages = [...(data.internalMessages || []), newMessage];
        await saveData({ ...data, internalMessages: updatedMessages });
        setMessageContent('');
    };

    const createNewConversation = async (userId: string, userRole: 'model' | 'beginner') => {
        if (!data) return;

        const conversationId = `${userRole}_${userId}`;
        const existingConv = conversations.find(c => c.id === conversationId);
        
        if (existingConv) {
            setSelectedConversation(conversationId);
        } else {
            // Créer une nouvelle conversation
            const newMessage: InternalMessage = {
                id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                conversationId,
                senderId: 'admin',
                senderName: 'Administrateur',
                senderRole: 'admin',
                recipientId: userId,
                recipientName: userRole === 'model' 
                    ? data.models?.find(m => m.id === userId)?.name || 'Utilisateur'
                    : data.beginnerStudents?.find(s => s.id === userId)?.name || 'Utilisateur',
                recipientRole: userRole,
                content: 'Conversation démarrée',
                timestamp: new Date().toISOString(),
                isRead: true,
                messageType: 'text'
            };

            const updatedMessages = [...(data.internalMessages || []), newMessage];
            await saveData({ ...data, internalMessages: updatedMessages });
            setSelectedConversation(conversationId);
        }
        
        setIsCreatingConversation(false);
        setNewConversationUser('');
    };

    const markAsRead = async (messageId: string) => {
        if (!data) return;

        const updatedMessages = data.internalMessages?.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
        ) || [];

        await saveData({ ...data, internalMessages: updatedMessages });
    };

    return (
        <AdminLayout 
            title="Messagerie Interne" 
            description="Communiquez avec les mannequins et étudiants"
            breadcrumbs={[
                { label: "Messagerie" }
            ]}
            showSearch={true}
            onSearch={setSearchQuery}
        >
            <div className="flex h-[600px] bg-black/50 border border-pm-gold/20 rounded-xl overflow-hidden">
                {/* Liste des conversations */}
                <div className="w-1/3 border-r border-pm-gold/20 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-pm-gold/20">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-playfair text-pm-gold">Conversations</h3>
                            <button
                                onClick={() => setIsCreatingConversation(true)}
                                className="p-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                                title="Nouvelle conversation"
                            >
                                <PlusIcon className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {isCreatingConversation && (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Rechercher un utilisateur..."
                                    value={newConversationUser}
                                    onChange={(e) => setNewConversationUser(e.target.value)}
                                    className="w-full px-3 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold text-sm"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setIsCreatingConversation(false);
                                            setNewConversationUser('');
                                        }}
                                        className="px-3 py-1 text-pm-gold border border-pm-gold/30 rounded text-sm hover:bg-pm-gold/10"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Liste */}
                    <div className="flex-1 overflow-y-auto">
                        {filteredConversations.length === 0 ? (
                            <div className="p-4 text-center text-pm-off-white/70">
                                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-pm-gold/50" />
                                <p>Aucune conversation trouvée</p>
                            </div>
                        ) : (
                            <div className="space-y-1 p-2">
                                {filteredConversations.map(conv => (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv.id)}
                                        className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                                            selectedConversation === conv.id
                                                ? 'bg-pm-gold/20 border border-pm-gold/40'
                                                : 'hover:bg-pm-gold/10 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center">
                                                {conv.participant.imageUrl ? (
                                                    <img
                                                        src={conv.participant.imageUrl}
                                                        alt={conv.participant.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <UserIcon className="w-6 h-6 text-pm-gold" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-semibold text-pm-off-white truncate">
                                                        {conv.participant.name}
                                                    </h4>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-pm-off-white/70 truncate">
                                                    {conv.participant.role === 'model' ? 'Mannequin' : 'Étudiant'}
                                                </p>
                                                {conv.lastMessage && (
                                                    <p className="text-xs text-pm-off-white/50 truncate">
                                                        {conv.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Zone de chat */}
                <div className="flex-1 flex flex-col">
                    {selectedConv ? (
                        <>
                            {/* Header de la conversation */}
                            <div className="p-4 border-b border-pm-gold/20 bg-pm-gold/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-pm-gold/20 flex items-center justify-center">
                                        {selectedConv.participant.imageUrl ? (
                                            <img
                                                src={selectedConv.participant.imageUrl}
                                                alt={selectedConv.participant.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="w-6 h-6 text-pm-gold" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-pm-off-white">
                                            {selectedConv.participant.name}
                                        </h3>
                                        <p className="text-sm text-pm-off-white/70">
                                            {selectedConv.participant.role === 'model' ? 'Mannequin' : 'Étudiant'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {conversationMessages.length === 0 ? (
                                    <div className="text-center text-pm-off-white/70 py-8">
                                        <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-pm-gold/50" />
                                        <p>Aucun message dans cette conversation</p>
                                    </div>
                                ) : (
                                    conversationMessages.map(message => (
                                        <div
                                            key={message.id}
                                            className={`flex ${message.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    message.senderRole === 'admin'
                                                        ? 'bg-pm-gold text-pm-dark'
                                                        : 'bg-pm-off-white/10 text-pm-off-white'
                                                }`}
                                            >
                                                <p className="text-sm">{message.content}</p>
                                                <p className={`text-xs mt-1 ${
                                                    message.senderRole === 'admin' 
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
                                    ))
                                )}
                            </div>

                            {/* Zone de saisie */}
                            <div className="p-4 border-t border-pm-gold/20">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Tapez votre message..."
                                        className="flex-1 px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!messageContent.trim()}
                                        className="px-4 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PaperAirplaneIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center text-pm-off-white/70">
                                <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-pm-gold/50" />
                                <h3 className="text-xl font-playfair text-pm-gold mb-2">
                                    Sélectionnez une conversation
                                </h3>
                                <p>Choisissez une conversation pour commencer à discuter</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminMessaging;
