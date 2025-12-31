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
        <div className="group relative p-6 md:p-8 flex flex-col h-full text-left bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-pm-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-pm-gold/10 hover:-translate-y-1">

            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

            {service.isComingSoon && (
                <span className="absolute top-4 right-4 bg-black/50 backdrop-blur text-gray-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/10 z-10">
                    Bientôt
                </span>
            )}

            <div className="flex-shrink-0 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-black border border-pm-gold/20 flex items-center justify-center group-hover:scale-110 group-hover:border-pm-gold transition-all duration-500 shadow-lg shadow-black/50">
                    <Icon className="w-8 h-8 text-pm-gold group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
            </div>

            <div className="flex-grow relative z-10">
                <h3 className="text-2xl font-playfair text-white mb-3 group-hover:text-pm-gold transition-colors">{service.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed group-hover:text-gray-300 transition-colors">{service.description}</p>
            </div>

            <div className="mt-auto pt-6 relative z-10">
                <Link 
                    to={service.isComingSoon ? '#' : `/services/${service.slug}`}
                    className={`flex items-center gap-2 font-bold uppercase tracking-widest text-xs transition-all duration-300 ${
                        service.isComingSoon 
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-pm-gold hover:text-white group-hover:translate-x-2'
                    }`}
                    aria-disabled={service.isComingSoon}
                    onClick={e => { if (service.isComingSoon) e.preventDefault(); }}
                >
                    {service.isComingSoon ? 'Indisponible' : 'En savoir plus'}
                    {!service.isComingSoon && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                        </svg>
                    )}
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;
