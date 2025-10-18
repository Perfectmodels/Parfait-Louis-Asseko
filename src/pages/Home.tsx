import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import TestimonialCarousel from '../components/TestimonialCarousel';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import { ApiKeys, NewsItem } from '../types';
import CountdownTimer from '../components/CountdownTimer';
import { ShareIcon, XMarkIcon, CheckIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { FacebookIcon, TwitterIcon, WhatsAppIcon } from '../components/SocialIcons';

// --- Helper & Modal Components for Sharing ---
const generateShortLink = async (
  options: { link: string; title: string; description: string; imageUrl: string; },
  apiKeys: ApiKeys | undefined
): Promise<string> => {
  const { link, title, description, imageUrl } = options;
  const dynamicLinksConfig = apiKeys?.firebaseDynamicLinks;

  if (!dynamicLinksConfig?.webApiKey) {
    console.warn('Firebase Dynamic Links API key not configured. Falling back to long link.');
    return link;
  }

  const endpoint = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${dynamicLinksConfig.webApiKey}`;

  const requestBody = {
    dynamicLinkInfo: {
      domainUriPrefix: dynamicLinksConfig.domainUriPrefix,
      link: link,
      socialMetaTagInfo: {
        socialTitle: title,
        socialDescription: description,
        socialImageLink: imageUrl,
      },
    },
    suffix: { option: "SHORT" }
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || 'Failed to generate short link.');
    }
    const data = await response.json();
    return data.shortLink || link;
  } catch (error) {
    console.error('Error generating dynamic link:', error);
    return link;
  }
};

const ShareModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    url: string;
    isGenerating: boolean;
}> = ({ isOpen, onClose, title, url, isGenerating }) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setCopied(false);
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, url, onClose]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;
    
    const shareText = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                    <h2 className="text-xl font-playfair text-pm-gold">Partager</h2>
                    <button onClick={onClose} className="text-pm-off-white/70 hover:text-white" aria-label="Fermer"><XMarkIcon className="w-6 h-6"/></button>
                </header>
                <main className="p-6 space-y-4">
                    {isGenerating ? (
                        <div className="flex items-center justify-center h-24">
                            <p className="text-pm-gold animate-pulse">Génération du lien...</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-2">
                                <input type="text" readOnly value={url} className="admin-input flex-grow !pr-10" />
                                <button onClick={handleCopy} className="relative -ml-10 text-pm-off-white/70 hover:text-pm-gold">
                                    {copied ? <CheckIcon className="w-5 h-5 text-green-500" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="flex justify-center gap-4 pt-2">
                                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold"><FacebookIcon className="w-10 h-10" /></a>
                                <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold"><TwitterIcon className="w-10 h-10 bg-white rounded-full p-1" /></a>
                                <a href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="text-pm-off-white/70 hover:text-pm-gold"><WhatsAppIcon className="w-10 h-10" /></a>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

// --- News Carousel Component ---
interface NewsCarouselProps {
    newsItems: NewsItem[];
    apiKeys: ApiKeys | undefined;
}

const NewsCarousel: React.FC<NewsCarouselProps> = ({ newsItems, apiKeys }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [shortUrl, setShortUrl] = useState('');
    const [isGeneratingLink, setIsGeneratingLink] = useState(false);
    
    useEffect(() => {
        if (newsItems.length < 2) return;
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % newsItems.length);
        }, 30000);
        return () => clearInterval(intervalId);
    }, [newsItems.length]);

    const goToNews = (index: number) => {
        setCurrentIndex(index);
    };
    
    const handleShareClick = async () => {
        setIsShareOpen(true);
        setShortUrl('');
        setIsGeneratingLink(true);

        const currentNews = newsItems[currentIndex];
        if (!currentNews) return;

        const longUrl = currentNews.link ? `${window.location.origin}${currentNews.link}` : window.location.origin;
        const generatedUrl = await generateShortLink({
            link: longUrl,
            title: currentNews.title,
            description: currentNews.excerpt,
            imageUrl: currentNews.imageUrl,
        }, apiKeys);

        setShortUrl(generatedUrl);
        setIsGeneratingLink(false);
    };


    const currentNews = newsItems[currentIndex];
    if (!currentNews) return null;

    return (
        <>
            <div className="relative max-w-6xl mx-auto bg-black border border-pm-gold/20 rounded-lg overflow-hidden shadow-2xl shadow-black/50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative aspect-video w-full flex items-end justify-start text-left"
                    >
                        <img src={currentNews.imageUrl} alt={currentNews.title} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                        <div className="relative z-10 p-6 md:p-10 lg:p-12 text-white md:w-3/4 lg:w-2/3">
                            <h3 className="text-2xl md:text-4xl font-playfair text-pm-gold font-extrabold mb-3">{currentNews.title}</h3>
                            <p className="text-sm md:text-base text-pm-off-white/90 mb-5">{currentNews.excerpt}</p>
                             <div className="flex items-center gap-4">
                                {currentNews.link && (
                                    <Link to={currentNews.link} className="inline-block px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                                        Lire la suite
                                    </Link>
                                )}
                                <button onClick={handleShareClick} className="p-3 bg-pm-dark/50 border border-pm-gold/30 rounded-full text-pm-gold hover:bg-pm-gold/20 transition-colors" aria-label="Partager cette actualité">
                                    <ShareIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {newsItems.length > 1 && (
                    <>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                            {newsItems.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToNews(index)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-pm-gold scale-125' : 'bg-white/40 hover:bg-white/80'}`}
                                    aria-label={`Aller à l'actualité ${index + 1}`}
                                />
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-pm-gold/20 z-10">
                             <motion.div
                                key={currentIndex}
                                className="h-full bg-pm-gold"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 30, ease: 'linear' }}
                             />
                        </div>
                    </>
                )}
            </div>
             <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                title={currentNews.title}
                url={shortUrl}
                isGenerating={isGeneratingLink}
            />
        </>
    );
};


