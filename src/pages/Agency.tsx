import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckBadgeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { AchievementCategory, ModelDistinction, FAQCategory } from '../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import ParallaxHero from '../components/ui/ParallaxHero';
import FadeIn from '../components/ui/FadeIn';
import Reveal from '../components/ui/Reveal';

const FAQ: React.FC<{ faqData: FAQCategory[] }> = ({ faqData }) => {
    const [openFAQ, setOpenFAQ] = useState<string | null>('0-0'); // Open the first question by default

    const toggleFAQ = (id: string) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    if (!faqData || faqData.length === 0) return null;

    return (
        <section>
            <FadeIn>
                <div className="flex justify-center mb-8">
                    <Reveal>
                        <h2 className="section-title !mb-0">Questions Fréquemment Posées</h2>
                    </Reveal>
                </div>
            </FadeIn>
            <div className="max-w-4xl mx-auto space-y-8">
                {faqData.map((category, catIndex) => (
                    <FadeIn key={catIndex} delay={catIndex * 0.1}>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-4 relative pl-4 border-l-4 border-pm-gold">{category.category}</h3>
                        <div className="space-y-3">
                            {category.items.map((item, itemIndex) => {
                                const faqId = `${catIndex}-${itemIndex}`;
                                const isOpen = openFAQ === faqId;
                                return (
                                    <div key={itemIndex} className="bg-black/50 border border-pm-gold/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-pm-gold/50">
                                        <button
                                            onClick={() => toggleFAQ(faqId)}
                                            className="w-full flex justify-between items-center p-5 text-left"
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${faqId}`}
                                        >
                                            <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-pm-gold' : 'text-pm-off-white'}`}>{item.question}</span>
                                            <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div
                                            id={`faq-answer-${faqId}`}
                                            className="grid transition-all duration-500 ease-in-out"
                                            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-5 pb-5 text-pm-off-white/80 border-t border-pm-gold/10 pt-4">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </FadeIn>
                ))}
            </div>
        </section>
    );
};


const Agency: React.FC = () => {
    const { data, isInitialized } = useData();

    if (!isInitialized || !data) {
        return <div className="min-h-screen bg-pm-dark flex items-center justify-center text-pm-gold">Chargement...</div>;
    }

    const { agencyInfo, modelDistinctions, agencyTimeline, agencyAchievements, agencyPartners, siteImages, faqData } = data;

    return (
        <div className="bg-pm-dark text-pm-off-white overflow-hidden">
            <SEO
                title="L'Agence | Notre Histoire et Nos Valeurs"
                description="Plongez au cœur de Perfect Models Management. Découvrez notre histoire, nos valeurs de professionnalisme et d'excellence."
                keywords="histoire agence pmm, valeurs mannequinat, services agence de mannequins, agence de mode gabon"
                image={siteImages.agencyHistory}
            />

            <ParallaxHero
                image={siteImages.agencyHistory}
                title="L'Agence"
                subtitle="Plus qu'une agence, une vision de l'excellence africaine."
                height="h-[60vh]"
            />

            <div className="page-container space-y-20 lg:space-y-32">

                {/* À Propos */}
                <section className="relative">
                    {/* Decorative Blob */}
                    <div className="absolute top-1/2 left-0 w-96 h-96 bg-pm-gold/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"></div>

                    <div className="content-section flex flex-col md:flex-row items-stretch gap-12 lg:gap-20">
                        <FadeIn direction="right" className="md:w-1/2 relative group">
                            <div className="absolute inset-0 border-2 border-pm-gold translate-x-4 translate-y-4 rounded-lg transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
                            <div className="relative h-full overflow-hidden rounded-lg">
                                <img src={siteImages.about} alt="L'équipe Perfect Models" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            </div>
                        </FadeIn>
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <FadeIn direction="left">
                                <Reveal>
                                    <h2 className="text-4xl font-playfair text-white mb-6">Notre Histoire</h2>
                                </Reveal>
                            </FadeIn>
                            <FadeIn direction="left" delay={0.2}>
                                <div className="text-lg leading-relaxed text-pm-off-white/80 space-y-4">
                                    <p>{agencyInfo.about.p1}</p>
                                    <p>{agencyInfo.about.p2}</p>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </section>

                {/* Distinctions */}
                <section>
                    <FadeIn>
                        <div className="text-center mb-12">
                            <Reveal width="100%" className='flex justify-center'>
                                <h2 className="section-title !mb-0">Distinctions</h2>
                            </Reveal>
                            <p className="text-pm-off-white/60 mt-4 max-w-2xl mx-auto">La reconnaissance de notre travail à travers les succès de nos talents.</p>
                        </div>
                    </FadeIn>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {modelDistinctions.map((distinction, index) => (
                            <FadeIn key={index} delay={index * 0.1} viewportAmount={0.5} className="h-full">
                                <DistinctionCard distinction={distinction} />
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Parcours (Timeline) */}
                <section className="py-10">
                    <FadeIn>
                        <h2 className="section-title mb-16">Notre Parcours</h2>
                    </FadeIn>
                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-pm-gold/50 to-transparent md:transform md:-translate-x-1/2"></div>
                        {agencyTimeline.map((item, index) => (
                            <FadeIn key={index} delay={index * 0.15} direction="up" viewportAmount={0.3}>
                                <div className={`relative flex flex-col md:flex-row items-center w-full my-12 ${index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                                    {/* Card content */}
                                    <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}>
                                        <div className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl hover:border-pm-gold/50 transition-colors duration-300 shadow-lg">
                                            <span className="text-5xl font-playfair font-bold text-pm-gold/20 absolute -top-4 right-4">{item.year}</span>
                                            <h3 className="text-2xl font-bold text-pm-gold relative z-10">{item.year}</h3>
                                            <p className="text-pm-off-white/90 mt-2 relative z-10 text-lg">{item.event}</p>
                                        </div>
                                    </div>

                                    {/* Connector Dot */}
                                    <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-pm-dark border-4 border-pm-gold rounded-full transform -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(212,175,55,0.8)]"></div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </section>

                {/* Réalisations Tabs */}
                <section>
                    <FadeIn>
                        <h2 className="section-title">Nos Réalisations</h2>
                    </FadeIn>
                    <AchievementsTabs achievements={agencyAchievements} />
                </section>

                {/* Partenaires */}
                <section className="py-10 border-t border-white/5 border-b">
                    <FadeIn>
                        <h2 className="section-title">Ils nous font confiance</h2>
                        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 mt-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
                            {agencyPartners.map((partner, index) => (
                                <span key={index} className="text-xl md:text-2xl font-playfair font-bold text-pm-off-white hover:text-pm-gold transition-colors cursor-default">
                                    {partner.name}
                                </span>
                            ))}
                        </div>
                    </FadeIn>
                </section>

                {/* FAQ Section */}
                <FAQ faqData={faqData} />

                {/* Contact CTA */}
                <section className="text-center content-section relative overflow-hidden bg-white/5 rounded-2xl p-10 lg:p-16 border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pm-gold/10 rounded-full blur-[80px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-pm-gold/10 rounded-full blur-[80px] pointer-events-none"></div>

                    <FadeIn>
                        <h3 className="text-3xl md:text-4xl font-playfair text-white mb-6">Une question ? Un projet ?</h3>
                        <p className="text-pm-off-white/80 max-w-2xl mx-auto mb-10 text-lg">
                            Nous sommes à l'écoute de vos ambitions. Contactez-nous pour discuter de votre prochain événement ou campagne.
                        </p>
                        <Link to="/contact" className="cta-btn-gold">
                            Nous Contacter
                        </Link>
                    </FadeIn>
                </section>

            </div>
        </div>
    );
};

const DistinctionCard: React.FC<{ distinction: ModelDistinction }> = ({ distinction }) => (
    <div className="bg-pm-dark-light border border-pm-gold/10 p-8 rounded-xl h-full flex flex-col items-center justify-center text-center hover:bg-white/5 hover:border-pm-gold/30 hover:-translate-y-2 transition-all duration-300 shadow-xl group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pm-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="w-16 h-16 bg-pm-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <CheckBadgeIcon className="w-8 h-8 text-pm-gold" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-playfair font-bold text-white mb-4 relative z-10">{distinction.name}</h3>
        <ul className="text-pm-off-white/70 space-y-2 relative z-10">
            {distinction.titles.map((title, index) => <li key={index} className="flex items-center justify-center gap-2"><span className="text-pm-gold text-xs">●</span> {title}</li>)}
        </ul>
    </div>
);

const AchievementsTabs: React.FC<{ achievements: AchievementCategory[] }> = ({ achievements }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="max-w-5xl mx-auto">
            <FadeIn>
                <div role="tablist" aria-label="Nos réalisations" className="flex flex-wrap justify-center gap-4 mb-10">
                    {achievements.map((category, index) => (
                        <button
                            key={index}
                            role="tab"
                            aria-selected={activeTab === index}
                            onClick={() => setActiveTab(index)}
                            className={`px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === index ? 'bg-pm-gold text-pm-dark shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-white/5 text-pm-off-white/70 hover:bg-white/10 hover:text-white'}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </FadeIn>

            {achievements.map((category, index) => (
                <div
                    key={index}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    className={`transition-all duration-500 transform ${activeTab === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 absolute top-0 -z-10'}`}
                >
                    {activeTab === index && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-pm-off-white/90">
                                {category.items.map((item, itemIndex) => (
                                    <FadeIn key={itemIndex} delay={itemIndex * 0.05} className="bg-black/40 p-5 rounded-lg flex items-start gap-4 hover:border-l-2 hover:border-pm-gold transition-all">
                                        <CheckBadgeIcon className="w-6 h-6 text-pm-gold flex-shrink-0 mt-0.5" />
                                        <span className="font-medium">{item}</span>
                                    </FadeIn>
                                ))}
                            </div>
                            {category.name === "Défilés de Mode" &&
                                <FadeIn delay={0.5} className="mt-8 pt-6 border-t border-white/10 text-center">
                                    <p className="text-pm-gold font-serif italic text-lg">
                                        "Notre agence a participé à tous les événements de mode majeurs depuis sa création en 2021."
                                    </p>
                                </FadeIn>
                            }
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};


export default Agency;