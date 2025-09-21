import React from 'react';
import { motion } from 'framer-motion';
import { Module } from '../types';
import { BookOpenIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface CourseCardProps {
    course: Module;
    index: number;
    isBeginner?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index, isBeginner = false }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group bg-black/50 backdrop-blur-sm border border-pm-gold/20 rounded-xl overflow-hidden h-full flex flex-col"
        >
            <div className="p-8 flex-grow">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-playfair text-pm-gold group-hover:text-yellow-300 transition-colors duration-300">
                        {course.title}
                    </h3>
                    <div className="flex-shrink-0 ml-4 p-3 bg-pm-gold/10 rounded-full">
                        <BookOpenIcon className="w-7 h-7 text-pm-gold" />
                    </div>
                </div>
                
                <p className="text-pm-off-white/70 mb-6 font-light leading-relaxed">
                    {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-pm-off-white/60 mb-8">
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5" />
                        <span>{course.duration}</span>
                    </div>
                </div>
            </div>

            <div className="bg-pm-gold/5 mt-auto p-6">
                <div className="flex items-center justify-between">
                    <div className="font-bold text-pm-off-white text-lg">
                        {isBeginner ? 'Atelier Découverte' : 'Module Professionnel'}
                    </div>
                    <div className="flex items-center gap-2 text-pm-gold font-semibold group-hover:text-yellow-300 transition-colors">
                        <span>En savoir plus</span>
                        <ArrowRightIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CourseCard;
