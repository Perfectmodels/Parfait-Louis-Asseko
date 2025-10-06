import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminPageWrapper from '../components/AdminPageWrapper';
import AdminTable from '../components/admin/AdminTable';
import AdminModal from '../components/admin/AdminModal';
import { StatCard } from '../components/admin/AdminStats';
import AdvancedPaymentModal from '../components/admin/AdvancedPaymentModal';
import PaymentScheduleModal from '../components/admin/PaymentScheduleModal';
import { 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    XCircleIcon, 
    ClockIcon,
    EyeIcon,
    FunnelIcon,
    PlusIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { PaymentSubmission } from '../types';

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [searchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [selectedPayment, setSelectedPayment] = useState<PaymentSubmission | null>(null);
    const [showAdvancedPaymentModal, setShowAdvancedPaymentModal] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState<{id: string, name: string} | null>(null);

    const payments = useMemo(() => {
        return [...(data?.paymentSubmissions || [])].sort((a, b) => 
            new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        );
    }, [data?.paymentSubmissions]);

    const filteredPayments = useMemo(() => {
        return payments.filter(payment => {
            const matchesSearch = payment.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                payment.id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
            const matchesType = typeFilter === 'all' || payment.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [payments, searchQuery, statusFilter, typeFilter]);

    // Statistiques
    const stats = useMemo(() => {
        const total = payments.length;
        const pending = payments.filter(p => p.status === 'En attente').length;
        const approved = payments.filter(p => p.status === 'Approuvé').length;
        const rejected = payments.filter(p => p.status === 'Rejeté').length;
        const totalAmount = payments
            .filter(p => p.status === 'Approuvé')
            .reduce((sum, p) => sum + p.amount, 0);

        return { total, pending, approved, rejected, totalAmount };
    }, [payments]);

    const columns = [
        {
            key: 'modelName',
            label: 'Mannequin',
            sortable: true,
            render: (_: any, payment: PaymentSubmission) => (
                <div>
                    <div className="font-semibold text-pm-off-white">{payment.modelName}</div>
                    <div className="text-sm text-pm-off-white/60">ID: {payment.modelId}</div>
                </div>
            )
        },
        {
            key: 'type',
            label: 'Type',
            render: (_: any, payment: PaymentSubmission) => (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    payment.type === 'cotisation' 
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}>
                    {payment.type === 'cotisation' ? 'Cotisation (1500 FCFA)' : 'Inscription (15000 FCFA)'}
                </span>
            )
        },
        {
            key: 'amount',
            label: 'Montant',
            sortable: true,
            render: (_: any, payment: PaymentSubmission) => (
                <div className="text-pm-gold font-semibold">
                    {payment.amount.toLocaleString()} FCFA
                </div>
            )
        },
        {
            key: 'method',
            label: 'Méthode',
            render: (_: any, payment: PaymentSubmission) => (
                <div className="text-pm-off-white/70">{payment.method}</div>
            )
        },
        {
            key: 'status',
            label: 'Statut',
            render: (_: any, payment: PaymentSubmission) => {
                const statusColors = {
                    'En attente': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
                    'Approuvé': 'bg-green-500/20 text-green-300 border-green-500/30',
                    'Rejeté': 'bg-red-500/20 text-red-300 border-red-500/30'
                };
                return (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusColors[payment.status]}`}>
                        {payment.status}
                    </span>
                );
            }
        },
        {
            key: 'submissionDate',
            label: 'Date de soumission',
            sortable: true,
            render: (_: any, payment: PaymentSubmission) => (
                <div className="text-sm text-pm-off-white/70">
                    {new Date(payment.submissionDate).toLocaleDateString('fr-FR')}
                </div>
            )
        },
        {
            key: 'paymentMethod',
            label: 'Méthode',
            render: (_: any, payment: PaymentSubmission) => {
                const methodLabels = {
                    'full': 'Complet',
                    'installments': 'Tranches',
                    'advance': 'Anticipé',
                    'bank_transfer': 'Virement',
                    'mobile_money': 'Mobile Money',
                    'cash': 'Espèces'
                };
                return (
                    <span className="text-pm-off-white/70 text-sm">
                        {payment.paymentMethod ? methodLabels[payment.paymentMethod as keyof typeof methodLabels] : payment.method}
                    </span>
                );
            }
        },
        {
            key: 'nextPayment',
            label: 'Prochaine Échéance',
            render: (_: any, payment: PaymentSubmission) => {
                if (payment.nextPaymentDate) {
                    return (
                        <div className="text-sm text-pm-off-white/70">
                            {new Date(payment.nextPaymentDate).toLocaleDateString('fr-FR')}
                        </div>
                    );
                }
                return <span className="text-pm-off-white/50 text-sm">-</span>;
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_: any, payment: PaymentSubmission) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSelectedPayment(payment)}
                        className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                        title="Voir les détails"
                    >
                        <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => {
                            setSelectedModel({id: payment.modelId, name: payment.modelName});
                            setShowScheduleModal(true);
                        }}
                        className="p-2 text-blue-400/70 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                        title="Voir le planning"
                    >
                        <CalendarIcon className="w-4 h-4" />
                    </button>
                    {payment.status === 'En attente' && (
                        <>
                            <button
                                onClick={() => handleApprove(payment.id)}
                                className="p-2 text-green-400/70 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                                title="Approuver"
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleReject(payment.id)}
                                className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                title="Rejeter"
                            >
                                <XCircleIcon className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
            )
        }
    ];

    const handleApprove = async (paymentId: string) => {
        if (!data || !window.confirm('Approuver ce paiement ?')) return;
        
        const updatedPayments = payments.map(p => 
            p.id === paymentId 
                ? { 
                    ...p, 
                    status: 'Approuvé' as const,
                    processedBy: 'admin',
                    processedAt: new Date().toISOString()
                }
                : p
        );
        
        await saveData({ ...data, paymentSubmissions: updatedPayments });
    };

    const handleReject = async (paymentId: string) => {
        if (!data || !window.confirm('Rejeter ce paiement ?')) return;
        
        const updatedPayments = payments.map(p => 
            p.id === paymentId 
                ? { 
                    ...p, 
                    status: 'Rejeté' as const,
                    processedBy: 'admin',
                    processedAt: new Date().toISOString()
                }
                : p
        );
        
        await saveData({ ...data, paymentSubmissions: updatedPayments });
    };

    return (
        <AdminPageWrapper>
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Soumissions"
                    value={stats.total}
                    icon={CurrencyDollarIcon}
                    color="gold"
                />
                <StatCard
                    title="En Attente"
                    value={stats.pending}
                    icon={ClockIcon}
                    color="orange"
                />
                <StatCard
                    title="Approuvés"
                    value={stats.approved}
                    icon={CheckCircleIcon}
                    color="green"
                />
                <StatCard
                    title="Montant Total"
                    value={`${stats.totalAmount.toLocaleString()} FCFA`}
                    icon={CurrencyDollarIcon}
                    color="blue"
                />
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <button
                    onClick={() => {
                        const modelName = prompt('Nom du mannequin:');
                        if (modelName) {
                            setSelectedModel({id: `model_${Date.now()}`, name: modelName});
                            setShowAdvancedPaymentModal(true);
                        }
                    }}
                    className="flex items-center gap-3 p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg hover:bg-pm-gold/20 transition-colors"
                >
                    <PlusIcon className="w-6 h-6 text-pm-gold" />
                    <div className="text-left">
                        <div className="font-semibold text-pm-gold">Nouveau Paiement</div>
                        <div className="text-sm text-pm-off-white/70">Par tranches ou anticipé</div>
                    </div>
                </button>
                
                <button
                    onClick={() => {
                        const modelName = prompt('Nom du mannequin pour voir le planning:');
                        if (modelName) {
                            setSelectedModel({id: `model_${Date.now()}`, name: modelName});
                            setShowScheduleModal(true);
                        }
                    }}
                    className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                    <CalendarIcon className="w-6 h-6 text-blue-400" />
                    <div className="text-left">
                        <div className="font-semibold text-blue-400">Planning</div>
                        <div className="text-sm text-pm-off-white/70">Voir les échéances</div>
                    </div>
                </button>
            </div>

            {/* Filtres */}
            <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-pm-gold" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="En attente">En attente</option>
                                <option value="Approuvé">Approuvé</option>
                                <option value="Rejeté">Rejeté</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="bg-pm-off-white/5 border border-pm-gold/30 rounded-lg px-3 py-2 text-pm-off-white text-sm focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                            >
                                <option value="all">Tous les types</option>
                                <option value="cotisation">Cotisation</option>
                                <option value="inscription">Inscription</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau */}
            <AdminTable
                columns={columns}
                data={filteredPayments}
                emptyMessage="Aucune soumission de paiement trouvée"
            />

            {/* Modal de détails */}
            {selectedPayment && (
                <AdminModal
                    isOpen={!!selectedPayment}
                    onClose={() => setSelectedPayment(null)}
                    title="Détails du Paiement"
                    size="lg"
                >
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Mannequin</label>
                                <p className="text-pm-off-white">{selectedPayment.modelName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Type de paiement</label>
                                <p className="text-pm-off-white">
                                    {selectedPayment.type === 'cotisation' ? 'Cotisation (1500 FCFA)' : 'Inscription (15000 FCFA)'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Montant</label>
                                <p className="text-pm-gold font-semibold text-xl">
                                    {selectedPayment.amount.toLocaleString()} FCFA
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Méthode de paiement</label>
                                <p className="text-pm-off-white">{selectedPayment.method}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Statut</label>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                    selectedPayment.status === 'En attente' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                    selectedPayment.status === 'Approuvé' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                                    'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}>
                                    {selectedPayment.status}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Date de soumission</label>
                                <p className="text-pm-off-white">
                                    {new Date(selectedPayment.submissionDate).toLocaleString('fr-FR')}
                                </p>
                            </div>
                        </div>

                        {selectedPayment.proofImageUrl && (
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Preuve de paiement</label>
                                <img
                                    src={selectedPayment.proofImageUrl}
                                    alt="Preuve de paiement"
                                    className="max-w-full h-64 object-contain rounded-lg border border-pm-gold/20"
                                />
                            </div>
                        )}

                        {selectedPayment.notes && (
                            <div>
                                <label className="block text-sm font-medium text-pm-gold mb-2">Notes</label>
                                <p className="text-pm-off-white bg-pm-off-white/5 p-4 rounded-lg">
                                    {selectedPayment.notes}
                                </p>
                            </div>
                        )}

                        {selectedPayment.processedAt && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-pm-gold/20">
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Traité par</label>
                                    <p className="text-pm-off-white">{selectedPayment.processedBy || 'Administrateur'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pm-gold mb-2">Date de traitement</label>
                                    <p className="text-pm-off-white">
                                        {new Date(selectedPayment.processedAt).toLocaleString('fr-FR')}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </AdminModal>
            )}

            {/* Modal Paiement Avancé */}
            {selectedModel && (
                <AdvancedPaymentModal
                    isOpen={showAdvancedPaymentModal}
                    onClose={() => {
                        setShowAdvancedPaymentModal(false);
                        setSelectedModel(null);
                    }}
                    onSave={(paymentData) => {
                        if (!data) return;
                        const updatedPayments = [...(data.paymentSubmissions || []), paymentData];
                        saveData({ ...data, paymentSubmissions: updatedPayments });
                        setShowAdvancedPaymentModal(false);
                        setSelectedModel(null);
                    }}
                    modelId={selectedModel.id}
                    modelName={selectedModel.name}
                    paymentType="inscription"
                />
            )}

            {/* Modal Planning des Paiements */}
            {selectedModel && (
                <PaymentScheduleModal
                    isOpen={showScheduleModal}
                    onClose={() => {
                        setShowScheduleModal(false);
                        setSelectedModel(null);
                    }}
                    modelId={selectedModel.id}
                    modelName={selectedModel.name}
                    paymentHistory={payments.filter(p => p.modelId === selectedModel.id)}
                />
            )}
        </AdminPageWrapper>
    );
};

export default AdminPayments;