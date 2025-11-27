import React from 'react';
import { WifiIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface OfflineIndicatorProps {
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-red-500 text-white px-4 py-3 flex items-center space-x-3 shadow-lg">
        <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            Mode hors ligne
          </p>
          <p className="text-xs opacity-90">
            Certaines fonctionnalités peuvent être limitées
          </p>
        </div>
        <WifiIcon className="w-5 h-5 opacity-50" />
      </div>
      
      {/* Espace pour le contenu qui pourrait être masqué */}
      <div className="h-12" />
    </div>
  );
};

export default OfflineIndicator;
