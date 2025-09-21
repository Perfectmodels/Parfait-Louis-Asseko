import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Model, Module } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ClassroomChartsProps {
    models: Model[];
    modules: Module[];
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'top' as const, labels: { color: '#E5E7EB' } },
        title: { display: true, color: '#D4AF37', font: { size: 16 } },
    },
    scales: {
         x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
         y: { ticks: { color: '#9CA3AF', callback: (value: any) => `${value}%` }, grid: { color: 'rgba(255, 255, 255, 0.1)' } }
    }
};

const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'right' as const, labels: { color: '#E5E7EB' } },
        title: { display: true, color: '#D4AF37', font: { size: 16 } },
    },
};


const ClassroomCharts: React.FC<ClassroomChartsProps> = ({ models, modules }) => {

    // 1. Taux de complétion des modules
    const moduleCompletionData = useMemo(() => {
        const labels = modules.map(m => m.title);
        const data = modules.map(module => {
            const completedCount = models.filter(model => model.quizScores?.[module.slug]?.score !== undefined).length;
            return (completedCount / models.length) * 100;
        });

        return {
            labels,
            datasets: [{
                label: '% de mannequins ayant complété',
                data,
                backgroundColor: 'rgba(212, 175, 55, 0.6)', // pm-gold
                borderColor: 'rgba(212, 175, 55, 1)',
                borderWidth: 1,
            }],
        };
    }, [models, modules]);

    // 2. Top 5 des mannequins par score moyen
    const topModelsData = useMemo(() => {
        const modelScores = models.map(model => {
            const scores = Object.values(model.quizScores || {}).map(qs => (qs.score / qs.total) * 100);
            const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
            return { name: model.name, average };
        });

        const top5 = modelScores.sort((a, b) => b.average - a.average).slice(0, 5);

        return {
            labels: top5.map(m => m.name),
            datasets: [{
                label: 'Score moyen (%)',
                data: top5.map(m => m.average),
                backgroundColor: 'rgba(74, 222, 128, 0.6)', // green-400
                borderColor: 'rgba(74, 222, 128, 1)',
                borderWidth: 1,
            }],
        };
    }, [models]);

    // 3. Distribution des scores
     const scoreDistributionData = useMemo(() => {
        let excellent = 0; // >= 80%
        let good = 0;      // 50-79%
        let poor = 0;      // < 50%

        models.forEach(model => {
            Object.values(model.quizScores || {}).forEach(qs => {
                const percentage = (qs.score / qs.total) * 100;
                if (percentage >= 80) excellent++;
                else if (percentage >= 50) good++;
                else poor++;
            });
        });

        return {
            labels: ['Excellent (>= 80%)', 'Bon (50-79%)', 'À améliorer (< 50%)'],
            datasets: [{
                data: [excellent, good, poor],
                backgroundColor: ['rgba(74, 222, 128, 0.8)', 'rgba(250, 204, 21, 0.8)', 'rgba(248, 113, 113, 0.8)'],
                borderColor: 'rgba(23, 23, 23, 0.5)',
                borderWidth: 1,
            }],
        };
    }, [models]);


    return (
        <div className="admin-section-wrapper">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                    <div className="relative h-96">
                        <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Taux de complétion des modules'}}}} data={moduleCompletionData} />
                    </div>
                </div>
                 <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                    <div className="relative h-96">
                        <Bar options={{...chartOptions, plugins: {...chartOptions.plugins, title: {...chartOptions.plugins.title, text: 'Top 5 Mannequins (Score Moyen)'}}, indexAxis: 'y' as const}} data={topModelsData} />
                    </div>
                </div>
                <div className="lg:col-span-2 bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                     <div className="relative h-80 flex items-center justify-center">
                        <Doughnut options={{...doughnutOptions, plugins: {...doughnutOptions.plugins, title: {...doughnutOptions.plugins.title, text: 'Distribution des Scores de Quiz'}}}} data={scoreDistributionData} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomCharts;
