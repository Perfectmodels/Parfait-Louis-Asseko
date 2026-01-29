import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types';
import { 
    UsersIcon, BriefcaseIcon, CameraIcon, AcademicCapIcon, 
    SparklesIcon, PresentationChartLineIcon, BuildingStorefrontIcon, 
    HeartIcon
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  "UsersIcon": UsersIcon,
  "UserGroupIcon": UsersIcon,
  "AcademicCapIcon": AcademicCapIcon,
  "SparklesIcon": SparklesIcon,
  "CameraIcon": CameraIcon,
  "BuildingStorefrontIcon": BuildingStorefrontIcon,
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    
    return (
        <Link 
            to={service.buttonLink}
            className="group relative flex flex-col h-[450px] p-12 bg-transparent hover:bg-pm-gold/5 transition-all duration-700 border border-white/5"
        >
            <div className="flex-shrink-0 mb-10">
                <Icon className="w-14 h-14 text-pm-gold/30 group-hover:text-pm-gold group-hover:scale-110 transition-all duration-700" strokeWidth={1} />
            </div>
            <div className="flex-grow">
                <h3 className="text-3xl font-playfair font-bold text-white group-hover:text-pm-gold transition-colors duration-700 mb-8 leading-tight">{service.title}</h3>
                <p className="text-sm text-white/30 leading-relaxed max-w-xs group-hover:text-white/60 transition-colors duration-700">{service.description}</p>
            </div>
            <div className="mt-auto overflow-hidden">
                 <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pm-gold translate-y-0 group-hover:translate-x-4 transition-transform duration-700 block">
                    Discovery
                 </span>
            </div>
            
            {/* Background Aesthetic */}
            <div className="absolute -bottom-10 -right-10 text-[15rem] font-playfair font-black opacity-[0.01] group-hover:opacity-[0.03] transition-opacity duration-1000 pointer-events-none italic select-none">
                {service.title.charAt(0)}
            </div>
        </Link>
    );
};

export default ServiceCard;