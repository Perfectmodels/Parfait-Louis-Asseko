import React, { useState } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { LockClosedIcon, UserIcon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
// FIX: Corrected import path for types.
import { RecoveryRequest } from '../types';

// Interface for storing active user data in localStorage
interface ActiveUser {
  name: string;
  role: string;
  loginTime: number;
}

const updateUserActivity = (name: string, role: string) => {
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    
    // Read current activity
    const currentActivityJSON = localStorage.getItem('pmm_active_users');
    let activeUsers: ActiveUser[] = currentActivityJSON ? JSON.parse(currentActivityJSON) : [];
    
    // Remove old entry for the same user
    activeUsers = activeUsers.filter(user => user.name !== name);
    
    // Add new entry for the current user
    activeUsers.push({ name, role, loginTime: now });
    
    // Filter out users who have been inactive for more than 15 minutes
    activeUsers = activeUsers.filter(user => (now - user.loginTime) < fifteenMinutes);
    
    // Save back to localStorage
    localStorage.setItem('pmm_active_users', JSON.stringify(activeUsers));
};


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  // FIX: Use useNavigate for react-router-dom v6 compatibility.
  const navigate = ReactRouterDOM.useNavigate();
  const { data, isInitialized, saveData } = useData();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isInitialized || !data) {
        setError('Le service est en cours de démarrage. Veuillez patienter...');
        return;
    }

    const timestamp = new Date().toISOString();

    // Admin Login
    if (username.toLowerCase() === 'admin' && password === 'admin2025') {
      sessionStorage.setItem('classroom_access', 'granted');
      sessionStorage.setItem('classroom_role', 'admin');
      updateUserActivity('Administrateur', 'admin');
      navigate('/admin');
      return;
    }

    // Model Login
    const loggedInModel = data.models.find(m => 
        m.username.toLowerCase() === username.toLowerCase() || 
        m.name.toLowerCase() === username.toLowerCase()
    );
    if (loggedInModel && loggedInModel.password === password) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', 'student');
        sessionStorage.setItem('userId', loggedInModel.id);
        
        const updatedModels = data.models.map(m => m.id === loggedInModel.id ? { ...m, lastLogin: timestamp } : m);
        await saveData({ ...data, models: updatedModels });
        updateUserActivity(loggedInModel.name, 'student');
        
        navigate('/profil');
        return;
    }
    
    // Beginner Student Login
    const loggedInBeginner = data.beginnerStudents.find(bs => 
        bs.matricule.toLowerCase() === username.toLowerCase()
    );
    if (loggedInBeginner && loggedInBeginner.password === password) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', 'beginner');
        sessionStorage.setItem('userId', loggedInBeginner.id);
        sessionStorage.setItem('userName', loggedInBeginner.name);
        
        const updatedBeginners = data.beginnerStudents.map(bs => bs.id === loggedInBeginner.id ? { ...bs, lastLogin: timestamp } : bs);
        await saveData({ ...data, beginnerStudents: updatedBeginners });
        updateUserActivity(loggedInBeginner.name, 'beginner');

        navigate('/classroom-debutant');
        return;
    }

    // Jury Login
    const loggedInJury = data.juryMembers.find(j => 
        j.username.toLowerCase() === username.toLowerCase() ||
        j.name.toLowerCase() === username.toLowerCase()
    );
    if (loggedInJury && loggedInJury.password === password) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', 'jury');
        sessionStorage.setItem('userId', loggedInJury.id);
        sessionStorage.setItem('userName', loggedInJury.name);
        updateUserActivity(loggedInJury.name, 'jury');
        navigate('/jury/casting');
        return;
    }
    
    // Registration Staff Login
    const loggedInStaff = data.registrationStaff.find(s => 
        s.username.toLowerCase() === username.toLowerCase() ||
        s.name.toLowerCase() === username.toLowerCase()
    );
    if (loggedInStaff && loggedInStaff.password === password) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', 'registration');
        sessionStorage.setItem('userId', loggedInStaff.id);
        sessionStorage.setItem('userName', loggedInStaff.name);
        updateUserActivity(loggedInStaff.name, 'registration');
        navigate('/enregistrement/casting');
        return;
    }

    setError('Identifiant ou mot de passe incorrect.');
    setPassword('');
  };

  const handleSubmitRecovery = async (modelName: string, phone: string) => {
    if (!data) return;
    const newRequest: RecoveryRequest = {
      id: Date.now().toString(),
      modelName,
      phone,
      timestamp: new Date().toISOString(),
      status: 'Nouveau',
    };
    const updatedRequests = [...(data.recoveryRequests || []), newRequest];
    await saveData({ ...data, recoveryRequests: updatedRequests });
    setIsRecoveryModalOpen(false);
    alert('Votre demande a été envoyée à l\'administrateur. Vous serez contacté prochainement.');
  };

  return (
    <>
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
                        placeholder="Identifiant ou Nom complet"
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
                disabled={!isInitialized}
                className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white !mt-8 disabled:opacity-50 disabled:cursor-wait"
              >
                {isInitialized ? 'Entrer' : 'Chargement...'}
              </button>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsRecoveryModalOpen(true)}
                className="text-sm text-pm-off-white/60 hover:text-pm-gold hover:underline"
              >
                Coordonnées oubliées ?
              </button>
            </div>
          </div>
        </div>
      </div>
      {isRecoveryModalOpen && <RecoveryModal onClose={() => setIsRecoveryModalOpen(false)} onSubmit={handleSubmitRecovery} />}
    </>
  );
};

const RecoveryModal: React.FC<{onClose: () => void, onSubmit: (name: string, phone: string) => void}> = ({ onClose, onSubmit }) => {
  const [modelName, setModelName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(modelName, phone);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-playfair text-pm-gold">Demande de Coordonnées</h2>
            <button onClick={onClose} className="text-pm-off-white/70 hover:text-white">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-pm-off-white/70 mb-6">
            Veuillez entrer votre nom de mannequin et votre numéro de téléphone. L'administrateur vous contactera pour vous fournir vos accès.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modelName" className="sr-only">Nom de mannequin</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <UserIcon className="h-5 w-5 text-pm-off-white/50" />
                </div>
                <input id="modelName" type="text" value={modelName} onChange={e => setModelName(e.target.value)} placeholder="Votre nom complet de mannequin" className="admin-input pl-10" required />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Numéro de téléphone</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <PhoneIcon className="h-5 w-5 text-pm-off-white/50" />
                </div>
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Votre numéro de téléphone" className="admin-input pl-10" required />
              </div>
            </div>
            <button type="submit" className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white mt-4">
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;