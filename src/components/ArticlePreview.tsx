import React from 'react';
import { Article } from '../types';

interface Props {
  article: Article;
}

const getYouTubeId = (url: string) => {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};

const ArticlePreview: React.FC<Props> = ({ article }) => (
  <article className="prose prose-invert max-w-none">
    <h1 className="text-3xl font-playfair text-pm-gold">{article.title}</h1>
    <p className="text-pm-off-white/60 text-sm">
      {article.category} — {article.date}
      {article.photographer && <span className="ml-2">· Photo : {article.photographer}</span>}
    </p>
    {article.imageUrl && (
      <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover my-4 rounded-lg" />
    )}
    <p className="text-pm-off-white/80 italic">{article.excerpt}</p>
    <div className="mt-6 space-y-4">
      {Array.isArray(article.content) && article.content.map((block: any, i: number) => {
        if (block.type === 'paragraph') return <p key={i} className="text-pm-off-white/80">{block.text}</p>;
        if (block.type === 'heading') return block.level === 3
          ? <h3 key={i} className="text-lg font-bold text-white">{block.text}</h3>
          : <h2 key={i} className="text-xl font-bold text-pm-gold">{block.text}</h2>;
        if (block.type === 'quote') return (
          <blockquote key={i} className="border-l-4 border-pm-gold pl-4 italic text-pm-off-white/70">
            {block.text}
            {block.author && <cite className="block text-xs mt-1 not-italic text-pm-gold/60">— {block.author}</cite>}
          </blockquote>
        );
        if (block.type === 'image') return (
          <figure key={i} className="my-4">
            <img src={block.src} alt={block.alt} className="w-full rounded-lg object-cover" />
            {block.caption && <figcaption className="text-center text-xs text-pm-off-white/40 mt-2">{block.caption}</figcaption>}
          </figure>
        );
        if (block.type === 'youtube') {
          const vid = getYouTubeId(block.url);
          return vid ? (
            <figure key={i} className="my-4">
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${vid}`}
                  className="w-full h-full"
                  allowFullScreen
                  title={block.caption ?? 'Vidéo'}
                />
              </div>
              {block.caption && <figcaption className="text-center text-xs text-pm-off-white/40 mt-2">{block.caption}</figcaption>}
            </figure>
          ) : null;
        }
        return null;
      })}
    </div>
    {article.brands && article.brands.length > 0 && (
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-pm-off-white/40 uppercase tracking-widest mb-2">Marques citées</p>
        <div className="flex flex-wrap gap-2">
          {article.brands.map((b, i) => <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-full text-pm-off-white/60">{b}</span>)}
        </div>
      </div>
    )}
    {article.tags && article.tags.length > 0 && (
      <div className="mt-4 flex flex-wrap gap-2">
        {article.tags.map((t, i) => <span key={i} className="text-xs text-pm-gold/60">#{t}</span>)}
      </div>
    )}
  </article>
);

export default ArticlePreview;
