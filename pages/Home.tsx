
import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ModelCard from '../components/ModelCard';
import ServiceCard from '../components/ServiceCard';
import { iconMap } from '../components/icons/iconMap';
import { LazyImage, Loading } from '../components';

// Composant chargé de manière paresseuse
const TestimonialCarousel = lazy(() => import('../components/TestimonialCarousel'));

const Home: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }

  const { agencyInfo, agencyPartners, fashionDayEvents, models, siteImages, testimonials, agencyServices } = data;
  const publicModels = models.filter(m => m.isPublic).slice(0, 4);
  const featuredServices = agencyServices.slice(0, 4);

  return (
    <div className="text-pm-off-white">
      <SEO 
        title="Perfect Models Management | Excellence en Modélisme & Événementiel Mode"
        description="L'agence de mannequins leader au Gabon, façonnant l'avenir de la mode africaine. Découvrez nos talents exceptionnels, nos services sur mesure et nos événements exclusifs qui célèbrent la beauté et le style africains."
        keywords="agence mannequins gabon, agence mode libreville, casting mannequin professionnel, défilé de mode afrique, formation mannequinat, mannequinat haute couture, agence événementielle mode, booker mannequin gabon, agence de mannequins premium, mode africaine luxe"
        image={siteImages.hero}
      />

      {/* 1. Hero Section - Version améliorée */}
      <section 
        className="relative min-h-screen flex items-center justify-center text-center bg-cover bg-center bg-fixed overflow-hidden" 
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url('${siteImages.hero}')` }}
      >
        {/* Effet de particules d'or subtil */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-pm-gold"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 5 + 5}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-6 max-w-6xl mx-auto">
          <div className="animate-fadeInUp">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8.5xl font-playfair font-black text-pm-gold leading-tight tracking-tight" 
                style={{ 
                  textShadow: '0 0 15px rgba(212, 175, 55, 0.9)',
                  lineHeight: '1.1'
                }}>
              L'Excellence <span className="text-white">en Modélisme</span>
            </h1>
            
            <div className="w-24 h-1.5 bg-pm-gold mx-auto my-8 rounded-full"></div>
            
            <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-pm-off-white/95 font-light leading-relaxed">
              <span className="font-medium text-pm-gold">#1</span> Agence de mannequins au Gabon • Formation d'excellence • Événements d'envergure internationale
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link 
                to="/services" 
                className="relative w-full sm:w-auto px-12 py-5 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/50 hover:scale-105 transform hover:-translate-y-1 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Découvrir nos services
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="block mt-1 text-xs font-normal normal-case opacity-80">Solutions premium pour professionnels exigeants</span>
              </Link>
              
              <Link 
                to="/casting-formulaire" 
                className="relative w-full sm:w-auto px-12 py-5 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-500 hover:bg-pm-gold/10 hover:scale-105 transform hover:-translate-y-1 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Devenir mannequin
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <span className="block mt-1 text-xs font-normal normal-case opacity-80">Rejoignez nos talents d'exception</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Agency Presentation - Élégance & Expertise */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjUwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIxMiwxNzUsNTUsMC4wMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
        </div>
        
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-pm-gold bg-pm-gold/10 rounded-full">L'Excellence Africaine</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mt-4">
              Votre Partenaire en <span className="text-pm-gold">Modélisme d'Exception</span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 relative group">
              <div className="relative overflow-hidden rounded-lg shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02]">
                <LazyImage 
                  src={siteImages.about} 
                  alt="Perfect Models Management - Agence de Mannequins" 
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold text-pm-gold mb-2">Notre Histoire</h3>
                    <p className="text-pm-off-white/90">Une vision, une passion, une success story africaine</p>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-3/4 h-3/4 border-2 border-pm-gold/30 rounded-lg transition-all duration-500 group-hover:border-pm-gold/70"></div>
            </div>

            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-pm-off-white mb-4">
                  L'Excellence en Modélisme
                </h3>
                <p className="text-pm-off-white/80 leading-relaxed">
                  {agencyInfo?.about?.p1 || "Fondée avec la vision de révolutionner l'industrie du mannequinat en Afrique Centrale, Perfect Models Management s'est imposée comme la référence incontournable du secteur. Notre engagement envers l'excellence et notre passion pour révéler les talents font de nous bien plus qu'une simple agence - nous sommes les architectes de carrières exceptionnelles."}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-pm-dark/50 rounded-xl border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300 group">
                  <div className="w-12 h-12 mb-4 flex items-center justify-center bg-pm-gold/10 rounded-lg text-pm-gold group-hover:bg-pm-gold/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-pm-gold mb-2">Notre Mission</h4>
                  <p className="text-sm text-pm-off-white/80">Révéler et accompagner les talents émergents du mannequinat africain vers l'excellence internationale.</p>
                </div>

                <div className="p-6 bg-pm-dark/50 rounded-xl border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300 group">
                  <div className="w-12 h-12 mb-4 flex items-center justify-center bg-pm-gold/10 rounded-lg text-pm-gold group-hover:bg-pm-gold/20 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold text-pm-gold mb-2">Notre Vision</h4>
                  <p className="text-sm text-pm-off-white/80">Devenir le pont incontournable entre les talents africains et les plus grandes scènes mondiales de la mode.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/agence" className="px-6 py-3 bg-pm-gold text-pm-dark font-medium rounded-full hover:bg-white hover:shadow-lg hover:shadow-pm-gold/30 transition-all duration-300 flex items-center">
                  Découvrir notre histoire
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
                <Link to="/contact" className="px-6 py-3 border-2 border-pm-gold text-pm-gold font-medium rounded-full hover:bg-pm-gold/10 transition-all duration-300 flex items-center">
                  Nous contacter
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Premium */}
      <section className="relative py-24 bg-pm-dark overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjUwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIxMiwxNzUsNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
        </div>
        
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-pm-gold bg-pm-gold/10 rounded-full">Nos Services Exclusifs</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mt-4">
              Des Solutions <span className="text-pm-gold">Sur Mesure</span>
            </h2>
            <p className="mt-6 text-lg text-pm-off-white/80 max-w-3xl mx-auto">
              Découvrez nos services premium conçus pour répondre à tous vos besoins en matière de mannequinat, d'événementiel et de conseil en image.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {featuredServices.map((service, index) => (
              <div 
                key={service.title}
                className="group relative bg-gradient-to-br from-pm-dark to-black/90 rounded-2xl overflow-hidden border border-pm-gold/20 hover:border-pm-gold/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pm-gold/10"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="p-8">
                  <div className="w-16 h-16 mb-6 flex items-center justify-center bg-pm-gold/10 rounded-xl text-pm-gold group-hover:bg-pm-gold/20 transition-colors">
                    {(() => {
                      const Icon = iconMap[service.icon] || 'div';
                      return <Icon className="w-8 h-8" />;
                    })()}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-pm-off-white mb-3">{service.title}</h3>
                  <p className="text-pm-off-white/80 mb-6">{service.description}</p>
                  
                  {service.details && (
                    <div className="mb-6">
                      <h4 className="text-pm-gold font-medium mb-2">{service.details.title}</h4>
                      <ul className="space-y-2">
                        {service.details.points.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="w-5 h-5 text-pm-gold mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-pm-off-white/80">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <Link 
                    to={service.buttonLink}
                    className="inline-flex items-center text-pm-gold font-medium group-hover:text-pm-gold/80 transition-colors"
                  >
                    {service.buttonText}
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/services" 
              className="inline-flex items-center px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white hover:shadow-lg hover:shadow-pm-gold/30 transition-all duration-300"
            >
              Découvrir tous nos services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Notre Sélection de Mannequins */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjUwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIxMiwxNzUsNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
        </div>
        
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-pm-gold bg-pm-gold/10 rounded-full">Nos Talents</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mt-4">
              Découvrez <span className="text-pm-gold">Nos Étoiles Montantes</span>
            </h2>
            <p className="mt-6 text-lg text-pm-off-white/80 max-w-3xl mx-auto">
              Une sélection exclusive de mannequins professionnels prêts à incarner votre prochaine campagne ou votre prochain défilé.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {publicModels.map((model, index) => (
              <div 
                key={model.id}
                className="group relative bg-pm-dark/50 rounded-xl overflow-hidden border border-pm-gold/20 hover:border-pm-gold/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pm-gold/5"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="relative overflow-hidden h-96">
                  <LazyImage 
                    src={model.images?.[0] || model.imageUrl || '/placeholder-model.jpg'} 
                    alt={model.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold text-pm-off-white">
                        {model.name}
                      </h3>
                      <p className="text-pm-off-white/80 text-sm mt-1">
                        {model.category || 'Mannequin Professionnel'}
                      </p>
                      <div className="flex items-center mt-3 space-x-2">
                        {model.measurements && (
                          <span className="text-xs bg-pm-gold/10 text-pm-gold px-2 py-1 rounded">
                            {model.measurements.height} • {model.measurements.bust && `${model.measurements.bust}-${model.measurements.waist}-${model.measurements.hips}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-pm-off-white">
                        {model.name}
                      </h3>
                      <p className="text-pm-off-white/60 text-sm">
                        {model.category || 'Mannequin Professionnel'}
                      </p>
                    </div>
                    <Link 
                      to={`/mannequins/${model.id}`}
                      className="w-10 h-10 flex items-center justify-center bg-pm-gold/10 text-pm-gold rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors"
                      aria-label={`Voir le profil de ${model.name}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link 
              to="/mannequins" 
              className="inline-flex items-center px-8 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold hover:text-pm-dark hover:shadow-lg hover:shadow-pm-gold/20 transition-all duration-300"
            >
              Découvrir tous nos mannequins
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Événements à Venir - Perfect Fashion Day */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjUwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIxMiwxNzUsNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
        </div>
        
        <div className="page-container relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-pm-gold bg-pm-gold/10 rounded-full">Événements à Venir</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mt-4">
              Perfect Fashion Day <span className="text-pm-gold">Édition 2024</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02]">
                <LazyImage 
                  src={siteImages.fashionDayBg || '/placeholder-event.jpg'} 
                  alt="Perfect Fashion Day 2024" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-center bg-pm-gold/90 text-pm-dark px-4 py-2 rounded-lg">
                      <div className="text-2xl font-bold">15</div>
                      <div className="text-xs uppercase tracking-wider">Nov</div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-pm-off-white">Perfect Fashion Day 2024</h3>
                      <p className="text-pm-off-white/80 text-sm">Libreville, Gabon</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-pm-gold text-pm-dark text-xs font-bold uppercase rounded-full">Billets en vente</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-pm-off-white mb-6">L'Événement Mode de l'Année</h3>
              
              <p className="text-pm-off-white/80 mb-6 leading-relaxed">
                {fashionDayEvents.find(e => e.edition === 2)?.description || "Le Perfect Fashion Day est bien plus qu'un défilé de mode, c'est une expérience immersive qui célèbre la créativité, l'élégance et l'innovation dans la mode africaine. Rejoignez-nous pour une soirée exceptionnelle mettant en lumière les talents émergents et établis du continent."}
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-pm-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-pm-off-white/80">Défilés exclusifs des créateurs émergents</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-pm-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-pm-off-white/80">Performances live et expériences immersives</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-pm-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="ml-3 text-pm-off-white/80">Rencontres avec les acteurs clés de l'industrie</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/fashion-day" 
                  className="flex-1 px-6 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center hover:bg-white hover:shadow-lg hover:shadow-pm-gold/30 transition-all duration-300 flex items-center justify-center"
                >
                  En savoir plus
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
                <Link 
                  to="/fashion-day#tickets" 
                  className="flex-1 px-6 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center hover:bg-pm-gold/10 transition-all duration-300 flex items-center justify-center"
                >
                  Acheter des billets
                </Link>
              </div>
              
              <div className="mt-6 flex items-center justify-center sm:justify-start space-x-2 text-pm-off-white/60 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>15 Novembre 2024 • 19h00</span>
              </div>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-pm-dark/50 rounded-xl border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300">
              <div className="text-4xl font-bold text-pm-gold mb-2">15+</div>
              <div className="text-pm-off-white/80 text-sm uppercase tracking-wider">Créateurs</div>
            </div>
            <div className="p-6 bg-pm-dark/50 rounded-xl border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300">
              <div className="text-4xl font-bold text-pm-gold mb-2">50+</div>
              <div className="text-pm-off-white/80 text-sm uppercase tracking-wider">Mannequins</div>
            </div>
            <div className="p-6 bg-pm-dark/50 rounded-xl border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300">
              <div className="text-4xl font-bold text-pm-gold mb-2">1000+</div>
              <div className="text-pm-off-white/80 text-sm uppercase tracking-wider">Visiteurs</div>
            </div>
            <div className="p-6 bg-pm-dark/50 rounded-xl border border-pm-gold/10 hover:border-pm-gold/30 transition-all duration-300">
              <div className="text-4xl font-bold text-pm-gold mb-2">1</div>
              <div className="text-pm-off-white/80 text-sm uppercase tracking-wider">Nuit Inoubliable</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Témoignages Clients */}
      {testimonials && testimonials.length > 0 && (
        <section className="relative py-24 bg-pm-dark overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3Qgd2lkdGg9IjUwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJyZ2JhKDIxMiwxNzUsNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjcGF0dGVybikiLz48L3N2Zz4=')]"></div>
          </div>
          
          <div className="page-container relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-pm-gold bg-pm-gold/10 rounded-full">Ils Nous Font Confiance</span>
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mt-4">
                Ce Que Disent <span className="text-pm-gold">Nos Clients</span>
              </h2>
              <p className="mt-6 text-lg text-pm-off-white/80 max-w-3xl mx-auto">
                Découvrez les retours d'expérience de nos clients, partenaires et talents qui ont choisi Perfect Models Management pour leur projet.
              </p>
            </div>
            
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute -left-4 -top-8 text-pm-gold/10 text-9xl font-playfair font-bold select-none">"</div>
              <Suspense fallback={
                <div className="h-64 flex items-center justify-center">
                  <Loading size="md" color="gold" />
                </div>
              }>
                <TestimonialCarousel />
              </Suspense>
              <div className="absolute -right-4 -bottom-8 text-pm-gold/10 text-9xl font-playfair font-bold select-none transform rotate-180">"</div>
            </div>
            
            <div className="mt-16 text-center">
              <Link 
                to="/temoignages" 
                className="inline-flex items-center text-pm-gold font-medium hover:text-pm-gold/80 transition-colors group"
              >
                Lire tous les témoignages
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 8. Call to Action */}
      <section className="relative py-24 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url('${siteImages.fashionDayBg || ''}')` }}>
        <div className="page-container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium text-pm-gold bg-pm-gold/10 rounded-full">Rejoignez-Nous</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-pm-off-white mt-4 mb-6">
              Prêt à <span className="text-pm-gold">Briller</span> avec Nous ?
            </h2>
            
            <p className="text-xl text-pm-off-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Que vous soyez mannequin, créateur ou partenaire, rejoignez l'élite de la mode africaine et écrivez avec nous les prochains chapitres de la mode de demain.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/casting-formulaire" 
                className="group relative w-full sm:w-auto px-10 py-5 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Postuler comme mannequin</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/0 via-white/30 to-pm-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/contact" 
                className="group relative w-full sm:w-auto px-10 py-5 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full text-center hover:bg-pm-gold/10 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/10 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Devenir partenaire</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pm-gold/0 via-pm-gold/10 to-pm-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link 
                to="/services" 
                className="group relative w-full sm:w-auto px-10 py-5 bg-pm-dark text-pm-off-white font-bold uppercase tracking-widest text-sm rounded-full text-center border border-pm-gold/30 hover:border-pm-gold/70 transition-all duration-300 hover:shadow-lg hover:shadow-pm-gold/5 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Découvrir nos services
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </span>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-pm-off-white/60 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pm-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Réponse sous 48h</span>
              </div>
              <div className="h-5 w-px bg-pm-gold/30"></div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pm-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>Accompagnement personnalisé</span>
              </div>
              <div className="h-5 w-px bg-pm-gold/30"></div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pm-gold mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span>Réseau professionnel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
