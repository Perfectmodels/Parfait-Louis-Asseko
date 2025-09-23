import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { EmailTemplate, EmailCampaign, EmailRecipient, EmailStats } from '../types';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import AdminCard from '../components/admin/AdminCard';
import AdminStats from '../components/admin/AdminStats';
import EmailCampaignForm from '../components/admin/EmailCampaignForm';
import EmailTemplateForm from '../components/admin/EmailTemplateForm';
import emailService from '../services/emailService';
import { isBrevoConfigured } from '../config/brevoConfig';
import { 
    EnvelopeIcon, PlusIcon, PencilIcon, TrashIcon, EyeIcon, 
    PlayIcon, PauseIcon, ClockIcon, ChartBarIcon, 
    MagnifyingGlassIcon, FunnelIcon, PaperAirplaneIcon,
    DocumentTextIcon, UsersIcon, CalendarIcon, ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminEmails: React.FC = () => {
    const { data, saveData } = useData();
    const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'stats'>('campaigns');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

    // Données locales
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
    const [emailStats, setEmailStats] = useState<EmailStats>({
        totalSent: 0,
        totalDelivered: 0,
        totalOpened: 0,
        totalClicked: 0,
        totalBounced: 0,
        totalBlocked: 0,
        openRate: 0,
        clickRate: 0,
        bounceRate: 0
    });

    // Charger les données depuis le contexte
    useEffect(() => {
        if (data?.emailTemplates) {
            setTemplates(data.emailTemplates);
        }
        if (data?.emailCampaigns) {
            setCampaigns(data.emailCampaigns);
        }
        if (data?.emailStats) {
            setEmailStats(data.emailStats);
        }
    }, [data]);

    // Filtrage des campagnes
    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(campaign => {
            const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                campaign.subject.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [campaigns, searchQuery, statusFilter]);

    // Filtrage des templates
    const filteredTemplates = useMemo(() => {
        return templates.filter(template => 
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [templates, searchQuery]);

    // Colonnes pour les campagnes
    const campaignColumns = [
        {
            key: 'name',
            label: 'Nom de la campagne',
            render: (value: any, campaign: EmailCampaign) => (
                <div>
                    <div className="font-semibold text-pm-off-white">{campaign.name}</div>
                    <div className="text-sm text-pm-off-white/60">{campaign.subject}</div>
                </div>
            )
        },
        {
            key: 'recipients',
            label: 'Destinataires',
            render: (value: any, campaign: EmailCampaign) => (
                <div className="flex items-center gap-2">
                    <UsersIcon className="w-4 h-4 text-pm-gold" />
                    <span className="text-sm">{campaign.recipients.length}</span>
                </div>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (value: any, campaign: EmailCampaign) => {
                const statusColors = {
                    draft: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
                    scheduled: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
                    sent: 'bg-green-500/20 text-green-300 border-green-500/30',
                    failed: 'bg-red-500/20 text-red-300 border-red-500/30'
                };
                return (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[campaign.status]}`}>
                        {campaign.status === 'draft' ? 'Brouillon' :
                         campaign.status === 'scheduled' ? 'Programmé' :
                         campaign.status === 'sent' ? 'Envoyé' : 'Échec'}
                    </span>
                );
            }
        },
        {
            key: 'createdAt',
            label: 'Créé le',
            render: (value: any, campaign: EmailCampaign) => (
                <div className="text-sm text-pm-off-white/70">
                    {new Date(campaign.createdAt).toLocaleDateString('fr-FR')}
                </div>
            )
        },
        {
            key: 'stats',
            label: 'Performance',
            render: (value: any, campaign: EmailCampaign) => (
                <div className="text-sm">
                    {campaign.openRate && (
                        <div className="text-green-400">
                            Ouverture: {campaign.openRate.toFixed(1)}%
                        </div>
                    )}
                    {campaign.clickRate && (
                        <div className="text-blue-400">
                            Clics: {campaign.clickRate.toFixed(1)}%
                        </div>
                    )}
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, campaign: EmailCampaign) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditingCampaign(campaign)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                        title="Modifier"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleSendCampaign(campaign.id)}
                        disabled={campaign.status === 'sent'}
                        className="p-2 text-green-400/70 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Envoyer"
                    >
                        <PaperAirplaneIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteCampaign(campaign.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Colonnes pour les templates
    const templateColumns = [
        {
            key: 'name',
            label: 'Nom du template',
            render: (value: any, template: EmailTemplate) => (
                <div>
                    <div className="font-semibold text-pm-off-white">{template.name}</div>
                    <div className="text-sm text-pm-off-white/60">{template.subject}</div>
                </div>
            )
        },
        {
            key: 'sender',
            label: 'Expéditeur',
            render: (value: any, template: EmailTemplate) => (
                <div className="text-sm text-pm-off-white/70">
                    {template.sender.name} &lt;{template.sender.email}&gt;
                </div>
            )
        },
        {
            key: 'createdAt',
            label: 'Créé le',
            render: (value: any, template: EmailTemplate) => (
                <div className="text-sm text-pm-off-white/70">
                    {new Date(template.createdAt).toLocaleDateString('fr-FR')}
                </div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, template: EmailTemplate) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditingTemplate(template)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                        title="Modifier"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    // Handlers
    const handleCreateCampaign = () => {
        setEditingCampaign({
            id: '',
            name: '',
            subject: '',
            htmlContent: '',
            textContent: '',
            sender: {
                name: 'Perfect Models Management',
                email: 'contact@perfectmodels.ga'
            },
            recipients: [],
            status: 'draft',
            createdAt: new Date().toISOString()
        });
        setIsCreateModalOpen(true);
    };

    const handleCreateTemplate = () => {
        setEditingTemplate({
            id: '',
            name: '',
            subject: '',
            htmlContent: '',
            textContent: '',
            sender: {
                name: 'Perfect Models Management',
                email: 'contact@perfectmodels.ga'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        setIsCreateModalOpen(true);
    };

    const handleSaveCampaign = async (campaign: EmailCampaign) => {
        if (!data) return;
        
        const updatedCampaigns = campaigns.find(c => c.id === campaign.id)
            ? campaigns.map(c => c.id === campaign.id ? campaign : c)
            : [...campaigns, { ...campaign, id: Date.now().toString() }];
        
        await saveData({ ...data, emailCampaigns: updatedCampaigns });
        setEditingCampaign(null);
        setIsCreateModalOpen(false);
    };

    const handleSaveTemplate = async (template: EmailTemplate) => {
        if (!data) return;
        
        const updatedTemplates = templates.find(t => t.id === template.id)
            ? templates.map(t => t.id === template.id ? template : t)
            : [...templates, { ...template, id: Date.now().toString() }];
        
        await saveData({ ...data, emailTemplates: updatedTemplates });
        setEditingTemplate(null);
        setIsCreateModalOpen(false);
    };

    const handleSendCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        try {
            if (!isBrevoConfigured()) {
                alert('Service email non configuré. Veuillez configurer la clé API Brevo.');
                return;
            }

            // Envoyer la campagne via le service email
            const result = await emailService.sendCampaign(campaign);
            
            // Mettre à jour le statut
            const updatedCampaigns = campaigns.map(c => 
                c.id === campaignId 
                    ? { 
                        ...c, 
                        status: 'sent' as const, 
                        sentAt: new Date().toISOString(),
                        messageId: result.messageId
                    }
                    : c
            );
            
            if (data) {
                await saveData({ ...data, emailCampaigns: updatedCampaigns });
            }

            alert('Campagne envoyée avec succès !');
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la campagne:', error);
            alert('Erreur lors de l\'envoi de la campagne. Veuillez réessayer.');
        }
    };

    const handleDeleteCampaign = async (campaignId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
            const updatedCampaigns = campaigns.filter(c => c.id !== campaignId);
            if (data) {
                await saveData({ ...data, emailCampaigns: updatedCampaigns });
            }
        }
    };

    const handleDeleteTemplate = async (templateId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
            const updatedTemplates = templates.filter(t => t.id !== templateId);
            if (data) {
                await saveData({ ...data, emailTemplates: updatedTemplates });
            }
        }
    };

    return (
        <AdminLayout 
            title="Gestion des Emails" 
            description="Créez et gérez vos campagnes email et templates"
            breadcrumbs={[
                { label: "Emails" }
            ]}
            showSearch={true}
            onSearch={setSearchQuery}
        >
            {/* Alerte de configuration */}
            {!isBrevoConfigured() && (
                <div className="mb-8 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center gap-3">
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
                        <div>
                            <h3 className="text-yellow-400 font-semibold">Configuration requise</h3>
                            <p className="text-yellow-300 text-sm">
                                Le service email n'est pas configuré. Veuillez définir la variable d'environnement VITE_BREVO_API_KEY.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AdminStats
                    title="Emails Envoyés"
                    value={emailStats.totalSent}
                    icon={PaperAirplaneIcon}
                    color="blue"
                />
                <AdminStats
                    title="Taux d'Ouverture"
                    value={`${emailStats.openRate.toFixed(1)}%`}
                    icon={EyeIcon}
                    color="green"
                />
                <AdminStats
                    title="Taux de Clic"
                    value={`${emailStats.clickRate.toFixed(1)}%`}
                    icon={ChartBarIcon}
                    color="purple"
                />
                <AdminStats
                    title="Templates"
                    value={templates.length}
                    icon={DocumentTextIcon}
                    color="orange"
                />
            </div>

            {/* Navigation par onglets */}
            <div className="mb-8">
                <nav className="border-b border-pm-gold/20 -mb-px flex space-x-8 overflow-x-auto">
                    {[
                        { id: 'campaigns', label: 'Campagnes', icon: EnvelopeIcon },
                        { id: 'templates', label: 'Templates', icon: DocumentTextIcon },
                        { id: 'stats', label: 'Statistiques', icon: ChartBarIcon }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`group inline-flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id 
                                    ? 'border-pm-gold text-pm-gold' 
                                    : 'border-transparent text-pm-off-white/70 hover:text-pm-gold hover:border-pm-gold/50'
                            }`}
                        >
                            <tab.icon className="w-5 h-5"/>
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Contenu des onglets */}
            {activeTab === 'campaigns' && (
                <div>
                    {/* Filtres et actions */}
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                <div className="flex items-center gap-2">
                                    <FunnelIcon className="w-5 h-5 text-pm-gold" />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                                    >
                                        <option value="all">Tous les statuts</option>
                                        <option value="draft">Brouillons</option>
                                        <option value="scheduled">Programmés</option>
                                        <option value="sent">Envoyés</option>
                                        <option value="failed">Échecs</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateCampaign}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold rounded-lg hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/25"
                            >
                                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Nouvelle Campagne
                            </button>
                        </div>
                    </div>

                    {/* Tableau des campagnes */}
                    <AdminTable
                        columns={campaignColumns}
                        data={filteredCampaigns}
                        emptyMessage="Aucune campagne trouvée"
                    />
                </div>
            )}

            {activeTab === 'templates' && (
                <div>
                    {/* Actions */}
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                        <div className="flex justify-end">
                            <button
                                onClick={handleCreateTemplate}
                                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold rounded-lg hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pm-gold/25"
                            >
                                <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                Nouveau Template
                            </button>
                        </div>
                    </div>

                    {/* Tableau des templates */}
                    <AdminTable
                        columns={templateColumns}
                        data={filteredTemplates}
                        emptyMessage="Aucun template trouvé"
                    />
                </div>
            )}

            {activeTab === 'stats' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <h3 className="text-xl font-playfair text-pm-gold mb-6">Performance Globale</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Emails livrés</span>
                                <span className="text-pm-gold font-semibold">{emailStats.totalDelivered}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Emails ouverts</span>
                                <span className="text-green-400 font-semibold">{emailStats.totalOpened}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Clics</span>
                                <span className="text-blue-400 font-semibold">{emailStats.totalClicked}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Rebonds</span>
                                <span className="text-red-400 font-semibold">{emailStats.totalBounced}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                        <h3 className="text-xl font-playfair text-pm-gold mb-6">Taux de Performance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Taux d'ouverture</span>
                                <span className="text-green-400 font-semibold">{emailStats.openRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Taux de clic</span>
                                <span className="text-blue-400 font-semibold">{emailStats.clickRate.toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-pm-off-white/70">Taux de rebond</span>
                                <span className="text-red-400 font-semibold">{emailStats.bounceRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            {editingCampaign && (
                <AdminModal
                    isOpen={!!editingCampaign}
                    onClose={() => setEditingCampaign(null)}
                    title={editingCampaign.id ? "Modifier la Campagne" : "Nouvelle Campagne"}
                    size="xl"
                >
                    <EmailCampaignForm 
                        campaign={editingCampaign}
                        onSave={handleSaveCampaign}
                        onCancel={() => setEditingCampaign(null)}
                    />
                </AdminModal>
            )}

            {editingTemplate && (
                <AdminModal
                    isOpen={!!editingTemplate}
                    onClose={() => setEditingTemplate(null)}
                    title={editingTemplate.id ? "Modifier le Template" : "Nouveau Template"}
                    size="xl"
                >
                    <EmailTemplateForm 
                        template={editingTemplate}
                        onSave={handleSaveTemplate}
                        onCancel={() => setEditingTemplate(null)}
                    />
                </AdminModal>
            )}
        </AdminLayout>
    );
};

// Les composants EmailCampaignForm et EmailTemplateForm sont maintenant importés

export default AdminEmails;
