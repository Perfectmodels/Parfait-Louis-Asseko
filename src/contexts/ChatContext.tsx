import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useWebSocket } from '../hooks/useWebSocket';

export interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  timestamp: number;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file' | 'voice' | 'location' | 'poll' | 'contact';
  replyTo?: Message;
  reactions?: Array<{
    emoji: string;
    userId: string;
    timestamp: number;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
    thumbnail?: string;
  }>;
  // Nouvelles fonctionnalités Phase 1
  priority: 'low' | 'normal' | 'high' | 'urgent';
  editedAt?: number;
  deletedAt?: number;
  forwardedFrom?: {
    chatId: string;
    chatName: string;
    originalSender: string;
  };
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  poll?: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      votes: string[];
    }>;
    expiresAt?: number;
    multipleChoice: boolean;
    anonymous: boolean;
  };
  contactCard?: {
    name: string;
    phone: string;
    email?: string;
    company?: string;
    position?: string;
  };
  voiceNote?: {
    duration: number;
    waveform: number[];
    transcription?: string;
  };
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  type: 'private' | 'group' | 'broadcast';
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
    role: string;
    isOnline: boolean;
    lastSeen?: number;
    permissions: {
      canSendMessages: boolean;
      canAddMembers: boolean;
      canRemoveMembers: boolean;
      canEditInfo: boolean;
    };
  }>;
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  createdAt: number;
  description?: string;
  // Nouvelles fonctionnalités Phase 1
  encryption: 'none' | 'basic' | 'end-to-end';
  autoDelete: number; // en secondes, 0 = désactivé
  permissions: {
    canAddMembers: boolean;
    canRemoveMembers: boolean;
    canEditInfo: boolean;
    canSendMessages: boolean;
    canDeleteMessages: boolean;
    canPinMessages: boolean;
  };
  sharedMedia: {
    images: Array<{
      id: string;
      url: string;
      thumbnail: string;
      timestamp: number;
      senderId: string;
    }>;
    videos: Array<{
      id: string;
      url: string;
      thumbnail: string;
      duration: number;
      timestamp: number;
      senderId: string;
    }>;
    files: Array<{
      id: string;
      name: string;
      url: string;
      size: number;
      type: string;
      timestamp: number;
      senderId: string;
    }>;
  };
  calls: Array<{
    id: string;
    type: 'voice' | 'video';
    startTime: number;
    endTime?: number;
    participants: string[];
    duration?: number;
    status: 'ongoing' | 'ended' | 'missed';
  }>;
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  priority: 'low' | 'normal' | 'high';
  lastActivity: number;
}

export interface ChatContextType {
  // État
  chats: Chat[];
  activeChat: Chat | null;
  messages: { [chatId: string]: Message[] };
  isTyping: { [chatId: string]: { [userId: string]: boolean } };
  onlineUsers: Set<string>;
  searchTerm: string;
  selectedMessages: Set<string>;
  theme: 'light' | 'dark' | 'auto';

