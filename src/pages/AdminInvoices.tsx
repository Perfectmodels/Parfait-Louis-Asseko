import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import AdminFilterBar from '../components/admin/AdminFilterBar';
import { DocumentTextIcon, PlusIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Impayée' | 'Payée' | 'En retard' | 'Annulée';
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
}

const AdminInvoices: React.FC = () => {
  const { data, saveData } = useData();
  const [filter, setFilter] = useState<'all' | 'Impayée' | 'Payée' | 'En retard' | 'Annulée'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Invoice>>({
    clientName: '',
    clientEmail: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'Impayée',
    items: [],
    notes: ''
  });

  const invoices: Invoice[] = data?.invoices || [];

  const filteredInvoices = invoices.filter(invoice => {
    const matchesFilter = filter === 'all' || invoice.status === filter;
    const matchesSearch = searchTerm === '' || 
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(4, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;

    if (editingId) {
      const updated = invoices.map(inv => 
        inv.id === editingId ? { ...formData, id: editingId } as Invoice : inv
      );
      saveData({ ...data, invoices: updated });
    } else {
      const newInvoice: Invoice = {
        ...formData,
        id: Date.now().toString(),
        invoiceNumber: generateInvoiceNumber()
      } as Invoice;
      saveData({ ...data, invoices: [...invoices, newInvoice] });
    }
    resetForm();
  };

  const handleStatusChange = (id: string, newStatus: Invoice['status']) => {
    if (!data) return;
    const updated = invoices.map(inv => 
      inv.id === id ? { ...inv, status: newStatus } : inv
    );
    saveData({ ...data, invoices: updated });
  };

  const handleDelete = (id: string) => {
    if (!data) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      const updated = invoices.filter(inv => inv.id !== id);
      saveData({ ...data, invoices: updated });
    }
  };

  const handleEdit = (invoice: Invoice) => {
    setFormData(invoice);
    setEditingId(invoice.id);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientEmail: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'Impayée',
      items: [],
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

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const unpaidAmount = filteredInvoices.filter(inv => inv.status === 'Impayée').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Factures" 
        subtitle="Créer et gérer les factures clients"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AdminCard>
          <p className="text-sm text-gray-600">Total Factures</p>
          <p className="text-2xl font-bold text-pm-gold">{formatCurrency(totalAmount)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-sm text-gray-600">Impayées</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(unpaidAmount)}</p>
        </AdminCard>
        <AdminCard>
          <p className="text-sm text-gray-600">Nombre de Factures</p>
          <p className="text-2xl font-bold text-blue-600">{filteredInvoices.length}</p>
        </AdminCard>
      </div>

      <AdminFilterBar
        filters={[
          { label: 'Toutes', value: 'all' },
          { label: 'Impayées', value: 'Impayée' },
          { label: 'Payées', value: 'Payée' },
          { label: 'En retard', value: 'En retard' },
          { label: 'Annulées', value: 'Annulée' }
        ]}
        activeFilter={filter}
        onFilterChange={(value) => setFilter(value as typeof filter)}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Rechercher une facture..."
      />

      <AdminSection 
        title={`${filteredInvoices.length} facture(s)`}
        action={
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
          >
            <PlusIcon className="w-5 h-5" />
            {showAddForm ? 'Annuler' : 'Nouvelle Facture'}
          </button>
        }
      >
        {showAddForm && (
          <AdminCard className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du Client *</label>
                  <input
                    type="text"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email du Client</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  />
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
                  <label className="block text-sm font-medium mb-1">Date d'émission *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date d'échéance *</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Invoice['status'] })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="Impayée">Impayée</option>
                    <option value="Payée">Payée</option>
                    <option value="En retard">En retard</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </div>
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
                  {editingId ? 'Mettre à jour' : 'Créer la Facture'}
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
          {filteredInvoices.map((invoice) => (
            <AdminCard key={invoice.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <DocumentTextIcon className="w-6 h-6 text-pm-gold" />
                    <div>
                      <h3 className="font-semibold text-lg">{invoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">{invoice.clientName}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Montant</p>
                      <p className="font-semibold text-pm-gold">{formatCurrency(invoice.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date d'émission</p>
                      <p className="font-medium">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date d'échéance</p>
                      <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>

                  {invoice.notes && (
                    <p className="text-sm text-gray-600 mt-2">{invoice.notes}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm text-center ${
                    invoice.status === 'Payée' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'En retard' ? 'bg-red-100 text-red-800' :
                    invoice.status === 'Annulée' ? 'bg-gray-100 text-gray-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>

                  <select
                    value={invoice.status}
                    onChange={(e) => handleStatusChange(invoice.id, e.target.value as Invoice['status'])}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="Impayée">Impayée</option>
                    <option value="Payée">Payée</option>
                    <option value="En retard">En retard</option>
                    <option value="Annulée">Annulée</option>
                  </select>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      title="Modifier"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                      title="Supprimer"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Aucune facture trouvée</p>
            </div>
          )}
        </div>
      </AdminSection>
    </AdminLayout>
  );
};

export default AdminInvoices;

