import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Service } from '../types';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, HeartIcon,
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon, ArrowRightIcon
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon,
  UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon
};

interface EnhancedServiceCardProps {
  service: Service;
  index?: number;
}

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({ service, index = 0 }) => {
  const Icon = iconMap[service.icon] || HeartIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group h-full"
    >
      <div className="relative bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 h-full flex flex-col hover:border-pm-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/10">
        {/* Coming Soon Badge */}
        {service.isComingSoon && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-pm-gold/20 text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50 backdrop-blur-sm">
              Bientôt disponible
            </span>
          </div>
        )}

        {/* Icon */}
        <div className="flex-shrink-0 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-8 h-8 text-pm-gold" aria-hidden="true" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow">
          <h3 className="text-2xl font-playfair text-pm-gold mb-4 group-hover:text-white transition-colors">
            {service.title}
          </h3>
          <p className="text-pm-off-white/80 mb-6 leading-relaxed">
            {service.description}
          </p>
        </div>

        {/* Service Details */}
        {service.duration && (
          <div className="mb-6">
            <div className="text-sm text-pm-off-white/70">
              <span className="font-semibold">Durée :</span> {service.duration}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-auto pt-6">
          <Link 
            to={`/services/${service.slug}`}
            className={`group/btn inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-md ${
              service.isComingSoon 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                : 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 shadow-pm-gold/20 group-hover:shadow-pm-gold/30'
            }`}
          >
            <span>Voir les détails</span>
            {!service.isComingSoon && (
              <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            )}
          </Link>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default EnhancedServiceCard;
