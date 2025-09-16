import React from 'react';
import { Article } from '../types';
import { CalendarDaysIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

interface ArticlePreviewProps {
  article: Article;
  featured?: boolean;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ article, featured = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <article className={`group ${featured ? 'lg:col-span-2' : ''}`}>
      <Link 
        to={`/magazine/${article.slug}`}
        className="block h-full bg-pm-dark/50 border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-all duration-300 hover:shadow-2xl hover:shadow-pm-gold/10"
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark/80 via-transparent to-transparent" />
          
          {/* Badge catégorie */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold uppercase tracking-wider rounded-full">
              {article.category}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Métadonnées */}
          <div className="flex items-center gap-4 text-sm text-pm-off-white/60 mb-3">
            <div className="flex items-center gap-1">
              <CalendarDaysIcon className="w-4 h-4" />
              <span>{formatDate(article.publishDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
          </div>

          {/* Titre */}
          <h3 className={`font-playfair text-pm-gold mb-3 group-hover:text-white transition-colors ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            {article.title}
          </h3>

          {/* Extrait */}
          <p className="text-pm-off-white/80 leading-relaxed mb-4">
            {truncateText(article.excerpt, featured ? 200 : 120)}
          </p>

          {/* Lire la suite */}
          <div className="flex items-center gap-2 text-pm-gold group-hover:text-white transition-colors">
            <span className="text-sm font-medium">Lire la suite</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ArticlePreview;
