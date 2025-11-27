import React, { useState } from 'react';
import SEO from '../components/SEO';
import Layout from '../components/icons/Layout';
import { useWebSocket, useWebSocketChat } from '../hooks/useWebSocket';
import WebSocketStatus from '../components/WebSocketStatus';

const WebSocketTest: React.FC = () => {
  const [testMessage, setTestMessage] = useState('');
  const [roomId, setRoomId] = useState('test-room');
  const [logs, setLogs] = useState<string[]>([]);

  const {
    functions,
    isConnected,
    lastMessage,
    error,
    send,
    joinRoom,
    leaveRoom
  } = useWebSocket({
    url: 'ws://localhost:8080',
    autoConnect: true,
    debugMode: true
  });

  // Hook de chat test
  const {
    messages,
    isTyping,
    sendMessage
  } = useWebSocketChat(roomId, {
    id: 'test-user',
    name: 'Test User',
    role: 'admin'
  });

  // Ajouter des logs
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp}: ${message}`, ...prev].slice(0, 50)); // Garder seulement les 50 derniers logs
  };

  // Logger les événements WebSocket
  React.useEffect(() => {
    if (isConnected) {
      addLog('✅ WebSocket connecté');
    } else {
      addLog('❌ WebSocket déconnecté');
    }
  }, [isConnected]);

  React.useEffect(() => {
    if (lastMessage) {
      addLog(`📨 Message reçu: ${lastMessage.type} - ${JSON.stringify(lastMessage.payload)}`);
    }
  }, [lastMessage]);

  React.useEffect(() => {
    if (error) {
      addLog(`🚨 Erreur: ${error.message}`);
    }
  }, [error]);

  // Tests des fonctions
  const testBasicMessage = () => {
    send({
      type: 'test_message',
      payload: { message: testMessage, timestamp: Date.now() }
    });
    addLog(`📤 Message envoyé: ${testMessage}`);
    setTestMessage('');
  };

  const testJoinRoom = () => {
    joinRoom(roomId);
    addLog(`🏠 Rejoint la salle: ${roomId}`);
  };

  const testLeaveRoom = () => {
    leaveRoom(roomId);
    addLog(`🚪 Quitte la salle: ${roomId}`);
  };

  const testChatMessage = () => {
    sendMessage(testMessage);
    addLog(`💬 Message de chat envoyé: ${testMessage}`);
    setTestMessage('');
  };

  const testNotification = () => {
    if (functions) {
      functions.sendNotificationToUser('test-user', {
        title: 'Test Notification',
        body: 'Ceci est une notification de test',
        type: 'info',
        data: { test: true }
      });
      addLog('🔔 Notification envoyée');
    }
  };

  const testBooking = () => {
    if (functions) {
      functions.sendBookingRequest({
        modelId: 'model-1',
        clientId: 'client-1',
        date: '2025-12-01',
        duration: 2,
        location: 'Libreville',
        description: 'Shooting photo',
        budget: 50000
      });
      addLog('📅 Demande de booking envoyée');
    }
  };

  const testCasting = () => {
    if (functions) {
      functions.submitCastingApplication({
        name: 'Test Model',
        email: 'test@example.com',
        phone: '+241123456789',
        age: 25,
        height: '1m75',
        category: 'Défilé',
        experience: '2 ans',
        portfolio: ['photo1.jpg', 'photo2.jpg']
      });
      addLog('🎭 Candidature casting envoyée');
    }
  };

  const testPing = () => {
    if (functions) {
      functions.ping();
      addLog('🏓 Ping envoyé');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <Layout>
      <SEO 
        title="WebSocket Test | Perfect Models Management"
        description="Page de test pour les fonctionnalités WebSocket"
        keywords="websocket, test, perfect models"
      />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Test WebSocket
          </h1>

          {/* Statut WebSocket */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Statut de connexion
            </h2>
            <WebSocketStatus showDetails={true} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Panneau de contrôle */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Panneau de contrôle
              </h2>
              
              <div className="space-y-4">
                {/* Message de test */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message de test
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      placeholder="Entrez un message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={testBasicMessage}
                      disabled={!isConnected}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>

                {/* Salle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salle
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      placeholder="Nom de la salle"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={testJoinRoom}
                      disabled={!isConnected}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                    >
                      Rejoindre
                    </button>
                    <button
                      onClick={testLeaveRoom}
                      disabled={!isConnected}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    >
                      Quitter
                    </button>
                  </div>
                </div>

                {/* Tests de fonctions */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Tests des fonctions
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={testChatMessage}
                      disabled={!isConnected}
                      className="px-3 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-400"
                    >
                      Chat Message
                    </button>
                    <button
                      onClick={testNotification}
                      disabled={!isConnected}
                      className="px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 disabled:bg-gray-400"
                    >
                      Notification
                    </button>
                    <button
                      onClick={testBooking}
                      disabled={!isConnected}
                      className="px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      Booking
                    </button>
                    <button
                      onClick={testCasting}
                      disabled={!isConnected}
                      className="px-3 py-2 bg-pink-600 text-white text-sm rounded hover:bg-pink-700 disabled:bg-gray-400"
                    >
                      Casting
                    </button>
                    <button
                      onClick={testPing}
                      disabled={!isConnected}
                      className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 disabled:bg-gray-400"
                    >
                      Ping
                    </button>
                    <button
                      onClick={clearLogs}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Clear Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  Logs
                </h2>
                <span className="text-sm text-gray-500">
                  {logs.length} entrées
                </span>
              </div>
              
              <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-gray-500">Aucun log pour le moment...</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages de chat */}
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Messages de chat ({roomId})
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-md h-48 overflow-y-auto mb-4">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center">Aucun message...</div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    <span className="font-medium text-blue-600">
                      {msg.sender?.name || 'Unknown'}:
                    </span>{' '}
                    {msg.content}
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Indicateurs de frappe */}
            {Object.entries(isTyping).some(([, typing]) => typing) && (
              <div className="text-sm text-gray-500 mb-2">
                {Object.entries(isTyping)
                  .filter(([, typing]) => typing)
                  .map(([userId]) => userId)
                  .join(', ')} est en train d'écrire...
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WebSocketTest;
