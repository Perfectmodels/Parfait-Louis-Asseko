import WebSocketManager from './WebSocketManager';

export class WebSocketFunctions {
  private wsManager: WebSocketManager;

  constructor(wsManager: WebSocketManager) {
    this.wsManager = wsManager;
  }

  // === FONCTIONS DE BOOKING ===
  
  async sendBookingRequest(bookingData: {
    modelId: string;
    clientId: string;
    date: string;
    duration: number;
    location: string;
    description: string;
    budget: number;
  }): Promise<void> {
    this.wsManager.send({
      type: 'booking_request',
      payload: bookingData,
      roomId: `model_${bookingData.modelId}`
    });
  }

  async updateBookingStatus(bookingId: string, status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): Promise<void> {
    this.wsManager.send({
      type: 'update_booking_status',
      payload: { bookingId, status },
      roomId: 'admin_bookings'
    });
  }

  async sendBookingMessage(bookingId: string, message: string, senderRole: 'model' | 'client' | 'admin'): Promise<void> {
    this.wsManager.send({
      type: 'booking_message',
      payload: { bookingId, message, senderRole, timestamp: Date.now() },
      roomId: `booking_${bookingId}`
    });
  }

  // === FONCTIONS DE CASTING ===
  
  async submitCastingApplication(applicationData: {
    name: string;
    email: string;
    phone: string;
    age: number;
    height: string;
    category: string;
    experience: string;
    portfolio: string[];
  }): Promise<void> {
    this.wsManager.send({
      type: 'casting_application',
      payload: applicationData,
      roomId: 'castings'
    });
  }

  async updateCastingStatus(applicationId: string, status: 'pending' | 'accepted' | 'rejected', feedback?: string): Promise<void> {
    this.wsManager.send({
      type: 'update_casting_status',
      payload: { applicationId, status, feedback },
      roomId: 'castings'
    });
  }

  async scheduleCastingInterview(applicationId: string, dateTime: string, location: string): Promise<void> {
    this.wsManager.send({
      type: 'schedule_interview',
      payload: { applicationId, dateTime, location },
      roomId: `casting_${applicationId}`
    });
  }

  // === FONCTIONS DE CHAT ===
  
