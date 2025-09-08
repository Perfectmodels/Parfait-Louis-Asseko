import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, CameraIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Service } from '../types';

const iconMap: { [key: string]: React.ElementType } = {
  UserGroupIcon, AcademicCapIcon, CameraIcon, SparklesIcon, ScaleIcon, GlobeAltIcon
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    return (
        <div className="relative card-base p-8 flex flex-col h-full">
            {service.isComingSoon && (
                <span className="absolute top-4 right-4 bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                    Bientôt disponible
                </span>
            )}
            <div className="flex-shrink-0 mb-4">
                <Icon className="w-12 h-12 text-pm-gold" />
            </div>
            <div className="flex-grow">
                <h3 className="text-2xl font-playfair text-pm-gold mb-3 text-left">{service.title}</h3>
                <p className="text-pm-off-white/80 mb-6 text-left">{service.description}</p>
            </div>
            <div className="mt-auto pt-6 text-left">
                <Link 
                    to={!service.isComingSoon ? `/contact?service=${encodeURIComponent(service.title)}` : '#'}
                    onClick={(e) => { if (service.isComingSoon) e.preventDefault(); }}
                    className={`inline-block px-8 py-3 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-md ${
                        service.isComingSoon 
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                        : 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 shadow-pm-gold/20'
                    }`}
                >
                    {service.isComingSoon ? 'En Développement' : 'Demander un devis'}
                </Link>
            </div>
        </div>
    );
};

const Services: React.FC = () => {
    const { data } = useData();
    const services = data?.agencyServices || [];

    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services proposés par Perfect Models Management : gestion de carrière, formation, production de shootings, direction de casting et organisation d'événements mode."
                keywords="services agence mannequin, formation mannequin, production photo mode, casting mannequin, événementiel mode gabon"
                image={data?.siteImages.about}
            />
            <div className="page-container">
                <h1 className="page-title">Nos Services sur Mesure</h1>
                <p className="page-subtitle">
                    De la révélation de talents à la production d'événements d'envergure, notre expertise couvre tous les aspects de l'écosystème de la mode.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
