import React from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { ArticleContent } from '../types';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isInitialized } = useData();

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const article = data?.articles.find(a => a.slug === slug);

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
          <Link to="/magazine" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au Magazine
          </Link>

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
        </div>
      </div>
    </>
  );
};

export default ArticleDetail;
