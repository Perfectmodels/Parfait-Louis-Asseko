import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { NewsItem } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/ImageInput';

const AdminNews: React.FC = () => {
  const { data, saveData } = useData();
  const [localNews, setLocalNews] = useState<NewsItem[]>([]);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (data?.newsItems) {
      setLocalNews([...data.newsItems]);
    }
  }, [data?.newsItems]);

  const handleFormSave = async (itemToSave: NewsItem) => {
    if (!data) return;
    let updatedNews;
    if (isCreating) {
        const newItem = { ...itemToSave, id: itemToSave.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-') + '-' + Date.now() };
        updatedNews = [newItem, ...localNews];
    } else {
        updatedNews = localNews.map(a => a.id === itemToSave.id ? itemToSave : a);
    }
    
    await saveData({ ...data, newsItems: updatedNews });
    alert("Actualité enregistrée avec succès.");

    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) {
      if (!data) return;
      const updatedNews = localNews.filter(a => a.id !== id);
      await saveData({ ...data, newsItems: updatedNews });
      alert("Actualité supprimée avec succès.");
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (!data) return;
    const newItems = [...localNews];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    await saveData({ ...data, newsItems: newItems });
  };
  
  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingItem({
      id: '',
      title: '',
      date: new Date().toISOString().split('T')[0],
      imageUrl: '',
      excerpt: '',
      link: ''
    });
  };

  if (editingItem) {
    return <NewsForm item={editingItem} onSave={handleFormSave} onCancel={() => {setEditingItem(null); setIsCreating(false);}} isCreating={isCreating}/>
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Gérer les Actualités" noIndex />
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
                 <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Gérer les Actualités</h1>
            </div>
             <div className="flex items-center gap-4">
                <button onClick={handleStartCreate} className="inline-flex items-center gap-2 px-4 py-2 bg-pm-dark border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark">
                    <PlusIcon className="w-5 h-5"/> Ajouter une Actualité
                </button>
            </div>
        </div>

        <div className="bg-black border border-pm-gold/20 p-6 rounded-lg shadow-lg shadow-black/30 space-y-4">
          {localNews.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.title} className="w-24 h-16 object-cover rounded"/>
                <div>
                  <h2 className="font-bold">{item.title}</h2>
                  <p className="text-sm text-pm-off-white/70">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="disabled:opacity-30" title="Monter"><ArrowUpIcon className="w-5 h-5"/></button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === localNews.length - 1} className="disabled:opacity-30" title="Descendre"><ArrowDownIcon className="w-5 h-5"/></button>
                <button onClick={() => { setEditingItem(item); setIsCreating(false); }} className="text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(item.id)} className="text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NewsForm: React.FC<{ item: NewsItem, onSave: (item: NewsItem) => void, onCancel: () => void, isCreating: boolean }> = ({ item, onSave, onCancel, isCreating }) => {
    const [formData, setFormData] = useState(item);

    useEffect(() => {
        setFormData(item);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, imageUrl: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-3xl">
                <h1 className="text-4xl font-playfair text-pm-gold mb-8">{isCreating ? 'Nouvelle Actualité' : "Modifier l'Actualité"}</h1>
                <form onSubmit={handleSubmit} className="bg-black p-8 border border-pm-gold/20 space-y-6 rounded-lg shadow-lg shadow-black/30">
                    <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} />
                    <ImageInput label="Image" value={formData.imageUrl} onChange={handleImageChange} />
                    <FormInput label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
                    <FormTextArea label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange}/>
                    <FormInput label="Lien (optionnel)" name="link" value={formData.link || ''} onChange={handleChange} />
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string}> = ({label, name, value, onChange, type="text"}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any}> = ({label, name, value, onChange}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-1">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default AdminNews;
