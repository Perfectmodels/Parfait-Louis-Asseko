import React, { useState, useEffect } from 'react';
import { Model, BookingRequest } from '../types';
import { useData } from '../contexts/DataContext';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface SmartBookingCalendarProps {
  model?: Model;
  onBookingSelect?: (booking: BookingRequest) => void;
  adminMode?: boolean;
}

const SmartBookingCalendar: React.FC<SmartBookingCalendarProps> = ({
  model,
  onBookingSelect,
  adminMode = false
}) => {
  const { data } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  useEffect(() => {
    if (data?.bookingRequests) {
      const modelBookings = model 
        ? data.bookingRequests.filter((b: any) => b.requestedModels.includes(model.id))
        : data.bookingRequests;
      setBookings(modelBookings);
    }
  }, [data, model]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Ajouter les jours vides du début
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Ajouter tous les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.startDate || booking.submissionDate);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé': return 'bg-green-100 text-green-800 border-green-200';
      case 'En attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Annulé': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatPrice = (price?: number) => {
    return `${(price || 150000).toLocaleString()} FCFA`; // Prix par défaut si non spécifié
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const days = getDaysInMonth(currentDate);

  if (viewMode === 'week') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Vue Semaine</h3>
          <button
            onClick={() => setViewMode('month')}
            className="px-3 py-1 bg-pm-gold text-white rounded-md hover:bg-pm-gold/90 transition-colors text-sm"
          >
            Vue Mois
          </button>
        </div>
        <p className="text-gray-500 text-center py-8">Vue semaine en développement...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-gray-600">‹</span>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-gray-600">›</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setViewMode('week')}
              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors text-sm"
            >
              Semaine
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-600">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-4">
          {days.map((day, index) => {
            const dayBookings = day ? getBookingsForDate(day) : [];
            const isToday = day?.toDateString() === new Date().toDateString();
            const isSelected = day?.toDateString() === selectedDate?.toDateString();

            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border rounded-lg transition-colors ${
                  !day ? 'bg-gray-50 border-gray-100' :
                  isSelected ? 'bg-pm-gold/10 border-pm-gold' :
                  isToday ? 'bg-blue-50 border-blue-200' :
                  'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => day && setSelectedDate(day)}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday ? 'text-blue-600' : 'text-gray-900'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    {/* Bookings du jour */}
                    <div className="space-y-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking.id}
                          className={`text-xs p-1 rounded truncate cursor-pointer border ${getStatusColor(booking.status)}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onBookingSelect?.(booking);
                          }}
                          title={`${booking.clientName} - ${formatPrice()}`}
                        >
                          {booking.clientName}
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayBookings.length - 2} plus
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

      {/* Booking details sidebar */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {getBookingsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun booking ce jour</p>
            ) : (
              getBookingsForDate(selectedDate).map((booking) => (
                <div
                  key={booking.id}
                  className={`p-3 border rounded-lg ${getStatusColor(booking.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{booking.clientName}</div>
                      <div className="text-sm opacity-75">
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{booking.startDate ? new Date(booking.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '09:00'}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <CurrencyDollarIcon className="w-4 h-4" />
                          <span>{formatPrice()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {booking.status === 'Confirmé' && (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      )}
                      {booking.status === 'Annulé' && (
                        <XCircleIcon className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  {adminMode && (
                    <div className="mt-3 pt-3 border-t border-current/20">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {booking.requestedModels || 'Modèles non spécifiés'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartBookingCalendar;
