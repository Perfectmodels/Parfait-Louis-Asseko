import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockClosedIcon, UserIcon, XMarkIcon, PhoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../hooks/useAuth';
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
  const router = useRouter();
  const { data, isInitialized, saveData } = useData();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isInitialized || !data) {
        setError('Le service est en cours de démarrage. Veuillez patienter...');
        return;
    }

    const timestamp = new Date().toISOString();
    const normalizedUsername = username.toLowerCase();

    // Admin Login
    if (normalizedUsername === 'admin' && password === 'admin2025') {
      const success = login({
        email: 'admin@perfectmodels.com',
        name: 'Administrateur',
        role: 'admin'
      });
      
      if (success) {
        updateUserActivity('Administrateur', 'admin');
        router.push('/admin');
      } else {
        setError('Erreur lors de la connexion');
      }
      return;
    }

    // Model Login
    const loggedInModel = data.models.find((m: any) => 
        m.username.toLowerCase() === normalizedUsername || 
        m.name.toLowerCase() === normalizedUsername
    );
    if (loggedInModel && loggedInModel.password === password) {
           const success = login({
             email: loggedInModel.email,
             name: loggedInModel.name,
             role: 'student',
             id: loggedInModel.id,
             userType: 'pro'
           });
        
        if (success) {
          // Ajouter l'userId dans sessionStorage pour ModelDashboard
          sessionStorage.setItem('userId', loggedInModel.id);
          sessionStorage.setItem('userName', loggedInModel.name);
          sessionStorage.setItem('userType', 'pro'); // Marquer comme mannequin pro
          
          const updatedModels = data.models.map((m: any) => m.id === loggedInModel.id ? { ...m, lastLogin: timestamp } : m);
          await saveData({ ...data, models: updatedModels });
          updateUserActivity(loggedInModel.name, 'student');
          
          router.push('/profil');
        } else {
          setError('Erreur lors de la connexion');
        }
        return;
    }
    
    // Beginner Student Login
    const loggedInBeginner = data.beginnerStudents.find(bs => 
        bs.matricule.toLowerCase() === normalizedUsername ||
        bs.name.toLowerCase() === normalizedUsername
    );
    if (loggedInBeginner && loggedInBeginner.password === password) {
        // Utiliser la même logique que les mannequins pro
           const success = login({
             email: loggedInBeginner.email || `${loggedInBeginner.name.toLowerCase().replace(/\s+/g, '.')}@perfectmodels.ga`,
             name: loggedInBeginner.name,
             role: 'student', // Même rôle que les mannequins pro
             id: loggedInBeginner.id,
             userType: 'beginner'
           });
        
        if (success) {
          // Ajouter l'userId dans sessionStorage pour ModelDashboard
          sessionStorage.setItem('userId', loggedInBeginner.id);
          sessionStorage.setItem('userName', loggedInBeginner.name);
          sessionStorage.setItem('userType', 'beginner'); // Marquer comme débutant
          
          const updatedBeginners = data.beginnerStudents.map(bs => bs.id === loggedInBeginner.id ? { ...bs, lastLogin: timestamp } : bs);
          await saveData({ ...data, beginnerStudents: updatedBeginners });
          updateUserActivity(loggedInBeginner.name, 'beginner');
          
          router.push('/profil');
        } else {
          setError('Erreur lors de la connexion');
        }
        return;
    }

    // Jury Login
    const loggedInJury = data.juryMembers.find(j => 
        j.username.toLowerCase() === normalizedUsername ||
        j.name.toLowerCase() === normalizedUsername
    );
    if (loggedInJury && loggedInJury.password === password) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', 'jury');
        sessionStorage.setItem('userId', loggedInJury.id);
        sessionStorage.setItem('userName', loggedInJury.name);
        updateUserActivity(loggedInJury.name, 'jury');
        router.push('/jury/casting');
        return;
    }
    
    // Registration Staff Login
    const loggedInStaff = data.registrationStaff.find(s => 
        s.username.toLowerCase() === normalizedUsername ||
        s.name.toLowerCase() === normalizedUsername
    );
    if (loggedInStaff && loggedInStaff.password === password) {
        sessionStorage.setItem('classroom_access', 'granted');
        sessionStorage.setItem('classroom_role', 'registration');
        sessionStorage.setItem('userId', loggedInStaff.id);
        sessionStorage.setItem('userName', loggedInStaff.name);
        updateUserActivity(loggedInStaff.name, 'registration');
        router.push('/enregistrement/casting');
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
      <div className="relative min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
        <SEO title="Accès Privé" noIndex />
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40Z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-pm-gold/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pm-gold/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pm-gold/8 rounded-full blur-xl animate-pulse delay-2000"></div>

        <div className="relative z-10 flex items-center justify-center min-h-screen py-20 px-6">
          <div className="w-full max-w-md">
            {/* Main Login Card */}
            <div className="relative group">
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-pm-gold via-pm-gold/50 to-pm-gold rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-black/90 via-pm-dark/95 to-black/90 backdrop-blur-sm border border-pm-gold/30 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header Section */}
                <div className="relative px-8 pt-12 pb-8 text-center">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-pm-gold to-transparent"></div>
                  
                  {/* Icon with Animation */}
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 rounded-full flex items-center justify-center border border-pm-gold/30">
                      <LockClosedIcon className="w-10 h-10 text-pm-gold animate-pulse" />
                    </div>
                    {/* Rotating Ring */}
                    <div className="absolute inset-0 w-20 h-20 mx-auto border-2 border-pm-gold/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                  </div>

                  <h1 className="text-3xl md:text-4xl font-playfair text-pm-gold mb-3 bg-gradient-to-r from-pm-gold to-yellow-300 bg-clip-text text-transparent">
                    Accès Privé
                  </h1>
                  <p className="text-pm-off-white/80 text-sm leading-relaxed">
                    Connectez-vous à votre espace personnel pour accéder aux fonctionnalités exclusives
                  </p>
                </div>

                {/* Form Section */}
                <div className="px-8 pb-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    {/* Username Field */}
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-pm-gold/90">
                        Identifiant
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-pm-gold/60 group-focus-within:text-pm-gold transition-colors" />
                        </div>
                        <input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setError('');
                          }}
                          placeholder="Nom d'utilisateur ou nom complet"
                          className="w-full bg-pm-off-white/5 border border-pm-gold/30 rounded-xl pl-12 pr-4 py-4 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold transition-all duration-300 hover:border-pm-gold/50"
                          aria-label="Identifiant"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <label htmlFor="password-input" className="block text-sm font-medium text-pm-gold/90">
                        Mot de passe
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-pm-gold/60 group-focus-within:text-pm-gold transition-colors" />
                        </div>
                        <input
                          id="password-input"
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                          }}
                          placeholder="Votre mot de passe"
                          className="w-full bg-pm-off-white/5 border border-pm-gold/30 rounded-xl pl-12 pr-4 py-4 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold transition-all duration-300 hover:border-pm-gold/50"
                          aria-label="Mot de passe"
                          required
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!isInitialized}
                      className="w-full relative group bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold uppercase tracking-wider py-4 rounded-xl transition-all duration-300 hover:from-yellow-400 hover:to-pm-gold hover:shadow-lg hover:shadow-pm-gold/25 hover:scale-105 disabled:opacity-50 disabled:cursor-wait disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                      <span className="relative z-10">
                        {isInitialized ? 'Se connecter' : 'Chargement...'}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-pm-gold to-yellow-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </form>

                  {/* Recovery Link */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setIsRecoveryModalOpen(true)}
                      className="text-sm text-pm-off-white/60 hover:text-pm-gold transition-colors duration-300 hover:underline group"
                    >
                      <span className="group-hover:tracking-wider transition-all duration-300">
                        Coordonnées oubliées ?
                      </span>
                    </button>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="px-8 pb-6">
                  <div className="border-t border-pm-gold/20 pt-4">
                    <p className="text-xs text-pm-off-white/50 text-center">
                      Accès sécurisé • Chiffrement SSL • Données protégées
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-8 bg-pm-off-white/5 border border-pm-gold/20 rounded-xl p-6 backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-sm font-semibold text-pm-gold mb-2">Types d'accès disponibles</h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-pm-off-white/70">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pm-gold rounded-full"></div>
                    <span>Mannequins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pm-gold rounded-full"></div>
                    <span>Étudiants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pm-gold rounded-full"></div>
                    <span>Jury</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pm-gold rounded-full"></div>
                    <span>Administration</span>
                  </div>
                </div>
              </div>
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
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="relative group w-full max-w-md">
        {/* Modal Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pm-gold via-pm-gold/50 to-pm-gold rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
        
        {/* Main Modal */}
        <div className="relative bg-gradient-to-br from-black/95 via-pm-dark/98 to-black/95 backdrop-blur-sm border border-pm-gold/30 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pm-gold/20 rounded-lg flex items-center justify-center">
                  <PhoneIcon className="w-4 h-4 text-pm-gold" />
                </div>
                <h2 className="text-xl font-playfair text-pm-gold">Récupération d'accès</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-300"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-pm-off-white/80 leading-relaxed">
              Entrez vos informations pour que l'administrateur puisse vous contacter et vous fournir vos accès.
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="modelName" className="block text-sm font-medium text-pm-gold/90">
                  Nom complet
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-pm-gold/60 group-focus-within:text-pm-gold transition-colors" />
                  </div>
                  <input 
                    id="modelName" 
                    type="text" 
                    value={modelName} 
                    onChange={e => setModelName(e.target.value)} 
                    placeholder="Votre nom complet de mannequin" 
                    className="w-full bg-pm-off-white/5 border border-pm-gold/30 rounded-xl pl-12 pr-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold transition-all duration-300 hover:border-pm-gold/50" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-pm-gold/90">
                  Numéro de téléphone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-pm-gold/60 group-focus-within:text-pm-gold transition-colors" />
                  </div>
                  <input 
                    id="phone" 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="Votre numéro de téléphone" 
                    className="w-full bg-pm-off-white/5 border border-pm-gold/30 rounded-xl pl-12 pr-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold transition-all duration-300 hover:border-pm-gold/50" 
                    required 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold uppercase tracking-wider py-3 rounded-xl transition-all duration-300 hover:from-yellow-400 hover:to-pm-gold hover:shadow-lg hover:shadow-pm-gold/25 hover:scale-105 mt-6"
              >
                Envoyer la demande
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;