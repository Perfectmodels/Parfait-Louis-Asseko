import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const { data } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  
  // Récupérer tous les services
  const allServices: Service[] = data?.agencyServices || [];
  
  // Créer une liste des catégories uniques
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allServices.forEach(service => {
      if (service.category) {
        cats.add(service.category);
      }
    });
    return ['tous', ...Array.from(cats)];
  }, [allServices]);
  
  // Filtrer les services par catégorie
  const filteredServices = useMemo(() => {
    return activeCategory === 'tous' 
      ? allServices 
      : allServices.filter(service => service.category === activeCategory);
  }, [allServices, activeCategory]);

  return (
    <div className="min-h-screen bg-pm-darker text-pm-off-white">
      <SEO
        title="Nos Services | Accompagnement & Production"
        description="Découvrez l'ensemble des services proposés par Perfect Models Management : gestion de carrière, formation, production de shootings, direction de casting et organisation d'événements mode."
        keywords={[
          'services agence mannequin',
          'formation mannequin',
          'production photo mode',
          'casting mannequin',
          'événementiel mode gabon',
          'agence de mannequins',
          'modélisme afrique',
          'management mannequins',
          'photographie mode'
        ]}
        image={data?.siteImages?.about}
      />
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-pm-dark to-pm-darker overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-pm-gold mb-6">
            Nos Services d'Excellence
          </h1>
          <p className="text-xl md:text-2xl text-pm-off-white/80 max-w-4xl mx-auto mb-12">
            Découvrez comment nous transformons les talents en étoiles et les idées en réalités mémorables
          </p>
          <div className="w-24 h-1 bg-pm-gold mx-auto"></div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 md:py-24 bg-pm-darker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-pm-gold text-pm-dark hover:bg-pm-gold/90'
                    : 'bg-pm-dark-light text-pm-off-white/80 hover:bg-pm-dark hover:text-pm-off-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Liste des services */}
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <ServiceCard 
                  key={service.title + index}
                  service={{
                    ...service,
                    id: service.id || `service-${index}`,
                    category: service.category || 'Général'
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-pm-gold mb-4">
                <svg 
                  className="w-16 h-16 mx-auto" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-playfair text-pm-off-white mb-2">Aucun service trouvé</h3>
              <p className="text-pm-off-white/60 mb-6">Aucun service ne correspond à cette catégorie pour le moment.</p>
              <button 
                onClick={() => setActiveCategory('tous')}
                className="px-6 py-2 bg-pm-gold text-pm-dark font-medium rounded-full hover:bg-pm-gold/90 transition-colors"
              >
                Voir tous les services
              </button>
            </div>
          )}
          
          {/* Section CTA */}
          <div className="mt-20 bg-gradient-to-r from-pm-gold/10 to-amber-600/10 rounded-2xl p-8 md:p-12 text-center border border-pm-gold/20">
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-pm-gold mb-4">
              Un projet en tête ?
            </h3>
            <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-8">
              Notre équipe est à votre écoute pour concrétiser votre vision. Discutons de votre projet et trouvons ensemble les solutions les plus adaptées à vos besoins.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white transition-colors"
              >
                Nous contacter
              </a>
              <a 
                href="tel:+241XXXXXXXX" 
                className="px-8 py-3 border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full hover:bg-pm-gold/10 transition-colors"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Appeler maintenant
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;