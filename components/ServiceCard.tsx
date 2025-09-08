import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, 
    StarIcon, HeartIcon, ClockIcon, CurrencyDollarIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

type ServiceCardVariant = 'default' | 'detailed' | 'compact';

const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon
};

interface ServiceCardProps {
  service: Service;
  variant?: ServiceCardVariant;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  variant = 'default' 
}) => {
  const Icon = iconMap[service.icon] || HeartIcon;
  
  if (variant === 'compact') {
    return (
      <div className="relative group bg-pm-dark-light rounded-xl p-6 transition-all duration-300 hover:bg-pm-dark/80 border border-pm-dark-light hover:border-pm-gold/30 h-full flex flex-col">
        <div className="flex items-start mb-4">
          <div className="p-2 bg-pm-gold/10 rounded-lg mr-4">
            <Icon className="w-6 h-6 text-pm-gold" />
          </div>
          <h3 className="text-lg font-semibold text-pm-off-white mt-1">{service.title}</h3>
        </div>
        <p className="text-pm-off-white/60 text-sm mb-4 flex-grow">{service.description}</p>
        <Link 
          to={service.buttonLink}
          className="text-pm-gold text-sm font-medium hover:underline inline-flex items-center"
        >
          En savoir plus
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="relative bg-pm-dark-light rounded-2xl overflow-hidden h-full flex flex-col group">
        {service.image ? (
          <div className="h-48 overflow-hidden">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-pm-gold/10 to-amber-600/10 flex items-center justify-center">
            <Icon className="w-16 h-16 text-pm-gold/30" />
          </div>
        )}
        
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="p-2 bg-pm-gold/10 rounded-lg mr-3">
                <Icon className="w-5 h-5 text-pm-gold" />
              </div>
              <span className="text-sm font-medium text-pm-gold/80 uppercase tracking-wider">
                {service.category || 'Service'}
              </span>
            </div>
            {service.isPopular && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pm-gold/10 text-pm-gold">
                <StarIcon className="w-3 h-3 mr-1" />
                Populaire
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-playfair font-bold text-pm-off-white mb-3">
            {service.title}
          </h3>
          
          <p className="text-pm-off-white/70 mb-6 flex-grow">
            {service.details || service.description}
          </p>
          
          {(service.features || service.duration || service.price) && (
            <div className="mb-6 space-y-3">
              {service.features?.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-pm-gold/80 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-pm-off-white/80 text-sm">{feature}</span>
                </div>
              ))}
              
              <div className="flex flex-wrap gap-4 pt-2">
                {service.duration && (
                  <div className="flex items-center text-sm text-pm-off-white/60">
                    <ClockIcon className="w-4 h-4 mr-1.5" />
                    {service.duration}
                  </div>
                )}
                {service.price && (
                  <div className="flex items-center text-sm font-medium text-pm-gold">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1.5" />
                    {service.price}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-4 border-t border-pm-gold/10">
            <Link
              to={service.buttonLink}
              className={`inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                service.isComingSoon
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                  : 'bg-pm-gold/10 text-pm-gold hover:bg-pm-gold hover:text-pm-dark hover:shadow-lg hover:shadow-pm-gold/20'
              }`}
            >
              {service.isComingSoon ? 'Bientôt disponible' : service.buttonText || 'En savoir plus'}
              {!service.isComingSoon && (
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="relative bg-pm-dark-light rounded-xl p-8 flex flex-col h-full text-left group hover:shadow-lg hover:shadow-pm-gold/5 transition-all duration-300 border border-pm-dark-light hover:border-pm-gold/20">
      {service.isComingSoon && (
        <span className="absolute top-4 right-4 bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
          Bientôt disponible
        </span>
      )}
      
      <div className="flex-shrink-0 mb-6">
        <div className="w-14 h-14 rounded-xl bg-pm-gold/10 flex items-center justify-center">
          <Icon className="w-7 h-7 text-pm-gold" />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="text-xl font-playfair font-bold text-pm-off-white mb-3">
          {service.title}
        </h3>
        <p className="text-pm-off-white/70 mb-6">
          {service.description}
        </p>
      </div>
      
      <div className="mt-auto pt-2">
        <Link 
          to={service.buttonLink}
          className={`inline-flex items-center px-5 py-2.5 font-medium rounded-lg transition-all duration-300 ${
            service.isComingSoon 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
              : 'bg-pm-gold/10 text-pm-gold hover:bg-pm-gold hover:text-pm-dark hover:shadow-md hover:shadow-pm-gold/20'
          }`}
        >
          {service.isComingSoon ? 'Bientôt disponible' : service.buttonText || 'En savoir plus'}
          {!service.isComingSoon && (
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
