import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckBadgeIcon, 
  ChevronDownIcon, 
  StarIcon, 
  UserGroupIcon, 
  TrophyIcon, 
  HeartIcon,
  SparklesIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon,
  UsersIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { AchievementCategory, ModelDistinction, FAQCategory } from '../types';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const FAQ: React.FC<{ faqData: FAQCategory[] }> = ({ faqData }) => {
    const [openFAQ, setOpenFAQ] = useState<string | null>('0-0'); // Open the first question by default

    const toggleFAQ = (id: string) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    if (!faqData || faqData.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="section-title">Questions Fréquemment Posées</h2>
            <div className="max-w-4xl mx-auto space-y-8">
                {faqData.map((category, catIndex) => (
                    <div key={catIndex}>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-4">{category.category}</h3>
                        <div className="space-y-3">
                            {category.items.map((item, itemIndex) => {
                                const faqId = `${catIndex}-${itemIndex}`;
                                const isOpen = openFAQ === faqId;
                                return (
                                    <div key={itemIndex} className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden">
                                        <button
                                            onClick={() => toggleFAQ(faqId)}
                                            className="w-full flex justify-between items-center p-5 text-left"
                                            aria-expanded={isOpen}
                                            aria-controls={`faq-answer-${faqId}`}
                                        >
                                            <span className="font-bold text-lg text-pm-off-white">{item.question}</span>
                                            <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div
                                            id={`faq-answer-${faqId}`}
                                            className="grid transition-all duration-500 ease-in-out"
                                            style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-5 pb-5 text-pm-off-white/80">
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
        </section>
    );
};


const Agency: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  const { agencyInfo, modelDistinctions, agencyTimeline, agencyAchievements, agencyPartners, siteImages, faqData } = data;

  return (
    <div className="bg-pm-dark text-pm-off-white">
      <SEO 
        title="L'Agence | Notre Histoire et Nos Valeurs"
        description="Plongez au cœur de Perfect Models Management. Découvrez notre histoire, nos valeurs de professionnalisme et d'excellence, et les services qui font de nous un leader de la mode au Gabon."
        keywords="histoire agence pmm, valeurs mannequinat, services agence de mannequins, agence de mode gabon, parfait asseko"
        image={siteImages.agencyHistory}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 via-transparent to-pm-gold/5"></div>
        <div className="relative z-10 page-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/20 rounded-full mb-6">
              <SparklesIcon className="w-5 h-5 text-pm-gold" />
              <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                Depuis 2021
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-playfair text-pm-gold mb-6 tracking-wider px-4">
              Perfect Models Management
            </h1>
            
            <p className="text-xl md:text-2xl text-pm-off-white/90 mb-8 leading-relaxed">
              L'agence de mannequins d'élite qui révolutionne la mode gabonaise
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/mannequins" 
                className="px-8 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
              >
                Découvrir nos mannequins
              </Link>
              <button 
                onClick={() => document.getElementById('notre-histoire')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
              >
                Notre histoire
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="page-container space-y-12 lg:space-y-16">

        {/* Section Statistiques */}
        <section className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-pm-gold" />
              </div>
              <div className="text-3xl font-bold text-pm-gold mb-2">50+</div>
              <div className="text-sm text-pm-off-white/80">Mannequins formés</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="w-8 h-8 text-pm-gold" />
              </div>
              <div className="text-3xl font-bold text-pm-gold mb-2">15+</div>
              <div className="text-sm text-pm-off-white/80">Récompenses</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarDaysIcon className="w-8 h-8 text-pm-gold" />
              </div>
              <div className="text-3xl font-bold text-pm-gold mb-2">4</div>
              <div className="text-sm text-pm-off-white/80">Années d'expérience</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-8 h-8 text-pm-gold" />
              </div>
              <div className="text-3xl font-bold text-pm-gold mb-2">100%</div>
              <div className="text-sm text-pm-off-white/80">Satisfaction client</div>
            </div>
          </motion.div>
        </section>

        {/* Notre Histoire */}
        <section id="notre-histoire">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Notre Histoire</h2>
            <div className="content-section">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <div className="relative overflow-hidden rounded-2xl">
                    <img 
                      src={siteImages.agencyHistory} 
                      alt="L'équipe Perfect Models Management" 
                      className="w-full h-96 object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm font-medium bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                        Fondée en 2021 par Parfait Asseko
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4 text-lg leading-relaxed text-pm-off-white/90">
                    <p>{agencyInfo.about.p1}</p>
              <p>{agencyInfo.about.p2}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link 
                      to="/services" 
                      className="px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-full hover:bg-white transition-colors text-center"
                    >
                      Nos Services
                    </Link>
                    <Link 
                      to="/contact" 
                      className="px-6 py-3 border border-pm-gold text-pm-gold font-semibold rounded-full hover:bg-pm-gold hover:text-pm-dark transition-colors text-center"
                    >
                      Nous Contacter
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Nos Valeurs */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Nos Valeurs</h2>
            <div className="content-section">
              <div className="grid md:grid-cols-3 gap-8">
                {agencyInfo.values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-8 text-center hover:border-pm-gold transition-all duration-300"
                  >
                    <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      {index === 0 && <StarIcon className="w-8 h-8 text-pm-gold" />}
                      {index === 1 && <CheckBadgeIcon className="w-8 h-8 text-pm-gold" />}
                      {index === 2 && <AcademicCapIcon className="w-8 h-8 text-pm-gold" />}
                    </div>
                    <h3 className="text-2xl font-playfair text-pm-gold mb-4">{value.name}</h3>
                    <p className="text-pm-off-white/80 leading-relaxed">{value.description}</p>
                  </motion.div>
                ))}
            </div>
          </div>
          </motion.div>
        </section>

        {/* Distinctions */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
          <h2 className="section-title">Distinctions de nos Mannequins</h2>
            <div className="content-section">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modelDistinctions.map((distinction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <DistinctionCard distinction={distinction} />
                  </motion.div>
            ))}
          </div>
            </div>
          </motion.div>
        </section>

        {/* Section Équipe */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Notre Équipe</h2>
            <div className="content-section">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.teamMembers
                  ?.filter(member => member.isPublic)
                  ?.sort((a, b) => a.order - b.order)
                  ?.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-8 text-center hover:border-pm-gold transition-all duration-300"
                    >
                      <div className="w-24 h-24 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden">
                        {member.imageUrl ? (
                          <img
                            src={member.imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserGroupIcon className="w-12 h-12 text-pm-gold" />
                        )}
                      </div>
                      <h3 className="text-2xl font-playfair text-pm-gold mb-2">{member.name}</h3>
                      <p className="text-pm-gold font-semibold mb-4">{member.position}</p>
                      <p className="text-pm-off-white/80 leading-relaxed">
                        {member.description}
                      </p>
                      {(member.email || member.phone || member.socialLinks) && (
                        <div className="mt-4 pt-4 border-t border-pm-gold/20">
                          <div className="flex justify-center gap-4">
                            {member.email && (
                              <a
                                href={`mailto:${member.email}`}
                                className="text-pm-gold hover:text-white transition-colors"
                                title="Email"
                              >
                                <EnvelopeIcon className="w-5 h-5" />
                              </a>
                            )}
                            {member.phone && (
                              <a
                                href={`tel:${member.phone}`}
                                className="text-pm-gold hover:text-white transition-colors"
                                title="Téléphone"
                              >
                                <PhoneIcon className="w-5 h-5" />
                              </a>
                            )}
                            {member.socialLinks?.linkedin && (
                              <a
                                href={member.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-white transition-colors"
                                title="LinkedIn"
                              >
                                <LinkIcon className="w-5 h-5" />
                              </a>
                            )}
                            {member.socialLinks?.instagram && (
                              <a
                                href={member.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-400 hover:text-white transition-colors"
                                title="Instagram"
                              >
                                <LinkIcon className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Parcours (Timeline) */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
          <h2 className="section-title">Notre Parcours</h2>
            <div className="content-section">
           <div className="relative max-w-4xl mx-auto">
                <div className="absolute left-1/2 h-full w-0.5 bg-pm-gold/30 transform -translate-x-1/2"></div>
                {agencyTimeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center w-full my-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                        <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-black/50 backdrop-blur-sm p-6 border border-pm-gold/20 rounded-xl hover:border-pm-gold transition-all duration-300">
                        <h3 className="text-2xl font-bold text-pm-gold mb-2">{item.year}</h3>
                        <p className="text-pm-off-white/80 leading-relaxed">{item.event}</p>
                            </div>
                        </div>
                    <div className="absolute left-1/2 w-8 h-8 bg-pm-dark border-4 border-pm-gold rounded-full transform -translate-x-1/2 z-10 flex items-center justify-center">
                      <div className="w-3 h-3 bg-pm-gold rounded-full"></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Section Témoignages */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Ce qu'ils disent de nous</h2>
            <div className="content-section">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-8 hover:border-pm-gold transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-pm-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-pm-off-white/80 leading-relaxed mb-6">
                    "Perfect Models Management a transformé ma carrière. L'équipe est professionnelle et les formations sont exceptionnelles. Je recommande vivement cette agence."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mr-4">
                      <UserGroupIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-pm-gold">Marie Nguema</p>
                      <p className="text-sm text-pm-off-white/60">Mannequin</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-8 hover:border-pm-gold transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-pm-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-pm-off-white/80 leading-relaxed mb-6">
                    "Une agence de référence au Gabon. Le niveau de professionnalisme et la qualité des mannequins sont remarquables. Parfait pour nos événements."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mr-4">
                      <UserGroupIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-pm-gold">Jean-Claude Mba</p>
                      <p className="text-sm text-pm-off-white/60">Organisateur d'événements</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-8 hover:border-pm-gold transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-pm-gold fill-current" />
                    ))}
                  </div>
                  <p className="text-pm-off-white/80 leading-relaxed mb-6">
                    "L'équipe de PMM comprend parfaitement nos besoins créatifs. Leur collaboration a été essentielle au succès de notre collection."
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-pm-gold/20 rounded-full flex items-center justify-center mr-4">
                      <UserGroupIcon className="w-6 h-6 text-pm-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-pm-gold">Sarah Mboumba</p>
                      <p className="text-sm text-pm-off-white/60">Styliste</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

         {/* Réalisations */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Nos Réalisations</h2>
            <AchievementsTabs achievements={agencyAchievements} />
          </motion.div>
        </section>

        
        {/* FAQ Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
        <FAQ faqData={faqData} />
          </motion.div>
        </section>

        {/* Contact CTA */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pm-gold/10 via-transparent to-pm-gold/5"></div>
            <div className="relative z-10 text-center content-section">
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-pm-gold/20 rounded-full mb-6">
                  <EnvelopeIcon className="w-5 h-5 text-pm-gold" />
                  <span className="text-pm-gold font-semibold text-sm uppercase tracking-wider">
                    Contactez-nous
                  </span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair text-pm-gold mb-6 px-4">
                  Une question ? Un projet ?
                </h3>
                
                <p className="text-xl text-pm-off-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Nous serions ravis d'échanger avec vous. Que vous soyez mannequin, créateur, ou organisateur d'événements, notre équipe est là pour vous accompagner.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link 
                    to="/contact" 
                    className="px-10 py-4 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-white hover:scale-105 shadow-lg shadow-pm-gold/20"
                  >
              Nous Contacter
          </Link>
                  <Link 
                    to="/services" 
                    className="px-10 py-4 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
                  >
                    Nos Services
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PhoneIcon className="w-8 h-8 text-pm-gold" />
                    </div>
                    <h4 className="text-lg font-semibold text-pm-gold mb-2">Téléphone</h4>
                    <p className="text-pm-off-white/80">+241 77 50 79 50</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <EnvelopeIcon className="w-8 h-8 text-pm-gold" />
                    </div>
                    <h4 className="text-lg font-semibold text-pm-gold mb-2">Email</h4>
                    <p className="text-pm-off-white/80">contact@perfectmodels.ga</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPinIcon className="w-8 h-8 text-pm-gold" />
                    </div>
                    <h4 className="text-lg font-semibold text-pm-gold mb-2">Adresse</h4>
                    <p className="text-pm-off-white/80">Ancien Sobraga,Libreville, Gabon</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

      </div>
    </div>
  );
};

const DistinctionCard: React.FC<{ distinction: ModelDistinction }> = ({ distinction }) => (
    <div className="bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl p-8 text-center h-full flex flex-col justify-center items-center hover:border-pm-gold transition-all duration-300 group">
        <div className="w-16 h-16 bg-pm-gold/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-pm-gold/30 transition-colors duration-300">
            <CheckBadgeIcon className="w-8 h-8 text-pm-gold" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-playfair text-pm-gold mb-4">{distinction.name}</h3>
        <ul className="text-sm text-pm-off-white/80 space-y-2">
            {distinction.titles.map((title, index) => (
                <li key={index} className="flex items-center justify-center gap-2">
                    <StarIcon className="w-4 h-4 text-pm-gold" />
                    <span>{title}</span>
                </li>
            ))}
        </ul>
    </div>
);

const AchievementsTabs: React.FC<{ achievements: AchievementCategory[] }> = ({ achievements }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="content-section">
            <div role="tablist" aria-label="Nos réalisations" className="flex flex-wrap justify-center gap-2 mb-12">
                {achievements.map((category, index) => (
                    <button
                        key={index}
                        role="tab"
                        id={`tab-${index}`}
                        aria-controls={`tab-panel-${index}`}
                        aria-selected={activeTab === index}
                        onClick={() => setActiveTab(index)}
                        className={`px-6 py-3 text-sm uppercase tracking-wider font-bold transition-all duration-300 rounded-full relative ${
                            activeTab === index 
                                ? 'bg-pm-gold text-pm-dark shadow-lg shadow-pm-gold/20' 
                                : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
            {achievements.map((category, index) => (
                 <motion.div
                    key={index}
                    id={`tab-panel-${index}`}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    aria-labelledby={`tab-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: activeTab === index ? 1 : 0, y: activeTab === index ? 0 : 20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === index && (
                        <div className="animate-fade-in">
                           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-pm-off-white/90">
                                {category.items.map((item, itemIndex) => (
                                    <motion.div 
                                        key={itemIndex} 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: itemIndex * 0.1 }}
                                        className="bg-black/50 backdrop-blur-sm p-6 rounded-xl flex items-start gap-4 border border-pm-gold/20 hover:border-pm-gold transition-all duration-300"
                                    >
                                        <div className="w-8 h-8 bg-pm-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                            <CheckBadgeIcon className="w-5 h-5 text-pm-gold" />
                                    </div>
                                        <span className="leading-relaxed">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                            {category.name === "Défilés de Mode" && 
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="text-center mt-12"
                                >
                                    <div className="bg-gradient-to-r from-pm-gold/10 to-pm-gold/5 border border-pm-gold/20 rounded-2xl p-8 max-w-4xl mx-auto">
                                        <p className="text-pm-gold/90 italic text-lg md:text-xl leading-relaxed">
                                    "Notre agence a participé à tous les événements de mode depuis 2021, son année de création."
                                </p>
                                    </div>
                                </motion.div>
                            }
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    );
};


export default Agency;