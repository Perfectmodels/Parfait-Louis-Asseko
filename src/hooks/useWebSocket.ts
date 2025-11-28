import { useState, useEffect, useRef, useCallback } from 'react';
import WebSocketManager, { WebSocketMessage, WebSocketConfig } from '../services/websocket/WebSocketManager';
import WebSocketFunctions from '../services/websocket/WebSocketFunctions';
import WebSocketTriggers from '../services/websocket/WebSocketTriggers';

export interface UseWebSocketOptions extends Partial<WebSocketConfig> {
  autoConnect?: boolean;
  autoReconnect?: boolean;
  debugMode?: boolean;
}

export interface UseWebSocketReturn {
  wsManager: WebSocketManager | null;
  functions: WebSocketFunctions | null;
  isConnected: boolean;
  connectionState: string;
  lastMessage: WebSocketMessage | null;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  send: (message: Omit<WebSocketMessage, 'timestamp' | 'id'>) => void;
  joinRoom: (roomId: string, userId?: string) => void;
  leaveRoom: (roomId: string, userId?: string) => void;
  sendToRoom: (roomId: string, message: any, userId?: string) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): UseWebSocketReturn => {
  // Désactiver WebSocket par défaut
  const {
    url = 'ws://localhost:8080',
    autoConnect = false, // Désactivé par défaut
    debugMode = false,
    ...wsConfig
  } = options;

  const [wsManager, setWsManager] = useState<WebSocketManager | null>(null);
  const [functions, setFunctions] = useState<WebSocketFunctions | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const wsManagerRef = useRef<WebSocketManager | null>(null);
  const functionsRef = useRef<WebSocketFunctions | null>(null);

  // Initialisation du WebSocket Manager
  useEffect(() => {
    // Ne pas initialiser le WebSocket si autoConnect est false
    if (!autoConnect) {
      console.log('[WebSocket] WebSocket désactivé (autoConnect=false)');
      return;
    }
    
    console.log('[WebSocket] Initialisation du WebSocket...');
    const manager = new WebSocketManager({
      url,
      ...wsConfig
    });

    wsManagerRef.current = manager;
    setWsManager(manager);

    // Créer les fonctions
    const funcs = new WebSocketFunctions(manager);
    functionsRef.current = funcs;
    setFunctions(funcs);

    // Enregistrer les triggers
    WebSocketTriggers.registerAllTriggers(manager);

    // Configurer les écouteurs d'événements
    const handleConnected = () => {
      setIsConnected(true);
      setConnectionState('connected');
      setError(null);
      if (debugMode) console.log('[WebSocket] Connected');
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      setConnectionState('disconnected');
      if (debugMode) console.log('[WebSocket] Disconnected');
    };

    const handleError = (err: Error) => {
      setError(err);
      if (debugMode) console.error('[WebSocket] Error:', err);
    };

    const handleMessage = (message: WebSocketMessage) => {
      setLastMessage(message);
      if (debugMode) console.log('[WebSocket] Message received:', message);
    };

    manager.on('connected', handleConnected);
    manager.on('disconnected', handleDisconnected);
    manager.on('error', handleError);
    manager.on('message', handleMessage);

    // Connexion automatique
    if (autoConnect) {
      manager.connect().catch(err => {
        setError(err);
        if (debugMode) console.error('[WebSocket] Auto-connect failed:', err);
      });
    }

    // Nettoyage
    return () => {
      manager.off('connected', handleConnected);
      manager.off('disconnected', handleDisconnected);
      manager.off('error', handleError);
      manager.off('message', handleMessage);
      manager.destroy();
    };
  }, [url, autoConnect, debugMode, wsConfig]);

  // Fonctions de connexion/déconnexion
  const connect = useCallback(async () => {
    if (wsManagerRef.current) {
      try {
        await wsManagerRef.current.connect();
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsManagerRef.current) {
      wsManagerRef.current.disconnect();
    }
  }, []);

  // Fonctions d'envoi de messages
  const send = useCallback((message: Omit<WebSocketMessage, 'timestamp' | 'id'>) => {
    if (wsManagerRef.current) {
      wsManagerRef.current.send(message);
    }
  }, []);

  const joinRoom = useCallback((roomId: string, userId?: string) => {
    if (wsManagerRef.current) {
      wsManagerRef.current.joinRoom(roomId, userId);
    }
  }, []);

  const leaveRoom = useCallback((roomId: string, userId?: string) => {
    if (wsManagerRef.current) {
      wsManagerRef.current.leaveRoom(roomId, userId);
    }
  }, []);

  const sendToRoom = useCallback((roomId: string, message: any, userId?: string) => {
    if (wsManagerRef.current) {
      wsManagerRef.current.sendToRoom(roomId, message, userId);
    }
  }, []);

  return {
    wsManager,
    functions,
    isConnected,
    connectionState,
    lastMessage,
    error,
    connect,
    disconnect,
    send,
    joinRoom,
    leaveRoom,
    sendToRoom
  };
};

// Hook spécialisé pour le chat
export const useWebSocketChat = (roomId: string, userInfo: { id: string; name: string; role: string }) => {
  const { functions, isConnected, send, joinRoom, leaveRoom, lastMessage } = useWebSocket({
    autoConnect: true
  });

  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isConnected && functions) {
      // Rejoindre la salle de chat
      joinRoom(roomId, userInfo.id);

      // Écouter les nouveaux messages
      const handleNewMessage = (event: CustomEvent) => {
        const { chatMessage } = event.detail;
        setMessages(prev => [...prev, chatMessage]);
      };

      const handleTypingIndicator = (event: CustomEvent) => {
        const { userId, isTyping: typing } = event.detail;
        setIsTyping(prev => ({ ...prev, [userId]: typing }));
      };

      window.addEventListener('newChatMessage', handleNewMessage as EventListener);
      window.addEventListener('typingIndicator', handleTypingIndicator as EventListener);

      return () => {
        window.removeEventListener('newChatMessage', handleNewMessage as EventListener);
        window.removeEventListener('typingIndicator', handleTypingIndicator as EventListener);
        leaveRoom(roomId, userInfo.id);
      };
    }
  }, [isConnected, functions, roomId, userInfo.id, joinRoom, leaveRoom]);

  const sendMessage = useCallback((content: string) => {
    if (functions) {
      functions.sendChatMessage(roomId, content, userInfo);
    }
  }, [functions, roomId, userInfo]);

  const sendTypingIndicator = useCallback((typing: boolean) => {
    if (functions) {
      functions.sendTypingIndicator(roomId, typing, userInfo);
    }
  }, [functions, roomId, userInfo]);

  return {
    messages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    isConnected
  };
};

