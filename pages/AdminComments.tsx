import React from 'react';
<<<<<<< HEAD:src/pages/admin/AdminComments.tsx
import { useData } from '../../contexts/DataContext';
import { ArticleComment } from '../../types';
import SEO from '../../components/SEO';
=======
import { useData } from '../contexts/DataContext';
import { ArticleComment } from '../types';
import SEO from '../components/SEO';
>>>>>>> 95ce282020fa4c741066597c693e1256e3332cb0:pages/AdminComments.tsx
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const AdminComments: React.FC = () => {
    const { data, saveData } = useData();
    const comments = data?.articleComments.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
    const articles = data?.articles || [];

    const handleDelete = async (commentId: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.")) {
            if (!data) return;
            const updatedComments = data.articleComments.filter(c => c.id !== commentId);
            await saveData({ ...data, articleComments: updatedComments });
            alert("Commentaire supprimé.");
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Modérer les Commentaires" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Tableau de Bord
                </Link>
                <h1 className="text-4xl font-playfair text-pm-gold">Modérer les Commentaires</h1>
                <p className="text-pm-off-white/70 mt-2 mb-8">
                    Gérez les commentaires laissés sur les articles du magazine.
                </p>

                <div className="bg-black border border-pm-gold/20 rounded-lg shadow-lg shadow-black/30">
                    {comments.map(comment => {
                        const article = articles.find(a => a.slug === comment.articleSlug);
                        return (
                            <div key={comment.id} className="p-4 border-b border-pm-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-pm-dark/50">
                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <h2 className="font-bold text-lg text-pm-off-white">{comment.authorName}</h2>
                                        <span className="text-xs text-pm-off-white/50">a commenté sur</span>
                                        {article ? (
                                            <Link to={`/magazine/${article.slug}`} className="text-xs text-pm-gold underline truncate" target="_blank" rel="noopener noreferrer">
                                                {article.title}
                                            </Link>
                                        ) : (
                                            <span className="text-xs text-pm-off-white/50">Article inconnu</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-pm-off-white/80 italic">"{comment.content}"</p>
                                    <p className="text-xs text-pm-off-white/50 mt-1">
                                        Le: {new Date(comment.createdAt).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <button onClick={() => handleDelete(comment.id)} className="text-red-500/70 hover:text-red-500 p-1">
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {comments.length === 0 && (
                        <div className="text-center p-16">
                            <ChatBubbleBottomCenterTextIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4"/>
                            <p className="text-pm-off-white/70">Aucun commentaire à modérer pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminComments;


