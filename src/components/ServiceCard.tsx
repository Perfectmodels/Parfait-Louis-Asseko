import React from 'react';
import Reveal from './Reveal';
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
        <Reveal className="hover-lift" direction="up">
        <div className="relative card-base p-8 flex flex-col h-full text-left hover-glow">
            {service.isComingSoon && (
                <span className="absolute top-4 right-4 bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                    Bientôt disponible
                </span>
            )}
            <div className="flex-shrink-0 mb-4">
                <Icon className="w-12 h-12 text-pm-gold" aria-hidden="true" />
            </div>
            <div className="flex-grow">
                <h3 className="text-2xl font-playfair text-pm-gold mb-3">{service.title}</h3>
                <p className="text-pm-off-white/80 mb-6">{service.description}</p>
            </div>
            <div className="mt-auto pt-6">
                <Link 
                    to={service.isComingSoon ? '#' : `/services/${service.slug}`}
                    className={`inline-block px-8 py-3 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-md ${
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
        </Reveal>
    );
};

export default ServiceCard;
