

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { data } = useData();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin Login
    if (username.toLowerCase() === 'admin' && password === 'admin2025') {
      sessionStorage.setItem('classroom_access', 'granted');
      sessionStorage.setItem('classroom_role', 'admin');
      navigate('/admin');
      return;
    }

    // Generic Student Login
    if (username.toLowerCase() === 'etudiant' && password === 'mannequins2025') {
       sessionStorage.setItem('classroom_access', 'granted');
       sessionStorage.setItem('classroom_role', 'student');
       navigate('/formations');
       return;
    }

    // Model Login
    if (data?.models) {
        const loggedInModel = data.models.find(m => m.username.toLowerCase() === username.toLowerCase());
        if (loggedInModel && loggedInModel.password === password) {
            sessionStorage.setItem('classroom_access', 'granted');
            sessionStorage.setItem('classroom_role', 'model');
            sessionStorage.setItem('userId', loggedInModel.id);
            navigate('/profil');
            return;
        }
    }
    
    setError('Identifiant ou mot de passe incorrect.');
    setPassword('');
  };

  return (
    <div className="bg-pm-dark text-pm-off-white flex items-center justify-center min-h-screen py-20">
      <SEO title="Accès Privé" noIndex />
      <div className="w-full max-w-md mx-auto px-6">
        <div className="bg-black p-8 md:p-12 border border-pm-gold/20 text-center">
          <LockClosedIcon className="w-16 h-16 text-pm-gold mx-auto mb-6" />
          <h1 className="text-4xl font-playfair text-pm-gold mb-4">Accès Privé</h1>
          <p className="text-pm-off-white/80 mb-8">
            Veuillez entrer vos identifiants pour accéder à votre espace.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
                 <label htmlFor="username" className="sr-only">Identifiant</label>
                 <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-pm-off-white/50" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                      }}
                      placeholder="Identifiant"
                      className="w-full bg-pm-dark border border-pm-off-white/30 rounded-lg p-3 pl-10 text-center focus:outline-none focus:border-pm-gold transition-colors"
                      aria-label="Identifiant"
                      autoFocus
                      required
                    />
                 </div>
            </div>
            <div>
                 <label htmlFor="password-input" className="sr-only">Mot de passe</label>
                 <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                         <LockClosedIcon className="h-5 w-5 text-pm-off-white/50" />
                    </div>
                    <input
                      id="password-input"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Mot de passe"
                      className="w-full bg-pm-dark border border-pm-off-white/30 rounded-lg p-3 pl-10 text-center focus:outline-none focus:border-pm-gold transition-colors"
                      aria-label="Mot de passe"
                      required
                    />
                 </div>
            </div>

            {error && <p className="text-red-500 text-sm !mt-6">{error}</p>}
            <button
              type="submit"
              className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white !mt-8"
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