import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { AuditLog, LoginLog } from '../../types';
import { Shield, User, Clock, AlertTriangle, Search, Download, Activity, LogIn, FileText, CheckCircle, XCircle } from 'lucide-react';

const AdminAudit: React.FC = () => {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState<'audit' | 'login'>('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Générer des logs d'exemple basés sur les données existantes
  const auditLogs: AuditLog[] = useMemo(() => {
    const logs: AuditLog[] = [];
    
    // Logs pour les modèles
    data?.models?.forEach(model => {
      if (model.lastLogin) {
        logs.push({
          id: `audit-model-${model.id}`,
          userId: model.id,
          userName: model.name,
          action: 'LOGIN',
          entity: 'authentication',
          timestamp: model.lastLogin,
          severity: 'info'
        });
      }
    });

    // Logs pour les articles
    data?.articles?.forEach(article => {
      logs.push({
        id: `audit-article-${article.slug}`,
        userId: 'admin',
        userName: 'Administrateur',
        action: 'CREATE',
        entity: 'article',
        entityId: article.slug,
        timestamp: article.date,
        severity: 'info'
      });
    });

    // Logs pour les paiements
    data?.monthlyPayments?.forEach(payment => {
      logs.push({
        id: `audit-payment-${payment.id}`,
        userId: 'admin',
        userName: 'Administrateur',
        action: payment.status === 'Payé' ? 'PAYMENT_APPROVED' : 'PAYMENT_CREATED',
        entity: 'payment',
        entityId: payment.id,
        timestamp: payment.paymentDate || new Date().toISOString(),
        severity: payment.status === 'En retard' ? 'warning' : 'info',
        changes: [{
          field: 'amount',
          oldValue: null,
          newValue: payment.amount
        }]
      });
    });

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data]);

  const loginLogs: LoginLog[] = useMemo(() => {
    const logs: LoginLog[] = [];
    
    data?.models?.forEach(model => {
      if (model.lastLogin) {
        logs.push({
          id: `login-${model.id}-success`,
          userId: model.id,
          userName: model.name,
          success: true,
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0',
          timestamp: model.lastLogin
        });
      }
    });

    return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [data]);

  // Filtrer les logs
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    const matchesEntity = filterEntity === 'all' || log.entity === filterEntity;
    
    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = new Date(log.timestamp) >= new Date(dateRange.start);
    }
    if (dateRange.end && matchesDate) {
      matchesDate = new Date(log.timestamp) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesSeverity && matchesEntity && matchesDate;
  });

  const filteredLoginLogs = loginLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = new Date(log.timestamp) >= new Date(dateRange.start);
    }
    if (dateRange.end && matchesDate) {
      matchesDate = new Date(log.timestamp) <= new Date(dateRange.end);
    }
    
    return matchesSearch && matchesDate;
  });

  const severityConfig = {
    info: { color: 'bg-blue-100 text-blue-800', icon: Activity },
    warning: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
    critical: { color: 'bg-red-100 text-red-800', icon: AlertTriangle }
  };

  const actionColors: { [key: string]: string } = {
    CREATE: 'text-green-600',
    UPDATE: 'text-blue-600',
    DELETE: 'text-red-600',
    LOGIN: 'text-purple-600',
    LOGOUT: 'text-gray-600',
    PAYMENT_APPROVED: 'text-green-600',
    PAYMENT_CREATED: 'text-blue-600'
  };

  const handleExportLogs = () => {
    const logs = activeTab === 'audit' ? filteredAuditLogs : filteredLoginLogs;
    const csv = [
      activeTab === 'audit'
        ? ['Date', 'Utilisateur', 'Action', 'Entité', 'Sévérité'].join(',')
        : ['Date', 'Utilisateur', 'Succès', 'IP', 'User Agent'].join(','),
      ...logs.map(log => {
        if (activeTab === 'audit') {
          const auditLog = log as AuditLog;
          return [
            new Date(auditLog.timestamp).toLocaleString('fr-FR'),
            auditLog.userName,
            auditLog.action,
            auditLog.entity,
            auditLog.severity || 'info'
          ].join(',');
        } else {
          const loginLog = log as LoginLog;
          return [
            new Date(loginLog.timestamp).toLocaleString('fr-FR'),
            loginLog.userName,
            loginLog.success ? 'Oui' : 'Non',
            loginLog.ipAddress,
            loginLog.userAgent
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const stats = {
    totalAuditLogs: auditLogs.length,
    criticalLogs: auditLogs.filter(l => l.severity === 'critical').length,
    warningLogs: auditLogs.filter(l => l.severity === 'warning').length,
    totalLogins: loginLogs.length,
    failedLogins: loginLogs.filter(l => !l.success).length,
    uniqueUsers: new Set(auditLogs.map(l => l.userId)).size
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Audit & Logs</h1>
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-white rounded-lg hover:bg-opacity-90 transition"
            >
              <Download className="w-5 h-5" />
              Exporter
            </button>
          </div>
          <p className="text-gray-600">Traçabilité complète de toutes les actions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAuditLogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critiques</p>
                <p className="text-2xl font-bold text-red-600">{stats.criticalLogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avertissements</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.warningLogs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <LogIn className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Connexions</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Échecs</p>
                <p className="text-2xl font-bold text-red-600">{stats.failedLogins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-purple-600">{stats.uniqueUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'audit'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Logs d'Audit ({auditLogs.length})
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'login'
                  ? 'border-b-2 border-pm-gold text-pm-gold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Logs de Connexion ({loginLogs.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-md p-4 border-b">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold focus:border-transparent"
                />
              </div>
            </div>

            {activeTab === 'audit' && (
              <>
                <select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                >
                  <option value="all">Toutes sévérités</option>
                  <option value="info">Info</option>
                  <option value="warning">Avertissement</option>
                  <option value="critical">Critique</option>
                </select>

                <select
                  value={filterEntity}
                  onChange={(e) => setFilterEntity(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
                >
                  <option value="all">Toutes entités</option>
                  <option value="model">Mannequin</option>
                  <option value="article">Article</option>
                  <option value="payment">Paiement</option>
                  <option value="authentication">Authentification</option>
                </select>
              </>
            )}

            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              placeholder="Date début"
            />

            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pm-gold"
              placeholder="Date fin"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-xl shadow-md">
          {activeTab === 'audit' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Détails
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sévérité
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAuditLogs.map(log => {
                    const severity = log.severity || 'info';
                    const SeverityIcon = severityConfig[severity].icon;
                    
                    return (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            {log.userName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-medium ${actionColors[log.action] || 'text-gray-900'}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {log.entity}
                          {log.entityId && (
                            <span className="text-gray-500 ml-1">#{log.entityId}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {log.changes && log.changes.length > 0 && (
                            <div className="text-xs">
                              {log.changes.map((change, idx) => (
                                <div key={idx}>
                                  <span className="text-gray-600">{change.field}:</span>{' '}
                                  <span className="text-red-500 line-through">{change.oldValue}</span>{' '}
                                  →{' '}
                                  <span className="text-green-500">{change.newValue}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${severityConfig[severity].color}`}>
                            <SeverityIcon className="w-3 h-3" />
                            {severity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredAuditLogs.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun log trouvé</p>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date/Heure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Adresse IP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Agent
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLoginLogs.map(log => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {new Date(log.timestamp).toLocaleString('fr-FR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {log.userName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {log.success ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3" />
                            Succès
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="w-3 h-3" />
                            Échec
                            {log.failureReason && (
                              <span className="ml-1">({log.failureReason})</span>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className="truncate block max-w-xs" title={log.userAgent}>
                          {log.userAgent}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredLoginLogs.length === 0 && (
                <div className="text-center py-12">
                  <LogIn className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Aucun log de connexion trouvé</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAudit;
