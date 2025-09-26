// Service de gestion des notifications push
export class NotificationService {
  private static instance: NotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Vérifier si les notifications sont supportées
  public isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Demander la permission pour les notifications
  public async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      throw new Error('Notifications non supportées par ce navigateur');
    }

    const permission = await Notification.requestPermission();
    console.log('Permission de notification:', permission);
    return permission;
  }

  // Enregistrer le Service Worker
  public async registerServiceWorker(): Promise<ServiceWorkerRegistration> {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker enregistré:', this.registration);
      return this.registration;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      throw error;
    }
  }

  // S'abonner aux notifications push
  public async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration) {
      throw new Error('Service Worker non enregistré');
    }

    try {
      // Vérifier si l'utilisateur est déjà abonné
      this.subscription = await this.registration.pushManager.getSubscription();
      
      if (this.subscription) {
        console.log('Utilisateur déjà abonné aux notifications');
        return this.subscription;
      }

      // Créer un nouvel abonnement
      const applicationServerKey = this.urlBase64ToUint8Array(
        'BEl62iUYgUivxIkv69yViEuiBIa40HI0pFfQ7UJZawXwXKZVs1McnodvmmE0imxVwjO6VJDHp0LtZHrIex9FU7A'
      );

      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      });

      console.log('Abonnement aux notifications créé:', this.subscription);
      
      // Envoyer l'abonnement au serveur
      await this.sendSubscriptionToServer(this.subscription);
      
      return this.subscription;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement aux notifications:', error);
      throw error;
    }
  }

  // Se désabonner des notifications push
  public async unsubscribeFromPush(): Promise<boolean> {
    if (!this.subscription) {
      return false;
    }

    try {
      const result = await this.subscription.unsubscribe();
      if (result) {
        this.subscription = null;
        console.log('Désabonnement réussi');
      }
      return result;
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      throw error;
    }
  }

  // Envoyer l'abonnement au serveur
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
          userId: sessionStorage.getItem('userId'),
          userRole: sessionStorage.getItem('classroom_role')
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'abonnement au serveur');
      }

      console.log('Abonnement envoyé au serveur avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'abonnement:', error);
      // Ne pas faire échouer l'abonnement si l'envoi au serveur échoue
    }
  }

  // Convertir la clé publique en Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Envoyer une notification locale
  public async sendLocalNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      throw new Error('Notifications non supportées');
    }

    const defaultOptions: NotificationOptions = {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      tag: 'pmm-notification',
      requireInteraction: true,
      ...options
    };

    if (this.registration) {
      await this.registration.showNotification(title, defaultOptions);
    } else {
      new Notification(title, defaultOptions);
    }
  }

  // Initialiser le service de notifications
  public async initialize(): Promise<boolean> {
    try {
      if (!this.isSupported()) {
        console.log('Notifications non supportées par ce navigateur');
        return false;
      }

      // Enregistrer le Service Worker
      await this.registerServiceWorker();

      // Demander la permission
      const permission = await this.requestPermission();
      
      if (permission === 'granted') {
        // S'abonner aux notifications push
        await this.subscribeToPush();
        return true;
      } else {
        console.log('Permission de notification refusée');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error);
      return false;
    }
  }

  // Vérifier si l'utilisateur est abonné
  public isSubscribed(): boolean {
    return this.subscription !== null;
  }

  // Obtenir l'état de l'abonnement
  public async getSubscriptionStatus(): Promise<{
    isSubscribed: boolean;
    permission: NotificationPermission;
    subscription: PushSubscription | null;
  }> {
    const permission = Notification.permission;
    const isSubscribed = this.isSubscribed();
    
    return {
      isSubscribed,
      permission,
      subscription: this.subscription
    };
  }
}

// Instance singleton
export const notificationService = NotificationService.getInstance();
