import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { PlusIcon, PencilIcon, TrashIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface Invoice {
    id: string;
    invoiceNumber: string;
    clientName: string;
    clientEmail?: string;
    clientPhone?: string;
    date: string;
    dueDate: string;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

const AdminInvoices: React.FC = () => {
    const { data, saveData } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const invoices: Invoice[] = data?.invoices || [];

    const filteredInvoices = filterStatus === 'all' 
        ? invoices 
        : invoices.filter(inv => inv.status === filterStatus);

    const handleAdd = () => {
        const newInvoice: Invoice = {
            id: `invoice-${Date.now()}`,
            invoiceNumber: `INV-${Date.now()}`,
            clientName: '',
            clientEmail: '',
            clientPhone: '',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'draft',
            items: [{
                description: '',
                quantity: 1,
                unitPrice: 0,
                total: 0
            }],
            subtotal: 0,
            tax: 0,
            total: 0,
            notes: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setEditingInvoice(newInvoice);
        setIsEditing(true);
    };

    const handleEdit = (invoice: Invoice) => {
        setEditingInvoice({ ...invoice });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!editingInvoice || !data) return;

        const existingIndex = invoices.findIndex(inv => inv.id === editingInvoice.id);
        let updatedInvoices;

        if (existingIndex >= 0) {
            updatedInvoices = [...invoices];
            updatedInvoices[existingIndex] = { ...editingInvoice, updatedAt: new Date().toISOString() };
        } else {
            updatedInvoices = [...invoices, editingInvoice];
        }

        await saveData({ ...data, invoices: updatedInvoices });
        setIsEditing(false);
        setEditingInvoice(null);
    };

    const handleDelete = async (id: string) => {
        if (!data || !confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) return;
        
        const updatedInvoices = invoices.filter(inv => inv.id !== id);
        await saveData({ ...data, invoices: updatedInvoices });
    };

    const calculateTotals = (items: InvoiceItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const tax = subtotal * 0.18; // TVA 18%
        const total = subtotal + tax;
        return { subtotal, tax, total };
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
        if (!editingInvoice) return;

        const updatedItems = [...editingInvoice.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        // Recalculer le total de la ligne
        if (field === 'quantity' || field === 'unitPrice') {
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice;
        }

        const { subtotal, tax, total } = calculateTotals(updatedItems);

        setEditingInvoice({
            ...editingInvoice,
            items: updatedItems,
            subtotal,
            tax,
            total
        });
    };

    const addItem = () => {
        if (!editingInvoice) return;
        setEditingInvoice({
            ...editingInvoice,
            items: [...editingInvoice.items, {
                description: '',
                quantity: 1,
                unitPrice: 0,
                total: 0
            }]
        });
    };

    const removeItem = (index: number) => {
        if (!editingInvoice || editingInvoice.items.length <= 1) return;
        const updatedItems = editingInvoice.items.filter((_, i) => i !== index);
        const { subtotal, tax, total } = calculateTotals(updatedItems);
        setEditingInvoice({
            ...editingInvoice,
            items: updatedItems,
            subtotal,
            tax,
            total
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    const statusLabels: Record<Invoice['status'], string> = {
        draft: 'Brouillon',
        sent: 'Envoyée',
        paid: 'Payée',
        overdue: 'En retard',
        cancelled: 'Annulée'
    };

    const statusColors: Record<Invoice['status'], string> = {
        draft: 'bg-gray-600/20 text-gray-400',
        sent: 'bg-blue-600/20 text-blue-400',
        paid: 'bg-green-600/20 text-green-400',
        overdue: 'bg-red-600/20 text-red-400',
        cancelled: 'bg-gray-600/20 text-gray-400'
    };

    if (isEditing && editingInvoice) {
        return (
            <AdminLayout>
                <AdminPageHeader 
                    title={editingInvoice.id.startsWith('invoice-') && invoices.findIndex(i => i.id === editingInvoice.id) === -1 ? "Nouvelle Facture" : "Modifier Facture"}
                    subtitle="Créer ou modifier une facture client"
                />

                <AdminSection title="Informations Client">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Nom du Client *</label>
                            <input
                                type="text"
                                value={editingInvoice.clientName}
                                onChange={e => setEditingInvoice({ ...editingInvoice, clientName: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Numéro de Facture</label>
                            <input
                                type="text"
                                value={editingInvoice.invoiceNumber}
                                onChange={e => setEditingInvoice({ ...editingInvoice, invoiceNumber: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Email</label>
                            <input
                                type="email"
                                value={editingInvoice.clientEmail || ''}
                                onChange={e => setEditingInvoice({ ...editingInvoice, clientEmail: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Téléphone</label>
                            <input
                                type="tel"
                                value={editingInvoice.clientPhone || ''}
                                onChange={e => setEditingInvoice({ ...editingInvoice, clientPhone: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Date de Facture</label>
                            <input
                                type="date"
                                value={editingInvoice.date}
                                onChange={e => setEditingInvoice({ ...editingInvoice, date: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Date d'Échéance</label>
                            <input
                                type="date"
                                value={editingInvoice.dueDate}
                                onChange={e => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">Statut</label>
                            <select
                                value={editingInvoice.status}
                                onChange={e => setEditingInvoice({ ...editingInvoice, status: e.target.value as Invoice['status'] })}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            >
                                <option value="draft">Brouillon</option>
                                <option value="sent">Envoyée</option>
                                <option value="paid">Payée</option>
                                <option value="overdue">En retard</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                    </div>
                </AdminSection>

                <AdminSection title="Articles / Services" className="mt-6">
                    <div className="space-y-4">
                        {editingInvoice.items.map((item, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 items-start p-4 bg-pm-dark/30 rounded-lg">
                                <div className="col-span-12 md:col-span-5">
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={e => handleItemChange(index, 'description', e.target.value)}
                                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-3 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <input
                                        type="number"
                                        placeholder="Qté"
                                        min="1"
                                        value={item.quantity}
                                        onChange={e => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-3 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                                <div className="col-span-4 md:col-span-2">
                                    <input
                                        type="number"
                                        placeholder="Prix unitaire"
                                        min="0"
                                        value={item.unitPrice}
                                        onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-3 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                                <div className="col-span-3 md:col-span-2 flex items-center">
                                    <span className="text-pm-gold font-bold">{formatCurrency(item.total)}</span>
                                </div>
                                <div className="col-span-1 flex items-center justify-end">
                                    <button
                                        onClick={() => removeItem(index)}
                                        disabled={editingInvoice.items.length <= 1}
                                        className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={addItem}
                            className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/20 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Ajouter un article
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <div className="w-full md:w-1/2 space-y-2">
                            <div className="flex justify-between text-pm-off-white">
                                <span>Sous-total:</span>
                                <span className="font-semibold">{formatCurrency(editingInvoice.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-pm-off-white">
                                <span>TVA (18%):</span>
                                <span className="font-semibold">{formatCurrency(editingInvoice.tax)}</span>
                            </div>
                            <div className="flex justify-between text-pm-gold text-xl font-bold border-t border-pm-gold/20 pt-2">
                                <span>Total:</span>
                                <span>{formatCurrency(editingInvoice.total)}</span>
                            </div>
                        </div>
                    </div>
                </AdminSection>

                <AdminSection title="Notes" className="mt-6">
                    <textarea
                        value={editingInvoice.notes || ''}
                        onChange={e => setEditingInvoice({ ...editingInvoice, notes: e.target.value })}
                        rows={4}
                        placeholder="Notes supplémentaires (conditions de paiement, remerciements, etc.)"
                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    />
                </AdminSection>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={!editingInvoice.clientName}
                        className="px-6 py-3 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enregistrer
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingInvoice(null);
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
                title="Factures Clients"
                subtitle="Créer et gérer les factures pour les clients de l'agence"
                action={
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Nouvelle Facture
                    </button>
                }
            />

            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                {['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                            filterStatus === status
                                ? 'bg-pm-gold text-black'
                                : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
                        }`}
                    >
                        {status === 'all' ? 'Toutes' : statusLabels[status as Invoice['status']]}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {filteredInvoices.length === 0 ? (
                    <AdminCard>
                        <div className="text-center py-12">
                            <DocumentTextIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                            <p className="text-pm-off-white/60">Aucune facture trouvée</p>
                        </div>
                    </AdminCard>
                ) : (
                    filteredInvoices.map(invoice => (
                        <AdminCard key={invoice.id}>
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4 mb-3">
                                        <DocumentTextIcon className="w-8 h-8 text-pm-gold flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-pm-off-white mb-1">
                                                {invoice.invoiceNumber}
                                            </h3>
                                            <p className="text-pm-off-white/80">{invoice.clientName}</p>
                                            {invoice.clientEmail && (
                                                <p className="text-sm text-pm-off-white/60">{invoice.clientEmail}</p>
                                            )}
                                        </div>
                                        <span className={`px-3 py-1 rounded text-xs font-bold ${statusColors[invoice.status]}`}>
                                            {statusLabels[invoice.status]}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-pm-off-white/60">Date:</span>
                                            <p className="text-pm-off-white">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div>
                                            <span className="text-pm-off-white/60">Échéance:</span>
                                            <p className="text-pm-off-white">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                        <div>
                                            <span className="text-pm-off-white/60">Articles:</span>
                                            <p className="text-pm-off-white">{invoice.items.length}</p>
                                        </div>
                                        <div>
                                            <span className="text-pm-off-white/60">Total:</span>
                                            <p className="text-pm-gold font-bold">{formatCurrency(invoice.total)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex md:flex-col gap-2">
                                    <button
                                        onClick={() => handleEdit(invoice)}
                                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/30 text-pm-gold rounded-lg hover:bg-pm-gold/20 transition-colors"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                        Modifier
                                    </button>
                                    <button
                                        onClick={() => handleDelete(invoice.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-400 rounded-lg hover:bg-red-600/20 transition-colors"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </AdminCard>
                    ))
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminInvoices;
