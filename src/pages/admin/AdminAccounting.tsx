import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, PlusIcon, DocumentArrowDownIcon, 
    CurrencyDollarIcon, ChartBarIcon, CalendarIcon,
    BanknotesIcon, CreditCardIcon, ArrowTrendingUpIcon,
    ArrowTrendingDownIcon, PencilIcon, TrashIcon,
    TagIcon, ChartPieIcon
} from '@heroicons/react/24/outline';
import { AccountingTransaction, AccountingCategory, AccountingBalance } from '../../types';
import jsPDF from 'jspdf';
import AccountingCharts from '../../components/AccountingCharts';

const AdminAccounting: React.FC = () => {
    const { data, saveData } = useData();
    const [activeTab, setActiveTab] = useState<'transactions' | 'balance' | 'reports' | 'categories' | 'charts'>('transactions');
    
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<Partial<AccountingTransaction>>({});
    const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

    const [showCategoryForm, setShowCategoryForm] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<Partial<AccountingCategory>>({});
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7));

    const transactions = data?.accountingTransactions || [];
    const categories = data?.accountingCategories || [];

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    const balance: AccountingBalance = useMemo(() => {
        const totalRevenue = filteredTransactions.filter(t => t.category === 'revenue').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = filteredTransactions.filter(t => t.category === 'expense').reduce((sum, t) => sum + t.amount, 0);
        return { totalRevenue, totalExpenses, netIncome: totalRevenue - totalExpenses, currency: 'FCFA', period: selectedPeriod };
    }, [filteredTransactions, selectedPeriod]);

    const handleTransactionFormClose = () => {
        setShowTransactionForm(false);
        setEditingTransactionId(null);
        setCurrentTransaction({});
    };

    const handleAddNewTransaction = () => {
        setEditingTransactionId(null);
        setCurrentTransaction({ date: new Date().toISOString().split('T')[0], category: 'revenue', amount: 0, currency: 'FCFA', paymentMethod: 'cash' });
        setShowTransactionForm(true);
    };

    const handleEditTransaction = (transaction: AccountingTransaction) => {
        setEditingTransactionId(transaction.id);
        setCurrentTransaction(transaction);
        setShowTransactionForm(true);
    };

    const handleSaveTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !currentTransaction.description || !currentTransaction.amount) return;
        try {
            let updatedTransactions;
            if (editingTransactionId) {
                updatedTransactions = transactions.map(t => t.id === editingTransactionId ? { ...t, ...currentTransaction } as AccountingTransaction : t);
            } else {
                const newTransaction = { ...currentTransaction, id: `trans-${Date.now()}`, createdBy: 'admin', createdAt: new Date().toISOString() } as AccountingTransaction;
                updatedTransactions = [...transactions, newTransaction];
            }
            await saveData({ ...data, accountingTransactions: updatedTransactions });
            handleTransactionFormClose();
        } catch (error) {
            console.error('Erreur sauvegarde transaction:', error);
            alert(`Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`);
        }
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        if (!data || !window.confirm('Supprimer cette transaction ?')) return;
        try {
            const updatedTransactions = transactions.filter(t => t.id !== transactionId);
            await saveData({ ...data, accountingTransactions: updatedTransactions });
        } catch (error) { console.error('Erreur suppression transaction:', error); }
    };

    const handleCategoryFormClose = () => {
        setShowCategoryForm(false);
        setEditingCategoryId(null);
        setCurrentCategory({});
    };

    const handleAddNewCategory = () => {
        setEditingCategoryId(null);
        setCurrentCategory({ name: '', type: 'expense', subcategories: [] });
        setShowCategoryForm(true);
    };

    const handleEditCategory = (category: AccountingCategory) => {
        setEditingCategoryId(category.id);
        setCurrentCategory(category);
        setShowCategoryForm(true);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !currentCategory.name || !currentCategory.type) return;
        try {
            let updatedCategories;
            const existingCategories = data.accountingCategories || [];
            if (editingCategoryId) {
                updatedCategories = existingCategories.map(c => c.id === editingCategoryId ? { ...c, ...currentCategory } as AccountingCategory : c);
            } else {
                const newCategory = { ...currentCategory, id: `cat-${Date.now()}` } as AccountingCategory;
                updatedCategories = [...existingCategories, newCategory];
            }
            await saveData({ ...data, accountingCategories: updatedCategories });
            handleCategoryFormClose();
        } catch (error) {
            console.error('Erreur sauvegarde catégorie:', error);
            alert(`Erreur: ${error instanceof Error ? error.message : 'Inconnue'}`);
        }
    };

    const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
        if (!data) return;
        const isCategoryInUse = transactions.some(t => t.subcategory === categoryName);
        if (isCategoryInUse) {
            alert("Impossible de supprimer: cette catégorie est utilisée par au moins une transaction.");
            return;
        }
        if (window.confirm('Supprimer cette catégorie ?')) {
            try {
                const updatedCategories = (data.accountingCategories || []).filter(c => c.id !== categoryId);
                await saveData({ ...data, accountingCategories: updatedCategories });
            } catch (error) { console.error('Erreur suppression catégorie:', error); }
        }
    };
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Comptabilité" noIndex />
            <div className="container mx-auto px-6">
                 <div className="admin-page-header">...</div>
                 <div className="admin-section-wrapper mb-8">...</div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">...</div>

                <div className="admin-section-wrapper">
                    <div className="flex border-b border-pm-gold/20 mb-6">
                        {[
                            { id: 'transactions', label: 'Transactions', icon: BanknotesIcon },
                            { id: 'charts', label: 'Graphiques', icon: ChartPieIcon },
                            { id: 'balance', label: 'Bilan', icon: ChartBarIcon },
                            { id: 'reports', label: 'Rapports', icon: DocumentArrowDownIcon },
                            { id: 'categories', label: 'Catégories', icon: TagIcon }
                        ].map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === tab.id ? 'text-pm-gold border-b-2 border-pm-gold' : 'text-pm-off-white/60 hover:text-pm-gold'}`}>
                                <tab.icon className="w-5 h-5" />{tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'transactions' && ( null )}

                    {activeTab === 'charts' && (
                        <AccountingCharts 
                            transactions={transactions} 
                            categories={categories} 
                            selectedPeriod={selectedPeriod} 
                        />
                    )}

                    {activeTab === 'balance' && ( null )}
                    {activeTab === 'reports' && ( null )}
                    {activeTab === 'categories' && ( null )}
                </div>

                {showTransactionForm && ( null )}
                {showCategoryForm && ( null )}
            </div>
        </div>
    );
};

export default AdminAccounting;