const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, siteConfig, socialLinks, fashionDayEvents, models, siteImages, testimonials, agencyServices, newsItems, apiKeys } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);
  
  const nextEvent = fashionDayEvents
    .filter(e => new Date(e.date).getTime() > new Date().getTime())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];


  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Perfect Models Management",
    "url": window.location.origin,
    "logo": siteConfig.logo,
    "sameAs": [
      socialLinks.facebook,
      socialLinks.instagram,
      socialLinks.youtube
    ].filter(Boolean)
  };

  return (
    <div className="bg-pm-dark text-pm-off-white">

      <SEO 
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241"
        image={'https://i.ibb.co/NdrpzGpm/blob.jpg'}
        schema={organizationSchema}
        type="website"
      />

      {/* 1. Hero Section with Integrated Event */}
      <section 
        className="relative h-[90vh] lg:h-screen flex flex-col items-center justify-center text-center bg-cover bg-center" 
        style={{ backgroundImage: `url('${siteImages.hero}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/80 to-transparent"></div>
        <div className="relative z-10 p-6 animate-fade-in w-full max-w-5xl space-y-6 sm:space-y-8">
          <div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-playfair text-pm-gold font-extrabold leading-tight tracking-tighter" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
              L'Élégance Redéfinie
            </h1>
            <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl mx-auto text-pm-off-white/90">
              Nous révélons les talents et valorisons la beauté africaine.
            </p>
          </div>
          
          {nextEvent ? (
              <div className="mt-10 bg-black/50 backdrop-blur-sm py-6 px-4 rounded-lg border border-pm-gold/20">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-playfair text-white mb-2">
                      Prochain Événement : Perfect Fashion Day - Édition {nextEvent.edition}
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-pm-gold mb-6">"{nextEvent.theme}"</p>
                  <div className="my-4 sm:my-6">
                     <CountdownTimer targetDate={nextEvent.date} />
                  </div>
                  <Link to="/fashion-day-application" className="mt-4 inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
                      Participer à l'Édition 2
                  </Link>
              </div>
          ) : (
              <div className="mt-10">
                  <p className="text-pm-off-white/80 max-w-3xl mx-auto">
                      Restez à l'écoute pour l'annonce de notre prochaine édition !
                  </p>
              </div>
          )}
        </div>
      </section>

      <div className="page-container">
        {/* 2. Agency Presentation */}
        <section>
            <div className="content-section">
                <h2 className="section-title">Notre Agence</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center mt-8">
                    <div className="p-1 border-2 border-pm-gold/30 hover:border-pm-gold transition-all duration-300 rounded-lg">
                        <img src={siteImages.about} alt="L'équipe de Perfect Models Management" className="w-full h-full object-cover rounded-md"/>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-lg text-pm-off-white/80 mb-6 leading-relaxed">
                            {agencyInfo.about.p1}
                        </p>
                        <div className="flex justify-center md:justify-start gap-x-4 text-sm font-bold text-pm-gold/90 mb-8 uppercase tracking-wider">
                            <span>Professionnalisme</span><span>•</span><span>Excellence</span><span>•</span><span>Éthique</span>
                        </div>
                        <Link to="/agence" className="inline-block px-10 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                            Découvrir l'agence
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        {/* News Carousel Section */}
        {newsItems && newsItems.length > 0 && (
            <section>
                <h2 className="section-title">Nos Actualités</h2>
                <NewsCarousel newsItems={newsItems} apiKeys={apiKeys} />
            </section>
        )}

        {/* 3. Services */}
        <section>
          <div className="content-section">
            <h2 className="section-title">Nos Prestations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {featuredServices.map(service => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/services" className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                Découvrir tous nos services
              </Link>
            </div>
          </div>
        </section>
      </div>
      
      {/* 4. Models (Full bleed for visual variety) */}
      <section className="bg-black py-20 lg:py-28">
        <div className="container mx-auto px-6">
            <h2 className="section-title">Nos Mannequins</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {publicModels.map(model => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/mannequins" className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                Voir tous les mannequins
              </Link>
            </div>
        </div>
      </section>

      <div className="page-container">
        {/* 7. Testimonials */}
        {testimonials && testimonials.length > 0 && (
          <section>
            <div className="content-section">
              <h2 className="section-title">Témoignages</h2>
              <div className="mt-8">
                <TestimonialCarousel />
              </div>
            </div>
          </section>
        )}

        {/* 8. Call to Action */}
        <section>
          <div className="content-section text-center">
            <h2 className="section-title">Prêts à nous rejoindre ?</h2>
            <p className="section-subtitle">
              Mannequin, styliste ou partenaire, rejoignez l'aventure Perfect Models Management dès aujourd'hui et façonnons ensemble l'avenir de la mode.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/casting-formulaire" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20">
                Postuler
              </Link>
              <Link to="/contact" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                Nous Contacter
              </Link>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
};

export default Home;