import React from 'react';
import { NewsItem } from '../types';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface NewsPreviewProps {
  newsItem: NewsItem;
  featured?: boolean;
}

const NewsPreview: React.FC<NewsPreviewProps> = ({ newsItem, featured = false }) => {
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
        to={newsItem.link}
        className="block h-full bg-pm-dark/50 border border-pm-gold/20 rounded-lg overflow-hidden hover:border-pm-gold transition-all duration-300 hover:shadow-2xl hover:shadow-pm-gold/10"
      >
        {/* Image */}
        <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
          <img
            src={newsItem.imageUrl}
            alt={newsItem.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark/80 via-transparent to-transparent" />
          
          {/* Badge actualité */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
              Actualité
            </span>
          </div>

          {/* Date en overlay */}
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
              <CalendarDaysIcon className="w-4 h-4 text-pm-gold" />
              <span className="text-sm text-white font-medium">{formatDate(newsItem.date)}</span>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          {/* Titre */}
          <h3 className={`font-playfair text-pm-gold mb-3 group-hover:text-white transition-colors ${
            featured ? 'text-2xl lg:text-3xl' : 'text-xl'
          }`}>
            {newsItem.title}
          </h3>

          {/* Extrait */}
          <p className="text-pm-off-white/80 leading-relaxed mb-4">
            {truncateText(newsItem.excerpt, featured ? 200 : 120)}
          </p>

          {/* Lire la suite */}
          <div className="flex items-center gap-2 text-pm-gold group-hover:text-white transition-colors">
            <span className="text-sm font-medium">En savoir plus</span>
            <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </article>
  );
};

export default NewsPreview;
