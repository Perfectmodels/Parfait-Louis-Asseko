import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Contract, ContractTemplate } from '../../types';
import { Search, Plus, FileText, Clock, CheckCircle, XCircle, Calendar, DollarSign, Users, Filter } from 'lucide-react';

const AdminContracts: React.FC = () => {
  const { data, updateData } = useData();
  const [activeTab, setActiveTab] = useState<'contracts' | 'templates'>('contracts');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);

  const contracts: Contract[] = data?.contracts || [];
  const templates: ContractTemplate[] = data?.contractTemplates || [];

  // Filtrer les contrats
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.parties.partyA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.parties.partyB.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    const matchesType = filterType === 'all' || contract.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusConfig = {
    Draft: { color: 'bg-gray-100 text-gray-800', icon: FileText },
    Pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Signed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Active: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
    Expired: { color: 'bg-red-100 text-red-800', icon: XCircle },
    Terminated: { color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const contractTypeColors = {
    Model: 'border-l-4 border-purple-500',
    Client: 'border-l-4 border-blue-500',
    Photographer: 'border-l-4 border-pink-500',
    Stylist: 'border-l-4 border-green-500',
    Other: 'border-l-4 border-gray-500'
  };

  const handleCreateFromTemplate = (template: ContractTemplate) => {
    const newContract: Contract = {
      id: `contract-${Date.now()}`,
      templateId: template.id,
      title: template.name,
      type: template.type,
      parties: {
        partyA: { name: 'Perfect Models Management', role: 'Agence' },
        partyB: { name: '', role: '' }
      },
      content: template.content,
      startDate: new Date().toISOString(),
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...contracts, newContract];
    updateData({ contracts: updated });
    alert('Contrat créé (brouillon).');
  };

  const handleCreateBlank = () => {
    const newContract: Contract = {
      id: `contract-${Date.now()}`,
      title: 'Nouveau Contrat',
      type: 'Client',
      parties: {
        partyA: { name: 'Perfect Models Management', role: 'Agence' },
        partyB: { name: '', role: '' }
      },
      content: '<p>Contenu du contrat...</p>',
      startDate: new Date().toISOString(),
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [...(data?.contracts || []), newContract];
    updateData({ contracts: updated });
    alert('Contrat vide créé (brouillon).');
  };

  const getContractStats = () => {
    return {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'Active').length,
      pending: contracts.filter(c => c.status === 'Pending').length,
      expired: contracts.filter(c => c.status === 'Expired').length,
      totalValue: contracts.reduce((sum, c) => sum + (c.value || 0), 0)
    };
  };

  const stats = getContractStats();

  const defaultTemplates: ContractTemplate[] = [
    {
      id: 'template-model-1',
      name: 'Contrat Mannequin Standard',
      type: 'Model',
      content: `
        <h2>CONTRAT DE MANNEQUINAT</h2>
        <p>Entre les soussignés :</p>
        <p><strong>Perfect Models Management</strong>, agence de mannequins...</p>
        <p>Et <strong>{modelName}</strong>, ci-après dénommé(e) "le Mannequin"</p>
        
        <h3>Article 1 - Objet du contrat</h3>
        <p>Le présent contrat a pour objet de définir les conditions de collaboration...</p>
        
        <h3>Article 2 - Durée</h3>
        <p>Le présent contrat est conclu pour une durée de {duration}...</p>
        
        <h3>Article 3 - Rémunération</h3>
        <p>Le Mannequin percevra {commission}% de commission sur chaque prestation...</p>
      `,
      variables: ['modelName', 'duration', 'commission'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'template-client-1',
      name: 'Contrat Client - Prestation',
      type: 'Client',
      content: `
        <h2>CONTRAT DE PRESTATION</h2>
        <p>Entre les soussignés :</p>
        <p><strong>Perfect Models Management</strong></p>
        <p>Et <strong>{clientName}</strong>, ci-après dénommé "le Client"</p>
        
        <h3>Article 1 - Prestations</h3>
        <p>L'agence s'engage à fournir {serviceDescription}...</p>
        
        <h3>Article 2 - Tarification</h3>
        <p>Le montant total de la prestation s'élève à {amount} FCFA...</p>
      `,
      variables: ['clientName', 'serviceDescription', 'amount'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Contrats</h1>
            <button
              onClick={() => setShowContractModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <Plus className="w-5 h-5" />
              Nouveau Contrat
            </button>
          </div>
          <p className="text-gray-600">Créez et gérez vos contrats avec des templates personnalisables</p>
          <div className="mt-3">
            <button onClick={handleCreateBlank} className="text-sm text-pm-gold hover:underline">
              + Créer un contrat vide (brouillon)
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-gray-600">Actifs</p>
            </div>
            <p className="text-3xl font-bold text-blue-600">{stats.active}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-gray-600">En attente</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-gray-600">Expirés</p>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.expired}</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <p className="text-sm text-gray-600">Valeur totale</p>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {(stats.totalValue / 1000000).toFixed(1)}M
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('contracts')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'contracts'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Contrats ({contracts.length})
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'templates'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Templates ({templates.length + defaultTemplates.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'contracts' ? (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un contrat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              >
                <option value="all">Tous les types</option>
                <option value="Model">Mannequin</option>
                <option value="Client">Client</option>
                <option value="Photographer">Photographe</option>
                <option value="Stylist">Styliste</option>
                <option value="Other">Autre</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              >
                <option value="all">Tous les statuts</option>
                <option value="Draft">Brouillon</option>
                <option value="Pending">En attente</option>
                <option value="Signed">Signé</option>
                <option value="Active">Actif</option>
                <option value="Expired">Expiré</option>
                <option value="Terminated">Résilié</option>
              </select>
            </div>

            {/* Contracts List */}
            <div className="space-y-4">
              {filteredContracts.map(contract => {
                const StatusIcon = statusConfig[contract.status].icon;
                return (
                  <div
                    key={contract.id}
                    onClick={() => setSelectedContract(contract)}
                    className={`p-6 border rounded-xl hover:shadow-md transition cursor-pointer ${contractTypeColors[contract.type]}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">{contract.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[contract.status].color}`}>
                            {contract.status}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            {contract.type}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-gray-500">Partie A</p>
                            <p className="font-medium text-gray-900">{contract.parties.partyA.name}</p>
                            <p className="text-sm text-gray-600">{contract.parties.partyA.role}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Partie B</p>
                            <p className="font-medium text-gray-900">{contract.parties.partyB.name}</p>
                            <p className="text-sm text-gray-600">{contract.parties.partyB.role}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date de début</p>
                            <p className="font-medium text-gray-900">
                              {new Date(contract.startDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Valeur</p>
                            <p className="font-medium text-gray-900">
                              {contract.value ? `${contract.value.toLocaleString()} FCFA` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <StatusIcon className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>
                );
              })}

              {filteredContracts.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun contrat trouvé</p>
                  <button
                    onClick={() => setShowContractModal(true)}
                    className="mt-4 px-6 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    Créer un contrat
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-b-xl shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...templates, ...defaultTemplates].map(template => (
                <div
                  key={template.id}
                  className="border rounded-xl p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {template.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{template.name}</h3>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Variables:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.variables.map(variable => (
                        <span key={variable} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {`{${variable}}`}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleCreateFromTemplate(template)}
                    className="w-full px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
                  >
                    Utiliser ce template
                  </button>
                </div>
              ))}
            </div>

            {[...templates, ...defaultTemplates].length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Aucun template disponible</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContracts;

