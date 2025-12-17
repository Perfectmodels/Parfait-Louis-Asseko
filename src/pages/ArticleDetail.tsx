import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ArticleContent, ArticleComment } from '../types';
import { UserCircleIcon, EyeIcon, HandThumbUpIcon, HandThumbDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from '../components/SocialIcons';
import ReadingProgress from '../components/ReadingProgress';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, saveData, isInitialized } = useData();
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);

  // Find the article based on the slug
  const article = data?.articles?.find(a => a.slug === slug);

  useEffect(() => {
    if (!slug || !data || !article) return;

    // Load reactions from local storage
    try {
      const reactions = JSON.parse(localStorage.getItem('article_reactions') || '{}');
      if (slug && reactions[slug]) setUserReaction(reactions[slug]);
    } catch (e) {
      console.error("Error parsing local storage", e);
    }

    // Increment view count
    const incrementViewCount = async () => {
      try {
        const viewedArticles: string[] = JSON.parse(localStorage.getItem('viewed_articles') || '[]');
        if (!viewedArticles.includes(slug)) {
          if (!data.articles) return;
          const articleIndex = data.articles.findIndex(a => a.slug === slug);
          if (articleIndex === -1) return;

          const updatedArticle = { ...data.articles[articleIndex], viewCount: (data.articles[articleIndex].viewCount || 0) + 1 };
          const updatedArticles = [...data.articles];
          updatedArticles[articleIndex] = updatedArticle;

          // We use saveData to update the global context and persist
          await saveData({ ...data, articles: updatedArticles });
          localStorage.setItem('viewed_articles', JSON.stringify([...viewedArticles, slug]));
        }
      } catch (e) {
        console.error("Error updating view count", e);
      }
    };

    incrementViewCount();
  }, [slug, isInitialized]);

  const comments = data?.articleComments
    ?.filter(c => c.articleSlug === slug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !data || !article) return;
    setIsSubmitting(true);
    const commentData: ArticleComment = {
      id: Date.now().toString(),
      articleSlug: article.slug,
      authorName: commentAuthor.trim() || 'Anonyme',
      createdAt: new Date().toISOString(),
      content: newComment,
    };
    const updatedComments = [...(data.articleComments || []), commentData];
    try {
      await saveData({ ...data, articleComments: updatedComments });
      setNewComment('');
      setCommentAuthor('');
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (userReaction || !data || !article || !slug) return;
    const articleIndex = data.articles.findIndex(a => a.slug === slug);
    if (articleIndex === -1) return;
    const currentReactions = data.articles[articleIndex].reactions || { likes: 0, dislikes: 0 };
    const updatedReactions = { ...currentReactions, [reactionType === 'like' ? 'likes' : 'dislikes']: currentReactions[reactionType === 'like' ? 'likes' : 'dislikes'] + 1 };
    const updatedArticle = { ...data.articles[articleIndex], reactions: updatedReactions };
    const updatedArticles = [...data.articles];
    updatedArticles[articleIndex] = updatedArticle;
    try {
      await saveData({ ...data, articles: updatedArticles });
      const reactions = JSON.parse(localStorage.getItem('article_reactions') || '{}');
      reactions[slug] = reactionType;
      localStorage.setItem('article_reactions', JSON.stringify(reactions));
      setUserReaction(reactionType);
    } catch (error) {
      console.error("Error saving reaction:", error);
    }
  };

  if (!isInitialized) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" /></div>;
  if (!article) return <NotFound />;

  const safeContent = Array.isArray(article.content) ? article.content : [];

  const articleSchema = {
    "@context": "https://schema.org", "@type": "NewsArticle", "headline": article.title,
    "image": [article.imageUrl],
    "datePublished": new Date(article.date).toISOString(),
    "author": [{ "@type": "Organization", "name": article.author, "url": window.location.origin }],
    "description": article.excerpt
  };

  const articleUrl = window.location.href;
  const shareTitle = `Découvrez l'article : "${article.title}"`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  const renderContent = (content: ArticleContent) => {
    switch (content.type) {
      case 'heading': return content.level === 2 ? <h2 className="text-3xl font-playfair text-pm-gold mt-12 mb-6 border-l-4 border-pm-gold pl-4">{content.text}</h2> : <h3 className="text-2xl font-playfair text-pm-gold mt-8 mb-4">{content.text}</h3>;
      case 'paragraph': return <p className="mb-6 leading-relaxed text-lg text-gray-300">{content.text}</p>;
      case 'quote': return <blockquote className="my-10 p-8 border-l-2 border-pm-gold bg-white/5 italic relative"><span className="absolute top-4 left-4 text-6xl text-pm-gold/20 font-serif leading-none">"</span><p className="text-xl relative z-10">{content.text}</p>{content.author && <cite className="block text-right mt-4 not-italic text-pm-gold font-bold">— {content.author}</cite>}</blockquote>;
      case 'image': return <figure className="my-12"><img src={content.src} alt={content.alt} className="w-full h-auto object-cover rounded-sm shadow-2xl shadow-black/50" />{content.caption && <figcaption className="mt-4 text-sm text-center text-gray-500 italic">{content.caption}</figcaption>}</figure>;
      default: return null;
    }
  };

  return (
    <>
      <SEO title={article.title} description={article.excerpt} image={article.imageUrl} schema={articleSchema} />
      <ReadingProgress />

      <div className="bg-black text-white py-24 min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/magazine" className="inline-flex items-center gap-2 text-pm-gold mb-12 hover:underline tracking-widest uppercase text-xs font-bold">
            <ArrowLeftIcon className="w-4 h-4" /> Retour au Magazine
          </Link>

          <article className="animate-fadeIn">
            <header className="text-center mb-16">
              <span className="inline-block px-3 py-1 bg-pm-gold/10 text-pm-gold text-xs font-bold uppercase tracking-[0.2em] mb-6 rounded-full border border-pm-gold/20">{article.category}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white mb-8 leading-tight">{article.title}</h1>
              <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium">
                <span>Par <span className="text-white">{article.author}</span></span>
                <span className="w-1 h-1 bg-pm-gold rounded-full"></span>
                <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span className="w-1 h-1 bg-pm-gold rounded-full"></span>
                <span className="flex items-center gap-1.5"><EyeIcon className="w-4 h-4" /> {article.viewCount || 0}</span>
              </div>
            </header>

            <div className="w-full aspect-video mb-16 relative overflow-hidden group rounded-lg shadow-2xl shadow-pm-gold/10">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-headings:font-playfair prose-headings:text-pm-gold prose-p:text-gray-300 prose-a:text-pm-gold prose-strong:text-white">
              {safeContent.map((contentBlock, index) => <div key={index}>{renderContent(contentBlock)}</div>)}
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-4">
                <button onClick={() => handleReaction('like')} disabled={!!userReaction} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-colors ${userReaction === 'like' ? 'bg-pm-gold text-black border-pm-gold' : 'border-white/20 hover:border-pm-gold hover:text-pm-gold'}`}>
                  <HandThumbUpIcon className="w-5 h-5" /> J'aime ({article.reactions?.likes || 0})
                </button>
                <button onClick={() => handleReaction('dislike')} disabled={!!userReaction} className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border transition-colors ${userReaction === 'dislike' ? 'bg-white/10 text-white border-transparent' : 'border-white/20 hover:bg-white/5'}`}>
                  <HandThumbDownIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mr-2">Partager</span>
                <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-pm-gold hover:text-black transition-colors"><FacebookIcon className="w-5 h-5" /></a>
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-pm-gold hover:text-black transition-colors"><TwitterIcon className="w-5 h-5" /></a>
                <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-pm-gold hover:text-black transition-colors"><WhatsAppIcon className="w-5 h-5" /></a>
              </div>
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-3">
                {article.tags.map(tag => <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400 hover:text-pm-gold transition-colors">#{tag}</span>)}
              </div>
            )}
          </article>

          <section className="mt-24 pt-16 border-t border-white/10">
            <h2 className="text-3xl font-playfair text-white mb-10">Espace de Discussion ({comments.length})</h2>

            <div className="bg-white/5 p-8 rounded-lg mb-12 border border-white/10">
              <form onSubmit={handleCommentSubmit} className="space-y-6">
                <h3 className="font-playfair text-xl text-white">Laisser un commentaire</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Votre nom"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="col-span-1 bg-black/50 border border-white/10 text-white px-6 py-4 rounded focus:outline-none focus:border-pm-gold transition-colors"
                  />
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 text-white px-6 py-4 rounded focus:outline-none focus:border-pm-gold transition-colors resize-none"
                  placeholder="Votre message..."
                  required
                />
                <div className="text-right">
                  <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-pm-gold text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-white transition-colors disabled:opacity-50">
                    {isSubmitting ? 'Publication...' : 'Publier'}
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-8">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex gap-6 animate-fadeIn">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-pm-gold">
                        <UserCircleIcon className="w-8 h-8" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-bold text-white text-lg">{comment.authorName}</h4>
                        <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed bg-white/5 p-4 rounded-r-lg rounded-bl-lg">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 bg-white/5 rounded-lg border border-white/10 border-dashed">
                  <p>Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;