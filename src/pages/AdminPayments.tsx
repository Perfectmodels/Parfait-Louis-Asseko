import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { MonthlyPayment, Model, AccountingEntry } from '../types';
import SEO from '../components/SEO';
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChartBarIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    ArrowTrendingUpIcon,
    BanknotesIcon
} from '@heroicons/react/24/outline';
import AdminCard from '../admin/components/AdminCard';
import AdminTable from '../admin/components/AdminTable';
import AdminButton from '../admin/components/AdminButton';
import { AdminInput, AdminSelect, AdminTextarea } from '../admin/components/AdminInput';
import AdminModal from '../admin/components/AdminModal';
import AdminPageHeader from '../admin/components/AdminPageHeader';

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<AccountingEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [activeTab, setActiveTab] = useState<'payments' | 'entries' | 'analytics'>('payments');

    const payments = useMemo(() => {
        return [...(data?.monthlyPayments || [])].sort((a, b) =>
            new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
        );
    }, [data?.monthlyPayments]);

    const entries = useMemo(() => {
        return [...(data?.accountingEntries || [])].sort((a, b) =>
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
    }, [data?.accountingEntries]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    // Filtres avancés
    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchesSearch = searchTerm === '' ||
                payment.modelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.notes?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === '' || payment.status === statusFilter;
            const matchesCategory = categoryFilter === '' || payment.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [payments, searchTerm, statusFilter, categoryFilter]);

    // Statistiques financières
    const financialStats = useMemo(() => {
        const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const pendingPayments = payments.filter(p => p.status === 'En attente').length;
        const latePayments = payments.filter(p => p.status === 'En retard').length;
        const thisMonth = new Date().toISOString().slice(0, 7);
        const currentMonthPayments = payments.filter(p => p.month === thisMonth).reduce((sum, p) => sum + (p.amount || 0), 0);

        return { totalPaid, pendingPayments, latePayments, currentMonthPayments };
    }, [payments]);

    // Gestionnaires d'événements
    const handleOpenModal = (payment: MonthlyPayment | null = null) => {
        setEditingPayment(payment);
        setIsModalOpen(true);
    };

    const handleSave = async (paymentData: MonthlyPayment) => {
        if (!data) return;

        let updatedPayments;
        if (editingPayment) {
            updatedPayments = payments.map(p => p.id === paymentData.id ? paymentData : p);
        } else {
            updatedPayments = [...payments, { ...paymentData, id: `payment-${Date.now()}` }];
        }

        try {
            await saveData({ ...data, monthlyPayments: updatedPayments });
            setIsModalOpen(false);
            setEditingPayment(null);
        } catch (error) {
            console.error("Erreur lors de la sauvegarde du paiement:", error);
            alert("Impossible de sauvegarder le paiement.");
        }
    };

    const handleDelete = async (paymentId: string) => {
        if (window.confirm("Supprimer ce paiement ?")) {
            if (!data) return;
            const updatedPayments = payments.filter(p => p.id !== paymentId);
            await saveData({ ...data, monthlyPayments: updatedPayments });
        }
    };

    const handleOpenEntryModal = (entry: AccountingEntry | null = null) => {
        setEditingEntry(entry);
        setIsEntryModalOpen(true);
    };

    const handleSaveEntry = async (entryData: AccountingEntry) => {
        if (!data) return;
        let updatedEntries: AccountingEntry[];
        const current = data.accountingEntries || [];
        if (editingEntry) {
            updatedEntries = current.map(e => e.id === entryData.id ? entryData : e);
        } else {
            updatedEntries = [...current, { ...entryData, id: `entry-${Date.now()}` }];
        }
        try {
            await saveData({ ...data, accountingEntries: updatedEntries });
            setIsEntryModalOpen(false);
            setEditingEntry(null);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'écriture:', error);
            alert("Impossible de sauvegarder l'entrée comptable.");
        }
    };

    // Export de données
    const exportData = (type: 'csv' | 'json') => {
        let content: string;

        if (activeTab === 'payments') {
            const exportData = filteredPayments.map(p => ({
                Mois: p.month,
                Mannequin: p.modelName,
                Montant: p.amount,
                Nature: p.category,
                Date_Paiement: p.paymentDate,
                Methode: p.method,
                Statut: p.status,
                Notes: p.notes
            }));

            if (type === 'csv') {
                content = 'data:text/csv;charset=utf-8,' +
                    Object.keys(exportData[0]).join(',') + '\n' +
                    exportData.map(row => Object.values(row).join(',')).join('\n');
            } else {
                content = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
            }
        } else {
            const exportData = entries.map(e => ({
                Type: e.kind === 'income' ? 'Revenu' : 'Dépense',
                Categorie: e.category,
                Libelle: e.label,
                Montant: e.amount,
                Date_Heure: e.dateTime,
                Methode: e.method,
                Mannequin_Lie: e.relatedModelName || 'N/A',
                Notes: e.notes
            }));

            if (type === 'csv') {
                content = 'data:text/csv;charset=utf-8,' +
                    Object.keys(exportData[0]).join(',') + '\n' +
                    exportData.map(row => Object.values(row).join(',')).join('\n');
            } else {
                content = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
            }
        }

        const link = document.createElement('a');
        link.href = content;
        link.download = `data_${new Date().toISOString().split('T')[0]}.${type}`;
        link.click();
    };

    return (
        <div className="min-h-screen bg-pm-dark">
            <SEO title="Comptabilité Premium" noIndex />

            <div className="container mx-auto px-6 py-8">
                {/* Header avec navigation */}
                <AdminPageHeader
                    title="Comptabilité Premium"
                    subtitle="Gestion financière avancée avec analyses et rapports"
                    actions={[
                        <AdminButton
                            key="add-payment"
                            variant="primary"
                            icon={PlusIcon}
                            onClick={() => handleOpenModal()}
                        >
                            Nouveau Paiement
                        </AdminButton>,
                        <AdminButton
                            key="add-entry"
                            variant="secondary"
                            icon={PlusIcon}
                            onClick={() => handleOpenEntryModal()}
                        >
                            Nouvelle Écriture
                        </AdminButton>
                    ]}
                />

                {/* Onglets de navigation */}
                <div className="mb-8">
                    <nav className="flex space-x-1 bg-pm-dark/50 p-1 rounded-lg">
                        {[
                            { id: 'payments', label: 'Paiements', icon: BanknotesIcon },
                            { id: 'entries', label: 'Écritures', icon: ChartBarIcon },
                            { id: 'analytics', label: 'Analytiques', icon: ArrowTrendingUpIcon }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-pm-gold text-black'
                                        : 'text-pm-off-white hover:text-pm-gold'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Filtres et recherche */}
                <div className="mb-6 flex flex-wrap gap-4 items-center">
                    <div className="flex-1 min-w-64">
                        <AdminInput
                            label=""
                            placeholder="Rechercher par mannequin, notes..."
                            icon={MagnifyingGlassIcon}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <AdminSelect
                        label=""
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Tous les statuts' },
                            { value: 'Payé', label: 'Payé' },
                            { value: 'En attente', label: 'En attente' },
                            { value: 'En retard', label: 'En retard' }
                        ]}
                    />
                    <AdminSelect
                        label=""
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        options={[
                            { value: '', label: 'Toutes les natures' },
                            { value: 'Cotisation mensuelle', label: 'Cotisation mensuelle' },
                            { value: 'Frais d\'inscription', label: 'Frais d\'inscription' },
                            { value: 'Cotisation + Inscription', label: 'Cotisation + Inscription' }
                        ]}
                    />
                    <AdminButton
                        variant="outline"
                        icon={ArrowDownTrayIcon}
                        onClick={() => exportData('csv')}
                    >
                        Exporter CSV
                    </AdminButton>
                </div>

                {/* Contenu des onglets */}
                {activeTab === 'payments' && (
                    <div className="space-y-6">
                        {/* Statistiques rapides */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <AdminCard
                                title="Total Payé"
                                description={`${financialStats.totalPaid.toLocaleString('fr-FR')} FCFA`}
                                icon={CurrencyDollarIcon}
                                link="#"
                            />
                            <AdminCard
                                title="Paiements en Attente"
                                description={`${financialStats.pendingPayments} paiements`}
                                icon={CalendarIcon}
                                link="#"
                            />
                            <AdminCard
                                title="Paiements en Retard"
                                description={`${financialStats.latePayments} paiements`}
                                icon={ArrowTrendingUpIcon}
                                link="#"
                            />
                            <AdminCard
                                title="Ce Mois"
                                description={`${financialStats.currentMonthPayments.toLocaleString('fr-FR')} FCFA`}
                                icon={BanknotesIcon}
                                link="#"
                            />
                        </div>

                        {/* Table des paiements */}
                        <AdminTable
                            data={filteredPayments}
                            columns={[
                                {
                                    key: 'month',
                                    label: 'Mois',
                                    sortable: true
                                },
                                {
                                    key: 'modelName',
                                    label: 'Mannequin',
                                    sortable: true
                                },
                                {
                                    key: 'amount',
                                    label: 'Montant',
                                    render: (value) => `${value?.toLocaleString('fr-FR') || 0} FCFA`,
                                    sortable: true
                                },
                                {
                                    key: 'category',
                                    label: 'Nature'
                                },
                                {
                                    key: 'paymentDate',
                                    label: 'Date',
                                    render: (value) => value ? new Date(value).toLocaleDateString('fr-FR') : '-',
                                    sortable: true
                                },
                                {
                                    key: 'method',
                                    label: 'Méthode'
                                },
                                {
                                    key: 'status',
                                    label: 'Statut',
                                    render: (value) => {
                                        const colors = {
                                            'Payé': 'bg-green-500/20 text-green-300',
                                            'En attente': 'bg-yellow-500/20 text-yellow-300',
                                            'En retard': 'bg-red-500/20 text-red-300'
                                        };
                                        return <span className={`px-2 py-0.5 text-xs rounded-full ${colors[value as keyof typeof colors] || 'bg-gray-500/20 text-gray-300'}`}>
                                            {value || 'Inconnu'}
                                        </span>;
                                    }
                                },
                                {
                                    key: 'actions',
                                    label: 'Actions',
                                    render: (_, item) => (
                                        <div className="flex items-center gap-2">
                                            <AdminButton
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleOpenModal(item)}
                                                icon={PencilIcon}
                                            >
                                                Modifier
                                            </AdminButton>
                                            <AdminButton
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                icon={TrashIcon}
                                            >
                                                Supprimer
                                            </AdminButton>
                                        </div>
                                    )
                                }
                            ]}
                            onRowClick={(payment) => handleOpenModal(payment)}
                            emptyMessage="Aucun paiement trouvé"
                        />
                    </div>
                )}

                {activeTab === 'entries' && (
                    <div className="space-y-6">
                        <AdminTable
                            data={entries}
                            columns={[
                                {
                                    key: 'kind',
                                    label: 'Type',
                                    render: (value) => value === 'income' ? 'Revenu' : 'Dépense'
                                },
                                {
                                    key: 'category',
                                    label: 'Catégorie'
                                },
                                {
                                    key: 'label',
                                    label: 'Libellé'
                                },
                                {
                                    key: 'amount',
                                    label: 'Montant',
                                    render: (value, item) => (
                                        <span className={item.kind === 'income' ? 'text-green-400' : 'text-red-400'}>
                                            {value?.toLocaleString('fr-FR') || 0} FCFA
                                        </span>
                                    )
                                },
                                {
                                    key: 'dateTime',
                                    label: 'Date/Heure',
                                    render: (value) => value ? new Date(value).toLocaleString('fr-FR') : '-'
                                },
                                {
                                    key: 'method',
                                    label: 'Méthode'
                                },
                                {
                                    key: 'relatedModelName',
                                    label: 'Mannequin lié'
                                }
                            ]}
                            onRowClick={(entry) => handleOpenEntryModal(entry)}
                            emptyMessage="Aucune écriture trouvée"
                        />
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <AdminCard
                                title="Répartition par Statut"
                                description="Analyse des paiements par statut"
                                icon={ChartBarIcon}
                                link="#"
                            />

                            <AdminCard
                                title="Évolution Mensuelle"
                                description="Revenus mensuels des 6 derniers mois"
                                icon={ArrowTrendingUpIcon}
                                link="#"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isModalOpen && (
                <PaymentModal
                    payment={editingPayment}
                    models={models}
                    onClose={() => { setIsModalOpen(false); setEditingPayment(null); }}
                    onSave={handleSave}
                />
            )}
            {isEntryModalOpen && (
                <EntryModal
                    entry={editingEntry}
                    models={models}
                    onClose={() => { setIsEntryModalOpen(false); setEditingEntry(null); }}
                    onSave={handleSaveEntry}
                />
            )}
        </div>
    );
};

