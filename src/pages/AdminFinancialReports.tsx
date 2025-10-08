import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import { 
    DocumentChartBarIcon, 
    ArrowDownTrayIcon,
    ChartPieIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';

const AdminFinancialReports: React.FC = () => {
    const { data } = useData();
    const [startDate, setStartDate] = useState<string>(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
    const [reportType, setReportType] = useState<'summary' | 'detailed' | 'by_category'>('summary');

    const transactions = data?.accountingTransactions || [];

    const reportData = useMemo(() => {
        const filteredTransactions = transactions.filter(t => {
            const transDate = new Date(t.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return transDate >= start && transDate <= end;
        });

        const revenues = filteredTransactions.filter(t => t.category === 'revenue');
        const expenses = filteredTransactions.filter(t => t.category === 'expense');

        const totalRevenue = revenues.reduce((sum, t) => sum + t.amount, 0);
        const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
        const netBalance = totalRevenue - totalExpense;

        // Répartition par sous-catégorie
        const revenuesByCategory = revenues.reduce((acc: any, t) => {
            const cat = t.subcategory || 'Non catégorisé';
            acc[cat] = (acc[cat] || 0) + t.amount;
            return acc;
        }, {});

        const expensesByCategory = expenses.reduce((acc: any, t) => {
            const cat = t.subcategory || 'Non catégorisé';
            acc[cat] = (acc[cat] || 0) + t.amount;
            return acc;
        }, {});

        // Répartition par méthode de paiement
        const paymentMethods = filteredTransactions.reduce((acc: any, t) => {
            const method = t.paymentMethod || 'non_spécifié';
            if (!acc[method]) {
                acc[method] = { revenue: 0, expense: 0 };
            }
            if (t.category === 'revenue') {
                acc[method].revenue += t.amount;
            } else {
                acc[method].expense += t.amount;
            }
            return acc;
        }, {});

        // Tendances mensuelles
        const monthlyData = filteredTransactions.reduce((acc: any, t) => {
            const monthYear = new Date(t.date).toLocaleString('fr-FR', { year: 'numeric', month: 'long' });
            if (!acc[monthYear]) {
                acc[monthYear] = { revenue: 0, expense: 0 };
            }
            if (t.category === 'revenue') {
                acc[monthYear].revenue += t.amount;
            } else {
                acc[monthYear].expense += t.amount;
            }
            return acc;
        }, {});

        return {
            totalRevenue,
            totalExpense,
            netBalance,
            revenuesCount: revenues.length,
            expensesCount: expenses.length,
            revenuesByCategory,
            expensesByCategory,
            paymentMethods,
            monthlyData,
            transactions: filteredTransactions
        };
    }, [transactions, startDate, endDate]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    const exportToCSV = () => {
        const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Montant', 'Méthode', 'Référence'];
        const rows = reportData.transactions.map(t => [
            t.date,
            t.category === 'revenue' ? 'Revenu' : 'Dépense',
            t.subcategory || '',
            t.description,
            t.amount.toString(),
            t.paymentMethod || '',
            t.reference || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `rapport-financier-${startDate}-${endDate}.csv`;
        link.click();
    };

    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Rapport Financier</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #d4a944; text-align: center; }
                    .summary { margin: 20px 0; }
                    .summary-item { display: flex; justify-between; padding: 10px; border-bottom: 1px solid #ddd; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #d4a944; color: white; }
                    .revenue { color: green; }
                    .expense { color: red; }
                </style>
            </head>
            <body>
                <h1>Rapport Financier</h1>
                <p><strong>Période:</strong> ${new Date(startDate).toLocaleDateString('fr-FR')} - ${new Date(endDate).toLocaleDateString('fr-FR')}</p>
                
                <div class="summary">
                    <div class="summary-item">
                        <span>Total Revenus:</span>
                        <span class="revenue">${formatCurrency(reportData.totalRevenue)}</span>
                    </div>
                    <div class="summary-item">
                        <span>Total Dépenses:</span>
                        <span class="expense">${formatCurrency(reportData.totalExpense)}</span>
                    </div>
                    <div class="summary-item">
                        <span>Balance Nette:</span>
                        <span style="color: ${reportData.netBalance >= 0 ? 'green' : 'red'}">${formatCurrency(reportData.netBalance)}</span>
                    </div>
                </div>

                <h2>Détails des Transactions</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Catégorie</th>
                            <th>Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.transactions.map(t => `
                            <tr>
                                <td>${new Date(t.date).toLocaleDateString('fr-FR')}</td>
                                <td>${t.category === 'revenue' ? 'Revenu' : 'Dépense'}</td>
                                <td>${t.description}</td>
                                <td>${t.subcategory || '-'}</td>
                                <td class="${t.category}">${formatCurrency(t.amount)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
    };

    const paymentMethodLabels: Record<string, string> = {
        cash: 'Espèces',
        bank_transfer: 'Virement bancaire',
        mobile_money: 'Mobile Money',
        check: 'Chèque',
        card: 'Carte bancaire',
        non_spécifié: 'Non spécifié'
    };

    return (
        <AdminLayout>
            <AdminPageHeader 
                title="Rapports Financiers"
                subtitle="Générer des rapports financiers détaillés par période"
                action={
                    <div className="flex gap-2">
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-600/30 text-green-400 font-semibold rounded-lg hover:bg-green-600/30 transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Export CSV
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors"
                        >
                            <DocumentChartBarIcon className="w-5 h-5" />
                            Imprimer PDF
                        </button>
                    </div>
                }
            />

            {/* Sélection de période */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                    <label className="block text-sm font-semibold text-pm-off-white mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-2" />
                        Date de début
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-pm-off-white mb-2">
                        <CalendarIcon className="w-4 h-4 inline mr-2" />
                        Date de fin
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-pm-off-white mb-2">
                        <ChartPieIcon className="w-4 h-4 inline mr-2" />
                        Type de rapport
                    </label>
                    <select
                        value={reportType}
                        onChange={e => setReportType(e.target.value as any)}
                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    >
                        <option value="summary">Résumé</option>
                        <option value="detailed">Détaillé</option>
                        <option value="by_category">Par Catégorie</option>
                    </select>
                </div>
            </div>

            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <p className="text-sm text-pm-off-white/60 mb-1">Revenus Totaux</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(reportData.totalRevenue)}</p>
                    <p className="text-xs text-pm-off-white/50 mt-1">{reportData.revenuesCount} transactions</p>
                </div>
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <p className="text-sm text-pm-off-white/60 mb-1">Dépenses Totales</p>
                    <p className="text-2xl font-bold text-red-400">{formatCurrency(reportData.totalExpense)}</p>
                    <p className="text-xs text-pm-off-white/50 mt-1">{reportData.expensesCount} transactions</p>
                </div>
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <p className="text-sm text-pm-off-white/60 mb-1">Balance Nette</p>
                    <p className={`text-2xl font-bold ${reportData.netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(reportData.netBalance)}
                    </p>
                    <p className="text-xs text-pm-off-white/50 mt-1">
                        {((reportData.netBalance / reportData.totalRevenue) * 100).toFixed(1)}% marge
                    </p>
                </div>
                <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                    <p className="text-sm text-pm-off-white/60 mb-1">Transactions</p>
                    <p className="text-2xl font-bold text-pm-gold">{reportData.transactions.length}</p>
                    <p className="text-xs text-pm-off-white/50 mt-1">Sur la période</p>
                </div>
            </div>

            {reportType === 'summary' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <AdminSection title="Revenus par Catégorie">
                        <div className="space-y-3">
                            {Object.entries(reportData.revenuesByCategory)
                                .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                                .map(([category, amount]: [string, any]) => (
                                <div key={category} className="flex justify-between items-center p-3 bg-pm-dark/30 rounded-lg">
                                    <span className="text-pm-off-white">{category}</span>
                                    <div className="text-right">
                                        <span className="font-bold text-green-400 block">{formatCurrency(amount)}</span>
                                        <span className="text-xs text-pm-off-white/60">
                                            {((amount / reportData.totalRevenue) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AdminSection>

                    <AdminSection title="Dépenses par Catégorie">
                        <div className="space-y-3">
                            {Object.entries(reportData.expensesByCategory)
                                .sort(([, a]: [string, any], [, b]: [string, any]) => b - a)
                                .map(([category, amount]: [string, any]) => (
                                <div key={category} className="flex justify-between items-center p-3 bg-pm-dark/30 rounded-lg">
                                    <span className="text-pm-off-white">{category}</span>
                                    <div className="text-right">
                                        <span className="font-bold text-red-400 block">{formatCurrency(amount)}</span>
                                        <span className="text-xs text-pm-off-white/60">
                                            {((amount / reportData.totalExpense) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AdminSection>
                </div>
            )}

            {reportType === 'by_category' && (
                <>
                    <AdminSection title="Répartition par Méthode de Paiement" className="mb-8">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-pm-gold/20">
                                        <th className="text-left py-3 px-4 text-pm-gold font-semibold">Méthode</th>
                                        <th className="text-right py-3 px-4 text-pm-gold font-semibold">Revenus</th>
                                        <th className="text-right py-3 px-4 text-pm-gold font-semibold">Dépenses</th>
                                        <th className="text-right py-3 px-4 text-pm-gold font-semibold">Net</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(reportData.paymentMethods).map(([method, amounts]: [string, any]) => (
                                        <tr key={method} className="border-b border-pm-gold/10">
                                            <td className="py-3 px-4 text-pm-off-white">
                                                {paymentMethodLabels[method] || method}
                                            </td>
                                            <td className="py-3 px-4 text-right text-green-400 font-semibold">
                                                {formatCurrency(amounts.revenue)}
                                            </td>
                                            <td className="py-3 px-4 text-right text-red-400 font-semibold">
                                                {formatCurrency(amounts.expense)}
                                            </td>
                                            <td className={`py-3 px-4 text-right font-bold ${
                                                amounts.revenue - amounts.expense >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {formatCurrency(amounts.revenue - amounts.expense)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </AdminSection>

                    <AdminSection title="Tendances Mensuelles">
                        <div className="space-y-3">
                            {Object.entries(reportData.monthlyData).map(([month, amounts]: [string, any]) => (
                                <div key={month} className="p-4 bg-pm-dark/30 rounded-lg">
                                    <h4 className="text-lg font-bold text-pm-gold mb-3">{month}</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-xs text-pm-off-white/60 mb-1">Revenus</p>
                                            <p className="text-green-400 font-bold">{formatCurrency(amounts.revenue)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-pm-off-white/60 mb-1">Dépenses</p>
                                            <p className="text-red-400 font-bold">{formatCurrency(amounts.expense)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-pm-off-white/60 mb-1">Balance</p>
                                            <p className={`font-bold ${amounts.revenue - amounts.expense >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {formatCurrency(amounts.revenue - amounts.expense)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AdminSection>
                </>
            )}

            {reportType === 'detailed' && (
                <AdminSection title="Transactions Détaillées">
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
                                {reportData.transactions
                                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                    .map(trans => (
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
            )}
        </AdminLayout>
    );
};

export default AdminFinancialReports;
