import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';

const AdminArtisticDirection: React.FC = () => {
  const { data, saveData } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    date: '',
    category: ''
  });

  const projects = data?.artisticProjects || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    if (editingId) {
      const updated = projects.map(p => 
        p.id === editingId ? { ...formData, id: editingId } : p
      );
      saveData({ ...data, artisticProjects: updated });
    } else {
      const newProject = {
        ...formData,
        id: Date.now().toString()
      };
      saveData({ ...data, artisticProjects: [...projects, newProject] });
    }
    resetForm();
  };

  const handleEdit = (project: any) => {
    setFormData(project);
    setEditingId(project.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      const updated = projects.filter(p => p.id !== id);
      saveData({ ...data, artisticProjects: updated });
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', image: '', date: '', category: '' });
    setEditingId(null);
    setShowAddForm(false);
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Direction Artistique" 
        subtitle="Gérer les projets de direction artistique"
      />

      <AdminSection 
        title="Projets" 
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
          >
            {showAddForm ? 'Annuler' : 'Ajouter un projet'}
          </button>
        }
      >
        {showAddForm && (
          <AdminCard className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL de l'image</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
                >
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </AdminCard>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <AdminCard key={project.id}>
              <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded mb-4" />
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{project.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(project.date).toLocaleDateString('fr-FR')} • {project.category}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </AdminCard>
          ))}
        </div>

        {projects.length === 0 && !showAddForm && (
          <div className="text-center py-8 text-gray-500">
            Aucun projet artistique. Ajoutez-en un pour commencer.
          </div>
        )}
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminArtisticDirection;

