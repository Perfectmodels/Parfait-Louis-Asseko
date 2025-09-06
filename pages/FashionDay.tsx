import React, { useState } from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, MicrophoneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent } from '../types';

const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  const fashionDayEvents = data?.fashionDayEvents || [];
  
  const [selectedEdition, setSelectedEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  React.useEffect(() => {
    if (fashionDayEvents.length > 0) {
      setSelectedEdition(fashionDayEvents[0]);
    }
  }, [fashionDayEvents]);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  if (fashionDayEvents.length === 0 || !selectedEdition) {
    return <div className="min-h-screen flex items-center justify-center">Aucun événement à afficher.</div>;
  }

  return (
    <>
      <div className="bg-pm-dark text-pm-off-white py-16 lg:py-24">
        <SEO 
          title="Perfect Fashion Day | L'Événement Mode de Référence"
          description="Vibrez au rythme du Perfect Fashion Day, l'événement mode incontournable à Libreville. Revivez les éditions, découvrez les créateurs gabonais et les moments forts qui célèbrent la mode africaine."
          keywords="perfect fashion day, défilé de mode gabon, événement mode libreville, créateurs gabonais, mode africaine, fashion week gabon"
        />
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-playfair text-pm-gold text-center mb-4">Perfect Fashion Day</h1>
          <p className="text-center text-lg max-w-3xl mx-auto text-pm-off-white/80 mb-10 lg:mb-14">
            Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise.
          </p>

          {/* Edition Selector */}
          <div className="flex justify-center gap-4 mb-10 lg:mb-14">
            {fashionDayEvents.map(event => (
              <button
                key={event.edition}
                onClick={() => setSelectedEdition(event)}
                className={`px-6 py-2 text-sm uppercase tracking-widest rounded-full transition-colors duration-300 ${selectedEdition.edition === event.edition ? 'bg-pm-gold text-pm-dark' : 'bg-black border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'}`}
              >
                Édition {event.edition} ({event.date.split(' ').pop()})
              </button>
            ))}
          </div>

          {/* Event Details */}
          <div className="bg-black border border-pm-gold/20 p-8 md:p-12">
            <h2 className="text-4xl font-playfair text-center text-pm-gold mb-2">Thème : "{selectedEdition.theme}"</h2>
            <p className="text-center text-pm-off-white/70 mb-8">{selectedEdition.date}</p>
            <p className="text-center max-w-3xl mx-auto mb-12">{selectedEdition.description}</p>
            
            {selectedEdition.location && (
              <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
                <InfoPill icon={CalendarDaysIcon} title="Date" content={selectedEdition.date} />
                <InfoPill icon={MapPinIcon} title="Lieu" content={selectedEdition.location} />
                <InfoPill icon={SparklesIcon} title="Promoteur" content={selectedEdition.promoter || 'Parfait Asseko'} />
              </div>
            )}
            
            {selectedEdition.edition === 2 && (
              <div className="text-center my-12 py-8 border-y border-pm-gold/10 bg-black/30">
                  <h3 className="text-3xl font-playfair text-pm-gold mb-4">Rejoignez l'Aventure de l'Édition 2</h3>
                  <p className="text-pm-off-white/80 max-w-3xl mx-auto mb-8">
                      Pour cette nouvelle édition, nous recherchons des talents visionnaires pour donner vie au thème "L’Art de Se Révéler". Que vous soyez mannequin, styliste, partenaire, photographe ou que vous ayez un autre talent à partager, nous vous invitons à rejoindre cette célébration de la mode.
                  </p>
                  <div className="mt-8">
                      <ReactRouterDOM.Link to="/fashion-day-application" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20">
                          Participer à l'événement
                      </ReactRouterDOM.Link>
                  </div>
              </div>
            )}


            {/* Featured Artists and Models */}
            {selectedEdition.artists && selectedEdition.featuredModels && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12 pt-8 border-t border-pm-gold/10">
                  <div>
                      <h3 className="flex items-center gap-3 text-2xl font-playfair text-pm-gold mb-4"><MicrophoneIcon className="w-6 h-6"/> Artistes & Performances</h3>
                      <ul className="list-disc list-inside text-pm-off-white/80 space-y-2">
                          {selectedEdition.artists.map((artist, index) => <li key={index}>{artist}</li>)}
                      </ul>
                  </div>
                  <div>
                      <h3 className="flex items-center gap-3 text-2xl font-playfair text-pm-gold mb-4"><UserGroupIcon className="w-6 h-6"/> Mannequins Vedettes</h3>
                      <p className="text-pm-off-white/80">
                          {selectedEdition.featuredModels.join(', ')} et toute la Perfect Models Squad.
                      </p>
                  </div>
               </div> 
            )}

            {/* Stylists Gallery */}
            {selectedEdition.stylists && (
              <div>
                <h3 className="text-3xl font-playfair text-pm-gold text-center my-12 pt-8 border-t border-pm-gold/10">Stylistes Participants</h3>
                <div className="space-y-12">
                  {selectedEdition.stylists.map((stylist) => (
                    <div key={stylist.name} className="bg-pm-dark p-6 border border-pm-gold/10 rounded-lg">
                      <div className="text-center mb-4">
                        <h4 className="text-2xl font-bold font-playfair text-pm-gold">{stylist.name}</h4>
                        <p className="text-sm text-pm-off-white/70">{stylist.description}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                          {stylist.images.map((img, idx) => (
                              <button key={idx} onClick={() => setSelectedImage(img)} className="aspect-square block bg-black group overflow-hidden border border-transparent hover:border-pm-gold transition-colors duration-300">
                                  <img src={img} alt={`${stylist.name} - création ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                              </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedEdition.partners && (
              <div className="mt-20">
                <h3 className="text-3xl font-playfair text-pm-gold text-center my-12 pt-8 border-t border-pm-gold/10">Partenaires & Sponsors</h3>
                <div className="flex justify-center items-center gap-12 flex-wrap">
                    {selectedEdition.partners.map(p => (
                        <div key={p.name} className="text-center">
                            <p className="text-pm-gold/80 text-sm">{p.type}</p>
                            <p className="text-2xl font-bold tracking-wider">{p.name}</p>
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
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
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
    <div className="flex flex-col items-center">
        <Icon className="w-10 h-10 text-pm-gold mb-2"/>
        <span className="font-bold">{title}</span>
        <span>{content}</span>
    </div>
);


export default FashionDay;