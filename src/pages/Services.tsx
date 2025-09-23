import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';
import EnhancedServiceCard from '../components/EnhancedServiceCard';

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
            
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-pm-dark via-black to-pm-dark overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-5xl md:text-6xl font-playfair text-pm-gold mb-6">
                        Nos Services sur Mesure
                    </h1>
                    <p className="text-xl text-pm-off-white/80 max-w-4xl mx-auto mb-8">
                        Découvrez l'ensemble de nos services conçus pour répondre aux besoins des créateurs, marques, entreprises et particuliers. Chaque service peut être réservé directement depuis notre site.
                    </p>
                    
                    {/* Service Categories Count */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pm-gold">{Object.keys(servicesByCategory).length}</div>
                            <div className="text-pm-off-white/70">Catégories</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pm-gold">{services.length}</div>
                            <div className="text-pm-off-white/70">Services</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pm-gold">100%</div>
                            <div className="text-pm-off-white/70">Personnalisé</div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="page-container">
                
                 {/* Tab Navigation */}
                <div role="tablist" aria-label="Catégories de services" className="flex justify-center flex-wrap gap-2 sm:gap-4 border-b border-pm-gold/20 mb-12">
                    {categoryOrder.map(category => (
                        servicesByCategory[category] && (
                             <button
                                key={category}
                                role="tab"
                                aria-selected={activeCategory === category}
                                aria-controls={`tabpanel-${category.replace(/\s+/g, '-')}`}
                                id={`tab-${category.replace(/\s+/g, '-')}`}
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
                                id={`tabpanel-${category.replace(/\s+/g, '-')}`}
                                role="tabpanel"
                                aria-labelledby={`tab-${category.replace(/\s+/g, '-')}`}
                                hidden={activeCategory !== category}
                                className={`animate-fade-in ${activeCategory === category ? 'block' : 'hidden'}`}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {servicesByCategory[category].map((service, index) => (
                                        <EnhancedServiceCard key={index} service={service} index={index} />
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