import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon,
  MusicalNoteIcon,
  SparklesIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface FashionDayEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: string[];
  status: 'planned' | 'in-progress' | 'completed';
  type: 'defile' | 'casting' | 'rehearsal' | 'break';
}

const FashionDayPlanner: React.FC = () => {
  const { data } = useData();
  const [events, setEvents] = useState<FashionDayEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // Simuler des événements Fashion Day
    const mockEvents: FashionDayEvent[] = [
      {
        id: '1',
        title: 'Arrivée des mannequins',
        startTime: '08:00',
        endTime: '09:00',
        location: 'Zone Accueil',
        participants: ['Model1', 'Model2', 'Model3'],
        status: 'completed',
        type: 'rehearsal'
      },
      {
        id: '2',
        title: 'Maquillage & Coiffure',
        startTime: '09:00',
        endTime: '11:00',
        location: 'Backstage',
        participants: ['Model1', 'Model2', 'Model3', 'MUA1', 'Hair1'],
        status: 'in-progress',
        type: 'rehearsal'
      },
      {
        id: '3',
        title: 'Répétition Générale',
        startTime: '11:00',
        endTime: '12:30',
        location: 'Podium',
        participants: ['Model1', 'Model2', 'Model3', 'Choreographer'],
        status: 'planned',
        type: 'rehearsal'
      },
      {
        id: '4',
        title: 'Défilé Session 1',
        startTime: '14:00',
        endTime: '15:30',
        location: 'Podium Principal',
        participants: ['Model1', 'Model2', 'Model3'],
        status: 'planned',
        type: 'defile'
      },
      {
        id: '5',
        title: 'Pause & Networking',
        startTime: '15:30',
        endTime: '16:00',
        location: 'Lounge VIP',
        participants: [],
        status: 'planned',
        type: 'break'
      },
      {
        id: '6',
        title: 'Défilé Session 2',
        startTime: '16:00',
        endTime: '17:30',
        location: 'Podium Principal',
        participants: ['Model1', 'Model2', 'Model3'],
        status: 'planned',
        type: 'defile'
      }
    ];

    setEvents(mockEvents);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getEventStatus = (event: FashionDayEvent) => {
    const now = currentTime;
    const [startHour, startMin] = event.startTime.split(':').map(Number);
    const [endHour, endMin] = event.endTime.split(':').map(Number);
    
    const eventStart = new Date();
    eventStart.setHours(startHour, startMin, 0, 0);
    
    const eventEnd = new Date();
    eventEnd.setHours(endHour, endMin, 0, 0);

    if (now < eventStart) return 'planned';
    if (now >= eventStart && now <= eventEnd) return 'in-progress';
    return 'completed';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'defile': return <SparklesIcon className="w-4 h-4" />;
      case 'casting': return <UserGroupIcon className="w-4 h-4" />;
      case 'rehearsal': return <MusicalNoteIcon className="w-4 h-4" />;
      case 'break': return <ClockIcon className="w-4 h-4" />;
      default: return <ClockIcon className="w-4 h-4" />;
    }
  };

  const startLiveStream = () => {
    setIsLive(true);
    // Simuler le démarrage du live streaming
    setTimeout(() => {
      alert('Live streaming démarré !');
    }, 1000);
  };

  const stopLiveStream = () => {
    setIsLive(false);
    alert('Live streaming arrêté');
  };

  const updateEventStatus = (eventId: string, newStatus: FashionDayEvent['status']) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, status: newStatus } : event
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header avec live streaming */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Fashion Day Planner</h2>
            <p className="text-gray-600 mt-1">
              {currentTime.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Live streaming controls */}
            <div className="flex items-center space-x-2">
              {isLive && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-600 font-medium">LIVE</span>
                </div>
              )}
              <button
                onClick={isLive ? stopLiveStream : startLiveStream}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isLive 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-pm-gold text-white hover:bg-pm-gold/90'
                }`}
              >
                <PlayIcon className="w-4 h-4" />
                <span>{isLive ? 'Arrêter' : 'Démarrer'} Live</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Timeline de la Journée</h3>
        
        <div className="space-y-4">
          {events.map((event, index) => {
            const currentStatus = getEventStatus(event);
            const isActive = currentStatus === 'in-progress';
            
            return (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < events.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-full ${
                    isActive ? 'bg-blue-500' : currentStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                )}
                
                {/* Event card */}
                <div className={`flex items-start space-x-4 p-4 rounded-lg border transition-all ${
                  isActive ? 'bg-blue-50 border-blue-200 shadow-lg' : 
                  currentStatus === 'completed' ? 'bg-green-50 border-green-200' : 
                  'bg-white border-gray-200 hover:shadow-md'
                }`}>
                  {/* Timeline dot */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    isActive ? 'bg-blue-500 border-blue-600 text-white' :
                    currentStatus === 'completed' ? 'bg-green-500 border-green-600 text-white' :
                    'bg-white border-gray-300 text-gray-500'
                  }`}>
                    {currentStatus === 'completed' ? (
                      <CheckCircleIcon className="w-6 h-6" />
                    ) : (
                      getTypeIcon(event.type)
                    )}
                  </div>
                  
                  {/* Event content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(currentStatus)}`}>
                          {currentStatus === 'completed' ? 'Terminé' : 
                           currentStatus === 'in-progress' ? 'En cours' : 'Prévu'}
                        </span>
                        
                        {/* Quick actions */}
                        {currentStatus === 'planned' && (
                          <button
                            onClick={() => updateEventStatus(event.id, 'in-progress')}
                            className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            title="Démarrer"
                          >
                            <PlayIcon className="w-4 h-4" />
                          </button>
                        )}
                        {currentStatus === 'in-progress' && (
                          <button
                            onClick={() => updateEventStatus(event.id, 'completed')}
                            className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                            title="Terminer"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Participants */}
                    {event.participants.length > 0 && (
                      <div className="mt-3 flex items-center space-x-2">
                        <UserGroupIcon className="w-4 h-4 text-gray-400" />
                        <div className="flex -space-x-2">
                          {event.participants.slice(0, 3).map((participant, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 bg-pm-gold rounded-full border-2 border-white flex items-center justify-center"
                              title={participant}
                            >
                              <span className="text-xs text-white font-medium">
                                {participant.charAt(0)}
                              </span>
                            </div>
                          ))}
                          {event.participants.length > 3 && (
                            <div className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                              <span className="text-xs text-gray-600 font-medium">
                                +{event.participants.length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {event.participants.length} participant{event.participants.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ClockIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Événements</p>
              <p className="text-xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Terminés</p>
              <p className="text-xl font-bold text-gray-900">
                {events.filter(e => getEventStatus(e) === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PlayIcon className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-xl font-bold text-gray-900">
                {events.filter(e => getEventStatus(e) === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <UserGroupIcon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="text-xl font-bold text-gray-900">
                {events.reduce((total, e) => total + e.participants.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FashionDayPlanner;
