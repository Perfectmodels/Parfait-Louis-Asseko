
import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';

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


    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services conçus pour répondre aux besoins des créateurs, marques, et particuliers. Réservez directement depuis notre site."
                image={data?.siteImages.about}
            />
            <div className="page-container">
                <h1 className="page-title">Nos Services sur Mesure</h1>
                <p className="page-subtitle">
                    Découvrez l’ensemble de nos services conçus pour répondre aux besoins des créateurs, marques, entreprises et particuliers. Chaque service peut être réservé directement depuis notre site.
                </p>
                
                 {/* Tab Navigation */}
                <div role="tablist" aria-label="Catégories de services" className="flex justify-center flex-wrap gap-2 sm:gap-4 border-b border-pm-gold/20 mb-12">
                    {categoryOrder.map(category => (
                        servicesByCategory[category] && (
                             <button
                                key={category}
                                role="tab"
                                aria-selected={activeCategory === category}
                                // FIX: Cast category to string before calling replace to resolve type errors.
                                aria-controls={`tabpanel-${String(category).replace(/\s+/g, '-')}`}
                                // FIX: Cast category to string before calling replace to resolve type errors.
                                id={`tab-${String(category).replace(/\s+/g, '-')}`}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors relative focus-style-self focus-visible:bg-pm-gold/10 ${activeCategory === category ? 'text-pm-gold' : 'text-pm-off-white/70 hover:text-pm-gold'}`}
                            >
                                {category}
                                {activeCategory === category && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-pm-gold"/>}
                            </button>
                        )
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {categoryOrder.map(category => (
                        servicesByCategory[category] && (
                            <div
                                key={category}
                                // FIX: Cast category to string before calling replace to resolve type errors.
                                id={`tabpanel-${String(category).replace(/\s+/g, '-')}`}
                                role="tabpanel"
                                // FIX: Cast category to string before calling replace to resolve type errors.
                                aria-labelledby={`tab-${String(category).replace(/\s+/g, '-')}`}
                                hidden={activeCategory !== category}
                                className={`animate-fade-in ${activeCategory === category ? 'block' : 'hidden'}`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {servicesByCategory[category].map((service, index) => (
                                        <ServiceCard key={index} service={service} />
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
