import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PaperAirplaneIcon, 
  PaperClipIcon, 
  FaceSmileIcon, 
  MicrophoneIcon,
  CameraIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface MessageInputProps {
  onSendMessage: (text: string, type?: string, attachments?: any[]) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  disabled = false,
  placeholder = "Écrivez un message...",
  className = ""
}) => {
  const {
    sendTypingIndicator,
    isRecording,
    setIsRecording,
    showEmojiPicker,
    setShowEmojiPicker,
    replyToMessage,
    replyingTo,
    clearReply
  } = useChat();

  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  }, [messageText]);

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

  const handleSend = () => {
    if (!messageText.trim() && attachments.length === 0) return;
    
    onSendMessage(messageText, 'text', attachments);
    setMessageText('');
    setAttachments([]);
    sendTypingIndicator(false);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    sendTypingIndicator(text.length > 0);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setShowAttachmentMenu(false);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isRecording) {
    return (
      <div className={`bg-white border-t border-gray-200 p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-3 bg-red-500 text-white px-4 py-3 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Enregistrement...</span>
            <span className="font-mono">{formatRecordingTime(recordingTime)}</span>
          </div>
          
          <button
            onClick={() => setIsRecording(false)}
            className="p-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-t border-gray-200 ${className}`}>
      {/* Reply indicator */}
      {replyingTo && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Réponse à</p>
            <p className="text-sm text-gray-700 truncate">{replyingTo.text}</p>
          </div>
          <button
            onClick={clearReply}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <PaperClipIcon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4">
        <div className="flex items-end space-x-2">
          {/* Attachment menu */}
          <div className="relative">
            <button
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
            
            {showAttachmentMenu && (
              <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <PaperClipIcon className="w-4 h-4" />
                  <span>Document</span>
                </button>
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                    setShowAttachmentMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <CameraIcon className="w-4 h-4" />
                  <span>Photo/Vidéo</span>
                </button>
              </div>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          />

          {/* Text area */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={messageText}
              onChange={(e) => handleTyping(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-pm-gold focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          {/* Emoji button */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>

          {/* Voice record button */}
          {messageText.trim() === '' && attachments.length === 0 ? (
            <button
              onClick={() => setIsRecording(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          ) : (
            /* Send button */
            <button
              onClick={handleSend}
              disabled={disabled || (!messageText.trim() && attachments.length === 0)}
              className="p-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
