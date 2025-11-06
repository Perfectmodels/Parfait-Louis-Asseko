
import React from 'react';
import { Article, ArticleContent } from '../../types';

interface ArticlePreviewProps {
    article: Article;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {

    const renderContent = (content: ArticleContent, index: number) => {
        switch (content.type) {
            case 'heading':
                return content.level === 2 
                    ? <h2 key={index} className="text-3xl font-playfair text-pm-gold mt-8 mb-4">{content.text}</h2> 
                    : <h3 key={index} className="text-2xl font-playfair text-pm-gold mt-6 mb-3">{content.text}</h3>;
            case 'paragraph':
                return <p key={index} className="mb-4 leading-relaxed">{content.text}</p>;
            case 'quote':
                return (
                    <blockquote key={index} className="my-6 p-4 border-l-4 border-pm-gold bg-black/50 italic">
                        <p className="text-xl">"{content.text}"</p>
                        {content.author && <cite className="block text-right mt-2 not-italic text-pm-off-white/70">— {content.author}</cite>}
                    </blockquote>
                );
            case 'image':
                return (
                    <figure key={index} className="my-8">
                        <img src={content.src} alt={content.alt} className="w-full h-auto object-cover rounded-lg" />
                        {content.caption && <figcaption className="mt-2 text-sm text-center text-pm-off-white/60">{content.caption}</figcaption>}
                    </figure>
                );
            default:
                return null;
        }
    };
    
    const safeContent = Array.isArray(article.content) ? article.content : [];

    return (
        <article className="bg-black p-4 sm:p-8">
            <header>
                <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{article.category}</p>
                <h1 className="text-4xl lg:text-5xl font-playfair text-pm-off-white my-4 leading-tight">{article.title}</h1>
                <div className="text-sm text-pm-off-white/60 flex items-center gap-4 flex-wrap">
                    <span>Par {article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
            </header>
            
            {article.imageUrl && <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover my-8" />}

            <div className="prose prose-invert prose-lg max-w-none text-pm-off-white/80">
                {safeContent.map((contentBlock, index) => renderContent(contentBlock, index))}
            </div>

            {article.tags && article.tags.length > 0 && (
                <footer className="mt-8 pt-6 border-t border-pm-gold/20">
                    <p className="font-bold text-pm-off-white mb-2">Tags :</p>
                    <div className="flex flex-wrap gap-2">
                        {article.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-pm-dark border border-pm-off-white/20 text-xs rounded-full">{tag}</span>
                        ))}
                    </div>
                </footer>
            )}
        </article>
    );
};

export default ArticlePreview;
