import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, CheckIcon, StarIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { FAQCategory } from '../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import Button from '../components/ui/Button';

// --- Sub-Components ---

const AgencyHero: React.FC<{ image: string }> = ({ image }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div ref={ref} className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <motion.div
                style={{ y, backgroundImage: `url('${image}')` }}
                className="absolute inset-0 bg-cover bg-center"
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="block text-pm-gold uppercase tracking-[0.3em] mb-4 text-sm font-bold"
                >
                    Notre Identité
                </motion.span>
                <motion.h1
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-5xl md:text-7xl font-playfair text-white mb-6 leading-tight"
                >
                    Excellence & <span className="italic text-pm-gold">Passion</span>
                </motion.h1>
                <motion.p
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
                >
                    Depuis 2021, nous redéfinissons les standards du mannequinat au Gabon en alliant professionnalisme rigoureux et vision artistique audacieuse.
                </motion.p>
            </div>
        </div>
    );
};

const ValueCard: React.FC<{ icon: any, title: string, text: string, delay: number }> = ({ icon: Icon, title, text, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.6 }}
            className="bg-pm-dark/50 border border-white/5 p-8 hover:border-pm-gold/30 transition-colors group"
        >
            <div className="w-12 h-12 bg-pm-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-pm-gold group-hover:text-black transition-colors text-pm-gold">
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-playfair text-white mb-4">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
        </motion.div>
    );
};

const TimelineItem: React.FC<{ year: string, event: string, index: number }> = ({ year, event, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex items-center gap-8 mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} relative`}
        >
            <div className={`w-1/2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                <span className="text-4xl md:text-5xl font-playfair text-pm-gold font-bold block mb-2">{year}</span>
                <p className="text-gray-400 text-sm md:text-base">{event}</p>
            </div>

            {/* Center Dot */}
            <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-pm-gold rounded-full border-4 border-black z-10 shadow-[0_0_15px_rgba(212,175,55,0.5)]"></div>
        </motion.div>
    );
};

