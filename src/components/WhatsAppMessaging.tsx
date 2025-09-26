import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { 
    PaperAirplaneIcon, 
    PaperClipIcon, 
    PhoneIcon, 
    VideoCameraIcon,
    EllipsisVerticalIcon,
    MagnifyingGlassIcon,
    CheckIcon,
    CheckCircleIcon,
    ClockIcon,
    UserIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { InternalMessage, Conversation } from '../types';

interface WhatsAppMessagingProps {
    currentUserId: string;
    currentUserName: string;
    currentUserRole: 'admin' | 'model' | 'beginner';
    isAdmin?: boolean;
}

const WhatsAppMessaging: React.FC<WhatsAppMessagingProps> = ({
    currentUserId,
    currentUserName,
    currentUserRole,
    isAdmin = false
}) => {
    const { data, saveData } = useData();
    const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
    const [messageContent, setMessageContent] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Récupérer les conversations
    const conversations = useMemo(() => {
        if (!data?.internalMessages) return [];

        const convs: Conversation[] = [];
        const conversationMap = new Map<string, Conversation>();

        // Grouper les messages par conversation
        data.internalMessages.forEach(msg => {
            if (!conversationMap.has(msg.conversationId)) {
                conversationMap.set(msg.conversationId, {
                    id: msg.conversationId,
                    participant: {
                        id: msg.senderId === currentUserId ? msg.recipientId : msg.senderId,
                        name: msg.senderId === currentUserId ? msg.recipientName : msg.senderName,
                        role: msg.senderId === currentUserId ? msg.recipientRole : msg.senderRole,
                        imageUrl: msg.senderId === currentUserId ? 
                            (data.models?.find(m => m.id === msg.recipientId)?.imageUrl || 
                             data.beginnerStudents?.find(s => s.id === msg.recipientId)?.imageUrl) :
                            (data.models?.find(m => m.id === msg.senderId)?.imageUrl || 
                             data.beginnerStudents?.find(s => s.id === msg.senderId)?.imageUrl)
                    },
                    lastMessage: null,
                    unreadCount: 0,
                    updatedAt: msg.timestamp
                });
            }

            const conv = conversationMap.get(msg.conversationId)!;
            if (!conv.lastMessage || new Date(msg.timestamp) > new Date(conv.lastMessage.timestamp)) {
                conv.lastMessage = msg;
            }
            if (!msg.isRead && msg.senderId !== currentUserId) {
                conv.unreadCount++;
            }
        });

        return Array.from(conversationMap.values())
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [data?.internalMessages, currentUserId, data?.models, data?.beginnerStudents]);

    // Messages de la conversation sélectionnée
    const conversationMessages = useMemo(() => {
        if (!selectedConversation || !data?.internalMessages) return [];

        return data.internalMessages
            .filter(msg => msg.conversationId === selectedConversation)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [selectedConversation, data?.internalMessages]);

    // Conversation sélectionnée
    const selectedConv = conversations.find(c => c.id === selectedConversation);

    // Auto-scroll vers le bas
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationMessages]);

    // Marquer les messages comme lus
    useEffect(() => {
        if (selectedConversation && conversationMessages.length > 0) {
            const unreadMessages = conversationMessages.filter(msg => 
                !msg.isRead && msg.senderId !== currentUserId
            );
            
            if (unreadMessages.length > 0) {
                markMessagesAsRead(unreadMessages.map(msg => msg.id));
            }
        }
    }, [selectedConversation, conversationMessages, currentUserId]);

    const sendMessage = async () => {
        if (!messageContent.trim() || !selectedConv || !data) return;

        const newMessage: InternalMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: selectedConversation!,
            senderId: currentUserId,
            senderName: currentUserName,
            senderRole: currentUserRole,
            recipientId: selectedConv.participant.id,
            recipientName: selectedConv.participant.name,
            recipientRole: selectedConv.participant.role,
            content: messageContent.trim(),
            timestamp: new Date().toISOString(),
            isRead: false,
            messageType: 'text'
        };

        const updatedMessages = [...(data.internalMessages || []), newMessage];
        await saveData({ ...data, internalMessages: updatedMessages });
        setMessageContent('');
    };

    const markMessagesAsRead = async (messageIds: string[]) => {
        if (!data) return;

        const updatedMessages = data.internalMessages?.map(msg => 
            messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        ) || [];

        await saveData({ ...data, internalMessages: updatedMessages });
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        } else if (diffInHours < 48) {
            return 'Hier';
        } else {
            return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
        }
    };

    const getMessageStatus = (message: InternalMessage) => {
        if (message.senderId !== currentUserId) return null;
        
        if (message.isRead) {
            return <CheckCircleIcon className="w-4 h-4 text-blue-500" />;
        } else {
            return <CheckIcon className="w-4 h-4 text-gray-400" />;
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-screen bg-gray-100 flex">
            {/* Sidebar - Liste des conversations */}
            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="bg-pm-gold p-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Messages</h2>
                        <div className="flex space-x-2">
                            <button className="p-2 hover:bg-pm-gold/20 rounded-full">
                                <VideoCameraIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-pm-gold/20 rounded-full">
                                <PhoneIcon className="w-5 h-5" />
                            </button>
                            <button className="p-2 hover:bg-pm-gold/20 rounded-full">
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="p-3 bg-gray-50">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher une conversation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                        />
                    </div>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations
                        .filter(conv => 
                            conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map(conv => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv.id)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                selectedConversation === conv.id ? 'bg-pm-gold/10 border-l-4 border-l-pm-gold' : ''
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                                        {conv.participant.imageUrl ? (
                                            <img 
                                                src={conv.participant.imageUrl} 
                                                alt={conv.participant.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        ) : (
                                            <UserIcon className="w-6 h-6 text-pm-gold" />
                                        )}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                                            {conv.participant.name}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {conv.lastMessage && formatTime(conv.lastMessage.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">
                                        {conv.lastMessage ? conv.lastMessage.content : 'Aucun message'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedConv ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-pm-gold/20 rounded-full flex items-center justify-center">
                                    {selectedConv.participant.imageUrl ? (
                                        <img 
                                            src={selectedConv.participant.imageUrl} 
                                            alt={selectedConv.participant.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-pm-gold" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {selectedConv.participant.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {selectedConv.participant.role === 'admin' ? 'Administrateur' : 
                                         selectedConv.participant.role === 'model' ? 'Mannequin Pro' : 'Étudiant Débutant'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <VideoCameraIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <PhoneIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
                            {conversationMessages.map((message, index) => {
                                const isOwn = message.senderId === currentUserId;
                                const prevMessage = index > 0 ? conversationMessages[index - 1] : null;
                                const showAvatar = !prevMessage || prevMessage.senderId !== message.senderId;
                                
                                return (
                                    <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                            {!isOwn && showAvatar && (
                                                <div className="w-8 h-8 bg-pm-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                    {selectedConv.participant.imageUrl ? (
                                                        <img 
                                                            src={selectedConv.participant.imageUrl} 
                                                            alt={selectedConv.participant.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserIcon className="w-4 h-4 text-pm-gold" />
                                                    )}
                                                </div>
                                            )}
                                            {!isOwn && !showAvatar && (
                                                <div className="w-8 h-8" />
                                            )}
                                            <div className={`rounded-2xl px-4 py-2 ${
                                                isOwn 
                                                    ? 'bg-pm-gold text-white' 
                                                    : 'bg-white text-gray-900'
                                            }`}>
                                                <p className="text-sm">{message.content}</p>
                                                <div className={`flex items-center justify-end space-x-1 mt-1 ${
                                                    isOwn ? 'text-pm-gold/70' : 'text-gray-500'
                                                }`}>
                                                    <span className="text-xs">
                                                        {formatTime(message.timestamp)}
                                                    </span>
                                                    {getMessageStatus(message)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-gray-100 rounded-full">
                                    <PaperClipIcon className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="flex-1 relative">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={messageContent}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Tapez un message..."
                                        className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                    />
                                </div>
                                <button
                                    onClick={sendMessage}
                                    disabled={!messageContent.trim()}
                                    className="p-2 bg-pm-gold text-white rounded-full hover:bg-pm-gold/90 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PaperAirplaneIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* No conversation selected */
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Sélectionnez une conversation
                            </h3>
                            <p className="text-gray-500">
                                Choisissez une conversation pour commencer à discuter
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WhatsAppMessaging;
