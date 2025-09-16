import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { NewsItem } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import ImageInput from '../../components/icons/ImageInput';
import AIAssistant from '../../components/AIAssistant';

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
        <div className="admin-page-header">
            <div>
                 <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                <h1 className="admin-page-title">Gérer les Actualités</h1>
                <p className="admin-page-subtitle">Ajoutez, modifiez et organisez les actualités de la page d'accueil.</p>
            </div>
             <div className="flex items-center gap-4">
                <button onClick={handleStartCreate} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                    <PlusIcon className="w-5 h-5"/> Ajouter une Actualité
                </button>
            </div>
        </div>

        <div className="admin-section-wrapper !p-4 space-y-4">
          {localNews.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark transition-colors duration-200">
              <div className="flex items-center gap-4 flex-grow min-w-0">
                <img src={item.imageUrl} alt={item.title} className="w-24 h-16 object-cover rounded flex-shrink-0"/>
                <div className="truncate">
                  <h2 className="font-bold truncate">{item.title}</h2>
                  <p className="text-sm text-pm-off-white/70">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-4">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="action-btn disabled:opacity-30" title="Monter"><ArrowUpIcon className="w-5 h-5"/></button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === localNews.length - 1} className="action-btn disabled:opacity-30" title="Descendre"><ArrowDownIcon className="w-5 h-5"/></button>
                <button onClick={() => { setEditingItem(item); setIsCreating(false); }} className="action-btn" title="Modifier"><PencilIcon className="w-5 h-5"/></button>
                <button onClick={() => handleDelete(item.id)} className="action-btn !border-red-500/50 hover:!bg-red-500/20" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
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
    const [assistantState, setAssistantState] = useState<{isOpen: boolean; fieldName: string; initialPrompt: string}>({
        isOpen: false,
        fieldName: '',
        initialPrompt: ''
    });

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

    const openAssistant = (fieldName: string, initialPrompt: string) => {
        setAssistantState({ isOpen: true, fieldName, initialPrompt });
    };

    const handleInsertContent = (content: string) => {
        const field = assistantState.fieldName.toLowerCase();
        if (field.includes('titre')) {
            setFormData(p => ({ ...p, title: content }));
        } else if (field.includes('extrait')) {
            setFormData(p => ({ ...p, excerpt: content }));
        }
        setAssistantState({ isOpen: false, fieldName: '', initialPrompt: '' });
    };

    return (
        <>
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="admin-page-header !mb-8">
                         <div>
                            <h1 className="admin-page-title">{isCreating ? 'Nouvelle Actualité' : "Modifier l'Actualité"}</h1>
                            <p className="admin-page-subtitle">Remplissez les champs pour créer ou mettre à jour une actualité.</p>
                         </div>
                    </div>
                    <form onSubmit={handleSubmit} className="admin-section-wrapper">
                        <div className="space-y-6">
                            <FormInput 
                                label="Titre" name="title" value={formData.title} onChange={handleChange} 
                                onAIAssist={() => openAssistant('Titre', `Génère un titre d'actualité percutant sur le thème: "${formData.title || 'nouveau sujet'}"`)}
                            />
                            <ImageInput label="Image" value={formData.imageUrl} onChange={handleImageChange} />
                            <FormInput label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
                            <FormTextArea 
                                label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange}
                                onAIAssist={() => openAssistant('Extrait', `Rédige un court extrait (1-2 phrases) pour une actualité intitulée: "${formData.title}"`)}
                            />
                            <FormInput label="Lien (optionnel, ex: /casting)" name="link" value={formData.link || ''} onChange={handleChange} />
                        </div>
                        <div className="flex justify-end gap-4 pt-6 mt-6 border-t border-pm-gold/20">
                            <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white shadow-md shadow-pm-gold/30">Sauvegarder</button>
                        </div>
                    </form>
                </div>
            </div>

            <AIAssistant 
                isOpen={assistantState.isOpen}
                onClose={() => setAssistantState(p => ({...p, isOpen: false}))}
                onInsertContent={handleInsertContent}
                fieldName={assistantState.fieldName}
                initialPrompt={assistantState.initialPrompt}
            />
        </>
    );
};

const FormInput: React.FC<{label: string, name: string, value: any, onChange: any, type?: string, onAIAssist?: () => void}> = ({label, name, value, onChange, type="text", onAIAssist}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="admin-label !mb-0">{label}</label>
            {onAIAssist && (
                <button type="button" onClick={onAIAssist} className="inline-flex items-center gap-1 text-xs text-pm-gold/70 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: any, onChange: any, onAIAssist?: () => void}> = ({label, name, value, onChange, onAIAssist}) => (
    <div>
        <div className="flex justify-between items-center mb-1">
            <label htmlFor={name} className="admin-label !mb-0">{label}</label>
             {onAIAssist && (
                <button type="button" onClick={onAIAssist} className="inline-flex items-center gap-1 text-xs text-pm-gold/70 hover:text-pm-gold">
                    <SparklesIcon className="w-4 h-4" /> Assister
                </button>
            )}
        </div>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={5} className="admin-input admin-textarea" />
    </div>
);

export default AdminNews;