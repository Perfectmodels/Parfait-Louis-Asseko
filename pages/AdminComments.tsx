import React from 'react';
import { useData } from '../contexts/DataContext';
import { ArticleComment } from '../types';
import SEO from '../components/SEO';
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
                            <div key={comment.id} className="p-4 border-b border-pm-dark last:border-b-0 hover:bg-pm-dark/50">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 text-sm text-pm-off-white/70 mb-2">
                                            <span className="font-bold text-pm-off-white">{comment.authorName}</span>
                                            <span>•</span>
                                            <span>{new Date(comment.createdAt).toLocaleString('fr-FR')}</span>
                                        </div>
                                        <p className="text-pm-off-white/90 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                    <button onClick={() => handleDelete(comment.id)} className="text-red-500/70 hover:text-red-500 flex-shrink-0 p-2">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                {article && (
                                    <div className="mt-2 text-right">
                                        <Link to={`/magazine/${article.slug}`} className="text-xs text-pm-gold/80 hover:underline">
                                            Voir l'article : "{article.title}"
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    {comments.length === 0 && (
                        <div className="text-center p-16">
                            <ChatBubbleBottomCenterTextIcon className="w-16 h-16 mx-auto text-pm-off-white/30 mb-4" />
                            <p className="text-pm-off-white/70">Aucun commentaire à modérer pour le moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminComments;