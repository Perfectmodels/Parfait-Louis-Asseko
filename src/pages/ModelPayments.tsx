import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    ClockIcon,
    ExclamationTriangleIcon,
    DocumentArrowUpIcon,
    EyeIcon
} from '@heroicons/react/24/outline';
import { PaymentSubmission, Model } from '../types';

const ModelPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [currentUser] = useState(() => {
        const userData = localStorage.getItem('pmm_user');
        return userData ? JSON.parse(userData) : null;
    });
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        type: 'cotisation' as 'cotisation' | 'inscription',
        paymentMethod: 'mobile_money' as 'mobile_money' | 'bank_transfer' | 'cash',
        proofImage: '',
        notes: ''
    });

    const model = data?.models.find(m => m.id === currentUser?.id);
    const userPayments = data?.paymentSubmissions?.filter(p => p.userId === currentUser?.id) || [];

    const handleSubmitPayment = async () => {
        if (!data || !currentUser || !paymentForm.amount || !paymentForm.proofImage) return;

        setIsSubmittingPayment(true);

        const newPayment: PaymentSubmission = {
            id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: currentUser.id,
            userName: currentUser.name,
            amount: parseFloat(paymentForm.amount),
            type: paymentForm.type,
            paymentMethod: paymentForm.paymentMethod,
            proofImage: paymentForm.proofImage,
            notes: paymentForm.notes,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            reviewedAt: null,
            reviewedBy: null
        };

        const updatedPayments = [...(data.paymentSubmissions || []), newPayment];
        await saveData({ ...data, paymentSubmissions: updatedPayments });

        // Reset form
        setPaymentForm({
            amount: '',
            type: 'cotisation',
            paymentMethod: 'mobile_money',
            proofImage: '',
            notes: ''
        });

        setIsSubmittingPayment(false);
        alert('Paiement soumis avec succès ! Il sera vérifié par l\'administration.');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'text-green-400 bg-green-500/20 border-green-500/30';
            case 'rejected':
                return 'text-red-400 bg-red-500/20 border-red-500/30';
            case 'pending':
                return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            default:
                return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="w-5 h-5" />;
            case 'rejected':
                return <ExclamationTriangleIcon className="w-5 h-5" />;
            case 'pending':
                return <ClockIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'approved':
                return 'Approuvé';
            case 'rejected':
                return 'Rejeté';
            case 'pending':
                return 'En attente';
            default:
                return 'Inconnu';
        }
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black flex items-center justify-center">
                <div className="text-center text-pm-off-white/70">
                    <CurrencyDollarIcon className="w-16 h-16 mx-auto mb-4 text-pm-gold/50" />
                    <h2 className="text-xl font-playfair text-pm-gold mb-2">
                        Accès non autorisé
                    </h2>
                    <p>Vous devez être connecté pour accéder à cette page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-pm-dark to-black">
            <SEO title="Mes Paiements - Perfect Models Management" />
            
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-playfair text-pm-gold mb-4">
                        Mes Paiements
                    </h1>
                    <p className="text-pm-off-white/70">
                        Gérez vos paiements et justificatifs
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Formulaire de Soumission */}
                    <div className="lg:col-span-1">
                        <div className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6 sticky top-6">
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">
                                Soumettre un Paiement
                            </h2>
                            
                            <form onSubmit={(e) => { e.preventDefault(); handleSubmitPayment(); }} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">
                                        Type de Paiement
                                    </label>
                                    <select
                                        value={paymentForm.type}
                                        onChange={(e) => setPaymentForm(prev => ({ 
                                            ...prev, 
                                            type: e.target.value as 'cotisation' | 'inscription',
                                            amount: e.target.value === 'cotisation' ? '1500' : '15000'
                                        }))}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                    >
                                        <option value="cotisation">Cotisation (1,500 FCFA)</option>
                                        <option value="inscription">Inscription (15,000 FCFA)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">
                                        Montant (FCFA)
                                    </label>
                                    <input
                                        type="number"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        placeholder="1500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">
                                        Méthode de Paiement
                                    </label>
                                    <select
                                        value={paymentForm.paymentMethod}
                                        onChange={(e) => setPaymentForm(prev => ({ 
                                            ...prev, 
                                            paymentMethod: e.target.value as 'mobile_money' | 'bank_transfer' | 'cash'
                                        }))}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                    >
                                        <option value="mobile_money">Mobile Money</option>
                                        <option value="bank_transfer">Virement Bancaire</option>
                                        <option value="cash">Espèces</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">
                                        Preuve de Paiement (URL)
                                    </label>
                                    <input
                                        type="url"
                                        value={paymentForm.proofImage}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, proofImage: e.target.value }))}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        placeholder="https://example.com/proof.jpg"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">
                                        Notes (optionnel)
                                    </label>
                                    <textarea
                                        value={paymentForm.notes}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50"
                                        rows={3}
                                        placeholder="Informations supplémentaires..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmittingPayment || !paymentForm.amount || !paymentForm.proofImage}
                                    className="w-full px-6 py-3 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmittingPayment ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Soumission...
                                        </>
                                    ) : (
                                        <>
                                            <DocumentArrowUpIcon className="w-5 h-5" />
                                            Soumettre le Paiement
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Historique des Paiements */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/50 border border-pm-gold/20 rounded-2xl p-6">
                            <h2 className="text-2xl font-playfair text-pm-gold mb-6">
                                Historique des Paiements
                            </h2>

                            {userPayments.length === 0 ? (
                                <div className="text-center py-12">
                                    <CurrencyDollarIcon className="w-16 h-16 mx-auto mb-4 text-pm-gold/50" />
                                    <p className="text-pm-off-white/70">Aucun paiement soumis</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {userPayments
                                        .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                                        .map((payment) => (
                                        <div key={payment.id} className="bg-pm-off-white/5 border border-pm-gold/20 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <CurrencyDollarIcon className="w-6 h-6 text-pm-gold" />
                                                    <div>
                                                        <h3 className="font-semibold text-pm-off-white">
                                                            {payment.type === 'cotisation' ? 'Cotisation' : 'Inscription'}
                                                        </h3>
                                                        <p className="text-sm text-pm-off-white/60">
                                                            {new Date(payment.submittedAt).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(payment.status)}`}>
                                                    {getStatusIcon(payment.status)}
                                                    <span className="text-sm font-medium">
                                                        {getStatusText(payment.status)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <span className="text-sm text-pm-off-white/60">Montant:</span>
                                                    <p className="font-semibold text-pm-gold">
                                                        {payment.amount.toLocaleString()} FCFA
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-pm-off-white/60">Méthode:</span>
                                                    <p className="font-semibold text-pm-off-white">
                                                        {payment.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                                                         payment.paymentMethod === 'bank_transfer' ? 'Virement' : 'Espèces'}
                                                    </p>
                                                </div>
                                            </div>

                                            {payment.notes && (
                                                <div className="mb-3">
                                                    <span className="text-sm text-pm-off-white/60">Notes:</span>
                                                    <p className="text-pm-off-white/80">{payment.notes}</p>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <button
                                                    onClick={() => window.open(payment.proofImage, '_blank')}
                                                    className="flex items-center gap-2 px-3 py-1 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors duration-200"
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    Voir la preuve
                                                </button>
                                                {payment.status === 'rejected' && payment.reviewedAt && (
                                                    <span className="text-sm text-red-400">
                                                        Rejeté le {new Date(payment.reviewedAt).toLocaleDateString('fr-FR')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelPayments;
