import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { 
    PlusIcon, 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

interface MonthlyPayment {
    id: string;
    modelId: string;
    modelName: string;
    month: string; // Format: YYYY-MM
    amount: number;
    method: string; // "Espèces", "Mobile Money", "Virement bancaire"
    paymentDate: string; // Format: YYYY-MM-DD
    status: string; // "Payé", "Partiel", "Impayé"
    notes?: string;
}

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'ajour' | 'paye' | 'partiel' | 'impaye'>('all');
    
    // Form state
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [paymentAmount, setPaymentAmount] = useState<string>('1500');
    const [paymentMethod, setPaymentMethod] = useState<string>('Espèces');
    const [paymentStatus, setPaymentStatus] = useState<string>('Payé');
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [paymentMonth, setPaymentMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [paymentNotes, setPaymentNotes] = useState('');

    const models = data?.models || [];
    const monthlyPayments: MonthlyPayment[] = (data as any)?.monthlyPayments || [];

    // Vérifier si un mannequin est "À jour" pour le mois en cours
    const isModelUpToDate = (modelId: string) => {
        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const currentPayment = monthlyPayments.find(p => 
            p.modelId === modelId && 
            p.month === currentMonth &&
            p.status === 'Payé'
        );
        return !!currentPayment;
    };

    // Statistiques par mannequin
    const modelPaymentStats = useMemo(() => {
        return models.map(model => {
            const payments = monthlyPayments.filter(p => p.modelId === model.id);
            const totalPaid = payments
                .filter(p => p.status === 'Payé')
                .reduce((sum, p) => sum + (p.amount || 0), 0);
            const partialPayments = payments.filter(p => p.status === 'Partiel').length;
            const unpaidPayments = payments.filter(p => p.status === 'Impayé').length;
            const isUpToDate = isModelUpToDate(model.id);
            
            return {
                modelId: model.id,
                modelName: model.name,
                totalPaid,
                partialPayments,
                unpaidPayments,
                isUpToDate,
                paymentsCount: payments.length,
                lastPayment: payments.length > 0 
                    ? payments.sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())[0]
                    : null
            };
        });
    }, [models, monthlyPayments]);

    // Filtrage
    const filteredStats = modelPaymentStats.filter(stat => {
        const matchesSearch = stat.modelName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = 
            filterStatus === 'all' ? true :
            filterStatus === 'ajour' ? stat.isUpToDate :
            filterStatus === 'paye' ? stat.unpaidPayments === 0 && stat.partialPayments === 0 :
            filterStatus === 'partiel' ? stat.partialPayments > 0 :
            filterStatus === 'impaye' ? stat.unpaidPayments > 0 : true;
        
        return matchesSearch && matchesStatus;
    });

    const handleAddPayment = async () => {
        if (!selectedModel || !data || !paymentAmount) return;

        const model = models.find(m => m.id === selectedModel);
        if (!model) return;

        const amount = parseFloat(paymentAmount);
        
        const newPayment: MonthlyPayment = {
            id: `payment-${Date.now()}`,
            modelId: model.id,
            modelName: model.name,
            month: paymentMonth,
            amount: amount,
            method: paymentMethod,
            paymentDate: paymentDate,
            status: paymentStatus,
            notes: paymentNotes
        };

        // Créer aussi une transaction comptable
        const subcategory = amount === 15000 ? 'Frais d\'inscription' :
                           amount === 16500 ? 'Cotisations + Inscriptions' :
                           amount === 1500 ? 'Cotisations mensuelles' :
                           'Paiements en avance';

        const description = amount === 15000 ? `Inscription - ${model.name}` :
                           amount === 16500 ? `Cotisation + Inscription - ${model.name}` :
                           amount === 1500 ? `Cotisation mensuelle - ${model.name}` :
                           `Paiement ${paymentStatus.toLowerCase()} - ${model.name}`;

        const newTransaction = {
            id: `migration-${model.id}-${Date.now()}`,
            date: paymentDate,
            category: 'revenue',
            subcategory: subcategory,
            description: description,
            amount: amount,
            currency: 'FCFA',
            paymentMethod: paymentMethod === 'Espèces' ? 'cash' : 
                          paymentMethod === 'Mobile Money' ? 'mobile_money' : 
                          'bank_transfer',
            reference: `${subcategory.toUpperCase().replace(/\s/g, '-')}-${model.name.replace(/\s/g, ' ')}-2025`,
            notes: paymentNotes || `Paiement ${paymentStatus.toLowerCase()} pour ${model.name} (Migration)`,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            relatedModelId: model.id,
            relatedModelName: model.name
        };

        const updatedPayments = [...monthlyPayments, newPayment];
        const updatedTransactions = [...(data.accountingTransactions || []), newTransaction];

        await saveData({ 
            ...data, 
            monthlyPayments: updatedPayments,
            accountingTransactions: updatedTransactions
        });

        // Reset form
        resetForm();
        setIsAdding(false);
    };

    const handleEditPayment = async () => {
        if (!editingPayment || !data || !paymentAmount) return;

        const amount = parseFloat(paymentAmount);
        
        const updatedPayment: MonthlyPayment = {
            ...editingPayment,
            amount: amount,
            method: paymentMethod,
            paymentDate: paymentDate,
            month: paymentMonth,
            status: paymentStatus,
            notes: paymentNotes
        };

        const updatedPayments = monthlyPayments.map(p => 
            p.id === editingPayment.id ? updatedPayment : p
        );

        await saveData({ ...data, monthlyPayments: updatedPayments });

        resetForm();
        setEditingPayment(null);
    };

    const handleDeletePayment = async (paymentId: string) => {
        if (!data || !confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) return;

        const updatedPayments = monthlyPayments.filter(p => p.id !== paymentId);
        await saveData({ ...data, monthlyPayments: updatedPayments });
    };

    const startEdit = (payment: MonthlyPayment) => {
        setEditingPayment(payment);
        setSelectedModel(payment.modelId);
        setPaymentAmount(payment.amount.toString());
        setPaymentMethod(payment.method);
        setPaymentDate(payment.paymentDate);
        setPaymentMonth(payment.month);
        setPaymentStatus(payment.status);
        setPaymentNotes(payment.notes || '');
        setIsAdding(false);
    };

    const resetForm = () => {
        setSelectedModel('');
        setPaymentAmount('1500');
        setPaymentMethod('Espèces');
        setPaymentStatus('Payé');
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMonth(new Date().toISOString().slice(0, 7));
        setPaymentNotes('');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    if (isAdding || editingPayment) {
        return (
            <AdminLayout>
                <AdminPageHeader 
                    title={editingPayment ? "Modifier un Paiement" : "Enregistrer un Paiement"}
                    subtitle="Cotisation mensuelle (1 500 FCFA), inscription (15 000 FCFA) ou paiement partiel"
                />

                <AdminSection title="Informations du Paiement">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                Mannequin *
                            </label>
                            <select
                                value={selectedModel}
                                onChange={e => setSelectedModel(e.target.value)}
                                disabled={!!editingPayment}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none disabled:opacity-50"
                                required
                            >
                                <option value="">Sélectionner un mannequin</option>
                                {models.map(model => (
                                    <option key={model.id} value={model.id}>
                                        {model.name} {isModelUpToDate(model.id) ? '✓ À jour' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Montant (FCFA) *
                                </label>
                                <select
                                    value={paymentAmount}
                                    onChange={e => setPaymentAmount(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="1500">1 500 FCFA (Cotisation)</option>
                                    <option value="15000">15 000 FCFA (Inscription)</option>
                                    <option value="16500">16 500 FCFA (Cotisation + Inscription)</option>
                                    <option value="custom">Montant personnalisé</option>
                                </select>
                            </div>

                            {paymentAmount === 'custom' && (
                                <div>
                                    <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                        Montant personnalisé *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        onChange={e => setPaymentAmount(e.target.value)}
                                        placeholder="Entrer le montant"
                                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Méthode de Paiement *
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="Espèces">Espèces</option>
                                    <option value="Mobile Money">Mobile Money</option>
                                    <option value="Virement bancaire">Virement bancaire</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Date de Paiement *
                                </label>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={e => setPaymentDate(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Mois *
                                </label>
                                <input
                                    type="month"
                                    value={paymentMonth}
                                    onChange={e => setPaymentMonth(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Statut *
                                </label>
                                <select
                                    value={paymentStatus}
                                    onChange={e => setPaymentStatus(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="Payé">Payé</option>
                                    <option value="Partiel">Partiel</option>
                                    <option value="Impayé">Impayé</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                Notes (optionnel)
                            </label>
                            <textarea
                                value={paymentNotes}
                                onChange={e => setPaymentNotes(e.target.value)}
                                rows={3}
                                placeholder="Informations supplémentaires..."
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>

                        {/* Résumé */}
                        {selectedModel && paymentAmount !== 'custom' && (
                            <div className="bg-pm-gold/10 border border-pm-gold/30 rounded-lg p-4">
                                <h4 className="text-pm-gold font-bold mb-3">Résumé du Paiement</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Mannequin:</span>
                                        <span className="text-pm-off-white font-semibold">
                                            {models.find(m => m.id === selectedModel)?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Montant:</span>
                                        <span className="text-pm-gold font-bold">
                                            {formatCurrency(parseFloat(paymentAmount))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Méthode:</span>
                                        <span className="text-pm-off-white">{paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Statut:</span>
                                        <span className={`font-semibold ${
                                            paymentStatus === 'Payé' ? 'text-green-400' :
                                            paymentStatus === 'Partiel' ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                            {paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </AdminSection>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={editingPayment ? handleEditPayment : handleAddPayment}
                        disabled={!selectedModel || !paymentAmount || paymentAmount === 'custom'}
                        className="px-6 py-3 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {editingPayment ? 'Modifier' : 'Enregistrer'}
                    </button>
                    <button
                        onClick={() => {
                            setIsAdding(false);
                            setEditingPayment(null);
                            resetForm();
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
                title="Paiements Mannequins"
                subtitle="Gestion des cotisations mensuelles (1 500 FCFA) et inscriptions (15 000 FCFA)"
                action={
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Enregistrer un Paiement
                    </button>
                }
            />

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Mannequins À Jour</p>
                            <p className="text-2xl font-bold text-green-400">
                                {modelPaymentStats.filter(s => s.isUpToDate).length}
                            </p>
                        </div>
                        <CheckCircleIcon className="w-12 h-12 text-green-400/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">En Retard</p>
                            <p className="text-2xl font-bold text-red-400">
                                {modelPaymentStats.filter(s => !s.isUpToDate).length}
                            </p>
                        </div>
                        <ExclamationCircleIcon className="w-12 h-12 text-red-400/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Total Encaissé</p>
                            <p className="text-2xl font-bold text-pm-gold">
                                {formatCurrency(modelPaymentStats.reduce((sum, s) => sum + s.totalPaid, 0))}
                            </p>
                        </div>
                        <CurrencyDollarIcon className="w-12 h-12 text-pm-gold/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Total Paiements</p>
                            <p className="text-2xl font-bold text-pm-off-white">
                                {monthlyPayments.length}
                            </p>
                        </div>
                        <ClockIcon className="w-12 h-12 text-pm-off-white/30" />
                    </div>
                </AdminCard>
            </div>

            {/* Recherche et filtres */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-pm-off-white/60 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Rechercher un mannequin..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-pm-dark border border-pm-gold/20 rounded pl-10 pr-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {(['all', 'ajour', 'paye', 'partiel', 'impaye'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                                filterStatus === status
                                    ? 'bg-pm-gold text-black'
                                    : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
                            }`}
                        >
                            {status === 'all' ? 'Tous' : 
                             status === 'ajour' ? 'À jour' :
                             status === 'paye' ? 'Tout payé' :
                             status === 'partiel' ? 'Paiement partiel' :
                             'Impayé'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Liste des mannequins avec statut */}
            <AdminSection title={`Mannequins (${filteredStats.length})`}>
                <div className="space-y-4">
                    {filteredStats.map(stat => {
                        const modelPayments = monthlyPayments
                            .filter(p => p.modelId === stat.modelId)
                            .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

                        return (
                            <AdminCard key={stat.modelId}>
                                <div className="space-y-4">
                                    {/* En-tête mannequin */}
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            stat.isUpToDate ? 'bg-green-600/20' : 'bg-red-600/20'
                                        }`}>
                                            {stat.isUpToDate ? (
                                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <ExclamationCircleIcon className="w-6 h-6 text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold text-pm-off-white mb-1">
                                                {stat.modelName}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    stat.isUpToDate 
                                                        ? 'bg-green-600/20 text-green-400' 
                                                        : 'bg-red-600/20 text-red-400'
                                                }`}>
                                                    {stat.isUpToDate ? '✓ À jour' : '⚠ En retard'}
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-pm-gold/20 text-pm-gold">
                                                    {stat.paymentsCount} paiement{stat.paymentsCount > 1 ? 's' : ''}
                                                </span>
                                                {stat.lastPayment && (
                                                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-600/20 text-blue-400">
                                                        Dernier: {new Date(stat.lastPayment.paymentDate).toLocaleDateString('fr-FR')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-pm-off-white/80">
                                                <span className="text-green-400 font-bold">{formatCurrency(stat.totalPaid)}</span> encaissé
                                                {stat.partialPayments > 0 && (
                                                    <span className="ml-3 text-yellow-400">• {stat.partialPayments} partiel</span>
                                                )}
                                                {stat.unpaidPayments > 0 && (
                                                    <span className="ml-3 text-red-400">• {stat.unpaidPayments} impayé</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Historique des paiements */}
                                    {modelPayments.length > 0 && (
                                        <div className="border-t border-pm-gold/10 pt-4">
                                            <h4 className="text-sm font-semibold text-pm-off-white/70 mb-3">Historique des paiements</h4>
                                            <div className="space-y-2">
                                                {modelPayments.slice(0, 5).map(payment => (
                                                    <div key={payment.id} className="flex items-center justify-between bg-pm-dark/30 p-3 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-pm-off-white font-semibold">
                                                                    {formatCurrency(payment.amount)}
                                                                </span>
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                    payment.status === 'Payé' ? 'bg-green-600/20 text-green-400' :
                                                                    payment.status === 'Partiel' ? 'bg-yellow-600/20 text-yellow-400' :
                                                                    'bg-red-600/20 text-red-400'
                                                                }`}>
                                                                    {payment.status}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-pm-off-white/60">
                                                                {new Date(payment.paymentDate).toLocaleDateString('fr-FR')} • {payment.method} • Mois: {payment.month}
                                                            </div>
                                                            {payment.notes && (
                                                                <div className="text-xs text-pm-off-white/50 mt-1">{payment.notes}</div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEdit(payment)}
                                                                className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePayment(payment.id)}
                                                                className="p-2 text-red-400 hover:bg-red-600/10 rounded transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {modelPayments.length > 5 && (
                                                    <p className="text-xs text-pm-off-white/60 text-center pt-2">
                                                        Et {modelPayments.length - 5} autre{modelPayments.length - 5 > 1 ? 's' : ''} paiement{modelPayments.length - 5 > 1 ? 's' : ''}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </AdminCard>
                        );
                    })}
                </div>

                {filteredStats.length === 0 && (
                    <div className="text-center py-12">
                        <CurrencyDollarIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                        <p className="text-pm-off-white/60">Aucun mannequin trouvé</p>
                    </div>
                )}
            </AdminSection>
        </AdminLayout>
    );
};

export default AdminPayments;
