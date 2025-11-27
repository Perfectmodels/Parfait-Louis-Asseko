import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ClockIcon, 
  ExclamationTriangleIcon,
  BellIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface SessionManagerProps {
  className?: string;
}

const SessionManager: React.FC<SessionManagerProps> = ({ className = '' }) => {
  const { user, sessionTimeLeft, extendSession, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);

  useEffect(() => {
    const warningTime = 5 * 60 * 1000; // 5 minutes
    const criticalTime = 2 * 60 * 1000; // 2 minutes

    if (sessionTimeLeft <= criticalTime) {
      setShowWarning(true);
    } else if (sessionTimeLeft <= warningTime) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [sessionTimeLeft]);

  const formatSessionTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}min ${seconds}s`;
    }
    return `${minutes}min ${seconds}s`;
  };

  const getSessionStatus = () => {
    const percentage = (sessionTimeLeft / (72 * 60 * 60 * 1000)) * 100;
    
    if (percentage > 50) return { color: 'green', text: 'Active', icon: ClockIcon };
    if (percentage > 20) return { color: 'yellow', text: 'Expirante', icon: ExclamationTriangleIcon };
    return { color: 'red', text: 'Critique', icon: ExclamationTriangleIcon };
  };

  const status = getSessionStatus();
  const StatusIcon = status.icon;

  if (!user) return null;

  return (
    <>
      {/* Session Status Bar */}
      <div className={`hidden lg:block ${className}`}>
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 bg-${status.color}-500 rounded-full animate-pulse`}></div>
              <StatusIcon className={`w-4 h-4 text-${status.color}-600`} />
              <div>
                <p className="text-sm font-medium text-gray-900">Session: {status.text}</p>
                <p className="text-xs text-gray-500">
                  Temps restant: {formatSessionTime(sessionTimeLeft)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowExtensionModal(true)}
                className="px-3 py-1 text-xs bg-pm-gold text-white rounded-md hover:bg-pm-gold-600 transition-colors"
              >
                Prolonger 72h
              </button>
              
              <button
                onClick={logout}
                className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`bg-${status.color}-500 h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${(sessionTimeLeft / (72 * 60 * 60 * 1000)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Session Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
            <div className="flex items-start space-x-3">
              <div className={`p-2 bg-${status.color}-100 rounded-full`}>
                <StatusIcon className={`w-6 h-6 text-${status.color}-600`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Session sur le point d'expirer
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Votre session expire dans <span className="font-medium">{formatSessionTime(sessionTimeLeft)}</span>.
                  Prolongez votre session pour éviter de perdre votre travail.
                </p>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => {
                      extendSession();
                      setShowWarning(false);
                    }}
                    className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-md hover:bg-pm-gold-600 transition-colors"
                  >
                    Prolonger 72h
                  </button>
                  
                  <button
                    onClick={() => setShowWarning(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => setShowWarning(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Confirmation Modal */}
      {showExtensionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md mx-4 p-6">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Prolonger la session
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Votre session sera prolongée de 72 heures supplémentaires. 
                  Vous resterez connecté jusqu'au {new Date(Date.now() + 72 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}.
                </p>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <BellIcon className="w-4 h-4 text-blue-600" />
                    <p className="text-xs text-blue-800">
                      Vous recevrez une notification 5 minutes avant l'expiration.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => {
                      extendSession();
                      setShowExtensionModal(false);
                      setShowWarning(false);
                    }}
                    className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-md hover:bg-pm-gold-600 transition-colors"
                  >
                    Confirmer
                  </button>
                  
                  <button
                    onClick={() => setShowExtensionModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Notification Warning */}
      {showWarning && (
        <div className="hidden lg:block fixed bottom-4 right-4 z-40 max-w-sm">
          <div className={`bg-white rounded-lg shadow-lg border-l-4 border-${status.color}-500 p-4`}>
            <div className="flex items-start space-x-3">
              <StatusIcon className={`w-5 h-5 text-${status.color}-600 mt-0.5`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Session {status.text.toLowerCase()}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Expire dans {formatSessionTime(sessionTimeLeft)}
                </p>
                <button
                  onClick={() => {
                    extendSession();
                    setShowWarning(false);
                  }}
                  className="mt-2 text-xs text-pm-gold hover:text-pm-gold-600 font-medium"
                >
                  Prolonger maintenant
                </button>
              </div>
              <button
                onClick={() => setShowWarning(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;
