
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChatBubbleLeftRightIcon, 
  PlusIcon, 
  SparklesIcon,
  UsersIcon,
  FireIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import SocialFeed from '../components/SocialFeed';
import { ForumThread } from '../types';

const ClassroomForum: React.FC = () => {
    const { data, isInitialized } = useData();
    const [activeTab, setActiveTab] = useState<'social' | 'forum'>('social');

    const userId = sessionStorage.getItem('userId');
    const socialUserId = sessionStorage.getItem('social_user_id');
    const user = data?.models.find(m => m.id === userId) || 
                 data?.beginnerStudents.find(s => s.id === userId);
    const socialUser = data?.socialUsers?.find(u => u.id === socialUserId);
    
    const threads = data?.forumThreads.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];
    const socialPosts = data?.socialPosts || [];
    
    if (!isInitialized) {
        return <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center"><p>Chargement...</p></div>;
    }

    return (
        <>
            <SEO title="Communauté | PMM Classroom" noIndex />
            <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <SparklesIcon className="w-10 h-10 text-pm-gold" />
                            <div>
                                <h1 className="text-4xl font-playfair text-pm-gold">Communauté PMM</h1>
                                <p className="text-sm text-pm-off-white/70">Connectez-vous, partagez et apprenez ensemble</p>
                            </div>
                        </div>

                        {/* Statistiques rapides */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-pm-gold">{socialPosts.length}</div>
                                <div className="text-sm text-pm-off-white/60">Publications</div>
                            </div>
                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-pm-gold">
                                    {socialPosts.reduce((sum, post) => sum + post.likes.length, 0)}
                                </div>
                                <div className="text-sm text-pm-off-white/60">Likes</div>
                            </div>
                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-pm-gold">
                                    {socialPosts.reduce((sum, post) => sum + post.comments.length, 0)}
                                </div>
                                <div className="text-sm text-pm-off-white/60">Commentaires</div>
                            </div>
                            <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-pm-gold">{threads.length}</div>
                                <div className="text-sm text-pm-off-white/60">Discussions</div>
                            </div>
                        </div>

                        {/* Invitation au mini réseau social */}
                        {!socialUser && (
                            <div className="bg-gradient-to-r from-pm-gold/20 to-pm-gold/10 border border-pm-gold/30 rounded-xl p-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                                        <UserPlusIcon className="w-6 h-6 text-pm-gold" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-pm-gold mb-1">
                                            Rejoignez le mini réseau social PMM !
                                        </h3>
                                        <p className="text-sm text-pm-off-white/80 mb-3">
                                            Connectez-vous avec d'autres mannequins, partagez vos expériences et échangez des conseils professionnels.
                                        </p>
                                        <Link 
                                            to="/social-login"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-semibold text-sm rounded-lg hover:bg-white transition-colors"
                                        >
                                            <UserPlusIcon className="w-4 h-4" />
                                            S'inscrire / Se connecter
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation par onglets */}
                        <div className="flex gap-2 border-b border-pm-gold/20">
                            <button
                                onClick={() => setActiveTab('social')}
                                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'social'
                                        ? 'text-pm-gold border-pm-gold'
                                        : 'text-pm-off-white/60 border-transparent hover:text-pm-gold'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5" />
                                    Fil d'Actualité
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('forum')}
                                className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                                    activeTab === 'forum'
                                        ? 'text-pm-gold border-pm-gold'
                                        : 'text-pm-off-white/60 border-transparent hover:text-pm-gold'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                                    Forum Classique
                                </div>
                            </button>
                        </div>
                    </header>

                    {/* Contenu selon l'onglet actif */}
                    {activeTab === 'social' ? (
                        <SocialFeed />
                    ) : (
                        <div className="space-y-6">
                            {/* Forum classique */}
                            <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-playfair text-pm-gold">Discussions du Forum</h2>
                                    <Link
                                        to="/formations/forum/new"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                        Nouvelle Discussion
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {threads.map(thread => (
                                        <Link 
                                            to={`/formations/forum/${thread.id}`} 
                                            key={thread.id} 
                                            className="block bg-pm-dark/50 p-4 border border-pm-gold/10 rounded-lg hover:border-pm-gold hover:bg-pm-dark transition-all duration-300"
                                        >
                                            <h3 className="text-lg font-semibold text-pm-gold mb-2">{thread.title}</h3>
                                            <p className="text-pm-off-white/80 text-sm mb-3 line-clamp-2">
                                                {thread.initialPost}
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-pm-off-white/60">
                                                <div className="flex items-center gap-4">
                                                    <span>Par <span className="font-semibold text-pm-gold">{thread.authorName}</span></span>
                                                </div>
                                                <span>{new Date(thread.createdAt).toLocaleDateString('fr-FR', { 
                                                    day: 'numeric', 
                                                    month: 'short', 
                                                    year: 'numeric' 
                                                })}</span>
                                            </div>
                                        </Link>
                                    ))}
                                    
                                    {threads.length === 0 && (
                                        <div className="text-center py-12">
                                            <ChatBubbleLeftRightIcon className="w-16 h-16 text-pm-gold/40 mx-auto mb-4" />
                                            <h3 className="text-xl font-playfair text-pm-gold mb-2">Aucune discussion</h3>
                                            <p className="text-pm-off-white/60 mb-6">
                                                Soyez le premier à lancer une discussion dans le forum classique !
                                            </p>
                                            <Link
                                                to="/formations/forum/new"
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
                                            >
                                                <PlusIcon className="w-5 h-5" />
                                                Créer une Discussion
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ClassroomForum;