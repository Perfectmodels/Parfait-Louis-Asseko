import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { NewsItem } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

const AdminNews: React.FC = () => {
    const { data, saveData } = useData();
    const [localNews, setLocalNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        if (data?.newsItems) {
            setLocalNews([...data.newsItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    }, [data?.newsItems]);

    const handleDelete = async (itemId: string) => {
        if (window.confirm("Supprimer cette actualité ?")) {
            if (!data) return;
            const updatedNews = localNews.filter(item => item.id !== itemId);
            await saveData({ ...data, newsItems: updatedNews });
        }
    };

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
                        <p className="admin-page-subtitle">Gérez les actualités affichées sur la page d'accueil.</p>
                    </div>
                    <Link to="/admin/news/create" className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5" /> Créer une Actualité
                    </Link>
                </div>

                <div className="admin-section-wrapper space-y-4">
                    {localNews.length === 0 ? (
                        <div className="text-center py-12 text-pm-off-white/60">
                            <p>Aucune actualité pour le moment.</p>
                            <Link to="/admin/news/create" className="inline-block mt-4 text-pm-gold hover:underline">
                                Créer votre première actualité
                            </Link>
                        </div>
                    ) : (
                        localNews.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-4 bg-pm-dark/50 rounded-md hover:bg-pm-dark">
                                <div className="flex items-center gap-4">
                                    <img src={item.imageUrl} alt={item.title} className="w-24 h-16 object-cover rounded" />
                                    <div>
                                        <h2 className="font-bold">{item.title}</h2>
                                        <p className="text-sm text-pm-off-white/70">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link to={`/admin/news/edit/${item.id}`} className="p-2 text-pm-gold/70 hover:text-pm-gold">
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500/70 hover:text-red-500">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminNews;
