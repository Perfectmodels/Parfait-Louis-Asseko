import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import AdminStats from '../components/admin/AdminStats';
import { 
    CurrencyDollarIcon, 
    ArrowTrendingUpIcon, 
    ArrowTrendingDownIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    DocumentArrowDownIcon,
    FunnelIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { AccountingTransaction } from '../types';

const AdminAccounting: React.FC = () => {
    const { data, saveData } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [editingTransaction, setEditingTransaction] = useState<AccountingTransaction | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const transactions = useMemo(() => {
        return [...(data?.accountingTransactions || [])].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [data?.accountingTransactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
            const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, searchQuery, typeFilter, categoryFilter]);

    // Statistiques
    const stats = useMemo(() => {
        const totalRevenue = transactions
            .filter(t => t.type === 'revenu')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
            .filter(t => t.type === 'depense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netProfit = totalRevenue - totalExpenses;
        
        const thisMonth = new Date().toISOString().slice(0, 7);
        const thisMonthRevenue = transactions
            .filter(t => t.type === 'revenu' && t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + t.amount, 0);
        
        const thisMonthExpenses = transactions
            .filter(t => t.type === 'depense' && t.date.startsWith(thisMonth))
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalRevenue,
            totalExpenses,
            netProfit,
            thisMonthRevenue,
            thisMonthExpenses,
            totalTransactions: transactions.length
        };
    }, [transactions]);

    const categories = [
        'Cotisations mannequins',
        'Inscriptions',
        'Événements',
        'Formations',
        'Casting',
        'Marketing',
        'Frais généraux',
        'Équipement',
        'Loyer',
        'Autres'
    ];

    const columns = [
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (value: any, transaction: AccountingTransaction) => (
                <div className="text-sm text-pm-off-white">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            render: (value: any, transaction: AccountingTransaction) => (
                <div className="flex items-center gap-2">
                    {transaction.type === 'revenu' ? (
                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                    ) : (
                        <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'revenu'
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                        {transaction.type === 'revenu' ? 'Revenu' : 'Dépense'}
                    </span>
                </div>
            )
        },
        {
            key: 'category',
            label: 'Catégorie',
            sortable: true,
            render: (value: any, transaction: AccountingTransaction) => (
                <div className="text-pm-off-white">{transaction.category}</div>
            )
        },
        {
            key: 'description',
            label: 'Description',
            render: (value: any, transaction: AccountingTransaction) => (
                <div className="max-w-xs">
                    <div className="text-pm-off-white font-medium truncate">{transaction.description}</div>
                    {transaction.reference && (
                        <div className="text-xs text-pm-off-white/60">Ref: {transaction.reference}</div>
                    )}
                </div>
            )
        },
        {
            key: 'amount',
            label: 'Montant',
            sortable: true,
            render: (value: any, transaction: AccountingTransaction) => (
                <div className={`font-semibold ${
                    transaction.type === 'revenu' ? 'text-green-400' : 'text-red-400'
                }`}>
                    {transaction.type === 'revenu' ? '+' : '-'}{transaction.amount.toLocaleString()} FCFA
                </div>
            )
        },
        {
            key: 'paymentMethod',
            label: 'Méthode',
            render: (value: any, transaction: AccountingTransaction) => (
                <div className="text-pm-off-white/70 text-sm">{transaction.paymentMethod}</div>
            )
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (value: any, transaction: AccountingTransaction) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                        title="Modifier"
                    >
                        <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                        title="Supprimer"
                    >
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            )
        }
    ];

    const handleDelete = async (transactionId: string) => {
        if (!data || !window.confirm('Supprimer cette transaction ?')) return;
        
        const updatedTransactions = transactions.filter(t => t.id !== transactionId);
        await saveData({ ...data, accountingTransactions: updatedTransactions });
    };

    const handleSaveTransaction = async (transaction: AccountingTransaction) => {
        if (!data) return;
        
        const updatedTransactions = transactions.find(t => t.id === transaction.id)
            ? transactions.map(t => t.id === transaction.id ? transaction : t)
            : [...transactions, { ...transaction, id: Date.now().toString() }];
        
        await saveData({ ...data, accountingTransactions: updatedTransactions });
        setEditingTransaction(null);
        setIsCreateModalOpen(false);
    };

    const generateReport = () => {
        // Génération d'un rapport PDF simple
        const reportData = {
            period: {
                start: new Date().toISOString().slice(0, 7) + '-01',
                end: new Date().toISOString().slice(0, 7) + '-31'
            },
            stats,
            transactions: filteredTransactions
        };
        
        // Ici on pourrait intégrer une librairie PDF comme jsPDF
        console.log('Génération du rapport:', reportData);
        alert('Fonctionnalité de génération de rapport en développement');
    };

    return (
        <AdminLayout 
            title="Comptabilité" 
            description="Gérez les revenus et dépenses de l'agence"
            breadcrumbs={[
                { label: "Comptabilité" }
            ]}
            showSearch={true}
            onSearch={setSearchQuery}
        >
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminStats
                    title="Revenus Totaux"
                    value={`${stats.totalRevenue.toLocaleString()} FCFA`}
                    icon={ArrowTrendingUpIcon}
                    color="green"
                />
                <AdminStats
                    title="Dépenses Totales"
                    value={`${stats.totalExpenses.toLocaleString()} FCFA`}
                    icon={ArrowTrendingDownIcon}
                    color="red"
                />
                <AdminStats
                    title="Bénéfice Net"
                    value={`${stats.netProfit.toLocaleString()} FCFA`}
                    icon={CurrencyDollarIcon}
                    color={stats.netProfit >= 0 ? 'gold' : 'red'}
                />
                <AdminStats
                    title="Transactions"
                    value={stats.totalTransactions}
                    icon={CalendarIcon}
                    color="blue"
                />
            </div>

            {/* Actions */}
            <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-pm-gold" />
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Tous les types</option>
                                <option value="revenu">Revenus</option>
                                <option value="depense">Dépenses</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Toutes les catégories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={generateReport}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            <DocumentArrowDownIcon className="w-4 h-4" />
                            Générer Rapport
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-pm-dark rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                        >
                            <PlusIcon className="w-4 h-4" />
                            Nouvelle Transaction
                        </button>
                    </div>
                </div>
            </div>

            {/* Tableau */}
            <AdminTable
                columns={columns}
                data={filteredTransactions}
                emptyMessage="Aucune transaction trouvée"
            />

            {/* Modal de création/édition */}
            {(editingTransaction || isCreateModalOpen) && (
                <AdminModal
                    isOpen={!!editingTransaction || isCreateModalOpen}
                    onClose={() => {
                        setEditingTransaction(null);
                        setIsCreateModalOpen(false);
                    }}
                    title={editingTransaction ? "Modifier la Transaction" : "Nouvelle Transaction"}
                    size="lg"
                >
                    <TransactionForm
                        transaction={editingTransaction || {
                            id: '',
                            date: new Date().toISOString().split('T')[0],
                            type: 'revenu',
                            category: '',
                            description: '',
                            amount: 0,
                            paymentMethod: '',
                            reference: '',
                            notes: '',
                            createdBy: 'admin',
                            createdAt: new Date().toISOString()
                        }}
                        onSave={handleSaveTransaction}
                        onCancel={() => {
                            setEditingTransaction(null);
                            setIsCreateModalOpen(false);
                        }}
                        categories={categories}
                    />
                </AdminModal>
            )}
        </AdminLayout>
    );
};

// Composant formulaire de transaction
interface TransactionFormProps {
    transaction: AccountingTransaction;
    onSave: (transaction: AccountingTransaction) => void;
    onCancel: () => void;
    categories: string[];
}

const TransactionForm: React.FC<TransactionFormProps> = ({
    transaction,
    onSave,
    onCancel,
    categories
}) => {
    const [formData, setFormData] = useState<AccountingTransaction>(transaction);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.date) {
            newErrors.date = 'La date est requise';
        }

        if (!formData.category) {
            newErrors.category = 'La catégorie est requise';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        }

        if (formData.amount <= 0) {
            newErrors.amount = 'Le montant doit être positif';
        }

        if (!formData.paymentMethod.trim()) {
            newErrors.paymentMethod = 'La méthode de paiement est requise';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handleInputChange = (field: keyof AccountingTransaction, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Date <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                            errors.date ? 'border-red-500' : 'border-pm-gold/30'
                        }`}
                    />
                    {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                    >
                        <option value="revenu">Revenu</option>
                        <option value="depense">Dépense</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Catégorie <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                            errors.category ? 'border-red-500' : 'border-pm-gold/30'
                        }`}
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Montant (FCFA) <span className="text-red-400">*</span>
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="100"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                        className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                            errors.amount ? 'border-red-500' : 'border-pm-gold/30'
                        }`}
                    />
                    {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Description <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                        errors.description ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Description de la transaction"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Méthode de paiement <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={formData.paymentMethod}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                            errors.paymentMethod ? 'border-red-500' : 'border-pm-gold/30'
                        }`}
                    >
                        <option value="">Sélectionner une méthode</option>
                        <option value="Virement">Virement</option>
                        <option value="Espèces">Espèces</option>
                        <option value="Mobile Money">Mobile Money</option>
                        <option value="Chèque">Chèque</option>
                        <option value="Carte bancaire">Carte bancaire</option>
                    </select>
                    {errors.paymentMethod && <p className="text-red-400 text-sm mt-1">{errors.paymentMethod}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Référence
                    </label>
                    <input
                        type="text"
                        value={formData.reference || ''}
                        onChange={(e) => handleInputChange('reference', e.target.value)}
                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                        placeholder="Numéro de référence (optionnel)"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Notes
                </label>
                <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                    placeholder="Notes supplémentaires (optionnel)"
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-pm-gold/20">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                >
                    {transaction.id ? 'Mettre à jour' : 'Créer la transaction'}
                </button>
            </div>
        </form>
    );
};

export default AdminAccounting;
