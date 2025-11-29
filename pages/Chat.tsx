import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  BriefcaseIcon,
  StarIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useChat } from '../contexts/ChatContext';
import SEO from '../components/SEO';

interface AgencyMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'admin' | 'model' | 'client' | 'agency';
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'image' | 'casting_update' | 'booking_confirm' | 'urgent';
  status: 'sent' | 'delivered' | 'read';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  metadata?: {
    castingId?: string;
    bookingId?: string;
    modelId?: string;
    deadline?: Date;
  };
}

interface AgencyConversation {
  id: string;
  title: string;
  type: 'model_chat' | 'client_discussion' | 'casting_coordination' | 'booking_management' | 'team_communication' | 'casting_followup' | 'contract_negotiation';
  participants: Array<{
    id: string;
    name: string;
    role: 'admin' | 'model' | 'client' | 'agency';
    avatar?: string;
    isOnline: boolean;
    lastSeen?: Date;
  }>;
  lastMessage?: AgencyMessage;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  priority: 'low' | 'normal' | 'high';
  status: 'active' | 'pending' | 'closed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  metadata?: {
    relatedCasting?: string;
    relatedBooking?: string;
    relatedModel?: string;
    deadline?: Date;
  };
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { data } = useData();
  const navigate = useNavigate();
  const { 
    activeConversation, 
    setActiveConversation, 
    sendMessage,
    searchConversations 
  } = useChat();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'model_chat' | 'client_discussion' | 'casting_coordination' | 'booking_management' | 'team_communication' | 'casting_followup' | 'contract_negotiation'>('all');
  const [newMessage, setNewMessage] = useState('');

<<<<<<< HEAD:src/pages/Chat.tsx
  const filteredConversations = useMemo(() => {
    return searchConversations(searchTerm, {
      type: filterType === 'all' ? undefined : filterType
    });
  }, [searchTerm, filterType, searchConversations]);
