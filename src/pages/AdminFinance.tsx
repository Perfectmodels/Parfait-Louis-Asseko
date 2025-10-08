import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import { 
    CurrencyDollarIcon, 
    ArrowTrendingUpIcon, 
    ArrowTrendingDownIcon,
    ChartBarIcon,
    BanknotesIcon,
    ReceiptPercentIcon
} from '@heroicons/react/24/outline';

const AdminFinance: React.FC = () => {
    const { data } = useData();
    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

    // Calculs financiers basés sur accountingTransactions
    const transactions = data?.accountingTransactions || [];
    
    const stats = useMemo(() => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Filtrer les transactions selon la période
        const filterByPeriod = (trans: any) => {
            const transDate = new Date(trans.date);
            switch (selectedPeriod) {
                case 'day':
                    return transDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return transDate >= weekAgo;
                case 'month':
                    return transDate >= startOfMonth;
                case 'year':
                    return transDate >= startOfYear;
                default:
                    return true;
            }
        };

        const periodTransactions = transactions.filter(filterByPeriod);

        // Revenus
        const revenues = periodTransactions
            .filter(t => t.category === 'revenue')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        // Dépenses
        const expenses = periodTransactions
            .filter(t => t.category === 'expense')
            .reduce((sum, t) => sum + (t.amount || 0), 0);

        // Balance
        const balance = revenues - expenses;

        // Transactions par méthode de paiement
        const paymentMethods = periodTransactions.reduce((acc: any, t) => {
            const method = t.paymentMethod || 'non_spécifié';
            acc[method] = (acc[method] || 0) + t.amount;
            return acc;
        }, {});

        // Top transactions
        const topRevenues = transactions
            .filter(t => t.category === 'revenue')
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        const topExpenses = transactions
            .filter(t => t.category === 'expense')
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5);

        // Revenus par sous-catégorie
        const revenuesBySubcategory = periodTransactions
            .filter(t => t.category === 'revenue')
            .reduce((acc: any, t) => {
                const sub = t.subcategory || 'Non catégorisé';
                acc[sub] = (acc[sub] || 0) + t.amount;
                return acc;
            }, {});

        // Dépenses par sous-catégorie
        const expensesBySubcategory = periodTransactions
            .filter(t => t.category === 'expense')
            .reduce((acc: any, t) => {
                const sub = t.subcategory || 'Non catégorisé';
                acc[sub] = (acc[sub] || 0) + t.amount;
                return acc;
            }, {});

        return {
            revenues,
            expenses,
            balance,
            paymentMethods,
            topRevenues,
            topExpenses,
            revenuesBySubcategory,
            expensesBySubcategory,
            transactionCount: periodTransactions.length
        };
    }, [transactions, selectedPeriod]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    const periodLabels = {
        day: "Aujourd'hui",
        week: 'Cette semaine',
        month: 'Ce mois',
        year: 'Cette année'
    };

    return (
        <AdminLayout>
            <AdminPageHeader 
                title="Vue Financière"
                subtitle="Tableau de bord financier complet avec statistiques et indicateurs clés"
            />

            {/* Sélecteur de période */}
            <div className="mb-6 flex gap-2">
                {(['day', 'week', 'month', 'year'] as const).map(period => (
                    <button
                        key={period}
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            selectedPeriod === period
                                ? 'bg-pm-gold text-black'
                                : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
                        }`}
                    >
                        {periodLabels[period]}
                    </button>
                ))}
            </div>

            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={ArrowTrendingUpIcon}
                    title="Revenus"
                    value={formatCurrency(stats.revenues)}
                    color="green"
                />
                <StatCard
                    icon={ArrowTrendingDownIcon}
                    title="Dépenses"
                    value={formatCurrency(stats.expenses)}
                    color="red"
                />
                <StatCard
                    icon={CurrencyDollarIcon}
                    title="Balance"
                    value={formatCurrency(stats.balance)}
                    color={stats.balance >= 0 ? 'green' : 'red'}
                />
                <StatCard
                    icon={ReceiptPercentIcon}
                    title="Transactions"
                    value={stats.transactionCount.toString()}
                    color="blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenus par sous-catégorie */}
                <AdminSection title="Revenus par Catégorie">
                    <div className="space-y-3">
                        {Object.entries(stats.revenuesBySubcategory).map(([category, amount]: [string, any]) => (
                            <div key={category} className="flex justify-between items-center p-3 bg-pm-dark/30 rounded-lg">
                                <span className="text-pm-off-white">{category}</span>
                                <span className="font-bold text-green-400">{formatCurrency(amount)}</span>
                            </div>
                        ))}
                        {Object.keys(stats.revenuesBySubcategory).length === 0 && (
                            <p className="text-pm-off-white/60 text-center py-4">Aucun revenu pour cette période</p>
                        )}
                    </div>
                </AdminSection>

                {/* Dépenses par sous-catégorie */}
                <AdminSection title="Dépenses par Catégorie">
                    <div className="space-y-3">
                        {Object.entries(stats.expensesBySubcategory).map(([category, amount]: [string, any]) => (
                            <div key={category} className="flex justify-between items-center p-3 bg-pm-dark/30 rounded-lg">
                                <span className="text-pm-off-white">{category}</span>
                                <span className="font-bold text-red-400">{formatCurrency(amount)}</span>
                            </div>
                        ))}
                        {Object.keys(stats.expensesBySubcategory).length === 0 && (
                            <p className="text-pm-off-white/60 text-center py-4">Aucune dépense pour cette période</p>
                        )}
                    </div>
                </AdminSection>

                {/* Méthodes de paiement */}
                <AdminSection title="Répartition par Méthode de Paiement">
                    <div className="space-y-3">
                        {Object.entries(stats.paymentMethods).map(([method, amount]: [string, any]) => {
                            const methodLabels: any = {
                                cash: 'Espèces',
                                bank_transfer: 'Virement bancaire',
                                mobile_money: 'Mobile Money',
                                check: 'Chèque',
                                card: 'Carte bancaire',
                                non_spécifié: 'Non spécifié'
                            };
                            return (
                                <div key={method} className="flex justify-between items-center p-3 bg-pm-dark/30 rounded-lg">
                                    <span className="text-pm-off-white">{methodLabels[method] || method}</span>
                                    <span className="font-bold text-pm-gold">{formatCurrency(amount)}</span>
                                </div>
                            );
                        })}
                    </div>
                </AdminSection>

                {/* Top Revenus */}
                <AdminSection title="Top 5 Revenus">
                    <div className="space-y-3">
                        {stats.topRevenues.map((trans: any) => (
                            <div key={trans.id} className="p-3 bg-pm-dark/30 rounded-lg">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-sm text-pm-off-white font-semibold">{trans.description}</span>
                                    <span className="font-bold text-green-400">{formatCurrency(trans.amount)}</span>
                                </div>
                                <div className="text-xs text-pm-off-white/60">
                                    {new Date(trans.date).toLocaleDateString('fr-FR')} • {trans.subcategory}
                                </div>
                            </div>
                        ))}
                        {stats.topRevenues.length === 0 && (
                            <p className="text-pm-off-white/60 text-center py-4">Aucun revenu enregistré</p>
                        )}
                    </div>
                </AdminSection>
            </div>

            {/* Dernières transactions */}
            <AdminSection title="Dernières Transactions" className="mt-8">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-pm-gold/20">
                                <th className="text-left py-3 px-4 text-pm-gold font-semibold">Date</th>
                                <th className="text-left py-3 px-4 text-pm-gold font-semibold">Description</th>
                                <th className="text-left py-3 px-4 text-pm-gold font-semibold">Catégorie</th>
                                <th className="text-left py-3 px-4 text-pm-gold font-semibold">Type</th>
                                <th className="text-right py-3 px-4 text-pm-gold font-semibold">Montant</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 20).map((trans: any) => (
                                <tr key={trans.id} className="border-b border-pm-gold/10 hover:bg-pm-gold/5">
                                    <td className="py-3 px-4 text-pm-off-white/80">
                                        {new Date(trans.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-3 px-4 text-pm-off-white">
                                        {trans.description}
                                        {trans.relatedModelName && (
                                            <span className="block text-xs text-pm-off-white/60 mt-1">
                                                👤 {trans.relatedModelName}
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-pm-off-white/80 text-sm">
                                        {trans.subcategory || '-'}
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            trans.category === 'revenue'
                                                ? 'bg-green-600/20 text-green-400'
                                                : 'bg-red-600/20 text-red-400'
                                        }`}>
                                            {trans.category === 'revenue' ? 'Revenu' : 'Dépense'}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-4 text-right font-bold ${
                                        trans.category === 'revenue' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                        {trans.category === 'revenue' ? '+' : '-'}{formatCurrency(trans.amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </AdminSection>
        </AdminLayout>
    );
};

interface StatCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    color: 'green' | 'red' | 'blue';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, color }) => {
    const colorClasses = {
        green: 'text-green-400 bg-green-600/10 border-green-600/30',
        red: 'text-red-400 bg-red-600/10 border-red-600/30',
        blue: 'text-blue-400 bg-blue-600/10 border-blue-600/30'
    };

    return (
        <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${colorClasses[color].split(' ')[0]}`} />
            </div>
            <p className="text-sm text-pm-off-white/60 mb-1">{title}</p>
            <p className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</p>
        </div>
    );
};

export default AdminFinance;
