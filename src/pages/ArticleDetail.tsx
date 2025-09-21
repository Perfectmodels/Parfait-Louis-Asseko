
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Article, ArticleContent } from '../types';
import NotFound from './NotFound';
import PublicPageLayout from '../components/PublicPageLayout';
import { CalendarDaysIcon, UserIcon, ArrowLeftIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isInitialized } = useData();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (isInitialized && data?.articles && slug) {
      const foundArticle = data.articles.find(a => a.slug === slug);
      setArticle(foundArticle || null);
    }
  }, [slug, data, isInitialized]);

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!article) {
    return <NotFound />;
  }

  const renderContent = (content: ArticleContent, index: number) => {
    switch (content.type) {
      case 'heading': return <h2 key={index} className="text-3xl font-playfair text-pm-gold mt-10 mb-4">{content.text}</h2>;
      case 'paragraph': return <p key={index} className="text-lg text-pm-off-white/80 leading-relaxed mb-6">{content.text}</p>;
      case 'quote': return (
        <blockquote key={index} className="my-8 p-6 border-l-4 border-pm-gold bg-black/30 italic text-xl text-pm-off-white/90">
          <p>"{content.text}"</p>
          {content.author && <cite className="block text-right mt-4 not-italic text-pm-gold">— {content.author}</cite>}
        </blockquote>
      );
      case 'image': return (
        <figure key={index} className="my-10">
            <img src={content.src} alt={content.alt} className="w-full h-auto object-cover rounded-lg shadow-lg" />
            {content.caption && <figcaption className="mt-3 text-sm text-center text-pm-off-white/60">{content.caption}</figcaption>}
        </figure>
      );
      default: return null;
    }
  };

  return (
    <PublicPageLayout
      title={article.title}
      subtitle={article.excerpt}
      heroImage={article.imageUrl}
    >
      <div className="max-w-3xl mx-auto">
        <article>
            <div className="flex items-center justify-between text-sm text-pm-off-white/70 mb-12 pb-8 border-b border-pm-gold/20">
                <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-pm-gold" />
                    <span>Par <strong>{article.author}</strong></span>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDaysIcon className="w-5 h-5 text-pm-gold" />
                    <span>{new Date(article.publishDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none">
                {(article.content || []).map(renderContent)}
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-pm-gold/20">
                <h3 className="font-semibold text-pm-gold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/40 border border-pm-gold/20 text-sm rounded-full text-pm-off-white/80">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
        </article>

        <div className="mt-16 text-center">
            <Link to="/magazine" className="inline-flex items-center gap-2 text-pm-gold font-semibold text-lg group">
                <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                Retour au Magazine
            </Link>
        </div>

      </div>
    </PublicPageLayout>
  );
};

export default ArticleDetail;
