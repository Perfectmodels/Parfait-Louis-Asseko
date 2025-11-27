import React, { useState, useEffect } from 'react';
import { DevicePhoneMobileIcon, ComputerDesktopIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePWA } from '../hooks/usePWA';

interface PWAInstallPromptProps {
  className?: string;
}

export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const { pwaInfo, installPWA, showIOSInstallInstructions } = usePWA();
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Afficher le prompt après 5 secondes si l'application n'est pas installée
    const timer = setTimeout(() => {
      if (!dismissed && pwaInfo.isInstallable && !pwaInfo.isStandalone) {
        setIsVisible(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [pwaInfo.isInstallable, pwaInfo.isStandalone, dismissed]);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      if (pwaInfo.platform === 'ios') {
        const success = showIOSInstallInstructions();
        if (success) {
          setIsVisible(false);
          setDismissed(true);
        }
      } else {
        const success = await installPWA();
        if (success) {
          setIsVisible(false);
          setDismissed(true);
        }
      }
    } catch (error) {
      console.error('[PWA] Erreur lors de l\'installation:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Ne pas afficher si déjà installé, en mode standalone, ou rejeté
  if (!isVisible || pwaInfo.isStandalone || dismissed) {
    return null;
  }

  const getPlatformIcon = () => {
    switch (pwaInfo.platform) {
      case 'ios':
      case 'android':
        return <DevicePhoneMobileIcon className="w-6 h-6" />;
      default:
        return <ComputerDesktopIcon className="w-6 h-6" />;
    }
  };

  const getInstallText = () => {
    switch (pwaInfo.platform) {
      case 'ios':
        return 'Installer sur l\'écran d\'accueil';
      case 'android':
        return 'Installer l\'application';
      default:
        return 'Installer l\'application';
    }
  };

  const getDescription = () => {
    switch (pwaInfo.platform) {
      case 'ios':
        return 'Accédez à Perfect Models directement depuis votre écran d\'accueil';
      case 'android':
        return 'Installez l\'application pour un accès rapide et hors ligne';
      default:
        return 'Installez l\'application pour une meilleure expérience';
    }
  };

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 ${className}`}>
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl shadow-2xl p-4 border border-yellow-300 backdrop-blur-sm">
        <div className="flex items-start space-x-3">
          {/* Icône de plateforme */}
          <div className="flex-shrink-0 bg-white/20 rounded-lg p-2">
            {getPlatformIcon()}
          </div>
          
          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1">
              Perfect Models
            </h3>
            <p className="text-sm text-white/90 mb-3">
              {getDescription()}
            </p>
            
            {/* Actions */}
            <div className="flex space-x-2">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 bg-white text-yellow-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInstalling ? 'Installation...' : getInstallText()}
              </button>
              
              <button
                onClick={handleDismiss}
                className="bg-white/20 text-white px-3 py-2 rounded-lg font-medium text-sm hover:bg-white/30 transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
          
          {/* Bouton de fermeture */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Indicateur de progression pour iOS */}
        {pwaInfo.platform === 'ios' && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs text-white/80">
              <strong>Instructions iOS:</strong> Appuyez sur "Partager" → "Sur l'écran d'accueil"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