=======
  useEffect(() => {
    const initChat = async () => {
      try {
        if (!process.env.API_KEY) {
          throw new Error("La clé API n'est pas configurée pour l'assistant IA.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const chatSession = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "Tu es PMM Assistant, l'IA experte de l'agence de mannequins Perfect Models Management au Gabon. Ton ton est amical, professionnel et encourageant. Tu réponds aux questions sur l'agence, le mannequinat au Gabon, les services de PMM, et donnes des conseils de base. Tes réponses doivent être concises et utiles. Commence la conversation en te présentant chaleureusement et en demandant comment tu peux aider.",
          },
        });
        setChat(chatSession);
        
        const response: GenerateContentResponse = await chatSession.sendMessage({ message: "Bonjour" });
        
        setMessages([{ sender: 'ai', text: response.text }]);
      } catch (err: any) {
        console.error("Chat initialization error:", err);
        setError("Désolé, l'assistant IA est actuellement indisponible. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };
    initChat();
  }, []);
>>>>>>> 7f4053b4fb28e69ba73c77d20b14a5b3bf925929:pages/Chat.tsx

  const selectedConv = activeConversation;

<<<<<<< HEAD:src/pages/Chat.tsx
  const getConversationIcon = (type: AgencyConversation['type']) => {
    switch (type) {
      case 'model_chat': return <UserGroupIcon className="w-5 h-5" />;
      case 'client_discussion': return <BriefcaseIcon className="w-5 h-5" />;
      case 'casting_coordination': return <CalendarIcon className="w-5 h-5" />;
      case 'booking_management': return <StarIcon className="w-5 h-5" />;
      case 'team_communication': return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
      default: return <ChatBubbleLeftRightIcon className="w-5 h-5" />;
=======
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        let response: GenerateContentResponse;
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

        if (isGrounded) {
             response = await ai.models.generateContent({
                 model: 'gemini-2.5-flash',
                 contents: input,
                 config: {
                    tools: [{ googleSearch: {} }],
                 }
             });
        } else {
            if (!chat) {
                throw new Error("La session de chat n'est pas initialisée.");
            }
            response = await chat.sendMessage({ message: input });
        }
        
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources = groundingChunks
            ?.filter((chunk: any) => chunk.web)
            .map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title })) || [];

        const aiMessage: Message = { sender: 'ai', text: response.text, sources: sources.length > 0 ? sources : undefined };
        setMessages(prev => [...prev, aiMessage]);

    } catch (err: any) {
      console.error("Send message error:", err);
      const errorMessage: Message = { sender: 'ai', text: "Oups, quelque chose s'est mal passé. Veuillez réessayer." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
>>>>>>> 7f4053b4fb28e69ba73c77d20b14a5b3bf925929:pages/Chat.tsx
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-400',
      pending: 'text-yellow-400',
      closed: 'text-gray-400',
      cancelled: 'text-red-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const getPriorityColor = (priority: AgencyConversation['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-500/10';
      case 'high': return 'text-orange-500 bg-orange-500/10';
      case 'normal': return 'text-blue-500 bg-blue-500/10';
      case 'low': return 'text-gray-500 bg-gray-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} j`;
    
    return date.toLocaleDateString('fr-FR');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    sendMessage(activeConversation.id, newMessage);
    setNewMessage('');
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      model: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      client: 'bg-green-500/20 text-green-400 border-green-500/30',
      agency: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full border ${colors[role as keyof typeof colors] || colors.admin}`}>
        {role === 'admin' ? 'Admin' : role === 'model' ? 'Mannequin' : role === 'client' ? 'Client' : 'Agence'}
      </span>
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-pm-gold mb-4">Accès Restreint</h1>
          <p className="text-pm-off-white/70">Cette fonctionnalité est réservée aux administrateurs</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Messagerie Agence" description="Système de messagerie avancé pour la gestion de l'agence" />
      
      <div className="min-h-screen bg-pm-dark text-pm-off-white">
        <div className="flex h-screen">
          {/* Sidebar - Liste des conversations */}
          <div className="w-80 bg-pm-dark/50 border-r border-pm-gold/20 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-pm-gold/20">
              <h1 className="text-xl font-bold text-pm-gold mb-4">Messagerie Agence</h1>
              
              {/* Barre de recherche */}
              <div className="relative mb-4">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pm-off-white/50" />
                <input
                  type="text"
                  placeholder="Rechercher une conversation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg focus:outline-none focus:border-pm-gold text-pm-off-white placeholder-pm-off-white/50"
                />
              </div>
              
              {/* Filtres */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filterType === 'all' 
                      ? 'bg-pm-gold text-pm-dark border-pm-gold' 
                      : 'bg-pm-dark/50 text-pm-off-white/70 border-pm-gold/20 hover:border-pm-gold/50'
                  }`}
                >
                  Toutes
                </button>
                <button
                  onClick={() => setFilterType('model_chat')}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filterType === 'model_chat' 
                      ? 'bg-pm-gold text-pm-dark border-pm-gold' 
                      : 'bg-pm-dark/50 text-pm-off-white/70 border-pm-gold/20 hover:border-pm-gold/50'
                  }`}
                >
                  Mannequins
                </button>
                <button
                  onClick={() => setFilterType('client_discussion')}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filterType === 'client_discussion' 
                      ? 'bg-pm-gold text-pm-dark border-pm-gold' 
                      : 'bg-pm-dark/50 text-pm-off-white/70 border-pm-gold/20 hover:border-pm-gold/50'
                  }`}
                >
                  Clients
                </button>
                <button
                  onClick={() => setFilterType('casting_coordination')}
                  className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                    filterType === 'casting_coordination' 
                      ? 'bg-pm-gold text-pm-dark border-pm-gold' 
                      : 'bg-pm-dark/50 text-pm-off-white/70 border-pm-gold/20 hover:border-pm-gold/50'
                  }`}
                >
                  Castings
                </button>
              </div>
            </div>
            
            {/* Liste des conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-4 border-b border-pm-gold/10 cursor-pointer transition-colors hover:bg-pm-dark/30 ${
                    activeConversation?.id === conv.id ? 'bg-pm-gold/10 border-l-4 border-l-pm-gold' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(conv.priority)}`}>
                      {getConversationIcon(conv.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-pm-off-white truncate">{conv.title}</h3>
                        <span className="text-xs text-pm-off-white/50">{formatTimestamp(conv.updatedAt)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        {getRoleBadge(conv.participants[0]?.role || 'admin')}
                        <div className={`w-2 h-2 rounded-full ${conv.participants[0]?.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                        <span className="text-xs text-pm-off-white/50">
                          {conv.participants[0]?.isOnline ? 'En ligne' : `Vu ${formatTimestamp(conv.participants[0]?.lastSeen || new Date())}`}
                        </span>
                      </div>
                      
                      {conv.lastMessage && (
                        <p className="text-sm text-pm-off-white/70 truncate">{conv.lastMessage.content}</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-wrap gap-1">
                          {conv.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-pm-gold/20 text-pm-gold rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {conv.isPinned && <StarIcon className="w-4 h-4 text-pm-gold" />}
                          {conv.unreadCount > 0 && (
                            <span className="px-2 py-1 text-xs bg-pm-gold text-pm-dark rounded-full">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Zone de conversation */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col">
              {/* Header de la conversation */}
              <div className="p-4 bg-pm-dark/50 border-b border-pm-gold/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getPriorityColor(activeConversation.priority)}`}>
                      {getConversationIcon(activeConversation.type)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-pm-off-white">{activeConversation.title}</h2>
                      <div className="flex items-center gap-2 text-sm text-pm-off-white/70">
                        <span>{activeConversation.participants.length} participants</span>
                        <span>•</span>
                        <span className={getStatusColor(activeConversation.status)}>
                          {activeConversation.status === 'active' ? 'Active' : activeConversation.status === 'pending' ? 'En attente' : 'Fermée'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-pm-dark/30 rounded-lg transition-colors">
                      <PhoneIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-pm-dark/30 rounded-lg transition-colors">
                      <VideoCameraIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-pm-dark/30 rounded-lg transition-colors">
                      <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Tags et métadonnées */}
                <div className="flex items-center gap-2 mt-3">
                  {activeConversation.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-pm-gold/20 text-pm-gold rounded-full">
                      {tag}
                    </span>
                  ))}
                  {activeConversation.metadata?.deadline && (
                    <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full flex items-center gap-1">
                      <ClockIcon className="w-3 h-3" />
                      Deadline: {activeConversation.metadata.deadline.toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Messages mock - à remplacer avec vrais messages */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">MD</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-pm-off-white">Marie Dubois</span>
                      <span className="text-xs text-pm-off-white/50">10:30</span>
                      {getRoleBadge('model')}
                    </div>
                    <div className="bg-pm-dark/50 p-3 rounded-lg">
                      <p className="text-pm-off-white">Bonjour ! Je suis disponible pour le casting du 15 Décembre. Quelle heure doit-on arriver ?</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-xs text-pm-off-white/50">10:35</span>
                      <span className="font-semibold text-pm-off-white">Vous</span>
                      {getRoleBadge('admin')}
                    </div>
                    <div className="bg-pm-gold/20 p-3 rounded-lg inline-block">
                      <p className="text-pm-off-white">Parfait Marie ! Présentez-vous à 9h au studio. N'oubliez pas votre book et votre pièce d'identité.</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <CheckCircleIcon className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-pm-off-white/50">Lu</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">AD</span>
                  </div>
                </div>
              </div>
              
              {/* Zone de saisie */}
              <div className="p-4 bg-pm-dark/50 border-t border-pm-gold/20">
                <div className="flex items-center gap-3">
                  <button className="p-2 hover:bg-pm-dark/30 rounded-lg transition-colors">
                    <PaperClipIcon className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-pm-dark/30 rounded-lg transition-colors">
                    <FaceSmileIcon className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg focus:outline-none focus:border-pm-gold text-pm-off-white placeholder-pm-off-white/50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PaperAirplaneIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-pm-off-white mb-2">Sélectionnez une conversation</h3>
                <p className="text-pm-off-white/50">Choisissez une conversation dans la liste pour commencer à discuter</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
