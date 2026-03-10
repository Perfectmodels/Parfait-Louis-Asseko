import React from 'react';
import { Article } from '../types';

interface ArticlePreviewProps {
  article: Article;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article }) => {
  return (
    <div className="bg-pm-dark p-6 text-white rounded shadow-lg overflow-y-auto max-h-[70vh]">
      <h2 className="text-3xl font-playfair font-black text-pm-gold mb-4">{article.title}</h2>
      <p className="text-sm text-gray-400 mb-6">{article.excerpt}</p>
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} className="w-full h-auto object-cover mb-6 rounded" />
      )}
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
};

export default ArticlePreview;