import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const isAuthenticated = () => {
    return sessionStorage.getItem('classroom_access') === 'granted';
  };

  const getUserRole = () => {
    return sessionStorage.getItem('classroom_role');
  };

  return {
    logout,
    isAuthenticated,
    getUserRole
  };
};