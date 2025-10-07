import React, { useState } from 'react';
import { XMarkIcon, UserIcon, CameraIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface AddModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (modelData: any) => void;
}

const AddModelModal: React.FC<AddModelModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    measurements: '',
    experience: '',
    specializations: [] as string[],
    bio: '',
    profileImage: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const specializations = [
    'Fashion', 'Commercial', 'Editorial', 'Runway', 'Beauty', 'Lingerie', 'Swimwear'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSpecializationChange = (specialization: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specialization)
        ? prev.specializations.filter(s => s !== specialization)
        : [...prev.specializations, specialization]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.age) newErrors.age = 'L\'âge est requis';
    if (!formData.height) newErrors.height = 'La taille est requise';
    if (!formData.measurements) newErrors.measurements = 'Les mensurations sont requises';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const modelData = {
      ...formData,
      id: Date.now().toString(),
      status: 'pro',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    onSave(modelData);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      height: '',
      weight: '',
      measurements: '',
      experience: '',
      specializations: [],
      bio: '',
      profileImage: null
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <UserIcon className="w-6 h-6" />
              Ajouter un Mannequin Pro
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Informations personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Nom complet *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.name ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="Nom complet"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.email ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.phone ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="+241 XX XX XX XX"
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Âge *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                min="16"
                max="50"
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.age ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="25"
              />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Caractéristiques physiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Taille (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                min="150"
                max="200"
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.height ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="175"
              />
              {errors.height && <p className="text-red-400 text-sm mt-1">{errors.height}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Poids (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                min="40"
                max="80"
                className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                placeholder="60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pm-gold mb-2">
                Mensurations *
              </label>
              <input
                type="text"
                name="measurements"
                value={formData.measurements}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 bg-black/30 border rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 ${
                  errors.measurements ? 'border-red-500' : 'border-pm-gold/30'
                }`}
                placeholder="90-60-90"
              />
              {errors.measurements && <p className="text-red-400 text-sm mt-1">{errors.measurements}</p>}
            </div>
          </div>

          {/* Spécialisations */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Spécialisations
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {specializations.map((spec) => (
                <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specializations.includes(spec)}
                    onChange={() => handleSpecializationChange(spec)}
                    className="w-4 h-4 text-pm-gold bg-black/30 border-pm-gold/30 rounded focus:ring-pm-gold/50"
                  />
                  <span className="text-sm text-pm-off-white">{spec}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Expérience */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Expérience
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
            >
              <option value="">Sélectionner l'expérience</option>
              <option value="débutant">Débutant (0-1 an)</option>
              <option value="intermédiaire">Intermédiaire (1-3 ans)</option>
              <option value="expérimenté">Expérimenté (3-5 ans)</option>
              <option value="expert">Expert (5+ ans)</option>
            </select>
          </div>

          {/* Photo de profil */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Photo de profil
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image"
              />
              <label
                htmlFor="profile-image"
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/30 rounded-lg text-pm-gold hover:bg-pm-gold/20 cursor-pointer transition-colors"
              >
                <CameraIcon className="w-5 h-5" />
                Choisir une photo
              </label>
              {formData.profileImage && (
                <span className="text-sm text-pm-off-white">
                  {formData.profileImage.name}
                </span>
              )}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-pm-gold mb-2">
              Biographie
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 bg-black/30 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
              placeholder="Décrivez le parcours et les compétences du mannequin..."
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-pm-gold/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500/20 border border-gray-500/30 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-pm-gold/20 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/30 transition-colors"
            >
              Ajouter le Mannequin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModelModal;
