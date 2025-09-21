import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { AccountingTransaction, AccountingCategory } from '../types';

// Enregistrement des composants Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

interface AccountingChartsProps {
    transactions: AccountingTransaction[];
    categories: AccountingCategory[];
    selectedPeriod: string; // YYYY-MM
}

const AccountingCharts: React.FC<AccountingChartsProps> = ({ transactions, categories, selectedPeriod }) => {

    // 1. Données pour le graphique en courbes (Évolution sur 12 mois)
    const lineChartData = useMemo(() => {
        const labels = [];
        const revenueData = [];
        const expenseData = [];

        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = d.toLocaleString('fr-FR', { month: 'short' });
            const year = d.getFullYear();
            labels.push(`${month} ${year}`);
            
            const monthString = d.toISOString().slice(0, 7); // YYYY-MM

            const monthlyRevenue = transactions
                .filter(t => t.date.startsWith(monthString) && t.category === 'revenue')
                .reduce((sum, t) => sum + t.amount, 0);

            const monthlyExpense = transactions
                .filter(t => t.date.startsWith(monthString) && t.category === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);

            revenueData.push(monthlyRevenue);
            expenseData.push(monthlyExpense);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Revenus',
                    data: revenueData,
                    borderColor: 'rgba(74, 222, 128, 1)', // green-400
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    fill: true,
                    tension: 0.3,
                },
                {
                    label: 'Dépenses',
                    data: expenseData,
                    borderColor: 'rgba(248, 113, 113, 1)', // red-400
                    backgroundColor: 'rgba(248, 113, 113, 0.2)',
                    fill: true,
                    tension: 0.3,
                },
            ],
        };
    }, [transactions]);

    // 2. Données pour le graphique circulaire (Répartition des dépenses pour la période)
    const doughnutChartData = useMemo(() => {
        const expenseCategories = categories.filter(c => c.type === 'expense');
        const labels = expenseCategories.map(c => c.name);
        
        const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedPeriod) && t.category === 'expense');

        const data = expenseCategories.map(category => 
            filteredTransactions
                .filter(t => t.subcategory === category.name)
                .reduce((sum, t) => sum + t.amount, 0)
        );

        // Filtrer les catégories avec 0 dépense pour plus de clarté
        const activeLabels: string[] = [];
        const activeData: number[] = [];
        data.forEach((amount, index) => {
            if (amount > 0) {
                activeLabels.push(labels[index]);
                activeData.push(amount);
            }
        });

        return {
            labels: activeLabels,
            datasets: [
                {
                    label: 'Dépenses',
                    data: activeData,
                    backgroundColor: [
                        'rgba(248, 113, 113, 0.8)', 'rgba(251, 146, 60, 0.8)', 'rgba(250, 204, 21, 0.8)',
                        'rgba(163, 230, 53, 0.8)', 'rgba(52, 211, 153, 0.8)', 'rgba(34, 211, 238, 0.8)',
                        'rgba(96, 165, 250, 0.8)', 'rgba(192, 132, 252, 0.8)',
                    ],
                    borderColor: 'rgba(23, 23, 23, 0.5)', // bg-pm-dark
                    borderWidth: 1,
                },
            ],
        };
    }, [transactions, categories, selectedPeriod]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const, labels: { color: '#E5E7EB' } },
            title: { display: true, color: '#D4AF37', font: { size: 16 } },
        },
        scales: {
             x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
             y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                <h3 className="text-xl font-bold text-pm-gold mb-4">Évolution sur 12 Mois</h3>
                <div className="relative h-80">
                    <Line options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Revenus vs Dépenses'}}}} data={lineChartData} />
                </div>
            </div>
            <div className="lg:col-span-2 bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                <h3 className="text-xl font-bold text-pm-gold mb-4">Répartition des Dépenses ({selectedPeriod})</h3>
                 <div className="relative h-80 flex items-center justify-center">
                    {doughnutChartData.datasets[0].data.length > 0 ? (
                         <Doughnut 
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { position: 'right' as const, labels: { color: '#E5E7EB' } },
                                    title: { display: false }
                                },
                            }}
                            data={doughnutChartData} 
                        />
                    ) : (
                        <p className="text-pm-off-white/60">Aucune dépense pour cette période.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountingCharts;
