import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useWebSocket, UseWebSocketReturn } from '../hooks/useWebSocket';

interface WebSocketContextType extends UseWebSocketReturn {
  // État global du WebSocket
  globalRooms: string[];
  setGlobalRooms: (rooms: string[]) => void;
  
  // Utilisateurs en ligne
  onlineUsers: Array<{
    id: string;
    name: string;
    role: string;
    status: 'online' | 'away' | 'busy';
    lastSeen: number;
  }>;
  setOnlineUsers: (users: any[]) => void;
  
  // Notifications non lues
  unreadNotifications: number;
  setUnreadNotifications: (count: number) => void;
  
  // Messages non lus
  unreadMessages: { [roomId: string]: number };
  setUnreadMessages: (messages: { [roomId: string]: number }) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
  wsUrl?: string;
  autoConnect?: boolean;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  wsUrl = 'ws://localhost:8080',
  autoConnect = true
}) => {
  const wsHook = useWebSocket({
    url: wsUrl,
    autoConnect,
    debugMode: process.env.NODE_ENV === 'development'
  });

  const [globalRooms, setGlobalRooms] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState<{ [roomId: string]: number }>({});

  // Écouter les événements WebSocket pour mettre à jour l'état global
  useEffect(() => {
    // Utilisateurs connectés/déconnectés
    const handleUserConnected = (event: CustomEvent) => {
      const user = event.detail;
      setOnlineUsers(prev => {
        const existing = prev.find(u => u.id === user.id);
        if (existing) {
          return prev.map(u => u.id === user.id ? { ...u, ...user, status: 'online' } : u);
        }
        return [...prev, { ...user, status: 'online', lastSeen: Date.now() }];
      });
    };

    const handleUserDisconnected = (event: CustomEvent) => {
      const { userId } = event.detail;
      setOnlineUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, status: 'offline', lastSeen: Date.now() } : u
      ));
    };

    const handlePresenceUpdate = (event: CustomEvent) => {
      const { userId, presence } = event.detail;
      setOnlineUsers(prev => prev.map(u => 
        u.id === userId ? { ...u, ...presence } : u
      ));
    };

    // Notifications
    const handleUserNotification = (event: CustomEvent) => {
      setUnreadNotifications(prev => prev + 1);
    };

    // Messages de chat
    const handleNewChatMessage = (event: CustomEvent) => {
      const { roomId } = event.detail;
      setUnreadMessages(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || 0) + 1
      }));
    };

    // Nettoyage des messages lus
    const handleRoomJoined = (_event: CustomEvent) => {
      // const { roomId } = event.detail;
      setUnreadMessages(prev => ({
        ...prev,
        // [roomId]: 0
      }));
    };

    // S'abonner aux événements
    window.addEventListener('userConnected', handleUserConnected as EventListener);
    window.addEventListener('userDisconnected', handleUserDisconnected as EventListener);
    window.addEventListener('presenceUpdate', handlePresenceUpdate as EventListener);
    window.addEventListener('userNotification', handleUserNotification as EventListener);
    window.addEventListener('newChatMessage', handleNewChatMessage as EventListener);
    window.addEventListener('roomJoined', handleRoomJoined as EventListener);

    return () => {
      window.removeEventListener('userConnected', handleUserConnected as EventListener);
      window.removeEventListener('userDisconnected', handleUserDisconnected as EventListener);
      window.removeEventListener('presenceUpdate', handlePresenceUpdate as EventListener);
      window.removeEventListener('userNotification', handleUserNotification as EventListener);
      window.removeEventListener('newChatMessage', handleNewChatMessage as EventListener);
      window.removeEventListener('roomJoined', handleRoomJoined as EventListener);
    };
  }, []);

  // Gestion des salles globales - fonctions utilitaires pour usage futur
  // const joinGlobalRoom = (roomId: string) => {
  //   if (!globalRooms.includes(roomId)) {
  //     setGlobalRooms(prev => [...prev, roomId]);
  //     wsHook.joinRoom(roomId);
  //   }
  // };

  // const leaveGlobalRoom = (roomId: string) => {
  //   setGlobalRooms(prev => prev.filter(room => room !== roomId));
  //   wsHook.leaveRoom(roomId);
  // };

  // Réinitialiser les notifications
  // const clearNotifications = () => {
  //   setUnreadNotifications(0);
  // };

  // const clearRoomMessages = (roomId: string) => {
  //   setUnreadMessages(prev => ({
  //     ...prev,
  //     [roomId]: 0
  //   }));
  // };

  const contextValue: WebSocketContextType = {
    ...wsHook,
    globalRooms,
    setGlobalRooms,
    onlineUsers,
    setOnlineUsers,
    unreadNotifications,
    setUnreadNotifications,
    unreadMessages,
    setUnreadMessages
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketContext;
