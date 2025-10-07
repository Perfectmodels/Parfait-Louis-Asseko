import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { 
  CurrencyDollarIcon, 
  DocumentTextIcon, 
  ShoppingCartIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';

const AdminFinance: React.FC = () => {
  const { data } = useData();

  // Calcul des statistiques financières
  const stats = useMemo(() => {
    const payments = data?.monthlyPayments || [];
    const invoices = data?.invoices || [];
    const expenses = data?.expenses || [];

    // Revenus totaux (paiements approuvés)
    const totalRevenue = payments
      .filter(p => p.status === 'Approuvé')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Paiements en attente
    const pendingPayments = payments
      .filter(p => p.status === 'En attente')
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Factures impayées
    const unpaidInvoices = invoices
      .filter(i => i.status === 'Impayée')
      .reduce((sum, i) => sum + (Number(i.amount) || 0), 0);

    // Dépenses totales
    const totalExpenses = expenses
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    // Bénéfice net
    const netProfit = totalRevenue - totalExpenses;

    // Revenus ce mois
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = payments
      .filter(p => {
        const date = new Date(p.date);
        return p.status === 'Approuvé' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    // Dépenses ce mois
    const monthlyExpenses = expenses
      .filter(e => {
        const date = new Date(e.date);
        return date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      })
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    return {
      totalRevenue,
      pendingPayments,
      unpaidInvoices,
      totalExpenses,
      netProfit,
      monthlyRevenue,
      monthlyExpenses,
      paymentsCount: payments.length,
      invoicesCount: invoices.length,
      expensesCount: expenses.length
    };
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  return (
    <AdminLayout>
      <AdminPageHeader 
        title="Gestion Financière" 
        subtitle="Vue d'ensemble et gestion complète des finances de l'agence"
      />

      {/* Statistiques principales */}
      <AdminSection title="Vue d'ensemble">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus Totaux</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.paymentsCount} paiement(s)
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dépenses Totales</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalExpenses)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.expensesCount} dépense(s)
                </p>
              </div>
              <ArrowTrendingDownIcon className="w-12 h-12 text-red-600 opacity-20" />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bénéfice Net</p>
                <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.netProfit)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.netProfit >= 0 ? 'Positif' : 'Négatif'}
                </p>
              </div>
              <ChartBarIcon className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Attente</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(stats.pendingPayments)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Paiements à valider
                </p>
              </div>
              <BanknotesIcon className="w-12 h-12 text-yellow-600 opacity-20" />
            </div>
          </AdminCard>
        </div>
      </AdminSection>

      {/* Statistiques mensuelles */}
      <AdminSection title="Ce Mois-ci">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AdminCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus du Mois</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.monthlyRevenue)}
                </p>
              </div>
              <ArrowTrendingUpIcon className="w-10 h-10 text-green-600 opacity-20" />
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dépenses du Mois</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.monthlyExpenses)}
                </p>
              </div>
              <ArrowTrendingDownIcon className="w-10 h-10 text-red-600 opacity-20" />
            </div>
          </AdminCard>
        </div>
      </AdminSection>

      {/* Accès rapides */}
      <AdminSection title="Gestion">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/admin/payments" className="block">
            <AdminCard className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center py-6">
                <CurrencyDollarIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Paiements</h3>
                <p className="text-sm text-gray-600">Gérer les paiements mensuels</p>
              </div>
            </AdminCard>
          </Link>

          <Link to="/admin/invoices" className="block">
            <AdminCard className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center py-6">
                <DocumentTextIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Factures</h3>
                <p className="text-sm text-gray-600">Créer et gérer les factures</p>
                {stats.unpaidInvoices > 0 && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                    {formatCurrency(stats.unpaidInvoices)} impayées
                  </span>
                )}
              </div>
            </AdminCard>
          </Link>

          <Link to="/admin/expenses" className="block">
            <AdminCard className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center py-6">
                <ShoppingCartIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Dépenses</h3>
                <p className="text-sm text-gray-600">Enregistrer les dépenses</p>
              </div>
            </AdminCard>
          </Link>

          <Link to="/admin/financial-reports" className="block">
            <AdminCard className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center py-6">
                <ChartBarIcon className="w-12 h-12 text-pm-gold mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Rapports</h3>
                <p className="text-sm text-gray-600">Générer des rapports</p>
              </div>
            </AdminCard>
          </Link>
        </div>
      </AdminSection>

      {/* Alertes */}
      {(stats.pendingPayments > 0 || stats.unpaidInvoices > 0) && (
        <AdminSection title="Alertes">
          <div className="space-y-4">
            {stats.pendingPayments > 0 && (
              <AdminCard className="bg-yellow-50 border-yellow-200">
                <div className="flex items-center gap-4">
                  <BanknotesIcon className="w-8 h-8 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Paiements en attente</h4>
                    <p className="text-sm text-yellow-700">
                      {formatCurrency(stats.pendingPayments)} à valider
                    </p>
                  </div>
                  <Link 
                    to="/admin/payments" 
                    className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Traiter
                  </Link>
                </div>
              </AdminCard>
            )}

            {stats.unpaidInvoices > 0 && (
              <AdminCard className="bg-red-50 border-red-200">
                <div className="flex items-center gap-4">
                  <DocumentTextIcon className="w-8 h-8 text-red-600" />
                  <div>
                    <h4 className="font-semibold text-red-900">Factures impayées</h4>
                    <p className="text-sm text-red-700">
                      {formatCurrency(stats.unpaidInvoices)} en attente
                    </p>
                  </div>
                  <Link 
                    to="/admin/invoices" 
                    className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Voir
                  </Link>
                </div>
              </AdminCard>
            )}
          </div>
        </AdminSection>
      )}
    </AdminLayout>
  );
};

export default AdminFinance;

