
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { MonthlyPayment } from '../../types';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [newPayment, setNewPayment] = useState({
        modelId: '',
        month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
        amount: 0,
        paymentDate: new Date().toISOString().split('T')[0],
        method: 'Virement' as MonthlyPayment['method'],
        status: 'En attente' as MonthlyPayment['status'],
        notes: ''
    });

    const payments = useMemo(() => {
        return [...(data?.monthlyPayments || [])].sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    }, [data?.monthlyPayments]);

    const models = useMemo(() => {
        return [...(data?.models || [])].sort((a, b) => a.name.localeCompare(b.name));
    }, [data?.models]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewPayment(prev => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !newPayment.modelId || !newPayment.month || newPayment.amount <= 0) {
            alert("Veuillez remplir tous les champs requis.");
            return;
        }

        const model = models.find(m => m.id === newPayment.modelId);
        if (!model) {
            alert("Mannequin non trouvé.");
            return;
        }

        const paymentData: MonthlyPayment = {
            ...newPayment,
            id: `${newPayment.modelId}-${newPayment.month}`,
            modelName: model.name,
        };

        const existingPaymentIndex = (data.monthlyPayments || []).findIndex(p => p.id === paymentData.id);
        let updatedPayments;

        if (existingPaymentIndex > -1) {
            updatedPayments = [...data.monthlyPayments];
            updatedPayments[existingPaymentIndex] = paymentData;
        } else {
            updatedPayments = [...(data.monthlyPayments || []), paymentData];
        }

        try {
            await saveData({ ...data, monthlyPayments: updatedPayments });
            setNewPayment({
                modelId: '',
                month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
                amount: 0,
                paymentDate: new Date().toISOString().split('T')[0],
                method: 'Virement',
                status: 'En attente',
                notes: ''
            });
            setIsFormVisible(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du paiement:", error);
            alert("Impossible d'ajouter le paiement.");
        }
    };

    const handleDelete = async (paymentId: string) => {
        if (window.confirm("Supprimer ce paiement ?")) {
            if (!data) return;
            const updatedPayments = payments.filter(p => p.id !== paymentId);
            await saveData({ ...data, monthlyPayments: updatedPayments });
        }
    };

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
                        <p className="admin-page-subtitle">Enregistrez et consultez les paiements des mannequins.</p>
                    </div>
                    <button onClick={() => setIsFormVisible(!isFormVisible)} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
                        <PlusIcon className="w-5 h-5"/> {isFormVisible ? 'Fermer' : 'Nouveau Paiement'}
                    </button>
                </div>

                {isFormVisible && (
                    <form onSubmit={handleSubmit} className="admin-section-wrapper mb-8 space-y-4 animate-fade-in">
                        {/* Form fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                             <div>
                                <label className="admin-label">Mannequin</label>
                                <select name="modelId" value={newPayment.modelId} onChange={handleChange} className="admin-input" required>
                                    <option value="">Sélectionner un mannequin</option>
                                    {models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Mois (AAAA-MM)</label>
                                <input type="month" name="month" value={newPayment.month} onChange={handleChange} className="admin-input" required />
                            </div>
                            <div>
                                <label className="admin-label">Date de Paiement</label>
                                <input type="date" name="paymentDate" value={newPayment.paymentDate} onChange={handleChange} className="admin-input" required />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="admin-label">Montant (XAF)</label>
                                <input type="number" name="amount" value={newPayment.amount} onChange={handleChange} className="admin-input" required />
                            </div>
                            <div>
                                <label className="admin-label">Méthode</label>
                                <select name="method" value={newPayment.method} onChange={handleChange} className="admin-input">
                                    <option>Virement</option>
                                    <option>Espèces</option>
                                    <option>Autre</option>
                                </select>
                            </div>
                             <div>
                                <label className="admin-label">Statut</label>
                                <select name="status" value={newPayment.status} onChange={handleChange} className="admin-input">
                                    <option>En attente</option>
                                    <option>Payé</option>
                                    <option>En retard</option>
                                </select>
                            </div>
                        </div>
                        <div>
                           <label className="admin-label">Notes</label>
                           <textarea name="notes" value={newPayment.notes} onChange={handleChange} rows={2} className="admin-textarea" />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">
                                Enregistrer
                            </button>
                        </div>
                    </form>
                )}

                <div className="admin-section-wrapper overflow-x-auto">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mois</th>
                                <th>Mannequin</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Date Paiement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id}>
                                    <td>{p.month}</td>
                                    <td>{p.modelName}</td>
                                    <td>{p.amount.toLocaleString('fr-FR')} XAF</td>
                                    <td>{p.status}</td>
                                    <td>{new Date(p.paymentDate).toLocaleDateString('fr-FR')}</td>
                                    <td>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-500/70 hover:text-red-500 p-1"><TrashIcon className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {payments.length === 0 && <p className="text-center p-8">Aucun paiement enregistré.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminPayments;
