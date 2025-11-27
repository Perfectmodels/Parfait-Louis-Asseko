import { WebSocketMessage, WebSocketTrigger } from './WebSocketManager';

export class WebSocketTriggers {
  // === TRIGGERS DE NOTIFICATIONS ===
  
  static onNewBooking: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { booking } = message.payload;
    console.log('[Trigger] New booking received:', booking);
    
    // Envoyer une notification push
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nouvelle réservation', {
        body: `${booking.clientName} a réservé ${booking.modelName}`,
        icon: '/favicon.ico',
        tag: 'booking'
      });
    }
    
    // Mettre à jour l'interface
    const event = new CustomEvent('newBooking', { detail: booking });
    window.dispatchEvent(event);
  };

  static onBookingUpdated: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { booking, status } = message.payload;
    console.log('[Trigger] Booking updated:', booking, 'Status:', status);
    
    // Notification de mise à jour
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Réservation mise à jour', {
        body: `Statut de la réservation ${booking.id}: ${status}`,
        icon: '/favicon.ico',
        tag: 'booking-update'
      });
    }
    
    // Événement custom
    const event = new CustomEvent('bookingUpdated', { detail: { booking, status } });
    window.dispatchEvent(event);
  };

  // === TRIGGERS DE CASTING ===
  
  static onNewCastingApplication: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { application } = message.payload;
    console.log('[Trigger] New casting application:', application);
    
    // Notification pour les admins
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Nouvelle candidature casting', {
        body: `${application.name} - ${application.category}`,
        icon: '/favicon.ico',
        tag: 'casting-application'
      });
    }
    
    // Événement pour mettre à jour l'admin dashboard
    const event = new CustomEvent('newCastingApplication', { detail: application });
    window.dispatchEvent(event);
  };

  static onCastingResult: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { applicationId, result, feedback } = message.payload;
    console.log('[Trigger] Casting result:', { applicationId, result });
    
    // Notification au candidat
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Résultat du casting', {
        body: `Votre candidature a été ${result === 'accepted' ? 'acceptée' : 'refusée'}`,
        icon: '/favicon.ico',
        tag: 'casting-result'
      });
    }
    
    // Événement pour mettre à jour l'interface
    const event = new CustomEvent('castingResult', { detail: { applicationId, result, feedback } });
    window.dispatchEvent(event);
  };

  // === TRIGGERS DE CHAT ===
  
  static onNewMessage: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { chatMessage, roomId } = message.payload;
    console.log('[Trigger] New chat message:', chatMessage);
    
    // Son de notification (optionnel)
    if (document.hasFocus() === false) {
      // Jouer un son si l'onglet n'est pas actif
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {}); // Ignorer les erreurs de lecture
    }
    
    // Notification push si le message n'est pas de l'utilisateur courant
    if (chatMessage.senderId !== message.userId) {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Nouveau message de ${chatMessage.senderName}`, {
          body: chatMessage.content,
          icon: '/favicon.ico',
          tag: 'chat-message'
        });
      }
    }
    
    // Événement pour mettre à jour le chat
    const event = new CustomEvent('newChatMessage', { detail: { chatMessage, roomId } });
    window.dispatchEvent(event);
  };

  static onTypingIndicator: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { userId, userName, roomId, isTyping } = message.payload;
    console.log('[Trigger] Typing indicator:', { userName, isTyping });
    
    // Événement pour afficher/masquer l'indicateur de frappe
    const event = new CustomEvent('typingIndicator', { detail: { userId, userName, roomId, isTyping } });
    window.dispatchEvent(event);
  };

  // === TRIGGERS D'ÉVÉNEMENTS ===
  
  static onEventReminder: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { event, reminderTime } = message.payload;
    console.log('[Trigger] Event reminder:', event);
    
    // Notification de rappel
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Rappel d\'événement', {
        body: `${event.title} - ${event.date}`,
        icon: '/favicon.ico',
        tag: 'event-reminder',
        requireInteraction: true
      });
    }
    
    // Événement pour mettre à jour le calendrier
    const eventCustom = new CustomEvent('eventReminder', { detail: { event, reminderTime } });
    window.dispatchEvent(eventCustom);
  };

  static onEventUpdate: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { event, changes } = message.payload;
    console.log('[Trigger] Event updated:', event, changes);
    
    // Notification de mise à jour
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Événement mis à jour', {
        body: `${event.title} - ${Object.keys(changes).join(', ')}`,
        icon: '/favicon.ico',
        tag: 'event-update'
      });
    }
    
    // Événement pour rafraîchir l'interface
    const eventCustom = new CustomEvent('eventUpdate', { detail: { event, changes } });
    window.dispatchEvent(eventCustom);
  };

  // === TRIGGERS DE SYSTÈME ===
  
  static onUserConnected: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { userId, userName, role } = message.payload;
    console.log('[Trigger] User connected:', { userName, role });
    
    // Mettre à jour la liste des utilisateurs en ligne
    const event = new CustomEvent('userConnected', { detail: { userId, userName, role } });
    window.dispatchEvent(event);
  };

  static onUserDisconnected: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { userId, userName } = message.payload;
    console.log('[Trigger] User disconnected:', userName);
    
    // Mettre à jour la liste des utilisateurs en ligne
    const event = new CustomEvent('userDisconnected', { detail: { userId, userName } });
    window.dispatchEvent(event);
  };

  static onSystemMaintenance: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { message: maintenanceMessage, startTime, endTime } = message.payload;
    console.log('[Trigger] System maintenance:', { maintenanceMessage, startTime, endTime });
    
    // Notification de maintenance
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Maintenance système', {
        body: maintenanceMessage,
        icon: '/favicon.ico',
        tag: 'maintenance',
        requireInteraction: true
      });
    }
    
    // Afficher une bannière dans l'interface
    const event = new CustomEvent('systemMaintenance', { detail: { maintenanceMessage, startTime, endTime } });
    window.dispatchEvent(event);
  };

  // === TRIGGERS DE COLLABORATION ===
  
  static onDocumentEdited: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { documentId, userId, userName, changes } = message.payload;
    console.log('[Trigger] Document edited:', { documentId, userName });
    
    // Événement pour la collaboration en temps réel
    const event = new CustomEvent('documentEdited', { detail: { documentId, userId, userName, changes } });
    window.dispatchEvent(event);
  };

  static onPresenceUpdate: WebSocketTrigger = async (message: WebSocketMessage) => {
    const { userId, presence } = message.payload;
    console.log('[Trigger] Presence update:', { userId, presence });
    
    // Mettre à jour le statut de présence
    const event = new CustomEvent('presenceUpdate', { detail: { userId, presence } });
    window.dispatchEvent(event);
  };

  // === TRIGGERS PERSONNALISÉS ===
  
  static createCustomTrigger(eventType: string, handler: (message: WebSocketMessage) => void): WebSocketTrigger {
    return async (message: WebSocketMessage) => {
      console.log(`[Custom Trigger] ${eventType}:`, message.payload);
      handler(message);
    };
  }

  // === ENREGISTREMENT AUTOMATIQUE DES TRIGGERS ===
  
  static registerAllTriggers(wsManager: any): void {
    // Notifications
    wsManager.registerTrigger('new_booking', WebSocketTriggers.onNewBooking);
    wsManager.registerTrigger('booking_updated', WebSocketTriggers.onBookingUpdated);
    
    // Casting
    wsManager.registerTrigger('new_casting_application', WebSocketTriggers.onNewCastingApplication);
    wsManager.registerTrigger('casting_result', WebSocketTriggers.onCastingResult);
    
    // Chat
    wsManager.registerTrigger('new_message', WebSocketTriggers.onNewMessage);
    wsManager.registerTrigger('typing_indicator', WebSocketTriggers.onTypingIndicator);
    
    // Événements
    wsManager.registerTrigger('event_reminder', WebSocketTriggers.onEventReminder);
    wsManager.registerTrigger('event_update', WebSocketTriggers.onEventUpdate);
    
    // Système
    wsManager.registerTrigger('user_connected', WebSocketTriggers.onUserConnected);
    wsManager.registerTrigger('user_disconnected', WebSocketTriggers.onUserDisconnected);
    wsManager.registerTrigger('system_maintenance', WebSocketTriggers.onSystemMaintenance);
    
    // Collaboration
    wsManager.registerTrigger('document_edited', WebSocketTriggers.onDocumentEdited);
    wsManager.registerTrigger('presence_update', WebSocketTriggers.onPresenceUpdate);
  }
}

export default WebSocketTriggers;
