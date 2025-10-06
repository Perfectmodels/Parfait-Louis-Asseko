import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import NotFound from './NotFound';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { CheckCircleIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';

const ServiceDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { data, isInitialized } = useData();

    const service = useMemo(() => {
        return data?.agencyServices.find(s => s.slug === slug);
    }, [data, slug]);

    if (!isInitialized) {
        return <div className="min-h-screen bg-pm-dark"></div>;
    }

    if (!service) {
        return <NotFound />;
    }

    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO
                title={service.title}
                description={service.description}
                keywords={`service ${service.title}, ${service.category}, perfect models management, gabon`}
                image={data?.siteImages.about}
            />
            <div className="page-container">
                <Link to="/services" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour à tous les services
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <div className="p-1 border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg">
                        <img 
                            src={data?.siteImages.about} 
                            alt={`Illustration pour ${service.title}`} 
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div>
                        <p className="text-sm uppercase tracking-widest text-pm-gold font-bold">{service.category}</p>
                        <h1 className="text-4xl md:text-5xl font-playfair text-pm-off-white my-3">{service.title}</h1>
                        <p className="text-lg text-pm-off-white/80 leading-relaxed mb-6">
                            {service.description}
                        </p>

                        {service.details && (
                            <div className="mb-8 mt-6 bg-black/50 p-6 rounded-lg border-l-4 border-pm-gold">
                                <h3 className="text-xl font-bold text-pm-off-white mb-3">{service.details.title}</h3>
                                <ul className="space-y-2">
                                    {service.details.points.map((point, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircleIcon className="w-6 h-6 text-pm-gold flex-shrink-0 mt-0.5" />
                                            <span className="text-pm-off-white/80">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <Link 
                            to={service.buttonLink}
                            className={`inline-block px-10 py-4 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 shadow-lg ${
                                service.isComingSoon 
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                                : 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 shadow-pm-gold/20'
                            }`}
                        >
                            {service.buttonText}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;
