import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

// NewsItem type removed - using any[]

const AdminNews: React.FC = () => {
  const { data, saveData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    imageUrl: '',
    link: ''
  });

  const newsItems = data?.newsItems || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: any = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.title,
      date: editingItem?.date || new Date().toISOString().split('T')[0],
      imageUrl: formData.imageUrl,
      excerpt: formData.excerpt,
      link: formData.link || undefined
    };

    let updatedNewsItems;
    if (editingItem) {
      updatedNewsItems = newsItems.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedNewsItems = [...newsItems, newItem];
    }

    saveData({ ...data!, newsItems: updatedNewsItems });
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ title: '', excerpt: '', imageUrl: '', link: '' });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      imageUrl: item.imageUrl,
      link: item.link || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
      const updatedNewsItems = newsItems.filter(item => item.id !== id);
      saveData({ ...data!, newsItems: updatedNewsItems });
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Gestion des Actualités" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestion des Actualités</h1>
            <p className="admin-page-subtitle">Gérer les actualités affichées sur la page d'accueil.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Ajouter une actualité
          </button>
        </header>

        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Actualités</h2>
          
          {newsItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-pm-off-white/60 text-lg">Aucune actualité pour le moment</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer la première actualité
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item) => (
                <div key={item.id} className="card-base p-6">
                  <div className="aspect-video mb-4 bg-pm-off-white/10 rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pm-off-white/40">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-pm-gold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-pm-off-white/70 text-sm mb-3 line-clamp-3">{item.excerpt}</p>
                  <p className="text-pm-off-white/50 text-xs mb-4">{item.date}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded hover:bg-pm-gold/30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">
                {editingItem ? 'Modifier l\'actualité' : 'Nouvelle actualité'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="admin-label">Titre</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="admin-input"
                    required
                  />
                </div>
                
                <div>
                  <label className="admin-label">Extrait</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    className="admin-textarea"
                    rows={3}
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
                
                <div>
                  <label className="admin-label">Lien (optionnel)</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    className="admin-input"
                    placeholder="https://exemple.com/article"
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
                  >
                    {editingItem ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      setFormData({ title: '', excerpt: '', imageUrl: '', link: '' });
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

export default AdminNews;