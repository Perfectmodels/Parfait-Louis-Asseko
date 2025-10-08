import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { CalendarEvent } from '../../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Filter } from 'lucide-react';

const AdminCalendar: React.FC = () => {
  const { data, updateData } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['casting', 'fashion-day', 'photoshoot', 'formation', 'meeting', 'absence', 'other']);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    type: 'meeting',
    startDate: new Date().toISOString().slice(0,10),
    endDate: new Date().toISOString().slice(0,10),
    allDay: true,
    location: '',
    description: ''
  });

  // Générer les événements à partir des données existantes
  const events: CalendarEvent[] = useMemo(() => {
    const eventsList: CalendarEvent[] = [];

    // Castings
    data?.castingApplications?.forEach(casting => {
      eventsList.push({
        id: `casting-${casting.id}`,
        title: `Casting: ${casting.firstName} ${casting.lastName}`,
        type: 'casting',
        startDate: casting.submissionDate,
        endDate: casting.submissionDate,
        allDay: true,
        description: `Genre: ${casting.gender}, Taille: ${casting.height}`,
        color: '#8B5CF6',
        status: casting.status === 'Accepté' ? 'completed' : casting.status === 'Refusé' ? 'cancelled' : 'planned',
        relatedId: casting.id
      });
    });

    // Fashion Day Events
    data?.fashionDayEvents?.forEach(event => {
      eventsList.push({
        id: `fashion-day-${event.edition}`,
        title: `Fashion Day ${event.edition}: ${event.theme}`,
        type: 'fashion-day',
        startDate: event.date,
        endDate: event.date,
        allDay: true,
        location: event.location,
        description: event.description,
        color: '#F59E0B',
        status: 'confirmed'
      });
    });

    // Absences
    data?.absences?.forEach(absence => {
      eventsList.push({
        id: `absence-${absence.id}`,
        title: `Absence: ${absence.modelName}`,
        type: 'absence',
        startDate: absence.date,
        endDate: absence.date,
        allDay: true,
        description: `Raison: ${absence.reason}${absence.notes ? ` - ${absence.notes}` : ''}`,
        color: '#EF4444',
        status: absence.isExcused ? 'confirmed' : 'planned'
      });
    });

    // Ajouter les événements du calendrier stockés
    if (data?.calendarEvents) {
      eventsList.push(...data.calendarEvents);
    }

    return eventsList;
  }, [data]);

  // Filtrer les événements par type sélectionné
  const filteredEvents = events.filter(event => selectedTypes.includes(event.type));

  // Générer les jours du mois
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Jours du mois précédent
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Jours du mois actuel
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const eventTypeColors = {
    casting: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-500' },
    'fashion-day': { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-500' },
    photoshoot: { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-500' },
    formation: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
    meeting: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
    absence: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
    other: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' }
  };

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Calendrier Unifié</h1>
            <button
              onClick={() => setShowEventModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <Plus className="w-5 h-5" />
              Nouvel Événement
            </button>
          </div>
          <p className="text-gray-600">Tous vos événements en un seul endroit</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={goToToday}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm font-medium"
              >
                Aujourd'hui
              </button>
            </div>

            {/* Filtres */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-gray-600" />
              {Object.entries(eventTypeColors).map(([type, colors]) => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    selectedTypes.includes(type)
                      ? `${colors.bg} ${colors.text}`
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {type === 'fashion-day' ? 'Fashion Day' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 bg-gray-50 border-b">
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-700 text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isToday = day && 
                day.toDateString() === new Date().toDateString();
              const isCurrentMonth = day && 
                day.getMonth() === currentDate.getMonth();

              return (
                <div
                  key={index}
                  className={`min-h-[120px] border-b border-r p-2 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                  } ${isToday ? 'bg-blue-50' : ''}`}
                >
                  {day && (
                    <>
                      <div className={`text-sm font-semibold mb-2 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event, idx) => {
                          const colors = eventTypeColors[event.type];
                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedEvent(event)}
                              className={`${colors.bg} ${colors.text} text-xs p-1 rounded cursor-pointer hover:opacity-80 transition truncate border-l-2 ${colors.border}`}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 pl-1">
                            +{dayEvents.length - 3} autres
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h3>
                  <p className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${eventTypeColors[selectedEvent.type].bg} ${eventTypeColors[selectedEvent.type].text}`}>
                    {selectedEvent.type}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Date</p>
                  <p className="text-gray-900">
                    {new Date(selectedEvent.startDate).toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>

                {selectedEvent.location && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lieu</p>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Description</p>
                    <p className="text-gray-900">{selectedEvent.description}</p>
                  </div>
                )}

                {selectedEvent.status && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Statut</p>
                    <p className="text-gray-900 capitalize">{selectedEvent.status}</p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Fermer
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Légende</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(eventTypeColors).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${colors.bg} border-2 ${colors.border}`}></div>
                <span className="text-sm text-gray-700 capitalize">
                  {type === 'fashion-day' ? 'Fashion Day' : type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Create Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-xl w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Nouvel Événement</h2>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Titre"
                />
                <select
                  value={newEvent.type as string}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })}
                  className="w-full border rounded px-3 py-2"
                >
                  {Object.keys(eventTypeColors).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={String(newEvent.startDate).slice(0,10)}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                  <input
                    type="date"
                    value={String(newEvent.endDate).slice(0,10)}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="border rounded px-3 py-2"
                  />
                </div>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Lieu (optionnel)"
                />
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Description (optionnel)"
                  rows={3}
                />
              </div>
              <div className="mt-5 flex gap-2">
                <button onClick={() => setShowEventModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded">Annuler</button>
                <button
                  onClick={() => {
                    const ev: CalendarEvent = {
                      id: `evt-${Date.now()}`,
                      title: newEvent.title || 'Événement',
                      type: (newEvent.type as any) || 'meeting',
                      startDate: String(newEvent.startDate),
                      endDate: String(newEvent.endDate),
                      allDay: newEvent.allDay ?? true,
                      location: newEvent.location,
                      description: newEvent.description,
                      status: 'planned'
                    };
                    const updated = [...(data?.calendarEvents || []), ev];
                    updateData({ calendarEvents: updated });
                    setShowEventModal(false);
                    setNewEvent({ title: '', type: 'meeting', startDate: new Date().toISOString().slice(0,10), endDate: new Date().toISOString().slice(0,10), allDay: true, location: '', description: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCalendar;

