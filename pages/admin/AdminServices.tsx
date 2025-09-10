import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Service } from '../../types';

type ServiceCategory = 'Services Mannequinat' | 'Services Mode et Stylisme' | 'Services Événementiels';

// Extension du type Service pour inclure les détails
interface ServiceWithDetails extends Omit<Service, 'details'> {
  details: {
    title: string;
    points: string[];
  };
}

import { 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminServices() {
  const { data, saveData } = useData();
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  // Définition du type pour le formulaire de service
  type FormService = ServiceWithDetails;

  // État initial du formulaire
  const initialFormData: FormService = {
    title: '',
    description: '',
    category: 'Services Mannequinat', // Valeur par défaut
    icon: 'BriefcaseIcon',
    buttonText: 'En savoir plus',
    buttonLink: '/contact',
    details: {
      title: 'Détails',
      points: []
    }
  };

  const [formData, setFormData] = useState<FormService>(initialFormData);
  const [newPoint, setNewPoint] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Gestion spécifique pour le titre des détails
    if (name === 'detailsTitle') {
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          title: value
        }
      }));
    } 
    // Pour tous les autres champs
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addPoint = () => {
    if (newPoint.trim()) {
      setFormData(prev => {
        const updatedPoints = [...prev.details.points, newPoint];
        return {
          ...prev,
          details: {
            ...prev.details,
            points: updatedPoints
          }
        };
      });
      setNewPoint('');
    }
  };

  const removePoint = (index: number) => {
    setFormData(prev => {
      const updatedPoints = [...prev.details.points];
      updatedPoints.splice(index, 1);
      return {
        ...prev,
        details: {
          ...prev.details,
          points: updatedPoints
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const updatedServices = [...(data?.agencyServices || [])];
    
    // Créer un nouvel objet de service avec les données du formulaire
    const serviceToSave: Service = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category as ServiceCategory,
      icon: formData.icon || 'BriefcaseIcon',
      buttonText: formData.buttonText || 'En savoir plus',
      buttonLink: formData.buttonLink || '/contact',
      details: {
        title: formData.details?.title?.trim() || 'Détails',
        points: Array.isArray(formData.details?.points) 
          ? formData.details.points.map((p: string) => p.trim()).filter(Boolean)
          : []
      }
    };
    
    try {
      if (editingService) {
        // Mise à jour d'un service existant
        const index = updatedServices.findIndex(s => s.title === editingService.title);
        if (index !== -1) {
          updatedServices[index] = serviceToSave;
        } else {
          // Si le service n'existe pas, l'ajouter
          updatedServices.push(serviceToSave);
        }
      } else {
        // Vérifier si un service avec le même titre existe déjà
        const existingIndex = updatedServices.findIndex(s => 
          s.title.toLowerCase() === serviceToSave.title.toLowerCase()
        );
        
        if (existingIndex !== -1) {
          // Mettre à jour le service existant
          updatedServices[existingIndex] = serviceToSave;
        } else {
          // Ajouter un nouveau service
          updatedServices.push(serviceToSave);
        }
      }

      if (data) {
        saveData({
          ...data,
          agencyServices: updatedServices
        });
      }

      // Réinitialiser le formulaire avec les valeurs par défaut
      setFormData(initialFormData);
      setEditingService(null);
      setIsAddingNew(false);
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du service:', error);
      alert('Une erreur est survenue lors de la sauvegarde du service. Veuillez réessayer.');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    
    // S'assurer que les détails sont correctement typés
    const serviceDetails = service.details || { title: 'Détails', points: [] };
    
    const updatedService: ServiceWithDetails = {
      title: service.title,
      description: service.description,
      category: (service.category || 'Services Mannequinat') as ServiceCategory,
      icon: service.icon || 'BriefcaseIcon',
      buttonText: service.buttonText || 'En savoir plus',
      buttonLink: service.buttonLink || '/contact',
      details: {
        title: serviceDetails.title || 'Détails',
        points: Array.isArray(serviceDetails.points) ? [...serviceDetails.points] : []
      }
    };
    
    setFormData(updatedService);
    setIsAddingNew(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (serviceTitle: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      const updatedServices = (data?.agencyServices || []).filter(s => s.title !== serviceTitle);
      if (data) {
        saveData({
          ...data,
          agencyServices: updatedServices
        });
      }
    }
  };

  const cancelEdit = () => {
    setEditingService(null);
    // Réinitialisation du formulaire avec les valeurs par défaut
    setFormData(initialFormData);
  };

  // Tri des catégories dans un ordre spécifique pour une meilleure présentation
  const categoryOrder = [
    'Services Mannequinat',
    'Services Mode et Stylisme',
    'Services Événementiels',
    'Non catégorisé'
  ];

  const servicesByCategory = (data?.agencyServices || []).reduce((acc, service) => {
    // Vérification et nettoyage de la catégorie
    const category = (service.category && typeof service.category === 'string' && service.category.trim()) || 'Non catégorisé';
    
    // Initialisation du tableau de la catégorie si nécessaire
    if (!acc[category]) {
      acc[category] = [];
    }
    
    // Vérification que le service a bien un titre avant de l'ajouter
    if (service.title && typeof service.title === 'string') {
      acc[category].push(service);
    }
    
    return acc;
  }, {} as Record<string, Service[]>);
  
  // Tri des services par titre dans chaque catégorie
  Object.keys(servicesByCategory).forEach(category => {
    servicesByCategory[category].sort((a, b) => a.title.localeCompare(b.title));
  });
  
  // Tri des catégories selon l'ordre défini
  const sortedCategories = Object.keys(servicesByCategory).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    // Si les deux catégories sont dans l'ordre défini, on les trie selon cet ordre
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    // Si une seule est dans l'ordre défini, on la met en premier
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // Sinon, on trie par ordre alphabétique
    return a.localeCompare(b);
  });
  
  // Création d'un nouvel objet avec les catégories triées
  const sortedServicesByCategory = {} as Record<string, Service[]>;
  sortedCategories.forEach(category => {
    sortedServicesByCategory[category] = servicesByCategory[category];
  });
  
  // Utilisation de l'objet trié pour l'affichage
  const servicesByCategoryToDisplay = sortedServicesByCategory;

  const availableIcons = [
    'BriefcaseIcon',
    'UserGroupIcon',
    'CameraIcon',
    'VideoCameraIcon',
    'PhotoIcon',
    'SparklesIcon',
    'AcademicCapIcon',
    'TrophyIcon',
    'StarIcon',
    'LightBulbIcon'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gestion des Services</h1>
        <button
          onClick={() => {
            setEditingService(null);
            setIsAddingNew(true);
            setFormData({
              title: '',
              description: '',
              category: 'Services Mannequinat',
              icon: 'BriefcaseIcon',
              buttonText: 'En savoir plus',
              buttonLink: '/contact',
              details: {
                title: 'Détails',
                points: []
              }
            });
          }}
          className="bg-pm-gold text-pm-darker px-4 py-2 rounded-lg hover:bg-pm-gold/90 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Ajouter un service
        </button>
      </div>

      {(isAddingNew || editingService) && (
        <div className="bg-pm-darker rounded-lg p-6 mb-8 border border-pm-gold/30">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingService ? 'Modifier le service' : 'Nouveau service'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-pm-gold mb-1">Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-1">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  required
                >
                  <option value="Services Mannequinat">Services Mannequinat</option>
                  <option value="Services Mode et Stylisme">Services Mode et Stylisme</option>
                  <option value="Services Événementiels">Services Événementiels</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-1">Icône</label>
                <select
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                >
                  {availableIcons.map(icon => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-pm-gold mb-1">Texte du bouton</label>
                <input
                  type="text"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-pm-gold mb-1">Lien du bouton</label>
                <input
                  type="text"
                  name="buttonLink"
                  value={formData.buttonLink}
                  onChange={handleInputChange}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-pm-gold mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="border-t border-pm-gold/20 pt-6">
              <h3 className="text-lg font-medium text-pm-gold mb-4">Détails du service</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-pm-gold mb-1">Titre des détails</label>
                <input
                  type="text"
                  name="detailsTitle"
                  value={formData.details.title}
                  onChange={handleDetailsChange}
                  className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-pm-gold mb-2">Points clés</label>
                <div className="space-y-2">
                  {formData.details?.points?.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-1 bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white">
                        {point}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePoint(index)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPoint}
                      onChange={(e) => setNewPoint(e.target.value)}
                      placeholder="Ajouter un point clé"
                      className="flex-1 bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addPoint}
                      className="bg-pm-gold/20 text-pm-gold px-4 py-2 rounded-lg hover:bg-pm-gold/30 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-pm-gold/20">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-pm-gold text-pm-darker font-medium rounded-lg hover:bg-pm-gold/90 transition-colors flex items-center gap-2"
              >
                <CheckIcon className="w-5 h-5" />
                {editingService ? 'Mettre à jour' : 'Créer le service'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(servicesByCategoryToDisplay).map(([category, services]) => (
          <div key={category} className="bg-pm-darker/50 rounded-lg overflow-hidden border border-pm-gold/20">
            <div className="bg-pm-gold/10 px-6 py-3 border-b border-pm-gold/20">
              <h2 className="text-lg font-semibold text-pm-gold">{category}</h2>
            </div>
            <div className="divide-y divide-pm-gold/10">
              {services.map((service, index) => (
                <div key={index} className="p-4 hover:bg-pm-gold/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{service.title}</h3>
                      <p className="text-pm-off-white/80 mt-1">{service.description}</p>
                      {service.details?.points && service.details.points.length > 0 && (
                        <div className="mt-2">
                          <h4 className="text-sm font-medium text-pm-gold mb-1">{service.details.title}:</h4>
                          <ul className="list-disc list-inside text-sm text-pm-off-white/70 space-y-1">
                            {service.details.points.map((point, i) => (
                              <li key={i} className="truncate">{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(service.title)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(data?.agencyServices?.length === 0 || !data?.agencyServices) && (
        <div className="text-center py-12">
          <div className="text-pm-gold/50 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-pm-off-white">Aucun service trouvé</h3>
          <p className="mt-2 text-pm-off-white/60">Commencez par ajouter votre premier service.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-pm-darker bg-pm-gold hover:bg-pm-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Ajouter un service
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
