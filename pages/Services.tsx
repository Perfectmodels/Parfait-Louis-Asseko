import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, 
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon, ClipboardDocumentListIcon,
    ArrowRightIcon, CheckCircleIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon,
  UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon, ClipboardDocumentListIcon,
  ArrowRightIcon, CheckCircleIcon, XMarkIcon, ChevronDownIcon, ChevronUpIcon
};

const ServiceCategoryFilter: React.FC<{ 
  categories: string[]; 
  activeCategory: string;
  onSelectCategory: (category: string) => void 
}> = ({ categories, activeCategory, onSelectCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-6 py-3 text-pm-off-white bg-pm-dark/50 border border-pm-gold/30 rounded-lg hover:bg-pm-dark/80 transition-colors"
      >
        <span>{activeCategory || 'Toutes les catégories'}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-pm-gold" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-pm-gold" />
        )}
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-pm-dark border border-pm-gold/30 rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => {
              onSelectCategory('');
              setIsOpen(false);
            }}
            className={`block w-full text-left px-6 py-3 hover:bg-pm-gold/10 transition-colors ${
              !activeCategory ? 'text-pm-gold font-medium' : 'text-pm-off-white/80'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                onSelectCategory(category);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-6 py-3 hover:bg-pm-gold/10 transition-colors ${
                activeCategory === category ? 'text-pm-gold font-medium' : 'text-pm-off-white/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ServiceListItem: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;

    return (
        <div className="bg-black border border-pm-gold/20 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start transform transition-all duration-300 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/10">
            <div className="flex-shrink-0 bg-pm-dark p-4 rounded-full border border-pm-gold/30 mt-1">
                <Icon className="w-10 h-10 text-pm-gold" />
            </div>
            <div className="flex-grow">
                <h3 className="text-3xl font-playfair text-pm-gold mb-3">{service.title}</h3>
                <p className="text-pm-off-white/80 leading-relaxed mb-4">{service.description}</p>
                
                {service.details && (
                    <div className="mb-6 mt-5 bg-pm-dark/50 p-4 rounded-md border-l-4 border-pm-gold">
                        <h4 className="font-bold text-pm-off-white mb-2">{service.details.title}</h4>
                        <ul className="list-disc list-inside space-y-1 text-pm-off-white/70">
                            {service.details.points.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <Link 
                    to={service.buttonLink}
                    className="inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
                >
                    {service.buttonText}
                </Link>
            </div>
        </div>
    );
};

const Services: React.FC = () => {
    const { data, isInitialized } = useData();
    const services = data?.agencyServices || [];
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Log pour déboguer les données des services
    React.useEffect(() => {
        console.log('Données brutes des services:', data);
        console.log('Services chargés:', services);
        console.log('Nombre de services:', services.length);
        if (services.length > 0) {
            console.log('Premier service:', services[0]);
        }
        
        if (isInitialized) {
            setIsLoading(false);
            if (services.length === 0) {
                setError('Aucun service trouvé. Vérifiez la connexion à la base de données.');
            } else {
                setError(null);
            }
        }
    }, [services, data, isInitialized]);
    
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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isGrid, setIsGrid] = useState(false);

    // Get unique categories
    const categories = Array.from(new Set(services.map(s => s.category)));

    // Filter services based on search term and selected category
    console.log('Filtrage des services avec terme:', searchTerm, 'et catégorie:', selectedCategory);
    const filteredServices = services.filter(service => {
        const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Group services by category
    console.log('Services filtrés:', filteredServices);
    console.log('Catégories disponibles:', categories);
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
        <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black text-pm-off-white">
            <SEO
                title="Nos Services Premium | Perfect Models Management"
                description="Découvrez nos services exclusifs de mannequinat, stylisme et production d'événements. Des solutions sur mesure pour les professionnels et les particuliers."
                image={data?.siteImages.about}
            />
            
            {/* Hero Section */}
            <div className="relative py-24 bg-gradient-to-r from-pm-dark/90 to-black/90 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=1000')] bg-cover bg-center opacity-20"></div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-pm-gold mb-6">
                            Nos Services d'Excellence
                        </h1>
                        <p className="text-xl md:text-2xl text-pm-off-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Des solutions professionnelles sur mesure pour répondre à tous vos besoins en matière de mannequinat, mode et événementiel.
                        </p>
                        
                        {/* Search and Filter */}
                        <div className="max-w-3xl mx-auto mb-12">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-pm-gold/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border border-pm-gold/30 bg-pm-dark/50 text-pm-off-white rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                                        placeholder="Rechercher un service..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-64">
                                    <ServiceCategoryFilter 
                                        categories={categories} 
                                        activeCategory={selectedCategory}
                                        onSelectCategory={setSelectedCategory}
                                    />
                                </div>
                                <button 
                                    onClick={() => setIsGrid(!isGrid)}
                                    className="px-4 py-3 bg-pm-dark/50 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isGrid ? (
                                        <>
                                            <svg className="w-5 h-5 text-pm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                            <span className="hidden sm:inline">Vue en liste</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 text-pm-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                            </svg>
                                            <span className="hidden sm:inline">Vue en grille</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            {(searchTerm || selectedCategory) && (
                                <div className="mt-4 flex items-center justify-center gap-2">
                                    <span className="text-sm text-pm-off-white/70">Filtres actifs :</span>
                                    {searchTerm && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pm-gold/20 text-pm-gold">
                                            {searchTerm}
                                            <button 
                                                onClick={() => setSearchTerm('')}
                                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pm-gold/30 hover:bg-pm-gold/50"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                    {selectedCategory && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pm-gold/20 text-pm-gold">
                                            {selectedCategory}
                                            <button 
                                                onClick={() => setSelectedCategory('')}
                                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pm-gold/30 hover:bg-pm-gold/50"
                                            >
                                                <XMarkIcon className="w-3 h-3" />
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Services List */}
            <div className="relative py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredServices.length === 0 ? (
                        <div className="text-center py-16">
                            <svg className="mx-auto h-16 w-16 text-pm-gold/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-pm-off-white">Aucun service trouvé</h3>
                            <p className="mt-2 text-pm-off-white/60">Essayez de modifier vos critères de recherche ou de réinitialiser les filtres.</p>
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('');
                                }}
                                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pm-dark bg-pm-gold hover:bg-pm-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold"
                            >
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : isGrid ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service, index) => (
                                <ServiceCard key={index} service={service} />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {categoryOrder.map(category => (
                                servicesByCategory[category]?.length > 0 && (
                                    <section key={category} className="mb-16">
                                        <div className="border-b border-pm-gold/30 pb-4 mb-8">
                                            <h2 className="text-3xl font-playfair font-bold text-pm-gold">{category}</h2>
                                            <div className="w-20 h-1 bg-pm-gold mt-2"></div>
                                        </div>
                                        <div className="space-y-8">
                                            {servicesByCategory[category].map((service, index) => (
                                                <ServiceListItem key={index} service={service} />
                                            ))}
                                        </div>
                                    </section>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const Icon = iconMap[service.icon] || HeartIcon;
    
    return (
        <div className="group relative bg-pm-dark/50 border border-pm-gold/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/10">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-pm-dark p-3 rounded-full border border-pm-gold/30">
                        <Icon className="w-8 h-8 text-pm-gold" />
                    </div>
                    <h3 className="ml-4 text-xl font-playfair font-bold text-pm-gold">
                        {service.title}
                    </h3>
                </div>
                
                <p className="text-pm-off-white/80 mb-6 line-clamp-3">
                    {service.description}
                </p>
                
                {service.details && service.details.points.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-pm-off-white/70 mb-2">
                            {service.details.title}:
                        </h4>
                        <ul className="space-y-1">
                            {service.details.points.slice(0, 3).map((point, index) => (
                                <li key={index} className="flex items-start">
                                    <CheckCircleIcon className="flex-shrink-0 w-4 h-4 mt-0.5 text-pm-gold mr-2" />
                                    <span className="text-sm text-pm-off-white/80">{point}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-pm-gold/10">
                    <Link
                        to={service.buttonLink}
                        className="inline-flex items-center text-sm font-medium text-pm-gold hover:text-white group-hover:underline"
                    >
                        {service.buttonText || 'En savoir plus'}
                        <ArrowRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Services;
