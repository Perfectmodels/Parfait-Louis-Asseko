import React, { useState, useEffect, useRef } from 'react';
// FIX: Corrected react-router-dom import statement to resolve module resolution errors.
import { Link, useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { ChevronLeftIcon, XMarkIcon } from '@heroicons/react/24/solid';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import BookingForm from '../components/BookingForm';

const ModelDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [isViewingOwnProfile, setIsViewingOwnProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
  const model = data?.models.find(m => m.id === id);

  const modalRef = useRef<HTMLDivElement>(null);
  const prevActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const userRole = sessionStorage.getItem('classroom_role');
    const userId = sessionStorage.getItem('userId');
    setIsViewingOwnProfile(userRole === 'student' && userId === id);
  }, [id]);

  useEffect(() => {
    const isModalOpen = isBookingModalOpen || !!selectedImage;
    if (isModalOpen) {
        prevActiveElement.current = document.activeElement as HTMLElement;
        
        // Timeout needed to allow modal to render before focusing
        setTimeout(() => {
            modalRef.current?.focus();
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsBookingModalOpen(false);
                    setSelectedImage(null);
                }
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
  }, [isBookingModalOpen, selectedImage]);

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!model) {
    return <NotFound />;
  }
  
  const modelSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": model.name,
    "jobTitle": "Mannequin",
    "image": model.imageUrl,
    "gender": model.gender === 'Homme' ? 'https://schema.org/Male' : 'https://schema.org/Female',
    "height": {
        "@type": "QuantitativeValue",
        "value": model.height.replace('m', '.').replace(/[^0-9.]/g, ''),
        "unitCode": "MTR"
    },
    "worksFor": {
        "@type": "Organization",
        "name": "Perfect Models Management",
        "url": window.location.origin
    },
    "url": window.location.href,
    "description": `Portfolio de ${model.name}, mannequin chez Perfect Models Management.`
  };

  const seoDescription = `Explorez le portfolio de ${model.name}, mannequin ${model.gender} de ${model.height} chez Perfect Models Management. Découvrez ses photos, mensurations (${model.measurements.chest}-${model.measurements.waist}-${model.measurements.hips}), et son parcours unique dans la mode.`;

  return (
    <>
      <SEO
        title={`${model.name} | Portfolio`}
        description={seoDescription}
        keywords={`${model.name}, mannequin ${model.gender}, modèle photo gabon, agence pmm, booker ${model.name}, mensurations mannequin`}
        image={model.imageUrl}
        schema={modelSchema}
      />
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6">
          <Link to="/mannequins" className="inline-flex items-center gap-2 text-pm-gold mb-8 hover:underline">
            <ChevronLeftIcon className="w-5 h-5" />
            Retour au catalogue
          </Link>
          <div className="flex flex-col lg:flex-row gap-12 bg-black p-4 sm:p-8 border border-pm-gold/20">
            <div className="lg:w-1/3">
              <div className="aspect-[3/4] border-2 border-pm-gold p-2">
                  <img src={model.imageUrl} alt={model.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="lg:w-2/3">
              <h1 className="text-4xl sm:text-5xl font-playfair text-pm-gold">{model.name}</h1>
              
              <div className="border-b border-pm-gold/20 mt-6 mb-6">
                <nav role="tablist" aria-label="Informations du mannequin" className="flex space-x-8">
                  <TabButton name="Détails" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} id="tab-details" controls="tab-panel-details" />
                  <TabButton name="Expérience & Parcours" isActive={activeTab === 'experience'} onClick={() => setActiveTab('experience')} id="tab-experience" controls="tab-panel-experience" />
                </nav>
              </div>

              <div>
                <div role="tabpanel" id="tab-panel-details" aria-labelledby="tab-details" hidden={activeTab !== 'details'}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 text-lg animate-fade-in">
                      <InfoItem label="Taille" value={model.height} />
                      <InfoItem label="Genre" value={model.gender} />
                      {model.age && <InfoItem label="Âge" value={`${model.age} ans`} />}
                      {model.location && <InfoItem label="Lieu" value={model.location} />}
                      <InfoItem label="Poitrine" value={model.measurements?.chest || 'N/A'} />
                      <InfoItem label="Taille (vêtement)" value={model.measurements?.waist || 'N/A'} />
                      <InfoItem label="Hanches" value={model.measurements?.hips || 'N/A'} />
                      <InfoItem label="Pointure" value={model.measurements?.shoeSize || 'N/A'} />
                      <div className="col-span-full">
                          <InfoItem label="Catégories" value={(model.categories || []).join(', ')} />
                      </div>
                       {model.distinctions && model.distinctions.length > 0 && (
                          <div className="col-span-full mt-4">
                              <h3 className="text-lg font-bold text-pm-off-white/80 border-b border-pm-gold/20 pb-1 mb-3">Palmarès & Distinctions</h3>
                              <div className="space-y-3">
                                  {model.distinctions.map((distinction, index) => (
                                      <div key={index}>
                                          <h4 className="font-semibold text-pm-off-white">{distinction.name}</h4>
                                          <ul className="list-disc list-inside text-pm-off-white/90 pl-4 text-base">
                                              {distinction.titles.map((title, titleIndex) => (
                                                  <li key={titleIndex}>{title}</li>
                                              ))}
                                          </ul>
                                      </div>
                                  ))}
                              </div>
                          </div>
                       )}
                    </div>
                </div>
                <div role="tabpanel" id="tab-panel-experience" aria-labelledby="tab-experience" hidden={activeTab !== 'experience'}>
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <h2 className="text-2xl font-playfair text-pm-gold mb-2">Expérience</h2>
                      <p className="text-pm-off-white/80 leading-relaxed whitespace-pre-wrap">{model.experience}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-playfair text-pm-gold mb-2">Parcours</h2>
                      <p className="text-pm-off-white/80 leading-relaxed whitespace-pre-wrap">{model.journey}</p>
                    </div>
                  </div>
                </div>
              </div>

               <div className="mt-10">
                  {!isViewingOwnProfile && (
                    <button onClick={() => setIsBookingModalOpen(true)} className="inline-block text-center px-10 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                        Booker ce mannequin
                    </button>
                  )}
               </div>
            </div>
          </div>

          {model.portfolioImages && model.portfolioImages.length > 0 && (
            <section className="mt-16">
              <h2 className="section-title">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {model.portfolioImages.map((img, index) => (
                  <button key={index} onClick={() => setSelectedImage(img)} className="group block aspect-[3/4] bg-pm-dark overflow-hidden transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-pm-gold">
                    <img src={img} alt={`${model.name} portfolio image ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {isBookingModalOpen && (
        <div
          ref={isBookingModalOpen ? modalRef : null}
          tabIndex={-1}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <header className="p-4 flex justify-between items-center border-b border-pm-gold/20 flex-shrink-0">
                <h2 id="booking-modal-title" className="text-2xl font-playfair text-pm-gold">Booking: {model.name}</h2>
                <button onClick={() => setIsBookingModalOpen(false)} className="text-pm-off-white/70 hover:text-white" aria-label="Fermer la fenêtre de booking"><XMarkIcon className="w-6 h-6"/></button>
            </header>
            <main className="p-6 overflow-y-auto flex-grow">
              <BookingForm 
                prefilledModelName={model.name}
                onSuccess={() => {
                  setTimeout(() => setIsBookingModalOpen(false), 3000);
                }}
              />
            </main>
          </div>
        </div>
      )}

      {selectedImage && (
        <div 
          ref={selectedImage ? modalRef : null}
          tabIndex={-1}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vue agrandie de l'image"
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-pm-gold transition-colors z-10 p-2 bg-black/50 rounded-full" 
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

const TabButton: React.FC<{name: string, isActive: boolean, onClick: () => void, id: string, controls: string}> = ({ name, isActive, onClick, id, controls }) => (
    <button
        role="tab"
        id={id}
        aria-controls={controls}
        aria-selected={isActive}
        onClick={onClick}
        className={`relative py-2 font-medium text-lg uppercase tracking-wider transition-colors ${
            isActive 
            ? 'text-pm-gold' 
            : 'text-pm-off-white/70 hover:text-pm-gold'
        }`}
    >
        {name}
        <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-pm-gold transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}/>
    </button>
);

const InfoItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <span className="font-bold text-pm-off-white/60 block text-sm uppercase tracking-wider">{label}</span> 
        <span className="text-pm-off-white/90">{value}</span>
    </div>
);


export default ModelDetail;