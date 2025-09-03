import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { articles } from '../constants/magazineData';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { ArticleContent } from '../types';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return <NotFound />;
  }
  
  const renderContent = (content: ArticleContent, index: number) => {
    switch (content.type) {
      case 'heading':
        const Tag = `h${content.level}` as keyof JSX.IntrinsicElements;
        return <Tag key={index} className="text-3xl font-playfair text-pm-gold mt-8 mb-4">{content.text}</Tag>;
      case 'paragraph':
        return <p key={index} className="text-pm-off-white/80 leading-relaxed my-4 text-lg">{content.text}</p>;
      case 'quote':
        return (
            <blockquote key={index} className="my-8 p-6 border-l-4 border-pm-gold bg-black text-xl italic text-pm-off-white">
                <p>"{content.text}"</p>
                {content.author && <cite className="block text-right mt-2 text-sm not-italic text-pm-gold/80">- {content.author}</cite>}
            </blockquote>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title={article.title}
        description={article.excerpt}
        keywords={`${article.category}, ${article.title}, magazine mode, PMM`}
        image={article.imageUrl}
      />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/magazine" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
          <ChevronLeftIcon className="w-5 h-5" />
          Retour au Magazine
        </Link>
        <article>
          <header>
            <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
            <h1 className="text-5xl lg:text-6xl font-playfair text-pm-off-white my-4 leading-tight">{article.title}</h1>
            <p className="text-pm-off-white/70">Par {article.author} - {article.date}</p>
            <div className="my-8 w-full aspect-video bg-black border-2 border-pm-gold p-2">
                <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </header>
          <div className="prose prose-invert lg:prose-xl max-w-none">
            {article.content.map(renderContent)}
          </div>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;
