import React from 'react';
import { ArrowPathIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface PublicPageLoaderProps {
  isInitialized: boolean;
  hasError?: boolean;
  onRetry?: () => void;
}

const PublicPageLoader: React.FC<PublicPageLoaderProps> = ({ 
  isInitialized, 
  hasError = false, 
  onRetry 
}) => {
  if (isInitialized) return null;

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {hasError ? (
          <>
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-playfair text-red-400 mb-4">
              Problème de connexion
            </h2>
            <p className="text-pm-off-white/80 mb-6">
              Impossible de charger les données. Vérifiez votre connexion internet.
            </p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 mx-auto px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-pm-gold/90 transition-colors"
              >
                <ArrowPathIcon className="w-5 h-5" />
                Réessayer
              </button>
            )}
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-pm-gold/30 border-t-pm-gold"></div>
            </div>
            <h2 className="text-2xl font-playfair text-pm-gold mb-4">
              Chargement...
            </h2>
            <p className="text-pm-off-white/80">
              Initialisation de Perfect Models Management
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PublicPageLoader;
