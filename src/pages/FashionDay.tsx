import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, MicrophoneIcon, XMarkIcon, ChevronDownIcon, StarIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent, Artist } from '../types';
import PressbookGenerator from '../components/PressbookGenerator';

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
  const [showPressbookModal, setShowPressbookModal] = useState(false);
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
          title={`Perfect Fashion Day Édition ${selectedEdition.edition} | ${selectedEdition.theme}`}
          description={`Découvrez la ${selectedEdition.edition}ème édition du Perfect Fashion Day : "${selectedEdition.theme}". ${selectedEdition.description}`}
          keywords={`perfect fashion day édition ${selectedEdition.edition}, ${selectedEdition.theme}, défilé de mode gabon, événement mode libreville, créateurs gabonais, mode africaine`}
          image={selectedEdition.imageUrl}
          type="event"
        />
        <div className="page-container">
          {/* Hero Section améliorée */}
          <section 
            className="relative overflow-hidden mb-16"
            style={{ 
              backgroundImage: selectedEdition.imageUrl ? `url(${selectedEdition.imageUrl})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 via-transparent to-pm-gold/5"></div>
            <div className="relative z-10 text-center py-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-7xl font-playfair text-pm-gold mb-6 tracking-wider">
                  Perfect Fashion Day
                </h1>
                <p className="text-xl md:text-2xl text-pm-off-white/90 mb-8 max-w-4xl mx-auto leading-relaxed">
                  Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise.
                </p>
                
                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
                  <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                    <div className="text-3xl font-bold text-pm-gold mb-2">1</div>
                    <div className="text-sm text-pm-off-white/80">Édition</div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                    <div className="text-3xl font-bold text-pm-gold mb-2">20+</div>
                    <div className="text-sm text-pm-off-white/80">Mannequins</div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                    <div className="text-3xl font-bold text-pm-gold mb-2">10</div>
                    <div className="text-sm text-pm-off-white/80">Créateurs</div>
                  </div>
                  <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                    <div className="text-3xl font-bold text-pm-gold mb-2">150+</div>
                    <div className="text-sm text-pm-off-white/80">Spectateurs</div>
                  </div>
                </div>
                
                {/* Call to Action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/fashion-day-application" 
                    className="px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
                  >
                    Participer à l'événement
                  </Link>
                  <button 
                    onClick={() => document.getElementById('edition-details')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
                  >
                    Découvrir les éditions
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

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
          <div id="edition-details" className="content-section">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/10 rounded-full mb-4">
                <StarIcon className="w-5 h-5 text-pm-gold" />
                <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                  Édition {selectedEdition.edition}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-playfair text-center text-pm-gold mb-4">
                "{selectedEdition.theme}"
              </h2>
              <p className="text-center text-pm-off-white/70 text-lg mb-8">
                {new Date(selectedEdition.date).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
            </motion.div>
            
            {/* Image principale de l'événement */}
            {selectedEdition.imageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center mb-12"
              >
                <div className="max-w-4xl w-full">
                  <div className="relative group">
                    <img 
                      src={selectedEdition.imageUrl} 
                      alt={`Affiche officielle de la Perfect Fashion Day - Édition ${selectedEdition.edition} : ${selectedEdition.theme}`}
                      className="w-full h-auto rounded-xl shadow-2xl border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Boutons d'action */}
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors">
                        <HeartIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors">
                        <ShareIcon className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                        Affiche officielle - Édition {selectedEdition.edition}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <p className="text-center max-w-3xl mx-auto mb-12">{selectedEdition.description}</p>
            
            {selectedEdition.location && (
              <div className="flex flex-wrap justify-center gap-8 mb-12 text-center border-y border-pm-gold/20 py-8">
                <InfoPill icon={CalendarDaysIcon} title="Date" content={new Date(selectedEdition.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} />
                <InfoPill icon={MapPinIcon} title="Lieu" content={selectedEdition.location} />
                <InfoPill icon={SparklesIcon} title="Promoteur" content={selectedEdition.promoter || 'Parfait Asseko'} />
              </div>
            )}
            
            {/* Section d'inscription uniquement pour l'édition 2 (à venir) */}
            {selectedEdition.edition === 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative my-16 py-12 bg-gradient-to-br from-pm-gold/10 via-pm-dark/50 to-pm-gold/5 rounded-2xl border border-pm-gold/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/5 to-transparent"></div>
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/20 rounded-full mb-6">
                    <SparklesIcon className="w-5 h-5 text-pm-gold" />
                    <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                      Inscriptions Ouvertes
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-playfair text-pm-gold mb-6">
                    Rejoignez l'Aventure de l'Édition 2
                  </h3>
                  
                  <p className="text-pm-off-white/80 max-w-4xl mx-auto mb-8 text-lg leading-relaxed">
                    Pour cette nouvelle édition, nous recherchons des talents visionnaires pour donner vie au thème 
                    <span className="text-pm-gold font-semibold"> "L'Art de Se Révéler"</span>. 
                    Que vous soyez mannequin, styliste, partenaire, photographe ou que vous ayez un autre talent à partager, 
                    nous vous invitons à rejoindre cette célébration de la mode.
                  </p>
                  
                  {/* Avantages de participation */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserGroupIcon className="w-6 h-6 text-pm-gold" />
                      </div>
                      <h4 className="text-pm-gold font-semibold mb-2">Réseautage</h4>
                      <p className="text-pm-off-white/70 text-sm">Rencontrez des professionnels de la mode</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <StarIcon className="w-6 h-6 text-pm-gold" />
                      </div>
                      <h4 className="text-pm-gold font-semibold mb-2">Visibilité</h4>
                      <p className="text-pm-off-white/70 text-sm">Exposez votre talent au grand public</p>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HeartIcon className="w-6 h-6 text-pm-gold" />
                      </div>
                      <h4 className="text-pm-gold font-semibold mb-2">Passion</h4>
                      <p className="text-pm-off-white/70 text-sm">Participez à un événement unique</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/fashion-day-application" 
                      className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
                    >
                      Participer à l'événement
                    </Link>
                    <button 
                      onClick={() => document.getElementById('edition-details')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
                    >
                      En savoir plus
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section de rétrospective pour l'édition 1 (passée) */}
            {selectedEdition.edition === 1 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative my-16 py-12 bg-gradient-to-br from-pm-gold/5 via-pm-dark/30 to-pm-gold/5 rounded-2xl border border-pm-gold/20 overflow-hidden"
              >
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/10 rounded-full mb-6">
                    <StarIcon className="w-5 h-5 text-pm-gold" />
                    <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                      Édition Réussie
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-playfair text-pm-gold mb-6">
                    Une Première Édition Mémorable
                  </h3>
                  
                  <p className="text-pm-off-white/80 max-w-4xl mx-auto mb-8 text-lg leading-relaxed">
                    La première édition du Perfect Fashion Day a été un véritable succès, réunissant créateurs, mannequins et spectateurs 
                    autour du thème <span className="text-pm-gold font-semibold">"Racines et Modernité"</span>. 
                    Cet événement a posé les bases solides d'une tradition qui perdure.
                  </p>
                  
                  {/* Statistiques de l'édition 1 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-10">
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="text-2xl font-bold text-pm-gold mb-2">8</div>
                      <div className="text-sm text-pm-off-white/80">Créateurs</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="text-2xl font-bold text-pm-gold mb-2">20+</div>
                      <div className="text-sm text-pm-off-white/80">Mannequins</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="text-2xl font-bold text-pm-gold mb-2">150+</div>
                      <div className="text-sm text-pm-off-white/80">Spectateurs</div>
                    </div>
                    <div className="bg-black/30 backdrop-blur-sm border border-pm-gold/20 rounded-lg p-6">
                      <div className="text-2xl font-bold text-pm-gold mb-2">100%</div>
                      <div className="text-sm text-pm-off-white/80">Satisfaction</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-pm-off-white/70 text-sm">
                      Découvrez les créations et les moments forts de cette édition exceptionnelle ci-dessous.
                    </p>
                  </div>
                </div>
              </motion.div>
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

            {/* Message pour l'édition 2 si pas de mannequins vedettes */}
            {selectedEdition.edition === 2 && (!selectedEdition.featuredModels || selectedEdition.featuredModels.length === 0) && (
                <section className="mt-16">
                    <h3 className="section-title"><UserGroupIcon className="w-8 h-8 inline-block mr-3" aria-hidden="true"/> Mannequins Vedettes</h3>
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-pm-off-white/80 mb-6">
                            Pour cette édition, nous recherchons des mannequins talentueux pour donner vie au thème "L'Art de Se Révéler".
                        </p>
                        <div className="bg-pm-gold/10 border border-pm-gold/20 rounded-lg p-6">
                            <p className="text-pm-gold font-semibold mb-2">Vous êtes mannequin ?</p>
                            <p className="text-pm-off-white/70 text-sm mb-4">
                                Rejoignez-nous pour cette édition exceptionnelle et montrez votre talent sur scène.
                            </p>
                            <Link 
                                to="/fashion-day-application" 
                                className="inline-block px-6 py-2 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors"
                            >
                                Postuler maintenant
                            </Link>
                        </div>
                    </div>
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

            {/* Message pour l'édition 2 si pas de stylistes */}
            {selectedEdition.edition === 2 && (!selectedEdition.stylists || selectedEdition.stylists.length === 0) && (
                <section className="mt-16">
                    <h3 className="section-title">Créateurs & Stylistes</h3>
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-pm-off-white/80 mb-6">
                            Nous recherchons des créateurs talentueux pour cette édition exceptionnelle.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-pm-gold/10 border border-pm-gold/20 rounded-lg p-6">
                                <h4 className="text-pm-gold font-semibold mb-3">Stylistes & Créateurs</h4>
                                <p className="text-pm-off-white/70 text-sm mb-4">
                                    Présentez vos créations et participez à cette célébration de la mode gabonaise.
                                </p>
                                <Link 
                                    to="/fashion-day-application" 
                                    className="inline-block px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors text-sm"
                                >
                                    Postuler comme styliste
                                </Link>
                            </div>
                            <div className="bg-pm-gold/10 border border-pm-gold/20 rounded-lg p-6">
                                <h4 className="text-pm-gold font-semibold mb-3">Partenaires & Sponsors</h4>
                                <p className="text-pm-off-white/70 text-sm mb-4">
                                    Associez votre marque à cet événement prestigieux de la mode gabonaise.
                                </p>
                                <Link 
                                    to="/fashion-day-application" 
                                    className="inline-block px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors text-sm"
                                >
                                    Devenir partenaire
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            
            {/* Artists */}
            {selectedEdition.artists && selectedEdition.artists.length > 0 && (
                <section className="mt-16">
                    <h3 className="section-title">Performances Artistiques</h3>
                    <div className="space-y-4 max-w-6xl mx-auto">
                        {selectedEdition.artists.map((artist: Artist, index: number) => (
                            <div key={`${artist.name}-${index}`} className="bg-pm-dark/50 border border-pm-gold/20 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center">
                                        <MicrophoneIcon className="w-6 h-6 text-pm-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-playfair text-pm-gold">{artist.name}</h4>
                                        <p className="text-pm-off-white/70 text-sm">{artist.description}</p>
                                    </div>
                                </div>
                                
                                {/* Message spécial pour l'édition 2 */}
                                {selectedEdition.edition === 2 && (
                                    <div className="bg-pm-gold/10 border border-pm-gold/20 rounded-lg p-4">
                                        <p className="text-pm-gold font-semibold text-sm mb-2">Recherche d'artistes</p>
                                        <p className="text-pm-off-white/70 text-sm mb-3">
                                            Nous recherchons d'autres artistes pour enrichir cette édition. Musiciens, danseurs, slameurs, tous les talents sont les bienvenus !
                                        </p>
                                        <Link 
                                            to="/fashion-day-application" 
                                            className="inline-block px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors text-sm"
                                        >
                                            Postuler comme artiste
                                        </Link>
                                    </div>
                                )}
                            </div>
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

            {/* Message pour l'édition 2 si pas de partenaires */}
            {selectedEdition.edition === 2 && (!selectedEdition.partners || selectedEdition.partners.length === 0) && (
                <section className="mt-16">
                    <h3 className="section-title">Partenaires & Sponsors</h3>
                    <div className="text-center max-w-4xl mx-auto">
                        <p className="text-pm-off-white/80 mb-6">
                            Rejoignez-nous en tant que partenaire pour cette édition exceptionnelle.
                        </p>
                        <div className="bg-pm-gold/10 border border-pm-gold/20 rounded-lg p-8">
                            <h4 className="text-pm-gold font-semibold text-xl mb-4">Devenez Partenaire</h4>
                            <p className="text-pm-off-white/70 mb-6">
                                Associez votre marque à l'événement mode le plus prestigieux du Gabon. 
                                Bénéficiez d'une visibilité exceptionnelle et d'un réseau de professionnels de la mode.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/fashion-day-application" 
                                    className="px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors"
                                >
                                    Devenir partenaire
                                </Link>
                                <button 
                                    onClick={() => setShowPressbookModal(true)}
                                    className="px-6 py-3 border border-pm-gold text-pm-gold font-semibold rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors"
                                >
                                    Télécharger le pressbook
                                </button>
                            </div>
                        </div>
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

      {/* Modal du Pressbook */}
      {showPressbookModal && (
        <PressbookGenerator onClose={() => setShowPressbookModal(false)} />
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