  async sendChatMessage(roomId: string, content: string, senderInfo: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }): Promise<void> {
    this.wsManager.send({
      type: 'chat_message',
      payload: {
        content,
        sender: senderInfo,
        timestamp: Date.now()
      },
      roomId
    });
  }

  async sendTypingIndicator(roomId: string, isTyping: boolean, userInfo: {
    id: string;
    name: string;
  }): Promise<void> {
    this.wsManager.send({
      type: 'typing_indicator',
      payload: {
        userId: userInfo.id,
        userName: userInfo.name,
        isTyping
      },
      roomId
    });
  }

  async joinChatRoom(roomId: string, userInfo: {
    id: string;
    name: string;
    role: string;
  }): Promise<void> {
    this.wsManager.joinRoom(roomId, userInfo.id);
    
    // Annoncer l'arrivée
    this.wsManager.send({
      type: 'user_joined',
      payload: userInfo,
      roomId
    });
  }

  async leaveChatRoom(roomId: string, userInfo: {
    id: string;
    name: string;
  }): Promise<void> {
    // Annoncer le départ
    this.wsManager.send({
      type: 'user_left',
      payload: userInfo,
      roomId
    });
    
    this.wsManager.leaveRoom(roomId, userInfo.id);
  }

  // === FONCTIONS D'ÉVÉNEMENTS ===
  
  async createEvent(eventData: {
    title: string;
    description: string;
    date: string;
    location: string;
    type: 'fashion_day' | 'casting' | 'meeting' | 'training';
    participants: string[];
  }): Promise<void> {
    this.wsManager.send({
      type: 'create_event',
      payload: eventData,
      roomId: 'events'
    });
  }

  async updateEvent(eventId: string, updates: Partial<{
    title: string;
    description: string;
    date: string;
    location: string;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  }>): Promise<void> {
    this.wsManager.send({
      type: 'update_event',
      payload: { eventId, updates },
      roomId: 'events'
    });
  }

  async rsvpEvent(eventId: string, userId: string, status: 'attending' | 'not_attending' | 'maybe'): Promise<void> {
    this.wsManager.send({
      type: 'event_rsvp',
      payload: { eventId, userId, status },
      roomId: `event_${eventId}`
    });
  }

  async setEventReminder(eventId: string, userId: string, reminderTime: number): Promise<void> {
    this.wsManager.send({
      type: 'set_reminder',
      payload: { eventId, userId, reminderTime },
      roomId: 'reminders'
    });
  }

  // === FONCTIONS DE COLLABORATION ===
  
  async startEditingDocument(documentId: string, userId: string, userInfo: {
    name: string;
    role: string;
  }): Promise<void> {
    this.wsManager.send({
      type: 'start_editing',
      payload: { userId, userInfo },
      roomId: `document_${documentId}`
    });
  }

  async sendDocumentChanges(documentId: string, userId: string, changes: {
    operation: 'insert' | 'delete' | 'replace';
    position: number;
    content: string;
    length?: number;
  }): Promise<void> {
    this.wsManager.send({
      type: 'document_changes',
      payload: { userId, changes },
      roomId: `document_${documentId}`
    });
  }

  async stopEditingDocument(documentId: string, userId: string): Promise<void> {
    this.wsManager.send({
      type: 'stop_editing',
      payload: { userId },
      roomId: `document_${documentId}`
    });
  }

  // === FONCTIONS DE PRÉSENCE ===
  
  async updatePresence(userId: string, presence: {
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen: number;
    currentRoom?: string;
    activity?: string;
  }): Promise<void> {
    this.wsManager.send({
      type: 'presence_update',
      payload: { userId, presence },
      roomId: 'presence'
    });
  }

  async broadcastUserStatus(status: {
    emoji: string;
    message: string;
    duration?: number;
  }): Promise<void> {
    this.wsManager.send({
      type: 'user_status',
      payload: status,
      roomId: 'general'
    });
  }

  // === FONCTIONS DE NOTIFICATIONS ===
  
  async sendNotificationToUser(userId: string, notification: {
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'error';
    data?: any;
    actions?: Array<{
      action: string;
      title: string;
    }>;
  }): Promise<void> {
    this.wsManager.send({
      type: 'user_notification',
      payload: notification,
      userId
    });
  }

  async broadcastNotification(notification: {
    title: string;
    body: string;
    type: 'info' | 'success' | 'warning' | 'error';
    targetRoles?: string[];
    data?: any;
  }): Promise<void> {
    this.wsManager.send({
      type: 'broadcast_notification',
      payload: notification,
      roomId: 'broadcast'
    });
  }

  // === FONCTIONS DE SYSTÈME ===
  
  async requestSystemInfo(): Promise<void> {
    this.wsManager.send({
      type: 'system_info_request',
      payload: {}
    });
  }

  async reportError(error: {
    message: string;
    stack?: string;
    component?: string;
    userId?: string;
    timestamp: number;
  }): Promise<void> {
    this.wsManager.send({
      type: 'error_report',
      payload: error,
      roomId: 'system_logs'
    });
  }

  async sendUserActivity(activity: {
    type: 'page_view' | 'click' | 'form_submit' | 'download';
    page: string;
    details?: any;
    timestamp: number;
  }): Promise<void> {
    this.wsManager.send({
      type: 'user_activity',
      payload: activity,
      roomId: 'analytics'
    });
  }

  // === FONCTIONS DE SÉCURITÉ ===
  
  async authenticateUser(credentials: {
    token: string;
    userId: string;
    timestamp: number;
  }): Promise<void> {
    this.wsManager.send({
      type: 'authenticate',
      payload: credentials
    });
  }

  async logoutUser(userId: string): Promise<void> {
    this.wsManager.send({
      type: 'logout',
      payload: { userId }
    });
  }

  async refreshAuthToken(): Promise<void> {
    this.wsManager.send({
      type: 'refresh_token',
      payload: {}
    });
  }

  // === FONCTIONS UTILITAIRES ===
  
  async ping(): Promise<void> {
    this.wsManager.send({
      type: 'ping',
      payload: { timestamp: Date.now() }
    });
  }

  async requestConnectionStatus(): Promise<void> {
    this.wsManager.send({
      type: 'connection_status_request',
      payload: {}
    });
  }

  async subscribeToEvents(eventTypes: string[]): Promise<void> {
    this.wsManager.send({
      type: 'subscribe_events',
      payload: { eventTypes }
    });
  }

  async unsubscribeFromEvents(eventTypes: string[]): Promise<void> {
    this.wsManager.send({
      type: 'unsubscribe_events',
      payload: { eventTypes }
    });
  }

  // === FONCTIONS DE DÉBOGAGE ===
  
  async enableDebugMode(enabled: boolean): Promise<void> {
    this.wsManager.send({
      type: 'debug_mode',
      payload: { enabled }
    });
  }

  async getDebugInfo(): Promise<void> {
    this.wsManager.send({
      type: 'debug_info_request',
      payload: {}
    });
  }

  async simulateMessage(messageType: string, payload: any): Promise<void> {
    this.wsManager.send({
      type: 'simulate_message',
      payload: { messageType, payload }
    });
  }
}

export default WebSocketFunctions;
