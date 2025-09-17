import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  LockClosedIcon, 
  EnvelopeIcon, 
  EyeIcon, 
  EyeSlashIcon,
  SparklesIcon,
  UsersIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { SocialUser } from '../types';
import { 
  ScrollReveal, 
  StaggerOnScroll, 
  ScaleOnScroll, 
  TextReveal 
} from '../components/ScrollAnimations';

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
}

const SocialLogin: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [loginData, setLoginData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: ''
  });

  const navigate = useNavigate();
  const { data, isInitialized, saveData } = useData();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!isInitialized || !data) {
      setError('Le service est en cours de démarrage. Veuillez patienter...');
      setIsLoading(false);
      return;
    }

    try {
      const normalizedUsername = loginData.username.toLowerCase();
      const user = data.socialUsers?.find(u => 
        u.username.toLowerCase() === normalizedUsername
      );

      if (!user) {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
        setIsLoading(false);
        return;
      }

      // Pour la démo, on utilise le nom d'utilisateur comme mot de passe
      // En production, il faudrait un système de hachage sécurisé
      if (user.username !== loginData.password) {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
        setIsLoading(false);
        return;
      }

      // Mettre à jour le statut en ligne
      const updatedUsers = data.socialUsers?.map(u => 
        u.id === user.id ? { ...u, isOnline: true } : u
      ) || [];

      await saveData({ ...data, socialUsers: updatedUsers });

      // Stocker les informations de session
      sessionStorage.setItem('social_access', 'granted');
      sessionStorage.setItem('social_user_id', user.id);
      sessionStorage.setItem('social_user_name', user.name);
      sessionStorage.setItem('social_user_username', user.username);

      setSuccess('Connexion réussie ! Redirection...');
      
      setTimeout(() => {
        navigate('/formations/forum');
      }, 1500);

    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!isInitialized || !data) {
      setError('Le service est en cours de démarrage. Veuillez patienter...');
      setIsLoading(false);
      return;
    }

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      setIsLoading(false);
      return;
    }

    try {
      // Vérifier si le nom d'utilisateur existe déjà
      const existingUser = data.socialUsers?.find(u => 
        u.username.toLowerCase() === registerData.username.toLowerCase()
      );

      if (existingUser) {
        setError('Ce nom d\'utilisateur est déjà pris.');
        setIsLoading(false);
        return;
      }

      // Créer le nouvel utilisateur
      const newUser: SocialUser = {
        id: `social-user-${Date.now()}`,
        name: registerData.name,
        username: registerData.username,
        email: registerData.email,
        bio: registerData.bio || '',
        followers: [],
        following: [],
        postsCount: 0,
        isVerified: false,
        isOnline: true,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };

      const updatedUsers = [...(data.socialUsers || []), newUser];
      await saveData({ ...data, socialUsers: updatedUsers });

      // Stocker les informations de session
      sessionStorage.setItem('social_access', 'granted');
      sessionStorage.setItem('social_user_id', newUser.id);
      sessionStorage.setItem('social_user_name', newUser.name);
      sessionStorage.setItem('social_user_username', newUser.username);

      setSuccess('Inscription réussie ! Bienvenue dans la communauté PMM !');
      
      setTimeout(() => {
        navigate('/formations/forum');
      }, 2000);

    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setSuccess('');
    setLoginData({ username: '', password: '' });
    setRegisterData({
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      bio: ''
    });
  };

  return (
    <>
      <SEO 
        title={isLoginMode ? "Connexion - Communauté PMM" : "Inscription - Communauté PMM"} 
        description="Rejoignez la communauté Perfect Models Management et connectez-vous avec d'autres talents de la mode."
        noIndex 
      />
      
      <div className="bg-pm-dark text-pm-off-white min-h-screen py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          
          {/* Hero Section */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-pm-gold/20 rounded-full mb-6">
                <SparklesIcon className="w-6 h-6 text-pm-gold" />
                <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                  Communauté PMM
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair text-pm-gold mb-4">
                {isLoginMode ? 'Bienvenue de retour !' : 'Rejoignez la communauté'}
              </h1>
              
              <TextReveal delay={0.2}>
                <p className="text-xl text-pm-off-white/80 max-w-2xl mx-auto">
                  {isLoginMode 
                    ? 'Connectez-vous pour accéder au mini réseau social et interagir avec la communauté.'
                    : 'Créez votre compte pour partager, échanger et grandir avec d\'autres talents de la mode.'
                  }
                </p>
              </TextReveal>
            </div>
          </ScrollReveal>

          {/* Features Grid */}
          <StaggerOnScroll staggerDelay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 text-center hover:border-pm-gold transition-all duration-300">
                <UsersIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-pm-gold mb-2">Communauté</h3>
                <p className="text-sm text-pm-off-white/70">Connectez-vous avec d'autres mannequins et professionnels</p>
              </div>
              
              <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 text-center hover:border-pm-gold transition-all duration-300">
                <HeartIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-pm-gold mb-2">Partage</h3>
                <p className="text-sm text-pm-off-white/70">Partagez vos expériences et inspirez les autres</p>
              </div>
              
              <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 text-center hover:border-pm-gold transition-all duration-300">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-pm-gold mb-2">Échange</h3>
                <p className="text-sm text-pm-off-white/70">Discutez et échangez des conseils professionnels</p>
              </div>
            </div>
          </StaggerOnScroll>

          {/* Login/Register Form */}
          <ScaleOnScroll>
            <div className="max-w-md mx-auto">
              <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-8 shadow-2xl">
                
                {/* Mode Toggle */}
                <div className="flex bg-pm-dark/50 rounded-lg p-1 mb-8">
                  <button
                    onClick={() => setIsLoginMode(true)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 ${
                      isLoginMode 
                        ? 'bg-pm-gold text-pm-dark' 
                        : 'text-pm-off-white/70 hover:text-pm-gold'
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => setIsLoginMode(false)}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-300 ${
                      !isLoginMode 
                        ? 'bg-pm-gold text-pm-dark' 
                        : 'text-pm-off-white/70 hover:text-pm-gold'
                    }`}
                  >
                    Inscription
                  </button>
                </div>

                {/* Messages */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3"
                    >
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </motion.div>
                  )}
                  
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center gap-3"
                    >
                      <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <p className="text-green-400 text-sm">{success}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Forms */}
                <AnimatePresence mode="wait">
                  {isLoginMode ? (
                    <motion.form
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleLogin}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="login-username" className="block text-sm font-medium text-pm-gold mb-2">
                          Nom d'utilisateur
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="login-username"
                            type="text"
                            value={loginData.username}
                            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Votre nom d'utilisateur"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-pm-gold mb-2">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Votre mot de passe"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5 text-pm-off-white/50 hover:text-pm-gold transition-colors" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-pm-off-white/50 hover:text-pm-gold transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Connexion...' : 'Se connecter'}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.form
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleRegister}
                      className="space-y-6"
                    >
                      <div>
                        <label htmlFor="register-name" className="block text-sm font-medium text-pm-gold mb-2">
                          Nom complet
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="register-name"
                            type="text"
                            value={registerData.name}
                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Votre nom complet"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="register-username" className="block text-sm font-medium text-pm-gold mb-2">
                          Nom d'utilisateur
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="register-username"
                            type="text"
                            value={registerData.username}
                            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Choisissez un nom d'utilisateur"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="register-email" className="block text-sm font-medium text-pm-gold mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="register-email"
                            type="email"
                            value={registerData.email}
                            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Votre adresse email"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="register-bio" className="block text-sm font-medium text-pm-gold mb-2">
                          Bio (optionnel)
                        </label>
                        <textarea
                          id="register-bio"
                          value={registerData.bio}
                          onChange={(e) => setRegisterData({ ...registerData, bio: e.target.value })}
                          className="w-full px-4 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors resize-none"
                          placeholder="Parlez-nous de vous..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <label htmlFor="register-password" className="block text-sm font-medium text-pm-gold mb-2">
                          Mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            value={registerData.password}
                            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Minimum 6 caractères"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showPassword ? (
                              <EyeSlashIcon className="h-5 w-5 text-pm-off-white/50 hover:text-pm-gold transition-colors" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-pm-off-white/50 hover:text-pm-gold transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-pm-gold mb-2">
                          Confirmer le mot de passe
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-pm-off-white/50" />
                          </div>
                          <input
                            id="register-confirm-password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={registerData.confirmPassword}
                            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                            className="w-full pl-10 pr-12 py-3 bg-pm-dark border border-pm-off-white/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:border-pm-gold transition-colors"
                            placeholder="Confirmez votre mot de passe"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {showConfirmPassword ? (
                              <EyeSlashIcon className="h-5 w-5 text-pm-off-white/50 hover:text-pm-gold transition-colors" />
                            ) : (
                              <EyeIcon className="h-5 w-5 text-pm-off-white/50 hover:text-pm-gold transition-colors" />
                            )}
                          </button>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Inscription...' : 'S\'inscrire'}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Demo Info */}
                <div className="mt-8 p-4 bg-pm-gold/10 border border-pm-gold/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-pm-gold mb-2">💡 Mode Démo</h4>
                  <p className="text-xs text-pm-off-white/70">
                    Pour tester la connexion, utilisez votre nom d'utilisateur comme mot de passe.
                    <br />
                    Exemple : nom d'utilisateur "demo" → mot de passe "demo"
                  </p>
                </div>
              </div>
            </div>
          </ScaleOnScroll>
        </div>
      </div>
    </>
  );
};

export default SocialLogin;
