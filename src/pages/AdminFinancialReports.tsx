import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const AdminFinancialReports: React.FC = () => {
  const { data } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year' | 'all'>('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const payments = data?.monthlyPayments || [];
  const invoices = data?.invoices || [];
  const expenses = data?.expenses || [];

  const filteredData = useMemo(() => {
    const filterByDate = (date: string) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth();
      const quarter = Math.floor(month / 3);

      switch (selectedPeriod) {
        case 'month':
          return year === selectedYear && month === selectedMonth;
        case 'quarter':
          const selectedQuarter = Math.floor(selectedMonth / 3);
          return year === selectedYear && quarter === selectedQuarter;
        case 'year':
          return year === selectedYear;
        case 'all':
          return true;
        default:
          return true;
      }
    };

    return {
      payments: payments.filter(p => filterByDate(p.date)),
      invoices: invoices.filter(i => filterByDate(i.date)),
      expenses: expenses.filter(e => filterByDate(e.date))
    };
  }, [payments, invoices, expenses, selectedPeriod, selectedYear, selectedMonth]);

  const statistics = useMemo(() => {
    const approvedPayments = filteredData.payments.filter(p => p.status === 'Approuvé');
    const totalRevenue = approvedPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    
    const paidInvoices = filteredData.invoices.filter(i => i.status === 'Payée');
    const invoiceRevenue = paidInvoices.reduce((sum, i) => sum + i.amount, 0);
    
    const totalExpenses = filteredData.expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalRevenue + invoiceRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? ((netProfit / (totalRevenue + invoiceRevenue)) * 100) : 0;

    // Répartition des dépenses par catégorie
    const expensesByCategory: { [key: string]: number } = {};
    filteredData.expenses.forEach(exp => {
      expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount;
    });

    // Évolution mensuelle
    const monthlyData: { [key: string]: { revenue: number; expenses: number; profit: number } } = {};
    
    [...filteredData.payments, ...filteredData.invoices, ...filteredData.expenses].forEach(item => {
      const date = new Date('date' in item ? item.date : '');
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { revenue: 0, expenses: 0, profit: 0 };
      }

      if ('amount' in item && 'status' in item) {
        if ((item as any).status === 'Approuvé' || (item as any).status === 'Payée') {
          monthlyData[monthYear].revenue += Number(item.amount);
        }
      } else if ('amount' in item && 'category' in item) {
        monthlyData[monthYear].expenses += Number(item.amount);
      }
    });

    Object.keys(monthlyData).forEach(key => {
      monthlyData[key].profit = monthlyData[key].revenue - monthlyData[key].expenses;
    });

    return {
      totalRevenue: totalRevenue + invoiceRevenue,
      totalExpenses,
      netProfit,
      profitMargin,
      expensesByCategory,
      monthlyData,
      paymentsCount: approvedPayments.length,
      invoicesCount: paidInvoices.length,
      expensesCount: filteredData.expenses.length
    };
  }, [filteredData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const exportToCSV = () => {
    const csvData = [
      ['Type', 'Description', 'Montant', 'Date', 'Statut'],
      ...filteredData.payments.map(p => ['Paiement', p.modelName, p.amount, p.date, p.status]),
      ...filteredData.invoices.map(i => ['Facture', i.clientName, i.amount, i.date, i.status]),
      ...filteredData.expenses.map(e => ['Dépense', e.description, e.amount, e.date, e.category])
    ];

    const csv = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-financier-${selectedYear}-${selectedMonth + 1}.csv`;
    a.click();
  };

  const getPeriodLabel = () => {
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    switch (selectedPeriod) {
      case 'month':
        return `${monthNames[selectedMonth]} ${selectedYear}`;
      case 'quarter':
        const quarter = Math.floor(selectedMonth / 3) + 1;
        return `T${quarter} ${selectedYear}`;
      case 'year':
        return `Année ${selectedYear}`;
      case 'all':
        return 'Toute la période';
      default:
        return '';
    }
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Rapports Financiers" 
        subtitle="Analyses et statistiques financières détaillées"
      />

      {/* Filtres de période */}
      <AdminSection title="Période">
        <AdminCard>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1">Type de période</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
                className="px-4 py-2 border rounded"
              >
                <option value="month">Mois</option>
                <option value="quarter">Trimestre</option>
                <option value="year">Année</option>
                <option value="all">Tout</option>
              </select>
            </div>

            {selectedPeriod !== 'all' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Année</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-4 py-2 border rounded"
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {(selectedPeriod === 'month' || selectedPeriod === 'quarter') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {selectedPeriod === 'month' ? 'Mois' : 'Trimestre'}
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="px-4 py-2 border rounded"
                    >
                      {selectedPeriod === 'month' ? (
                        ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                         'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((month, i) => (
                          <option key={i} value={i}>{month}</option>
                        ))
                      ) : (
                        ['T1', 'T2', 'T3', 'T4'].map((q, i) => (
                          <option key={i} value={i * 3}>{q}</option>
                        ))
                      )}
                    </select>
                  </div>
                )}
              </>
            )}

            <div className="ml-auto">
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded hover:bg-pm-gold/90"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
                Exporter CSV
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-pm-gold" />
              <span className="font-semibold">Période sélectionnée: {getPeriodLabel()}</span>
            </div>
          </div>
        </AdminCard>
      </AdminSection>

      {/* Statistiques principales */}
      <AdminSection title="Vue d'ensemble">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminCard>
            <p className="text-sm text-gray-600 mb-1">Revenus Totaux</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(statistics.totalRevenue)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.paymentsCount} paiement(s) + {statistics.invoicesCount} facture(s)
            </p>
          </AdminCard>

          <AdminCard>
            <p className="text-sm text-gray-600 mb-1">Dépenses Totales</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(statistics.totalExpenses)}</p>
            <p className="text-xs text-gray-500 mt-1">{statistics.expensesCount} dépense(s)</p>
          </AdminCard>

          <AdminCard>
            <p className="text-sm text-gray-600 mb-1">Bénéfice Net</p>
            <p className={`text-2xl font-bold ${statistics.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(statistics.netProfit)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {statistics.netProfit >= 0 ? 'Positif' : 'Négatif'}
            </p>
          </AdminCard>

          <AdminCard>
            <p className="text-sm text-gray-600 mb-1">Marge Bénéficiaire</p>
            <p className={`text-2xl font-bold ${statistics.profitMargin >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {statistics.profitMargin.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Ratio profit/revenus</p>
          </AdminCard>
        </div>
      </AdminSection>

      {/* Dépenses par catégorie */}
      <AdminSection title="Dépenses par Catégorie">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statistics.expensesByCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, amount]) => {
              const percentage = statistics.totalExpenses > 0 
                ? ((amount / statistics.totalExpenses) * 100).toFixed(1)
                : 0;
              
              return (
                <AdminCard key={category}>
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{category}</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-400">{percentage}%</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </AdminCard>
              );
            })}
        </div>

        {Object.keys(statistics.expensesByCategory).length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ChartBarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Aucune dépense pour cette période</p>
          </div>
        )}
      </AdminSection>

      {/* Évolution mensuelle */}
      {Object.keys(statistics.monthlyData).length > 0 && (
        <AdminSection title="Évolution Mensuelle">
          <AdminCard>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Période</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">Revenus</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">Dépenses</th>
                    <th className="px-4 py-2 text-right text-sm font-semibold">Bénéfice</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(statistics.monthlyData)
                    .sort(([a], [b]) => b.localeCompare(a))
                    .map(([period, data]) => (
                      <tr key={period} className="border-t">
                        <td className="px-4 py-3 text-sm">{period}</td>
                        <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                          {formatCurrency(data.revenue)}
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-red-600 font-semibold">
                          {formatCurrency(data.expenses)}
                        </td>
                        <td className={`px-4 py-3 text-sm text-right font-semibold ${
                          data.profit >= 0 ? 'text-blue-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(data.profit)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </AdminSection>
      )}
    </AdminLayout>
  );
};

export default AdminFinancialReports;

