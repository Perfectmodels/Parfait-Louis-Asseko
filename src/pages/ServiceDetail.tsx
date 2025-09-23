import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { agencyServices } from '../constants/data';
import { 
    ArrowLeftIcon,
    CheckCircleIcon,
    StarIcon,
    CalendarIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    PhoneIcon,
    EnvelopeIcon,
    MapPinIcon,
    ShareIcon,
    HeartIcon,
    SparklesIcon,
    AcademicCapIcon,
    PhotoIcon,
    VideoCameraIcon,
    PaintBrushIcon,
    ScissorsIcon,
    BriefcaseIcon,
    IdentificationIcon,
    PresentationChartLineIcon,
    CameraIcon,
    MegaphoneIcon,
    MicrophoneIcon,
    ChatBubbleLeftRightIcon,
    BuildingStorefrontIcon,
    UsersIcon,
    UserGroupIcon as UserGroupIconAlt
} from '@heroicons/react/24/outline';

const ServiceDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);

    useEffect(() => {
        if (slug) {
            const foundService = agencyServices.find(s => s.slug === slug);
            if (foundService) {
                setService(foundService);
            }
            setIsLoading(false);
        }
    }, [slug]);

    const getIcon = (iconName: string) => {
        const iconMap: { [key: string]: React.ElementType } = {
            'UsersIcon': UsersIcon,
            'UserGroupIcon': UserGroupIconAlt,
            'AcademicCapIcon': AcademicCapIcon,
            'VideoCameraIcon': VideoCameraIcon,
            'PhotoIcon': PhotoIcon,
            'IdentificationIcon': IdentificationIcon,
            'ScissorsIcon': ScissorsIcon,
            'BriefcaseIcon': BriefcaseIcon,
            'PaintBrushIcon': PaintBrushIcon,
            'PresentationChartLineIcon': PresentationChartLineIcon,
            'SparklesIcon': SparklesIcon,
            'CameraIcon': CameraIcon,
            'StarIcon': StarIcon,
            'MegaphoneIcon': MegaphoneIcon,
            'MicrophoneIcon': MicrophoneIcon,
            'ChatBubbleLeftRightIcon': ChatBubbleLeftRightIcon,
            'BuildingStorefrontIcon': BuildingStorefrontIcon
        };
        
        const IconComponent = iconMap[iconName] || UsersIcon;
        return <IconComponent className="w-8 h-8" />;
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: service?.title,
                text: service?.description,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Lien copié dans le presse-papiers !');
        }
    };

    const handleContact = () => {
        setShowContactForm(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pm-gold"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-playfair text-pm-gold mb-4">Service non trouvé</h1>
                    <p className="text-pm-off-white mb-8">Le service que vous recherchez n'existe pas.</p>
                    <Link 
                        to="/services" 
                        className="px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                    >
                        Retour aux services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <SEO
                title={`${service.title} - Perfect Models Management`}
                description={service.description}
                keywords={`${service.title}, mannequinat, mode, Gabon, Libreville, ${service.category}`}
            />
            
            <div className="min-h-screen bg-gradient-to-br from-pm-dark via-black to-pm-dark">
                {/* Header avec navigation */}
                <div className="relative bg-black/50 backdrop-blur-sm border-b border-pm-gold/20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigate(-1)}
                                className="flex items-center gap-2 text-pm-gold hover:text-yellow-400 transition-colors duration-200"
                            >
                                <ArrowLeftIcon className="w-5 h-5" />
                                <span>Retour</span>
                            </button>
                            
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsLiked(!isLiked)}
                                    className={`p-2 rounded-full transition-colors duration-200 ${
                                        isLiked 
                                            ? 'bg-red-500/20 text-red-400' 
                                            : 'bg-pm-gold/20 text-pm-gold hover:bg-pm-gold/30'
                                    }`}
                                >
                                    <HeartIcon className="w-5 h-5" />
                                </button>
                                
                                <button
                                    onClick={handleShare}
                                    className="p-2 bg-pm-gold/20 text-pm-gold rounded-full hover:bg-pm-gold/30 transition-colors duration-200"
                                >
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contenu principal */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* En-tête du service */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="bg-black/50 border border-pm-gold/20 rounded-2xl p-8"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="p-4 bg-pm-gold/20 text-pm-gold rounded-2xl">
                                        {getIcon(service.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h1 className="text-3xl font-playfair text-pm-gold">{service.title}</h1>
                                            <span className="px-3 py-1 bg-pm-gold/20 text-pm-gold text-sm font-semibold rounded-full">
                                                {service.category}
                                            </span>
                                        </div>
                                        <p className="text-pm-off-white/80 text-lg mb-4">{service.description}</p>
                                        <div className="flex items-center gap-4 text-sm text-pm-off-white/60">
                                            <div className="flex items-center gap-1">
                                                <StarIcon className="w-4 h-4 text-yellow-400" />
                                                <span>4.9/5</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <UserGroupIcon className="w-4 h-4" />
                                                <span>50+ clients satisfaits</span>
                                            </div>
                                        </div>
                                    </div>
                    </div>
                            </motion.div>

                            {/* Détails du service */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-black/50 border border-pm-gold/20 rounded-2xl p-8"
                            >
                                <h2 className="text-2xl font-playfair text-pm-gold mb-6">Détails du service</h2>

                        {service.details && (
                                    <div className="space-y-6">
                                        {Object.entries(service.details).map(([key, value]) => (
                                            <div key={key}>
                                                <h3 className="text-lg font-semibold text-pm-off-white mb-3 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </h3>
                                                {Array.isArray(value) ? (
                                <ul className="space-y-2">
                                                        {value.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                                                <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                                                <span className="text-pm-off-white/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                                ) : (
                                                    <p className="text-pm-off-white/80">{value as string}</p>
                                                )}
                                            </div>
                                        ))}
                            </div>
                        )}
                            </motion.div>

                            {/* Processus de réservation */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="bg-black/50 border border-pm-gold/20 rounded-2xl p-8"
                            >
                                <h2 className="text-2xl font-playfair text-pm-gold mb-6">Comment réserver</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-pm-gold/20 text-pm-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-xl font-bold">1</span>
                                        </div>
                                        <h3 className="font-semibold text-pm-off-white mb-2">Contactez-nous</h3>
                                        <p className="text-sm text-pm-off-white/60">Remplissez le formulaire de contact ou appelez-nous</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-pm-gold/20 text-pm-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-xl font-bold">2</span>
                                        </div>
                                        <h3 className="font-semibold text-pm-off-white mb-2">Devis personnalisé</h3>
                                        <p className="text-sm text-pm-off-white/60">Nous vous envoyons un devis adapté à vos besoins</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-pm-gold/20 text-pm-gold rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-xl font-bold">3</span>
                                        </div>
                                        <h3 className="font-semibold text-pm-off-white mb-2">Confirmation</h3>
                                        <p className="text-sm text-pm-off-white/60">Validez votre réservation et préparez votre événement</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Carte de réservation */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6 sticky top-8"
                            >
                                <h3 className="text-xl font-playfair text-pm-gold mb-4">Réserver ce service</h3>
                                
                                <div className="space-y-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <CalendarIcon className="w-5 h-5 text-pm-gold" />
                                        <span className="text-pm-off-white">Disponible immédiatement</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <ClockIcon className="w-5 h-5 text-pm-gold" />
                                        <span className="text-pm-off-white">Réponse sous 24h</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CurrencyDollarIcon className="w-5 h-5 text-pm-gold" />
                                        <span className="text-pm-off-white">Devis gratuit</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleContact}
                                    className="w-full bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-semibold py-3 px-6 rounded-lg hover:from-yellow-400 hover:to-pm-gold transition-all duration-200 transform hover:scale-105"
                        >
                            {service.buttonText}
                                </button>

                                <p className="text-xs text-pm-off-white/60 text-center mt-4">
                                    Devis personnalisé selon vos besoins
                                </p>
                            </motion.div>

                            {/* Contact rapide */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-playfair text-pm-gold mb-4">Contact rapide</h3>
                                
                                <div className="space-y-3">
                                    <a 
                                        href="tel:+241123456789"
                                        className="flex items-center gap-3 text-pm-off-white hover:text-pm-gold transition-colors duration-200"
                                    >
                                        <PhoneIcon className="w-5 h-5" />
                                        <span>+241 12 34 56 789</span>
                                    </a>
                                    <a 
                                        href="mailto:contact@perfectmodels.ga"
                                        className="flex items-center gap-3 text-pm-off-white hover:text-pm-gold transition-colors duration-200"
                                    >
                                        <EnvelopeIcon className="w-5 h-5" />
                                        <span>contact@perfectmodels.ga</span>
                                    </a>
                                    <div className="flex items-center gap-3 text-pm-off-white">
                                        <MapPinIcon className="w-5 h-5" />
                                        <span>Libreville, Gabon</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Services similaires */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6"
                            >
                                <h3 className="text-lg font-playfair text-pm-gold mb-4">Services similaires</h3>
                                
                                <div className="space-y-3">
                                    {agencyServices
                                        .filter(s => s.category === service.category && s.slug !== service.slug)
                                        .slice(0, 3)
                                        .map((similarService) => (
                                            <Link
                                                key={similarService.slug}
                                                to={`/services/${similarService.slug}`}
                                                className="block p-3 bg-pm-off-white/5 rounded-lg hover:bg-pm-off-white/10 transition-colors duration-200"
                                            >
                                                <h4 className="font-semibold text-pm-off-white mb-1">
                                                    {similarService.title}
                                                </h4>
                                                <p className="text-sm text-pm-off-white/60 line-clamp-2">
                                                    {similarService.description}
                                                </p>
                        </Link>
                                        ))}
                                </div>
                            </motion.div>
                    </div>
                </div>
            </div>

                {/* Modal de contact */}
                {showContactForm && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-black/90 border border-pm-gold/20 rounded-2xl p-8 max-w-md w-full"
                        >
                            <h3 className="text-2xl font-playfair text-pm-gold mb-6">Contactez-nous</h3>
                            
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        placeholder="votre@email.com"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Téléphone</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        placeholder="+241 XX XX XX XX"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Message</label>
                                    <textarea
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        rows={4}
                                        placeholder={`Je souhaite réserver le service "${service.title}"...`}
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-pm-gold text-pm-dark font-semibold py-3 px-6 rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                                    >
                                        Envoyer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowContactForm(false)}
                                        className="flex-1 text-pm-gold border border-pm-gold/30 py-3 px-6 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
        </div>
        </>
    );
};

export default ServiceDetail;
