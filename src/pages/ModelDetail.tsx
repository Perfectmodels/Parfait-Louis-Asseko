
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import NotFound from './NotFound';
import BookingForm from '../components/BookingForm';
import SEO from '../components/SEO';
import { 
    ArrowLeftIcon, 
    XMarkIcon,
    PhotoIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    SparklesIcon,
    CalendarIcon,
    UserIcon
} from '@heroicons/react/24/outline';

const ModelDetail: React.FC = () => {
  const { data, isInitialized } = useData();
  const { id } = useParams<{ id: string }>();
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const model = data?.models.find(m => m.id === id);

  if (!isInitialized) {
    return <div className="min-h-screen bg-pm-dark" />;
  }

  if (!model) {
    return <NotFound />;
  }

  const portfolioImages = model.portfolioImages || [];

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO title={`${model.name} - Portfolio`} />
      
      {/* Hero Section */}
      <div className="relative h-[70vh] min-h-[500px] text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={model.imageUrl} 
            alt={model.name}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-16 relative">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-4">
              {model.name}
            </h1>
            <p className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-6">
              Découvrez le portfolio de {model.name}, un de nos talents exceptionnels.
            </p>
            <button 
              onClick={() => setBookingOpen(true)}
              className="px-8 py-3 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Booker ce mannequin
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="space-y-16">
        <section className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-1 space-y-6">
                <InfoSection title="Mensurations">
                    <InfoItem label="Taille" value={model.height} />
                    <InfoItem label="Poitrine" value={model.measurements.chest} />
                    <InfoItem label="Taille (vêtement)" value={model.measurements.waist} />
                    <InfoItem label="Hanches" value={model.measurements.hips} />
                    <InfoItem label="Pointure" value={model.measurements.shoeSize} />
                </InfoSection>
                <InfoSection title="Informations">
                    {model.age && <InfoItem label="Âge" value={`${model.age} ans`} />}
                    {model.location && <InfoItem label="Lieu" value={model.location} />}
                     <InfoItem label="Catégories" value={model.categories.join(', ')} />
                </InfoSection>
            </div>
            <div className="md:col-span-2 space-y-8">
                <BioSection icon={UserIcon} title="Parcours" content={model.journey} />
                <BioSection icon={SparklesIcon} title="Expérience" content={model.experience} />
            </div>
        </section>

        {portfolioImages.length > 0 && (
            <section>
                <h2 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Portfolio</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {portfolioImages.map((img, index) => (
                        <div key={index} onClick={() => setSelectedImageIndex(index)} className="aspect-[4/5] rounded-lg overflow-hidden cursor-pointer group">
                            <img src={img} alt={`${model.name} portfolio ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <PhotoIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        )}

        <Link to="/models" className="inline-flex items-center gap-2 text-pm-gold font-semibold text-lg group mt-12">
            <ArrowLeftIcon className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Retour au catalogue
        </Link>
        </div>
      </div>

      {bookingOpen && (
        <BookingModal 
          modelName={model.name}
          onClose={() => setBookingOpen(false)}
        />
      )}

      {selectedImageIndex !== null && (
          <Lightbox 
            photos={portfolioImages}
            currentIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
          />
      )}
    </div>
  );
};

const InfoSection: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div className="bg-black/30 border border-pm-gold/20 rounded-xl p-6">
        <h3 className="text-xl font-playfair text-pm-gold mb-4">{title}</h3>
        <div className="space-y-3">{children}</div>
    </div>
);

const InfoItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div className="flex justify-between items-baseline text-sm border-b border-pm-gold/10 pb-2">
        <span className="text-pm-off-white/70">{label}</span>
        <span className="font-semibold text-pm-off-white text-right">{value}</span>
    </div>
);

const BioSection: React.FC<{icon: React.ElementType, title: string, content: string}> = ({ icon: Icon, title, content}) => (
    <div>
        <h3 className="flex items-center gap-3 text-2xl font-playfair text-pm-gold mb-4">
            <Icon className="w-6 h-6" />
            {title}
        </h3>
        <p className="text-pm-off-white/80 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
);

const BookingModal: React.FC<{ modelName: string, onClose: () => void }> = ({ modelName, onClose }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-pm-dark border border-pm-gold/30 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <header className="p-4 flex justify-between items-center border-b border-pm-gold/20 flex-shrink-0">
                <h2 className="text-2xl font-playfair text-pm-gold">Booking: {modelName}</h2>
                <button onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-8 h-8" /></button>
            </header>
            <main className="p-6 overflow-y-auto">
                <BookingForm prefilledModelName={modelName} onSuccess={() => setTimeout(onClose, 3000)} />
            </main>
        </div>
    </div>
);

const Lightbox: React.FC<{ photos: string[], currentIndex: number, onClose: () => void }> = ({ photos, currentIndex, onClose }) => {
    const [index, setIndex] = useState(currentIndex);

    const handleNext = () => setIndex((prev) => (prev + 1) % photos.length);
    const handlePrev = () => setIndex((prev) => (prev - 1 + photos.length) % photos.length);

    return (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
             <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white z-10"><XMarkIcon className="w-10 h-10" /></button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
                <button onClick={handlePrev} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><ChevronLeftIcon className="w-8 h-8 text-white" /></button>
                <img src={photos[index]} alt={`Portfolio ${index + 1}`} className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                <button onClick={handleNext} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><ChevronRightIcon className="w-8 h-8 text-white" /></button>
                <div className="absolute bottom-6 text-center text-white text-sm">{index + 1} / {photos.length}</div>
            </div>
        </div>
    );
};

export default ModelDetail;
