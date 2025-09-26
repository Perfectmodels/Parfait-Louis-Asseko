import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CalendarDaysIcon, 
  MapPinIcon, 
  SparklesIcon, 
  UserGroupIcon, 
  MicrophoneIcon, 
  XMarkIcon, 
  ChevronDownIcon,
  TrophyIcon,
  HeartIcon,
  UsersIcon,
  PhotoIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';
import ModernTabs from '../components/ModernTabs';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent, Artist } from '../types';

interface AccordionItemProps {
    title: string;
    description: string;
    images: string[];
    onImageClick: (img: string) => void;
    defaultOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, description, images, onImageClick, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <motion.div 
            className="bg-gradient-to-br from-pm-dark/50 to-black/30 border border-pm-gold/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-pm-gold/40"
            whileHover={{ scale: 1.02 }}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-pm-gold/5 transition-all duration-300"
                aria-expanded={isOpen}
            >
                <div className="flex-1">
                    <h4 className="text-2xl md:text-3xl font-playfair text-pm-gold mb-2">{title}</h4>
                    {description && <p className="text-pm-off-white/70 text-lg">{description}</p>}
                    {images && images.length > 0 && (
                        <div className="flex items-center gap-2 mt-3">
                            <PhotoIcon className="w-5 h-5 text-pm-gold/80" />
                            <span className="text-sm text-pm-gold/80 font-medium">
                                {images.length} {images.length === 1 ? 'création' : 'créations'}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {images && images.length > 0 && (
                        <span className="text-sm text-pm-off-white/50 hidden sm:block">
                            {isOpen ? 'Masquer' : 'Voir'} les créations
                        </span>
                    )}
                <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <motion.div
                className="overflow-hidden"
                initial={false}
                animate={{ 
                    height: isOpen ? 'auto' : 0,
                    opacity: isOpen ? 1 : 0
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                <div className="p-6 border-t border-pm-gold/20">
                    {images && images.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img, idx) => (
                                <motion.button 
                                    key={idx} 
                                    onClick={() => onImageClick(img)} 
                                    aria-label={`Agrandir l'image de la création ${idx + 1} de ${title}`} 
                                    className="aspect-square block bg-black group overflow-hidden border-2 border-transparent hover:border-pm-gold focus:outline-none focus:ring-2 focus:ring-pm-gold transition-all duration-300 rounded-lg relative"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <img 
                                        src={img} 
                                        alt={`${title} - création ${idx + 1}`} 
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                                        loading="lazy" 
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                                        <EyeIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <PhotoIcon className="w-12 h-12 text-pm-gold/50 mx-auto mb-3" />
                            <p className="text-pm-off-white/60">Aucune image disponible</p>
                    </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};


const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  const fashionDayEvents = data?.fashionDayEvents || [];
  
  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedImages, setLikedImages] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'artists' | 'partners'>('overview');
  const modalRef = useRef<HTMLDivElement>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (fashionDayEvents.length > 0) {
      setSelectedEdition(fashionDayEvents[0]);
    }
  }, [fashionDayEvents]);

  useEffect(() => {
    if (selectedImage) {
        prevActiveElement.current = document.activeElement as HTMLElement;
        setTimeout(() => {
            modalRef.current?.focus();
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') setSelectedImage(null);
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            e.preventDefault();
                            lastElement.focus();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            e.preventDefault();
                            firstElement.focus();
                        }
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                prevActiveElement.current?.focus();
            };
        }, 100);
    }
  }, [selectedImage]);

  const toggleLike = (imageUrl: string) => {
    setLikedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageUrl)) {
        newSet.delete(imageUrl);
      } else {
        newSet.add(imageUrl);
      }
      return newSet;
    });
  };


  const getAllImages = () => {
    const images: string[] = [];
    if (selectedEdition?.stylists) {
      selectedEdition.stylists.forEach(stylist => {
        if (stylist.images) images.push(...stylist.images);
      });
    }
    if (selectedEdition?.artists) {
      selectedEdition.artists.forEach(artist => {
        if (artist.images) images.push(...artist.images);
      });
    }
    return images;
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const allImages = getAllImages();
    const currentIndex = allImages.findIndex(img => img === selectedImage);
    if (direction === 'prev') {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : allImages.length - 1;
      setSelectedImage(allImages[prevIndex]);
      setCurrentImageIndex(prevIndex);
    } else {
      const nextIndex = currentIndex < allImages.length - 1 ? currentIndex + 1 : 0;
      setSelectedImage(allImages[nextIndex]);
      setCurrentImageIndex(nextIndex);
    }
  };

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  if (fashionDayEvents.length === 0 || !selectedEdition) {
    return <div className="min-h-screen flex items-center justify-center">Aucun événement à afficher.</div>;
  }

  return (
    <>
      <div className="bg-pm-dark text-pm-off-white">
        <SEO 
          title="Perfect Fashion Day | Un Événement Mode de Référence"
          description="Vibrez au rythme du Perfect Fashion Day, l'événement mode incontournable à Libreville. Revivez les éditions, découvrez les créateurs gabonais et les moments forts qui célèbrent la mode africaine."
          keywords="perfect fashion day, défilé de mode gabon, événement mode libreville, créateurs gabonais, mode africaine, fashion week gabon"
          image={data?.siteImages.fashionDayBg}
        />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-pm-dark via-black to-pm-dark">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M30 0L35 20L55 20L40 30L45 50L30 40L15 50L20 30L5 20L25 20Z'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-pm-gold/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-60 right-20 w-40 h-40 bg-pm-gold/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pm-gold/4 rounded-full blur-2xl animate-pulse delay-2000"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-pm-gold/10 border border-pm-gold/30 rounded-full px-6 py-3 text-pm-gold text-sm font-semibold"
              >
                <TrophyIcon className="w-4 h-4" />
                Événement Mode au Gabon
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-7xl font-playfair text-pm-off-white leading-tight"
              >
                <span className="block">Perfect</span>
                <span className="block text-pm-gold">Fashion Day</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-xl md:text-2xl text-pm-off-white/80 max-w-3xl mx-auto leading-relaxed"
              >
            Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise.
              </motion.p>

          {/* Edition Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex justify-center gap-4 flex-wrap"
                role="group"
                aria-label="Sélection de l'édition"
              >
            {fashionDayEvents.map(event => (
              <button
                key={event.edition}
                onClick={() => setSelectedEdition(event)}
                aria-pressed={selectedEdition.edition === event.edition}
                    className={`px-6 py-3 text-sm uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-105 ${
                      selectedEdition.edition === event.edition 
                        ? 'bg-pm-gold text-pm-dark shadow-lg shadow-pm-gold/30' 
                        : 'bg-black/50 border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'
                    }`}
              >
                Édition {event.edition} ({new Date(event.date).getFullYear()})
              </button>
            ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
              >
                <div className="text-center">
                  <div className="text-3xl font-bold text-pm-gold">{fashionDayEvents.length}</div>
                  <div className="text-pm-off-white/70">Éditions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pm-gold">500+</div>
                  <div className="text-pm-off-white/70">Invités</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pm-gold">20+</div>
                  <div className="text-pm-off-white/70">Créateurs</div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-pm-gold/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-pm-gold rounded-full mt-2"
              />
            </div>
          </motion.div>
        </section>

        <div className="page-container relative z-10">
          {/* Event Details */}
          <section className="py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-playfair text-pm-gold mb-4">
                Thème : "{selectedEdition.theme}"
              </h2>
              <p className="text-xl text-pm-off-white/70 mb-8">
                {new Date(selectedEdition.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-lg text-pm-off-white/80 max-w-4xl mx-auto leading-relaxed">
                {selectedEdition.description}
              </p>
            </motion.div>
            
            {/* Event Info Cards */}
            {selectedEdition.location && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              >
                <InfoCard 
                  icon={CalendarDaysIcon} 
                  title="Date" 
                  content={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })} 
                />
                <InfoCard 
                  icon={MapPinIcon} 
                  title="Lieu" 
                  content={selectedEdition.location} 
                />
                <InfoCard 
                  icon={SparklesIcon} 
                  title="Promoteur" 
                  content={selectedEdition.promoter || 'Parfait Asseko'} 
                />
              </motion.div>
            )}

            {/* Call to Action for Edition 2 */}
            {selectedEdition.edition === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true, amount: 0.3 }}
                className="text-center my-16 py-12 bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 rounded-2xl border border-pm-gold/20"
              >
                <h3 className="text-3xl md:text-4xl font-playfair text-pm-gold mb-6">
                  Rejoignez l'Aventure de l'Édition 2
                </h3>
                <p className="text-lg text-pm-off-white/80 max-w-4xl mx-auto mb-8 leading-relaxed">
                  Pour cette nouvelle édition, nous recherchons des talents visionnaires pour donner vie au thème "L'Art de Se Révéler". 
                  Que vous soyez mannequin, styliste, partenaire, photographe ou que vous ayez un autre talent à partager, 
                  nous vous invitons à rejoindre cette célébration de la mode.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    to="/fashion-day-application" 
                    className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/30"
                  >
                          Participer à l'événement
                      </Link>
                  <button className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                    En savoir plus
                  </button>
                  </div>
              </motion.div>
            )}
          </section>

          {/* Navigation Tabs */}
          <ModernTabs
            tabs={[
              { id: 'overview', label: 'Aperçu', icon: EyeIcon },
              { id: 'gallery', label: 'Galerie', icon: PhotoIcon },
              { id: 'artists', label: 'Artistes', icon: MicrophoneIcon },
              { id: 'partners', label: 'Partenaires', icon: UsersIcon }
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as any)}
          />

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-16"
              >
            {/* Featured Models */}
            {selectedEdition.featuredModels && selectedEdition.featuredModels.length > 0 && (
                  <section>
                    <h3 className="section-title flex items-center justify-center gap-3">
                      <UserGroupIcon className="w-8 h-8" />
                      Mannequins Vedettes
                    </h3>
                    <p className="text-pm-off-white/80 text-center max-w-4xl mx-auto text-lg">
                        {selectedEdition.featuredModels.join(', ')} et toute la Perfect Models Squad.
                    </p>
               </section> 
            )}

                {/* Stylists Overview */}
                {selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
                  <section>
                    <h3 className="section-title">Créateurs Participants</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {selectedEdition.stylists.map((stylist, index) => (
                        <motion.div
                          key={stylist.name}
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          viewport={{ once: true, amount: 0.3 }}
                          className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-6 hover:border-pm-gold/40 transition-all duration-300"
                        >
                          <h4 className="text-2xl font-playfair text-pm-gold mb-3">{stylist.name}</h4>
                          <p className="text-pm-off-white/70 mb-4">{stylist.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-pm-gold/80">
                              {stylist.images?.length || 0} créations
                            </span>
                            <button
                              onClick={() => setActiveTab('gallery')}
                              className="text-pm-gold hover:text-white transition-colors"
                            >
                              Voir la galerie →
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </section>
                )}
              </motion.div>
            )}

            {activeTab === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
            {selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
                  <div className="space-y-8">
                        {selectedEdition.stylists.map((stylist, index) => (
                            <AccordionItem
                                key={stylist.name}
                                title={stylist.name}
                                description={stylist.description}
                                images={stylist.images || []}
                        onImageClick={(img) => {
                          setSelectedImage(img);
                          const allImages = getAllImages();
                          setCurrentImageIndex(allImages.findIndex(i => i === img));
                        }}
                                defaultOpen={index === 0}
                            />
                        ))}
                    </div>
                )}
              </motion.div>
            )}

            {activeTab === 'artists' && (
              <motion.div
                key="artists"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {selectedEdition.artists && selectedEdition.artists.length > 0 ? (
                  <div className="space-y-8">
                        {selectedEdition.artists.map((artist: Artist, index: number) => (
                            <AccordionItem
                                key={`${artist.name}-${index}`}
                                title={artist.name}
                                description={artist.description}
                                images={artist.images || []}
                        onImageClick={(img) => {
                          setSelectedImage(img);
                          const allImages = getAllImages();
                          setCurrentImageIndex(allImages.findIndex(i => i === img));
                        }}
                            />
                        ))}
                    </div>
                ) : (
                  <div className="text-center py-16">
                    <MicrophoneIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                    <p className="text-pm-off-white/60 text-lg">Aucun artiste programmé pour cette édition.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'partners' && (
              <motion.div
                key="partners"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {selectedEdition.partners && selectedEdition.partners.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {selectedEdition.partners.map(partner => (
                      <motion.div
                        key={partner.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-8 text-center hover:border-pm-gold/40 transition-all duration-300"
                      >
                        <p className="text-pm-gold/80 text-sm font-semibold uppercase tracking-wider mb-2">
                          {partner.type}
                        </p>
                        <p className="text-2xl font-bold tracking-wider text-pm-off-white">
                          {partner.name}
                        </p>
                      </motion.div>
                    ))}
                </div>
                ) : (
                  <div className="text-center py-16">
                    <UsersIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                    <p className="text-pm-off-white/60 text-lg">Aucun partenaire annoncé pour cette édition.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Enhanced Lightbox */}
      {selectedImage && (
        <motion.div 
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vue agrandie de l'image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-white hover:text-pm-gold transition-colors z-10 p-2 hover:bg-black/50 rounded-full" 
            aria-label="Fermer"
            onClick={() => setSelectedImage(null)}
          >
            <XMarkIcon className="w-8 h-8"/>
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-pm-gold transition-colors z-10 p-3 hover:bg-black/50 rounded-full"
            aria-label="Image précédente"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-pm-gold transition-colors z-10 p-3 hover:bg-black/50 rounded-full"
            aria-label="Image suivante"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm z-10">
            {currentImageIndex + 1} / {getAllImages().length}
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(selectedImage);
            }}
            className="absolute bottom-4 right-4 text-white hover:text-pm-gold transition-colors z-10 p-3 hover:bg-black/50 rounded-full"
            aria-label={likedImages.has(selectedImage) ? "Retirer le like" : "Ajouter un like"}
          >
            {likedImages.has(selectedImage) ? (
              <HeartSolidIcon className="w-8 h-8 text-red-500" />
            ) : (
              <HeartIcon className="w-8 h-8" />
            )}
          </button>

          {/* Main Image */}
          <div className="relative max-w-6xl max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}>
            <motion.img 
              src={selectedImage} 
              alt="Vue agrandie" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-pm-gold/20" 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

interface InfoCardProps {
    icon: React.ElementType;
    title: string;
    content: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, content }) => (
    <div className="bg-gradient-to-br from-black/50 to-black/30 border border-pm-gold/20 rounded-2xl p-6 text-center hover:border-pm-gold/40 transition-all duration-300">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-pm-gold/10 rounded-xl">
                <Icon className="w-8 h-8 text-pm-gold" aria-hidden="true"/>
        </div>
        </div>
        <h3 className="text-lg font-semibold text-pm-gold mb-2">{title}</h3>
        <p className="text-pm-off-white/80">{content}</p>
    </div>
);

export default FashionDay;