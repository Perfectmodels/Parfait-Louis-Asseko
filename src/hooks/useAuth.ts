import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionService } from '../services/sessionService';

export interface AuthUser {
  email: string;
  name: string;
  role: string;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fonction pour vérifier l'authentification
  const checkAuth = useCallback(() => {
    try {
      // Essayer de restaurer la session depuis localStorage
      const sessionRestored = sessionService.restoreSession();
      
      if (sessionRestored) {
        const role = sessionStorage.getItem('classroom_role');
        const email = sessionStorage.getItem('user_email');
        const name = sessionStorage.getItem('user_name');

        setUser({
          email: email || '',
          name: name || '',
          role: role || 'student',
          isAuthenticated: true
        });
        return true;
      }

      // Vérifier sessionStorage (pour compatibilité)
      const role = sessionStorage.getItem('classroom_role');
      const access = sessionStorage.getItem('classroom_access') === 'granted';
      const email = sessionStorage.getItem('user_email');
      const name = sessionStorage.getItem('user_name');

      if (access && email) {
        setUser({
          email,
          name: name || email,
          role: role || 'student',
          isAuthenticated: true
        });
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'authentification:', error);
      setUser(null);
      return false;
    }
  }, []);

  // Fonction de connexion
  const login = useCallback((userData: { 
    email: string; 
    name: string; 
    role: string; 
    id?: string;
    userType?: string;
  }) => {
    try {
      // Créer une session de 72h
      sessionService.createSession({
        id: userData.id || userData.email,
        name: userData.name,
        role: userData.role as 'admin' | 'model' | 'beginner',
        email: userData.email,
        userType: userData.userType
      });

      setUser({
        ...userData,
        isAuthenticated: true
      });

      console.log('✅ Connexion réussie avec session 72h:', userData.email);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return false;
    }
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    try {
      // Nettoyer la session
      sessionService.clearSession();
      setUser(null);
      navigate('/login');
      
      console.log('✅ Déconnexion réussie');
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
      setUser(null);
      navigate('/login');
      return false;
    }
  }, [navigate]);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    setIsLoading(true);
    checkAuth();
    setIsLoading(false);
  }, []); // Supprimer checkAuth des dépendances

  // Écouter les changements de sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []); // Supprimer checkAuth des dépendances

  return {
    user,
    isLoading,
    isAuthenticated: user?.isAuthenticated || false,
    login,
    logout,
    checkAuth
  };
};
