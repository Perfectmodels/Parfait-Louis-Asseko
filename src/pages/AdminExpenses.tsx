import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';
import { ShoppingCartIcon, PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'Espèces' | 'Carte' | 'Virement' | 'Mobile Money';
  status: 'Payée' | 'En attente' | 'Remboursée';
  receipt?: string;
  notes?: string;
}

const EXPENSE_CATEGORIES = [
  'Loyer et Charges',
  'Salaires',
  'Transport',
  'Matériel',
  'Marketing',
  'Formation',
  'Événements',
  'Maintenance',
  'Fournitures',
  'Services Professionnels',
  'Assurances',
  'Taxes',
  'Autres'
];

const AdminExpenses: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Expense>>({
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Espèces',
    status: 'Payée',
    notes: ''
  });

  const expenses: Expense[] = data?.expenses || [];

  const filteredExpenses = expenses.filter(expense => {
    const matchesFilter = filter === 'all' || expense.category === filter;
    const matchesSearch = searchTerm === '' || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    if (editingId) {
      const updated = expenses.map(exp => 
        exp.id === editingId ? { ...formData, id: editingId } as Expense : exp
      );
      saveData({ ...data, expenses: updated });
    } else {
      const newExpense: Expense = {
        ...formData,
        id: Date.now().toString()
      } as Expense;
      saveData({ ...data, expenses: [...expenses, newExpense] });
    }
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      const updated = expenses.filter(exp => exp.id !== id);
      saveData({ ...data, expenses: updated });
    }
  };

  const handleEdit = (expense: Expense) => {
    setFormData(expense);
    setEditingId(expense.id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Espèces',
      status: 'Payée',
      notes: ''
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  // Statistiques par catégorie
  const expensesByCategory = EXPENSE_CATEGORIES.map(category => {
    const categoryExpenses = expenses.filter(exp => exp.category === category);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return { category, total, count: categoryExpenses.length };
  }).filter(item => item.count > 0);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Dépenses" 
        subtitle="Enregistrer et suivre toutes les dépenses de l'agence"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AdminCard>
          <p className="text-sm text-gray-600">Total Dépenses</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalAmount)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-sm text-gray-600">Nombre de Dépenses</p>
          <p className="text-2xl font-bold text-blue-600">{filteredExpenses.length}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-sm text-gray-600">Catégories Actives</p>
          <p className="text-2xl font-bold text-pm-gold">{expensesByCategory.length}</p>
        </AdminCard>
      </div>

      <AdminFilterBar
        filters={[
          { label: 'Toutes', value: 'all' },
          ...EXPENSE_CATEGORIES.map(cat => ({ label: cat, value: cat }))
        ]}
        activeFilter={filter}
        onFilterChange={setFilter}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher une dépense..."
      />

      <AdminSection 
        title={`${filteredExpenses.length} dépense(s)`}
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
          >
            <PlusIcon className="w-5 h-5" />
            {showAddForm ? 'Annuler' : 'Nouvelle Dépense'}
          </button>
        }
      >
        {showAddForm && (
          <AdminCard className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Montant (XAF) *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Méthode de Paiement *</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as Expense['paymentMethod'] })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Carte">Carte</option>
                    <option value="Virement">Virement</option>
                    <option value="Mobile Money">Mobile Money</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description *</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                  placeholder="Ex: Achat de matériel photo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
                >
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border rounded hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </form>
          </AdminCard>
        )}

        <div className="space-y-4">
          {filteredExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
            <AdminCard key={expense.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingCartIcon className="w-6 h-6 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-lg">{expense.description}</h3>
                      <p className="text-sm text-gray-600">{expense.category}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Montant</p>
                      <p className="font-semibold text-red-600">{formatCurrency(expense.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium">{new Date(expense.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Paiement</p>
                      <p className="font-medium">{expense.paymentMethod}</p>
                    </div>
                  </div>

                  {expense.notes && (
                    <p className="text-sm text-gray-600 mt-2 italic">{expense.notes}</p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    title="Modifier"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                    title="Supprimer"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </AdminCard>
          ))}

          {filteredExpenses.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <ShoppingCartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Aucune dépense enregistrée</p>
            </div>
          )}
        </div>
      </AdminSection>

      {/* Résumé par catégorie */}
      {expensesByCategory.length > 0 && (
        <AdminSection title="Dépenses par Catégorie">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {expensesByCategory.sort((a, b) => b.total - a.total).map(item => (
              <AdminCard key={item.category}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">{item.category}</p>
                    <p className="text-lg font-bold text-red-600">{formatCurrency(item.total)}</p>
                    <p className="text-xs text-gray-500">{item.count} dépense(s)</p>
                  </div>
                  <button
                    onClick={() => setFilter(item.category)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Voir
                  </button>
                </div>
              </AdminCard>
            ))}
          </div>
        </AdminSection>
      )}
    </AdminLayout>
  );
};

export default AdminExpenses;

