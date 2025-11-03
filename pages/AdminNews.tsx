
import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { NewsItem } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
// FIX: Corrected the import to use ImageUploader component for consistency and to fix the broken path.
import ImageUploader from '../components/ImageUploader';

const AdminNews: React.FC = () => {
    const { data, saveData } = useData();
    const [localNews, setLocalNews] = useState<NewsItem[]>([]);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        if (data?.newsItems) {
            setLocalNews([...data.newsItems].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    }, [data?.newsItems]);
    
    const handleSave = async (itemToSave: NewsItem) => {
        if (!data) return;
        let updatedNews;
        if (localNews.some(item => item.id === itemToSave.id)) {
            updatedNews = localNews.map(item => item.id === itemToSave.id ? itemToSave : item);
        } else {
            updatedNews = [...localNews, { ...itemToSave, id: `news-${Date.now()}` }];
        }
        await saveData({ ...data, newsItems: updatedNews });
        setEditingNews(null);
    };

    const handleDelete = async (itemId: string) => {
        if (window.confirm("Supprimer cette actualité ?")) {
            if (!data) return;
            const updatedNews = localNews.filter(item => item.id !== itemId);
            await saveData({ ...data, newsItems: updatedNews });
        }
    };
    
    if (editingNews) {
        return <NewsForm newsItem={editingNews} onSave={handleSave} onCancel={() => setEditingNews(null)} />;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer les Actualités" noIndex />
            <div className="container mx-auto px-6">
                 <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour au Dashboard</Link>
                        <h1 className="admin-page-title">Gérer les Actualités</h1>
                        <p className="admin-page-subtitle">Gérez les actualités affichées sur la page d'accueil.</p>
                    </div>
                    <button onClick={() => setEditingNews({ id: '', title: '', date: new Date().toISOString().split('T')[0], imageUrl: '', excerpt: '', link: '' })} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> Ajouter une Actualité
                    </button>
                </div>

                <div className="admin-section-wrapper space-y-4">
                    {localNews.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
                            <div className="flex items-center gap-4">
                                <img src={item.imageUrl} alt={item.title} className="w-24 h-16 object-cover rounded"/>
                                <div>
                                    <h2 className="font-bold">{item.title}</h2>
                                    <p className="text-sm text-pm-off-white/70">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setEditingNews(item)} className="p-2 text-pm-gold/70 hover:text-pm-gold"><PencilIcon className="w-5 h-5"/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500/70 hover:text-red-500"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NewsForm: React.FC<{ newsItem: NewsItem, onSave: (item: NewsItem) => void, onCancel: () => void }> = ({ newsItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState(newsItem);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
                <button onClick={onCancel} className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour</button>
                <h1 className="admin-page-title mb-8">{newsItem.id ? "Modifier" : "Ajouter"} une Actualité</h1>
                <form onSubmit={handleSubmit} className="admin-section-wrapper space-y-4">
                    <FormInput label="Titre" name="title" value={formData.title} onChange={handleChange} />
                    <FormInput label="Date" name="date" type="date" value={formData.date} onChange={handleChange} />
                    <ImageUploader label="Image" value={formData.imageUrl} onChange={value => setFormData(p => ({...p, imageUrl: value}))} />
                    <FormTextArea label="Extrait" name="excerpt" value={formData.excerpt} onChange={handleChange} />
                    <FormInput label="Lien (optionnel)" name="link" value={formData.link || ''} onChange={handleChange} />
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-6 py-2 bg-pm-dark border border-pm-off-white/50 text-pm-off-white/80 font-bold uppercase tracking-widest text-sm rounded-full hover:border-white">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FormInput: React.FC<{label: string, name: string, value: string, onChange: any, type?: string}> = (props) => (
    <div>
        <label className="admin-label">{props.label}</label>
        <input {...props} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: any}> = (props) => (
    <div>
        <label className="admin-label">{props.label}</label>
        <textarea {...props} rows={3} className="admin-input admin-textarea" />
    </div>
);

export default AdminNews;