import React from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface WebSocketStatusProps {
  showDetails?: boolean;
  className?: string;
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { isConnected, connectionState, lastMessage, error, connect, disconnect } = useWebSocket({
    autoConnect: true,
    debugMode: true
  });

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      case 'closing':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Connecté';
      case 'connecting':
        return 'Connexion...';
      case 'disconnected':
        return 'Déconnecté';
      case 'closing':
        return 'Fermeture...';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Indicateur de statut */}
      <div className="flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${isConnected ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      </div>

      {/* Boutons de contrôle */}
      <div className="flex space-x-2">
        {!isConnected ? (
          <button
            onClick={connect}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Reconnecter
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Déconnecter
          </button>
        )}
      </div>

      {/* Détails supplémentaires */}
      {showDetails && (
        <div className="ml-4 text-xs text-gray-600">
          <div>État: {connectionState}</div>
          {lastMessage && (
            <div>
              Dernier message: {lastMessage.type} à {new Date(lastMessage.timestamp).toLocaleTimeString()}
            </div>
          )}
          {error && (
            <div className="text-red-600">
              Erreur: {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebSocketStatus;
