import React, { useState, useEffect } from 'react';
import { 
  ClockIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { sessionService } from '../services/sessionService';

interface SessionStatusProps {
  onSessionExpired?: () => void;
  showDetails?: boolean;
}

const SessionStatus: React.FC<SessionStatusProps> = ({ 
  onSessionExpired, 
  showDetails = false 
}) => {
  const [sessionStats, setSessionStats] = useState(sessionService.getSessionStats());
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    // Vérifier la session toutes les minutes
    const interval = setInterval(() => {
      const stats = sessionService.getSessionStats();
      setSessionStats(stats);

      if (!stats.isValid && onSessionExpired) {
        onSessionExpired();
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [onSessionExpired]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      sessionService.extendSession();
      setSessionStats(sessionService.getSessionStats());
    } catch (error) {
      console.error('Erreur lors de la prolongation de la session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  if (!sessionStats.isValid) {
    return null;
  }

  return (
    <div className={`${showDetails ? 'p-4' : 'p-2'} rounded-lg ${
      sessionStats.isExpiringSoon 
        ? 'bg-orange-500/10 border border-orange-500/30' 
        : 'bg-green-500/10 border border-green-500/30'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {sessionStats.isExpiringSoon ? (
            <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
          ) : (
            <CheckCircleIcon className="w-4 h-4 text-green-500" />
          )}
          <div>
            <p className={`text-xs font-medium ${
              sessionStats.isExpiringSoon ? 'text-orange-500' : 'text-green-500'
            }`}>
              Session active
            </p>
            {showDetails && (
              <p className="text-xs text-gray-500">
                Expire dans {sessionStats.timeLeft}
              </p>
            )}
          </div>
        </div>

        {sessionStats.isExpiringSoon && (
          <button
            onClick={handleExtendSession}
            disabled={isExtending}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-pm-gold/20 text-pm-gold rounded-md hover:bg-pm-gold/30 disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-3 h-3 ${isExtending ? 'animate-spin' : ''}`} />
            {isExtending ? 'Prolongation...' : 'Prolonger'}
          </button>
        )}
      </div>

      {showDetails && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Utilisateur: {sessionStats.userData?.name}</p>
          <p>Rôle: {sessionStats.userData?.role}</p>
          <p>Dernière activité: {new Date(sessionStats.userData?.lastActivity).toLocaleString('fr-FR')}</p>
        </div>
      )}
    </div>
  );
};

export default SessionStatus;
