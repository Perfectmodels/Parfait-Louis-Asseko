import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

// Chargement paresseux des composants
const TestimonialCarousel = lazy(() => import('../components/TestimonialCarousel'));
const ModelCard = lazy(() => import('../components/ModelCard'));
const ServiceCard = lazy(() => import('../components/ServiceCard'));
const NewsCard = lazy(() => import('../components/NewsCard'));
const EventCard = lazy(() => import('../components/EventCard'));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pm-gold"></div>
  </div>
);

const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return (
      <div className="min-h-screen bg-pm-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pm-gold"></div>
      </div>
    );
  }

  const { 
    agencyInfo, 
    agencyPartners, 
    fashionDayEvents, 
    models, 
    siteImages, 
    testimonials, 
    agencyServices,
    news = []
  } = data;
  
  // Filtrer les événements à venir
  const upcomingEvents = fashionDayEvents
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
    
  // Dernières actualités
  const latestNews = [...news]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);

  return (
    <div className="text-pm-off-white">
      <SEO 
        title="Accueil | L'Élégance Redéfinie"
        description="Perfect Models Management, l'agence de mannequins de référence à Libreville, Gabon. Découvrez nos talents, nos événements mode exclusifs et notre vision qui redéfinit l'élégance africaine."
        keywords="agence de mannequins gabon, mannequin libreville, perfect models management, mode africaine, casting mannequin gabon, défilé de mode, focus model 241"
        image={siteImages.hero}
      />

      {/* 1. Hero Section */}
      <section 
        className="relative h-screen flex items-center justify-center text-center bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url('${siteImages.hero}')`}}
      >
        <div className="absolute inset-0 bg-pm-dark/80"></div>
        <div className="relative z-10 p-6">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair text-pm-gold font-extrabold leading-tight tracking-tighter" style={{ textShadow: '0 0 15px rgba(212, 175, 55, 0.7)' }}>
            L'Élégance Redéfinie
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-pm-off-white/90">
             Nous révélons les talents et valorisons la beauté africaine.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link to="/mannequins" className="w-full sm:w-auto px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform">
                Découvrir nos mannequins
            </Link>
            <Link to="/casting-formulaire" className="w-full sm:w-auto px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark">
                Nous rejoindre
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Agency Presentation */}
      <section className="page-container bg-black py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 p-2 border-2 border-pm-gold/50 hover:border-pm-gold transition-all duration-300 transform hover:scale-[1.02]">
              <img 
                src={siteImages.about} 
                alt="Perfect Models Management" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-4xl font-playfair text-pm-gold mb-6">
                <span className="relative inline-block">
                  Perfect Models Management
                  <span className="absolute -bottom-2 left-0 w-1/3 h-1 bg-pm-gold/50"></span>
                </span>
              </h2>
              <p className="text-pm-off-white/80 mb-6 leading-relaxed text-lg">
                {agencyInfo.about.p1}
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                {['PROFESSIONNALISME', 'EXCELLENCE', 'ÉTHIQUE'].map((value, index) => (
                  <span key={index} className="px-4 py-2 bg-pm-gold/10 text-pm-gold text-sm font-medium rounded-full border border-pm-gold/30">
                    {value}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/agence" 
                  className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/30"
                >
                  Découvrir l'agence
                </Link>
                <Link 
                  to="/contact" 
                  className="px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-pm-gold/10"
                >
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 3. Our Services */}
      <section className="page-container bg-pm-dark py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pm-gold font-bold tracking-widest text-sm mb-4 inline-block">NOS SERVICES</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-pm-off-white mb-4">Excellence et Professionnalisme</h2>
            <div className="w-20 h-1 bg-pm-gold mx-auto"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredServices.map(service => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
          </Suspense>
          
          <div className="text-center mt-12">
            <Link 
              to="/services" 
              className="inline-flex items-center px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20 group"
            >
              Découvrir tous nos services
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Latest News */}
      <section className="page-container bg-pm-darker py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pm-gold font-bold tracking-widest text-sm mb-4 inline-block">ACTUALITÉS</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-pm-off-white mb-4">Dernières Actualités</h2>
            <div className="w-20 h-1 bg-pm-gold mx-auto"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.map((newsItem, index) => (
                <NewsCard key={newsItem.id || index} news={newsItem} />
              ))}
            </div>
          </Suspense>
          
          <div className="text-center mt-12">
            <Link 
              to="/actualites" 
              className="inline-flex items-center px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
            >
              Voir toutes les actualités
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Upcoming Events */}
      <section className="page-container bg-black py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pm-gold font-bold tracking-widest text-sm mb-4 inline-block">ÉVÉNEMENTS</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-pm-off-white mb-4">Événements à Venir</h2>
            <p className="text-pm-off-white/70 max-w-2xl mx-auto">Découvrez nos prochains défilés, castings et événements mode</p>
            <div className="w-20 h-1 bg-pm-gold mx-auto mt-4"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            {upcomingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <EventCard key={event.id || index} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-pm-off-white/70 mb-6">Aucun événement à venir pour le moment.</p>
                <Link 
                  to="/fashion-day" 
                  className="inline-flex items-center px-6 py-2 bg-pm-gold/10 text-pm-gold font-medium rounded-full border border-pm-gold/30 hover:bg-pm-gold/20 transition-colors"
                >
                  Voir les événements passés
                </Link>
              </div>
            )}
          </Suspense>
          
          {upcomingEvents.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/fashion-day" 
                className="inline-flex items-center px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
              >
                Voir tous les événements
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 6. Our Models */}
      <section className="page-container bg-pm-darker py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-pm-gold font-bold tracking-widest text-sm mb-4 inline-block">NOS TALENTS</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-pm-off-white mb-4">Découvrez nos Mannequins</h2>
            <p className="text-pm-off-white/70 max-w-2xl mx-auto">Une sélection de nos talents les plus prometteurs</p>
            <div className="w-20 h-1 bg-pm-gold mx-auto mt-4"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {publicModels.map(model => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </Suspense>
          
          <div className="text-center mt-12">
            <Link 
              to="/mannequins" 
              className="group inline-flex items-center px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
            >
              <span>Voir tous nos mannequins</span>
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="bg-pm-dark py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521747116042-5a810fda9664?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-pm-gold font-bold tracking-widest text-sm mb-4 inline-block">TÉMOIGNAGES</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-pm-off-white mb-4">Ils nous font confiance</h2>
            <div className="w-20 h-1 bg-pm-gold mx-auto"></div>
          </div>
          
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialCarousel testimonials={testimonials} />
          </Suspense>
        </div>
      </section>

      {/* 8. Call to Action */}
      {/* 8. Call to Action */}
      <section className="relative py-20 bg-gradient-to-r from-pm-gold to-amber-600 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-pm-dark mb-6">Prêt à commencer votre aventure ?</h2>
          <p className="text-pm-dark/90 text-xl mb-10 max-w-3xl mx-auto">Rejoignez Perfect Models Management et donnez vie à vos rêves de mannequinat dans un environnement professionnel et bienveillant.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/casting-formulaire" 
              className="group relative px-10 py-4 bg-pm-dark text-pm-off-white font-bold uppercase tracking-widest text-sm rounded-full overflow-hidden transition-all duration-300 hover:bg-black hover:shadow-xl"
            >
              <span className="relative z-10">Postuler maintenant</span>
              <span className="absolute inset-0 bg-gradient-to-r from-pm-gold to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
            
            <Link 
              to="/contact" 
              className="group relative px-10 py-4 border-2 border-pm-dark text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full overflow-hidden transition-all duration-300 hover:bg-pm-dark hover:text-pm-off-white"
            >
              <span className="relative z-10">Nous contacter</span>
              <span className="absolute inset-0 bg-pm-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center text-pm-dark/90">
              <svg className="w-5 h-5 mr-2 text-pm-dark" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Accompagnement personnalisé</span>
            </div>
            <div className="flex items-center text-pm-dark/90">
              <svg className="w-5 h-5 mr-2 text-pm-dark" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Réseau professionnel</span>
            </div>
            <div className="flex items-center text-pm-dark/90">
              <svg className="w-5 h-5 mr-2 text-pm-dark" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Formations exclusives</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;