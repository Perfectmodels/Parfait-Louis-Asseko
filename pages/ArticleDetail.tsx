import React, { useState } from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ArticleContent, ArticleComment } from '../types';
import { ChevronLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const ArticleDetail: React.FC = () => {
  const { slug } = ReactRouterDOM.useParams<{ slug: string }>();
  const { data, saveData, isInitialized } = useData();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const article = data?.articles.find(a => a.slug === slug);
  const comments = data?.articleComments
    .filter(c => c.articleSlug === slug)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  const userRole = sessionStorage.getItem('classroom_role');
  const userId = sessionStorage.getItem('userId');
  const isLoggedInModel = userRole === 'model' && userId;
  const model = data?.models.find(m => m.id === userId);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isLoggedInModel || !model || !data || !article) return;

    setIsSubmitting(true);
    const commentData: ArticleComment = {
      id: Date.now().toString(),
      articleSlug: article.slug,
      authorName: model.name,
      createdAt: new Date().toISOString(),
      content: newComment,
    };

    const updatedComments = [...data.articleComments, commentData];
    try {
      await saveData({ ...data, articleComments: updatedComments });
      setNewComment('');
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Une erreur est survenue lors de la publication du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!article) {
    return <NotFound />;
  }
  
  const renderContent = (content: ArticleContent) => {
    switch (content.type) {
      case 'heading':
        return content.level === 2 ? (
          <h2 className="text-3xl font-playfair text-pm-gold mt-8 mb-4">{content.text}</h2>
        ) : (
          <h3 className="text-2xl font-playfair text-pm-gold mt-6 mb-3">{content.text}</h3>
        );
      case 'paragraph':
        return <p className="mb-4 leading-relaxed">{content.text}</p>;
      case 'quote':
        return (
          <blockquote className="my-6 p-4 border-l-4 border-pm-gold bg-black/50 italic">
            <p className="text-xl">"{content.text}"</p>
            {content.author && <cite className="block text-right mt-2 not-italic text-pm-off-white/70">— {content.author}</cite>}
          </blockquote>
        );
      case 'image':
        return (
          <figure className="my-8">
            <img src={content.src} alt={content.alt} className="w-full h-auto object-cover rounded-lg" />
            {content.caption && <figcaption className="mt-2 text-sm text-center text-pm-off-white/60">{content.caption}</figcaption>}
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt}
        keywords={article.tags?.join(', ')}
        image={article.imageUrl}
      />
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          <ReactRouterDOM.Link to="/magazine" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Magazine
          </ReactRouterDOM.Link>

          <article className="bg-black p-4 sm:p-8 border border-pm-gold/20">
            <header>
              <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
              <h1 className="text-4xl lg:text-5xl font-playfair text-pm-off-white my-4 leading-tight">{article.title}</h1>
              <div className="text-sm text-pm-off-white/60 flex items-center gap-4">
                <span>Par {article.author}</span>
                <span>•</span>
                <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </header>
            
            <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover my-8" />
            
            <div className="prose prose-invert prose-lg max-w-none text-pm-off-white/80">
              {article.content.map((contentBlock, index) => (
                <div key={index}>{renderContent(contentBlock)}</div>
              ))}
            </div>

            {article.tags && article.tags.length > 0 && (
              <footer className="mt-12 pt-8 border-t border-pm-gold/20">
                <p className="font-bold text-pm-off-white mb-2">Tags :</p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-pm-dark border border-pm-off-white/20 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </footer>
            )}
          </article>

          {/* Comments Section */}
          <section className="mt-12 pt-8 border-t border-pm-gold/20">
            <h2 className="text-3xl font-playfair text-pm-gold mb-6">Espace de Discussion</h2>
            
            <div className="bg-black p-6 border border-pm-gold/10 rounded-lg mb-8">
              {isLoggedInModel ? (
                <form onSubmit={handleCommentSubmit}>
                  <h3 className="font-bold text-lg mb-2">Laisser un commentaire en tant que {model?.name}</h3>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="admin-input admin-textarea"
                    placeholder="Votre message..."
                    required
                  />
                  <div className="text-right mt-4">
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white disabled:opacity-50">
                      {isSubmitting ? 'Publication...' : 'Publier'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center p-4">
                  <p className="text-pm-off-white/70">
                    <ReactRouterDOM.Link to="/login" className="text-pm-gold underline">Connectez-vous</ReactRouterDOM.Link> en tant que mannequin pour laisser un commentaire.
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id} className="flex items-start gap-4">
                    <UserCircleIcon className="w-10 h-10 text-pm-gold/30 flex-shrink-0" />
                    <div className="flex-grow bg-black p-4 border border-pm-off-white/10 rounded-lg">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <p className="font-bold text-pm-off-white">{comment.authorName}</p>
                        <p className="text-xs text-pm-off-white/50">{new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <p className="text-pm-off-white/80 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-pm-off-white/60 py-8">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;