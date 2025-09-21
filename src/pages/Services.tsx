import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import EnhancedServiceCard from '../components/EnhancedServiceCard';
import FloatingCart from '../components/FloatingCart';
import { CartProvider } from '../contexts/CartContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

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

    const pageTitle = "Nos Services";
    const pageSubtitle = "Découvrez nos prestations premium conçues pour transformer votre vision en réalité. Réservez en ligne avec notre système moderne et sécurisé.";
    const heroImage = data?.siteImages.servicesHero;

    return (
      <div className=\"bg-pm-dark\">
        <SEO title={pageTitle} description={pageSubtitle} image={heroImage} />

        {/* Hero Section */}
        <div className=\"relative h-[90vh] min-h-[700px] text-white overflow-hidden\">
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className=\"absolute inset-0\"
            >
                <div
                    className=\"absolute inset-0 bg-cover bg-center bg-no-repeat\"
                    style={{ backgroundImage: `url(${heroImage})` }}
                />
                <div className=\"absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent\" />
            </motion.div>
            <div className=\"container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative\">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: \'easeOut\' }}
                    className=\"text-6xl md:text-8xl font-playfair font-bold text-white mb-6\"
                >{pageTitle}</motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: \'easeOut\' }}
                    className=\"text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-8\"
                >{pageSubtitle}</motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: \'easeOut\' }}
                >
                    <Link
                        to=\"/contact\"
                        className=\"inline-flex items-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all shadow-lg hover:shadow-pm-gold/20\"
                    >
                        <span>Demander un devis</span>
                        <ArrowRightIcon className=\"w-5 h-5\" />
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Main Content */}
        <div className=\"container mx-auto px-6 py-20 md:py-28\">
            <div className=\"space-y-16\">
                {/* Services Section */}
                <div>
                    <div className=\"flex justify-center mb-12\">
                        <div className=\"bg-black/30 border border-pm-gold/20 rounded-full p-2 shadow-lg backdrop-blur-sm\">
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

                    <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8\">
                        {servicesByCategory[activeCategory]?.map((service, index) => (
                            <EnhancedServiceCard key={service.id || index} service={service} index={index} />
                        ))}
                    </div>

                    {(!servicesByCategory[activeCategory] || servicesByCategory[activeCategory].length === 0) && (
                        <div className=\"text-center py-20 col-span-full\">
                            <div className=\"w-24 h-24 bg-pm-gold/10 border-2 border-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-6\">
                                <SparklesIcon className=\"w-12 h-12 text-pm-gold/50\" />
                            </div>
                            <h3 className=\"text-2xl font-bold text-pm-off-white\">Bientôt disponible</h3>
                            <p className=\"text-pm-off-white/70 mt-2\">De nouveaux services pour cette catégorie seront bientôt dévoilés.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        <FloatingCart />
      </div>
    );
};

const Services: React.FC = () => (
    <CartProvider>
        <ServicesContent />
    </CartProvider>
);

export default Services;
