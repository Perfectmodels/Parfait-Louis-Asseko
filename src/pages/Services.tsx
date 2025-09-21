
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import EnhancedServiceCard from '../components/EnhancedServiceCard';
import FloatingCart from '../components/FloatingCart';
import { CartProvider } from '../contexts/CartContext';
import PublicPageLayout from '../components/PublicPageLayout';
import { SparklesIcon } from '@heroicons/react/24/outline';

const ServicesContent: React.FC = () => {
    const { data } = useData();
    const services = data?.agencyServices || [];

    const servicesByCategory = useMemo(() => services.reduce((acc, service) => {
        const category = service.category || 'Services Premium';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
    }, {} as Record<string, Service[]>), [services]);

    const categoryOrder = useMemo(() => ['Services Mannequinat', 'Services Mode et Stylisme', 'Services Événementiels', 'Services Premium'], []);
    
    const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);

    return (
        <PublicPageLayout
            title="Nos Services"
            subtitle="Découvrez nos prestations premium conçues pour transformer votre vision en réalité. Réservez en ligne avec notre système moderne et sécurisé."
            heroImage={data?.siteImages.servicesHero}
            callToAction={{ text: "Demander un devis personnalisé", link: "/contact" }}
        >
            <div className="space-y-16">
                {/* Services Section */}
                <div>
                    <div className="flex justify-center mb-12">
                        <div className="bg-black/30 border border-pm-gold/20 rounded-full p-2 shadow-lg backdrop-blur-sm">
                            {categoryOrder.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-3 text-sm rounded-full font-semibold transition-all duration-300 ${
                                        activeCategory === category ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'
                                    }`}>
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesByCategory[activeCategory]?.map((service, index) => (
                            <EnhancedServiceCard key={service.id || index} service={service} index={index} />
                        ))}
                    </div>

                    {(!servicesByCategory[activeCategory] || servicesByCategory[activeCategory].length === 0) && (
                        <div className="text-center py-20 col-span-full">
                            <div className="w-24 h-24 bg-pm-gold/10 border-2 border-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SparklesIcon className="w-12 h-12 text-pm-gold/50" />
                            </div>
                            <h3 className="text-2xl font-bold text-pm-off-white">Bientôt disponible</h3>
                            <p className="text-pm-off-white/70 mt-2">De nouveaux services pour cette catégorie seront bientôt dévoilés.</p>
                        </div>
                    )}
                </div>
            </div>
            <FloatingCart />
        </PublicPageLayout>
    );
};

const Services: React.FC = () => (
    <CartProvider>
        <ServicesContent />
    </CartProvider>
);

export default Services;
