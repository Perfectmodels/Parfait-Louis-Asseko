import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, HeartIcon, 
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon, ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';


const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon,
  UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon, ClipboardDocumentListIcon
};

const ServiceListItem: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;

    return (
        <div className="bg-gradient-to-br from-black to-pm-dark border border-pm-gold/20 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start transform transition-all duration-300 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/10 hover:translate-y-[-5px]">
            <div className="flex-shrink-0 bg-gradient-to-br from-pm-dark to-black p-5 rounded-full border border-pm-gold/50 mt-1 shadow-lg shadow-pm-gold/10">
                <Icon className="w-12 h-12 text-pm-gold" />
            </div>
            <div className="flex-grow">
                <h3 className="text-3xl font-playfair text-pm-gold mb-4 relative">{service.title} <span className="absolute -bottom-2 left-0 w-16 h-[2px] bg-pm-gold/30"></span></h3>
                <p className="text-pm-off-white/90 leading-relaxed mb-5 text-lg">{service.description}</p>
                
                {service.details && (
                    <div className="mb-8 mt-6 bg-black/50 p-5 rounded-md border-l-4 border-pm-gold backdrop-blur-sm">
                        <h4 className="font-bold text-pm-gold mb-3 text-lg">{service.details.title}</h4>
                        <ul className="list-disc list-inside space-y-2 text-pm-off-white/80">
                            {service.details.points.map((point, index) => (
                                <li key={index} className="pl-2">{point}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="mt-6">
                    <Link 
                        to={service.buttonLink}
                        className="inline-block px-10 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
                    >
                        {service.buttonText || "Réserver ce service"}
                    </Link>
                </div>
            </div>
        </div>
    );
};

const Services: React.FC = () => {
    const { data, isInitialized } = useData();
    const services = data?.agencyServices || [];
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isGrid, setIsGrid] = useState(false);

    // Get unique categories
    const categories = Array.from(new Set(services.map(s => s.category)));
    
    // Log pour déboguer les données des services
    React.useEffect(() => {
        if (isInitialized) {
            setIsLoading(false);
            if (services.length === 0) {
                const errorMsg = 'Aucun service trouvé. Vérifiez la connexion à la base de données.';
                console.error(errorMsg);
                setError(errorMsg);
            } else {
                setError(null);
            }
        }
    }, [services, isInitialized]);
    
    if (isLoading) {
        return (
            <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold mx-auto mb-4"></div>
                    <p>Chargement des services en cours...</p>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
                <div className="text-center p-6 max-w-md mx-auto">
                    <div className="text-pm-gold text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Erreur de chargement</h2>
                    <p className="mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-pm-gold/90 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    // Filter services based on search term and selected category
    const filteredServices = services.filter(service => {
        if (!service) return false;
        
        const matchesSearch = searchTerm === '' || 
                            (service.title && service.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = !selectedCategory || 
                              (service.category && service.category === selectedCategory);
        
        return matchesSearch && matchesCategory;
    });

    // Group services by category
    const servicesByCategory = filteredServices.reduce((acc, service) => {
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

    return (
        <div className="bg-gradient-to-b from-pm-dark to-black text-pm-off-white">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services conçus pour répondre aux besoins des créateurs, marques, et particuliers. Réservez directement depuis notre site."
                image={data?.siteImages.about}
            />
            <div className="py-24 container mx-auto px-6">
                <h1 className="section-title mb-12">Expertise & Excellence</h1>
                <p className="text-center text-pm-off-white/80 max-w-3xl mx-auto mb-16 text-lg leading-relaxed">
                    Perfect Models Management vous propose une gamme complète de services professionnels, conçus avec précision pour répondre aux exigences des créateurs, marques, entreprises et particuliers. Notre expertise dans l'industrie de la mode et du mannequinat nous permet d'offrir des solutions sur mesure qui valorisent votre image et concrétisent vos projets avec excellence.
                </p>
                
                <div className="space-y-20">
                    {categoryOrder.map((category, categoryIndex) => (
                        servicesByCategory[category] && (
                             <section key={category} className={`animate-on-scroll delay-${categoryIndex * 100}`}>
                                <h2 className="text-4xl font-playfair text-pm-gold text-center mb-12 relative after:content-[''] after:absolute after:w-24 after:h-1 after:bg-pm-gold/50 after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">{category}</h2>
                                <p className="text-center text-pm-off-white/70 max-w-3xl mx-auto mb-10 italic">
                                    {category === 'Services Mannequinat' && "Notre expertise en mannequinat vous offre un accompagnement personnalisé pour valoriser votre image et développer votre carrière."}
                                    {category === 'Services Mode et Stylisme' && "Nos services de mode et stylisme transforment vos concepts créatifs en réalités visuelles captivantes et professionnelles."}
                                    {category === 'Services Événementiels' && "Nous organisons des événements exclusifs qui mettent en valeur votre marque et créent des expériences mémorables pour votre public."}
                                </p>
                                <div className="space-y-10">
                                    {servicesByCategory[category].map((service, index) => (
                                        <div key={index} className={`animate-on-scroll delay-${index * 150}`}>
                                            <ServiceListItem service={service} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;