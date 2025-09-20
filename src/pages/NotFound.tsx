import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  const { data } = useData();

  return (
    <>
      <SEO 
        title="Page Non Trouvée" 
        description="Désolé, la page que vous recherchez n'existe pas ou a été déplacée." 
        image={data?.siteConfig.logo} 
        noIndex 
      />
      <div className="min-h-screen bg-pm-dark flex items-center justify-center text-center px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="w-32 h-32 mx-auto mb-6 bg-pm-gold/10 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-16 h-16 text-pm-gold" />
              </div>
              <h1 className="text-8xl md:text-9xl font-playfair text-pm-gold font-bold" style={{ textShadow: '0 0 20px rgba(212, 175, 55, 0.5)' }}>
                404
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-pm-off-white">Page non trouvée</h2>
              <p className="text-lg text-pm-off-white/70 max-w-md mx-auto">
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/" 
                  className="inline-flex items-center gap-2 px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white hover:shadow-lg hover:shadow-pm-gold/20"
                >
                  <HomeIcon className="w-5 h-5" />
                  Retour à l'accueil
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button 
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 px-8 py-3 border-2 border-pm-gold text-pm-gold font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-pm-gold hover:text-pm-dark"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Page précédente
                </button>
              </motion.div>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 border-t border-pm-gold/20"
            >
              <p className="text-sm text-pm-off-white/60 mb-4">Ou explorez nos pages populaires :</p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/mannequins" className="text-pm-gold hover:text-white transition-colors text-sm">
                  Nos Mannequins
                </Link>
                <span className="text-pm-gold/30">•</span>
                <Link to="/magazine" className="text-pm-gold hover:text-white transition-colors text-sm">
                  Magazine
                </Link>
                <span className="text-pm-gold/30">•</span>
                <Link to="/contact" className="text-pm-gold hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
