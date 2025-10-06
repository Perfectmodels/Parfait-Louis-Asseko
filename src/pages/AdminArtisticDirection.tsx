import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { PlusIcon, PencilIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';

// ArtisticProject type removed - using any[]

const AdminArtisticDirection: React.FC = () => {
  const { data, saveData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
                      status: 'En cours' as 'En cours' | 'Terminé' | 'Annulé',
    startDate: '',
    endDate: '',
    models: '',
    photographer: '',
    stylist: '',
    location: ''
  });

  const artisticProjects = (data?.artisticProjects as any[]) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: any = {
      id: editingProject?.id || Date.now().toString(),
      title: formData.title,
      description: formData.description,
      imageUrl: formData.imageUrl,
      status: formData.status,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      models: formData.models.split(',').map(m => m.trim()).filter(m => m),
      photographer: formData.photographer || undefined,
      stylist: formData.stylist || undefined,
      location: formData.location || undefined
    };

    let updatedProjects;
    if (editingProject) {
      updatedProjects = artisticProjects.map((project: any) => 
        project.id === editingProject.id ? newProject : project
      );
    } else {
      updatedProjects = [...artisticProjects, newProject];
    }

    saveData({ ...data!, artisticProjects: updatedProjects });
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      status: 'En cours',
      startDate: '',
      endDate: '',
      models: '',
      photographer: '',
      stylist: '',
      location: ''
    });
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate || '',
      models: project.models.join(', '),
      photographer: project.photographer || '',
      stylist: project.stylist || '',
      location: project.location || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      const updatedProjects = artisticProjects.filter((project: any) => project.id !== id);
      saveData({ ...data!, artisticProjects: updatedProjects });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'Terminé': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'Annulé': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Direction Artistique" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Direction Artistique</h1>
            <p className="admin-page-subtitle">Gérer les projets artistiques et les shootings.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nouveau projet
          </button>
        </header>

        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Projets Artistiques</h2>
          
          {artisticProjects.length === 0 ? (
            <div className="text-center py-12">
              <StarIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun projet artistique pour le moment</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer le premier projet
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artisticProjects.map((project: any) => (
                <div key={project.id} className="card-base p-6">
                  <div className="aspect-video mb-4 bg-pm-off-white/10 rounded-lg overflow-hidden">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pm-off-white/40">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-pm-gold line-clamp-1">{project.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-pm-off-white/70 text-sm mb-3 line-clamp-2">{project.description}</p>
                  
                  <div className="space-y-1 text-xs text-pm-off-white/50 mb-4">
                    <p><strong>Début:</strong> {formatDate(project.startDate)}</p>
                    {project.endDate && <p><strong>Fin:</strong> {formatDate(project.endDate)}</p>}
                    {project.location && <p><strong>Lieu:</strong> {project.location}</p>}
                    {project.photographer && <p><strong>Photographe:</strong> {project.photographer}</p>}
                    {project.stylist && <p><strong>Styliste:</strong> {project.stylist}</p>}
                  </div>
                  
                  {project.models.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-pm-off-white/50 mb-1"><strong>Mannequins:</strong></p>
                      <div className="flex flex-wrap gap-1">
                        {project.models.slice(0, 3).map((model: any, index: any) => (
                          <span key={index} className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded">
                            {model}
                          </span>
                        ))}
                        {project.models.length > 3 && (
                          <span className="px-2 py-1 bg-pm-off-white/20 text-pm-off-white/50 text-xs rounded">
                            +{project.models.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded hover:bg-pm-gold/30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">
                {editingProject ? 'Modifier le projet' : 'Nouveau projet artistique'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Titre du projet</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Statut</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="admin-input"
                    >
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                      <option value="Annulé">Annulé</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="admin-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="admin-textarea"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="admin-label">URL de l'image</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="admin-input"
                    placeholder="https://exemple.com/image.jpg"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Date de début</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Date de fin (optionnel)</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="admin-label">Mannequins (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.models}
                    onChange={(e) => setFormData({...formData, models: e.target.value})}
                    className="admin-input"
                    placeholder="Mannequin 1, Mannequin 2, Mannequin 3"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="admin-label">Photographe</label>
                    <input
                      type="text"
                      value={formData.photographer}
                      onChange={(e) => setFormData({...formData, photographer: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Styliste</label>
                    <input
                      type="text"
                      value={formData.stylist}
                      onChange={(e) => setFormData({...formData, stylist: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Lieu</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
                  >
                    {editingProject ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProject(null);
                      setFormData({
                        title: '',
                        description: '',
                        imageUrl: '',
                        status: 'En cours',
                        startDate: '',
                        endDate: '',
                        models: '',
                        photographer: '',
                        stylist: '',
                        location: ''
                      });
                    }}
                    className="flex-1 px-6 py-3 border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-pm-gold/10 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArtisticDirection;
