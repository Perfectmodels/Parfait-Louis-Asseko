import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, CameraIcon, GlobeAltIcon, HeartIcon, ScaleIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Service } from '../types';

const iconMap: { [key: string]: React.ElementType } = {
  UserGroupIcon, AcademicCapIcon, CameraIcon, SparklesIcon, ScaleIcon, GlobeAltIcon
};

const ServiceDetail: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    return (
        <div className="bg-black p-8 border border-pm-gold/10 flex flex-col md:flex-row items-center gap-8 rounded-lg shadow-lg">
            <div className="flex-shrink-0 text-center">
                <Icon className="w-20 h-20 text-pm-gold mx-auto mb-4" />
            </div>
            <div className="flex-grow text-center md:text-left">
                <h3 className="text-3xl font-playfair text-pm-gold mb-3">{service.title}</h3>
                <p className="text-pm-off-white/80 mb-6">{service.description}</p>
                <Link 
                    to={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-md shadow-pm-gold/20"
                >
                    Demander un devis
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
                        Nous offrons une gamme complète de services pour répondre aux besoins spécifiques de nos clients et pour assurer le développement de carrière de nos mannequins.
                    </p>
                </div>
                
                <div className="space-y-8 max-w-5xl mx-auto">
                    {services.map((service, index) => (
                        <ServiceDetail key={index} service={service} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;