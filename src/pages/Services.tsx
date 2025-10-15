import React, { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';
import { Link, useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
    const { data } = useData();
    const services = data?.agencyServices || [];

    const servicesByCategory = services.reduce((acc, service) => {
        const category = service.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(service);
        return acc;
    }, {} as Record<string, Service[]>);

    const categoryOrder: (keyof typeof servicesByCategory)[] = [
        'Services Mannequinat',
        'Services Mode et Stylisme',
        'Services Événementiels'
    ];
    
    const [activeCategory, setActiveCategory] = useState<string>(categoryOrder[0]);
    const [selected, setSelected] = useState<Record<string, boolean>>({});
    const navigate = useNavigate();

    const selectedTitles = useMemo(
      () => Object.entries(selected).filter(([k,v]) => v).map(([k]) => k),
      [selected]
    );


    return (
        <div className="bg-pm-dark text-pm-off-white">
            <SEO
                title="Nos Services | Accompagnement & Production"
                description="Découvrez l'ensemble des services conçus pour répondre aux besoins des créateurs, marques, et particuliers. Réservez directement depuis notre site."
                image={data?.siteImages.about}
            />
            <div className="page-container">
                <h1 className="page-title">Nos Services sur Mesure</h1>
                <p className="page-subtitle">
                    Découvrez l’ensemble de nos services conçus pour répondre aux besoins des créateurs, marques, entreprises et particuliers. Chaque service peut être réservé directement depuis notre site.
                </p>
                
                 {/* Tab Navigation */}
                <div role="tablist" aria-label="Catégories de services" className="flex justify-center flex-wrap gap-2 sm:gap-4 border-b border-pm-gold/20 mb-12">
                    {categoryOrder.map(category => (
                        servicesByCategory[category] && (
                             <button
                                key={category}
                                role="tab"
                                aria-selected={activeCategory === category}
                                aria-controls={`tabpanel-${category.replace(/\s+/g, '-')}`}
                                id={`tab-${category.replace(/\s+/g, '-')}`}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 sm:px-6 py-3 text-xs sm:text-sm uppercase tracking-wider font-bold transition-colors relative focus-style-self focus-visible:bg-pm-gold/10 ${activeCategory === category ? 'text-pm-gold' : 'text-pm-off-white/70 hover:text-pm-gold'}`}
                            >
                                {category}
                                {activeCategory === category && <div className="absolute bottom-[-1px] left-0 w-full h-0.5 bg-pm-gold"/>}
                            </button>
                        )
                    ))}
                </div>

                {/* Actions bar */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="text-sm text-pm-off-white/70">
                    {selectedTitles.length > 0 ? `${selectedTitles.length} service(s) sélectionné(s)` : 'Sélectionnez des services à commander'}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      disabled={selectedTitles.length === 0}
                      onClick={() => {
                        const q = selectedTitles.join(', ');
                        navigate(`/contact?service=${encodeURIComponent(q)}`);
                      }}
                      className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition ${selectedTitles.length===0 ? 'opacity-50 cursor-not-allowed border border-pm-off-white/20 text-pm-off-white/60' : 'bg-pm-gold text-pm-dark hover:bg-white'}`}
                    >
                      Commander les services sélectionnés
                    </button>
                    <button
                      disabled={selectedTitles.length === 0}
                      onClick={() => setSelected({})}
                      className="px-4 py-2 rounded-full text-xs border border-pm-gold/30 text-pm-gold hover:bg-pm-gold hover:text-pm-dark"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>

                {/* Tab Content with selectable services */}
                <div>
                    {categoryOrder.map(category => (
                        servicesByCategory[category] && (
                            <div
                                key={category}
                                id={`tabpanel-${category.replace(/\s+/g, '-')}`}
                                role="tabpanel"
                                aria-labelledby={`tab-${category.replace(/\s+/g, '-')}`}
                                hidden={activeCategory !== category}
                                className={`animate-fade-in ${activeCategory === category ? 'block' : 'hidden'}`}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {servicesByCategory[category].map((service, index) => (
                                        <div key={index} className={`relative group ${selected[service.title] ? 'ring-2 ring-pm-gold rounded-lg' : ''}`}>
                                          <label className="absolute top-3 left-3 z-10 inline-flex items-center gap-2 text-xs bg-black/60 px-2 py-1 rounded-full border border-pm-gold/40">
                                            <input
                                              type="checkbox"
                                              checked={Boolean(selected[service.title])}
                                              onChange={(e) => setSelected((prev) => ({...prev, [service.title]: e.target.checked}))}
                                            />
                                            Sélectionner
                                          </label>
                                          <ServiceCard service={service} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Services;
