import React, { useState, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import { SocialPost } from '../types';
import { 
  PhotoIcon, 
  FaceSmileIcon, 
  MapPinIcon, 
  TagIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import ImageUpload from './ImageUpload';
import MultipleImageUpload from './MultipleImageUpload';

interface SocialPostCreatorProps {
  onPostCreated: (post: SocialPost) => void;
  placeholder?: string;
  className?: string;
}

const SocialPostCreator: React.FC<SocialPostCreatorProps> = ({ 
  onPostCreated, 
  placeholder = "Partagez quelque chose avec la communauté...",
  className = ""
}) => {
  const { data, saveData } = useData();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<SocialPost['category']>('general');
  const [mood, setMood] = useState<SocialPost['mood']>();
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentUser = data?.models.find(m => m.id === sessionStorage.getItem('userId')) || 
                     data?.beginnerStudents.find(s => s.id === sessionStorage.getItem('userId'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && images.length === 0) return;
    if (!currentUser || !data) return;

    setIsSubmitting(true);

    try {
      const newPost: SocialPost = {
        id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorImage: currentUser.imageUrl || 'https://i.ibb.co/3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg',
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
        type: images.length > 0 ? 'image' : 'text',
        category,
        tags,
        mentions: extractMentions(content),
        likes: [],
        shares: [],
        comments: [],
        isPublic: true,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        location: location || undefined,
        mood
      };

      // Sauvegarder le post
      const updatedPosts = [...(data.socialPosts || []), newPost];
      await saveData({ ...data, socialPosts: updatedPosts });

      // Reset form
      setContent('');
      setImages([]);
      setCategory('general');
      setMood(undefined);
      setLocation('');
      setTags([]);
      setTagInput('');
      setShowAdvanced(false);

      onPostCreated(newPost);
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag();
      } else {
        handleSubmit(e as any);
      }
    }
  };

  const categories = [
    { value: 'general', label: 'Général', emoji: '💬' },
    { value: 'tips', label: 'Conseils', emoji: '💡' },
    { value: 'inspiration', label: 'Inspiration', emoji: '✨' },
    { value: 'question', label: 'Question', emoji: '❓' },
    { value: 'achievement', label: 'Réussite', emoji: '🏆' },
    { value: 'news', label: 'Actualités', emoji: '📰' }
  ];

  const moods = [
    { value: 'happy', label: 'Heureux', emoji: '😊' },
    { value: 'excited', label: 'Excité', emoji: '🤩' },
    { value: 'grateful', label: 'Reconnaissant', emoji: '🙏' },
    { value: 'proud', label: 'Fier', emoji: '😌' },
    { value: 'motivated', label: 'Motivé', emoji: '💪' },
    { value: 'inspired', label: 'Inspiré', emoji: '🌟' }
  ];

  return (
    <div className={`bg-pm-dark border border-pm-gold/20 rounded-xl p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header avec avatar et nom */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-pm-gold/20 flex-shrink-0">
            <img 
              src={currentUser?.imageUrl || 'https://i.ibb.co/3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg'} 
              alt={currentUser?.name || 'Utilisateur'}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h3 className="text-pm-gold font-semibold">{currentUser?.name || 'Utilisateur'}</h3>
            <p className="text-pm-off-white/60 text-sm">Partagez avec la communauté</p>
          </div>
        </div>

        {/* Zone de texte */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent border-none outline-none text-pm-off-white placeholder-pm-off-white/50 resize-none text-lg leading-relaxed"
            rows={3}
            onKeyDown={handleKeyPress}
          />
          <div className="absolute bottom-2 right-2 text-pm-off-white/40 text-sm">
            {content.length}/500
          </div>
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="space-y-2">
            <label className="text-pm-gold text-sm font-medium">Images</label>
            <MultipleImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={4}
              placeholder="Ajouter des images"
            />
          </div>
        )}

        {/* Options avancées */}
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-pm-dark/50 rounded-lg border border-pm-gold/10">
            {/* Catégorie */}
            <div>
              <label className="text-pm-gold text-sm font-medium mb-2 block">Catégorie</label>
              <div className="grid grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value as SocialPost['category'])}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      category === cat.value
                        ? 'bg-pm-gold text-pm-dark'
                        : 'bg-pm-dark/50 text-pm-off-white hover:bg-pm-gold/20'
                    }`}
                  >
                    <span className="mr-1">{cat.emoji}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Humeur */}
            <div>
              <label className="text-pm-gold text-sm font-medium mb-2 block">Humeur</label>
              <div className="flex gap-2 flex-wrap">
                {moods.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setMood(mood === m.value ? undefined : m.value as SocialPost['mood'])}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      mood === m.value
                        ? 'bg-pm-gold text-pm-dark'
                        : 'bg-pm-dark/50 text-pm-off-white hover:bg-pm-gold/20'
                    }`}
                  >
                    <span className="mr-1">{m.emoji}</span>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Localisation */}
            <div>
              <label className="text-pm-gold text-sm font-medium mb-2 block">Localisation</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/60" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Où êtes-vous ?"
                  className="w-full pl-10 pr-4 py-2 bg-pm-dark/50 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-pm-gold text-sm font-medium mb-2 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <TagIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold/60" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Ajouter un tag"
                    className="w-full pl-10 pr-4 py-2 bg-pm-dark/50 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-pm-gold/90 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-pm-gold/20 text-pm-gold rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-pm-gold/70"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-pm-gold/20">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="text-sm">Options</span>
            </button>
            
            <button
              type="button"
              onClick={() => setImages(images.length > 0 ? [] : [''])}
              className="flex items-center gap-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <PhotoIcon className="w-5 h-5" />
              <span className="text-sm">Photos</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={(!content.trim() && images.length === 0) || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-pm-dark border-t-transparent rounded-full animate-spin" />
                <span>Publication...</span>
              </>
            ) : (
              <>
                <PaperAirplaneIcon className="w-5 h-5" />
                <span>Publier</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SocialPostCreator;
