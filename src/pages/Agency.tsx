
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckBadgeIcon, 
  ChevronDownIcon, 
  StarIcon, 
  UserGroupIcon, 
  TrophyIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { AchievementCategory, ModelDistinction, FAQCategory, TeamMember } from '../types';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';

const FAQ: React.FC<{ faqData: FAQCategory[] }> = ({ faqData }) => {
    const [openFAQ, setOpenFAQ] = useState<string | null>('0-0');

    const toggleFAQ = (id: string) => {
        setOpenFAQ(openFAQ === id ? null : id);
    };

    if (!faqData || faqData.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-pm-off-white">Questions Fréquemment Posées</h2>
            <div className="max-w-4xl mx-auto space-y-3">
                {faqData.map((category, catIndex) => (
                    <div key={catIndex}>
                        <h3 className="text-2xl font-playfair text-pm-gold mb-4">{category.category}</h3>
                        <div className="space-y-3">
                            {category.items.map((item, itemIndex) => {
                                const faqId = `${catIndex}-${itemIndex}`;
                                const isOpen = openFAQ === faqId;
                                return (
                                    <div key={itemIndex} className="bg-black/30 border border-pm-gold/20 rounded-lg overflow-hidden transition-all duration-300 hover:border-pm-gold/50">
                                        <button
                                            onClick={() => toggleFAQ(faqId)}
                                            className="w-full flex justify-between items-center p-5 text-left"
                                        >
                                            <span className="font-semibold text-lg text-pm-off-white">{item.question}</span>
                                            <ChevronDownIcon className={`w-6 h-6 text-pm-gold flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        <div
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
                ))}\
            </div>
        </section>
    );
};

const Agency: React.FC = () => {
  const { data, isInitialized } = useData();

  if (!isInitialized || !data) {
    return <div className="min-h-screen bg-pm-dark"></div>;
  }
  
  const { agencyInfo, faqData, siteImages, teamMembers } = data;

  const pageTitle = "Notre Agence";
  const pageSubtitle = "Au coeur de l'excellence, nous façonnons l'avenir de la mode au Gabon et au-delà.";
  const heroImage = siteImages.agencyHistory;
  const callToAction = { text: "Découvrez nos mannequins", link: "/mannequins" };

  return (
    <div className="bg-pm-dark">
      <SEO 
        title={pageTitle}
        description={pageSubtitle}
        image={heroImage}
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
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-pm-dark via-pm-dark/60 to-transparent" />
        </motion.div>
        
        <div className="container mx-auto px-6 h-full flex flex-col justify-end pb-24 relative">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-6xl md:text-8xl font-playfair font-bold text-white mb-6"
            dangerouslySetInnerHTML={{ __html: pageTitle }}
          />
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="text-lg md:text-xl text-pm-off-white/80 max-w-2xl mb-8"
          >
            {pageSubtitle}
          </motion.p>
          {callToAction && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            >
              <Link
                to={callToAction.link}
                className="inline-flex items-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-bold text-lg rounded-full hover:bg-white transition-all shadow-lg hover:shadow-pm-gold/20"
              >
                <span>{callToAction.text}</span>
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="space-y-20 md:space-y-28">
          
          {/* Notre Histoire */}
          <section>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
                className="relative rounded-2xl overflow-hidden shadow-2xl"
              >
                <img 
                  src={siteImages.agencyHistory} 
                  alt="L'équipe Perfect Models Management" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-6 text-pm-gold">Notre Histoire</h2>
                <div className="space-y-4 text-lg leading-relaxed text-pm-off-white/90">
                  <p>{agencyInfo.about.p1}</p>
                  <p>{agencyInfo.about.p2}</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Nos Valeurs */}
          <section>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-pm-off-white">Nos Valeurs Fondamentales</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {agencyInfo.values.map((value: { name: string, description: string }, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="bg-black/30 border border-pm-gold/20 rounded-xl p-8 text-center transition-all duration-300 hover:border-pm-gold hover:shadow-2xl hover:shadow-pm-gold/10"
                >
                  <div className="w-16 h-16 bg-pm-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    {index === 0 && <StarIcon className="w-8 h-8 text-pm-gold" />}
                    {index === 1 && <CheckBadgeIcon className="w-8 h-8 text-pm-gold" />}
                    {index === 2 && <AcademicCapIcon className="w-8 h-8 text-pm-gold" />}
                  </div>
                  <h3 className="text-2xl font-playfair text-pm-gold mb-3">{value.name}</h3>
                  <p className="text-pm-off-white/80">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Section Équipe */}
          <section>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-playfair text-pm-off-white">Notre Équipe</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(teamMembers as TeamMember[])
                  ?.filter(member => member.isPublic)
                  ?.sort((a, b) => a.order - b.order)
                  ?.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-black/30 border border-pm-gold/20 rounded-xl p-6 text-center transition-all duration-300 hover:border-pm-gold"
                    >
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-pm-gold/30">
                        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xl font-bold text-pm-gold mb-1">{member.name}</h3>
                      <p className="font-semibold text-pm-off-white/80 mb-3">{member.position}</p>
                      <div className="flex justify-center gap-4 text-pm-gold/70">
                          {member.email && <a href={`mailto:${member.email}`} className="hover:text-pm-gold"><EnvelopeIcon className="w-5 h-5" /></a>}
                          {member.phone && <a href={`tel:${member.phone}`} className="hover:text-pm-gold"><PhoneIcon className="w-5 h-5" /></a>}
                          {member.socialLinks?.linkedin && <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-pm-gold"><LinkIcon className="w-5 h-5" /></a>}
                      </div>
                    </motion.div>
                ))}
              </div>
          </section>

          {/* FAQ Section */}
          <FAQ faqData={faqData as FAQCategory[]} />

        </div>
      </div>
    </div>
  );
};

export default Agency;
