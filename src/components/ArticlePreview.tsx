import React from 'react';
import { Article } from '../types';

interface Props {
  article: Article;
}

const ArticlePreview: React.FC<Props> = ({ article }) => (
  <article className="prose prose-invert max-w-none">
    <h1 className="text-3xl font-playfair text-pm-gold">{article.title}</h1>
    <p className="text-pm-off-white/60 text-sm">{article.category} — {article.date}</p>
    {article.imageUrl && (
      <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover my-4" />
    )}
    <p className="text-pm-off-white/80 italic">{article.excerpt}</p>
    <div className="mt-6 space-y-4">
      {Array.isArray(article.content) && article.content.map((block: any, i: number) => {
        if (block.type === 'paragraph') return <p key={i} className="text-pm-off-white/80">{block.text}</p>;
        if (block.type === 'heading') return <h2 key={i} className="text-xl font-bold text-pm-gold">{block.text}</h2>;
        if (block.type === 'quote') return <blockquote key={i} className="border-l-4 border-pm-gold pl-4 italic text-pm-off-white/70">{block.text}</blockquote>;
        return null;
      })}
    </div>
  </article>
);

export default ArticlePreview;
