import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const login = useCallback((userData: { email: string; name: string; role: string }) => {
    try {
      sessionStorage.setItem('classroom_access', 'granted');
      sessionStorage.setItem('user_email', userData.email);
      sessionStorage.setItem('user_name', userData.name);
      sessionStorage.setItem('classroom_role', userData.role);

      setUser({
        ...userData,
        isAuthenticated: true
      });

      console.log('✅ Connexion réussie:', userData.email);
      return true;
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      return false;
    }
  }, []);

  // Fonction de déconnexion
  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem('classroom_role');
      sessionStorage.removeItem('classroom_access');
      sessionStorage.removeItem('user_email');
      sessionStorage.removeItem('user_name');

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
  }, [checkAuth]);

  // Écouter les changements de sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  return {
    user,
    isLoading,
    isAuthenticated: user?.isAuthenticated || false,
    login,
    logout,
    checkAuth
  };
};
