import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { MonthlyPayment, Model, BeginnerStudent } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);
    const [monthFilter, setMonthFilter] = useState<string>(new Date().toISOString().slice(0, 7));

    const payments = useMemo(() => {
        return [...(data?.monthlyPayments || [])].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    }, [data?.monthlyPayments]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const beginners = useMemo(() => {
        return [...(data?.beginnerStudents || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.beginnerStudents]);

    const entities = useMemo(() => {
        return [
            ...models.map(m => ({ id: m.id, name: m.name })),
            ...beginners.map(b => ({ id: b.id, name: b.name }))
        ].sort((a,b) => a.name.localeCompare(b.name));
    }, [models, beginners]);

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

        let updatedPayments: MonthlyPayment[];
        const isEditingExisting = Boolean(editingPayment && editingPayment.id);

        if (isEditingExisting) {
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

const handleSaveMany = async (paymentDataList: MonthlyPayment[]) => {
        if (!data) return;
        const withIds = paymentDataList.map(pd => ({ ...pd, id: pd.id && pd.id !== '' ? pd.id : `payment-${Date.now()}-${Math.random().toString(36).slice(2,7)}` }));
        const updatedPayments = [...payments, ...withIds];
        try {
            await saveData({ ...data, monthlyPayments: updatedPayments });
            setIsModalOpen(false);
            setEditingPayment(null);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde multiple:', error);
            alert("Impossible de sauvegarder les paiements.");
        }
    };
    
    const getStatusColor = (status: MonthlyPayment['status']) => {
        switch (status) {
            case 'Payé': return 'bg-green-500/20 text-green-300';
            case 'En attente': return 'bg-yellow-500/20 text-yellow-300';
            case 'En retard': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const getMonthlyPaymentFor = (modelId: string, month: string) =>
        payments.find(p => p.modelId === modelId && p.month === month && p.amount >= 1500 && p.amount < 15000);

    const getRegistrationPaymentFor = (modelId: string) =>
        payments.find(p => p.modelId === modelId && p.amount >= 15000);

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
                        <h1 className="admin-page-title">Comptabilité des Mannequins</h1>
                        <p className="admin-page-subtitle">Cotisations (1 500 FCFA / mois) et Inscriptions (15 000 FCFA). Tous les mannequins sont listés ci‑dessous.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> Ajouter un Paiement
                    </button>
                </div>

                {/* Cotisations mensuelles */}
                <section className="admin-section-wrapper overflow-x-auto mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="admin-section-title !mb-0">Cotisations mensuelles (1 500 FCFA)</h2>
                        <div className="flex items-center gap-2">
                            <label className="admin-label !mb-0">Mois :</label>
                            <input type="month" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="admin-input !w-auto" />
                        </div>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mannequin</th>
                                <th>Mois</th>
                                <th>Statut</th>
                                <th>Montant</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {models.map(m => {
                                const pay = getMonthlyPaymentFor(m.id, monthFilter);
                                return (
                                  <tr key={m.id}>
                                    <td>{m.name}</td>
                                    <td>{monthFilter}</td>
                                    <td>
                                      {pay ? (
                                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(pay.status)}`}>{pay.status}</span>
                                      ) : (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-300">Non payé</span>
                                      )}
                                    </td>
                                    <td>{pay ? `${pay.amount.toLocaleString('fr-FR')} FCFA` : '—'}</td>
                                    <td>{pay ? new Date(pay.paymentDate).toLocaleDateString('fr-FR') : '—'}</td>
                                    <td>
                                        <button onClick={() => handleOpenModal(pay || { id: '', modelId: m.id, modelName: m.name, month: monthFilter, amount: 1500, paymentDate: new Date().toISOString().split('T')[0], method: 'Espèces', status: 'En attente', notes: '' } as any)} className="text-pm-gold/70 hover:text-pm-gold p-1">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                  </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>

                {/* Débutants — Inscriptions & Cotisations */}
                <section className="admin-section-wrapper overflow-x-auto mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <h2 className="admin-section-title !mb-0">Débutants — Inscriptions & Cotisations</h2>
                        <div className="flex items-center gap-2">
                            <label className="admin-label !mb-0">Mois :</label>
                            <input type="month" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} className="admin-input !w-auto" />
                        </div>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Débutant</th>
                                <th>Inscription</th>
                                <th>Cotisation ({monthFilter})</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {beginners.map(b => {
                                const reg = getRegistrationPaymentFor(b.id);
                                const pay = getMonthlyPaymentFor(b.id, monthFilter);
                                return (
                                  <tr key={b.id}>
                                    <td>{b.name}</td>
                                    <td>
                                      {reg ? (
                                        <div className="space-x-2">
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(reg.status)}`}>{reg.status}</span>
                                          <span className="text-xs text-pm-off-white/70">{reg.amount.toLocaleString('fr-FR')} FCFA · {new Date(reg.paymentDate).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                      ) : (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-300">Non payé</span>
                                      )}
                                    </td>
                                    <td>
                                      {pay ? (
                                        <div className="space-x-2">
                                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(pay.status)}`}>{pay.status}</span>
                                          <span className="text-xs text-pm-off-white/70">{pay.amount.toLocaleString('fr-FR')} FCFA · {new Date(pay.paymentDate).toLocaleDateString('fr-FR')}</span>
                                        </div>
                                      ) : (
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-300">Non payé</span>
                                      )}
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenModal({ id: '', modelId: b.id, modelName: b.name, month: monthFilter, amount: 0, paymentDate: new Date().toISOString().split('T')[0], method: 'Espèces', status: 'En attente', notes: '' } as any)} className="text-pm-gold/70 hover:text-pm-gold p-1" title="Saisir paiement">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>

                {/* Dépenses */}
                <section className="admin-section-wrapper overflow-x-auto mb-8">
                    <h2 className="admin-section-title">Dépenses (Loyer, Séances Photos, Déplacements, Salaires)</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Catégorie</th>
                                <th>Montant</th>
                                <th>Date</th>
                                <th>Notes</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.filter(p => p.modelId.startsWith('expense:')).map(exp => (
                                <tr key={exp.id}>
                                    <td>{exp.modelName.replace('DEPENSE: ','')}</td>
                                    <td>{exp.amount.toLocaleString('fr-FR')} FCFA</td>
                                    <td>{new Date(exp.paymentDate).toLocaleDateString('fr-FR')}</td>
                                    <td>{exp.notes || '—'}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleOpenModal(exp)} className="text-pm-gold/70 hover:text-pm-gold p-1"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(exp.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        <button onClick={() => handleOpenModal({ id: '', modelId: 'expense:Loyer', modelName: 'DEPENSE: Loyer', month: monthFilter, amount: 0, paymentDate: new Date().toISOString().split('T')[0], method: 'Espèces', status: 'En attente', notes: '' } as any)} className="action-btn !px-4 !py-2">Ajouter une dépense</button>
                    </div>
                </section>

                {/* Historique des paiements */}
                <div className="admin-section-wrapper overflow-x-auto">
                    <h2 className="admin-section-title">Historique</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mois</th>
                                <th>Mannequin</th>
                                <th>Montant</th>
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
                    entities={entities}
                    onClose={() => { setIsModalOpen(false); setEditingPayment(null); }}
                    onSave={handleSave}
                    onSaveMany={handleSaveMany}
                />
            )}
        </div>
    );
};

interface PaymentModalProps {
    payment: MonthlyPayment | null;
    entities: { id: string; name: string; }[];
    onClose: () => void;
    onSave: (payment: MonthlyPayment) => void;
    onSaveMany?: (payments: MonthlyPayment[]) => void;
}
const PaymentModal: React.FC<PaymentModalProps> = ({ payment, entities, onClose, onSave, onSaveMany }) => {
    const [formData, setFormData] = useState<Omit<MonthlyPayment, 'id' | 'modelName'>>({
        modelId: payment?.modelId || '',
        month: payment?.month || new Date().toISOString().slice(0, 7),
        amount: payment?.amount || 0,
        paymentDate: payment?.paymentDate || new Date().toISOString().split('T')[0],
        method: payment?.method || 'Virement',
        status: payment?.status || 'En attente',
        notes: payment?.notes || ''
    });
    const [isRegistration, setIsRegistration] = useState<boolean>(!!(payment && payment.amount >= 15000));
    const [isSubscription, setIsSubscription] = useState<boolean>(!!(payment && payment.amount >= 1500 && payment.amount < 15000));
    
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
        if (formData.modelId.startsWith('expense:')) {
            const label = formData.modelId.replace('expense:','');
            onSave({ ...formData, id: payment?.id || '', modelName: `DEPENSE: ${label}` });
            return;
        }
        const ent = entities.find(e => e.id === formData.modelId);
        if (!ent) {
            alert("Le mannequin sélectionné est invalide.");
            return;
        }
        if (onSaveMany && !payment?.id && isRegistration && isSubscription) {
            const base = { ...formData } as MonthlyPayment;
            const reg: MonthlyPayment = { ...base, amount: 15000, id: '', modelName: ent.name };
            const sub: MonthlyPayment = { ...base, amount: 1500, id: '', modelName: ent.name };
            onSaveMany([reg, sub]);
            return;
        }
        onSave({ ...formData, id: payment?.id || '', modelName: ent.name });
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
                                <label className="admin-label">Bénéficiaire / Catégorie</label>
                                <select name="modelId" value={formData.modelId} onChange={handleChange} className="admin-input" required>
                                    <option value="">Sélectionner...</option>
                                    {/* Dépenses */}
                                    <optgroup label="Dépenses">
                                        <option value="expense:Loyer">Loyer</option>
                                        <option value="expense:Séances Photos">Séances Photos</option>
                                        <option value="expense:Déplacements">Déplacements</option>
                                        <option value="expense:Salaires">Salaires</option>
                                    </optgroup>
                                    <optgroup label="Mannequins">
                                        {entities.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                    </optgroup>
                                </select>
                            </div>
                             <div>
                                <label className="admin-label">Mois Concerné</label>
                                <input type="month" name="month" value={formData.month} onChange={handleChange} className="admin-input" required/>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="admin-label">Type & Montant</label>
                                <div className="flex items-center gap-4 mb-2">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" className="accent-pm-gold" checked={isSubscription} onChange={(e) => { setIsSubscription(e.target.checked); if (e.target.checked && !isRegistration) setFormData(prev => ({ ...prev, amount: 1500 })); }} />
                                        Cotisation (1 500)
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input type="checkbox" className="accent-pm-gold" checked={isRegistration} onChange={(e) => { setIsRegistration(e.target.checked); if (e.target.checked && !isSubscription) setFormData(prev => ({ ...prev, amount: 15000 })); }} />
                                        Inscription (15 000)
                                    </label>
                                </div>
                                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="admin-input" required/>
                                <div className="flex gap-2 mt-2 text-xs">
                                    <button type="button" onClick={() => { setIsSubscription(true); setIsRegistration(false); setFormData(prev => ({ ...prev, amount: 1500 })); }} className="px-2 py-1 border border-pm-gold/40 rounded-full hover:border-pm-gold">Cotisation 1 500</button>
                                    <button type="button" onClick={() => { setIsRegistration(true); setIsSubscription(false); setFormData(prev => ({ ...prev, amount: 15000 })); }} className="px-2 py-1 border border-pm-gold/40 rounded-full hover:border-pm-gold">Inscription 15 000</button>
                                </div>
                            </div>
                            <div>
                                <label className="admin-label">Date de Paiement</label>
                                <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} className="admin-input" required/>
                            </div>
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