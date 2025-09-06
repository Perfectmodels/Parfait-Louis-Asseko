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
        <div className="relative bg-black p-8 border border-pm-gold/20 rounded-lg flex flex-col h-full shadow-lg hover:border-pm-gold hover:-translate-y-2 transition-all duration-300">
            {service.isComingSoon && (
                <span className="absolute top-4 right-4 bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50">
                    Bientôt disponible
                </span>
            )}
            <div className="flex-shrink-0 text-center mb-4">
                <Icon className="w-16 h-16 text-pm-gold mx-auto" />
            </div>
            <div className="flex-grow text-center">
                <h3 className="text-2xl font-playfair text-pm-gold mb-3">{service.title}</h3>
                <p className="text-pm-off-white/80 mb-6">{service.description}</p>
            </div>
            <div className="mt-auto pt-6 text-center">
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
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services proposés par Perfect Models Management : gestion de carrière, formation, production de shootings, direction de casting et organisation d'événements mode."
                keywords="services agence mannequin, formation mannequin, production photo mode, casting mannequin, événementiel mode gabon"
            />
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-playfair text-pm-gold mb-4">Nos Services sur Mesure</h1>
                    <p className="max-w-3xl mx-auto text-pm-off-white/80">
                        De la révélation de talents à la production d'événements d'envergure, notre expertise couvre tous les aspects de l'écosystème de la mode.
                    </p>
                </div>
                
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
