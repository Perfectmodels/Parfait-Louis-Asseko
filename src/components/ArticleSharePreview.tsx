import React from 'react';
import { Article } from '../types';

interface ArticleSharePreviewProps {
  article: Article;
  className?: string;
}

const ArticleSharePreview: React.FC<ArticleSharePreviewProps> = ({ article, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden max-w-md ${className}`}>
      {/* Image principale */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-pm-gold text-pm-dark px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full">
              {article.category}
            </span>
          </div>
        </div>
      )}
      
      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {article.excerpt}
        </p>
        
        {/* Métadonnées */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>focusmodel241.ga</span>
          <span>{new Date(article.publishDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleSharePreview;