const FAQ: React.FC<{ faqData: FAQCategory[] }> = ({ faqData }) => {
    const [openFAQ, setOpenFAQ] = React.useState<string | null>('0-0');

    const toggleFAQ = (id: string) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    if (!faqData || faqData.length === 0) return null;

    return (
        <section className="py-24 bg-pm-dark">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <span className="text-pm-gold uppercase tracking-widest text-sm font-bold">Support</span>
                    <h2 className="text-3xl md:text-4xl font-playfair text-white mt-2">Questions Fréquentes</h2>
                </div>

                <div className="space-y-12">
                    {faqData.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h3 className="text-xl font-playfair text-pm-gold mb-6 border-b border-white/10 pb-2">{category.category}</h3>
                            <div className="space-y-4">
                                {category.items.map((item, itemIndex) => {
                                    const faqId = `${catIndex}-${itemIndex}`;
                                    const isOpen = openFAQ === faqId;
                                    return (
                                        <div key={itemIndex} className="bg-white/5 rounded-lg overflow-hidden transition-colors hover:bg-white/10">
                                            <button
                                                onClick={() => toggleFAQ(faqId)}
                                                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                                            >
                                                <span className="font-medium text-white">{item.question}</span>
                                                <ChevronDownIcon className={`w-5 h-5 text-pm-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            <div
                                                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                            >
                                                <div className="overflow-hidden">
                                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed text-sm">
                                                        {item.answer}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// --- Main Component ---

const Agency: React.FC = () => {
    const { data, isInitialized } = useData();

    if (!isInitialized || !data) {
        return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full animate-spin" /></div>;
    }

    const { agencyInfo, modelDistinctions, agencyTimeline, agencyPartners, siteImages, faqData } = data;

    return (
        <div className="bg-black text-white selection:bg-pm-gold selection:text-black">
            <SEO
                title="L'Agence | Notre Histoire et Nos Valeurs"
                description="Plongez au cœur de Perfect Models Management. Découvrez notre histoire, nos valeurs de professionnalisme et d'excellence."
                keywords="histoire agence pmm, valeurs mannequinat, agence de mode gabon"
                image={siteImages.agencyHistory}
            />

            <AgencyHero image={siteImages.agencyHistory} />

            {/* About Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="w-full lg:w-1/2 relative z-10"
                        >
                            <img
                                src={siteImages.about}
                                alt="À propos de PMM"
                                className="w-full h-auto shadow-2xl shadow-pm-gold/10"
                            />
                            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-pm-dark border border-pm-gold p-4 hidden md:flex items-center justify-center">
                                <span className="font-playfair text-sm text-center">Since <br /><span className="text-2xl font-bold text-pm-gold">2021</span></span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-1/2"
                        >
                            <h2 className="text-4xl font-playfair text-white mb-8 border-l-4 border-pm-gold pl-6">Notre Histoire</h2>
                            <div className="text-gray-300 space-y-6 text-lg leading-relaxed">
                                <p>{agencyInfo.about.p1}</p>
                                <p>{agencyInfo.about.p2}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mt-12">
                                <div className="bg-white/5 p-4 text-center">
                                    <span className="block text-3xl font-playfair text-pm-gold mb-1">50+</span>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Mannequins</span>
                                </div>
                                <div className="bg-white/5 p-4 text-center">
                                    <span className="block text-3xl font-playfair text-pm-gold mb-1">20+</span>
                                    <span className="text-xs uppercase tracking-widest text-gray-500">Campagnes</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-pm-dark relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <span className="text-pm-gold uppercase tracking-widest text-sm font-bold">Philosophie</span>
                        <h2 className="text-4xl font-playfair text-white mt-2">Nos Valeurs</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {agencyInfo.values.map((value, idx) => (
                            <ValueCard
                                key={idx}
                                icon={!idx ? StarIcon : (idx === 1 ? UserGroupIcon : CheckIcon)}
                                title={value.name}
                                text={value.description}
                                delay={idx * 0.2}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="py-24 overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-pm-gold uppercase tracking-widest text-sm font-bold">Parcours</span>
                        <h2 className="text-4xl font-playfair text-white mt-2">Les Grandes Étapes</h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 -translate-x-1/2 h-full w-[1px] bg-white/10"></div>

                        {agencyTimeline.map((item, index) => (
                            <TimelineItem key={index} year={item.year} event={item.event} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Distinctions Section */}
            <section className="py-24 bg-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <TrophyIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                        <h2 className="text-3xl md:text-4xl font-playfair text-white">Nos Distinctions</h2>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">La reconnaissance de l'excellence de nos talents sur la scène nationale et internationale.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {modelDistinctions.map((dist, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-black border border-white/10 p-6 text-center hover:border-pm-gold/50 transition-colors"
                            >
                                <h3 className="text-lg font-playfair text-white mb-4">{dist.name}</h3>
                                <ul className="space-y-2">
                                    {dist.titles.map((title, tIdx) => (
                                        <li key={tIdx} className="text-sm text-pm-gold flex items-center justify-center gap-2">
                                            <span className="w-1 h-1 bg-pm-gold rounded-full" />
                                            {title}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partners Section */}
            <section className="py-20 border-y border-white/5">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-gray-500 uppercase tracking-widest text-xs font-bold block mb-8">Ils nous font confiance</span>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {agencyPartners.map((partner, idx) => (
                            <span key={idx} className="text-xl md:text-2xl font-playfair text-white">{partner.name}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <FAQ faqData={faqData} />

            {/* Contact CTA */}
            <section className="py-24 bg-pm-gold/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-playfair text-white mb-6">Prêt à collaborer ?</h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
                        Que vous soyez une marque en quête d'excellence ou un talent prêt à éclore, nous sommes là pour vous.
                    </p>
                    <Link to="/contact">
                        <Button className="py-4 px-10 text-lg">Contactez-nous</Button>
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Agency;