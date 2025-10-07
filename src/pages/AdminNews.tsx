import React, { useState } from 'react';
import SEO from '../components/SEO';
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
    content: '',
    imageUrl: '',
    author: '',
    tags: '',
    isPublished: false
  });

  const newsItems = (data?.newsItems as any[]) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: any = {
      id: editingItem?.id || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      imageUrl: formData.imageUrl,
      author: formData.author,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isPublished: formData.isPublished,
      date: editingItem?.date || new Date().toISOString(),
      views: editingItem?.views || 0,
      likes: editingItem?.likes || 0
    };

    let updatedItems;
    if (editingItem) {
      updatedItems = newsItems.map(item => 
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedItems = [...newsItems, newItem];
    }

    saveData({ ...data!, newsItems: updatedItems });
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      author: '',
      tags: '',
      isPublished: false
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      imageUrl: item.imageUrl,
      author: item.author,
      tags: item.tags.join(', '),
      isPublished: item.isPublished
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      const updatedItems = newsItems.filter(item => item.id !== id);
      saveData({ ...data!, newsItems: updatedItems });
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
      <SEO title="Admin - Actualités" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Gestion des Actualités</h1>
            <p className="admin-page-subtitle">Créez et gérez les articles d'actualité.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nouvel article
          </button>
        </header>

        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Articles d'Actualité</h2>
          
          {newsItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-pm-off-white/60 text-lg">Aucun article d'actualité pour le moment</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer le premier article
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map(item => (
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
                  
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-pm-gold line-clamp-1">{item.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.isPublished 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                        : 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                    }`}>
                      {item.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </div>
                  
                  <p className="text-pm-off-white/70 text-sm mb-3 line-clamp-2">{item.excerpt}</p>
                  
                  <div className="space-y-1 text-xs text-pm-off-white/50 mb-4">
                    <p><strong>Auteur:</strong> {item.author}</p>
                    <p><strong>Date:</strong> {formatDate(item.date)}</p>
                    <p><strong>Vues:</strong> {item.views || 0}</p>
                    <p><strong>Likes:</strong> {item.likes || 0}</p>
                  </div>
                  
                  {item.tags && item.tags.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-pm-off-white/50 mb-1"><strong>Tags:</strong></p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 3).map((tag: any, index: any) => (
                          <span key={index} className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-pm-off-white/20 text-pm-off-white/50 text-xs rounded">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
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
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">
                {editingItem ? 'Modifier l\'article' : 'Nouvel article d\'actualité'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Titre de l'article</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Auteur</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
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
                  <label className="admin-label">Contenu</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="admin-textarea"
                    rows={8}
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
                  <label className="admin-label">Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="admin-input"
                    placeholder="mode, défilé, mannequin"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({...formData, isPublished: e.target.checked})}
                    className="w-4 h-4 text-pm-gold bg-black border-pm-gold/30 rounded focus:ring-pm-gold focus:ring-2"
                  />
                  <label htmlFor="isPublished" className="text-sm text-pm-off-white/80">
                    Publier immédiatement
                  </label>
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
                      setFormData({
                        title: '',
                        excerpt: '',
                        content: '',
                        imageUrl: '',
                        author: '',
                        tags: '',
                        isPublished: false
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

export default AdminNews;