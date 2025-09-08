import React from 'react';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    isFeatured?: boolean;
    slug?: string;
  };
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-pm-dark-light rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col group">
      <div className="relative pb-[60%] overflow-hidden">
        <img 
          src={event.image || '/placeholder-event.jpg'} 
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {event.isFeatured && (
          <div className="absolute top-4 right-4 bg-pm-gold text-pm-dark font-bold text-xs uppercase tracking-wider px-3 py-1 rounded-full">
            À la une
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div className="text-pm-off-white">
            <p className="text-sm font-medium">{event.location}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center text-pm-gold text-sm font-medium mb-3">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate} • {formattedTime}
        </div>
        
        <h3 className="text-xl font-playfair font-bold text-pm-off-white mb-3 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-pm-off-white/70 mb-4 line-clamp-3 flex-grow">
          {event.description}
        </p>
        
        <div className="mt-auto pt-4 border-t border-pm-gold/20">
          <Link 
            to={`/evenements/${event.slug || event.id}`}
            className="inline-flex items-center text-pm-gold font-medium hover:text-white transition-colors group"
          >
            En savoir plus
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

export default EventCard;
