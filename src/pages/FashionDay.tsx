import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, XMarkIcon, ChevronDownIcon, TicketIcon, UserPlusIcon } from '@heroicons/react/24/outline';
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
                <button key={idx} onClick={() => onImageClick(img)} aria-label={`Agrandir l'image ${idx + 1} de ${title}`} className="aspect-square block bg-black group overflow-hidden border-2 border-transparent hover:border-pm-gold transition-colors duration-300 rounded-md">
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

  // Trier les éditions : Édition 2 en premier, puis les autres par ordre décroissant
  const sortedEvents = [...fashionDayEvents].sort((a, b) => {
    if (a.edition === 2) return -1;
    if (b.edition === 2) return 1;
    return b.edition - a.edition;
  });

  useEffect(() => {
    // Sélectionner l'édition 2 par défaut (prochaine édition)
    if (sortedEvents.length > 0) {
      const edition2 = sortedEvents.find(e => e.edition === 2);
      setSelectedEdition(edition2 || sortedEvents[0]);
    }
  }, [fashionDayEvents]);

  useEffect(() => {
    if (selectedImage) {
      prevActiveElement.current = document.activeElement as HTMLElement;
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }
  }, [selectedImage]);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!selectedEdition) {
    return <div className="min-h-screen flex items-center justify-center">Aucun événement à afficher.</div>;
  }

  const isUpcoming = selectedEdition.edition === 2;

  return (
    <>
      <div className="bg-pm-dark text-pm-off-white">
        <SEO
          title="Perfect Fashion Day | L'Événement Mode de Référence"
          description="Vibrez au rythme du Perfect Fashion Day, l'événement mode incontournable à Libreville. Découvrez la prochaine édition et revivez les moments forts."
          keywords="perfect fashion day, défilé de mode gabon, événement mode libreville, créateurs gabonais, mode africaine"
          image={data?.siteImages.fashionDayBg}
        />

        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-pm-dark z-10"></div>
          <img
            src={data?.siteImages.fashionDayBg}
            alt="Perfect Fashion Day"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-pm-gold mb-4">
              Perfect Fashion Day
            </h1>
            <p className="text-xl md:text-2xl text-pm-off-white max-w-3xl mx-auto">
              Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise
            </p>
          </div>
        </div>

        <div className="page-container">
          {/* Sélecteur d'Éditions (Onglets) */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap" role="tablist" aria-label="Sélection de l'édition">
            {sortedEvents.map(event => {
              const isSelected = selectedEdition.edition === event.edition;
              const isEdition2 = event.edition === 2;

              return (
                <button
                  key={event.edition}
                  onClick={() => setSelectedEdition(event)}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`edition-${event.edition}-panel`}
                  className={`relative px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 ${isSelected
                    ? 'bg-pm-gold text-pm-dark shadow-lg shadow-pm-gold/30 scale-105'
                    : 'bg-pm-dark/50 border-2 border-pm-gold/30 text-pm-gold hover:border-pm-gold hover:bg-pm-gold/10'
                    }`}
                >
                  {isEdition2 && (
                    <span className="absolute -top-2 -right-2 px-2 py-1 bg-pm-gold text-pm-dark text-xs rounded-full font-bold">
                      Prochaine
                    </span>
                  )}
                  <span className="block">Édition {event.edition}</span>
                  <span className="block text-xs mt-1 opacity-80">
                    {new Date(event.date).getFullYear()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Contenu de l'Édition Sélectionnée */}
          <div
            role="tabpanel"
            id={`edition-${selectedEdition.edition}-panel`}
            aria-labelledby={`edition-${selectedEdition.edition}-tab`}
            className="animate-fadeIn"
          >
            {/* Badge Prochaine Édition */}
            {isUpcoming && (
              <div className="text-center mb-8">
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-pm-gold to-yellow-500 text-pm-dark rounded-full text-sm font-bold uppercase tracking-widest shadow-lg shadow-pm-gold/30">
                  🎉 Prochaine Édition
                </span>
              </div>
            )}

            {/* En-tête */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-playfair text-pm-gold mb-4">
                Édition {selectedEdition.edition} - {new Date(selectedEdition.date).getFullYear()}
              </h2>
              <p className="text-3xl md:text-4xl font-playfair text-white mb-6">
                "{selectedEdition.theme}"
              </p>
            </div>

            {/* Informations Clés */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <InfoCard
                icon={CalendarDaysIcon}
                title="Date"
                content={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              />
              <InfoCard
                icon={MapPinIcon}
                title="Lieu"
                content={selectedEdition.location || 'À confirmer'}
              />
              <InfoCard
                icon={SparklesIcon}
                title="Promoteur"
                content={selectedEdition.promoter || 'Parfait Asseko'}
              />
            </div>

            {/* Description */}
            <div className="max-w-4xl mx-auto mb-12">
              <p className="text-lg text-pm-off-white/90 text-center leading-relaxed">
                {selectedEdition.description}
              </p>
            </div>

            {/* Stylistes Participants (pour édition 2) */}
            {isUpcoming && selectedEdition.stylists && selectedEdition.stylists.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl font-playfair text-center text-pm-gold mb-8">
                  Stylistes Participants ({selectedEdition.stylists.length})
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  {selectedEdition.stylists.map((stylist, idx) => (
                    <div key={idx} className="bg-pm-dark/50 border border-pm-gold/30 rounded-lg p-4 text-center hover:border-pm-gold transition-all hover:scale-105">
                      <p className="text-lg font-bold text-white">{stylist.name}</p>
                      {stylist.description && (
                        <p className="text-sm text-pm-off-white/70 mt-1">{stylist.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Boutons d'Action (uniquement pour prochaine édition) */}
            {isUpcoming && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link
                  to="/fashion-day/reservation"
                  className="group px-10 py-5 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-2xl shadow-pm-gold/30 flex items-center gap-3"
                >
                  <TicketIcon className="w-6 h-6" />
                  Réserver une Table
                </Link>
                <Link
                  to="/fashion-day-application"
                  className="group px-10 py-5 bg-transparent border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark flex items-center gap-3"
                >
                  <UserPlusIcon className="w-6 h-6" />
                  Participer à l'Événement
                </Link>
              </div>
            )}

            {/* Mannequins Vedettes */}
            {selectedEdition.featuredModels && selectedEdition.featuredModels.length > 0 && (
              <div className="mb-12 bg-pm-dark/30 border border-pm-gold/20 rounded-2xl p-8">
                <h3 className="text-2xl font-playfair text-pm-gold mb-6 flex items-center justify-center gap-3">
                  <UserGroupIcon className="w-7 h-7" />
                  Mannequins Vedettes
                </h3>
                <p className="text-center text-pm-off-white/80 text-lg">
                  {selectedEdition.featuredModels.join(', ')}
                </p>
              </div>
            )}

            {/* Galeries des Créateurs */}
            {selectedEdition.stylists && selectedEdition.stylists.length > 0 && selectedEdition.stylists.some(s => s.images && s.images.length > 0) && (
              <div className="mb-12">
                <h3 className="text-3xl font-playfair text-pm-gold mb-8 text-center">
                  Galeries des Créateurs
                </h3>
                <div className="space-y-4">
                  {selectedEdition.stylists.filter(s => s.images && s.images.length > 0).map((stylist, index) => (
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
              </div>
            )}

            {/* Performances Artistiques */}
            {selectedEdition.artists && selectedEdition.artists.length > 0 && (
              <div className="mb-12">
                <h3 className="text-3xl font-playfair text-pm-gold mb-8 text-center">
                  Performances Artistiques
                </h3>
                <div className="space-y-4">
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
              </div>
            )}

            {/* Partenaires */}
            {selectedEdition.partners && selectedEdition.partners.length > 0 && (
              <div className="bg-pm-dark/30 border border-pm-gold/20 rounded-2xl p-8">
                <h3 className="text-3xl font-playfair text-pm-gold mb-8 text-center">
                  Partenaires & Sponsors
                </h3>
                <div className="flex justify-center items-center gap-12 flex-wrap">
                  {selectedEdition.partners.map(p => (
                    <div key={p.name} className="text-center">
                      <p className="text-pm-gold/80 text-sm mb-1">{p.type}</p>
                      <p className="text-xl font-bold tracking-wider">{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
            <XMarkIcon className="w-8 h-8" />
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

// Composant InfoCard
interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  content: string;
}
const InfoCard: React.FC<InfoCardProps> = ({ icon: Icon, title, content }) => (
  <div className="bg-pm-dark/50 border border-pm-gold/30 rounded-xl p-6 text-center hover:border-pm-gold transition-all hover:scale-105">
    <Icon className="w-12 h-12 text-pm-gold mx-auto mb-3" aria-hidden="true" />
    <span className="font-bold block text-pm-gold mb-2">{title}</span>
    <span className="block text-white">{content}</span>
  </div>
);

export default FashionDay;