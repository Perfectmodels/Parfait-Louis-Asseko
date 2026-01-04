import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Article } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PencilIcon, PlusIcon, StarIcon } from '@heroicons/react/24/outline';

const AdminMagazine: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const [localArticles, setLocalArticles] = useState<Article[]>([]);

    useEffect(() => {
        if (data?.articles) {
            setLocalArticles([...data.articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
    }, [data?.articles, isInitialized]);

    const handleDelete = async (slug: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
            if (!data) return;
            const updatedArticles = localArticles.filter(a => a.slug !== slug);
            await saveData({ ...data, articles: updatedArticles });
            alert("Article supprimé avec succès.");
        }
    };

    const handleSetFeatured = async (slugToFeature: string) => {
        if (!data) return;
        const updatedArticles = localArticles.map(article => ({
            ...article,
            isFeatured: article.slug === slugToFeature
        }));
        await saveData({ ...data, articles: updatedArticles });
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gérer le Magazine" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Gérer le Magazine</h1>
                        <p className="admin-page-subtitle">Gérez les articles du magazine en ligne Focus Model 241.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/admin/magazine/create" className="action-btn !flex !items-center !gap-2">
                            <PlusIcon className="w-5 h-5" /> Créer un Article
                        </Link>
                    </div>
                </div>

                <div className="admin-section-wrapper">
                    {localArticles.length === 0 ? (
                        <div className="text-center py-12 text-pm-off-white/60">
                            <p>Aucun article pour le moment.</p>
                            <Link to="/admin/magazine/create" className="inline-block mt-4 text-pm-gold hover:underline">
                                Créer votre premier article
                            </Link>
                        </div>
                    ) : (
                        localArticles.map((article) => (
                            <div key={article.slug} className="flex items-center justify-between p-3 border-b border-pm-dark hover:bg-pm-dark/50">
                                <div className="flex items-center gap-4">
                                    {article.isFeatured && <StarIcon className="w-5 h-5 text-pm-gold flex-shrink-0" title="Article à la une" />}
                                    <img src={article.imageUrl} alt={article.title} className="w-24 h-16 object-cover rounded hidden sm:block" />
                                    <div>
                                        <h2 className="font-bold">{article.title}</h2>
                                        <p className="text-sm text-pm-off-white/70">{article.category} - {new Date(article.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {!article.isFeatured && (
                                        <button onClick={() => handleSetFeatured(article.slug)} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Mettre à la une">
                                            <StarIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                    <Link to={`/admin/magazine/edit/${article.slug}`} className="p-2 text-pm-gold/70 hover:text-pm-gold" title="Modifier">
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(article.slug)} className="p-2 text-red-500/70 hover:text-red-500" title="Supprimer">
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

export default AdminMagazine;
