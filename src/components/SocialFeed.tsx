import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { SocialPost } from '../types';
import SocialPostCard from './SocialPostCard';
import SocialPostCreator from './SocialPostCreator';
import { 
  FunnelIcon, 
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface SocialFeedProps {
  className?: string;
}

const SocialFeed: React.FC<SocialFeedProps> = ({ className = "" }) => {
  const { data } = useData();
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'trending'>('recent');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);

  const posts = data?.socialPosts || [];

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filtrer par catégorie
    if (filterCategory !== 'all') {
      filtered = filtered.filter(post => post.category === filterCategory);
    }

    // Trier
    switch (sortBy) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popular':
        return filtered.sort((a, b) => (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length));
      case 'trending':
        // Algorithme simple de trending basé sur l'activité récente
        return filtered.sort((a, b) => {
          const aScore = a.likes.length + a.comments.length + (a.isPinned ? 10 : 0);
          const bScore = b.likes.length + b.comments.length + (b.isPinned ? 10 : 0);
          return bScore - aScore;
        });
      default:
        return filtered;
    }
  }, [posts, sortBy, filterCategory]);

  const categories = [
    { value: 'all', label: 'Tous', emoji: '🌐' },
    { value: 'general', label: 'Général', emoji: '💬' },
    { value: 'tips', label: 'Conseils', emoji: '💡' },
    { value: 'inspiration', label: 'Inspiration', emoji: '✨' },
    { value: 'question', label: 'Questions', emoji: '❓' },
    { value: 'achievement', label: 'Réussites', emoji: '🏆' },
    { value: 'news', label: 'Actualités', emoji: '📰' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Récent', icon: ClockIcon },
    { value: 'popular', label: 'Populaire', icon: HeartIcon },
    { value: 'trending', label: 'Tendance', icon: FireIcon }
  ];

  const handlePostCreated = (post: SocialPost) => {
    setShowCreatePost(false);
    // Le post sera automatiquement ajouté via le contexte
  };

  const handlePostUpdated = (updatedPost: SocialPost) => {
    // Le post sera automatiquement mis à jour via le contexte
  };

  const handlePostDeleted = (postId: string) => {
    // Le post sera automatiquement supprimé via le contexte
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header avec filtres */}
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <SparklesIcon className="w-6 h-6 text-pm-gold" />
            <h2 className="text-xl font-playfair text-pm-gold">Fil d'Actualité</h2>
            <span className="text-pm-off-white/60 text-sm">
              {filteredAndSortedPosts.length} publication{filteredAndSortedPosts.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
          >
            {showCreatePost ? 'Annuler' : 'Nouvelle Publication'}
          </button>
        </div>

        {/* Filtres et tri */}
        <div className="flex flex-wrap gap-4">
          {/* Filtre par catégorie */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-pm-gold/60" />
            <span className="text-pm-off-white/80 text-sm">Catégorie:</span>
            <div className="flex gap-1">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilterCategory(category.value)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    filterCategory === category.value
                      ? 'bg-pm-gold text-pm-dark'
                      : 'bg-pm-dark/50 text-pm-off-white hover:bg-pm-gold/20'
                  }`}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-5 h-5 text-pm-gold/60" />
            <span className="text-pm-off-white/80 text-sm">Trier par:</span>
            <div className="flex gap-1">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value as any)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1 ${
                      sortBy === option.value
                        ? 'bg-pm-gold text-pm-dark'
                        : 'bg-pm-dark/50 text-pm-off-white hover:bg-pm-gold/20'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Créateur de post */}
      {showCreatePost && (
        <SocialPostCreator
          onPostCreated={handlePostCreated}
          placeholder="Partagez quelque chose avec la communauté..."
        />
      )}

      {/* Liste des posts */}
      <div className="space-y-6">
        {filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-pm-gold/10 rounded-full flex items-center justify-center">
              <ChatBubbleLeftIcon className="w-12 h-12 text-pm-gold/60" />
            </div>
            <h3 className="text-xl font-playfair text-pm-gold mb-2">Aucune publication</h3>
            <p className="text-pm-off-white/60 mb-6">
              {filterCategory === 'all' 
                ? "Soyez le premier à partager quelque chose avec la communauté !"
                : `Aucune publication dans la catégorie "${categories.find(c => c.value === filterCategory)?.label}"`
              }
            </p>
            <button
              onClick={() => setShowCreatePost(true)}
              className="px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
            >
              Créer une publication
            </button>
          </div>
        ) : (
          filteredAndSortedPosts.map((post) => (
            <SocialPostCard
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>

      {/* Statistiques rapides */}
      {posts.length > 0 && (
        <div className="bg-pm-dark/50 border border-pm-gold/10 rounded-lg p-4">
          <h3 className="text-pm-gold font-semibold mb-3">Statistiques de la communauté</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-pm-gold">{posts.length}</div>
              <div className="text-sm text-pm-off-white/60">Publications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pm-gold">
                {posts.reduce((sum, post) => sum + post.likes.length, 0)}
              </div>
              <div className="text-sm text-pm-off-white/60">Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pm-gold">
                {posts.reduce((sum, post) => sum + post.comments.length, 0)}
              </div>
              <div className="text-sm text-pm-off-white/60">Commentaires</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pm-gold">
                {new Set(posts.map(post => post.authorId)).size}
              </div>
              <div className="text-sm text-pm-off-white/60">Auteurs</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
