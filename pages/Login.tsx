import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin2025') {
      sessionStorage.setItem('classroom_access', 'granted');
      sessionStorage.setItem('classroom_role', 'admin');
      navigate('/admin');
    } else if (password === 'pmm2025' || password === 'mannequins2025') {
      sessionStorage.setItem('classroom_access', 'granted');
      sessionStorage.setItem('classroom_role', 'student');
      navigate('/formations');
    } else {
      setError('Mot de passe incorrect.');
      setPassword('');
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white flex items-center justify-center min-h-screen py-20">
      <div className="w-full max-w-md mx-auto px-6">
        <div className="bg-black p-8 md:p-12 border border-pm-gold/20 text-center">
          <LockClosedIcon className="w-16 h-16 text-pm-gold mx-auto mb-6" />
          <h1 className="text-4xl font-playfair text-pm-gold mb-4">Accès Privé</h1>
          <p className="text-pm-off-white/80 mb-8">
            Veuillez entrer le mot de passe pour accéder à votre espace (Classroom ou Admin).
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Mot de passe"
              className="w-full bg-pm-dark border border-pm-off-white/30 rounded-lg p-3 text-center focus:outline-none focus:border-pm-gold transition-colors"
              aria-label="Mot de passe"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white"
            >
              Entrer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;