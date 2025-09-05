import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ServiceCard from '../components/ServiceCard';

const Services: React.FC = () => {
    const { data, isInitialized } = useData();

    if (!isInitialized || !data) {
        return <div className="min-h-screen bg-pm-dark"></div>;
    }

    const { agencyServices } = data;

    return (
        <div className="bg-pm-dark text-pm-off-white py-20">
            <SEO
                title="Nos Services | Expertise en Management de Mannequins"
                description="Découvrez la gamme complète des services de Perfect Models Management : management de carrière, formation professionnelle, production de contenus, direction événementielle, et plus encore."
                keywords="services agence de mannequins, management mannequin, formation mannequin gabon, production de contenu mode, casting sur mesure"
            />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Nos Services</h1>
                <p className="text-center max-w-3xl mx-auto text-pm-off-white/80 mb-16">
                    Nous offrons un écosystème complet de services pour accompagner les talents, produire des contenus de qualité et créer des événements de mode inoubliables.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {agencyServices.map((service, index) => (
                        <ServiceCard key={index} service={service} />
                    ))}
                </div>

                <section className="mt-24">
                    <div className="text-center bg-black p-12 border border-pm-gold/20">
                        <h2 className="text-3xl font-playfair text-pm-gold mb-4">Prêt à collaborer avec nous ?</h2>
                        <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
                            Que vous soyez une marque, un créateur ou un talent, nous avons la solution pour donner vie à votre vision. Contactez-nous pour discuter de votre projet.
                        </p>
                        <Link to="/contact" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30">
                            Démarrer un Projet
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Services;
