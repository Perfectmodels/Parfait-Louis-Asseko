import React, { useState, useMemo } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  BellSlashIcon,
  ArchiveBoxIcon,
  PencilIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  EllipsisVerticalIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

const ChatList: React.FC = () => {
  const {
    chats,
    activeChat,
    setActiveChat,
    messages,
    filterChats,
    searchTerm,
    setSearchTerm,
    archiveChat,
    muteChat,
    pinChat,
    deleteChat,
    toggleFavorite,
    initiateCall
  } = useChat();

  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'unread' | 'archived' | 'pinned' | 'favorites'>('all');
  const [showChatOptions, setShowChatOptions] = useState<string | null>(null);
  
  // Nouveaux états Phase 1
  const [sortBy] = useState<'recent' | 'name' | 'unread' | 'priority'>('recent');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedLabels] = useState<string[]>([]);

  // Filtrer les chats selon le filtre, recherche, étiquettes et tri
  const filteredChats = useMemo(() => {
    let filtered = filterChats(filter);
    
    // Filtre par étiquettes
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(chat => 
        chat.labels?.some(label => selectedLabels.includes(label.id))
      );
    }
    
    // Recherche textuelle
    if (searchTerm) {
      filtered = filtered.filter(chat => 
        chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.lastMessage?.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        chat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'recent':
          comparison = (b.lastActivity || b.createdAt) - (a.lastActivity || a.createdAt);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'unread':
          comparison = b.unreadCount - a.unreadCount;
          break;
        case 'priority':
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          comparison = priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal'];
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [chats, filter, searchTerm, filterChats, selectedLabels, sortBy, sortOrder]);

  const formatLastMessage = (message: any) => {
    if (!message) return '';
    
    const text = message.text;
    const maxLength = 50;
    
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return date.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}j`;
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getStatusIcon = (chat: any) => {
    if (chat.isPinned) {
      return <PaperClipIcon className="w-4 h-4 text-pm-gold transform rotate-45" />;
    }
    if (chat.isMuted) {
      return <BellSlashIcon className="w-4 h-4 text-gray-400" />;
    }
    if (chat.isArchived) {
      return <ArchiveBoxIcon className="w-4 h-4 text-gray-400" />;
    }
    return null;
  };

  const handleChatAction = (action: string, chatId: string) => {
    switch (action) {
      case 'archive':
        archiveChat(chatId);
        break;
      case 'mute':
        muteChat(chatId);
        break;
      case 'pin':
        pinChat(chatId);
        break;
      case 'favorite':
        toggleFavorite(chatId);
        break;
      case 'delete':
        if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
          deleteChat(chatId);
        }
        break;
      case 'unarchive':
        archiveChat(chatId);
        break;
      case 'voiceCall':
        initiateCall(chatId, 'voice');
        break;
      case 'videoCall':
        initiateCall(chatId, 'video');
        break;
    }
    setShowChatOptions(null);
  };

  const unreadTotal = chats.reduce((total, chat) => total + chat.unreadCount, 0);

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
          <div className="flex items-center space-x-2">
            {unreadTotal > 0 && (
              <span className="bg-pm-gold text-white text-xs px-2 py-1 rounded-full">
                {unreadTotal}
              </span>
            )}
            <button className="p-2 text-pm-gold hover:bg-pm-gold-50 rounded-lg">
              <PencilIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher une conversation..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-pm-gold"
          />
        </div>
      </div>

      {/* Filtres */}
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'Tous', icon: ChatBubbleLeftRightIcon },
            { key: 'unread', label: 'Non lus', icon: CheckCircleIcon },
            { key: 'pinned', label: 'Épinglés', icon: PaperClipIcon },
            { key: 'archived', label: 'Archivés', icon: ArchiveBoxIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
                filter === key
                  ? 'bg-pm-gold text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {key === 'unread' && unreadTotal > 0 && (
                <span className="ml-1 text-xs">({unreadTotal})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des chats */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ChatBubbleLeftRightIcon className="w-12 h-12 mb-2" />
            <p className="text-sm">
              {searchTerm ? 'Aucune conversation trouvée' : 'Aucune conversation'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => {
              const isActive = activeChat?.id === chat.id;
              const lastMessage = messages[chat.id]?.[messages[chat.id].length - 1] || chat.lastMessage;
              
              return (
                <div
                  key={chat.id}
                  className={`relative hover:bg-gray-50 cursor-pointer transition-colors ${
                    isActive ? 'bg-pm-gold bg-opacity-10' : ''
                  }`}
                  onClick={() => setActiveChat(chat)}
                >
                  <div className="flex items-center p-4">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-12 h-12 bg-pm-gold rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">
                          {chat.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Indicateur en ligne */}
                      {chat.type === 'private' && (
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                          chat.participants[0]?.isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      )}
                    </div>

                    {/* Infos */}
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">
                          {chat.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(chat)}
                          <span className="text-xs text-gray-500">
                            {lastMessage ? formatTime(lastMessage.timestamp) : ''}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {lastMessage ? (
                            <>
                              {lastMessage.senderId !== user?.id && (
                                <span className="font-medium">{lastMessage.senderName}: </span>
                              )}
                              {formatLastMessage(lastMessage)}
                            </>
                          ) : (
                            <span className="text-gray-400">Aucun message</span>
                          )}
                        </p>
                        
                        {chat.unreadCount > 0 && (
                          <span className="bg-pm-gold text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Menu options */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChatOptions(showChatOptions === chat.id ? null : chat.id);
                      }}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600 opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown options */}
                  {showChatOptions === chat.id && (
                    <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      {chat.isArchived ? (
                        <button
                          onClick={() => handleChatAction('unarchive', chat.id)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                        >
                          <ArrowUturnLeftIcon className="w-4 h-4" />
                          <span>Désarchiver</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleChatAction('mute', chat.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            {chat.isMuted ? (
                              <>
                                <BellIcon className="w-4 h-4" />
                                <span>Activer les notifications</span>
                              </>
                            ) : (
                              <>
                                <BellSlashIcon className="w-4 h-4" />
                                <span>Silencer</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleChatAction('pin', chat.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <PaperClipIcon className="w-4 h-4" />
                            <span>{chat.isPinned ? 'Désépingler' : 'Épingler'}</span>
                          </button>
                          
                          <button
                            onClick={() => handleChatAction('archive', chat.id)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <ArchiveBoxIcon className="w-4 h-4" />
                            <span>Archiver</span>
                          </button>
                        </>
                      )}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={() => handleChatAction('delete', chat.id)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
