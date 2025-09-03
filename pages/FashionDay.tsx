import React, { useState } from 'react';
import { fashionDayEvents } from '../constants/data';
import ImageCarousel from '../components/ImageCarousel';
import { CalendarDaysIcon, MapPinIcon, SparklesIcon, UserGroupIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';

const FashionDay: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState(fashionDayEvents[0]);

  return (
    <div className="bg-pm-dark text-pm-off-white py-20">
      <SEO 
        title="Perfect Fashion Day"
        description="Revivez les éditions du Perfect Fashion Day, l'événement mode incontournable au Gabon. Découvrez les thèmes, les stylistes et les moments forts."
        keywords="Perfect Fashion Day, défilé de mode Gabon, événement mode Libreville, stylistes gabonais"
      />
      <div className="container mx-auto px-6">
        <h1 className="text-6xl font-playfair text-pm-gold text-center mb-4">Perfect Fashion Day</h1>
        <p className="text-center text-lg max-w-3xl mx-auto text-pm-off-white/80 mb-12">
          Plus qu'un défilé, une célébration de la créativité, de la culture et de l'identité gabonaise.
        </p>

        {/* Edition Selector */}
        <div className="flex justify-center gap-4 mb-12">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {selectedEdition.stylists.map((stylist) => (
                  <div key={stylist.name} className="bg-pm-dark p-4 border border-pm-gold/10">
                    <ImageCarousel images={stylist.images} altText={stylist.name} />
                    <div className="text-center mt-4">
                      <h4 className="text-xl font-bold text-pm-gold">{stylist.name}</h4>
                      <p className="text-sm text-pm-off-white/70">{stylist.description}</p>
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