interface PaymentModalProps {
    payment: MonthlyPayment | null;
    models: Model[];
    onClose: () => void;
    onSave: (payment: MonthlyPayment) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ payment, models, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<MonthlyPayment, 'id' | 'modelName'>>({
        modelId: payment?.modelId || '',
        month: payment?.month || new Date().toISOString().slice(0, 7),
        amount: payment?.amount || 0,
        paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
        method: payment?.method || 'Virement',
        status: payment?.status || 'En attente',
        category: payment?.category || 'Cotisation mensuelle',
        notes: payment?.notes || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.modelId) {
            alert("Veuillez sélectionner un mannequin.");
            return;
        }
        const model = models.find(m => m.id === formData.modelId);
        if (!model) {
            alert("Le mannequin sélectionné est invalide.");
            return;
        }
        onSave({ ...formData, id: payment?.id || '', modelName: model.name });
    };

    return (
        <AdminModal
            isOpen={true}
            onClose={onClose}
            title={payment ? 'Modifier Paiement' : 'Ajouter Paiement'}
            size="lg"
            actions={
                <>
                    <AdminButton variant="secondary" onClick={onClose}>
                        Annuler
                    </AdminButton>
                    <AdminButton variant="primary" onClick={handleSubmit}>
                        Sauvegarder
                    </AdminButton>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <AdminSelect
                        label="Mannequin"
                        value={formData.modelId}
                        onChange={handleChange}
                        name="modelId"
                        required
                        options={models.map(m => ({ value: m.id, label: m.name }))}
                    />
                    <AdminInput
                        label="Mois Concerné"
                        type="month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <AdminInput
                        label="Montant (FCFA)"
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                    <AdminInput
                        label="Date de Paiement"
                        type="date"
                        name="paymentDate"
                        value={formData.paymentDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <AdminSelect
                        label="Nature du Paiement"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        options={[
                            { value: 'Cotisation mensuelle', label: 'Cotisation mensuelle' },
                            { value: 'Frais d\'inscription', label: 'Frais d\'inscription' },
                            { value: 'Cotisation + Inscription', label: 'Cotisation + Inscription' },
                            { value: 'Avance cotisation', label: 'Avance cotisation' },
                            { value: 'Autre', label: 'Autre' }
                        ]}
                    />
                    <AdminSelect
                        label="Méthode"
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        options={[
                            { value: 'Virement', label: 'Virement' },
                            { value: 'Espèces', label: 'Espèces' },
                            { value: 'Autre', label: 'Autre' }
                        ]}
                    />
                </div>

                <AdminSelect
                    label="Statut"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                        { value: 'En attente', label: 'En attente' },
                        { value: 'Payé', label: 'Payé' },
                        { value: 'En retard', label: 'En retard' }
                    ]}
                />

                <AdminTextarea
                    label="Notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows={3}
                />
            </form>
        </AdminModal>
    );
};

