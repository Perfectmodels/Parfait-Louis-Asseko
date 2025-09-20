import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { SocialPost, SocialComment } from '../types';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ShareIcon, 
  EllipsisHorizontalIcon,
  MapPinIcon,
  TagIcon,
  FaceSmileIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface SocialPostCardProps {
  post: SocialPost;
  onPostUpdated: (post: SocialPost) => void;
  onPostDeleted: (postId: string) => void;
  className?: string;
}

const SocialPostCard: React.FC<SocialPostCardProps> = ({ 
  post, 
  onPostUpdated, 
  onPostDeleted,
  className = "" 
}) => {
  const { data, saveData } = useData();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const currentUser = data?.models.find(m => m.id === sessionStorage.getItem('userId')) || 
                     data?.beginnerStudents.find(s => s.id === sessionStorage.getItem('userId'));

  const isLiked = currentUser ? post.likes.includes(currentUser.id) : false;
  const isAuthor = currentUser ? post.authorId === currentUser.id : false;

  const handleLike = async () => {
    if (!currentUser || isLiking) return;
    
    setIsLiking(true);
    try {
      const updatedLikes = isLiked 
        ? post.likes.filter(id => id !== currentUser.id)
        : [...post.likes, currentUser.id];

      const updatedPost = { ...post, likes: updatedLikes };
      
      if (data) {
        const updatedPosts = data.socialPosts?.map(p => 
          p.id === post.id ? updatedPost : p
        ) || [];
        await saveData({ ...data, socialPosts: updatedPosts });
        onPostUpdated(updatedPost);
      }
    } catch (error) {
      console.error('Erreur lors du like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!currentUser || !newComment.trim() || isCommenting) return;
    
    setIsCommenting(true);
    try {
      const comment: SocialComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        postId: post.id,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorImage: currentUser.imageUrl || 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model',
        content: newComment.trim(),
        likes: [],
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEdited: false
      };

      const updatedPost = {
        ...post,
        comments: [...post.comments, comment]
      };

      if (data) {
        const updatedPosts = data.socialPosts?.map(p => 
          p.id === post.id ? updatedPost : p
        ) || [];
        await saveData({ ...data, socialPosts: updatedPosts });
        onPostUpdated(updatedPost);
      }

      setNewComment('');
    } catch (error) {
      console.error('Erreur lors du commentaire:', error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!isAuthor || !data) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) {
      try {
        const updatedPosts = data.socialPosts?.filter(p => p.id !== post.id) || [];
        await saveData({ ...data, socialPosts: updatedPosts });
        onPostDeleted(post.id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
    setShowOptions(false);
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}j`;
    return postDate.toLocaleDateString('fr-FR');
  };

  const getCategoryEmoji = (category: string) => {
    const emojis: { [key: string]: string } = {
      general: '💬',
      tips: '💡',
      inspiration: '✨',
      question: '❓',
      achievement: '🏆',
      news: '📰'
    };
    return emojis[category] || '💬';
  };

  const getMoodEmoji = (mood?: string) => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      excited: '🤩',
      grateful: '🙏',
      proud: '😌',
      motivated: '💪',
      inspired: '🌟'
    };
    return mood ? emojis[mood] : '';
  };

  return (
    <div className={`bg-pm-dark border border-pm-gold/20 rounded-xl overflow-hidden ${className}`}>
      {/* Header du post */}
      <div className="p-4 border-b border-pm-gold/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-pm-gold/20 flex-shrink-0">
              <img 
                src={post.authorImage || 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model'} 
                alt={post.authorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-pm-gold font-semibold">{post.authorName}</h3>
                {post.isPinned && (
                  <span className="text-xs bg-pm-gold/20 text-pm-gold px-2 py-1 rounded-full">
                    📌 Épinglé
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-pm-off-white/60 text-sm">
                <ClockIcon className="w-4 h-4" />
                <span>{formatTimeAgo(post.createdAt)}</span>
                {post.editedAt && (
                  <span className="text-xs">• Modifié</span>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-2 text-pm-off-white/60 hover:text-pm-gold transition-colors"
            >
              <EllipsisHorizontalIcon className="w-5 h-5" />
            </button>
            
            {showOptions && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-pm-dark border border-pm-gold/20 rounded-lg shadow-lg z-10">
                {isAuthor ? (
                  <>
                    <button className="w-full px-4 py-2 text-left text-sm text-pm-off-white hover:bg-pm-gold/10 hover:text-pm-gold transition-colors flex items-center gap-2">
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>
                    <button 
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </>
                ) : (
                  <button className="w-full px-4 py-2 text-left text-sm text-pm-off-white hover:bg-pm-gold/10 hover:text-pm-gold transition-colors flex items-center gap-2">
                    <FlagIcon className="w-4 h-4" />
                    Signaler
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Métadonnées du post */}
        <div className="flex items-center gap-4 mt-3 text-sm text-pm-off-white/60">
          <span className="flex items-center gap-1">
            {getCategoryEmoji(post.category)}
            <span className="capitalize">{post.category}</span>
          </span>
          {post.mood && (
            <span className="flex items-center gap-1">
              {getMoodEmoji(post.mood)}
              <span className="capitalize">{post.mood}</span>
            </span>
          )}
          {post.location && (
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              {post.location}
            </span>
          )}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <TagIcon className="w-4 h-4 text-pm-gold/60" />
            <div className="flex gap-1 flex-wrap">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-pm-gold/10 text-pm-gold px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Contenu du post */}
      <div className="p-4">
        {post.content && (
          <div className="text-pm-off-white leading-relaxed mb-4">
            {post.content.split('\n').map((line, index) => (
              <p key={index} className={index > 0 ? 'mt-2' : ''}>
                {line.split(' ').map((word, wordIndex) => {
                  if (word.startsWith('@')) {
                    return (
                      <span key={wordIndex} className="text-pm-gold font-medium">
                        {word}{' '}
                      </span>
                    );
                  }
                  if (word.startsWith('#')) {
                    return (
                      <span key={wordIndex} className="text-pm-gold/80">
                        {word}{' '}
                      </span>
                    );
                  }
                  return word + ' ';
                })}
              </p>
            ))}
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-4 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            post.images.length === 3 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.images.map((image, index) => (
              <div 
                key={index} 
                className={`relative overflow-hidden rounded-lg ${
                  post.images!.length === 3 && index === 0 ? 'row-span-2' : ''
                }`}
              >
                <img 
                  src={image} 
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-pm-gold/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? 'text-red-500' : 'text-pm-off-white/60 hover:text-red-500'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="w-5 h-5" />
              ) : (
                <HeartIcon className="w-5 h-5" />
              )}
              <span className="text-sm">{post.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-pm-off-white/60 hover:text-pm-gold transition-colors"
            >
              <ChatBubbleLeftIcon className="w-5 h-5" />
              <span className="text-sm">{post.comments.length}</span>
            </button>

            <button className="flex items-center gap-2 text-pm-off-white/60 hover:text-pm-gold transition-colors">
              <ShareIcon className="w-5 h-5" />
              <span className="text-sm">{post.shares.length}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Commentaires */}
      {showComments && (
        <div className="border-t border-pm-gold/10 p-4 space-y-4">
          {/* Liste des commentaires */}
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-pm-gold/20 flex-shrink-0">
                <img 
                  src={comment.authorImage || 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model'} 
                  alt={comment.authorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="bg-pm-dark/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-pm-gold font-medium text-sm">{comment.authorName}</span>
                    <span className="text-pm-off-white/40 text-xs">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                    {comment.isEdited && (
                      <span className="text-xs text-pm-off-white/40">• Modifié</span>
                    )}
                  </div>
                  <p className="text-pm-off-white text-sm">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 ml-3">
                  <button className="text-pm-off-white/60 hover:text-red-500 transition-colors text-xs">
                    J'aime ({comment.likes.length})
                  </button>
                  <button className="text-pm-off-white/60 hover:text-pm-gold transition-colors text-xs">
                    Répondre
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Formulaire de commentaire */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-pm-gold/20 flex-shrink-0">
              <img 
                src={currentUser?.imageUrl || 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model'} 
                alt={currentUser?.name || 'Utilisateur'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Écrivez un commentaire..."
                  className="flex-1 bg-pm-dark/50 border border-pm-gold/20 rounded-lg px-3 py-2 text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={!newComment.trim() || isCommenting}
                  className="px-4 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-pm-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  {isCommenting ? '...' : 'Envoyer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPostCard;
