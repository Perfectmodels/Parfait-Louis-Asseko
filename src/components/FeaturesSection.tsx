import React from 'react';
import { motion } from 'framer-motion';
import { 
    UserGroupIcon, 
    AcademicCapIcon, 
    CameraIcon, 
    SparklesIcon,
    CheckBadgeIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: UserGroupIcon,
            title: "Mannequins Professionnels",
            description: "Une sélection rigoureuse de talents aux profils variés, formés aux standards internationaux.",
            color: "text-blue-400"
        },
        {
            icon: AcademicCapIcon,
            title: "Formation Complète",
            description: "Programmes de formation personnalisés pour développer les compétences et la confiance.",
            color: "text-green-400"
        },
        {
            icon: CameraIcon,
            title: "Production Créative",
            description: "Équipe de production expérimentée pour des shootings de qualité professionnelle.",
            color: "text-purple-400"
        },
        {
            icon: SparklesIcon,
            title: "Événements Exclusifs",
            description: "Perfect Fashion Day et autres événements pour mettre en valeur nos talents.",
            color: "text-pink-400"
        },
        {
            icon: CheckBadgeIcon,
            title: "Accompagnement Sur Mesure",
            description: "Services personnalisés pour répondre à tous vos besoins créatifs et commerciaux.",
            color: "text-yellow-400"
        },
        {
            icon: HeartIcon,
            title: "Passion & Excellence",
            description: "Notre engagement pour promouvoir la beauté gabonaise sur la scène internationale.",
            color: "text-red-400"
        }
    ];

    return (
        <section className="py-20 bg-gradient-to-b from-black to-pm-dark relative z-20">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-playfair text-pm-gold mb-6">
                        Pourquoi Choisir Perfect Models ?
                    </h2>
                    <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto">
                        Nous combinons expertise, créativité et passion pour offrir des services 
                        de mannequinat d'exception au Gabon.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 h-full hover:border-pm-gold/40 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`p-3 rounded-xl bg-pm-gold/10 ${feature.color}`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-playfair text-pm-off-white group-hover:text-pm-gold transition-colors">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-pm-off-white/70 leading-relaxed">
                                    {feature.description}
                                </p>
                                
                                {/* Hover Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