interface EntryModalProps {
    entry: AccountingEntry | null;
    models: Model[];
    onClose: () => void;
    onSave: (entry: AccountingEntry) => void;
}

const EntryModal: React.FC<EntryModalProps> = ({ entry, models, onClose, onSave }) => {
    const [form, setForm] = useState<AccountingEntry>({
        id: entry?.id || '',
        kind: entry?.kind || 'income',
        category: entry?.category || 'Commission',
        label: entry?.label || '',
        amount: entry?.amount || 0,
        dateTime: entry?.dateTime || new Date().toISOString(),
        method: entry?.method || 'Virement',
        relatedModelId: entry?.relatedModelId,
        relatedModelName: entry?.relatedModelName,
        notes: entry?.notes || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleRelatedModel = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const modelId = e.target.value;
        const model = models.find(m => m.id === modelId);
        setForm(prev => ({ ...prev, relatedModelId: modelId || undefined, relatedModelName: model?.name || undefined }));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.label || !form.category) {
            alert('Veuillez renseigner le libellé et la catégorie.');
            return;
        }
        onSave(form);
    };

    return (
        <AdminModal
            isOpen={true}
            onClose={onClose}
            title={entry ? 'Modifier Écriture' : 'Ajouter Écriture'}
            size="lg"
            actions={
                <>
                    <AdminButton variant="secondary" onClick={onClose}>
                        Annuler
                    </AdminButton>
                    <AdminButton variant="primary" onClick={submit}>
                        Sauvegarder
                    </AdminButton>
                </>
            }
        >
            <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <AdminSelect
                        label="Type"
                        name="kind"
                        value={form.kind}
                        onChange={handleChange}
                        options={[
                            { value: 'income', label: 'Revenu' },
                            { value: 'expense', label: 'Dépense' }
                        ]}
                    />
                    <AdminInput
                        label="Catégorie"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Commission, Collaboration, Autre..."
                    />
                </div>

                <AdminInput
                    label="Libellé"
                    name="label"
                    value={form.label}
                    onChange={handleChange}
                    placeholder="Description courte"
                    required
                />

                <div className="grid grid-cols-2 gap-4">
                    <AdminInput
                        label="Montant (FCFA)"
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        required
                    />
                    <AdminInput
                        label="Date/Heure"
                        type="datetime-local"
                        name="dateTime"
                        value={form.dateTime.slice(0, 16)}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <AdminSelect
                        label="Méthode"
                        name="method"
                        value={form.method}
                        onChange={handleChange}
                        options={[
                            { value: 'Virement', label: 'Virement' },
                            { value: 'Espèces', label: 'Espèces' },
                            { value: 'Autre', label: 'Autre' }
                        ]}
                    />
                    <AdminSelect
                        label="Mannequin lié (optionnel)"
                        value={form.relatedModelId || ''}
                        onChange={handleRelatedModel}
                        options={[
                            { value: '', label: 'Aucun' },
                            ...models.map(m => ({ value: m.id, label: m.name }))
                        ]}
                    />
                </div>

                <AdminTextarea
                    label="Notes"
                    name="notes"
                    value={form.notes || ''}
                    onChange={handleChange}
                    rows={3}
                />
            </form>
        </AdminModal>
    );
};

export default AdminPayments;