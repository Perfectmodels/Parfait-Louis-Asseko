// Service de gestion des sessions avec expiration de 72h
export class SessionService {
  private static instance: SessionService;
  private readonly SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 heures en millisecondes
  private readonly SESSION_KEY = 'pmm_session';
  private readonly SESSION_EXPIRY_KEY = 'pmm_session_expiry';

  private constructor() {}

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }
    return SessionService.instance;
  }

  // Créer une nouvelle session
  public createSession(userData: {
    id: string;
    name: string;
    role: 'admin' | 'model' | 'beginner';
    email: string;
    userType?: string;
  }): void {
    const sessionData = {
      ...userData,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    const expiryTime = new Date().getTime() + this.SESSION_DURATION;

    // Stocker dans sessionStorage (session du navigateur)
    sessionStorage.setItem('classroom_access', 'granted');
    sessionStorage.setItem('classroom_role', userData.role);
    sessionStorage.setItem('user_email', userData.email);
    sessionStorage.setItem('user_name', userData.name);
    sessionStorage.setItem('userId', userData.id);
    sessionStorage.setItem('userType', userData.userType || 'pro');

    // Stocker dans localStorage (persistant)
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
    localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());

    console.log('✅ Session créée pour 72h:', userData.name);
  }

  // Vérifier si la session est valide
  public isSessionValid(): boolean {
    try {
      const sessionData = this.getSessionData();
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);

      if (!sessionData || !expiryTime) {
        return false;
      }

      const now = new Date().getTime();
      const expiry = parseInt(expiryTime, 10);

      if (now > expiry) {
        console.log('❌ Session expirée');
        this.clearSession();
        return false;
      }

      // Mettre à jour la dernière activité
      this.updateLastActivity();
      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification de la session:', error);
      this.clearSession();
      return false;
    }
  }

  // Obtenir les données de session
  public getSessionData(): any | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Erreur lors de la lecture des données de session:', error);
      return null;
    }
  }

  // Mettre à jour la dernière activité
  public updateLastActivity(): void {
    try {
      const sessionData = this.getSessionData();
      if (sessionData) {
        sessionData.lastActivity = new Date().toISOString();
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'activité:', error);
    }
  }

  // Prolonger la session (remettre à 72h)
  public extendSession(): void {
    try {
      const sessionData = this.getSessionData();
      if (sessionData) {
        const expiryTime = new Date().getTime() + this.SESSION_DURATION;
        localStorage.setItem(this.SESSION_EXPIRY_KEY, expiryTime.toString());
        this.updateLastActivity();
        console.log('✅ Session prolongée de 72h');
      }
    } catch (error) {
      console.error('Erreur lors de la prolongation de la session:', error);
    }
  }

  // Obtenir le temps restant avant expiration
  public getTimeUntilExpiry(): number {
    try {
      const expiryTime = localStorage.getItem(this.SESSION_EXPIRY_KEY);
      if (!expiryTime) return 0;

      const now = new Date().getTime();
      const expiry = parseInt(expiryTime, 10);
      return Math.max(0, expiry - now);
    } catch (error) {
      console.error('Erreur lors du calcul du temps restant:', error);
      return 0;
    }
  }

  // Obtenir le temps restant formaté
  public getFormattedTimeUntilExpiry(): string {
    const timeLeft = this.getTimeUntilExpiry();
    
    if (timeLeft === 0) return 'Session expirée';

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}j ${remainingHours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  }

  // Vérifier si la session expire bientôt (dans les 2h)
  public isSessionExpiringSoon(): boolean {
    const timeLeft = this.getTimeUntilExpiry();
    const twoHours = 2 * 60 * 60 * 1000;
    return timeLeft > 0 && timeLeft < twoHours;
  }

  // Nettoyer la session
  public clearSession(): void {
    try {
      // Nettoyer sessionStorage
      sessionStorage.removeItem('classroom_access');
      sessionStorage.removeItem('classroom_role');
      sessionStorage.removeItem('user_email');
      sessionStorage.removeItem('user_name');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userType');

      // Nettoyer localStorage
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.SESSION_EXPIRY_KEY);

      console.log('✅ Session nettoyée');
    } catch (error) {
      console.error('Erreur lors du nettoyage de la session:', error);
    }
  }

  // Restaurer la session depuis localStorage
  public restoreSession(): boolean {
    try {
      if (!this.isSessionValid()) {
        return false;
      }

      const sessionData = this.getSessionData();
      if (!sessionData) {
        return false;
      }

      // Restaurer dans sessionStorage
      sessionStorage.setItem('classroom_access', 'granted');
      sessionStorage.setItem('classroom_role', sessionData.role);
      sessionStorage.setItem('user_email', sessionData.email);
      sessionStorage.setItem('user_name', sessionData.name);
      sessionStorage.setItem('userId', sessionData.id);
      sessionStorage.setItem('userType', sessionData.userType || 'pro');

      console.log('✅ Session restaurée:', sessionData.name);
      return true;
    } catch (error) {
      console.error('Erreur lors de la restauration de la session:', error);
      return false;
    }
  }

  // Obtenir les statistiques de session
  public getSessionStats(): {
    isValid: boolean;
    timeLeft: string;
    isExpiringSoon: boolean;
    userData: any | null;
  } {
    const isValid = this.isSessionValid();
    const timeLeft = this.getFormattedTimeUntilExpiry();
    const isExpiringSoon = this.isSessionExpiringSoon();
    const userData = this.getSessionData();

    return {
      isValid,
      timeLeft,
      isExpiringSoon,
      userData
    };
  }
}

// Instance singleton
export const sessionService = SessionService.getInstance();
