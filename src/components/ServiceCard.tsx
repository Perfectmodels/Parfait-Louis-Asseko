import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, HeartIcon,
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon,
  UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    return (
        <div className="relative card-base p-6 md:p-7 flex flex-col h-full text-left">
            {service.isComingSoon && (
                <span className="absolute top-4 right-4 bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                    Bientôt disponible
                </span>
            )}
            <div className="flex-shrink-0 mb-3">
                <Icon className="w-10 h-10 text-pm-gold" aria-hidden="true" />
            </div>
            <div className="flex-grow">
                <h3 className="text-xl font-playfair text-pm-gold mb-2">{service.title}</h3>
                <p className="text-pm-off-white/80 mb-4 text-sm leading-relaxed">{service.description}</p>
            </div>
            <div className="mt-auto pt-6">
                <Link 
                    to={service.isComingSoon ? '#' : `/services/${service.slug}`}
                    className={`inline-block px-6 py-2.5 font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 shadow-md ${
                        service.isComingSoon 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                        : 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 shadow-pm-gold/20'
                    }`}
                    aria-disabled={service.isComingSoon}
                    onClick={e => { if (service.isComingSoon) e.preventDefault(); }}
                >
                    {service.isComingSoon ? 'Bientôt' : 'Voir les détails'}
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;
