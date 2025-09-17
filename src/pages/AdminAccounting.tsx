import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, PlusIcon, DocumentArrowDownIcon, 
    CurrencyDollarIcon, ChartBarIcon, CalendarIcon,
    BanknotesIcon, CreditCardIcon, ArrowTrendingUpIcon,
    ArrowTrendingDownIcon, EyeIcon, PencilIcon, TrashIcon
} from '@heroicons/react/24/outline';
import { AccountingTransaction, AccountingCategory, AccountingBalance } from '../types';

const AdminAccounting: React.FC = () => {
    const { data, saveData } = useData();
    const [activeTab, setActiveTab] = useState<'transactions' | 'balance' | 'reports' | 'payments'>('payments');
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [paymentType, setPaymentType] = useState<'cotisation' | 'inscription'>('cotisation');
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [newTransaction, setNewTransaction] = useState<Partial<AccountingTransaction>>({
        date: new Date().toISOString().split('T')[0],
        category: 'revenue',
        subcategory: '',
        amount: 0,
        currency: 'FCFA',
        paymentMethod: 'cash',
        description: '',
        reference: '',
        notes: ''
    });

    const transactions = data?.accountingTransactions || [];
    const categories = data?.accountingCategories || [];
    
    // Récupérer tous les mannequins (Pro + Débutants unifiés)
    const allModels = [
        ...(data?.models || []),
        ...(data?.beginnerStudents?.map(student => ({
            id: student.id,
            name: student.name,
            level: 'Mannequin' as const,
            username: student.matricule || student.name.toLowerCase().replace(/\s+/g, ''),
            isActive: true
        })) || [])
    ];

    // Filtrer les transactions par période
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    // Calculer le bilan
    const balance: AccountingBalance = useMemo(() => {
        const totalRevenue = filteredTransactions
            .filter(t => t.category === 'revenue')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = filteredTransactions
            .filter(t => t.category === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalRevenue,
            totalExpenses,
            netIncome: totalRevenue - totalExpenses,
            currency: 'FCFA',
            period: selectedPeriod
        };
    }, [filteredTransactions, selectedPeriod]);

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !newTransaction.description || !newTransaction.amount) return;

        const transaction: AccountingTransaction = {
            id: `trans-${Date.now()}`,
            date: newTransaction.date || new Date().toISOString().split('T')[0],
            description: newTransaction.description,
            category: newTransaction.category || 'revenue',
            subcategory: newTransaction.subcategory || '',
            amount: newTransaction.amount,
            currency: newTransaction.currency || 'FCFA',
            paymentMethod: newTransaction.paymentMethod || 'cash',
            reference: newTransaction.reference,
            notes: newTransaction.notes,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
        };

        try {
            const updatedTransactions = [...transactions, transaction];
            await saveData({ ...data, accountingTransactions: updatedTransactions });
            setNewTransaction({
                date: new Date().toISOString().split('T')[0],
                category: 'revenue',
                subcategory: '',
                amount: 0,
                currency: 'FCFA',
                paymentMethod: 'cash',
                description: '',
                reference: '',
                notes: ''
            });
            setShowTransactionForm(false);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la transaction:', error);
        }
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        if (!data || !window.confirm('Supprimer cette transaction ?')) return;
        
        try {
            const updatedTransactions = transactions.filter(t => t.id !== transactionId);
            await saveData({ ...data, accountingTransactions: updatedTransactions });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !selectedModel || !paymentAmount) return;

        const model = allModels.find(m => m.id === selectedModel);
        if (!model) return;

        const transaction: AccountingTransaction = {
            id: `payment-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            description: `${paymentType === 'cotisation' ? 'Cotisation' : 'Inscription'} - ${model.name}`,
            category: 'revenue',
            subcategory: paymentType === 'cotisation' ? 'Cotisations Mannequins' : 'Inscriptions',
            amount: paymentAmount,
            currency: 'FCFA',
            paymentMethod: 'cash',
            reference: `${paymentType.toUpperCase()}-${model.name}-${new Date().getFullYear()}`,
            notes: `Paiement ${paymentType} pour ${model.name}`,
            relatedModelId: model.id,
            relatedModelName: model.name,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
        };

        try {
            const updatedTransactions = [...transactions, transaction];
            await saveData({ ...data, accountingTransactions: updatedTransactions });
            
            // Reset form
            setSelectedModel('');
            setPaymentType('cotisation');
            setPaymentAmount(0);
            setShowPaymentForm(false);
            
            alert(`${paymentType === 'cotisation' ? 'Cotisation' : 'Inscription'} enregistrée avec succès !`);
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du paiement:', error);
        }
    };

    const generatePaymentListPDF = async (type: 'cotisations' | 'inscriptions') => {
        // Cette fonction sera implémentée avec la génération PDF
        console.log(`Génération PDF pour ${type}`);
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Comptabilité - Perfect Models Management" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Livre Comptable</h1>
                        <p className="admin-page-subtitle">Gestion des revenus, dépenses et génération de rapports</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => generatePaymentListPDF('cotisations')}
                            className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            PDF Cotisations
                        </button>
                        <button
                            onClick={() => generatePaymentListPDF('inscriptions')}
                            className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            PDF Inscriptions
                        </button>
                        <button
                            onClick={() => setShowTransactionForm(true)}
                            className="action-btn bg-pm-gold text-pm-dark hover:bg-white"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nouvelle Transaction
                        </button>
                    </div>
                </div>

                {/* Période de sélection */}
                <div className="admin-section-wrapper mb-8">
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="w-6 h-6 text-pm-gold" />
                        <label className="text-pm-gold font-medium">Période :</label>
                        <input
                            type="month"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="admin-input w-auto"
                        />
                    </div>
                </div>

                {/* Bilan rapide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg">
                        <div className="flex items-center gap-3">
                            <ArrowTrendingUpIcon className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-green-400/60 text-sm">Revenus</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {balance.totalRevenue.toLocaleString()} {balance.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg">
                        <div className="flex items-center gap-3">
                            <ArrowTrendingDownIcon className="w-8 h-8 text-red-400" />
                            <div>
                                <p className="text-red-400/60 text-sm">Dépenses</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {balance.totalExpenses.toLocaleString()} {balance.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`border p-6 rounded-lg ${
                        balance.netIncome >= 0 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-red-500/10 border-red-500/20'
                    }`}>
                        <div className="flex items-center gap-3">
                            <ChartBarIcon className={`w-8 h-8 ${
                                balance.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                            }`} />
                            <div>
                                <p className={`text-sm ${
                                    balance.netIncome >= 0 ? 'text-green-400/60' : 'text-red-400/60'
                                }`}>Résultat Net</p>
                                <p className={`text-2xl font-bold ${
                                    balance.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {balance.netIncome.toLocaleString()} {balance.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Onglets */}
                <div className="admin-section-wrapper">
                    <div className="flex border-b border-pm-gold/20 mb-6">
                        {[
                            { id: 'payments', label: 'Paiements', icon: CurrencyDollarIcon },
                            { id: 'transactions', label: 'Transactions', icon: BanknotesIcon },
                            { id: 'balance', label: 'Bilan', icon: ChartBarIcon },
                            { id: 'reports', label: 'Rapports', icon: DocumentArrowDownIcon }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-pm-gold border-b-2 border-pm-gold'
                                        : 'text-pm-off-white/60 hover:text-pm-gold'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenu des onglets */}
                    {activeTab === 'payments' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-pm-gold mb-2">Gestion des Paiements</h3>
                                    <p className="text-pm-off-white/60">Enregistrez facilement les cotisations et inscriptions des mannequins</p>
                                </div>
                                <button
                                    onClick={() => setShowPaymentForm(true)}
                                    className="action-btn bg-pm-gold text-pm-dark hover:bg-white"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    Nouveau Paiement
                                </button>
                            </div>

                            {/* Statistiques rapides */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CurrencyDollarIcon className="w-8 h-8 text-green-400" />
                                        <div>
                                            <p className="text-green-400/60 text-sm">Cotisations ce mois</p>
                                            <p className="text-2xl font-bold text-green-400">
                                                {filteredTransactions
                                                    .filter(t => t.subcategory === 'Cotisations Mannequins')
                                                    .reduce((sum, t) => sum + t.amount, 0)
                                                    .toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CreditCardIcon className="w-8 h-8 text-blue-400" />
                                        <div>
                                            <p className="text-blue-400/60 text-sm">Inscriptions ce mois</p>
                                            <p className="text-2xl font-bold text-blue-400">
                                                {filteredTransactions
                                                    .filter(t => t.subcategory === 'Inscriptions')
                                                    .reduce((sum, t) => sum + t.amount, 0)
                                                    .toLocaleString()} FCFA
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Liste des mannequins pour paiements rapides */}
                            <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                <h4 className="text-lg font-semibold text-pm-gold mb-4">Enregistrer un Paiement</h4>
                                <p className="text-pm-off-white/60 mb-6">Cliquez sur un mannequin pour enregistrer rapidement une cotisation ou inscription</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {allModels.map(model => (
                                        <div key={model.id} className="bg-pm-dark/30 p-4 rounded-lg border border-pm-gold/10 hover:border-pm-gold/30 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <h5 className="font-semibold text-pm-off-white">{model.name}</h5>
                                                <span className="text-xs text-pm-off-white/60">#{model.username}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedModel(model.id);
                                                        setPaymentType('cotisation');
                                                        setPaymentAmount(50000); // Montant par défaut
                                                        setShowPaymentForm(true);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-sm hover:bg-green-500/30 transition-colors"
                                                >
                                                    Cotisation
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedModel(model.id);
                                                        setPaymentType('inscription');
                                                        setPaymentAmount(25000); // Montant par défaut
                                                        setShowPaymentForm(true);
                                                    }}
                                                    className="flex-1 px-3 py-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-sm hover:bg-blue-500/30 transition-colors"
                                                >
                                                    Inscription
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Liste des paiements récents */}
                            <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                <h4 className="text-lg font-semibold text-pm-gold mb-4">Paiements Récents</h4>
                                <div className="space-y-3">
                                    {filteredTransactions
                                        .filter(t => t.subcategory === 'Cotisations Mannequins' || t.subcategory === 'Inscriptions')
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .slice(0, 10)
                                        .map(transaction => (
                                            <div key={transaction.id} className="flex justify-between items-center p-4 bg-pm-dark/30 rounded-lg">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        transaction.subcategory === 'Cotisations Mannequins' ? 'bg-green-400' : 'bg-blue-400'
                                                    }`}></div>
                                                    <div>
                                                        <p className="font-medium text-pm-off-white">{transaction.relatedModelName}</p>
                                                        <p className="text-sm text-pm-off-white/60">{transaction.subcategory}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-pm-gold">{transaction.amount.toLocaleString()} FCFA</p>
                                                    <p className="text-sm text-pm-off-white/60">{transaction.date}</p>
                                                </div>
                                            </div>
                                        ))}
                                    
                                    {filteredTransactions.filter(t => t.subcategory === 'Cotisations Mannequins' || t.subcategory === 'Inscriptions').length === 0 && (
                                        <div className="text-center py-8">
                                            <CurrencyDollarIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                                            <p className="text-pm-off-white/60">Aucun paiement enregistré pour cette période</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'transactions' && (
                        <div className="space-y-4">
                            {filteredTransactions.map(transaction => (
                                <div key={transaction.id} className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    transaction.category === 'revenue'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {transaction.category === 'revenue' ? 'Revenu' : 'Dépense'}
                                                </span>
                                                <span className="text-pm-gold font-medium">{transaction.subcategory}</span>
                                                <span className="text-pm-off-white/60">{transaction.date}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-pm-off-white mb-1">
                                                {transaction.description}
                                            </h3>
                                            <div className="flex items-center gap-6 text-sm text-pm-off-white/60">
                                                <span>Montant: <strong className="text-pm-gold">{transaction.amount.toLocaleString()} {transaction.currency}</strong></span>
                                                <span>Méthode: {transaction.paymentMethod}</span>
                                                {transaction.reference && <span>Réf: {transaction.reference}</span>}
                                            </div>
                                            {transaction.notes && (
                                                <p className="text-sm text-pm-off-white/60 mt-2">{transaction.notes}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="p-2 text-red-500/70 hover:text-red-500"
                                                title="Supprimer"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-12">
                                    <BanknotesIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                                    <p className="text-pm-off-white/60">Aucune transaction pour cette période</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'balance' && (
                        <div className="space-y-6">
                            <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                <h3 className="text-xl font-bold text-pm-gold mb-4">Bilan Détaillé - {selectedPeriod}</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-lg font-semibold text-green-400 mb-3">Revenus</h4>
                                        <div className="space-y-2">
                                            {categories.filter(c => c.type === 'revenue').map(category => {
                                                const categoryTotal = filteredTransactions
                                                    .filter(t => t.category === 'revenue' && t.subcategory === category.name)
                                                    .reduce((sum, t) => sum + t.amount, 0);
                                                
                                                return categoryTotal > 0 ? (
                                                    <div key={category.id} className="flex justify-between">
                                                        <span className="text-pm-off-white/80">{category.name}</span>
                                                        <span className="text-green-400 font-medium">
                                                            {categoryTotal.toLocaleString()} {balance.currency}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-red-400 mb-3">Dépenses</h4>
                                        <div className="space-y-2">
                                            {categories.filter(c => c.type === 'expense').map(category => {
                                                const categoryTotal = filteredTransactions
                                                    .filter(t => t.category === 'expense' && t.subcategory === category.name)
                                                    .reduce((sum, t) => sum + t.amount, 0);
                                                
                                                return categoryTotal > 0 ? (
                                                    <div key={category.id} className="flex justify-between">
                                                        <span className="text-pm-off-white/80">{category.name}</span>
                                                        <span className="text-red-400 font-medium">
                                                            {categoryTotal.toLocaleString()} {balance.currency}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-pm-gold/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-pm-gold">Résultat Net</span>
                                        <span className={`text-2xl font-bold ${
                                            balance.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {balance.netIncome.toLocaleString()} {balance.currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                <h3 className="text-xl font-bold text-pm-gold mb-4">Génération de Rapports</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => generatePaymentListPDF('cotisations')}
                                        className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors text-left"
                                    >
                                        <CurrencyDollarIcon className="w-8 h-8 text-green-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-green-400 mb-2">Liste des Cotisations</h4>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Générer un PDF avec toutes les cotisations des mannequins pour la période sélectionnée.
                                        </p>
                                    </button>
                                    
                                    <button
                                        onClick={() => generatePaymentListPDF('inscriptions')}
                                        className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-left"
                                    >
                                        <CreditCardIcon className="w-8 h-8 text-blue-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-blue-400 mb-2">Liste des Inscriptions</h4>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Générer un PDF avec toutes les inscriptions et frais d'inscription.
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Formulaire de paiement simplifié */}
                {showPaymentForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 max-w-md w-full">
                            <h3 className="text-2xl font-bold text-pm-gold mb-6">Nouveau Paiement</h3>
                            
                            <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                <div>
                                    <label className="admin-label">Mannequin</label>
                                    <select
                                        value={selectedModel}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="admin-input"
                                        required
                                    >
                                        <option value="">Sélectionner un mannequin</option>
                                        {allModels.map(model => (
                                            <option key={model.id} value={model.id}>
                                                {model.name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedModel && (
                                        <p className="text-sm text-pm-gold/80 mt-1">
                                            Sélectionné: {allModels.find(m => m.id === selectedModel)?.name}
                                        </p>
                                    )}
                                </div>
                                
                                <div>
                                    <label className="admin-label">Type de paiement</label>
                                    <select
                                        value={paymentType}
                                        onChange={(e) => setPaymentType(e.target.value as 'cotisation' | 'inscription')}
                                        className="admin-input"
                                        required
                                    >
                                        <option value="cotisation">Cotisation</option>
                                        <option value="inscription">Inscription</option>
                                    </select>
                                    <div className={`mt-2 p-2 rounded text-sm ${
                                        paymentType === 'cotisation' 
                                            ? 'bg-green-500/10 text-green-300 border border-green-500/20' 
                                            : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                                    }`}>
                                        {paymentType === 'cotisation' 
                                            ? '💚 Cotisation mensuelle des mannequins' 
                                            : '💙 Frais d\'inscription pour nouveaux mannequins'
                                        }
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="admin-label">Montant (FCFA)</label>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                        className="admin-input"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentForm(false)}
                                        className="px-6 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Formulaire de nouvelle transaction */}
                {showTransactionForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-pm-gold mb-6">Nouvelle Transaction</h3>
                            
                            <form onSubmit={handleTransactionSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Date</label>
                                        <input
                                            type="date"
                                            value={newTransaction.date}
                                            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                                            className="admin-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Type</label>
                                        <select
                                            value={newTransaction.category}
                                            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value as 'revenue' | 'expense'})}
                                            className="admin-input"
                                            required
                                        >
                                            <option value="revenue">Revenu</option>
                                            <option value="expense">Dépense</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="admin-label">Description</label>
                                    <input
                                        type="text"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                                        className="admin-input"
                                        placeholder="Description de la transaction"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Catégorie</label>
                                        <select
                                            value={newTransaction.subcategory}
                                            onChange={(e) => setNewTransaction({...newTransaction, subcategory: e.target.value})}
                                            className="admin-input"
                                            required
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories
                                                .filter(c => c.type === newTransaction.category)
                                                .map(category => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label">Montant</label>
                                        <input
                                            type="number"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                                            className="admin-input"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Méthode de paiement</label>
                                        <select
                                            value={newTransaction.paymentMethod}
                                            onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value as any})}
                                            className="admin-input"
                                        >
                                            <option value="cash">Espèces</option>
                                            <option value="bank_transfer">Virement bancaire</option>
                                            <option value="mobile_money">Mobile Money</option>
                                            <option value="check">Chèque</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label">Référence (optionnel)</label>
                                        <input
                                            type="text"
                                            value={newTransaction.reference}
                                            onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                                            className="admin-input"
                                            placeholder="Numéro de facture, référence..."
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="admin-label">Notes (optionnel)</label>
                                    <textarea
                                        value={newTransaction.notes}
                                        onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                                        className="admin-textarea"
                                        rows={3}
                                        placeholder="Notes supplémentaires..."
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTransactionForm(false)}
                                        className="px-6 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        Enregistrer
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

export default AdminAccounting;
