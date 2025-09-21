import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import EnhancedServiceCard from '../components/EnhancedServiceCard';
import FloatingCart from '../components/FloatingCart';
import { CartProvider } from '../contexts/CartContext';
import { 
  SparklesIcon, 
  StarIcon, 
  ShieldCheckIcon,
  ClockIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const ServicesContent: React.FC = () => {
    const { data } = useData();
    const services = data?.agencyServices || [];
    const testimonialsCount = data?.testimonials?.length || 0;

    const servicesByCategory = useMemo(() => services.reduce((acc, service) => {
        const category = service.category || 'Services Premium';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, Service[]>), [services]);

    const categoryOrder: (keyof typeof servicesByCategory)[] = useMemo(() => [
        'Services Mannequinat',
        'Services Mode et Stylisme',
        'Services Événementiels',
        'Services Premium'
    ], []);
    
    const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO
                title="Nos Services Premium | PMM - Excellence & Innovation"
                description="Découvrez nos services premium de mannequinat, mode et événementiel. Réservez en ligne avec notre système de commande moderne et sécurisé."
                image={data?.siteImages.about}
            />
            
            {/* Hero Section */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-pm-gold via-yellow-400 to-orange-400"
                style={{ 
                    backgroundImage: data?.siteImages?.servicesHero ? `url(${data.siteImages.servicesHero})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundBlendMode: 'overlay'
                }}
            >
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative container mx-auto px-4 py-20">
                    <div className="text-center text-white">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <SparklesIcon className="w-5 h-5" />
                            <span className="text-sm font-semibold">Services Premium</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Excellence & 
                            <span className="block bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                                Innovation
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                            Découvrez nos services premium conçus pour transformer votre vision en réalité. 
                            Commandez en ligne avec notre système moderne et sécurisé.
                        </p>
                        
                        {/* Stats dynamiques */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">{testimonialsCount}+</div>
                                <div className="text-white/80">Clients satisfaits</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">{services.length}+</div>
                                <div className="text-white/80">Services disponibles</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-2">24/7</div>
                                <div className="text-white/80">Support client</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-16 bg-black/20 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-pm-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheckIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-pm-off-white mb-2">Garantie Qualité</h3>
                            <p className="text-pm-off-white/70">Services certifiés avec garantie de satisfaction</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-pm-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ClockIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-pm-off-white mb-2">Livraison Rapide</h3>
                            <p className="text-pm-off-white/70">Résultats dans les délais convenus</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-pm-gold to-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <TrophyIcon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-pm-off-white mb-2">Excellence</h3>
                            <p className="text-pm-off-white/70">Standards professionnels élevés</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="py-16 bg-black/10 backdrop-blur-sm">
                <div className="container mx-auto px-4">
                    {/* Category Navigation */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-black/40 backdrop-blur-sm border border-pm-gold/20 rounded-2xl p-2 shadow-lg">
                            {categoryOrder.map((category) => (
                             <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                        activeCategory === category
                                            ? 'bg-gradient-to-r from-pm-gold to-yellow-400 text-white shadow-lg'
                                            : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-black/20'
                                    }`}
                            >
                                {category}
                            </button>
                            ))}
                        </div>
                    </div>

                    {/* Services Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {servicesByCategory[activeCategory]?.map((service, index) => (
                            <EnhancedServiceCard key={service.id || index} service={service} index={index} />
                    ))}
                </div>

                    {(!servicesByCategory[activeCategory] || servicesByCategory[activeCategory].length === 0) && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-pm-gold/20 border border-pm-gold/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SparklesIcon className="w-12 h-12 text-pm-gold" />
                            </div>
                            <h3 className="text-2xl font-bold text-pm-off-white mb-4">Aucun service disponible</h3>
                            <p className="text-pm-off-white/70">Cette catégorie sera bientôt disponible avec de nouveaux services.</p>
                        </div>
                    )}
                                </div>
                            </div>

            {/* CTA Section */}
            <div className="py-16 bg-gradient-to-r from-pm-gold to-yellow-400">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Prêt à transformer votre vision ?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Contactez-nous pour une consultation personnalisée et découvrez comment nos services peuvent vous aider.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="bg-white text-pm-gold px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
                        >
                            Nous contacter
                        </a>
                        <a
                            href="/formations"
                            className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-pm-gold transition-colors"
                        >
                            Découvrir nos formations
                        </a>
                </div>
            </div>
        </div>

            {/* Floating Cart */}
            <FloatingCart />
        </div>
    );
};

const Services: React.FC = () => {
    return (
        <CartProvider>
            <ServicesContent />
        </CartProvider>
    );
};

export default Services;
