// src/components/WhatsAppMessaging.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  CheckCircleIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useMessages, InternalMessage } from '../hooks/useMessages';
import NewConversationModal from './admin/NewConversationModal';
import debounce from 'lodash.debounce';

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
}) => {
  const {
    conversations,
    subscribeToConversation,
    createConversationIfNotExists,
    sendMessage,
    markConversationAsRead,
    setTyping
  } = useMessages(currentUserId);

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [conversationMessages, setConversationMessages] = useState<InternalMessage[]>([]);
  const [messageContent, setMessageContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // subscribe to selected conversation messages in real-time
  useEffect(() => {
    if (!selectedConversation) {
      setConversationMessages([]);
      return;
    }
    const unsub = subscribeToConversation(selectedConversation, (msgs) => {
      setConversationMessages(msgs as InternalMessage[]);
      // auto mark as read when new messages appear from others
      markConversationAsRead(selectedConversation, currentUserId).catch(console.error);
    });

    // presence (typing) listener: listen to `presence` subcollection
    const presenceUnsub = (async () => {
      // we attach a snapshot listener manually here
      const { onSnapshot, collection } = await import('firebase/firestore');
      const { firestore } = await import('../lib/firebase');
      const presenceQ = collection(firestore, `conversations/${selectedConversation}/presence`);
      // @ts-ignore dynamic import types
      const unsubPresence = onSnapshot(presenceQ, snapshot => {
        const map: Record<string, boolean> = {};
        snapshot.forEach(d => {
          const data: any = d.data();
          map[d.id] = !!data.typing;
        });
        setTypingStatus(map);
      });
      return unsubPresence;
    })();

    return () => {
      unsub();
      (presenceUnsub as any)?.then?.((u: any) => u?.()).catch(() => {});
    };
  }, [selectedConversation, subscribeToConversation, markConversationAsRead, currentUserId]);

  // scroll to bottom on messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // search debounced
  const [filteredConversations, setFilteredConversations] = useState(conversations);
  useEffect(() => setFilteredConversations(conversations), [conversations]);

  // debounce filter
  const runFilter = debounce((q: string, convs: any[]) => {
    const lower = q.trim().toLowerCase();
    if (!lower) {
      setFilteredConversations(convs);
      return;
    }
    setFilteredConversations(convs.filter(c =>
      c.id.toLowerCase().includes(lower) ||
      (c.lastMessage && (c.lastMessage.content || '').toLowerCase().includes(lower))
    ));
  }, 200);

  useEffect(() => {
    runFilter(searchQuery, conversations);
  }, [searchQuery, conversations]);

  // new conversation quick create (opens or creates deterministic conv)
  const startConversationWith = async (otherUserId: string, otherUserName: string, otherUserRole: string) => {
    const convId = await createConversationIfNotExists(currentUserId, otherUserId, {
      displayName: otherUserName,
      userRole: otherUserRole
    });
    setSelectedConversation(convId);
  };

  // send message handler
  const handleSend = async (files?: File[]) => {
    if ((!messageContent.trim() && (!files || files.length === 0)) || !selectedConversation) return;
    try {
      await sendMessage(selectedConversation, {
        conversationId: selectedConversation,
        senderId: currentUserId,
        senderName: currentUserName,
        senderRole: currentUserRole,
        recipientId: '', // conversation meta manages participants
        recipientName: '',
        recipientRole: '',
        content: messageContent.trim(),
        messageType: files && files.length ? 'file' : 'text',
      }, files);
      setMessageContent('');
      setSelectedFiles([]);
      // Desktop notification
      if ('Notification' in window && Notification.permission === 'granted') {
        // nothing here (notifications for recipients are handled in backend/cloud functions ideally)
      }
    } catch (err) {
      console.error('send error', err);
    }
  };

  // keypress enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(selectedFiles.length ? selectedFiles : undefined);
    }
  };

  // typing indicator
  useEffect(() => {
    if (!selectedConversation) return;
    // when messageContent changes, set typing true briefly
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    (async () => {
      await setTyping(selectedConversation, currentUserId, true);
      typingTimeoutRef.current = window.setTimeout(async () => {
        await setTyping(selectedConversation, currentUserId, false);
      }, 1200);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageContent]);

  // file input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const arr = Array.from(e.target.files);
    setSelectedFiles(arr);
  };

  // format time
  const formatTime = (iso?: any) => {
    if (!iso) return '';
    const d = iso.toDate ? iso.toDate() : new Date(iso);
    const now = new Date();
    const diffHours = (now.getTime() - d.getTime()) / (1000 * 60 * 60);
    if (diffHours < 24) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (diffHours < 48) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  };

  // get message status icon
  const getMessageStatus = (message: InternalMessage) => {
    if (message.senderId !== currentUserId) return null;
    if (message.isRead) return <CheckCircleIcon className="w-4 h-4 text-blue-500" />;
    return <CheckIcon className="w-4 h-4 text-gray-400" />;
  };

  // responsive behavior: if on small screens, hide sidebar when conversation selected (Tailwind classes below)
  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`w-1/3 bg-white border-r border-gray-200 flex flex-col md:block ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="bg-pm-gold p-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Messages</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowNewConversationModal(true)}
                className="p-2 hover:bg-pm-gold/20 rounded-full"
                title="Nouvelle conversation"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-pm-gold/20 rounded-full"><VideoCameraIcon className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-pm-gold/20 rounded-full"><PhoneIcon className="w-5 h-5" /></button>
              <button className="p-2 hover:bg-pm-gold/20 rounded-full"><EllipsisVerticalIcon className="w-5 h-5" /></button>
            </div>
          </div>
        </div>

        <div className="p-3 bg-gray-50">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher une conversation..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pm-gold/50" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="p-4 text-sm text-gray-500">Aucune conversation</div>
          )}
          {filteredConversations.map(conv => (
            <div key={conv.id} onClick={() => setSelectedConversation(conv.id)} className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedConversation === conv.id ? 'bg-pm-gold/10 border-l-4 border-l-pm-gold' : ''}`}>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-pm-gold" />
                  </div>
                  {conv.unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{conv.unreadCount}</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{conv.displayName || conv.id}</h3>
                    <span className="text-xs text-gray-500">{conv.lastMessage ? formatTime(conv.lastMessage.timestamp) : ''}</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{conv.lastMessage ? conv.lastMessage.content || (conv.lastMessage.attachments && `${conv.lastMessage.attachments.length} fichier(s)`) : 'Aucun message'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-pm-gold/20 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-pm-gold" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation}</h3>
                  <p className="text-sm text-gray-500">
                    {Object.keys(typingStatus).some(k => typingStatus[k] && k !== currentUserId) ? 'En train d\'écrire...' : 'En ligne'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-full"><VideoCameraIcon className="w-5 h-5 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-full"><PhoneIcon className="w-5 h-5 text-gray-600" /></button>
                <button className="p-2 hover:bg-gray-100 rounded-full"><EllipsisVerticalIcon className="w-5 h-5 text-gray-600" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
              {conversationMessages.map((message, index) => {
                const isOwn = message.senderId === currentUserId;
                const prev = index > 0 ? conversationMessages[index - 1] : null;
                const showAvatar = !prev || prev.senderId !== message.senderId;
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!isOwn && showAvatar && (
                        <div className="w-8 h-8 bg-pm-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-4 h-4 text-pm-gold" />
                        </div>
                      )}
                      {!isOwn && !showAvatar && <div className="w-8 h-8" />}
                      <div className={`rounded-2xl px-4 py-2 ${isOwn ? 'bg-pm-gold text-white' : 'bg-white text-gray-900'}`}>
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mb-2">
                            {message.attachments.map((a, i) => (
                              <div key={i} className="mb-1">
                                <a href={a.url} target="_blank" rel="noreferrer" className="text-xs underline">{a.name}</a>
                              </div>
                            ))}
                          </div>
                        )}
                        {message.content && <p className="text-sm">{message.content}</p>}
                        <div className={`flex items-center justify-end space-x-1 mt-1 ${isOwn ? 'text-pm-gold/70' : 'text-gray-500'}`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {getMessageStatus(message)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-gray-100 rounded-full">
                  <PaperClipIcon className="w-5 h-5 text-gray-600" />
                </button>
                <input ref={fileInputRef} onChange={onFileChange} type="file" multiple className="hidden" />

                <div className="flex-1 relative">
                  <input value={messageContent} onChange={(e) => setMessageContent(e.target.value)} onKeyDown={handleKeyDown} placeholder="Tapez un message..." className="w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pm-gold/50" />
                  {selectedFiles.length > 0 && (
                    <div className="absolute -bottom-10 left-4 bg-white p-2 rounded shadow text-xs">
                      {selectedFiles.map(f => <div key={f.name}>{f.name}</div>)}
                    </div>
                  )}
                </div>

                <button onClick={() => handleSend(selectedFiles.length ? selectedFiles : undefined)} disabled={!messageContent.trim() && selectedFiles.length === 0} className="p-2 bg-pm-gold text-white rounded-full hover:bg-pm-gold/90 disabled:opacity-50 disabled:cursor-not-allowed">
                  <PaperAirplaneIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez une conversation</h3>
              <p className="text-gray-500">Choisissez une conversation pour commencer à discuter</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal Nouvelle Conversation */}
      <NewConversationModal
        isOpen={showNewConversationModal}
        onClose={() => setShowNewConversationModal(false)}
        onStartConversation={startConversationWith}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default WhatsAppMessaging;