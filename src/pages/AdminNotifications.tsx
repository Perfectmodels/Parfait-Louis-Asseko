import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Notification } from '../../types';
import { Bell, Send, Users, Check, Trash2, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react';

const AdminNotifications: React.FC = () => {
  const { data, updateData } = useData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    priority: 'medium' as Notification['priority'],
    recipientType: 'all' as 'all' | 'models' | 'specific',
    recipientIds: [] as string[]
  });

  const notifications: Notification[] = data?.notifications || [];
  const models = data?.models || [];

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSendNotification = () => {
    let recipients: string[] = [];

    if (newNotification.recipientType === 'all') {
      recipients = models.map(m => m.id);
    } else if (newNotification.recipientType === 'models') {
      recipients = models.map(m => m.id);
    } else {
      recipients = newNotification.recipientIds;
    }

    const newNotifs: Notification[] = recipients.map(userId => ({
      id: `notif-${Date.now()}-${userId}`,
      userId,
      type: newNotification.type,
      title: newNotification.title,
      message: newNotification.message,
      read: false,
      priority: newNotification.priority,
      createdAt: new Date().toISOString()
    }));

    updateData({
      notifications: [...notifications, ...newNotifs]
    });

    setShowCreateModal(false);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      recipientType: 'all',
      recipientIds: []
    });
  };

  const handleMarkAsRead = (id: string) => {
    updateData({
      notifications: notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    });
  };

  const handleMarkAllAsRead = () => {
    updateData({
      notifications: notifications.map(n => ({ ...n, read: true }))
    });
  };

  const handleDelete = (id: string) => {
    updateData({
      notifications: notifications.filter(n => n.id !== id)
    });
  };

  const typeConfig = {
    info: { icon: Info, color: 'bg-blue-100 text-blue-800', border: 'border-blue-500' },
    success: { icon: CheckCircle, color: 'bg-green-100 text-green-800', border: 'border-green-500' },
    warning: { icon: AlertCircle, color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500' },
    error: { icon: XCircle, color: 'bg-red-100 text-red-800', border: 'border-red-500' },
    casting: { icon: Users, color: 'bg-purple-100 text-purple-800', border: 'border-purple-500' },
    payment: { icon: CheckCircle, color: 'bg-green-100 text-green-800', border: 'border-green-500' },
    event: { icon: Bell, color: 'bg-orange-100 text-orange-800', border: 'border-orange-500' },
    message: { icon: Bell, color: 'bg-pink-100 text-pink-800', border: 'border-pink-500' }
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications Push</h1>
              <p className="text-gray-600 mt-2">Communiquez instantanément avec vos utilisateurs</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <Send className="w-5 h-5" />
              Envoyer une notification
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Non lues</p>
                <p className="text-2xl font-bold text-orange-600">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Lues</p>
                <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-purple-600">{models.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-pm-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'unread'
                    ? 'bg-pm-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Non lues ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'read'
                    ? 'bg-pm-gold text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Lues ({notifications.length - unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                <Check className="w-4 h-4" />
                Tout marquer comme lu
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map(notification => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            const model = models.find(m => m.id === notification.userId);

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${config.border} ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${config.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-gray-900">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                        {notification.priority && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[notification.priority]}`}>
                            {notification.priority}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-600 mb-3">{notification.message}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Pour: {model?.name || 'Utilisateur inconnu'}</span>
                        <span>•</span>
                        <span>{new Date(notification.createdAt).toLocaleString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                        title="Marquer comme lu"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredNotifications.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune notification</p>
            </div>
          )}
        </div>

        {/* Create Notification Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nouvelle Notification</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={newNotification.title}
                    onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Titre de la notification"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                    placeholder="Contenu du message"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newNotification.type}
                      onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value as Notification['type'] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                    >
                      <option value="info">Info</option>
                      <option value="success">Succès</option>
                      <option value="warning">Avertissement</option>
                      <option value="error">Erreur</option>
                      <option value="casting">Casting</option>
                      <option value="payment">Paiement</option>
                      <option value="event">Événement</option>
                      <option value="message">Message</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                    <select
                      value={newNotification.priority}
                      onChange={(e) => setNewNotification({ ...newNotification, priority: e.target.value as Notification['priority'] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destinataires</label>
                  <select
                    value={newNotification.recipientType}
                    onChange={(e) => setNewNotification({ ...newNotification, recipientType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                  >
                    <option value="all">Tous les utilisateurs</option>
                    <option value="models">Tous les mannequins</option>
                    <option value="specific">Utilisateurs spécifiques</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={!newNotification.title || !newNotification.message}
                  className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;

