import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PhoneIcon, 
  VideoCameraIcon, 
  MicrophoneIcon, 
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  VideoCameraSlashIcon,
  MicrophoneSlashIcon,
  PhoneXMarkIcon,
  SignalSlashIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
  MinusIcon,
  PlusIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

interface CallInterfaceProps {
  call: {
    id: string;
    chatId: string;
    type: 'voice' | 'video';
    status: 'calling' | 'connected' | 'ended';
    participants: string[];
    startTime: number;
  };
  onEndCall: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({ call, onEndCall }) => {
  const { activeChat } = useChat();
  const { user } = useAuth();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'unknown'>('unknown');
  const [showParticipants, setShowParticipants] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Timer pour la durée d'appel
  useEffect(() => {
    if (call.status === 'connected') {
      const interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - call.startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [call.status, call.startTime]);

  // Simulation de la qualité de connexion
  useEffect(() => {
    const qualities: Array<'excellent' | 'good' | 'poor'> = ['excellent', 'good', 'poor'];
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
    setConnectionQuality(randomQuality);
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionQualityIcon = () => {
    if (connectionQuality === 'poor') {
      return <SignalSlashIcon className="w-4 h-4" />;
    }
    return null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Logique pour couper/activer le micro
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    // Logique pour couper/activer la vidéo
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // Logique pour couper/activer le haut-parleur
  };

  const getParticipantName = (participantId: string) => {
    const participant = activeChat?.participants.find(p => p.id === participantId);
    return participant?.name || 'Utilisateur inconnu';
  };

  if (call.status === 'ended') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 text-center">
          <PhoneXMarkIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Appel terminé</h3>
          <p className="text-gray-600 mb-4">Durée : {formatDuration(callDuration)}</p>
          <button
            onClick={onEndCall}
            className="px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-pm-gold-600"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 bg-black z-50 ${call.type === 'video' ? '' : 'flex items-center justify-center'}`}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-pm-gold rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                {activeChat?.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-white font-medium">{activeChat?.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-white/80">
                <span className={getConnectionQualityColor()}>
                  {call.status === 'calling' ? 'Appel en cours...' : formatDuration(callDuration)}
                </span>
                {getConnectionQualityIcon()}
                {call.participants.length > 1 && (
                  <span className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1" />
                    {call.participants.length}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg"
            >
              <UserGroupIcon className="w-5 h-5" />
            </button>
            {call.type === 'video' && (
              <button
                onClick={toggleFullscreen}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg"
              >
                <ArrowsPointingOutIcon className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onEndCall}
              className="p-2 text-white hover:bg-red-500 rounded-lg"
            >
              <PhoneXMarkIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Video Content */}
      {call.type === 'video' ? (
        <div className="relative w-full h-full">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
          />
          
          {/* Local Video */}
          <div className="absolute top-20 right-4 w-32 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <video
              ref={localVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              style={{ display: isVideoOff ? 'none' : 'block' }}
            />
            {isVideoOff && (
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <VideoCameraSlashIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* Mute indicator for local video */}
            {isMuted && (
              <div className="absolute bottom-2 left-2 bg-red-500 rounded-full p-1">
                <MicrophoneSlashIcon className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Voice Call Interface */
        <div className="flex flex-col items-center justify-center text-white">
          <div className="w-32 h-32 bg-pm-gold rounded-full flex items-center justify-center mb-8">
            <span className="text-white font-medium text-4xl">
              {activeChat?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-2xl font-medium mb-2">{activeChat?.name}</h2>
          <p className="text-white/80 mb-8">
            {call.status === 'calling' ? 'Appel en cours...' : formatDuration(callDuration)}
          </p>
          
          {/* Waveform animation for voice call */}
          <div className="flex items-center space-x-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-pm-gold/60 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 30}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/80 backdrop-blur-sm p-4 z-20">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white font-medium">Participants ({call.participants.length + 1})</h4>
            <button
              onClick={() => setShowParticipants(false)}
              className="p-1 text-white/60 hover:text-white"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Self */}
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-pm-gold rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium">{user?.name} (Vous)</p>
                <div className="flex items-center space-x-2 text-sm text-white/60">
                  {isMuted && <MicrophoneSlashIcon className="w-3 h-3" />}
                  {call.type === 'video' && isVideoOff && <VideoCameraSlashIcon className="w-3 h-3" />}
                </div>
              </div>
            </div>
            
            {/* Other participants */}
            {call.participants.map(participantId => (
              <div key={participantId} className="flex items-center space-x-3 text-white">
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {getParticipantName(participantId).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{getParticipantName(participantId)}</p>
                  <p className="text-sm text-white/60">En ligne</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
        <div className="flex items-center justify-center space-x-4">
          {/* Mute/Unmute */}
          <button
            onClick={toggleMute}
            className={`p-4 rounded-full transition-colors ${
              isMuted 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isMuted ? (
              <MicrophoneSlashIcon className="w-6 h-6" />
            ) : (
              <MicrophoneIcon className="w-6 h-6" />
            )}
          </button>

          {/* Video On/Off (only for video calls) */}
          {call.type === 'video' && (
            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isVideoOff ? (
                <VideoCameraSlashIcon className="w-6 h-6" />
              ) : (
                <VideoCameraIcon className="w-6 h-6" />
              )}
            </button>
          )}

          {/* Speaker On/Off */}
          <button
            onClick={toggleSpeaker}
            className={`p-4 rounded-full transition-colors ${
              !isSpeakerOn 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isSpeakerOn ? (
              <SpeakerWaveIcon className="w-6 h-6" />
            ) : (
              <SpeakerXMarkIcon className="w-6 h-6" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={onEndCall}
            className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <PhoneXMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallInterface;
