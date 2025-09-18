import React, { useState, useEffect } from 'react';
import { 
    ArrowLeftIcon, 
    PlusIcon, 
    EnvelopeIcon, 
    UserGroupIcon, 
    ChartBarIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon,
    PlayIcon,
    PauseIcon,
    DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { getCampaigns, getContacts, Campaign, Contact } from '../services/contactService';
import SEO from '../components/SEO';

const AdminMarketingCampaigns: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    // Charger les données au montage du composant
    useEffect(() => {
        const loadData = () => {
            try {
                const loadedCampaigns = getCampaigns();
                const loadedContacts = getContacts();
                setCampaigns(loadedCampaigns);
                setContacts(loadedContacts);
            } catch (error) {
                console.error('Erreur lors du chargement des données:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const getStatusColor = (status: Campaign['status']) => {
        switch (status) {
            case 'draft': return 'bg-gray-500/20 text-gray-300';
            case 'scheduled': return 'bg-blue-500/20 text-blue-300';
            case 'sending': return 'bg-yellow-500/20 text-yellow-300';
            case 'sent': return 'bg-green-500/20 text-green-300';
            case 'paused': return 'bg-orange-500/20 text-orange-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getStatusText = (status: Campaign['status']) => {
        switch (status) {
            case 'draft': return 'Brouillon';
            case 'scheduled': return 'Programmée';
            case 'sending': return 'En cours';
            case 'sent': return 'Envoyée';
            case 'paused': return 'En pause';
            default: return 'Inconnu';
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Campagnes Marketing - Admin" 
                description="Gestion des campagnes marketing et emailing"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin/messaging" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour à la Messagerie
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-pm-gold mb-2">Campagnes Marketing</h1>
                            <p className="text-pm-off-white/70">Gérez vos campagnes d'emailing et marketing</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                to="/admin/import-contacts"
                                className="flex items-center gap-2 bg-pm-dark/50 text-pm-gold border border-pm-gold/30 px-4 py-2 rounded-lg hover:bg-pm-gold/10 transition-colors"
                            >
                                <DocumentArrowUpIcon className="w-5 h-5" />
                                Importer Contacts
                            </Link>
                            <Link
                                to="/admin/create-campaign"
                                className="flex items-center gap-2 bg-pm-gold text-pm-dark px-4 py-2 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Nouvelle Campagne
                            </Link>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <EnvelopeIcon className="w-8 h-8 text-pm-gold" />
                                <div>
                                    <div className="text-2xl font-bold text-pm-gold">{campaigns.length}</div>
                                    <div className="text-pm-off-white/70 text-sm">Campagnes totales</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <UserGroupIcon className="w-8 h-8 text-pm-gold" />
                                <div>
                                    <div className="text-2xl font-bold text-pm-gold">{contacts.length}</div>
                                    <div className="text-pm-off-white/70 text-sm">Contacts totaux</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <ChartBarIcon className="w-8 h-8 text-pm-gold" />
                                <div>
                                    <div className="text-2xl font-bold text-pm-gold">
                                        {campaigns.length > 0 ? Math.round(campaigns.reduce((acc, c) => acc + c.opened, 0) / campaigns.reduce((acc, c) => acc + c.sent, 0) * 100) || 0 : 0}%
                                    </div>
                                    <div className="text-pm-off-white/70 text-sm">Taux d'ouverture</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <div className="flex items-center gap-3">
                                <EyeIcon className="w-8 h-8 text-pm-gold" />
                                <div>
                                    <div className="text-2xl font-bold text-pm-gold">
                                        {campaigns.length > 0 ? Math.round(campaigns.reduce((acc, c) => acc + c.clicked, 0) / campaigns.reduce((acc, c) => acc + c.sent, 0) * 100) || 0 : 0}%
                                    </div>
                                    <div className="text-pm-off-white/70 text-sm">Taux de clic</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liste des campagnes */}
                    <div className="bg-pm-dark/50 rounded-lg border border-pm-gold/20 overflow-hidden">
                        <div className="p-6 border-b border-pm-gold/20">
                            <h2 className="text-xl font-semibold text-pm-gold">Mes Campagnes</h2>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Nom</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Sujet</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Statut</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Destinataires</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Ouvertures</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Clics</th>
                                        <th className="px-6 py-4 text-left text-pm-gold font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pm-gold/10">
                                    {campaigns.map((campaign) => (
                                        <tr key={campaign.id} className="hover:bg-black/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-pm-off-white">{campaign.name}</div>
                                                <div className="text-sm text-pm-off-white/60">
                                                    Créée le {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-pm-off-white/80">{campaign.subject}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                                                    {getStatusText(campaign.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-pm-off-white/80">{campaign.recipients.length}</td>
                                            <td className="px-6 py-4 text-pm-off-white/80">
                                                {campaign.opened} ({campaign.recipients.length > 0 ? Math.round((campaign.opened / campaign.recipients.length) * 100) : 0}%)
                                            </td>
                                            <td className="px-6 py-4 text-pm-off-white/80">
                                                {campaign.clicked} ({campaign.recipients.length > 0 ? Math.round((campaign.clicked / campaign.recipients.length) * 100) : 0}%)
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors">
                                                        <EyeIcon className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors">
                                                        <PencilIcon className="w-4 h-4" />
                                                    </button>
                                                    {campaign.status === 'sending' ? (
                                                        <button className="p-2 text-orange-400 hover:bg-orange-400/10 rounded-lg transition-colors">
                                                            <PauseIcon className="w-4 h-4" />
                                                        </button>
                                                    ) : campaign.status === 'draft' ? (
                                                        <button className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors">
                                                            <PlayIcon className="w-4 h-4" />
                                                        </button>
                                                    ) : null}
                                                    <button className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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

                    {/* Actions rapides */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Link
                            to="/admin/import-contacts"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-colors group"
                        >
                            <DocumentArrowUpIcon className="w-8 h-8 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Importer Contacts</h3>
                            <p className="text-pm-off-white/70 text-sm">Importez vos contacts depuis votre répertoire</p>
                        </Link>
                        
                        <Link
                            to="/admin/create-campaign"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-colors group"
                        >
                            <PlusIcon className="w-8 h-8 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Créer Campagne</h3>
                            <p className="text-pm-off-white/70 text-sm">Créez une nouvelle campagne marketing</p>
                        </Link>
                        
                        <Link
                            to="/admin/contact-management"
                            className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 hover:border-pm-gold/40 transition-colors group"
                        >
                            <UserGroupIcon className="w-8 h-8 text-pm-gold mb-4 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-semibold text-pm-gold mb-2">Gérer Contacts</h3>
                            <p className="text-pm-off-white/70 text-sm">Organisez et gérez votre base de contacts</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMarketingCampaigns;
