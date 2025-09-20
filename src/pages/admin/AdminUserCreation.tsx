import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, UserIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Model, BeginnerStudent } from '../../../types';

interface UserFormData {
  name: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  userType: 'model' | 'beginner';
  level?: 'Pro' | 'Débutant';
  gender?: 'Homme' | 'Femme';
  age?: number;
  height?: string;
  location?: string;
}

const AdminUserCreation: React.FC = () => {
  const { data, saveData } = useData();
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    userType: 'model',
    level: 'Pro',
    gender: 'Femme',
    age: 20,
    height: '170 cm',
    location: 'Libreville'
  });

  const handleInputChange = (field: keyof UserFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateUsername = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '')
      .substring(0, 15);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCreateUser = async () => {
    if (!data) return;
    
    if (!formData.name || !formData.username || !formData.password) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingModel = data.models?.find(m => m.username === formData.username);
    const existingBeginner = data.beginnerStudents?.find(s => s.matricule === formData.username);
    
    if (existingModel || existingBeginner) {
      alert('Ce nom d\'utilisateur est déjà utilisé.');
      return;
    }

    setIsCreating(true);

    try {
      if (formData.userType === 'model') {
        // Créer un mannequin professionnel
        const newModel: Model = {
          id: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name: formData.name,
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phone: formData.phone,
          age: formData.age,
          height: formData.height || '170 cm',
          gender: formData.gender || 'Femme',
          location: formData.location,
          imageUrl: 'https://i.ibb.co/3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg',
          portfolioImages: [],
          distinctions: [],
          isPublic: false,
          level: formData.level || 'Pro',
          measurements: {
            chest: '85 cm',
            waist: '65 cm',
            hips: '90 cm',
            shoeSize: '38'
          },
          categories: [],
          experience: 'Mannequin professionnel',
          journey: 'Créé par l\'administrateur',
          quizScores: {},
          lastLogin: new Date().toISOString(),
          adminAccess: false,
          paymentStatus: {
            isUpToDate: false,
            nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            amount: 50000,
            currency: 'FCFA',
            warnings: []
          }
        };

        const updatedModels = [...(data.models || []), newModel];
        await saveData({ ...data, models: updatedModels });
        
        alert(`Mannequin "${formData.name}" créé avec succès !\nNom d'utilisateur: ${formData.username}\nMot de passe: ${formData.password}`);
      } else {
        // Créer un étudiant débutant
        const initial = formData.name.charAt(0).toUpperCase();
        const existingDebuts = (data.beginnerStudents || []).filter(s => s.matricule && s.matricule.startsWith(`DEB-${initial}`));
        const existingNums = existingDebuts.map(s => parseInt(s.matricule.replace(`DEB-${initial}`, ''), 10) || 0);
        const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
        const matricule = `DEB-${initial}${String(nextNum).padStart(3, '0')}`;

        const newBeginner: BeginnerStudent = {
          id: `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          name: formData.name,
          matricule,
          password: formData.password,
          email: formData.email || '',
          phone: formData.phone || '',
          city: formData.location || '',
          instagram: '',
          quizScores: {},
          lastLogin: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        const updatedBeginners = [...(data.beginnerStudents || []), newBeginner];
        await saveData({ ...data, beginnerStudents: updatedBeginners });
        
        alert(`Étudiant débutant "${formData.name}" créé avec succès !\nMatricule: ${matricule}\nMot de passe: ${formData.password}`);
      }

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        username: '',
        password: '',
        email: '',
        phone: '',
        userType: 'model',
        level: 'Pro',
        gender: 'Femme',
        age: 20,
        height: '170 cm',
        location: 'Libreville'
      });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      alert('Une erreur est survenue lors de la création de l\'utilisateur.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO title="Création d'Utilisateurs - Admin" noIndex />
      
      <div className="page-container">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold hover:text-white transition-colors mb-4">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au tableau de bord
            </Link>
            <h1 className="admin-page-title">Création d'Utilisateurs</h1>
            <p className="admin-page-subtitle">Créer de nouveaux mannequins ou étudiants débutants</p>
          </div>
        </div>

        <div className="admin-section-wrapper">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }} className="space-y-6">
              {/* Type d'utilisateur */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-3">Type d'utilisateur</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'model')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.userType === 'model'
                        ? 'border-pm-gold bg-pm-gold/10 text-pm-gold'
                        : 'border-pm-gold/30 text-pm-off-white/70 hover:border-pm-gold/50'
                    }`}
                  >
                    <UserIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">Mannequin Pro</div>
                      <div className="text-xs opacity-75">Accès complet au panel</div>
                    </div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('userType', 'beginner')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.userType === 'beginner'
                        ? 'border-pm-gold bg-pm-gold/10 text-pm-gold'
                        : 'border-pm-gold/30 text-pm-off-white/70 hover:border-pm-gold/50'
                    }`}
                  >
                    <KeyIcon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">Étudiant Débutant</div>
                      <div className="text-xs opacity-75">Accès formation uniquement</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">Nom complet *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange('name', e.target.value);
                      if (!formData.username) {
                        handleInputChange('username', generateUsername(e.target.value));
                      }
                    }}
                    className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                    placeholder="Nom et prénom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pm-gold mb-2">Nom d'utilisateur *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                    placeholder="Identifiant de connexion"
                    required
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                    placeholder="Mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pm-gold/70 hover:text-pm-gold"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleInputChange('password', generatePassword())}
                    className="px-3 py-1 text-xs bg-pm-gold/10 text-pm-gold border border-pm-gold/30 rounded hover:bg-pm-gold/20 transition-colors"
                  >
                    Générer automatiquement
                  </button>
                </div>
              </div>

              {/* Informations supplémentaires pour les mannequins */}
              {formData.userType === 'model' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-pm-gold mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                        placeholder="email@exemple.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pm-gold mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                        placeholder="+241 XX XX XX XX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-pm-gold mb-2">Genre</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value as 'Homme' | 'Femme')}
                        className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                      >
                        <option value="Femme">Femme</option>
                        <option value="Homme">Homme</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pm-gold mb-2">Âge</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 20)}
                        className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                        min="16"
                        max="50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-pm-gold mb-2">Taille</label>
                      <input
                        type="text"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                        placeholder="170 cm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">Localisation</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                      placeholder="Libreville, Gabon"
                    />
                  </div>
                </>
              )}

              {/* Bouton de création */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-pm-dark border-t-transparent rounded-full animate-spin"></div>
                      <span>Création en cours...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-5 h-5" />
                      <span>Créer l'utilisateur</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserCreation;
