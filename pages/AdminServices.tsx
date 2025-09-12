import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/icons/ImageInput';

const AdminServices: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const [localServices, setLocalServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.agencyServices) {
      setLocalServices([...data.agencyServices]);
    }
  }, [data?.agencyServices, isInitialized]);
  
  const handleFormSave = async (serviceToSave: Service) => {
    if (!data) return;
    let updatedServices;
    if (isCreating) {
        const newService = { ...serviceToSave, id: Date.now().toString() };
        updatedServices = [newService, ...localServices];
    } else {
        updatedServices = localServices.map(s => s.id === serviceToSave.id ? serviceToSave : s);
    }
    
    await saveData({ ...data, agencyServices: updatedServices });
    alert("Service enregistré avec succès.");

    setEditingService(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      if (!data) return;
      const updatedServices = localServices.filter(s => s.id !== id);
      await saveData({ ...data, agencyServices: updatedServices });
      alert("Service supprimé avec succès.");
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newServices = [...localServices];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newServices.length) return;

    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]];
    
    await saveData({ ...data, agencyServices: newServices });
  };
  
  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingService({
      id: '',
      title: '',
      description: '',
      icon: 'SparklesIcon',
      category: 'Services Mannequinat',
      buttonText: 'Réserver',
      buttonLink: '/contact',
      details: {
        title: 'Ce que nous offrons',
        points: [''],
      },
    });
  };

  if (editingService) {
    return <ServiceForm service={editingService} onSave={handleFormSave} onCancel={() => {setEditingService(null); setIsCreating(false);}} isCreating={isCreating}/>;
  }

  return (
    <>
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <SEO title="Admin - Gérer les Services" noIndex />
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
              <div>
                   <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                      <ChevronLeftIcon className="w-5 h-5" />
                      Retour au Dashboard
                  </Link>
                  <h1 className="text-4xl font-playfair text-pm-gold">Gestion des Services</h1>
                  <p className="text-pm-off-white/70 mt-2">Ajoutez, modifiez ou supprimez les services proposés par l'agence.</p>
              </div>
              <button
                  onClick={handleStartCreate}
                  className="bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-white transition-colors"
              >
                  <PlusIcon className="w-5 h-5" />
                  Ajouter un service
              </button>
          </div>

          <div className="bg-black/30 rounded-xl p-6 border border-pm-gold/20">
            {localServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-pm-off-white/70 mb-4">Aucun service n'a été ajouté pour le moment.</p>
                <button
                  onClick={handleStartCreate}
                  className="bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-white transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Ajouter votre premier service
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-pm-gold/20">
                      <th className="text-left py-4 px-4 font-medium text-pm-gold">Titre</th>
                      <th className="text-left py-4 px-4 font-medium text-pm-gold">Catégorie</th>
                      <th className="text-left py-4 px-4 font-medium text-pm-gold">Description</th>
                      <th className="text-center py-4 px-4 font-medium text-pm-gold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localServices.map((service, index) => (
                      <tr key={service.id} className="border-b border-pm-gold/10 hover:bg-pm-gold/5">
                        <td className="py-4 px-4">
                          <div className="font-medium text-pm-off-white">{service.title}</div>
                        </td>
                        <td className="py-4 px-4 text-pm-off-white/70">{service.category}</td>
                        <td className="py-4 px-4 text-pm-off-white/70">
                          {service.description.length > 100 
                            ? `${service.description.substring(0, 100)}...` 
                            : service.description}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setEditingService(service)}
                              className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-full"
                              title="Modifier"
                            >
                              <PencilIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(service.id)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-full"
                              title="Supprimer"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleMove(index, 'up')}
                              disabled={index === 0}
                              className={`p-2 rounded-full ${index === 0 ? 'text-pm-off-white/30' : 'text-pm-off-white hover:bg-pm-gold/10'}`}
                              title="Monter"
                            >
                              <ArrowUpIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleMove(index, 'down')}
                              disabled={index === localServices.length - 1}
                              className={`p-2 rounded-full ${index === localServices.length - 1 ? 'text-pm-off-white/30' : 'text-pm-off-white hover:bg-pm-gold/10'}`}
                              title="Descendre"
                            >
                              <ArrowDownIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

