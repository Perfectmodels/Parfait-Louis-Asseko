import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayIcon, StarIcon } from '@heroicons/react/24/outline';
import CountdownTimer from './CountdownTimer';
import { FashionDayEvent } from '../types';

interface HeroSectionProps {
  nextEvent?: FashionDayEvent;
}

const HeroSection: React.FC<HeroSectionProps> = ({ nextEvent }) => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4AF37' fill-opacity='0.1'%3E%3Cpath d='M30 0L35 20L55 20L40 30L45 50L30 40L15 50L20 30L5 20L25 20Z'/%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-32 h-32 bg-pm-gold/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-60 right-20 w-40 h-40 bg-pm-gold/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pm-gold/4 rounded-full blur-2xl animate-pulse delay-2000"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-8"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-pm-gold/10 border border-pm-gold/30 rounded-full px-6 py-3 text-pm-gold text-sm font-semibold"
                    >
                        <StarIcon className="w-4 h-4" />
                        Agence de mannequins #1 au Gabon
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="text-5xl md:text-7xl font-playfair text-pm-off-white leading-tight"
                    >
                        <span className="block">Découvrez</span>
                        <span className="block text-pm-gold">l'Excellence</span>
                        <span className="block">du Mannequinat</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="text-xl md:text-2xl text-pm-off-white/80 max-w-3xl mx-auto leading-relaxed"
                    >
                        Perfect Models Management vous connecte aux meilleurs talents du Gabon. 
                        Des mannequins professionnels, une formation complète et des services sur mesure 
                        pour tous vos projets créatifs.
                    </motion.p>

                     {/* Event Countdown or CTA Buttons */}
                     {nextEvent ? (
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.8, duration: 0.8 }}
                             className="mt-10 bg-black/50 backdrop-blur-sm py-6 px-4 rounded-lg border border-pm-gold/20"
                         >
                             <h3 className="text-2xl md:text-3xl font-playfair text-white mb-2">
                                 Prochain Événement : Perfect Fashion Day - Édition {nextEvent.edition}
                             </h3>
                             <p className="text-lg md:text-xl text-pm-gold mb-6">"{nextEvent.theme}"</p>
                             <div className="my-6">
                                 <CountdownTimer targetDate={nextEvent.date} />
                             </div>
                             <Link 
                                 href="/fashion-day-application" 
                                 className="mt-4 inline-block px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full text-center transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-pm-gold/30 hover:scale-105 transform"
                             >
                                 Participer à l'Édition 2
                             </Link>
                         </motion.div>
                     ) : (
                         <motion.div
                             initial={{ opacity: 0, y: 20 }}
                             animate={{ opacity: 1, y: 0 }}
                             transition={{ delay: 0.8, duration: 0.8 }}
                             className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                         >
                             <Link
                                 href="/mannequins"
                                 className="group inline-flex items-center gap-3 bg-pm-gold text-pm-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-lg shadow-pm-gold/20"
                             >
                                 Découvrir nos mannequins
                                 <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                             </Link>
                             
                             <Link
                                 href="/services"
                                 className="group inline-flex items-center gap-3 border-2 border-pm-gold text-pm-gold px-8 py-4 rounded-full font-bold text-lg hover:bg-pm-gold hover:text-pm-dark transition-all duration-300"
                             >
                                 <PlayIcon className="w-5 h-5" />
                                 Nos services
                             </Link>
                         </motion.div>
                     )}

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto pt-12"
                    >
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pm-gold">50+</div>
                            <div className="text-pm-off-white/70">Mannequins actifs</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pm-gold">200+</div>
                            <div className="text-pm-off-white/70">Projets réalisés</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-pm-gold">5★</div>
                            <div className="text-pm-off-white/70">Satisfaction client</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
                <div className="w-6 h-10 border-2 border-pm-gold/50 rounded-full flex justify-center">
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-3 bg-pm-gold rounded-full mt-2"
                    />
                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
