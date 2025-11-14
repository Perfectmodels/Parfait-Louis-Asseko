import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import type { EditorialCalendar } from '../../types';
import { 
  CalendarIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  EyeIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TagIcon,
  FireIcon,
  StarIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const EditorialCalendar: React.FC = () => {
  const { data, saveData } = useData();
  const [calendarItems, setCalendarItems] = useState<EditorialCalendar[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<EditorialCalendar | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (data?.editorialCalendar) {
      setCalendarItems(data.editorialCalendar);
    }
  }, [data?.editorialCalendar]);

  const filteredItems = calendarItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || filterType === 'all'; // Since EditorialCalendar doesn't have type
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getItemsForDate = (date: Date) => {
    return filteredItems.filter(item => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      return date >= startDate && date <= endDate;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in-progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = () => {
    return DocumentTextIcon; // Default icon since EditorialCalendar doesn't have type
  };

  const handleCreateItem = (itemData: Partial<EditorialCalendar>) => {
    const newItem: EditorialCalendar = {
      id: Date.now().toString(),
      title: itemData.title || '',
      description: itemData.description || '',
      startDate: itemData.startDate || selectedDate.toISOString().split('T')[0],
      endDate: itemData.endDate || selectedDate.toISOString().split('T')[0],
      status: 'planning',
      articles: itemData.articles || [],
      assignedUsers: itemData.assignedUsers || [],
      theme: itemData.theme || '',
      season: itemData.season || '',
      priority: itemData.priority || 'medium',
      budget: itemData.budget,
      notes: itemData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedItems = [...calendarItems, newItem];
    setCalendarItems(updatedItems);
    if (data) {
      saveData({ ...data, editorialCalendar: updatedItems });
    }
    setShowCreateModal(false);
  };

  const handleUpdateItem = (updatedItem: EditorialCalendar) => {
    const updatedItems = calendarItems.map(item => 
      item.id === updatedItem.id ? { ...updatedItem, updatedAt: new Date().toISOString() } : item
    );
    setCalendarItems(updatedItems);
    if (data) {
      saveData({ ...data, editorialCalendar: updatedItems });
    }
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      const updatedItems = calendarItems.filter(item => item.id !== itemId);
      setCalendarItems(updatedItems);
      if (data) {
        saveData({ ...data, editorialCalendar: updatedItems });
      }
    }
  };

  const getStats = () => {
    const total = filteredItems.length;
    const planned = filteredItems.filter(item => item.status === 'planned').length;
    const inProgress = filteredItems.filter(item => item.status === 'in-progress').length;
    const completed = filteredItems.filter(item => item.status === 'completed').length;
    const cancelled = filteredItems.filter(item => item.status === 'cancelled').length;
    
    return { total, planned, inProgress, completed, cancelled };
  };

  const stats = getStats();

  return (
    <div className="bg-black border border-pm-gold/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-pm-gold mb-2">
            Calendrier Éditorial
          </h3>
          <p className="text-pm-off-white/70 text-sm">
            Planifiez et suivez toutes vos activités éditoriales
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-1 bg-pm-gold/20 text-pm-gold rounded-lg text-sm hover:bg-pm-gold/30 transition-colors"
          >
            <ChartBarIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-pm-gold text-black rounded-lg font-medium hover:bg-pm-gold/90 transition-colors flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-3">
            <div className="text-2xl font-bold text-pm-off-white">{stats.total}</div>
            <div className="text-xs text-pm-off-white/70">Total</div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">{stats.planned}</div>
            <div className="text-xs text-blue-400/70">Planifié</div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">{stats.inProgress}</div>
            <div className="text-xs text-yellow-400/70">En cours</div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-xs text-green-400/70">Terminé</div>
          </div>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-red-400">{stats.cancelled}</div>
            <div className="text-xs text-red-400/70">Annulé</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pm-off-white/50" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold text-sm"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="planned">Planifié</option>
          <option value="in-progress">En cours</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
        
        <select
          className="px-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold text-sm"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tous les types</option>
          <option value="article">Article</option>
          <option value="photoshoot">Séance photo</option>
          <option value="video">Vidéo</option>
          <option value="interview">Interview</option>
        </select>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('month')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'month' 
                ? 'bg-pm-gold text-black' 
                : 'bg-pm-dark border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
            }`}
          >
            Mois
          </button>
          <button
            onClick={() => setViewMode('week')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'week' 
                ? 'bg-pm-gold text-black' 
                : 'bg-pm-dark border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
            }`}
          >
            Semaine
          </button>
          <button
            onClick={() => setViewMode('day')}
            className={`px-3 py-2 rounded-lg text-sm transition-colors ${
              viewMode === 'day' 
                ? 'bg-pm-gold text-black' 
                : 'bg-pm-dark border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
            }`}
          >
            Jour
          </button>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
            className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5 rotate-180" />
          </button>
          
          <h4 className="text-lg font-semibold text-pm-off-white">
            {selectedDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h4>
          
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
            className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-pm-off-white/70 py-2">
              {day}
            </div>
          ))}
          
          {/* Days */}
          {getDaysInMonth(selectedDate).map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }
            
            const dayItems = getItemsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={date.toISOString()}
                className={`aspect-square border rounded-lg p-1 cursor-pointer transition-colors ${
                  isToday ? 'border-pm-gold bg-pm-gold/10' : 'border-pm-gold/20 hover:border-pm-gold/50'
                } ${isSelected ? 'ring-2 ring-pm-gold' : ''}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs font-medium text-pm-off-white mb-1">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayItems.slice(0, 2).map(item => {
                    const IconComponent = getTypeIcon();
                    return (
                      <div
                        key={item.id}
                        className={`text-xs p-1 rounded border ${getStatusColor(item.status)}`}
                        title={item.title}
                      >
                        <div className="flex items-center gap-1">
                          <IconComponent className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </div>
                      </div>
                    );
                  })}
                  {dayItems.length > 2 && (
                    <div className="text-xs text-pm-off-white/50 text-center">
                      +{dayItems.length - 2}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-pm-gold mb-3">
          {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h4>
        
        <div className="space-y-3">
          {getItemsForDate(selectedDate).map(item => {
            const IconComponent = getTypeIcon();
            return (
              <div
                key={item.id}
                className="bg-pm-dark border border-pm-gold/20 rounded-lg p-4 hover:border-pm-gold/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${getStatusColor(item.status)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-pm-off-white">{item.title}</h5>
                      <p className="text-sm text-pm-off-white/70 mb-2">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {item.assignedUsers.length > 0 && (
                          <span className="px-2 py-1 bg-pm-gold/20 text-pm-gold rounded-full">
                            {item.assignedUsers.length} assigné(s)
                          </span>
                        )}
                        {item.priority && (
                          <span className={`px-2 py-1 rounded-full ${
                            item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {item.priority}
                          </span>
                        )}
                        {item.budget && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                            {item.budget}€
                          </span>
                        )}
                      </div>
                      
                      {item.notes && (
                        <p className="text-xs text-pm-off-white/50 mt-2">{item.notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 text-pm-gold/70 hover:text-pm-gold"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1 text-red-500/70 hover:text-red-500"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {getItemsForDate(selectedDate).length === 0 && (
            <div className="text-center py-8">
              <CalendarIcon className="w-12 h-12 text-pm-gold/20 mx-auto mb-3" />
              <p className="text-pm-off-white/50">
                Aucune activité prévue pour cette date
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-pm-dark border border-pm-gold/20 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h4 className="text-lg font-semibold text-pm-gold mb-4">
              {editingItem ? 'Modifier l\'élément' : 'Ajouter un élément'}
            </h4>
            
            <CalendarItemForm
              item={editingItem}
              selectedDate={selectedDate}
              onSave={editingItem ? handleUpdateItem : handleCreateItem}
              onCancel={() => {
                setShowCreateModal(false);
                setEditingItem(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface CalendarItemFormProps {
  item: EditorialCalendar | null;
  selectedDate: Date;
  onSave: (item: Partial<EditorialCalendar>) => void;
  onCancel: () => void;
}

const CalendarItemForm: React.FC<CalendarItemFormProps> = ({ item, selectedDate, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    description: item?.description || '',
    startDate: item?.startDate || selectedDate.toISOString().split('T')[0],
    endDate: item?.endDate || selectedDate.toISOString().split('T')[0],
    status: item?.status || 'planning',
    articles: item?.articles || [],
    assignedUsers: item?.assignedUsers || [],
    theme: item?.theme || '',
    season: item?.season || '',
    priority: item?.priority || 'medium',
    budget: item?.budget,
    notes: item?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-pm-off-white mb-1">
          Titre
        </label>
        <input
          type="text"
          required
          className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-pm-off-white mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold resize-none"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-1">
            Date de début
          </label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-1">
            Date de fin
          </label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-1">
            Statut
          </label>
          <select
            className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="planned">Planifié</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-1">
            Priorité
          </label>
          <select
            className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-1">
            Thème
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
            value={formData.theme}
            onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-pm-off-white mb-1">
            Saison
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-pm-off-white mb-1">
          Budget (€)
        </label>
        <input
          type="number"
          min="0"
          className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold"
          value={formData.budget || ''}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-pm-off-white mb-1">
          Notes
        </label>
        <textarea
          className="w-full px-3 py-2 bg-black border border-pm-gold/20 rounded-lg text-pm-off-white focus:outline-none focus:border-pm-gold resize-none"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
      
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-pm-gold text-black rounded-lg font-medium hover:bg-pm-gold/90 transition-colors"
        >
          {item ? 'Mettre à jour' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-pm-dark border border-pm-gold/20 text-pm-off-white rounded-lg font-medium hover:border-pm-gold/50 transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default EditorialCalendar;
