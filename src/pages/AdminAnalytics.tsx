import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components';
import { ChartBarIcon, UserGroupIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const AdminAnalytics: React.FC = () => {
    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Analytics" noIndex />

            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Retour au Dashboard
                </Link>

                <h1 className="text-4xl font-playfair text-pm-gold mb-8">Analytics</h1>
                <p className="text-pm-off-white/70 mb-8">Analyse des performances et statistiques de l'agence.</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <UserGroupIcon className="w-8 h-8 text-pm-gold" />
                            <span className="text-sm text-green-400">+12%</span>
                        </div>
                        <div className="text-2xl font-bold text-pm-off-white">248</div>
                        <div className="text-sm text-pm-off-white/60">Mannequins</div>
                    </div>

                    <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <CalendarIcon className="w-8 h-8 text-pm-gold" />
                            <span className="text-sm text-green-400">+8%</span>
                        </div>
                        <div className="text-2xl font-bold text-pm-off-white">42</div>
                        <div className="text-sm text-pm-off-white/60">Événements</div>
                    </div>

                    <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <CurrencyDollarIcon className="w-8 h-8 text-pm-gold" />
                            <span className="text-sm text-green-400">+23%</span>
                        </div>
                        <div className="text-2xl font-bold text-pm-off-white">2.4M</div>
                        <div className="text-sm text-pm-off-white/60">FCFA</div>
                    </div>

                    <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <ChartBarIcon className="w-8 h-8 text-pm-gold" />
                            <span className="text-sm text-red-400">-5%</span>
                        </div>
                        <div className="text-2xl font-bold text-pm-off-white">89%</div>
                        <div className="text-sm text-pm-off-white/60">Satisfaction</div>
                    </div>
                </div>

                {/* Charts Placeholder */}
                <div className="bg-black border border-pm-gold/20 rounded-lg p-8">
                    <h2 className="text-xl font-semibold text-pm-gold mb-6">Performance Mensuelle</h2>
                    <div className="h-64 flex items-center justify-center text-pm-off-white/50">
                        <div className="text-center">
                            <ChartBarIcon className="w-16 h-16 mx-auto mb-4" />
                            <p>Graphiques analytics à implémenter</p>
                            <p className="text-sm mt-2">Intégration avec Chart.js ou autre librairie</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
