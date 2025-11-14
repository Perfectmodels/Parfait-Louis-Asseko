
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LockClosedIcon, UserIcon, XMarkIcon, PhoneIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { RecoveryRequest } from '../../types';
import { motion } from 'framer-motion';

interface ActiveUser {
  name: string;
  role: string;
  loginTime: number;
}

const updateUserActivity = (name: string, role: string) => {
    const now = Date.now();
    const fifteenMinutes = 15 * 60 * 1000;
    const currentActivityJSON = localStorage.getItem('pmm_active_users');
    let activeUsers: ActiveUser[] = currentActivityJSON ? JSON.parse(currentActivityJSON) : [];
    activeUsers = activeUsers.filter(user => user.name !== name);
    activeUsers.push({ name, role, loginTime: now });
    activeUsers = activeUsers.filter(user => (now - user.loginTime) < fifteenMinutes);
    localStorage.setItem('pmm_active_users', JSON.stringify(activeUsers));
};


const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data, isInitialized, saveData } = useData();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isInitialized || !data) {
        setError('Service indisponible. Veuillez réessayer dans un instant.');
        return;
    }

    const timestamp = new Date().toISOString();
    const normalizedUsername = username.toLowerCase().trim();

    const users = [
        { type: 'admin', user: { name: 'Admin', username: 'admin', password: 'admin2025' }, path: '/admin' },
        ...data.models.map(m => ({ type: 'student', user: m, path: '/profil' })),
        ...data.juryMembers.map(j => ({ type: 'jury', user: j, path: '/jury/casting' })),
        ...data.registrationStaff.map(s => ({ type: 'registration', user: s, path: '/enregistrement/casting' })),
    ];

    const foundUser = users.find(u => 
        (
            ('username' in u.user && u.user.username?.toLowerCase() === normalizedUsername) || 
            u.user.name.toLowerCase() === normalizedUsername
        ) && u.user.password === password
    );

    if (foundUser) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', foundUser.type);
        sessionStorage.setItem('userId', (foundUser.user as any).id);
        sessionStorage.setItem('userName', foundUser.user.name);
        
        updateUserActivity(foundUser.user.name, foundUser.type);

        if (foundUser.type === 'student') {
            const listKey = 'models';
            const updatedList = (data as any)[listKey].map((item: any) => 
                item.id === (foundUser.user as any).id ? { ...item, lastLogin: timestamp } : item
            );
            await saveData({ ...data, [listKey]: updatedList });
        }
        
        navigate(foundUser.path);
        return;
    }

    setError('Identifiant ou mot de passe incorrect.');
    setPassword('');
  };

  const handleSubmitRecovery = async (modelName: string, phone: string) => {
    if (!data) return;
    const newRequest: RecoveryRequest = {
      id: Date.now().toString(), modelName, phone, timestamp: new Date().toISOString(), status: 'Nouveau',
    };
    const updatedRequests = [...(data.recoveryRequests || []), newRequest];
    await saveData({ ...data, recoveryRequests: updatedRequests });
    setIsRecoveryModalOpen(false);
    alert('Votre demande a été envoyée. Vous serez contacté prochainement.');
  };

  return (
    <>
      <SEO title="Accès Privé" noIndex />
      <div 
        className="bg-cover bg-center min-h-screen flex items-center justify-center p-4"
        style={{ backgroundImage: `url(${data?.siteImages.castingBg})` }}
      >
        <div className="absolute inset-0 bg-pm-dark/80 backdrop-blur-sm"></div>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-sm"
        >
          <div className="bg-black/50 border border-pm-gold/20 p-8 rounded-lg shadow-2xl shadow-black/50 text-center">
            <Link to="/">
                <img src={data?.siteConfig.logo} alt="Logo" className="h-20 w-auto mx-auto mb-6 bg-black rounded-full border-2 border-pm-gold p-1" />
            </Link>
            <h1 className="text-3xl font-playfair text-pm-gold mb-2">Accès Privé</h1>
            <p className="text-pm-off-white/70 mb-8">
              Bienvenue sur votre espace personnel.
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                   <UserIcon className="h-5 w-5 text-pm-off-white/50 absolute top-1/2 left-4 transform -translate-y-1/2" />
                   <input
                     type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(''); }}
                     placeholder="Identifiant ou Nom"
                     className="w-full bg-pm-dark/70 border-2 border-pm-off-white/20 rounded-full py-3 px-12 focus:outline-none focus:border-pm-gold transition-colors"
                     required
                   />
                </div>
                <div className="relative">
                   <LockClosedIcon className="h-5 w-5 text-pm-off-white/50 absolute top-1/2 left-4 transform -translate-y-1/2" />
                   <input
                     type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }}
                     placeholder="Mot de passe"
                     className="w-full bg-pm-dark/70 border-2 border-pm-off-white/20 rounded-full py-3 px-12 focus:outline-none focus:border-pm-gold transition-colors"
                     required
                   />
                </div>
              {error && <p className="text-red-400 text-sm !mt-4">{error}</p>}
              <button
                type="submit" disabled={!isInitialized}
                className="w-full group flex items-center justify-center gap-2 px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white !mt-8 disabled:opacity-50"
              >
                <span>{isInitialized ? 'Connexion' : 'Chargement...'}</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
            <div className="mt-6">
              <button onClick={() => setIsRecoveryModalOpen(true)} className="text-xs text-pm-off-white/60 hover:text-pm-gold hover:underline">
                Coordonnées oubliées ?
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      {isRecoveryModalOpen && <RecoveryModal onClose={() => setIsRecoveryModalOpen(false)} onSubmit={handleSubmitRecovery} />}
    </>
  );
};

// ... RecoveryModal (pas de changement majeur nécessaire, mais on l'inclut pour la complétude)
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
            Entrez votre nom de mannequin et votre numéro de téléphone. L'administrateur vous contactera pour vous fournir vos accès.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="modelName" className="sr-only">Nom de mannequin</label>
              <div className="relative">
                <UserIcon className="h-5 w-5 text-pm-off-white/50 absolute top-1/2 left-4 transform -translate-y-1/2" />
                <input id="modelName" type="text" value={modelName} onChange={e => setModelName(e.target.value)} placeholder="Votre nom complet" className="admin-input pl-12" required />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="sr-only">Numéro de téléphone</label>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 text-pm-off-white/50 absolute top-1/2 left-4 transform -translate-y-1/2" />
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Votre numéro de téléphone" className="admin-input pl-12" required />
              </div>
            </div>
            <button type="submit" className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white mt-4">
              Envoyer la demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
