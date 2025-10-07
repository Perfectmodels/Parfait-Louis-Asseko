import React, { useState } from 'react';
import SEO from '../components/SEO';
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
    time: '',
    location: '',
    imageUrl: '',
    price: '',
    maxParticipants: '',
    isActive: true
  });

  const fashionDayEvents = (data?.fashionDayEvents as any[]) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEvent: any = {
      id: editingEvent?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      imageUrl: formData.imageUrl,
      price: formData.price ? parseFloat(formData.price) : 0,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : 0,
      isActive: formData.isActive,
      participants: editingEvent?.participants || [],
      createdAt: editingEvent?.createdAt || new Date().toISOString()
    };

    let updatedEvents;
    if (editingEvent) {
      updatedEvents = fashionDayEvents.map(event => 
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
      time: '',
      location: '',
      imageUrl: '',
      price: '',
      maxParticipants: '',
      isActive: true
    });
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      imageUrl: event.imageUrl,
      price: event.price?.toString() || '',
      maxParticipants: event.maxParticipants?.toString() || '',
      isActive: event.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      const updatedEvents = fashionDayEvents.filter(event => event.id !== id);
      saveData({ ...data!, fashionDayEvents: updatedEvents });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Événements Fashion Day" noIndex />
      <div className="container mx-auto px-6 lg:px-8">
        <header className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Événements Fashion Day</h1>
            <p className="admin-page-subtitle">Gérez les événements et défilés de mode.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Nouvel événement
          </button>
        </header>

        <div className="admin-section-wrapper">
          <h2 className="admin-section-title">Événements</h2>
          
          {fashionDayEvents.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-pm-off-white/30 mx-auto mb-4" />
              <p className="text-pm-off-white/60 text-lg">Aucun événement Fashion Day pour le moment</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white transition-colors"
              >
                Créer le premier événement
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fashionDayEvents.map(event => (
                <div key={event.id} className="card-base p-6">
                  <div className="aspect-video mb-4 bg-pm-off-white/10 rounded-lg overflow-hidden">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-pm-off-white/40">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-pm-gold line-clamp-1">{event.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.isActive 
                        ? 'bg-green-600/20 text-green-400 border border-green-600/30' 
                        : 'bg-red-600/20 text-red-400 border border-red-600/30'
                    }`}>
                      {event.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                  
                  <p className="text-pm-off-white/70 text-sm mb-3 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-1 text-xs text-pm-off-white/50 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    {event.price > 0 && (
                      <p><strong>Prix:</strong> {event.price.toLocaleString('fr-FR')} FCFA</p>
                    )}
                    {event.maxParticipants > 0 && (
                      <p><strong>Participants max:</strong> {event.maxParticipants}</p>
                    )}
                  </div>
                  
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
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">
                {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement Fashion Day'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <label className="admin-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="admin-textarea"
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Heure</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="admin-input"
                      required
                    />
                  </div>
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
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="admin-label">Prix (FCFA)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  
                  <div>
                    <label className="admin-label">Participants maximum</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.maxParticipants}
                      onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 text-pm-gold bg-black border-pm-gold/30 rounded focus:ring-pm-gold focus:ring-2"
                  />
                  <label htmlFor="isActive" className="text-sm text-pm-off-white/80">
                    Événement actif
                  </label>
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
                        time: '',
                        location: '',
                        imageUrl: '',
                        price: '',
                        maxParticipants: '',
                        isActive: true
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