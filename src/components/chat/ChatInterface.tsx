import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PaperAirplaneIcon, 
  ArrowLeftIcon,
  CheckIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  PlusIcon,
  CameraIcon,
  MicrophoneIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';

const ChatInterface: React.FC = () => {
  const {
    activeChat,
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    markAsRead,
    editMessage,
    isRecording,
    setIsRecording
  } = useChat();

  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Gestion de l'enregistrement vocal
  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [isRecording]);

  // Marquer comme lu
  useEffect(() => {
    if (activeChat && messages[activeChat.id]?.length > 0) {
      markAsRead(activeChat.id);
    }
  }, [activeChat, messages, markAsRead]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeChat) return;

    if (editingMessage) {
      editMessage(editingMessage, messageText);
      setEditingMessage(null);
    } else {
      sendMessage(messageText, 'text');
      if (replyingTo) {
        // Logique de réponse
        setReplyingTo(null);
      }
    }

    setMessageText('');
    sendTypingIndicator(false);
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    sendTypingIndicator(text.length > 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return date.toLocaleDateString('fr-FR', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckIcon className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <CheckCircleIcon className="w-4 h-4 text-gray-400" />;
      case 'read':
        return <CheckCircleSolidIcon className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sélectionnez une conversation</h3>
          <p className="text-gray-500">Choisissez une conversation pour commencer à discuter</p>
        </div>
      </div>
    );
  }

  const chatMessages = messages[activeChat.id] || [];
  const typingUsers = Object.entries(isTyping[activeChat.id] || {})
    .filter(([userId, isTyping]) => isTyping && userId !== user?.id)
    .map(([userId]) => userId);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700">
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="w-10 h-10 bg-pm-gold rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {activeChat.name.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{activeChat.name}</h3>
              <p className="text-xs text-gray-500">
                {typingUsers.length > 0 
                  ? `${typingUsers.join(', ')} en train d'écrire...`
                  : `${activeChat.participants.length} participants`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <PhoneIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <VideoCameraIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <MagnifyingGlassIcon className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowOptions(!showOptions)}
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <div className="space-y-4">
          {chatMessages.map((message, index) => {
            const isOwn = message.senderId === user?.id;
            const showDate = index === 0 || 
              formatDate(message.timestamp) !== formatDate(chatMessages[index - 1]?.timestamp);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                )}
                
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                    <div className={`px-4 py-2 rounded-2xl ${
                      isOwn 
                        ? 'bg-pm-gold text-white rounded-br-sm' 
                        : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
                    }`}>
                      {!isOwn && (
                        <p className="text-xs font-medium mb-1 opacity-70">
                          {message.senderName}
                        </p>
                      )}
                      
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <span 
                              key={idx}
                              className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full"
                            >
                              {reaction.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex items-center space-x-1 mt-1 px-2 ${
                      isOwn ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
                      {isOwn && getMessageStatusIcon(message.status)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Indicateur de frappe */}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-900 px-4 py-2 rounded-2xl rounded-bl-sm border border-gray-200">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Zone de réponse */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        {/* Réponse / Édition */}
        {(replyingTo || editingMessage) && (
          <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500">
                {editingMessage ? 'Modification du message' : 'Réponse à'}
              </p>
              <p className="text-sm text-gray-700 truncate">
                {editingMessage || 'Message sélectionné'}
              </p>
            </div>
            <button 
              onClick={() => {
                setReplyingTo(null);
                setEditingMessage(null);
              }}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex items-end space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <PlusIcon className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <CameraIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={messageText}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Écrivez un message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-pm-gold focus:border-transparent"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {isRecording ? (
            <div className="flex items-center space-x-2 bg-red-500 text-white px-3 py-2 rounded-full">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm">{formatRecordingTime(recordingTime)}</span>
              <button 
                onClick={() => setIsRecording(false)}
                className="p-1 hover:bg-red-600 rounded"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <MicrophoneIcon 
                  className="w-5 h-5"
                  onClick={() => setIsRecording(true)}
                />
              </button>
              
              <button 
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-2 bg-pm-gold text-white rounded-full hover:bg-pm-gold-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
