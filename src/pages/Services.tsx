import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';

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

    if (!data) return <div className="min-h-screen bg-pm-dark"></div>;

    return (
        <div className="bg-pm-dark text-pm-off-white min-h-screen">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services conçus pour répondre aux besoins des créateurs, marques, et particuliers. Réservez directement depuis notre site."
                image={data?.siteImages.about}
            />

            <ParallaxHero
                image={data.siteImages.about}
                title="Nos Services"
                subtitle="Une expertise complète pour tous vos projets de mode et d'événementiel."
                height="h-[60vh]"
            />

            <div className="page-container -mt-20 relative z-20">
                <FadeIn className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-10 shadow-2xl">
                    <div className="text-center mb-10">
                        <p className="text-lg text-pm-off-white/80 max-w-3xl mx-auto">
                            Découvrez l’ensemble de nos services conçus pour répondre aux besoins des créateurs, marques, entreprises et particuliers.
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div role="tablist" aria-label="Catégories de services" className="flex justify-center flex-wrap gap-4 mb-12">
                        {categoryOrder.map(category => (
                            servicesByCategory[category] && (
                                <button
                                    key={category}
                                    role="tab"
                                    aria-selected={activeCategory === category}
                                    id={`tab-${String(category).replace(/\s+/g, '-')}`}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeCategory === category ? 'bg-pm-gold text-pm-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-pm-off-white/70 hover:bg-white/10 hover:text-white'}`}
                                >
                                    {category}
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
                                    id={`tabpanel-${String(category).replace(/\s+/g, '-')}`}
                                    role="tabpanel"
                                    aria-labelledby={`tab-${String(category).replace(/\s+/g, '-')}`}
                                    hidden={activeCategory !== category}
                                    className={`${activeCategory === category ? 'block' : 'hidden'}`}
                                >
                                    {activeCategory === category && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {servicesByCategory[category].map((service, index) => (
                                                <FadeIn key={index} delay={index * 0.1}>
                                                    <ServiceCard service={service} />
                                                </FadeIn>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default Services;
