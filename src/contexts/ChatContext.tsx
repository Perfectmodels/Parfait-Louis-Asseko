import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  AgencyMessage, 
  AgencyConversation, 
  AgencyMessagingStats, 
  MessagingTemplate, 
  MessagingAutomation 
} from '../types';

interface ChatContextType {
  // Conversations
  conversations: AgencyConversation[];
  activeConversation: AgencyConversation | null;
  setActiveConversation: (conversation: AgencyConversation | null) => void;
  createConversation: (conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AgencyConversation>;
  updateConversation: (id: string, updates: Partial<AgencyConversation>) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  
  // Messages
  messages: AgencyMessage[];
  sendMessage: (conversationId: string, content: string, type?: AgencyMessage['type'], attachments?: any[]) => Promise<void>;
  updateMessage: (id: string, updates: Partial<AgencyMessage>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  
  // Templates
  templates: MessagingTemplate[];
  createTemplate: (template: Omit<MessagingTemplate, 'id' | 'createdAt' | 'usageCount'>) => Promise<void>;
  updateTemplate: (id: string, updates: Partial<MessagingTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  useTemplate: (templateId: string, variables: Record<string, any>) => string;
  
  // Automation
  automations: MessagingAutomation[];
  createAutomation: (automation: Omit<MessagingAutomation, 'id' | 'createdAt' | 'triggerCount'>) => Promise<void>;
  updateAutomation: (id: string, updates: Partial<MessagingAutomation>) => Promise<void>;
  deleteAutomation: (id: string) => Promise<void>;
  toggleAutomation: (id: string) => Promise<void>;
  
  // Stats
  stats: AgencyMessagingStats | null;
  refreshStats: () => Promise<void>;
  
  // Search and Filter
  searchConversations: (query: string, filters?: {
    type?: AgencyConversation['type'];
    priority?: AgencyConversation['priority'];
    status?: AgencyConversation['status'];
    tags?: string[];
  }) => AgencyConversation[];
  
  // Real-time
  isOnline: boolean;
  unreadCount: number;
  urgentCount: number;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { data } = useData();
  
  const [conversations, setConversations] = useState<AgencyConversation[]>([]);
  const [messages, setMessages] = useState<AgencyMessage[]>([]);
  const [activeConversation, setActiveConversation] = useState<AgencyConversation | null>(null);
  const [templates, setTemplates] = useState<MessagingTemplate[]>([]);
  const [automations, setAutomations] = useState<MessagingAutomation[]>([]);
  const [stats, setStats] = useState<AgencyMessagingStats | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [urgentCount, setUrgentCount] = useState(0);

  // Initialisation des données
  useEffect(() => {
    if (data && user?.role === 'admin') {
      loadConversations();
      loadMessages();
      loadTemplates();
      loadAutomations();
      refreshStats();
    }
  }, [data, user]);

  // Écoute des messages en temps réel (simulation WebSocket)
  useEffect(() => {
    // Simuler une connexion WebSocket
    const wsInterval = setInterval(() => {
      setIsOnline(Math.random() > 0.1); // 90% de chance d'être en ligne
    }, 5000);

    return () => clearInterval(wsInterval);
  }, []);

  const loadConversations = useCallback(() => {
    // Charger les conversations depuis le stockage local ou l'API
    const savedConversations = localStorage.getItem('agency_conversations');
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      setConversations(parsed.map((conv: any) => ({
        ...conv,
        createdAt: new Date(conv.createdAt),
        updatedAt: new Date(conv.updatedAt),
        metadata: conv.metadata ? {
          ...conv.metadata,
          deadline: conv.metadata.deadline ? new Date(conv.metadata.deadline) : undefined,
          nextActionDate: conv.metadata.nextActionDate ? new Date(conv.metadata.nextActionDate) : undefined,
        } : undefined
      })));
    } else {
      // Initialiser avec des conversations par défaut
      initializeDefaultConversations();
    }
  }, []);

  const loadMessages = useCallback(() => {
    const savedMessages = localStorage.getItem('agency_messages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        metadata: msg.metadata ? {
          ...msg.metadata,
          deadline: msg.metadata.deadline ? new Date(msg.metadata.deadline) : undefined,
        } : undefined
      })));
    }
  }, []);

  const loadTemplates = useCallback(() => {
    const defaultTemplates: MessagingTemplate[] = [
      {
        id: 'casting-confirmation',
        name: 'Confirmation Casting',
        category: 'casting',
        content: 'Bonjour {modelName},\n\nNous vous confirmons votre participation au casting "{castingTitle}" le {date} à {time}.\n\nAdresse : {address}\n\nMerci d\'arriver 15 minutes en avance avec votre book et pièce d\'identité.\n\nCordialement,\n{agencyName}',
        variables: [
          { name: 'modelName', type: 'text', required: true },
          { name: 'castingTitle', type: 'text', required: true },
          { name: 'date', type: 'date', required: true },
          { name: 'time', type: 'text', required: true },
          { name: 'address', type: 'text', required: true },
          { name: 'agencyName', type: 'text', required: true, defaultValue: 'Perfect Models' }
        ],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        usageCount: 0
      },
      {
        id: 'booking-confirmation',
        name: 'Confirmation Booking',
        category: 'booking',
        content: 'Cher {clientName},\n\nNous vous confirmons le booking de {modelName} pour {projectName}.\n\nDates : {dates}\nLieu : {location}\nBudget : {budget} FCFA\n\nContrat à signer avant le {deadline}.\n\nBien cordialement,\n{agencyName}',
        variables: [
          { name: 'clientName', type: 'text', required: true },
          { name: 'modelName', type: 'text', required: true },
          { name: 'projectName', type: 'text', required: true },
          { name: 'dates', type: 'text', required: true },
          { name: 'location', type: 'text', required: true },
          { name: 'budget', type: 'number', required: true },
          { name: 'deadline', type: 'date', required: true },
          { name: 'agencyName', type: 'text', required: true, defaultValue: 'Perfect Models' }
        ],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        usageCount: 0
      },
      {
        id: 'urgent-reminder',
        name: 'Rappel Urgent',
        category: 'urgent',
        content: '🚨 URGENT 🚨\n\n{message}\n\nMerci de traiter ce dossier en priorité avant {deadline}.\n\nContact : {contact}',
        variables: [
          { name: 'message', type: 'text', required: true },
          { name: 'deadline', type: 'date', required: true },
          { name: 'contact', type: 'text', required: true }
        ],
        isSystem: true,
        createdBy: 'system',
        createdAt: new Date(),
        usageCount: 0
      }
    ];
    setTemplates(defaultTemplates);
  }, []);

  const loadAutomations = useCallback(() => {
    const defaultAutomations: MessagingAutomation[] = [
      {
        id: 'auto-reply-booking',
        name: 'Réponse automatique booking',
        trigger: 'new_booking',
        conditions: [],
        actions: [
          {
            type: 'send_template',
            parameters: { templateId: 'booking-confirmation', delay: 300000 } // 5 minutes
          }
        ],
        isActive: true,
        createdBy: 'system',
        createdAt: new Date(),
        triggerCount: 0
      },
      {
        id: 'deadline-reminder',
        name: 'Rappel deadline',
        trigger: 'deadline_approaching',
        conditions: [
          { field: 'hoursBefore', operator: 'less_than', value: 24 }
        ],
        actions: [
          {
            type: 'send_template',
            parameters: { templateId: 'urgent-reminder' }
          },
          {
            type: 'change_priority',
            parameters: { priority: 'urgent' }
          }
        ],
        isActive: true,
        createdBy: 'system',
        createdAt: new Date(),
        triggerCount: 0
      }
    ];
    setAutomations(defaultAutomations);
  }, []);

  const initializeDefaultConversations = () => {
    const defaultConversations: AgencyConversation[] = [
      {
        id: '1',
        title: 'Marie Dubois - Casting Fashion Week',
        type: 'casting_coordination',
        participants: [
          {
            id: 'model-1',
            name: 'Marie Dubois',
            role: 'model',
            avatar: '/models/marie.jpg',
            isOnline: true,
            permissions: {
              canSendMessages: true,
              canAddMembers: false,
              canRemoveMembers: false,
              canEditInfo: false,
              canDeleteMessages: false
            }
          },
          {
            id: 'admin-1',
            name: user?.name || 'Admin',
            role: 'admin',
            isOnline: true,
            permissions: {
              canSendMessages: true,
              canAddMembers: true,
              canRemoveMembers: true,
              canEditInfo: true,
              canDeleteMessages: true
            }
          }
        ],
        unreadCount: 2,
        isPinned: true,
        isArchived: false,
        isMuted: false,
        isFavorite: false,
        priority: 'high',
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        updatedAt: new Date(Date.now() - 1000 * 60 * 10),
        tags: ['casting', 'fashion-week', 'prioritaire'],
        metadata: {
          relatedCasting: 'fw-2024',
          relatedModel: 'marie-dubois',
          deadline: new Date('2024-12-15'),
          nextAction: 'Confirmer disponibilité',
          nextActionDate: new Date('2024-12-01')
        },
        settings: {
          autoDelete: 0,
          encryption: 'basic',
          allowScreenshots: true,
          allowForwarding: false,
          requireConfirmation: false
        }
      }
    ];
    setConversations(defaultConversations);
    localStorage.setItem('agency_conversations', JSON.stringify(defaultConversations));
  };

  const createConversation = useCallback(async (conversation: Omit<AgencyConversation, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newConversation: AgencyConversation = {
      ...conversation,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem('agency_conversations', JSON.stringify(updatedConversations));

    // Envoyer une notification
    if (newConversation.type === 'model_chat') {
      // Notifier le modèle
      console.log('Notification envoyée au modèle:', newConversation.participants.find(p => p.role === 'model')?.name);
    }

    return newConversation;
  }, [conversations]);

  const sendMessage = useCallback(async (conversationId: string, content: string, type: AgencyMessage['type'] = 'text', attachments?: any[]) => {
    if (!user) throw new Error('Utilisateur non connecté');

    const newMessage: AgencyMessage = {
      id: Date.now().toString(),
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role === 'admin' ? 'admin' : 'agency',
      content,
      timestamp: new Date(),
      type,
      status: 'sent',
      priority: 'normal',
      attachments
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('agency_messages', JSON.stringify(updatedMessages));

    // Mettre à jour la conversation
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      const updatedConversation = {
        ...conversation,
        lastMessage: newMessage,
        updatedAt: new Date()
      };
      const updatedConversations = conversations.map(c => c.id === conversationId ? updatedConversation : c);
      setConversations(updatedConversations);
      localStorage.setItem('agency_conversations', JSON.stringify(updatedConversations));
    }

    // Simuler la livraison et la lecture
    setTimeout(() => {
      newMessage.status = 'delivered';
      setMessages([...updatedMessages]);
    }, 1000);

    setTimeout(() => {
      newMessage.status = 'read';
      setMessages([...updatedMessages]);
    }, 3000);

    // Vérifier les automations
    checkAutomations('message_received', { conversationId, message: newMessage });
  }, [messages, conversations, user]);

  const updateMessage = useCallback(async (id: string, updates: Partial<AgencyMessage>) => {
    const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, ...updates } : msg);
    setMessages(updatedMessages);
    localStorage.setItem('agency_messages', JSON.stringify(updatedMessages));
  }, [messages]);

  const deleteMessage = useCallback(async (id: string) => {
    const updatedMessages = messages.map(msg => msg.id === id ? { ...msg, deleted: true } : msg);
    setMessages(updatedMessages);
    localStorage.setItem('agency_messages', JSON.stringify(updatedMessages));
  }, [messages]);

  const markAsRead = useCallback(async (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation && conversation.unreadCount > 0) {
      const updatedConversation = { ...conversation, unreadCount: 0 };
      const updatedConversations = conversations.map(c => c.id === conversationId ? updatedConversation : c);
      setConversations(updatedConversations);
      localStorage.setItem('agency_conversations', JSON.stringify(updatedConversations));
    }
  }, [conversations]);

  const createTemplate = useCallback(async (template: Omit<MessagingTemplate, 'id' | 'createdAt' | 'usageCount'>) => {
    const newTemplate: MessagingTemplate = {
      ...template,
      id: Date.now().toString(),
      createdAt: new Date(),
      usageCount: 0
    };

    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
  }, [templates]);

  const updateTemplate = useCallback(async (id: string, updates: Partial<MessagingTemplate>) => {
    const updatedTemplates = templates.map(t => t.id === id ? { ...t, ...updates } : t);
    setTemplates(updatedTemplates);
  }, [templates]);

  const deleteTemplate = useCallback(async (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    setTemplates(updatedTemplates);
  }, [templates]);

  const useTemplate = useCallback((templateId: string, variables: Record<string, any>): string => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return '';

    let content = template.content;
    template.variables.forEach(variable => {
      const value = variables[variable.name] || variable.defaultValue || `{${variable.name}}`;
      content = content.replace(new RegExp(`{${variable.name}}`, 'g'), value);
    });

    // Incrémenter le compteur d'utilisation
    template.usageCount++;
    updateTemplate(templateId, { usageCount: template.usageCount });

    return content;
  }, [templates, updateTemplate]);

  const createAutomation = useCallback(async (automation: Omit<MessagingAutomation, 'id' | 'createdAt' | 'triggerCount'>) => {
    const newAutomation: MessagingAutomation = {
      ...automation,
      id: Date.now().toString(),
      createdAt: new Date(),
      triggerCount: 0
    };

    const updatedAutomations = [...automations, newAutomation];
    setAutomations(updatedAutomations);
  }, [automations]);

  const updateAutomation = useCallback(async (id: string, updates: Partial<MessagingAutomation>) => {
    const updatedAutomations = automations.map(a => a.id === id ? { ...a, ...updates } : a);
    setAutomations(updatedAutomations);
  }, [automations]);

  const deleteAutomation = useCallback(async (id: string) => {
    const updatedAutomations = automations.filter(a => a.id !== id);
    setAutomations(updatedAutomations);
  }, [automations]);

  const toggleAutomation = useCallback(async (id: string) => {
    const automation = automations.find(a => a.id === id);
    if (automation) {
      await updateAutomation(id, { isActive: !automation.isActive });
    }
  }, [automations, updateAutomation]);

  const checkAutomations = useCallback((trigger: MessagingAutomation['trigger'], data: any) => {
    automations
      .filter(a => a.isActive && a.trigger === trigger)
      .forEach(automation => {
        // Vérifier les conditions
        const conditionsMet = automation.conditions.every(() => {
          // Logique de vérification des conditions
          return true; // Simplifié pour l'exemple
        });

        if (conditionsMet) {
          // Exécuter les actions
          automation.actions.forEach(action => {
            switch (action.type) {
              case 'send_template':
                if (action.parameters.templateId && data.conversationId) {
                  const content = useTemplate(action.parameters.templateId, data.variables || {});
                  sendMessage(data.conversationId, content);
                }
                break;
              case 'change_priority':
                if (data.conversationId && action.parameters.priority) {
                  const conversation = conversations.find(c => c.id === data.conversationId);
                  if (conversation) {
                    updateConversation(data.conversationId, { priority: action.parameters.priority });
                  }
                }
                break;
              // Autres actions...
            }
          });

          // Mettre à jour le compteur
          automation.triggerCount++;
          automation.lastTriggered = new Date();
        }
      });
  }, [automations, useTemplate, sendMessage, conversations]);

  const updateConversation = useCallback(async (id: string, updates: Partial<AgencyConversation>) => {
    const updatedConversations = conversations.map(c => c.id === id ? { ...c, ...updates } : c);
    setConversations(updatedConversations);
    localStorage.setItem('agency_conversations', JSON.stringify(updatedConversations));
  }, [conversations]);

  const deleteConversation = useCallback(async (id: string) => {
    const updatedConversations = conversations.filter(c => c.id !== id);
    setConversations(updatedConversations);
    localStorage.setItem('agency_conversations', JSON.stringify(updatedConversations));
  }, [conversations]);

  const refreshStats = useCallback(async () => {
    const totalConversations = conversations.length;
    const activeConversations = conversations.filter(c => c.status === 'active').length;
    const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    const urgentMessages = conversations.filter(c => c.priority === 'urgent').length;
    const pendingActions = conversations.filter(c => 
      c.metadata?.nextActionDate && 
      new Date(c.metadata.nextActionDate) <= new Date()
    ).length;

    const todayActivity = {
      messagesSent: messages.filter(m => 
        m.senderId === user?.id && 
        m.timestamp.toDateString() === new Date().toDateString()
      ).length,
      messagesReceived: messages.filter(m => 
        m.senderId !== user?.id && 
        m.timestamp.toDateString() === new Date().toDateString()
      ).length,
      newConversations: conversations.filter(c => 
        c.createdAt.toDateString() === new Date().toDateString()
      ).length,
      resolvedConversations: conversations.filter(c => 
        c.status === 'closed' && 
        c.updatedAt.toDateString() === new Date().toDateString()
      ).length
    };

    // Calculer les tendances hebdomadaires
    const weeklyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      weeklyTrend.push({
        date: dateStr,
        messages: messages.filter(m => m.timestamp.toDateString() === date.toDateString()).length,
        conversations: conversations.filter(c => c.createdAt.toDateString() === date.toDateString()).length
      });
    }

    const typeDistribution = {
      model_chat: conversations.filter(c => c.type === 'model_chat').length,
      client_discussion: conversations.filter(c => c.type === 'client_discussion').length,
      casting_coordination: conversations.filter(c => c.type === 'casting_coordination').length,
      booking_management: conversations.filter(c => c.type === 'booking_management').length,
      team_communication: conversations.filter(c => c.type === 'team_communication').length
    };

    const priorityDistribution = {
      urgent: conversations.filter(c => c.priority === 'urgent').length,
      high: conversations.filter(c => c.priority === 'high').length,
      normal: conversations.filter(c => c.priority === 'normal').length,
      low: conversations.filter(c => c.priority === 'low').length
    };

    const newStats: AgencyMessagingStats = {
      totalConversations,
      activeConversations,
      unreadMessages,
      urgentMessages,
      pendingActions,
      todayActivity,
      weeklyTrend,
      typeDistribution,
      priorityDistribution
    };

    setStats(newStats);
    setUnreadCount(unreadMessages);
    setUrgentCount(urgentMessages);
  }, [conversations, messages, user]);

  const searchConversations = useCallback((query: string, filters?: {
    type?: AgencyConversation['type'];
    priority?: AgencyConversation['priority'];
    status?: AgencyConversation['status'];
    tags?: string[];
  }) => {
    return conversations.filter(conv => {
      const matchesQuery = conv.title.toLowerCase().includes(query.toLowerCase()) ||
                           conv.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));

      if (filters?.type && conv.type !== filters.type) return false;
      if (filters?.priority && conv.priority !== filters.priority) return false;
      if (filters?.status && conv.status !== filters.status) return false;
      if (filters?.tags && !filters.tags.some(tag => conv.tags.includes(tag))) return false;

      return matchesQuery;
    });
  }, [conversations]);

  // Mettre à jour les stats régulièrement
  useEffect(() => {
    const interval = setInterval(() => {
      refreshStats();
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, [refreshStats]);

  const value: AgencyMessagingContextType = {
    conversations,
    activeConversation,
    setActiveConversation,
    createConversation,
    updateConversation,
    deleteConversation,
    messages,
    sendMessage,
    updateMessage,
    deleteMessage,
    markAsRead,
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    automations,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation,
    stats,
    refreshStats,
    searchConversations,
    isOnline,
    unreadCount,
    urgentCount
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
