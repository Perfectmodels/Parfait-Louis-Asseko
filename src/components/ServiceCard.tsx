
import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import {
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon,
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon,
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, HeartIcon,
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon
} from '@heroicons/react/24/solid';

const iconMap: { [key: string]: React.ElementType } = {
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon,
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;

    const cardContent = (
        <div className="relative p-8 flex flex-col h-full text-left overflow-hidden bg-black/50 rounded-2xl border border-pm-gold/20">
            {service.isComingSoon && (
                 <div className="absolute top-0 right-0 px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold uppercase tracking-wider">
                    Bientôt
                </div>
            )}
            
            <div className="mb-6">
                <div className="w-16 h-16 bg-pm-gold/10 rounded-xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-pm-gold" />
                </div>
            </div>

            <div className="flex-grow">
                <h3 className="text-2xl font-playfair font-bold text-white mb-3">{service.title}</h3>
                <p className="text-pm-off-white/70 leading-relaxed">{service.description}</p>
            </div>

            <div className="mt-8">
                <div className={`flex items-center gap-3 font-semibold text-sm ${service.isComingSoon ? 'text-pm-off-white/50' : 'text-pm-gold'}`}>
                    <span>{service.isComingSoon ? 'Indisponible' : 'En savoir plus'}</span>
                    {!service.isComingSoon && <ArrowRightIcon className="w-4 h-4" />}
                </div>
            </div>
        </div>
    );

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="h-full"
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {service.isComingSoon ? (
                <div className="h-full cursor-not-allowed">{cardContent}</div>
            ) : (
                <Link to={`/services/${service.slug}`} className="h-full block">
                    {cardContent}
                </Link>
            )}
        </motion.div>
    );
};

export default ServiceCard;
