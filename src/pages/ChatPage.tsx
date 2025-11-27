import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import Layout from '../components/icons/Layout';
import { ChatProvider } from '../contexts/ChatContext';
import ChatList from '../components/chat/ChatList';
import ChatInterface from '../components/chat/ChatInterface';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Layout>
      <SEO 
        title="Messages | Perfect Models Management"
        description="Messagerie interne pour communiquer avec les mannequins, clients et l'équipe"
        keywords="messages, chat, communication, messagerie"
      />
      
      <div className="h-screen flex flex-col lg:flex-row bg-gray-50">
        {/* Mobile: Full screen chat list when no active chat */}
        <div className="lg:hidden">
          <ChatList />
        </div>
        
        {/* Desktop: Side by side layout */}
        <div className="hidden lg:block">
          <ChatList />
        </div>
        
        {/* Chat Interface */}
        <ChatInterface />
      </div>
    </Layout>
  );
};

// Wrapper component with ChatProvider
const ChatPageWithProvider: React.FC = () => {
  return (
    <ChatProvider>
      <ChatPage />
    </ChatProvider>
  );
};

export default ChatPageWithProvider;
