import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, FunnelIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import PaymentStatusIndicator from '../../components/PaymentStatusIndicator';

type SortField = 'name' | 'status' | 'lastPayment' | 'nextDue';
type SortDirection = 'asc' | 'desc';

const AdminPaymentStatus: React.FC = () => {
  const { data } = useData();
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Récupérer tous les mannequins avec leur statut de paiement
  const allModels = useMemo(() => {
    const models = [
      ...(data?.models || []),
      ...(data?.beginnerStudents?.map(student => ({
        id: student.id,
        name: student.name,
        username: student.matricule || student.name.toLowerCase().replace(/\s+/g, ''),
        level: 'Mannequin' as const,
        imageUrl: 'https://via.placeholder.com/400x600/D4AF37/FFFFFF?text=Model',
        paymentStatus: student.paymentStatus || {
          isUpToDate: false,
          nextDueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 1500,
          currency: 'FCFA',
          paymentType: 'cotisation' as const,
          description: 'Cotisation mensuelle',
          warnings: []
        }
      })) || [])
    ];

    return models.map(model => {
      const paymentStatus = model.paymentStatus;
      let statusCategory = 'unknown';
      
      if (paymentStatus) {
        const now = new Date();
        const nextDueDate = paymentStatus.nextDueDate ? new Date(paymentStatus.nextDueDate) : null;
        const isOverdue = nextDueDate && nextDueDate < now;
        const hasWarnings = paymentStatus.warnings && paymentStatus.warnings.length > 0;

        if (paymentStatus.paymentType === 'cotisation_inscription') {
          if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
            statusCategory = 'complete';
          } else {
            statusCategory = 'partial';
          }
        } else if (paymentStatus.paymentType === 'cotisation') {
          if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
            statusCategory = 'cotisation_only';
          } else {
            statusCategory = 'cotisation_pending';
          }
        } else if (paymentStatus.paymentType === 'inscription') {
          if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
            statusCategory = 'inscription_only';
          } else {
            statusCategory = 'inscription_pending';
          }
        } else if (paymentStatus.paymentType === 'avance') {
          if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
            statusCategory = 'advance';
          } else {
            statusCategory = 'advance_pending';
          }
        }

        if (isOverdue) statusCategory = 'overdue';
        if (hasWarnings) statusCategory = 'warning';
      }

      return {
        ...model,
        statusCategory
      };
    });
  }, [data]);

  // Statistiques par catégorie
  const stats = useMemo(() => {
    const categories = {
      complete: allModels.filter(m => m.statusCategory === 'complete').length,
      partial: allModels.filter(m => m.statusCategory === 'partial').length,
      cotisation_only: allModels.filter(m => m.statusCategory === 'cotisation_only').length,
      cotisation_pending: allModels.filter(m => m.statusCategory === 'cotisation_pending').length,
      inscription_only: allModels.filter(m => m.statusCategory === 'inscription_only').length,
      inscription_pending: allModels.filter(m => m.statusCategory === 'inscription_pending').length,
      advance: allModels.filter(m => m.statusCategory === 'advance').length,
      advance_pending: allModels.filter(m => m.statusCategory === 'advance_pending').length,
      overdue: allModels.filter(m => m.statusCategory === 'overdue').length,
      warning: allModels.filter(m => m.statusCategory === 'warning').length,
      unknown: allModels.filter(m => m.statusCategory === 'unknown').length
    };

    return categories;
  }, [allModels]);

  // Filtrage et tri
  const filteredAndSortedModels = useMemo(() => {
    let filtered = allModels;

    // Filtrage par statut
    if (filterStatus !== 'all') {
      filtered = allModels.filter(model => model.statusCategory === filterStatus);
    }

    // Tri
    return filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          // Ordre de priorité des statuts
          const statusOrder = {
            'complete': 1,
            'cotisation_only': 2,
            'inscription_only': 3,
            'advance': 4,
            'partial': 5,
            'cotisation_pending': 6,
            'inscription_pending': 7,
            'advance_pending': 8,
            'warning': 9,
            'overdue': 10,
            'unknown': 11
          };
          aValue = statusOrder[a.statusCategory as keyof typeof statusOrder] || 999;
          bValue = statusOrder[b.statusCategory as keyof typeof statusOrder] || 999;
          break;
        case 'lastPayment':
          aValue = a.paymentStatus?.lastPaymentDate ? new Date(a.paymentStatus.lastPaymentDate).getTime() : 0;
          bValue = b.paymentStatus?.lastPaymentDate ? new Date(b.paymentStatus.lastPaymentDate).getTime() : 0;
          break;
        case 'nextDue':
          aValue = a.paymentStatus?.nextDueDate ? new Date(a.paymentStatus.nextDueDate).getTime() : 0;
          bValue = b.paymentStatus?.nextDueDate ? new Date(b.paymentStatus.nextDueDate).getTime() : 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allModels, filterStatus, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusDescription = (statusCategory: string) => {
    switch (statusCategory) {
      case 'complete':
        return 'Cotisation et inscription à jour';
      case 'partial':
        return 'Paiement partiel (cotisation + inscription)';
      case 'cotisation_only':
        return 'Cotisation à jour, inscription manquante';
      case 'cotisation_pending':
        return 'Cotisation en attente';
      case 'inscription_only':
        return 'Inscription à jour, cotisation manquante';
      case 'inscription_pending':
        return 'Inscription en attente';
      case 'advance':
        return 'Paiement en avance à jour';
      case 'advance_pending':
        return 'Paiement en avance en attente';
      case 'overdue':
        return 'Paiement en retard';
      case 'warning':
        return 'Avertissement de paiement';
      default:
        return 'Statut inconnu';
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Statuts de Paiement" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Dashboard
            </Link>
            <h1 className="admin-page-title">Statuts de Paiement</h1>
            <p className="text-pm-off-white/60 mt-2">
              Vue d'ensemble des statuts de paiement de tous les mannequins
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{stats.complete}</div>
            <div className="text-sm text-green-300">Complets</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{stats.cotisation_only}</div>
            <div className="text-sm text-blue-300">Cotisation seule</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{stats.inscription_only}</div>
            <div className="text-sm text-purple-300">Inscription seule</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{stats.partial}</div>
            <div className="text-sm text-yellow-300">Partiels</div>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-orange-400">
              {stats.cotisation_pending + stats.inscription_pending + stats.advance_pending}
            </div>
            <div className="text-sm text-orange-300">En attente</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-400">{stats.overdue}</div>
            <div className="text-sm text-red-300">En retard</div>
          </div>
        </div>

        {/* Filtres et tri */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-pm-gold" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-pm-dark border border-pm-gold/20 rounded-lg px-3 py-2 text-pm-off-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="complete">Complets</option>
              <option value="cotisation_only">Cotisation seule</option>
              <option value="inscription_only">Inscription seule</option>
              <option value="partial">Partiels</option>
              <option value="cotisation_pending">Cotisation en attente</option>
              <option value="inscription_pending">Inscription en attente</option>
              <option value="advance_pending">Avance en attente</option>
              <option value="overdue">En retard</option>
              <option value="warning">Avertissements</option>
            </select>
          </div>
        </div>

        {/* Tableau des mannequins */}
        <div className="admin-section-wrapper">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 hover:text-pm-gold transition-colors"
                    >
                      Nom
                      {sortField === 'name' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 hover:text-pm-gold transition-colors"
                    >
                      Statut
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th>Détails</th>
                  <th>
                    <button
                      onClick={() => handleSort('lastPayment')}
                      className="flex items-center gap-2 hover:text-pm-gold transition-colors"
                    >
                      Dernier Paiement
                      {sortField === 'lastPayment' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th>
                    <button
                      onClick={() => handleSort('nextDue')}
                      className="flex items-center gap-2 hover:text-pm-gold transition-colors"
                    >
                      Prochaine Échéance
                      {sortField === 'nextDue' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedModels.map((model) => (
                  <tr key={model.id}>
                    <td className="font-semibold">{model.name}</td>
                    <td>
                      <PaymentStatusIndicator paymentStatus={model.paymentStatus} />
                    </td>
                    <td>
                      <div className="text-sm text-pm-off-white/80">
                        {getStatusDescription(model.statusCategory)}
                      </div>
                      {model.paymentStatus?.description && (
                        <div className="text-xs text-pm-off-white/60 mt-1">
                          {model.paymentStatus.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="text-sm text-pm-off-white/80">
                        {model.paymentStatus?.lastPaymentDate 
                          ? new Date(model.paymentStatus.lastPaymentDate).toLocaleDateString('fr-FR')
                          : 'Aucun'
                        }
                      </div>
                    </td>
                    <td>
                      <div className="text-sm text-pm-off-white/80">
                        {model.paymentStatus?.nextDueDate 
                          ? new Date(model.paymentStatus.nextDueDate).toLocaleDateString('fr-FR')
                          : 'Non défini'
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredAndSortedModels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-pm-off-white/60">Aucun mannequin trouvé avec ce filtre.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentStatus;
