import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgressiveLoading } from '../hooks/useProgressiveLoading';

interface AdvancedLoaderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const AdvancedLoader: React.FC<AdvancedLoaderProps> = ({ 
  children, 
  fallback 
}) => {
  const { loadingState, progress, metrics, isComplete } = useProgressiveLoading();
  
  const defaultFallback = (
    <div className="fixed inset-0 bg-pm-dark z-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo animé */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pm-gold to-yellow-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-pm-gold/30">
            <span className="text-2xl font-bold text-pm-dark">PMM</span>
          </div>
        </motion.div>
        
        {/* Titre de chargement */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-pm-gold mb-2">
            Chargement de l'excellence...
          </h2>
          <p className="text-pm-off-white/70">
            Préparation de votre expérience premium
          </p>
        </motion.div>
        
        {/* Barre de progression */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="w-full bg-pm-gold/20 rounded-full h-3 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pm-gold to-yellow-400 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-pm-off-white/60">
              {progress}% complété
            </span>
            <span className="text-sm text-pm-gold font-semibold">
              {getLoadingMessage(loadingState)}
            </span>
          </div>
        </motion.div>
        
        {/* Indicateurs de chargement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="space-y-3"
        >
          <LoadingIndicator
            label="Données"
            isActive={loadingState.data}
            isComplete={loadingState.data}
          />
          <LoadingIndicator
            label="Images"
            isActive={loadingState.images}
            isComplete={loadingState.images}
          />
          <LoadingIndicator
            label="Composants"
            isActive={loadingState.components}
            isComplete={loadingState.components}
          />
        </motion.div>
        
        {/* Métriques de performance */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8 p-4 bg-black/50 rounded-lg border border-pm-gold/20"
            >
              <h3 className="text-sm font-semibold text-pm-gold mb-2">
                Performance
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-pm-off-white/70">
                <div>Temps: {metrics.loadTime.toFixed(0)}ms</div>
                <div>Mémoire: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
  
  return (
    <AnimatePresence mode="wait">
      {!isComplete ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {fallback || defaultFallback}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant d'indicateur de chargement
const LoadingIndicator: React.FC<{
  label: string;
  isActive: boolean;
  isComplete: boolean;
}> = ({ label, isActive, isComplete }) => (
  <div className="flex items-center gap-3">
    <div className="w-4 h-4 flex-shrink-0">
      {isComplete ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      ) : isActive ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-4 h-4 border-2 border-pm-gold border-t-transparent rounded-full"
        />
      ) : (
        <div className="w-4 h-4 bg-pm-gold/20 rounded-full" />
      )}
    </div>
    <span className={`text-sm transition-colors ${
      isComplete ? 'text-green-400' : isActive ? 'text-pm-gold' : 'text-pm-off-white/50'
    }`}>
      {label}
    </span>
  </div>
);

// Fonction pour obtenir le message de chargement
const getLoadingMessage = (loadingState: any) => {
  if (loadingState.components) return 'Finalisation...';
  if (loadingState.images) return 'Optimisation des images...';
  if (loadingState.data) return 'Chargement des données...';
  return 'Initialisation...';
};

export default AdvancedLoader;