interface ServiceFormProps {
  service: Service;
  onSave: (service: Service) => void;
  onCancel: () => void;
  isCreating: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onSave, onCancel, isCreating }) => {
  const [formData, setFormData] = useState<Service>(service);
  const [detailPoints, setDetailPoints] = useState<string[]>(service.details?.points || ['']);

  const iconOptions = [
    'AcademicCapIcon', 'CameraIcon', 'UserGroupIcon', 'SparklesIcon', 'ClipboardDocumentCheckIcon', 
    'MegaphoneIcon', 'IdentificationIcon', 'ScissorsIcon', 'PaintBrushIcon', 'CalendarDaysIcon', 
    'PresentationChartLineIcon', 'ChatBubbleLeftRightIcon', 'VideoCameraIcon', 'PhotoIcon', 'StarIcon',
    'UsersIcon', 'BriefcaseIcon', 'MicrophoneIcon', 'BuildingStorefrontIcon', 'ClipboardDocumentListIcon'
  ];

  const categoryOptions = [
    'Services Mannequinat',
    'Services Mode et Stylisme',
    'Services Événementiels'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetailPointChange = (index: number, value: string) => {
    const newPoints = [...detailPoints];
    newPoints[index] = value;
    setDetailPoints(newPoints);
  };

  const addDetailPoint = () => {
    setDetailPoints([...detailPoints, '']);
  };

  const removeDetailPoint = (index: number) => {
    if (detailPoints.length > 1) {
      const newPoints = [...detailPoints];
      newPoints.splice(index, 1);
      setDetailPoints(newPoints);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredPoints = detailPoints.filter(point => point.trim() !== '');
    const updatedService = {
      ...formData,
      details: {
        title: formData.details?.title || 'Ce que nous offrons',
        points: filteredPoints.length > 0 ? filteredPoints : ['Service personnalisé selon vos besoins']
      }
    };
    onSave(updatedService);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title={isCreating ? "Admin - Ajouter un Service" : "Admin - Modifier un Service"} noIndex />
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <button onClick={onCancel} className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour à la liste des services
          </button>
          <h1 className="text-4xl font-playfair text-pm-gold">
            {isCreating ? "Ajouter un nouveau service" : "Modifier le service"}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/30 rounded-xl p-6 border border-pm-gold/20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-pm-gold mb-2">Titre du service *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-pm-gold mb-2">Catégorie *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-pm-gold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-pm-gold mb-2">Icône</label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-pm-gold mb-2">Titre des détails</label>
              <input
                type="text"
                name="details.title"
                value={formData.details?.title || 'Ce que nous offrons'}
                onChange={(e) => setFormData(prev => ({ ...prev, details: { ...prev.details, title: e.target.value } }))}
                className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-pm-gold mb-2">Points de détail</label>
            {detailPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleDetailPointChange(index, e.target.value)}
                  className="flex-grow bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                  placeholder="Détail du service"
                />
                <button
                  type="button"
                  onClick={() => removeDetailPoint(index)}
                  disabled={detailPoints.length <= 1}
                  className={`p-2 rounded-full ${detailPoints.length <= 1 ? 'text-pm-off-white/30' : 'text-red-500 hover:bg-red-500/10'}`}
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDetailPoint}
              className="mt-2 text-pm-gold hover:underline inline-flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Ajouter un point
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-pm-gold mb-2">Texte du bouton</label>
              <input
                type="text"
                name="buttonText"
                value={formData.buttonText}
                onChange={handleChange}
                className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                placeholder="Réserver"
              />
            </div>
            <div>
              <label className="block text-pm-gold mb-2">Lien du bouton</label>
              <input
                type="text"
                name="buttonLink"
                value={formData.buttonLink}
                onChange={handleChange}
                className="w-full bg-pm-dark border border-pm-gold/30 rounded-lg px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                placeholder="/contact"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-pm-gold text-pm-dark rounded-lg font-medium hover:bg-white transition-colors"
            >
              {isCreating ? "Créer le service" : "Enregistrer les modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminServices;