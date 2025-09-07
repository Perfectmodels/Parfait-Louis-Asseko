import React from 'react';
import { Service } from '../types';
import { AcademicCapIcon, CameraIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  UserGroupIcon,
  AcademicCapIcon,
  CameraIcon,
  SparklesIcon,
  ScaleIcon,
  GlobeAltIcon,
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    return (
        <div className="bg-black p-8 text-center border border-transparent transition-all duration-300 hover:border-pm-gold/50 hover:shadow-2xl hover:shadow-pm-gold/10 hover:-translate-y-2 h-full">
            <Icon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
            <h3 className="text-xl font-bold text-pm-gold mb-2">{service.title}</h3>
            <p className="text-pm-off-white/70">{service.description}</p>
        </div>
    );
};

export default ServiceCard;