import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import * as ReactRouterDOM from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, MicrophoneIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
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
        <div className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg overflow-hidden transition-all duration-300">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-pm-gold/10"
                aria-expanded={isOpen}
            >
                <div>
                    <h4 className="text-2xl font-playfair text-pm-gold">{title}</h4>
                    {description && <p className="text-sm text-pm-off-white/70 mt-1">{description}</p>}
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className="grid transition-all duration-500 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <div className="p-4 border-t border-pm-gold/20">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                            {(images || []).map((img, idx) => (
                                <button key={idx} onClick={() => onImageClick(img)} aria-label={`Agrandir l'image de la création ${idx + 1} de ${title}`} className="aspect-square block bg-black group overflow-hidden border-2 border-transparent hover:border-pm-gold focus-style-self focus-visible:ring-2 focus-visible:ring-pm-gold transition-colors duration-300 rounded-md">
                                    <img src={img} alt={`${title} - création ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  const fashionDayEvents = data?.fashionDayEvents || [];
  
  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
          title="Perfect Fashion Day | L'Événement Mode de Référence"
          description="Vibrez au rythme du Perfect Fashion Day, l'événement mode incontournable à Libreville. Revivez les éditions, découvrez les créateurs gabonais et les moments forts qui célèbrent la mode africaine."
          keywords="perfect fashion day, défilé de mode gabon, événement mode libreville, créateurs gabonais, mode africaine, fashion week gabon"
          image={data?.siteImages.fashionDayBg}
        />
        <div className="page-container">
          <h1 className="page-title">Perfect Fashion Day</h1>
          <p className="page-subtitle">
            Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise.
          </p>

          {/* Edition Selector */}
          <div className="flex justify-center gap-4 mb-10 lg:mb-14" role="group" aria-label="Sélection de l'édition">
            {fashionDayEvents.map(event => (
              <button
                key={event.edition}
                onClick={() => setSelectedEdition(event)}
                aria-pressed={selectedEdition.edition === event.edition}
                className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-colors duration-300 ${selectedEdition.edition === event.edition ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}
              >
                Édition {event.edition} ({new Date(event.date).getFullYear()})
              </button>
            ))}
          </div>

          {/* Event Details */}
          <div className="content-section">
            <h2 className="text-4xl font-playfair text-center text-pm-gold mb-2">Thème : "{selectedEdition.theme}"</h2>
            <p className="text-center text-pm-off-white/70 mb-8">{new Date(selectedEdition.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="text-center max-w-3xl mx-auto mb-12">{selectedEdition.description}</p>
            
            {selectedEdition.location && (
              <div className="flex flex-wrap justify-center gap-8 mb-12 text-center border-y border-pm-gold/20 py-8">
                <InfoPill icon={CalendarDaysIcon} title="Date" content={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} />
                <InfoPill icon={MapPinIcon} title="Lieu" content={selectedEdition.location} />
                <InfoPill icon={SparklesIcon} title="Promoteur" content={selectedEdition.promoter || 'Parfait Asseko'} />
              </div>
            )}
            
            {selectedEdition.edition === 2 && (
              <div className="text-center my-12 py-8 bg-pm-dark/50 rounded-lg">
                  <h3 className="text-3xl font-playfair text-pm-gold mb-4">Rejoignez l'Aventure de l'Édition 2</h3>
                  <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
                      Pour cette nouvelle édition, nous recherchons des talents visionnaires pour donner vie au thème "L’Art de Se Révler". Que vous soyez mannequin, styliste, partenaire, photographe ou que vous ayez un autre talent à partager, nous vous invitons à rejoindre cette célébration de la mode.
                  </p>
                  <div className="mt-8">
                      <ReactRouterDOM.Link to="/fashion-day-application" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20">
                          Participer à l'événement
                      </ReactRouterDOM.Link>
                  </div>
              </div>
            )}
          </div>
            
            {/* Featured Models */}
            {selectedEdition.featuredModels && selectedEdition.featuredModels.length > 0 && (
               <section className="mt-16">
                    <h3 className="section-title"><UserGroupIcon className="w-8 h-8 inline-block mr-3" aria-hidden="true"/> Mannequins Vedettes</h3>
                    <p className="text-pm-off-white/80 text-center max-w-4xl mx-auto">
                        {selectedEdition.featuredModels.join(', ')} et toute la Perfect Models Squad.
                    </p>
               </section> 
            )}

            {/* Stylists */}
            {selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
                <section className="mt-16">
                    <h3 className="section-title">Galeries des Créateurs</h3>
                    <div className="space-y-4 max-w-6xl mx-auto">
                        {selectedEdition.stylists.map((stylist, index) => (
                            <AccordionItem
                                key={stylist.name}
                                title={stylist.name}
                                description={stylist.description}
                                images={stylist.images || []}
                                onImageClick={setSelectedImage}
                                defaultOpen={index === 0}
                            />
                        ))}
                    </div>
                </section>
            )}
            
            {/* Artists */}
            {selectedEdition.artists && selectedEdition.artists.length > 0 && (
                <section className="mt-16">
                    <h3 className="section-title">Performances Artistiques</h3>
                    <div className="space-y-4 max-w-6xl mx-auto">
                        {selectedEdition.artists.map((artist: Artist, index: number) => (
                            <AccordionItem
                                key={`${artist.name}-${index}`}
                                title={artist.name}
                                description={artist.description}
                                images={artist.images || []}
                                onImageClick={setSelectedImage}
                            />
                        ))}
                    </div>
                </section>
            )}
            
            {selectedEdition.partners && selectedEdition.partners.length > 0 && (
              <section className="mt-16">
                <h3 className="section-title">Partenaires & Sponsors</h3>
                <div className="flex justify-center items-center gap-12 flex-wrap">
                    {selectedEdition.partners.map(p => (
                        <div key={p.name} className="text-center">
                            <p className="text-pm-gold/80 text-sm">{p.type}</p>
                            <p className="text-2xl font-bold tracking-wider">{p.name}</p>
                        </div>
                    ))}
                </div>
              </section>
            )}
        </div>
      </div>
      
      {/* Lightbox */}
      {selectedImage && (
        <div 
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vue agrandie de l'image"
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-pm-gold transition-colors z-10" 
            aria-label="Fermer"
            onClick={() => setSelectedImage(null)}
          >
            <XMarkIcon className="w-8 h-8"/>
          </button>
          <div className="relative max-w-5xl max-h-[90vh] cursor-default" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage} 
              alt="Vue agrandie" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl shadow-pm-gold/20" 
            />
          </div>
        </div>
      )}
    </>
  );
};

interface InfoPillProps {
    icon: React.ElementType;
    title: string;
    content: string;
}
const InfoPill: React.FC<InfoPillProps> = ({ icon: Icon, title, content }) => (
    <div className="flex items-center gap-3">
        <Icon className="w-10 h-10 text-pm-gold" aria-hidden="true"/>
        <div>
            <span className="font-bold block text-left">{title}</span>
            <span className="block text-left">{content}</span>
        </div>
    </div>
);

export default FashionDay;