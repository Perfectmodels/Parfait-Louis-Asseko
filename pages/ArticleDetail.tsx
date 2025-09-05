import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { ArticleContent } from '../types';
import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, WhatsAppIcon, TikTokIcon } from '../components/icons/SocialIcons';


const ArticleDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { slug } = useParams<{ slug: string }>();
  const [isCopied, setIsCopied] = useState(false);
  
  const article = data?.articles.find(a => a.slug === slug);

  if (!isInitialized) {
      return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!article) {
    return <NotFound />;
  }
  
  const pageUrl = window.location.href;
  const shareText = `Découvrez cet article de Perfect Models Management : ${article.title}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

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
      case 'image':
        return (
          <figure key={index} className="my-8">
            <img src={content.src} alt={content.alt} className="w-full h-auto object-cover rounded-md border-2 border-pm-gold/50 p-1" />
            {content.caption && <figcaption className="text-center text-sm italic text-pm-off-white/70 mt-2">{content.caption}</figcaption>}
          </figure>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title={`${article.title} | Focus Model 241`}
        description={article.excerpt}
        keywords={`${article.category}, ${article.title}, magazine mode, PMM, ${(article.tags || []).join(', ')}`}
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
          <footer className="mt-12 pt-6 border-t border-pm-gold/20 space-y-8">
            {article.tags && article.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-pm-off-white/80 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-black text-pm-gold text-xs font-semibold rounded-full border border-pm-gold/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
             <div>
                <h3 className="text-lg font-bold text-pm-off-white/80 mb-4">Partager l'article :</h3>
                <div className="flex flex-wrap items-center gap-4">
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/60 hover:text-pm-gold hover:drop-shadow-[0_0_5px_#D4AF37] transition-all" aria-label="Partager sur Facebook">
                        <FacebookIcon />
                    </a>
                    <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/60 hover:text-pm-gold hover:drop-shadow-[0_0_5px_#D4AF37] transition-all" aria-label="Partager sur WhatsApp">
                        <WhatsAppIcon />
                    </a>
                    <button onClick={handleCopy} className="text-pm-off-white/60 hover:text-pm-gold hover:drop-shadow-[0_0_5px_#D4AF37] transition-all flex items-center gap-2" aria-label="Copier le lien pour TikTok">
                        <TikTokIcon />
                        {isCopied && <span className="text-xs text-pm-gold animate-pulse">Copié !</span>}
                    </button>
                </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default ArticleDetail;