// Hook spécialisé pour les notifications
export const useWebSocketNotifications = (userId: string) => {
  const { functions, isConnected, send } = useWebSocket({
    autoConnect: true
  });

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      // Écouter les notifications
      const handleNotification = (event: CustomEvent) => {
        const notification = event.detail;
        setNotifications(prev => [notification, ...prev]);
      };

      window.addEventListener('userNotification', handleNotification as EventListener);

      return () => {
        window.removeEventListener('userNotification', handleNotification as EventListener);
      };
    }
  }, [isConnected]);

  const sendNotification = useCallback((notification: {
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
  }) => {
    if (functions) {
      functions.sendNotificationToUser(userId, notification);
    }
  }, [functions, userId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    sendNotification,
    clearNotifications,
    isConnected
  };
};

// Hook spécialisé pour les bookings
export const useWebSocketBookings = (userRole: 'model' | 'client' | 'admin') => {
  const { functions, isConnected } = useWebSocket({
    autoConnect: true
  });

  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected) {
      // Écouter les événements de booking
      const handleNewBooking = (event: CustomEvent) => {
        const booking = event.detail;
        setBookings(prev => [...prev, booking]);
      };

      const handleBookingUpdated = (event: CustomEvent) => {
        const { booking, status } = event.detail;
        setBookings(prev => prev.map(b => 
          b.id === booking.id ? { ...b, status } : b
        ));
      };

      window.addEventListener('newBooking', handleNewBooking as EventListener);
      window.addEventListener('bookingUpdated', handleBookingUpdated as EventListener);

      return () => {
        window.removeEventListener('newBooking', handleNewBooking as EventListener);
        window.removeEventListener('bookingUpdated', handleBookingUpdated as EventListener);
      };
    }
  }, [isConnected]);

  const createBooking = useCallback((bookingData: any) => {
    if (functions && userRole === 'client') {
      return functions.sendBookingRequest(bookingData);
    }
  }, [functions, userRole]);

  const updateBookingStatus = useCallback((bookingId: string, status: string) => {
    if (functions && (userRole === 'model' || userRole === 'admin')) {
      return functions.updateBookingStatus(bookingId, status as any);
    }
  }, [functions, userRole]);

  return {
    bookings,
    createBooking,
    updateBookingStatus,
    isConnected
  };
};

export default useWebSocket;
