import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ArticleContent, ArticleComment, Article } from '../../types';
import { ChevronLeftIcon, UserCircleIcon, EyeIcon, HandThumbUpIcon, HandThumbDownIcon, XMarkIcon, CheckIcon, ClipboardDocumentIcon, ArrowDownTrayIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from '../components/SocialIcons';
import html2canvas from 'html2canvas';

const generateArticleHtml = (article: Article, siteConfig: any): string => {
    const renderContentHtml = (content: ArticleContent): string => {
        switch (content.type) {
            case 'heading': return `<h2 style="font-family: 'Times New Roman', Times, serif; font-size: 22px; color: #D4AF37; margin: 24px 0 12px 0; font-weight: bold;">${content.text}</h2>`;
            case 'paragraph': return `<p style="margin-bottom: 1em; line-height: 1.6;">${content.text}</p>`;
            case 'quote': return `<blockquote style="margin: 1.5em 0; padding: 1em; border-left: 4px solid #D4AF37; background-color: #f9f9f9; font-style: italic;"><p>"${content.text}"</p>${content.author ? `<cite style="display: block; text-align: right; margin-top: 0.5em; font-style: normal;">— ${content.author}</cite>` : ''}</blockquote>`;
            case 'image': return `<figure style="margin: 24px 0;"><img src="${content.src}" alt="${content.alt}" style="width: 100%; height: auto; border-radius: 4px;" />${content.caption ? `<figcaption style="font-size: 12px; text-align: center; color: #777; margin-top: 8px;">${content.caption}</figcaption>` : ''}</figure>`;
            default: return '';
        }
    };

    const contentHtml = (Array.isArray(article.content) ? article.content : []).map(renderContentHtml).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${article.title}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.5; background-color: #fff; }
                .page { max-width: 800px; margin: auto; padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #ccc; padding-bottom: 16px; margin-bottom: 24px; }
                .header img { height: 60px; }
                .category { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #D4AF37; font-weight: bold; }
                h1 { font-family: 'Times New Roman', Times, serif; font-size: 40px; color: #111; margin: 8px 0; }
                .meta { font-size: 12px; color: #888; }
                .main-image { width: 100%; height: auto; margin: 24px 0; }
                .content { font-size: 16px; text-align: justify; }
                .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ccc; text-align: center; font-size: 12px; color: #aaa; }
            </style>
        </head>
        <body>
            <div class="page">
                <header class="header">
                    <div>
                        <p class="category">${article.category}</p>
                        <h1>${article.title}</h1>
                        <p class="meta">Par ${article.author} • ${new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                     ${siteConfig?.logo ? `<img src="${siteConfig.logo}" alt="Logo" />` : ''}
                </header>
                <img src="${article.imageUrl}" alt="${article.title}" class="main-image" />
                <div class="content">${contentHtml}</div>
                <footer class="footer">&copy; ${new Date().getFullYear()} Perfect Models Management - Focus Model 241</footer>
            </div>
        </body>
        </html>
    `;
};

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, saveData, isInitialized } = useData();
  const [newComment, setNewComment] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'image' | null>(null);
  const articleRef = useRef<HTMLElement>(null);


  const article = data?.articles.find(a => a.slug === slug);
  
  useEffect(() => {
    if (!slug || !data || !article) return;
    
    const reactions = JSON.parse(localStorage.getItem('article_reactions') || '{}');
    if (reactions[slug]) setUserReaction(reactions[slug]);

    const incrementViewCount = async () => {
      const viewedArticles: string[] = JSON.parse(localStorage.getItem('viewed_articles') || '[]');
      if (!viewedArticles.includes(slug)) {
          const articleIndex = data.articles.findIndex(a => a.slug === slug);
          if (articleIndex === -1) return;

          const updatedArticle = { ...data.articles[articleIndex], viewCount: (data.articles[articleIndex].viewCount || 0) + 1 };
          const updatedArticles = [...data.articles];
          updatedArticles[articleIndex] = updatedArticle;
          
          await saveData({ ...data, articles: updatedArticles });
          localStorage.setItem('viewed_articles', JSON.stringify([...viewedArticles, slug]));
      }
    };

    incrementViewCount();
  }, [slug, data, isInitialized, saveData, article]);

  const comments = data?.articleComments
    .filter(c => c.articleSlug === slug)
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
    const updatedComments = [...data.articleComments, commentData];
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
    if (userReaction || !data || !article) return;
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

  const handleDownloadPdf = () => {
    if (!article || !data?.siteConfig) return;
    setIsDownloading('pdf');
    const htmlContent = generateArticleHtml(article, data.siteConfig);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
            setIsDownloading(null);
        }, 250);
    } else {
        alert("Veuillez autoriser les pop-ups pour imprimer l'article.");
        setIsDownloading(null);
    }
  };

  const handleDownloadImage = async () => {
    const element = articleRef.current;
    if (!element || !article) return;
    setIsDownloading('image');
    try {
        const canvas = await html2canvas(element, { useCORS: true, backgroundColor: '#000000', scale: 2 });
        const link = document.createElement('a');
        link.download = `${article.slug}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (error) {
        console.error("Erreur lors de la génération de l'image:", error);
        alert("Une erreur est survenue lors de la création de l'image.");
    } finally {
        setIsDownloading(null);
    }
  };

  if (!isInitialized) return <div className="min-h-screen bg-pm-dark"></div>;
  if (!article) return <NotFound />;
  
  const safeContent = Array.isArray(article.content) ? article.content : [];
  
  const articleSchema = {
      "@context": "https://schema.org", "@type": "NewsArticle", "headline": article.title,
      "image": [article.imageUrl, ...safeContent.filter(c => c.type === 'image').map(c => (c as { src: string }).src)],
      "datePublished": new Date(article.date).toISOString(),
      "author": [{"@type": "Organization", "name": article.author, "url": window.location.origin}],
      "publisher": {"@type": "Organization", "name": "Perfect Models Management", "logo": {"@type": "ImageObject", "url": data?.siteConfig.logo}},
      "description": article.excerpt
  };
  
  const articleUrl = window.location.href;
  const shareTitle = `Découvrez l'article : "${article.title}" sur Perfect Models Management`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(shareTitle);

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(`Salut ! Je voulais te partager cet article : "${article.title}". Tu peux le lire ici : ${articleUrl}`)}`;

  const renderContent = (content: ArticleContent) => {
    switch (content.type) {
      case 'heading': return content.level === 2 ? <h2 className="text-3xl font-playfair text-pm-gold mt-8 mb-4">{content.text}</h2> : <h3 className="text-2xl font-playfair text-pm-gold mt-6 mb-3">{content.text}</h3>;
      case 'paragraph': return <p className="mb-4 leading-relaxed">{content.text}</p>;
      case 'quote': return <blockquote className="my-6 p-4 border-l-4 border-pm-gold bg-black/50 italic"><p className="text-xl">"{content.text}"</p>{content.author && <cite className="block text-right mt-2 not-italic text-pm-off-white/70">— {content.author}</cite>}</blockquote>;
      case 'image': return <figure className="my-8"><img src={content.src} alt={content.alt} className="w-full h-auto object-cover rounded-lg" />{content.caption && <figcaption className="mt-2 text-sm text-center text-pm-off-white/60">{content.caption}</figcaption>}</figure>;
      default: return null;
    }
  };

  return (
    <>
      <SEO title={article.title} description={article.excerpt} keywords={article.tags?.join(', ')} image={article.imageUrl} schema={articleSchema} />
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link to="/magazine" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline"><ChevronLeftIcon className="w-5 h-5" />Retour au Magazine</Link>
          <article ref={articleRef} className="bg-black p-4 sm:p-8 border border-pm-gold/20">
            <header>
              <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
              <h1 className="text-4xl lg:text-5xl font-playfair text-pm-off-white my-4 leading-tight">{article.title}</h1>
              <div className="text-sm text-pm-off-white/60 flex items-center gap-4 flex-wrap">
                <span>Par {article.author}</span><span>•</span>
                <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span><span>•</span>
                <span className="flex items-center gap-1.5"><EyeIcon className="w-4 h-4" /> {article.viewCount || 0} vues</span>
              </div>
            </header>
            <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover my-8" />
            <div className="prose prose-invert prose-lg max-w-none text-pm-off-white/80">{safeContent.map((contentBlock, index) => <div key={index}>{renderContent(contentBlock)}</div>)}</div>
            <div className="mt-12 pt-6 border-t border-pm-gold/20 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => handleReaction('like')} disabled={!!userReaction} aria-pressed={userReaction === 'like'} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${userReaction === 'like' ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'border-pm-off-white/50 hover:bg-pm-dark'}`}><HandThumbUpIcon className="w-5 h-5" /> J'aime ({article.reactions?.likes || 0})</button>
                    <button onClick={() => handleReaction('dislike')} disabled={!!userReaction} aria-pressed={userReaction === 'dislike'} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${userReaction === 'dislike' ? 'bg-pm-gold text-pm-dark border-pm-gold' : 'border-pm-off-white/50 hover:bg-pm-dark'}`}><HandThumbDownIcon className="w-5 h-5" /> Je n'aime pas ({article.reactions?.dislikes || 0})</button>
                </div>
                <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span className="text-sm font-bold text-pm-off-white/70 mr-2">Partager:</span>
                    <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager sur Facebook">
                        <FacebookIcon className="w-6 h-6" />
                    </a>
                    <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager sur Twitter">
                        <TwitterIcon className="w-6 h-6" />
                    </a>
                    <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager sur WhatsApp">
                        <WhatsAppIcon className="w-6 h-6" />
                    </a>
                     <a href={emailShareUrl} className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors" aria-label="Partager par email">
                        <EnvelopeIcon className="w-6 h-6" />
                    </a>
                    <div className="h-6 w-px bg-pm-gold/20 mx-2 hidden sm:block"></div>
                    <button onClick={handleDownloadPdf} disabled={!!isDownloading} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors border-pm-off-white/50 hover:bg-pm-dark disabled:opacity-50"><ArrowDownTrayIcon className="w-5 h-5" />{isDownloading === 'pdf' ? '...' : 'PDF'}</button>
                    <button onClick={handleDownloadImage} disabled={!!isDownloading} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border transition-colors border-pm-off-white/50 hover:bg-pm-dark disabled:opacity-50"><ArrowDownTrayIcon className="w-5 h-5" />{isDownloading === 'image' ? '...' : 'Image'}</button>
                </div>
            </div>
            {article.tags && article.tags.length > 0 && (
              <footer className="mt-8 pt-6 border-t border-pm-gold/20">
                <p className="font-bold text-pm-off-white mb-2">Tags :</p><div className="flex flex-wrap gap-2">{article.tags.map(tag => <span key={tag} className="px-3 py-1 bg-pm-dark border border-pm-off-white/20 text-xs rounded-full">{tag}</span>)}</div>
              </footer>
            )}
          </article>
          <section className="mt-12 pt-8 border-t border-pm-gold/20">
            <h2 className="text-3xl font-playfair text-pm-gold mb-6">Espace de Discussion ({comments.length})</h2>
            <div className="bg-black p-6 border border-pm-gold/10 rounded-lg mb-8">
                <form onSubmit={handleCommentSubmit} className="space-y-4">
                  <h3 className="font-bold text-lg mb-2">Laisser un commentaire</h3>
                  <input type="text" placeholder="Votre nom (optionnel)" value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} className="admin-input" />
                  <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={4} className="admin-input admin-textarea" placeholder="Votre message..." required />
                  <div className="text-right"><button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white disabled:opacity-50">{isSubmitting ? 'Publication...' : 'Publier'}</button></div>
                </form>
            </div>
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map(comment => <div key={comment.id} className="flex items-start gap-4"><UserCircleIcon className="w-10 h-10 text-pm-gold/30 flex-shrink-0" aria-hidden="true" /><div className="flex-grow bg-black p-4 border border-pm-off-white/10 rounded-lg"><div className="flex justify-between items-center text-sm mb-2"><p className="font-bold text-pm-off-white">{comment.authorName}</p><p className="text-xs text-pm-off-white/50">{new Date(comment.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</p></div><p className="text-pm-off-white/80 whitespace-pre-wrap">{comment.content}</p></div></div>)
              ) : (<p className="text-center text-pm-off-white/60 py-8">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>)}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;