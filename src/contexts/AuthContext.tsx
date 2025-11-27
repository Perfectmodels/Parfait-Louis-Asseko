import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'model' | 'client' | 'jury' | 'registration' | 'student';
  avatar?: string;
  lastLogin: number;
  permissions?: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  updateUser: (updates: Partial<User>) => void;
  sessionTimeLeft: number;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const SESSION_DURATION = 72 * 60 * 60 * 1000; // 72 heures en millisecondes
const SESSION_WARNING = 5 * 60 * 1000; // 5 minutes avant expiration
const SESSION_CHECK_INTERVAL = 60 * 1000; // Vérifier chaque minute

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(SESSION_DURATION);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Charger la session au démarrage
  useEffect(() => {
    const loadSession = () => {
      try {
        const storedUser = localStorage.getItem('perfect_models_user');
        const storedSessionStart = localStorage.getItem('perfect_models_session_start');
        
        if (storedUser && storedSessionStart) {
          const user = JSON.parse(storedUser);
          const sessionStart = parseInt(storedSessionStart);
          const now = Date.now();
          const elapsed = now - sessionStart;
          
          // Vérifier si la session est encore valide (72h)
          if (elapsed < SESSION_DURATION) {
            setUser(user);
            setSessionStartTime(sessionStart);
            setSessionTimeLeft(SESSION_DURATION - elapsed);
          } else {
            // Session expirée
            clearSession();
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la session:', error);
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  // Gérer le timer de session
  useEffect(() => {
    if (!user || !sessionStartTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - sessionStartTime;
      const timeLeft = SESSION_DURATION - elapsed;
      
      setSessionTimeLeft(timeLeft);

      // Alerter l'utilisateur 5 minutes avant expiration
      if (timeLeft <= SESSION_WARNING && timeLeft > 0) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Session expirante', {
            body: 'Votre session expire dans moins de 5 minutes. Prolongez votre session.',
            icon: '/favicon.ico',
            tag: 'session-warning'
          });
        }
      }

      // Déconnexion automatique
      if (timeLeft <= 0) {
        logout();
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [user, sessionStartTime]);

  const login = (userData: User) => {
    const now = Date.now();
    const userWithTimestamp = {
      ...userData,
      lastLogin: now
    };

    setUser(userWithTimestamp);
    setSessionStartTime(now);
    setSessionTimeLeft(SESSION_DURATION);

    // Sauvegarder dans localStorage
    localStorage.setItem('perfect_models_user', JSON.stringify(userWithTimestamp));
    localStorage.setItem('perfect_models_session_start', now.toString());

    // Notification de bienvenue
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Connexion réussie', {
        body: `Bienvenue ${userData.name}! Votre session est active pour 72 heures.`,
        icon: '/favicon.ico',
        tag: 'login-success'
      });
    }
  };

  const logout = () => {
    clearSession();
    
    // Notification de déconnexion
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Déconnexion', {
        body: 'Vous avez été déconnecté avec succès.',
        icon: '/favicon.ico',
        tag: 'logout'
      });
    }
  };

  const clearSession = () => {
    setUser(null);
    setSessionStartTime(0);
    setSessionTimeLeft(0);
    localStorage.removeItem('perfect_models_user');
    localStorage.removeItem('perfect_models_session_start');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('perfect_models_user', JSON.stringify(updatedUser));
  };

  const extendSession = () => {
    const now = Date.now();
    setSessionStartTime(now);
    setSessionTimeLeft(SESSION_DURATION);
    localStorage.setItem('perfect_models_session_start', now.toString());

    if (user) {
      updateUser({ lastLogin: now });
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    updateUser,
    sessionTimeLeft,
    extendSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