  // Actions existantes
  setActiveChat: (chat: Chat | null) => void;
  sendMessage: (text: string, type?: Message['type'], attachments?: any[]) => void;
  sendTypingIndicator: (isTyping: boolean) => void;
  markAsRead: (chatId: string, messageId?: string) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, newText: string) => void;
  reactToMessage: (messageId: string, emoji: string) => void;
  replyToMessage: (messageId: string) => void;
  forwardMessage: (messageId: string, chatIds: string[]) => void;

  // Gestion des chats
  createChat: (name: string, type: Chat['type'], participants: string[]) => void;
  archiveChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  pinChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;

  // Recherche et filtres
  setSearchTerm: (term: string) => void;
  filterChats: (filter: 'all' | 'unread' | 'archived' | 'pinned' | 'favorites') => Chat[];
  
  // Sélection
  toggleMessageSelection: (messageId: string) => void;
  clearSelection: () => void;
  deleteSelectedMessages: () => void;

  // État UI
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;

  // Nouvelles fonctionnalités Phase 1
  // Sondages
  createPoll: (chatId: string, question: string, options: string[], multipleChoice?: boolean, anonymous?: boolean) => void;
  votePoll: (messageId: string, optionId: string) => void;
  endPoll: (messageId: string) => void;

  // Appels vocaux/vidéo
  initiateCall: (chatId: string, type: 'voice' | 'video') => void;
  answerCall: (callId: string) => void;
  endCall: (callId: string) => void;
  rejectCall: (callId: string) => void;

  // Partage de position
  shareLocation: (chatId: string, location: { lat: number; lng: number; address: string }) => void;
  requestLocation: (chatId: string) => void;

  // Cartes de contact
  shareContact: (chatId: string, contact: Message['contactCard']) => void;
  saveContact: (contact: Message['contactCard']) => void;

  // Notes vocales avancées
  startVoiceRecording: () => void;
  stopVoiceRecording: () => void;
  playVoiceNote: (messageId: string) => void;
  pauseVoiceNote: (messageId: string) => void;
  transcribeVoiceNote: (messageId: string) => void;

  // Chiffrement
  enableEncryption: (chatId: string, level: Chat['encryption']) => void;
  verifyEncryption: (chatId: string) => boolean;

  // Auto-suppression
  setAutoDelete: (chatId: string, seconds: number) => void;
  cancelAutoDelete: (chatId: string) => void;

  // Étiquettes et favoris
  addLabel: (chatId: string, label: { name: string; color: string }) => void;
  removeLabel: (chatId: string, labelId: string) => void;
  toggleFavorite: (chatId: string) => void;

  // Thèmes
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;

  // Appels vocaux et vidéo
  activeCall: {
    id: string;
    chatId: string;
    type: 'voice' | 'video';
    status: 'calling' | 'connected' | 'ended';
    participants: string[];
    startTime: number;
  } | null;
  setActiveCall: (call: any) => void;

  // Enregistrement vocal
  voiceRecording: {
    isRecording: boolean;
    duration: number;
    waveform: number[];
    messageId?: string;
  };
  setVoiceRecording: (recording: any) => void;

  // Chiffrement
  encryptionKeys: { [chatId: string]: string };
  setEncryptionKeys: (keys: { [chatId: string]: string }) => void;

  // Recherche avancée
  searchInChat: (chatId: string, query: string, filters?: {
    senderId?: string;
    dateRange?: { start: number; end: number };
    messageType?: Message['type'];
    hasAttachments?: boolean;
  }) => Message[];

  // Médias partagés
  getSharedMedia: (chatId: string, type: 'images' | 'videos' | 'files') => any[];
  downloadMedia: (mediaId: string) => void;

  // Priorité des messages
  setMessagePriority: (messageId: string, priority: Message['priority']) => void;
  getHighPriorityMessages: (chatId: string) => Message[];
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { functions, isConnected } = useWebSocket({
    autoConnect: true,
    debugMode: true
  });

  // État principal existant
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [isTyping, setIsTyping] = useState<{ [chatId: string]: { [userId: string]: boolean } }>({});
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Nouveaux états Phase 1
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [activeCall, setActiveCall] = useState<{
    id: string;
    chatId: string;
    type: 'voice' | 'video';
    status: 'calling' | 'connected' | 'ended';
    participants: string[];
    startTime: number;
  } | null>(null);
  const [voiceRecording, setVoiceRecording] = useState<{
    isRecording: boolean;
    duration: number;
    waveform: number[];
    messageId?: string;
  }>({ isRecording: false, duration: 0, waveform: [] });
  const [encryptionKeys, setEncryptionKeys] = useState<{ [chatId: string]: string }>({});

  // État UI existant
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Charger les chats depuis localStorage
  useEffect(() => {
    if (!user) return;

    const loadChats = () => {
      try {
        const storedChats = localStorage.getItem(`chats_${user.id}`);
        const storedMessages = localStorage.getItem(`messages_${user.id}`);
        
        if (storedChats) {
          const parsedChats = JSON.parse(storedChats);
          setChats(parsedChats.map((chat: any) => ({
            ...chat,
            createdAt: new Date(chat.createdAt).getTime()
          })));
        }
        
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des chats:', error);
      }
    };

    loadChats();
  }, [user]);

  // Sauvegarder les messages dans localStorage
  useEffect(() => {
    if (!user) return;
    
    localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages));
  }, [messages, user]);

  // WebSocket handlers
  useEffect(() => {
    if (!functions || !user) return;

    // Nouveau message reçu
    const handleNewMessage = (event: CustomEvent) => {
      const { chatMessage, roomId } = event.detail;
      
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), {
          ...chatMessage,
          timestamp: new Date(chatMessage.timestamp).getTime(),
          status: 'delivered'
        }]
      }));

      // Mettre à jour le dernier message du chat
      setChats(prev => prev.map(chat => 
        chat.id === roomId 
          ? { ...chat, lastMessage: chatMessage, unreadCount: chat.unreadCount + 1 }
          : chat
      ));

      // Notification si le chat n'est pas actif
      if (activeChat?.id !== roomId) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Nouveau message de ${chatMessage.senderName}`, {
            body: chatMessage.text,
            icon: chatMessage.senderAvatar || '/favicon.ico',
            tag: `chat_${roomId}`
          });
        }
      }
    };

    // Indicateur de frappe
    const handleTypingIndicator = (event: CustomEvent) => {
      const { userId, userName, roomId, isTyping: typing } = event.detail;
      
      setIsTyping(prev => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [userId]: typing
        }
      }));

      // Nettoyer après 3 secondes
      if (typing) {
        setTimeout(() => {
          setIsTyping(prev => ({
            ...prev,
            [roomId]: {
              ...prev[roomId],
              [userId]: false
            }
          }));
        }, 3000);
      }
    };

    // Statut de lecture
    const handleReadReceipt = (event: CustomEvent) => {
      const { messageId, userId, roomId } = event.detail;
      
      setMessages(prev => ({
        ...prev,
        [roomId]: prev[roomId]?.map(msg => 
          msg.id === messageId && msg.senderId === user.id
            ? { ...msg, status: 'read' as const }
            : msg
        ) || []
      }));
    };

    // Réactions
    const handleReaction = (event: CustomEvent) => {
      const { messageId, emoji, userId, roomId } = event.detail;
      
      setMessages(prev => ({
        ...prev,
        [roomId]: prev[roomId]?.map(msg => 
          msg.id === messageId
            ? {
                ...msg,
                reactions: [
                  ...(msg.reactions?.filter(r => r.userId !== userId) || []),
                  { emoji, userId, timestamp: Date.now() }
                ]
              }
            : msg
        ) || []
      }));
    };

    window.addEventListener('newChatMessage', handleNewMessage as EventListener);
    window.addEventListener('typingIndicator', handleTypingIndicator as EventListener);
    window.addEventListener('readReceipt', handleReadReceipt as EventListener);
    window.addEventListener('messageReaction', handleReaction as EventListener);

    return () => {
      window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
      window.removeEventListener('typingIndicator', handleTypingIndicator as EventListener);
      window.removeEventListener('readReceipt', handleReadReceipt as EventListener);
      window.removeEventListener('messageReaction', handleReaction as EventListener);
    };
  }, [functions, user, activeChat]);

  // Envoyer un message
  const sendMessage = useCallback((text: string, type: Message['type'] = 'text', attachments?: any[]) => {
    if (!activeChat || !user || !functions) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      timestamp: Date.now(),
      status: 'sending',
      type,
      attachments
    };

    // Ajouter le message localement
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMessage]
    }));

    // Envoyer via WebSocket
    functions.sendChatMessage(activeChat.id, text, {
      id: user.id,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    });

    // Mettre à jour le statut
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeChat.id]: prev[activeChat.id]?.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
        ) || []
      }));
    }, 1000);

    // Mettre à jour le dernier message du chat
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));
  }, [activeChat, user, functions]);

  // Indicateur de frappe
  const sendTypingIndicator = useCallback((typing: boolean) => {
    if (!activeChat || !user || !functions) return;

    functions.sendTypingIndicator(activeChat.id, typing, {
      id: user.id,
      name: user.name
    });
  }, [activeChat, user, functions]);

  // Marquer comme lu
  const markAsRead = useCallback((chatId: string, messageId?: string) => {
    if (!user || !functions) return;

    // Mettre à jour localement
    setMessages(prev => ({
      ...prev,
      [chatId]: prev[chatId]?.map(msg => 
        msg.senderId !== user.id && (!messageId || msg.id <= messageId)
          ? { ...msg, status: 'read' as const }
          : msg
      ) || []
    }));

    // Mettre à jour le compteur de non lus
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));

    // Envoyer l'accusé de lecture
    if (messageId) {
      functions.send({
        type: 'read_receipt',
        payload: { messageId, chatId }
      });
    }
  }, [user, functions]);

  // Supprimer un message
  const deleteMessage = useCallback((messageId: string) => {
    if (!activeChat) return;

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: prev[activeChat.id]?.filter(msg => msg.id !== messageId) || []
    }));
  }, [activeChat]);

  // Éditer un message
  const editMessage = useCallback((messageId: string, newText: string) => {
    if (!activeChat) return;

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: prev[activeChat.id]?.map(msg => 
        msg.id === messageId 
          ? { ...msg, text: newText, edited: true }
          : msg
      ) || []
    }));
  }, [activeChat]);

  // Réagir à un message
  const reactToMessage = useCallback((messageId: string, emoji: string) => {
    if (!activeChat || !user || !functions) return;

    const message = messages[activeChat.id]?.find(msg => msg.id === messageId);
    if (!message) return;

    // Ajouter la réaction localement
    setMessages(prev => ({
      ...prev,
      [activeChat.id]: prev[activeChat.id]?.map(msg => 
        msg.id === messageId
          ? {
              ...msg,
              reactions: [
                ...(msg.reactions?.filter(r => r.userId !== user.id) || []),
                { emoji, userId: user.id, timestamp: Date.now() }
              ]
            }
          : msg
      ) || []
    }));

    // Envoyer la réaction
    functions.send({
      type: 'message_reaction',
      payload: { messageId, emoji, chatId: activeChat.id }
    });
  }, [activeChat, user, functions, messages]);

  // Répondre à un message
  const replyToMessage = useCallback((messageId: string) => {
    const message = activeChat ? messages[activeChat.id]?.find(msg => msg.id === messageId) : null;
    if (!message) return;

    // Implémenter la logique de réponse
    console.log('Replying to message:', message);
  }, [activeChat, messages]);

  // Transférer un message
  const forwardMessage = useCallback((messageId: string, chatIds: string[]) => {
    const message = activeChat ? messages[activeChat.id]?.find(msg => msg.id === messageId) : null;
    if (!message || !functions) return;

    chatIds.forEach(chatId => {
      functions.send({
        type: 'forward_message',
        payload: { 
          originalMessage: message,
          targetChatId: chatId,
          forwardedBy: user?.id
        }
      });
    });
  }, [activeChat, messages, functions, user]);

  // Créer un chat
  const createChat = useCallback((name: string, type: Chat['type'], participants: string[]) => {
    if (!user) return;

    const newChat: Chat = {
      id: Date.now().toString(),
      name,
      type,
      participants: participants.map(id => ({
        id,
        name: `User ${id}`,
        role: 'user',
        isOnline: false
      })),
      unreadCount: 0,
      isMuted: false,
      isPinned: false,
      isArchived: false,
      createdAt: Date.now()
    };

    setChats(prev => [newChat, ...prev]);
    localStorage.setItem(`chats_${user.id}`, JSON.stringify([newChat, ...chats]));
  }, [user, chats]);

  // Filtrer les chats
  const filterChats = useCallback((filter: 'all' | 'unread' | 'archived' | 'pinned' | 'favorites') => {
    return chats.filter(chat => {
      switch (filter) {
        case 'unread':
          return chat.unreadCount > 0;
        case 'archived':
          return chat.isArchived;
        case 'pinned':
          return chat.isPinned;
        case 'favorites':
          return chat.isFavorite;
        default:
          return !chat.isArchived;
      }
    });
  }, [chats]);

  // Gestion de la sélection
  const toggleMessageSelection = useCallback((messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedMessages(new Set());
  }, []);

  const deleteSelectedMessages = useCallback(() => {
    if (!activeChat) return;

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: prev[activeChat.id]?.filter(msg => !selectedMessages.has(msg.id)) || []
    }));
    clearSelection();
  }, [activeChat, selectedMessages, clearSelection]);

  // Actions sur les chats
  const archiveChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isArchived: !chat.isArchived } : chat
    ));
  }, []);

  const muteChat = useCallback((chatId: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, isMuted: !chat.isMuted } : chat
    ));
  }, []);

  const pinChat = useCallback((chatId: string) => {
    setChats(prev => {
      const updated = prev.map(chat => 
        chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
      );
      // Mettre les chats épinglés en premier
      return [...updated.filter(chat => chat.isPinned), ...updated.filter(chat => !chat.isPinned)];
    });
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[chatId];
      return newMessages;
    });
    
    if (activeChat?.id === chatId) {
      setActiveChat(null);
    }
  }, [activeChat]);

  const leaveChat = useCallback((chatId: string) => {
    if (!user || !functions) return;

    functions.send({
      type: 'leave_chat',
      payload: { chatId, userId: user.id }
    });

    deleteChat(chatId);
  }, [user, functions, deleteChat]);

  const value: ChatContextType = {
    // État
    chats,
    activeChat,
    messages,
    isTyping,
    onlineUsers,
    searchTerm,
    selectedMessages,
    
    // Actions
    setActiveChat,
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    deleteMessage,
    editMessage,
    reactToMessage,
    replyToMessage,
    forwardMessage,

    // Gestion des chats
    createChat,
    archiveChat,
    muteChat,
    pinChat,
    deleteChat,
    leaveChat,

    // Recherche et filtres
    setSearchTerm,
    filterChats,
    
    // Sélection
    toggleMessageSelection,
    clearSelection,
    deleteSelectedMessages,

    // État UI
    isRecording,
    setIsRecording,
    showEmojiPicker,
    setShowEmojiPicker,
    
    // Nouveaux états Phase 1
    theme,
    setTheme,
    activeCall,
    setActiveCall,
    voiceRecording,
    setVoiceRecording,
    encryptionKeys,
    setEncryptionKeys,
    
    // Nouvelles fonctionnalités Phase 1 (placeholders pour l'instant)
    createPoll: () => {},
    votePoll: () => {},
    endPoll: () => {},
    initiateCall: () => {},
    answerCall: () => {},
    endCall: () => {},
    rejectCall: () => {},
    shareLocation: () => {},
    requestLocation: () => {},
    shareContact: () => {},
    saveContact: () => {},
    startVoiceRecording: () => {},
    stopVoiceRecording: () => {},
    playVoiceNote: () => {},
    pauseVoiceNote: () => {},
    transcribeVoiceNote: () => {},
    enableEncryption: () => {},
    verifyEncryption: () => false,
    setAutoDelete: () => {},
    cancelAutoDelete: () => {},
    addLabel: () => {},
    removeLabel: () => {},
    toggleFavorite: () => {},
    searchInChat: () => [],
    getSharedMedia: () => [],
    downloadMedia: () => {},
    setMessagePriority: () => {},
    getHighPriorityMessages: () => []
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
