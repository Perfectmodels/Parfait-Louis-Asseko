import React from 'react';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
    slug: string;
  };
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  return (
    <div className="bg-pm-dark-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <div className="relative pb-[60%] overflow-hidden">
        <img 
          src={news.image || '/placeholder-news.jpg'} 
          alt={news.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <span className="inline-block px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold uppercase tracking-wider rounded-full">
            {news.category || 'Actualité'}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-pm-gold text-sm font-medium mb-2">
          {new Date(news.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        
        <h3 className="text-xl font-playfair font-bold text-pm-off-white mb-3 line-clamp-2">
          {news.title}
        </h3>
        
        <p className="text-pm-off-white/70 mb-4 line-clamp-3 flex-grow">
          {news.excerpt}
        </p>
        
        <div className="mt-auto pt-4 border-t border-pm-gold/20">
          <Link 
            to={`/actualites/${news.slug || news.id}`}
            className="inline-flex items-center text-pm-gold font-medium hover:text-white transition-colors group"
          >
            Lire la suite
            <svg 
              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
