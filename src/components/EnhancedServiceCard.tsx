import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Service } from '../types';
import { useCart } from '../contexts/CartContext';
import { 
    AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
    MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
    PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon, HeartIcon,
    UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon, ArrowRightIcon,
    ShoppingCartIcon, CheckCircleIcon
} from '@heroicons/react/24/outline';

const iconMap: { [key: string]: React.ElementType } = {
  AcademicCapIcon, CameraIcon, UserGroupIcon, SparklesIcon, ClipboardDocumentCheckIcon, 
  MegaphoneIcon, IdentificationIcon, ScissorsIcon, PaintBrushIcon, CalendarDaysIcon, 
  PresentationChartLineIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, PhotoIcon, StarIcon,
  UsersIcon, BriefcaseIcon, MicrophoneIcon, BuildingStorefrontIcon
};

interface EnhancedServiceCardProps {
  service: Service;
  index?: number;
}

const EnhancedServiceCard: React.FC<EnhancedServiceCardProps> = ({ service, index = 0 }) => {
  const Icon = iconMap[service.icon] || HeartIcon;
  const { addToCart, isInCart } = useCart();

  const isServiceInCart = isInCart(service.id);

  const handleCartClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isServiceInCart) {
          addToCart(service);
      }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ 
        y: -12,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className="group relative"
    >
      <Link 
        to={service.isComingSoon ? '#' : `/services/${service.slug}`}
        className="block focus:outline-none focus:ring-2 focus:ring-pm-gold focus:ring-offset-2 focus:ring-offset-pm-dark rounded-xl"
        aria-disabled={service.isComingSoon}
      >
        <div className="relative bg-gray-900/40 border border-pm-gold/20 rounded-xl p-8 h-full flex flex-col transition-all duration-500 group-hover:border-pm-gold group-hover:shadow-2xl group-hover:shadow-pm-gold/20 group-hover:bg-gray-900/60 overflow-hidden">
          {/* Effet de brillance au survol */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pm-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Badge "Bientôt disponible" */}
          {service.isComingSoon && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="absolute top-4 right-4"
            >
              <span className="bg-pm-dark text-pm-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-pm-gold/50 backdrop-blur-sm">
                Bientôt disponible
              </span>
            </motion.div>
          )}
          
          {/* Icône avec animation */}
          <motion.div 
            className="flex-shrink-0 mb-6"
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <Icon className="w-14 h-14 text-pm-gold transition-all duration-300 group-hover:text-pm-gold/80" />
              {/* Effet de halo */}
              <div className="absolute inset-0 bg-pm-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>
          
          {/* Contenu */}
          <div className="flex-grow">
            <motion.h3 
              className="text-2xl font-playfair text-pm-gold mb-4 group-hover:text-white transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {service.title}
            </motion.h3>
            
            <motion.p 
              className="text-pm-off-white/80 mb-6 leading-relaxed group-hover:text-pm-off-white transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              {service.description}
            </motion.p>
            
            {/* Tags de service */}
            <motion.div 
              className="flex flex-wrap gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {service.tags?.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="px-3 py-1 bg-pm-gold/10 text-pm-gold text-xs rounded-full border border-pm-gold/20"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
          
          {/* Boutons d'action */}
          <motion.div 
            className="mt-auto flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <span 
              className={`relative inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 overflow-hidden group/btn ${
                service.isComingSoon 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                  : 'bg-pm-gold text-pm-dark hover:bg-white hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/30'
              }`}
            >
              <span className="relative z-10">Voir les détails</span>
              {!service.isComingSoon && (
                  <ArrowRightIcon className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1" />
              )}
            </span>

            {!service.isComingSoon && (
              <button
                  onClick={handleCartClick}
                  disabled={isServiceInCart}
                  className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm rounded-full transition-all duration-300 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed ${
                      isServiceInCart
                          ? 'bg-green-600 text-white'
                          : 'border-2 border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark'
                  }`}
                  aria-label={isServiceInCart ? "Ajouté au panier" : "Ajouter au panier"}
              >
                  {isServiceInCart 
                      ? <CheckCircleIcon className="w-5 h-5" />
                      : <ShoppingCartIcon className="w-5 h-5" />
                  }
                  <span>{isServiceInCart ? 'Ajouté' : 'Ajouter'}</span>
              </button>
            )}
          </motion.div>
          
          {/* Indicateur de progression (pour les services en cours) */}
          {service.progress && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <div className="flex items-center justify-between text-xs text-pm-off-white/60 mb-2">
                <span>Progression</span>
                <span>{service.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  className="bg-pm-gold h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${service.progress}%` }}
                  transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default EnhancedServiceCard;
