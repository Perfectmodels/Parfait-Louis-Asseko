import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { AgencyMessage, AgencyConversation } from '../types';

interface ChatContextType {
  conversations: AgencyConversation[];
  activeConversation: AgencyConversation | null;
  messages: AgencyMessage[];
  loading: boolean;
  error: string | null;
  setActiveConversation: (conversation: AgencyConversation | null) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  loadMoreMessages: (conversationId: string) => Promise<void>;
  markAsRead: (conversationId: string) => void;
  createConversation: (conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => Promise<AgencyConversation>;
  updateConversation: (conversationId: string, updates: Partial<AgencyConversation>) => void;
  deleteConversation: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<AgencyConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<AgencyConversation | null>(null);
  const [messages, setMessages] = useState<AgencyMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les conversations initiales
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        // TODO: Implémenter le chargement des conversations depuis l'API
        // const data = await chatService.getConversations();
        // setConversations(data);
      } catch (err) {
        setError('Erreur lors du chargement des conversations');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Charger les messages d'une conversation
  useEffect(() => {
    if (!activeConversation) return;

    const loadMessages = async () => {
      try {
        setLoading(true);
        // TODO: Implémenter le chargement des messages depuis l'API
        // const data = await chatService.getMessages(activeConversation.id);
        // setMessages(data);
      } catch (err) {
        setError('Erreur lors du chargement des messages');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [activeConversation]);

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      // TODO: Implémenter l'envoi du message via l'API
      // const newMessage = await chatService.sendMessage(conversationId, content);
      // setMessages(prev => [...prev, newMessage]);
      
      // Mise à jour de la dernière conversation
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { 
                ...conv, 
                lastMessage: { 
                  content, 
                  timestamp: new Date(),
                  senderId: 'current-user',
                  senderName: 'Moi',
                  status: 'sent'
                },
                updatedAt: new Date()
              } 
            : conv
        )
      );
    } catch (err) {
      setError('Erreur lors de l\'envoi du message');
      console.error(err);
      throw err;
    }
  };

  const loadMoreMessages = async (conversationId: string) => {
    if (!activeConversation) return;
    
    try {
      setLoading(true);
      // TODO: Implémenter le chargement des messages plus anciens
      // const olderMessages = await chatService.getOlderMessages(conversationId, messages[0]?.id);
      // setMessages(prev => [...olderMessages, ...prev]);
    } catch (err) {
      setError('Erreur lors du chargement des messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const createConversation = async (conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => {
    try {
      // TODO: Implémenter la création de conversation via l'API
      // const newConversation = await chatService.createConversation(conversation);
      // setConversations(prev => [newConversation, ...prev]);
      // return newConversation;
      
      // Simulation de création
      const newConversation: AgencyConversation = {
        ...conversation,
        id: `conv-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        messages: [],
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        status: 'active',
        priority: 'normal',
        tags: [],
      };
      
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    } catch (err) {
      setError('Erreur lors de la création de la conversation');
      console.error(err);
      throw err;
    }
  };

  const updateConversation = (conversationId: string, updates: Partial<AgencyConversation>) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, ...updates, updatedAt: new Date() }
          : conv
      )
    );

    if (activeConversation?.id === conversationId) {
      setActiveConversation(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      // TODO: Implémenter la suppression via l'API
      // await chatService.deleteConversation(conversationId);
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (activeConversation?.id === conversationId) {
        setActiveConversation(null);
      }
    } catch (err) {
      setError('Erreur lors de la suppression de la conversation');
      console.error(err);
      throw err;
    }
  };

  const value = {
    conversations,
    activeConversation,
    messages,
    loading,
    error,
    setActiveConversation,
    sendMessage,
    loadMoreMessages,
    markAsRead,
    createConversation,
    updateConversation,
    deleteConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export default ChatContext;
