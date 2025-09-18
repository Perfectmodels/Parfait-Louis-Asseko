import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon, 
    PlusIcon, 
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    UserGroupIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getContacts, deleteContact, Contact } from '../services/contactService';
import SEO from '../components/SEO';

const AdminContactManagement: React.FC = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');

    // Charger les contacts au montage du composant
    useEffect(() => {
        const loadContacts = () => {
            try {
                const loadedContacts = getContacts();
                setContacts(loadedContacts);
            } catch (error) {
                console.error('Erreur lors du chargement des contacts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadContacts();
    }, []);

    const handleDeleteContact = (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
            const success = deleteContact(id);
            if (success) {
                setContacts(prev => prev.filter(c => c.id !== id));
            }
        }
    };

    const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));
    const allStatuses = ['active', 'unsubscribed', 'bounced'];

    const filteredContacts = contacts.filter(contact => {
        const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag === 'all' || contact.tags.includes(selectedTag);
        const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;
        
        return matchesSearch && matchesTag && matchesStatus;
    });

    const getStatusColor = (status: Contact['status']) => {
        switch (status) {
            case 'active': return 'bg-green-500/20 text-green-300';
            case 'unsubscribed': return 'bg-orange-500/20 text-orange-300';
            case 'bounced': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusText = (status: Contact['status']) => {
        switch (status) {
            case 'active': return 'Actif';
            case 'unsubscribed': return 'Désabonné';
            case 'bounced': return 'Rebond';
            default: return 'Inconnu';
        }
    };

    const getSourceIcon = (source: Contact['source']) => {
        switch (source) {
            case 'import': return <UserGroupIcon className="w-4 h-4" />;
            case 'manual': return <PlusIcon className="w-4 h-4" />;
            case 'website': return <BuildingOfficeIcon className="w-4 h-4" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Gestion Contacts - Admin" 
                description="Gérez votre base de contacts marketing"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin/marketing-campaigns" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour aux Campagnes
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-pm-gold mb-2">Gestion des Contacts</h1>
                            <p className="text-pm-off-white/70">Organisez et gérez votre base de contacts</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/admin/import-contacts"
                                className="flex items-center gap-2 bg-pm-dark/50 text-pm-gold border border-pm-gold/30 px-4 py-2 rounded-lg hover:bg-pm-gold/10 transition-colors"
                            >
                                <UserGroupIcon className="w-5 h-5" />
                                Importer
                            </Link>
                            <button className="flex items-center gap-2 bg-pm-gold text-pm-dark px-4 py-2 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors">
                                <PlusIcon className="w-5 h-5" />
                                Nouveau Contact
                            </button>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <UserGroupIcon className="w-8 h-8 text-pm-gold" />
                                <div>
                                    <div className="text-2xl font-bold text-pm-gold">{contacts.length}</div>
                                    <div className="text-pm-off-white/70 text-sm">Total contacts</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <ChartBarIcon className="w-8 h-8 text-green-400" />
                                <div>
                                    <div className="text-2xl font-bold text-green-400">
                                        {contacts.filter(c => c.status === 'active').length}
                                    </div>
                                    <div className="text-pm-off-white/70 text-sm">Contacts actifs</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-8 h-8 text-orange-400" />
                                <div>
                                    <div className="text-2xl font-bold text-orange-400">
                                        {contacts.filter(c => c.status === 'unsubscribed').length}
                                    </div>
                                    <div className="text-pm-off-white/70 text-sm">Désabonnés</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <PhoneIcon className="w-8 h-8 text-red-400" />
                                <div>
                                    <div className="text-2xl font-bold text-red-400">
                                        {contacts.filter(c => c.status === 'bounced').length}
                                    </div>
                                    <div className="text-pm-off-white/70 text-sm">Rebonds</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filtres et recherche */}
                    <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Recherche</label>
                                <div className="relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold" />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Nom, email, entreprise..."
                                        className="w-full pl-10 pr-4 py-2 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Tag</label>
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="all">Tous les tags</option>
                                    {allTags.map(tag => (
                                        <option key={tag} value={tag}>{tag}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Statut</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-4 py-2 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="all">Tous les statuts</option>
                                    {allStatuses.map(status => (
                                        <option key={status} value={status}>
                                            {status === 'active' ? 'Actif' : 
                                             status === 'unsubscribed' ? 'Désabonné' : 'Rebond'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Liste des contacts */}
                    <div className="bg-pm-dark/50 rounded-lg border border-pm-gold/20 overflow-hidden">
                        <div className="p-6 border-b border-pm-gold/20">
                            <h3 className="text-lg font-semibold text-pm-gold">
                                Contacts ({filteredContacts.length})
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Contact</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Email</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Téléphone</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Tags</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Statut</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Source</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pm-gold/10">
                                    {filteredContacts.map((contact) => (
                                        <tr key={contact.id} className="hover:bg-black/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-pm-off-white">{contact.name}</div>
                                                {contact.company && (
                                                    <div className="text-sm text-pm-off-white/70">{contact.company}</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-pm-off-white/80">{contact.email}</td>
                                            <td className="px-6 py-4 text-pm-off-white/80">
                                                {contact.phone || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {contact.tags.map(tag => (
                                                        <span key={tag} className="px-2 py-1 bg-pm-gold/20 text-pm-gold text-xs rounded-full">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                                                    {getStatusText(contact.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-pm-off-white/80">
                                                    {getSourceIcon(contact.source)}
                                                    <span className="text-sm">
                                                        {contact.source === 'import' ? 'Import' :
                                                         contact.source === 'manual' ? 'Manuel' : 'Site web'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteContact(contact.id)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Actions en lot */}
                    <div className="mt-6 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <button className="text-pm-gold hover:text-pm-gold/80 transition-colors">
                                Sélectionner tout
                            </button>
                            <button className="text-pm-gold hover:text-pm-gold/80 transition-colors">
                                Exporter
                            </button>
                        </div>
                        <div className="text-sm text-pm-off-white/70">
                            {filteredContacts.length} contact(s) affiché(s)
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminContactManagement;
