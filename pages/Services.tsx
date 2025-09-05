import React from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ServiceCard from '../components/ServiceCard';
import { Link } from 'react-router-dom';

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
                    <h1 className="text-5xl font-playfair text-pm-gold mb-4">Nos Services</h1>
                    <p className="max-w-3xl mx-auto text-pm-off-white/80">
                        De la gestion de carrière à la production d'événements, notre expertise couvre tous les aspects de l'industrie de la mode pour garantir le succès de nos talents et de nos clients.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>

                <section className="mt-24 text-center bg-black p-12 border border-pm-gold/20 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-playfair text-pm-gold mb-4">Prêt à collaborer ?</h2>
                    <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
                        Que vous soyez un talent en devenir ou une marque à la recherche de visages d'exception, nous avons une solution pour vous.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/casting-formulaire" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                            Devenir Mannequin
                        </Link>
                         <Link to="/contact" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                            Booker un Mannequin
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Services;
