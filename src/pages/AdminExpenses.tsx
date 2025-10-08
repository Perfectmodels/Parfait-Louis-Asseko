import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { PlusIcon, PencilIcon, TrashIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';

interface AccountingTransaction {
    id: string;
    date: string;
    category: 'revenue' | 'expense';
    subcategory: string;
    description: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    reference?: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
    relatedModelId?: string;
    relatedModelName?: string;
}

const AdminExpenses: React.FC = () => {
    const { data, saveData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editingExpense, setEditingExpense] = useState<AccountingTransaction | null>(null);
    const [filterSubcategory, setFilterSubcategory] = useState<string>('all');

    const allTransactions: AccountingTransaction[] = data?.accountingTransactions || [];
    const expenses = allTransactions.filter(t => t.category === 'expense');
    
    // Récupérer les catégories et sous-catégories
    const categories = data?.accountingCategories || [];
    const expenseCategories = categories.filter(c => c.type === 'expense');
    const subcategories = expenseCategories.flatMap(c => c.subcategories || []);
    const uniqueSubcategories = Array.from(new Set(subcategories));

    const filteredExpenses = filterSubcategory === 'all' 
        ? expenses 
        : expenses.filter(exp => exp.subcategory === filterSubcategory);

    const handleAdd = () => {
        const newExpense: AccountingTransaction = {
            id: `trans-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            category: 'expense',
            subcategory: uniqueSubcategories[0] || 'Divers',
            description: '',
            amount: 0,
            currency: 'FCFA',
            paymentMethod: 'cash',
            reference: '',
            notes: '',
            createdBy: 'admin',
            createdAt: new Date().toISOString()
        };
        setEditingExpense(newExpense);
        setIsEditing(true);
    };

    const handleEdit = (expense: AccountingTransaction) => {
        setEditingExpense({ ...expense });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editingExpense || !data) return;

        const existingIndex = allTransactions.findIndex(t => t.id === editingExpense.id);
        let updatedTransactions;

        if (existingIndex >= 0) {
            updatedTransactions = [...allTransactions];
            updatedTransactions[existingIndex] = editingExpense;
        } else {
            updatedTransactions = [...allTransactions, editingExpense];
        }

        await saveData({ ...data, accountingTransactions: updatedTransactions });
        setIsEditing(false);
        setEditingExpense(null);
    };

    const handleDelete = async (id: string) => {
        if (!data || !confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) return;
        
        const updatedTransactions = allTransactions.filter(t => t.id !== id);
        await saveData({ ...data, accountingTransactions: updatedTransactions });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    const paymentMethodLabels: Record<string, string> = {
        cash: 'Espèces',
        bank_transfer: 'Virement bancaire',
        mobile_money: 'Mobile Money',
        check: 'Chèque',
        card: 'Carte bancaire'
    };

    if (isEditing && editingExpense) {
        return (
            <AdminLayout>
                <AdminPageHeader 
                    title={expenses.findIndex(e => e.id === editingExpense.id) === -1 ? "Nouvelle Dépense" : "Modifier Dépense"}
                    subtitle="Enregistrer une dépense de l'agence"
                />

                <AdminSection title="Informations de la Dépense">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Date *</label>
                            <input
                                type="date"
                                value={editingExpense.date}
                                onChange={e => setEditingExpense({ ...editingExpense, date: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Catégorie *</label>
                            <select
                                value={editingExpense.subcategory}
                                onChange={e => setEditingExpense({ ...editingExpense, subcategory: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                required
                            >
                                {uniqueSubcategories.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Description *</label>
                            <input
                                type="text"
                                value={editingExpense.description}
                                onChange={e => setEditingExpense({ ...editingExpense, description: e.target.value })}
                                placeholder="Ex: Loyer bureau - Janvier 2025"
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Montant (FCFA) *</label>
                            <input
                                type="number"
                                min="0"
                                value={editingExpense.amount}
                                onChange={e => setEditingExpense({ ...editingExpense, amount: parseFloat(e.target.value) || 0 })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Méthode de Paiement *</label>
                            <select
                                value={editingExpense.paymentMethod}
                                onChange={e => setEditingExpense({ ...editingExpense, paymentMethod: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                required
                            >
                                <option value="cash">Espèces</option>
                                <option value="bank_transfer">Virement bancaire</option>
                                <option value="mobile_money">Mobile Money</option>
                                <option value="check">Chèque</option>
                                <option value="card">Carte bancaire</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Référence</label>
                            <input
                                type="text"
                                value={editingExpense.reference || ''}
                                onChange={e => setEditingExpense({ ...editingExpense, reference: e.target.value })}
                                placeholder="Ex: REF-2025-001"
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Notes</label>
                            <textarea
                                value={editingExpense.notes || ''}
                                onChange={e => setEditingExpense({ ...editingExpense, notes: e.target.value })}
                                rows={3}
                                placeholder="Informations supplémentaires..."
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                    </div>
                </AdminSection>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={!editingExpense.description || editingExpense.amount <= 0}
                        className="px-6 py-3 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enregistrer
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingExpense(null);
                        }}
                        className="px-6 py-3 bg-black border border-pm-gold/20 text-pm-off-white rounded-lg hover:border-pm-gold/50 transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPageHeader 
                title="Dépenses"
                subtitle="Enregistrer et catégoriser toutes les dépenses de l'agence"
                action={
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouvelle Dépense
                    </button>
                }
            />

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Total Dépenses (Mois)</p>
                            <p className="text-2xl font-bold text-red-400">
                                {formatCurrency(
                                    expenses
                                        .filter(e => {
                                            const expenseDate = new Date(e.date);
                                            const now = new Date();
                                            return expenseDate.getMonth() === now.getMonth() && 
                                                   expenseDate.getFullYear() === now.getFullYear();
                                        })
                                        .reduce((sum, e) => sum + e.amount, 0)
                                )}
                            </p>
                        </div>
                        <ReceiptPercentIcon className="w-12 h-12 text-red-400/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Nombre de Dépenses</p>
                            <p className="text-2xl font-bold text-pm-gold">{expenses.length}</p>
                        </div>
                        <ReceiptPercentIcon className="w-12 h-12 text-pm-gold/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Dépense Moyenne</p>
                            <p className="text-2xl font-bold text-pm-off-white">
                                {formatCurrency(expenses.length > 0 ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length : 0)}
                            </p>
                        </div>
                        <ReceiptPercentIcon className="w-12 h-12 text-pm-off-white/30" />
                    </div>
                </AdminCard>
            </div>

            {/* Filtres */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilterSubcategory('all')}
                    className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                        filterSubcategory === 'all'
                            ? 'bg-pm-gold text-black'
                            : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
                    }`}
                >
                    Toutes
                </button>
                {uniqueSubcategories.map(sub => (
                    <button
                        key={sub}
                        onClick={() => setFilterSubcategory(sub)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                            filterSubcategory === sub
                                ? 'bg-pm-gold text-black'
                                : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
                        }`}
                    >
                        {sub}
                    </button>
                ))}
            </div>

            {/* Liste des dépenses */}
            <AdminSection title={`Dépenses (${filteredExpenses.length})`}>
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-12">
                        <ReceiptPercentIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                        <p className="text-pm-off-white/60">Aucune dépense enregistrée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-pm-gold/20">
                                    <th className="text-left py-3 px-4 text-pm-gold font-semibold">Date</th>
                                    <th className="text-left py-3 px-4 text-pm-gold font-semibold">Description</th>
                                    <th className="text-left py-3 px-4 text-pm-gold font-semibold">Catégorie</th>
                                    <th className="text-left py-3 px-4 text-pm-gold font-semibold">Paiement</th>
                                    <th className="text-right py-3 px-4 text-pm-gold font-semibold">Montant</th>
                                    <th className="text-right py-3 px-4 text-pm-gold font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExpenses
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map(expense => (
                                    <tr key={expense.id} className="border-b border-pm-gold/10 hover:bg-pm-gold/5">
                                        <td className="py-3 px-4 text-pm-off-white/80">
                                            {new Date(expense.date).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="py-3 px-4 text-pm-off-white">
                                            {expense.description}
                                            {expense.notes && (
                                                <span className="block text-xs text-pm-off-white/60 mt-1">{expense.notes}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-purple-600/20 text-purple-400">
                                                {expense.subcategory}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-pm-off-white/80 text-sm">
                                            {paymentMethodLabels[expense.paymentMethod] || expense.paymentMethod}
                                        </td>
                                        <td className="py-3 px-4 text-right font-bold text-red-400">
                                            {formatCurrency(expense.amount)}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(expense)}
                                                    className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded transition-colors"
                                                    title="Modifier"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="p-2 text-red-400 hover:bg-red-600/10 rounded transition-colors"
                                                    title="Supprimer"
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
                )}
            </AdminSection>
        </AdminLayout>
    );
};

export default AdminExpenses;
