import React, { useState, useMemo } from 'react';
import AdminLayout from '../components/AdminLayout';
import AdminCard from '../components/admin/AdminCard';
import { StatCard } from '../components/admin/AdminStats';
import { 
    CurrencyDollarIcon, CalendarIcon, ExclamationTriangleIcon,
    ChartBarIcon, DocumentTextIcon, ClockIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';

const AdminFinance: React.FC = () => {
    const { data } = useData();
    const [activeSection, setActiveSection] = useState<'payments' | 'bookings' | 'absences' | 'reports'>('payments');

    // ---- Statistiques financières ----
    const totalRevenue = useMemo(() => 
        (data as any)?.monthlyPayments?.reduce((sum: any, payment: any) => sum + payment.amount, 0) || 0, 
        [data]
    );
    
    const newBookingRequests = useMemo(() => 
        (data as any)?.bookingRequests?.filter((b: any) => b.status === 'Nouveau').length || 0, 
        [data]
    );
    
    const totalAbsences = useMemo(() => 
        (data as any)?.absences?.length || 0, 
        [data]
    );
    
    const pendingPayments = useMemo(() => 
        (data as any)?.monthlyPayments?.filter((p: any) => p.status === 'En attente').length || 0, 
        [data]
    );

    const sections = [
        { id: 'payments', label: 'Paiements', icon: CurrencyDollarIcon, count: pendingPayments },
        { id: 'bookings', label: 'Réservations', icon: CalendarIcon, count: newBookingRequests },
        { id: 'absences', label: 'Absences', icon: ExclamationTriangleIcon, count: totalAbsences },
        { id: 'reports', label: 'Rapports', icon: ChartBarIcon, count: 0 },
    ];

    return (
        <AdminLayout 
            title="Gestion Financière" 
            description="Suivre les paiements, réservations et rapports financiers"
            breadcrumbs={[
                { label: 'Admin', href: '/admin' },
                { label: 'Finance', href: '/admin/finance' }
            ]}
        >
            {/* Statistiques financières */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Revenus Totaux"
                    value={`${totalRevenue.toLocaleString()} FCFA`}
                    icon={CurrencyDollarIcon}
                    color="green"
                    change={{
                        value: 15,
                        type: 'increase',
                        label: 'ce mois'
                    }}
                />
                <StatCard
                    title="Paiements En Attente"
                    value={pendingPayments}
                    icon={ClockIcon}
                    color="orange"
                />
                <StatCard
                    title="Réservations En Attente"
                    value={newBookingRequests}
                    icon={CalendarIcon}
                    color="blue"
                />
                <StatCard
                    title="Absences Enregistrées"
                    value={totalAbsences}
                    icon={ExclamationTriangleIcon}
                    color="red"
                />
            </div>

            {/* Navigation des sections */}
            <div className="mb-8">
                <nav className="flex space-x-1 bg-black/30 p-1 rounded-lg">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id as any)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? 'bg-pm-gold text-black'
                                    : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                            }`}
                        >
                            <section.icon className="w-4 h-4" />
                            {section.label}
                            {section.count > 0 && (
                                <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                                    {section.count}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminCard 
                    title="Nouveau Paiement" 
                    icon={CurrencyDollarIcon} 
                    description="Enregistrer un nouveau paiement de mannequin."
                    color="green"
                    onClick={() => {/* TODO: Ouvrir modal paiement */}}
                />
                <AdminCard 
                    title="Nouvelle Réservation" 
                    icon={CalendarIcon} 
                    description="Créer une réservation de shooting."
                    color="blue"
                    onClick={() => {/* TODO: Ouvrir modal réservation */}}
                />
                <AdminCard 
                    title="Enregistrer Absence" 
                    icon={ExclamationTriangleIcon} 
                    description="Enregistrer une absence de mannequin."
                    color="red"
                    onClick={() => {/* TODO: Ouvrir modal absence */}}
                />
                <AdminCard 
                    title="Générer Rapport" 
                    icon={DocumentTextIcon} 
                    description="Créer un rapport financier mensuel."
                    color="purple"
                    onClick={() => {/* TODO: Ouvrir modal rapport */}}
                />
            </div>

            {/* Contenu selon la section active */}
            {activeSection === 'payments' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Paiements ({pendingPayments} en attente)
                    </h3>
                    
                    {pendingPayments === 0 ? (
                        <div className="text-center py-12">
                            <CurrencyDollarIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <p className="text-pm-off-white/70 text-lg">
                                Aucun paiement en attente.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(data as any)?.monthlyPayments?.slice(0, 10).map((payment: any, index: number) => (
                                <div key={index} className={`p-4 rounded-lg border ${
                                    payment.status === 'En attente' 
                                        ? 'border-orange-500/40 bg-orange-500/5' 
                                        : 'border-pm-gold/10 bg-black/30'
                                }`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-pm-gold font-medium">{payment.modelName || 'Mannequin'}</h4>
                                            <p className="text-pm-off-white/70 text-sm">
                                                {payment.month} {payment.year}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-semibold text-pm-gold">
                                                {payment.amount?.toLocaleString()} FCFA
                                            </p>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                payment.status === 'En attente' 
                                                    ? 'bg-orange-500/20 text-orange-400' 
                                                    : 'bg-green-500/20 text-green-400'
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                                            Marquer payé
                                        </button>
                                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30">
                                            Générer facture
                                        </button>
                                        <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'bookings' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Réservations ({newBookingRequests} en attente)
                    </h3>
                    
                    {newBookingRequests === 0 ? (
                        <div className="text-center py-12">
                            <CalendarIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <p className="text-pm-off-white/70 text-lg">
                                Aucune réservation en attente.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(data as any)?.bookingRequests?.slice(0, 10).map((booking: any, index: number) => (
                                <div key={index} className="p-4 rounded-lg border border-pm-gold/10 bg-black/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-pm-gold font-medium">{booking.modelName || 'Mannequin'}</h4>
                                            <p className="text-pm-off-white/70 text-sm">
                                                {booking.date} - {booking.time}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                                            {booking.status}
                                        </span>
                                    </div>
                                    <p className="text-pm-off-white/80 mb-3">{booking.description}</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                                            Confirmer
                                        </button>
                                        <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded hover:bg-red-500/30">
                                            Refuser
                                        </button>
                                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30">
                                            Modifier
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'absences' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Absences ({totalAbsences} enregistrées)
                    </h3>
                    
                    {totalAbsences === 0 ? (
                        <div className="text-center py-12">
                            <ExclamationTriangleIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                            <p className="text-pm-off-white/70 text-lg">
                                Aucune absence enregistrée.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {(data as any)?.absences?.slice(0, 10).map((absence: any, index: number) => (
                                <div key={index} className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-pm-gold font-medium">{absence.modelName || 'Mannequin'}</h4>
                                            <p className="text-pm-off-white/70 text-sm">
                                                {absence.date} - {absence.reason}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                                            {absence.status}
                                        </span>
                                    </div>
                                    <p className="text-pm-off-white/80 mb-3">{absence.notes}</p>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded hover:bg-green-500/30">
                                            Justifier
                                        </button>
                                        <button className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded hover:bg-blue-500/30">
                                            Modifier
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeSection === 'reports' && (
                <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
                    <h3 className="text-xl font-playfair text-pm-gold mb-4">
                        Rapports Financiers
                    </h3>
                    <div className="text-center py-12">
                        <ChartBarIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
                        <p className="text-pm-off-white/70 text-lg mb-4">
                            Génération de rapports à implémenter
                        </p>
                        <button className="px-6 py-2 bg-pm-gold text-black rounded-lg hover:bg-pm-gold/90 transition-colors">
                            Générer un rapport
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default AdminFinance;
