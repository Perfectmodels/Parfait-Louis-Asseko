
import React, { useState } from 'react';
import SEO from '../../components/SEO';
import { useData } from '../contexts/DataContext';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

const AdminFashionDayEvents: React.FC = () => {
  const { data, saveData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    maxParticipants: '',
    requirements: '',
    imageUrl: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  });

  const fashionDayEvents = data?.fashionDayEvents || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: any = {
      id: editingEvent?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      date: formData.date,
      location: formData.location,
      maxParticipants: parseInt(formData.maxParticipants) || 0,
      requirements: formData.requirements,
      imageUrl: formData.imageUrl,
      status: formData.status,
      createdAt: editingEvent?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    let updatedEvents;
    if (editingEvent) {
      updatedEvents = fashionDayEvents.map((event: any) => 
        event.id === editingEvent.id ? newEvent : event
      );
    } else {
      updatedEvents = [...fashionDayEvents, newEvent];
    }

    saveData({ ...data!, fashionDayEvents: updatedEvents });
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      name: '',
      description: '',
      date: '',
      location: '',
      maxParticipants: '',
      requirements: '',
      imageUrl: '',
      status: 'upcoming'
    });
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      location: event.location,
      maxParticipants: event.maxParticipants.toString(),
      requirements: event.requirements,
      imageUrl: event.imageUrl,
      status: event.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      const updatedEvents = fashionDayEvents.filter((event: any) => event.id !== id);
      saveData({ ...data!, fashionDayEvents: updatedEvents });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
      case 'ongoing': return 'bg-green-600/20 text-green-400 border-green-600/30';
      case 'completed': return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
      case 'cancelled': return 'bg-red-600/20 text-red-400 border-red-600/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-600/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return 'Non défini';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // const isEventUpcoming = (dateString: string) => {
  //   return new Date(dateString) > new Date();
  // };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Événements Fashion Day" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Événements Fashion Day</h1>
            <p className="admin-page-subtitle">Gérer les événements et éditions Fashion Day.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nouvel événement
          </button>
        </header>

        {/* Statistiques */}
        <div className="admin-section-wrapper mb-8">
          <h2 className="admin-section-title">Statistiques</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card-base p-6 text-center">
              <CalendarIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">{fashionDayEvents.length}</h3>
              <p className="text-pm-off-white/70">Total Événements</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <ClockIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {fashionDayEvents.filter((event: any) => event.status === 'upcoming').length}
              </h3>
              <p className="text-pm-off-white/70">À Venir</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <MapPinIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {fashionDayEvents.filter((event: any) => event.status === 'ongoing').length}
              </h3>
              <p className="text-pm-off-white/70">En Cours</p>
            </div>
            
            <div className="card-base p-6 text-center">
              <PencilIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pm-gold mb-2">
                {fashionDayEvents.filter((event: any) => event.status === 'completed').length}
              </h3>
              <p className="text-pm-off-white/70">Terminés</p>
            </div>
          </div>
        </div>

        {/* Liste des événements */}
        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Événements</h2>
          
          {fashionDayEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun événement Fashion Day</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer le premier événement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fashionDayEvents.map((event: any) => (
                <div key={event.id} className="card-base p-6">
                  <div className="aspect-video mb-4 bg-pm-off-white/10 rounded-lg overflow-hidden">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pm-off-white/40">
                        <CalendarIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-pm-gold line-clamp-1">{event.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                  
                  <p className="text-pm-off-white/70 text-sm mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-pm-off-white/50 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Max {event.maxParticipants} participants</span>
                    </div>
                  </div>
                  
                  {event.requirements && (
                    <div className="mb-4">
                      <p className="text-xs text-pm-off-white/50 mb-1"><strong>Exigences:</strong></p>
                      <p className="text-xs text-pm-off-white/70 line-clamp-2">{event.requirements}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(event)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-pm-gold/20 text-pm-gold border border-pm-gold/30 rounded hover:bg-pm-gold/30 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded hover:bg-red-600/30 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement Fashion Day'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Nom de l'événement</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Statut</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="admin-input"
                    >
                      <option value="upcoming">À venir</option>
                      <option value="ongoing">En cours</option>
                      <option value="completed">Terminé</option>
                      <option value="cancelled">Annulé</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="admin-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="admin-textarea"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Date et heure</label>
                    <input
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Lieu</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Nombre max de participants</label>
                    <input
                      type="number"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                      className="admin-input"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">URL de l'image</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      className="admin-input"
                      placeholder="https://exemple.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="admin-label">Exigences (optionnel)</label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                    className="admin-textarea"
                    rows={2}
                    placeholder="Exigences spécifiques pour participer à cet événement..."
                  />
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
                  >
                    {editingEvent ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingEvent(null);
                      setFormData({
                        name: '',
                        description: '',
                        date: '',
                        location: '',
                        maxParticipants: '',
                        requirements: '',
                        imageUrl: '',
                        status: 'upcoming'
                      });
                    }}
                    className="flex-1 px-6 py-3 border border-pm-gold text-pm-gold font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-pm-gold/10 transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFashionDayEvents;
