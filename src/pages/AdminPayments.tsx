import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { MonthlyPayment, Model, AccountingEntry } from '../types';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<AccountingEntry | null>(null);
    const [monthFilter, setMonthFilter] = useState('');

    const payments = useMemo(() => {
        return [...(data?.monthlyPayments || [])].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    }, [data?.monthlyPayments]);

    const entries = useMemo(() => {
        return [...(data?.accountingEntries || [])].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    }, [data?.accountingEntries]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const filteredPayments = useMemo(() => {
        if (!monthFilter) return payments;
        return payments.filter(p => p.month === monthFilter);
    }, [payments, monthFilter]);

    const uniqueMonths = useMemo(() => {
        const months = new Set(payments.map(p => p.month));
        return Array.from(months).sort().reverse();
    }, [payments]);

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

    const handleDeleteEntry = async (entryId: string) => {
        if (!data) return;
        if (!window.confirm('Supprimer cette écriture ?')) return;
        const updated = (data.accountingEntries || []).filter(e => e.id !== entryId);
        await saveData({ ...data, accountingEntries: updated });
    };
    
    const getStatusColor = (status: MonthlyPayment['status']) => {
        switch (status) {
            case 'Payé': return 'bg-green-500/20 text-green-300';
            case 'En attente': return 'bg-yellow-500/20 text-yellow-300';
            case 'En retard': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    // Aggregates per model and global expenses placeholder
    const perModel = useMemo(() => {
        const map = new Map<string, { name: string; totalPaid: number; monthsPaid: Set<string>; lastStatus: MonthlyPayment['status'] }>();
        for (const p of payments) {
            const key = p.modelId;
            const entry = map.get(key) || { name: p.modelName, totalPaid: 0, monthsPaid: new Set<string>(), lastStatus: p.status };
            entry.totalPaid += Number(p.amount || 0);
            entry.monthsPaid.add(p.month);
            entry.lastStatus = p.status;
            map.set(key, entry);
        }
        return Array.from(map.entries()).map(([modelId, v]) => ({ modelId, ...v }));
    }, [payments]);

    const totalExpenses = useMemo(() => {
        // If you track expenses elsewhere, sum here. Placeholder 0 for now.
        return 0;
    }, [payments]);

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Comptabilité" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Comptabilité</h1>
                        <p className="admin-page-subtitle">Suivi des cotisations, inscriptions, avances et autres revenus/dépenses.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleOpenEntryModal()} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                            <PlusIcon className="w-5 h-5"/> Nouvelle Écriture
                        </button>
                        <button onClick={() => handleOpenModal()} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                            <PlusIcon className="w-5 h-5"/> Ajouter Paiement Mannequin
                        </button>
                    </div>
                </div>

                <div className="mb-6 flex items-center gap-4">
                    <label className="admin-label !mb-0">Filtrer par mois :</label>
                    <select value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="admin-input !w-auto">
                        <option value="">Tous les mois</option>
                        {uniqueMonths.map(month => <option key={month} value={month}>{month}</option>)}
                    </select>
                </div>

                <div className="admin-section-wrapper overflow-x-auto">
                    <h2 className="admin-section-title">Récapitulatif par Mannequin</h2>
                    <table className="admin-table mb-10">
                        <thead>
                            <tr>
                                <th>Mannequin</th>
                                <th>Montant total payé</th>
                                <th>Mois réglés</th>
                                <th>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {perModel.map(row => (
                                <tr key={row.modelId}>
                                    <td>
                                        <button className="text-pm-gold hover:underline" onClick={() => handleOpenModal({ id: '', modelId: row.modelId, modelName: row.name, month: new Date().toISOString().slice(0,7), amount: 0, paymentDate: new Date().toISOString().split('T')[0], method: 'Virement', status: 'En attente', notes: '' })}>
                                            {row.name}
                                        </button>
                                    </td>
                                    <td>{row.totalPaid.toLocaleString('fr-FR')} FCFA</td>
                                    <td>{Array.from(row.monthsPaid).sort().join(', ') || '-'}</td>
                                    <td><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(row.lastStatus)}`}>{row.lastStatus}</span></td>
                                </tr>
                            ))}
                            {perModel.length === 0 && (
                                <tr><td colSpan={4} className="text-center text-pm-off-white/60">Aucune donnée</td></tr>
                            )}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 bg-black border border-pm-gold/10 rounded">
                            <p className="text-sm text-pm-off-white/60">Total payé</p>
                            <p className="text-2xl text-pm-gold font-bold">{payments.reduce((s, p) => s + (p.amount || 0), 0).toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <div className="p-4 bg-black border border-pm-gold/10 rounded">
                            <p className="text-sm text-pm-off-white/60">Dépenses</p>
                            <p className="text-2xl text-pm-gold font-bold">{totalExpenses.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                        <div className="p-4 bg-black border border-pm-gold/10 rounded">
                            <p className="text-sm text-pm-off-white/60">Mois couverts</p>
                            <p className="text-2xl text-pm-gold font-bold">{new Set(payments.map(p => p.month)).size}</p>
                        </div>
                    </div>

                    <h2 className="admin-section-title">Grand Livre - Écritures Générales</h2>
                    <table className="admin-table mb-10">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Catégorie</th>
                                <th>Libellé</th>
                                <th>Montant</th>
                                <th>Date/Heure</th>
                                <th>Méthode</th>
                                <th>Lié à</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map(e => (
                                <tr key={e.id}>
                                    <td>{e.kind === 'income' ? 'Revenu' : 'Dépense'}</td>
                                    <td>{e.category}</td>
                                    <td>{e.label}</td>
                                    <td className={e.kind === 'income' ? 'text-green-400' : 'text-red-400'}>
                                        {e.amount.toLocaleString('fr-FR')} FCFA
                                    </td>
                                    <td>{new Date(e.dateTime).toLocaleString('fr-FR')}</td>
                                    <td>{e.method || '-'}</td>
                                    <td>{e.relatedModelName || '-'}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenEntryModal(e)} className="text-pm-gold/70 hover:text-pm-gold p-1"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteEntry(e.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {entries.length === 0 && (
                                <tr><td colSpan={8} className="text-center text-pm-off-white/60">Aucune écriture</td></tr>
                            )}
                        </tbody>
                    </table>

                    <h2 className="admin-section-title">Paiements Mannequins</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mois</th>
                                <th>Mannequin</th>
                                <th>Montant</th>
                                <th>Nature</th>
                                <th>Date Paiement</th>
                                <th>Méthode</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.map(p => (
                                <tr key={p.id}>
                                    <td>{p.month}</td>
                                    <td>{p.modelName}</td>
                                    <td>{p.amount.toLocaleString('fr-FR')} FCFA</td>
                                    <td>{p.category || '-'}</td>
                                    <td>{new Date(p.paymentDate).toLocaleDateString('fr-FR')}</td>
                                    <td>{p.method}</td>
                                    <td><span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(p.status)}`}>{p.status}</span></td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenModal(p)} className="text-pm-gold/70 hover:text-pm-gold p-1"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredPayments.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun paiement trouvé.</p>}
                </div>
            </div>

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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                    <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                        <h2 className="text-2xl font-playfair text-pm-gold">{payment ? 'Modifier' : 'Ajouter'} un Paiement</h2>
                        <button type="button" onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                    </header>
                    <main className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Mannequin</label>
                                <select name="modelId" value={formData.modelId} onChange={handleChange} className="admin-input" required>
                                    <option value="">Sélectionner...</option>
                                    {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="admin-label">Mois Concerné</label>
                                <input type="month" name="month" value={formData.month} onChange={handleChange} className="admin-input" required/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Montant (FCFA)</label>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="admin-input" required/>
                            </div>
                            <div>
                                <label className="admin-label">Date de Paiement</label>
                                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="admin-input" required/>
                            </div>
                         </div>
                         <div>
                            <label className="admin-label">Nature du Paiement</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                                <option>Cotisation mensuelle</option>
                                <option>Frais d'inscription</option>
                                <option>Cotisation + Inscription</option>
                                <option>Avance cotisation</option>
                                <option>Autre</option>
                            </select>
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Méthode</label>
                                <select name="method" value={formData.method} onChange={handleChange} className="admin-input">
                                    <option>Virement</option>
                                    <option>Espèces</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                             <div>
                                <label className="admin-label">Statut</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="admin-input">
                                    <option>En attente</option>
                                    <option>Payé</option>
                                    <option>En retard</option>
                                </select>
                            </div>
                         </div>
                         <div>
                            <label className="admin-label">Notes</label>
                            <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="admin-textarea"/>
                         </div>
                    </main>
                    <footer className="p-4 flex justify-end gap-4 border-t border-pm-gold/20">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold uppercase tracking-wider">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">
                            Sauvegarder
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
};

export default AdminPayments;

// ===== Entry Modal =====
const EntryModal: React.FC<{ entry: AccountingEntry | null; models: Model[]; onClose: () => void; onSave: (e: AccountingEntry) => void; }> = ({ entry, models, onClose, onSave }) => {
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
        if (!form.label || !form.category) { alert('Veuillez renseigner le libellé et la catégorie.'); return; }
        onSave(form);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-pm-dark border border-pm-gold/30 rounded-lg shadow-2xl w-full max-w-lg">
                <form onSubmit={submit}>
                    <header className="p-4 flex justify-between items-center border-b border-pm-gold/20">
                        <h2 className="text-2xl font-playfair text-pm-gold">{entry ? 'Modifier' : 'Nouvelle'} Écriture</h2>
                        <button type="button" onClick={onClose} className="text-pm-off-white/70 hover:text-white"><XMarkIcon className="w-6 h-6"/></button>
                    </header>
                    <main className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Type</label>
                                <select name="kind" value={form.kind} onChange={handleChange} className="admin-input">
                                    <option value="income">Revenu</option>
                                    <option value="expense">Dépense</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Catégorie</label>
                                <input name="category" value={form.category} onChange={handleChange} className="admin-input" placeholder="Commission, Collaboration, Autre..."/>
                            </div>
                        </div>
                        <div>
                            <label className="admin-label">Libellé</label>
                            <input name="label" value={form.label} onChange={handleChange} className="admin-input" placeholder="Description courte"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Montant (FCFA)</label>
                                <input type="number" name="amount" value={form.amount} onChange={handleChange} className="admin-input"/>
                            </div>
                            <div>
                                <label className="admin-label">Date/Heure</label>
                                <input type="datetime-local" name="dateTime" value={form.dateTime.slice(0,16)} onChange={handleChange} className="admin-input"/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Méthode</label>
                                <select name="method" value={form.method} onChange={handleChange} className="admin-input">
                                    <option>Virement</option>
                                    <option>Espèces</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Mannequin lié (optionnel)</label>
                                <select value={form.relatedModelId || ''} onChange={handleRelatedModel} className="admin-input">
                                    <option value="">Aucun</option>
                                    {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="admin-label">Notes</label>
                            <textarea name="notes" value={form.notes || ''} onChange={handleChange} rows={3} className="admin-textarea"/>
                        </div>
                    </main>
                    <footer className="p-4 flex justify-end gap-4 border-t border-pm-gold/20">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold uppercase tracking-wider">Annuler</button>
                        <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">Sauvegarder</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};