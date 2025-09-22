import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { FashionDayEvent, Stylist } from '../types';
import SEO from '../components/SEO';
import { StarIcon, UserGroupIcon, SparklesIcon, XMarkIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const FashionDay: React.FC = () => {
  const { data, isInitialized } = useData();
  const [edition, setEdition] = useState<FashionDayEvent | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && data?.fashionDayEvents) {
      const sortedEditions = [...data.fashionDayEvents].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setEdition(sortedEditions[0] || null);
    }
  }, [isInitialized, data]);

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  if (!edition) {
    return (
        <div className="bg-pm-dark">
          <SEO title="Perfect Fashion Day" description="Bientôt de nouvelles informations sur notre prochain événement." />
            <div className="text-center py-40 text-pm-off-white">
                <h1 className="text-4xl font-playfair mb-4">Perfect Fashion Day</h1>
                <p className="text-pm-off-white/70">Aucun événement n'est programmé. Revenez bientôt !</p>
            </div>
        </div>
    );
  }

  const { theme, description, imageUrl, stylists, partners, featuredModels } = edition;

  return (
    <div className="bg-pm-dark">
        <SEO
            title={`Perfect Fashion Day: ${theme}`}
            description={description}
            image={imageUrl}
        />
        
        {/* Hero Section */}
        <div className="relative h-[90vh] min-h-[700px] text-white overflow-hidden">
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent" />
            </motion.div>
            <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                    className="text-6xl md:text-8xl font-playfair font-bold text-white mb-6"
                >Perfect Fashion Day</motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                    className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-8"
                >{description}</motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                >
                    <Link
                        to="/fashion-day-application-form"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all shadow-lg hover:shadow-pm-gold/20"
                    >
                        <span>Participer</span>
                        <ArrowRightIcon className="w-5 h-5" />
                    </Link>
                </motion.div>
            </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-20 md:py-28">
            <div className="space-y-20">
                <section className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-pm-gold/10 border border-pm-gold/20 rounded-full px-4 py-2 mb-4">
                        <StarIcon className="w-5 h-5 text-pm-gold" />
                        <span className="text-pm-gold font-semibold text-sm">Thème de l'édition :</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-playfair text-pm-off-white">"{theme}"</h2>
                </section>
                
                {stylists && stylists.length > 0 && (
                    <section>
                        <h3 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Les Créateurs à l'honneur</h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {stylists.map(stylist => (
                                <StylistCard key={stylist.name} stylist={stylist} onImageClick={setSelectedImage} />
                            ))}
                        </div>
                    </section>
                )}

                {featuredModels && featuredModels.length > 0 && (
                    <section className="text-center bg-black/30 border border-pm-gold/20 rounded-2xl p-12">
                        <UserGroupIcon className="w-16 h-16 text-pm-gold mx-auto mb-6" />
                        <h3 className="text-3xl font-bold font-playfair mb-6 text-pm-off-white">Mannequins Vedettes</h3>
                        <p className="text-lg text-pm-off-white/70 max-w-2xl mx-auto">
                            {featuredModels.join(', ')} et toute la Perfect Models Squad ont illuminé le podium de leur talent et de leur prestance.
                        </p>
                    </section>
                )}

                {partners && partners.length > 0 && (
                    <section>
                        <h3 className="text-3xl md:text-4xl font-bold font-playfair text-center mb-12 text-pm-off-white">Nos Partenaires</h3>
                        <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-8 max-w-4xl mx-auto">
                            {partners.map(p => (
                                <div key={p.name} className="text-center">
                                    <p className="text-2xl font-bold tracking-wider text-pm-off-white">{p.name}</p>
                                    <p className="text-sm text-pm-gold/80 font-semibold uppercase tracking-widest">{p.type}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>

        {selectedImage && (
            <ImageLightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
    </div>
  );
};

const StylistCard: React.FC<{ stylist: Stylist, onImageClick: (img: string) => void }> = ({ stylist, onImageClick }) => (
    <div className="bg-black/30 border border-pm-gold/20 rounded-xl overflow-hidden group">
        <div className="h-48 overflow-hidden">
             <img src={stylist.images?.[0]} alt={stylist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6">
            <h4 className="text-2xl font-playfair text-pm-gold mb-2">{stylist.name}</h4>
            <p className="text-sm text-pm-off-white/70 mb-4 line-clamp-2">{stylist.description}</p>
            {stylist.images && stylist.images.length > 1 && (
                <button onClick={() => onImageClick(stylist.images?.[0] || '')} className="font-semibold text-pm-gold text-sm hover:underline">
                    Voir la collection ({stylist.images.length} photos)
                </button>
            )}
        </div>
    </div>
);

const ImageLightbox: React.FC<{ image: string, onClose: () => void }> = ({ image, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
      role="dialog" aria-modal="true"
    >
      <button 
        className="absolute top-6 right-6 text-white hover:text-pm-gold transition-colors z-10" 
        aria-label="Fermer"
        onClick={onClose}
      >
        <XMarkIcon className="w-10 h-10"/>
      </button>
      <div className="relative max-w-4xl max-h-[90vh] cursor-default" onClick={e => e.stopPropagation()}>
        <img src={image} alt="Vue agrandie" className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
      </div>
    </div>
);

export default FashionDay;
