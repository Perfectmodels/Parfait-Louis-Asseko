import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Client, ClientContact, Project } from '../../types';
import {
  Search, Plus, Building, Users, Phone, Mail, Star, X
} from 'lucide-react';

const AdminCRM: React.FC = () => {
  const { data, updateData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const clients: Client[] = data?.clients || [];
  const projects: Project[] = data?.projects || [];

  const filteredClients = clients.filter(client => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || client.type === filterType;
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getClientProjects = (clientId: string) => {
    return projects.filter(p => p.clientId === clientId);
  };

  const getClientRevenue = (clientId: string) => {
    return getClientProjects(clientId).reduce(
      (sum, p) => sum + (p.actualCost || p.budget || 0),
      0
    );
  };

  const handleAddClient = () => {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: '',
      email: '',
      phone: '',
      type: 'Individual',
      status: 'Active',
      createdAt: new Date().toISOString(),
      contacts: []
    };
    setSelectedClient(newClient);
    setShowClientModal(true);
  };

  const handleSaveClient = (client: Client) => {
    const updatedClients =
      clients.find(c => c.id === client.id)
        ? clients.map(c => (c.id === client.id ? client : c))
        : [...clients, client];

    updateData({ clients: updatedClients });
    setShowClientModal(false);
    setSelectedClient(null);
  };

  const handleAddContact = (contact: Omit<ClientContact, 'id'>) => {
    if (!selectedClient) return;

    const newContact: ClientContact = {
      ...contact,
      id: `contact-${Date.now()}`
    };

    const updatedClient: Client = {
      ...selectedClient,
      contacts: [...(selectedClient.contacts || []), newContact],
      lastContactDate: contact.date
    };

    handleSaveClient(updatedClient);
    setShowContactModal(false);
  };

  const typeIcons = {
    Agency: <Building className="w-5 h-5" />,
    Brand: <Star className="w-5 h-5" />,
    Photographer: <Users className="w-5 h-5" />,
    Individual: <Users className="w-5 h-5" />,
    Other: <Users className="w-5 h-5" />
  };

  const statusColors = {
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-gray-100 text-gray-800',
    VIP: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CRM - Gestion Clients</h1>
          <button
            onClick={handleAddClient}
            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
          >
            <Plus className="w-5 h-5" /> Nouveau Client
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
          >
            <option value="all">Tous les types</option>
            <option value="Agency">Agence</option>
            <option value="Brand">Marque</option>
            <option value="Photographer">Photographe</option>
            <option value="Individual">Individuel</option>
            <option value="Other">Autre</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
          >
            <option value="all">Tous les statuts</option>
            <option value="Active">Actif</option>
            <option value="Inactive">Inactif</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Clients List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => {
            const revenue = getClientRevenue(client.id);
            const clientProjects = getClientProjects(client.id);

            return (
              <div
                key={client.id}
                className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">{typeIcons[client.type]}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{client.company}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}>
                    {client.status}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" />{client.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" />{client.phone}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4">
                  <div>
                    <p className="text-xs text-gray-500">Projets</p>
                    <p className="text-lg font-bold">{clientProjects.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenus</p>
                    <p className="text-lg font-bold text-green-600">{revenue.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun client trouvé</p>
            <button
              onClick={handleAddClient}
              className="mt-4 px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              Ajouter un client
            </button>
          </div>
        )}
      </div>

      {/* MODALE CLIENT */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 relative">
            <button
              onClick={() => setShowClientModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">{selectedClient.name ? 'Modifier le client' : 'Nouveau client'}</h2>

            <div className="space-y-3">
              <input type="text" placeholder="Nom" value={selectedClient.name}
                onChange={e => setSelectedClient({ ...selectedClient, name: e.target.value })}
                className="w-full border p-2 rounded" />
              <input type="text" placeholder="Entreprise" value={selectedClient.company || ''}
                onChange={e => setSelectedClient({ ...selectedClient, company: e.target.value })}
                className="w-full border p-2 rounded" />
              <input type="email" placeholder="Email" value={selectedClient.email}
                onChange={e => setSelectedClient({ ...selectedClient, email: e.target.value })}
                className="w-full border p-2 rounded" />
              <input type="tel" placeholder="Téléphone" value={selectedClient.phone}
                onChange={e => setSelectedClient({ ...selectedClient, phone: e.target.value })}
                className="w-full border p-2 rounded" />
              <select value={selectedClient.status}
                onChange={e => setSelectedClient({ ...selectedClient, status: e.target.value as any })}
                className="w-full border p-2 rounded">
                <option value="Active">Actif</option>
                <option value="Inactive">Inactif</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowClientModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 rounded-lg"
              >Annuler</button>
              <button
                onClick={() => handleSaveClient(selectedClient)}
                className="flex-1 px-4 py-2 bg-pm-gold text-white rounded-lg"
              >Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCRM;
