import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import { Link } from 'react-router-dom';
import { 
    SparklesIcon, 
    UserGroupIcon, 
    CalendarIcon, 
    CheckCircleIcon,
    ArrowRightIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

const Services: React.FC = () => {
    const { data } = useData();
    const services = data?.agencyServices || [];

    const servicesByCategory = services.reduce((acc, service) => {
        const category = service.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    const categoryOrder: (keyof typeof servicesByCategory)[] = [
        'Services Mannequinat',
        'Services Mode et Stylisme',
        'Services Événementiels'
    ];
    
    const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);

    const categoryIcons: Record<string, React.ElementType> = {
        'Services Mannequinat': UserGroupIcon,
        'Services Mode et Stylisme': SparklesIcon,
        'Services Événementiels': CalendarIcon
    };

    const categoryDescriptions: Record<string, string> = {
        'Services Mannequinat': 'Des mannequins professionnels pour vos projets photo, vidéo et défilés.',
        'Services Mode et Stylisme': 'Création, stylisme et coaching pour sublimer votre image.',
        'Services Événementiels': 'Organisation d\'événements mode sur mesure et gestion complète.'
    };

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services conçus pour répondre aux besoins des créateurs, marques, et particuliers. Réservez directement depuis notre site."
                image={data?.siteImages.about}
            />

            {/* Hero Section */}
            <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                {/* Background avec effet parallax */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-pm-dark to-black"></div>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-pm-gold/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pm-gold/20 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
                </div>

                <div className="relative z-10 container mx-auto px-6 text-center py-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/30 rounded-full mb-6 animate-fade-up">
                        <SparklesIcon className="w-5 h-5 text-pm-gold" />
                        <span className="text-sm text-pm-gold font-semibold uppercase tracking-wider">Excellence & Professionnalisme</span>
                    </div>

                    <h1 className="page-title mb-6">
                        Nos Services<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pm-gold to-white">
                            sur Mesure
                        </span>
                    </h1>
                    
                    <p className="page-subtitle max-w-3xl mx-auto">
                        De la sélection de mannequins au coaching personnalisé, en passant par l'organisation d'événements mode, 
                        nous mettons notre expertise au service de vos ambitions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-fade-up" style={{animationDelay: '0.3s'}}>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-pm-gold via-yellow-400 to-pm-gold bg-size-200 bg-pos-0 hover:bg-pos-100 text-black font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-pm-gold/50"
                        >
                            <EnvelopeIcon className="w-5 h-5" />
                            Demander un Devis
                        </Link>
                        <a
                            href={`tel:${data?.contactInfo?.phone}`}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-pm-off-white/5 border-2 border-pm-gold/30 text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold/10 hover:border-pm-gold transition-all duration-300"
                        >
                            <PhoneIcon className="w-5 h-5" />
                            Appelez-nous
                        </a>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="container mx-auto px-6 py-20">
                {/* Category Navigation */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex flex-wrap gap-3 p-2 bg-black/50 border border-pm-gold/20 rounded-2xl">
                        {categoryOrder.map(category => {
                            const Icon = categoryIcons[category] || SparklesIcon;
                            return servicesByCategory[category] && (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`group relative px-6 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 ${
                                        activeCategory === category
                                            ? 'bg-gradient-to-r from-pm-gold via-yellow-400 to-pm-gold text-black shadow-lg shadow-pm-gold/30'
                                            : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="w-5 h-5" />
                                        {category}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Category Description */}
                <div className="text-center mb-12 animate-fade-in">
                    <p className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mx-auto">
                        {categoryDescriptions[activeCategory]}
                    </p>
                </div>

                {/* Services Grid */}
                <div className="relative">
                    {categoryOrder.map(category => (
                        servicesByCategory[category] && (
                            <div
                                key={category}
                                className={`transition-all duration-500 ${
                                    activeCategory === category ? 'block animate-fade-up' : 'hidden'
                                }`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {servicesByCategory[category].map((service, index) => (
                                        <div
                                            key={index}
                                            className="group relative bg-gradient-to-br from-black via-pm-dark to-black border border-pm-gold/30 rounded-2xl overflow-hidden hover:border-pm-gold transition-all duration-500 hover:shadow-2xl hover:shadow-pm-gold/20 hover:-translate-y-2"
                                            style={{animationDelay: `${index * 0.1}s`}}
                                        >
                                            {/* Background overlay animé */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                            <div className="relative p-8">
                                                {/* Icon & Title */}
                                                <div className="flex items-start gap-4 mb-6">
                                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-pm-gold/20 to-pm-gold/5 border border-pm-gold/30 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                        <span className="text-3xl">{service.icon || '✨'}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-2xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pm-gold to-yellow-300 mb-2 group-hover:from-yellow-300 group-hover:to-pm-gold transition-all duration-300">
                                                            {service.title}
                                                        </h3>
                                                        <p className="text-pm-off-white/60 text-sm">
                                                            {service.category}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <p className="text-pm-off-white/80 leading-relaxed mb-6">
                                                    {service.description}
                                                </p>

                                                {/* Features */}
                                                {service.features && service.features.length > 0 && (
                                                    <div className="space-y-2 mb-6">
                                                        {service.features.slice(0, 4).map((feature, idx) => (
                                                            <div key={idx} className="flex items-start gap-3">
                                                                <CheckCircleIcon className="w-5 h-5 text-pm-gold flex-shrink-0 mt-0.5" />
                                                                <span className="text-sm text-pm-off-white/70">{feature}</span>
                                                            </div>
                                                        ))}
                                                        {service.features.length > 4 && (
                                                            <p className="text-xs text-pm-gold/70 ml-8">
                                                                +{service.features.length - 4} autre{service.features.length > 5 ? 's' : ''} avantage{service.features.length > 5 ? 's' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Price & CTA */}
                                                <div className="flex items-center justify-between pt-6 border-t border-pm-gold/20">
                                                    {service.price && (
                                                        <div>
                                                            <p className="text-sm text-pm-off-white/60 mb-1">À partir de</p>
                                                            <p className="text-2xl font-bold text-pm-gold">
                                                                {service.price}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <Link
                                                        to={`/services/${service.id}`}
                                                        className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold/10 border border-pm-gold/30 text-pm-gold font-semibold rounded-lg hover:bg-pm-gold hover:text-black transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pm-gold/30"
                                                    >
                                                        En savoir plus
                                                        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/10 via-transparent to-pm-gold/10"></div>
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pm-gold/20 rounded-full blur-[150px]"></div>
                </div>

                <div className="relative container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-pm-gold to-yellow-300 mb-6">
                        Un Projet en Tête ?
                    </h2>
                    <p className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mx-auto mb-10">
                        Contactez-nous pour discuter de vos besoins et obtenir un devis personnalisé. 
                        Notre équipe est à votre écoute pour concrétiser vos ambitions.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pm-gold via-yellow-400 to-pm-gold bg-size-200 bg-pos-0 hover:bg-pos-100 text-black font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-700 hover:scale-110 hover:shadow-2xl hover:shadow-pm-gold/60"
                    >
                        <SparklesIcon className="w-6 h-6" />
                        Contactez-nous Maintenant
                        <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Services;
