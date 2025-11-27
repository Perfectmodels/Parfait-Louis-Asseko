// Implémentation EventEmitter custom pour le navigateur
class EventEmitter {
  private events: Map<string, Array<(...args: any[]) => void>> = new Map();

  on(event: string, listener: (...args: any[]) => void): this {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(listener);
    return this;
  }

  off(event: string, listener: (...args: any[]) => void): this {
    const listeners = this.events.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    const listeners = this.events.get(event);
    if (listeners && listeners.length > 0) {
      listeners.forEach(listener => listener(...args));
      return true;
    }
    return false;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
}

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: number;
  id: string;
  userId?: string;
  roomId?: string;
}

export interface WebSocketConfig {
  url: string;
  protocols?: string[];
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
}

export type WebSocketTrigger = (message: WebSocketMessage) => void | Promise<void>;
export type WebSocketEventHandler = (event: Event) => void;

class WebSocketManager extends EventEmitter {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private isManualClose = false;
  private messageQueue: WebSocketMessage[] = [];
  private triggers: Map<string, WebSocketTrigger[]> = new Map();
  private eventHandlers: Map<string, WebSocketEventHandler[]> = new Map();

  constructor(config: WebSocketConfig) {
    super();
    this.config = {
      reconnectInterval: 3000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config
    };
  }

  // === CONNEXION ===
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
        resolve();
        return;
      }

      this.isConnecting = true;
      this.isManualClose = false;

      try {
        this.ws = new WebSocket(this.config.url, this.config.protocols);
        this.setupEventHandlers();
        
        this.ws.onopen = () => {
          console.log('[WebSocket] Connected to', this.config.url);
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.flushMessageQueue();
          this.emit('connected');
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Connection error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        console.error('[WebSocket] Failed to create connection:', error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.isManualClose = true;
    this.clearTimers();
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    this.emit('disconnected');
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onclose = (event) => {
      console.log('[WebSocket] Disconnected', event.code, event.reason);
      this.clearTimers();
      this.ws = null;
      this.emit('disconnected', event);

      if (!this.isManualClose && this.reconnectAttempts < this.config.maxReconnectAttempts!) {
        this.scheduleReconnect();
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(message);
        this.emit('message', message);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    };
  }

  // === RECONNEXION AUTOMATIQUE ===
  private scheduleReconnect(): void {
    this.reconnectTimer = setTimeout(() => {
      console.log(`[WebSocket] Reconnection attempt ${this.reconnectAttempts + 1}/${this.config.maxReconnectAttempts}`);
      this.reconnectAttempts++;
      this.connect().catch(() => {
        // La reconnexion échoue, le timer sera reschedulé automatiquement
      });
    }, this.config.reconnectInterval);
  }

  private clearTimers(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // === HEARTBEAT ===
  private startHeartbeat(): void {
    if (this.config.heartbeatInterval) {
      this.heartbeatTimer = setInterval(() => {
        this.sendHeartbeat();
      }, this.config.heartbeatInterval);
    }
  }

  private sendHeartbeat(): void {
    this.send({
      type: 'heartbeat',
      payload: { timestamp: Date.now() }
    });
  }

  // === ENVOI DE MESSAGES ===
  send(message: Omit<WebSocketMessage, 'timestamp' | 'id'>): void {
    const fullMessage: WebSocketMessage = {
      ...message,
      timestamp: Date.now(),
      id: this.generateMessageId()
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(fullMessage));
    } else {
      this.messageQueue.push(fullMessage);
      console.warn('[WebSocket] Message queued (not connected)');
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()!;
      this.ws.send(JSON.stringify(message));
    }
  }

  // === GESTION DES TRIGGERS ===
  registerTrigger(eventType: string, trigger: WebSocketTrigger): void {
    if (!this.triggers.has(eventType)) {
      this.triggers.set(eventType, []);
    }
    this.triggers.get(eventType)!.push(trigger);
  }

  unregisterTrigger(eventType: string, trigger: WebSocketTrigger): void {
    const triggers = this.triggers.get(eventType);
    if (triggers) {
      const index = triggers.indexOf(trigger);
      if (index > -1) {
        triggers.splice(index, 1);
      }
    }
  }

  private async executeTriggers(eventType: string, message: WebSocketMessage): Promise<void> {
    const triggers = this.triggers.get(eventType) || [];
    await Promise.all(triggers.map(trigger => {
      try {
        return trigger(message);
      } catch (error) {
        console.error(`[WebSocket] Trigger error for ${eventType}:`, error);
      }
    }));
  }

  // === GESTION DES ÉVÉNEMENTS ===
  on(event: string, listener: WebSocketEventHandler): this {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(listener);
    return super.on(event, listener);
  }

  off(event: string, listener: WebSocketEventHandler): this {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(listener);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
    return super.off(event, listener);
  }

  // === TRAITEMENT DES MESSAGES ===
  private async handleMessage(message: WebSocketMessage): Promise<void> {
    console.log('[WebSocket] Received message:', message.type, message.payload);

    // Exécuter les triggers enregistrés
    await this.executeTriggers(message.type, message);

    // Gérer les messages système
    switch (message.type) {
      case 'heartbeat':
        this.handleHeartbeatResponse(message);
        break;
      case 'error':
        this.handleErrorMessage(message);
        break;
      case 'room_joined':
      case 'room_left':
        this.handleRoomEvent(message);
        break;
    }
  }

  private handleHeartbeatResponse(message: WebSocketMessage): void {
    // Réponse au heartbeat du serveur
    console.log('[WebSocket] Heartbeat response received');
  }

  private handleErrorMessage(message: WebSocketMessage): void {
    console.error('[WebSocket] Server error:', message.payload);
    this.emit('serverError', message.payload);
  }

  private handleRoomEvent(message: WebSocketMessage): void {
    console.log(`[WebSocket] Room event: ${message.type}`, message.payload);
    this.emit('roomEvent', message);
  }

  // === UTILITAIRES ===
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): string {
    if (!this.ws) return 'disconnected';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'connecting';
      case WebSocket.OPEN: return 'connected';
      case WebSocket.CLOSING: return 'closing';
      case WebSocket.CLOSED: return 'closed';
      default: return 'unknown';
    }
  }

  // === FONCTIONS DE SALLES (ROOMS) ===
  joinRoom(roomId: string, userId?: string): void {
    this.send({
      type: 'join_room',
      payload: { roomId, userId },
      userId,
      roomId
    });
  }

  leaveRoom(roomId: string, userId?: string): void {
    this.send({
      type: 'leave_room',
      payload: { roomId, userId },
      userId,
      roomId
    });
  }

  sendToRoom(roomId: string, message: any, userId?: string): void {
    this.send({
      type: 'room_message',
      payload: { roomId, message },
      userId,
      roomId
    });
  }

  // === FONCTIONS DE NOTIFICATION ===
  sendNotification(userId: string, notification: {
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
  }): void {
    this.send({
      type: 'notification',
      payload: notification,
      userId
    });
  }

  broadcastNotification(notification: {
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
  }): void {
    this.send({
      type: 'broadcast_notification',
      payload: notification
    });
  }

  // === NETTOYAGE ===
  destroy(): void {
    this.disconnect();
    this.triggers.clear();
    this.eventHandlers.clear();
    this.messageQueue.length = 0;
    this.removeAllListeners();
  }
}

export default WebSocketManager;
