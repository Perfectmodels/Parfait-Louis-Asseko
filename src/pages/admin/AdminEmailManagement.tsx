import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, 
    EnvelopeIcon, 
    TrashIcon, 
    EyeIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentDuplicateIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import SEO from '../../components/SEO';
import EmailManagementNav from '../../components/EmailManagementNav';
import { 
    getEmailLogs, 
    deleteEmailLogs, 
    getEmailStats, 
    sendEmail,
    EmailLog, 
    EmailData,
    EmailType 
} from '../../services/emailService';

const AdminEmailManagement: React.FC = () => {
    const [emailLogs, setEmailLogs] = useState<EmailLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<EmailLog[]>([]);
    const [stats, setStats] = useState(getEmailStats());
    const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [composeData, setComposeData] = useState<Partial<EmailData>>({
        to: '',
        subject: '',
        content: '',
        htmlContent: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Charger les logs au montage
    useEffect(() => {
        loadEmailLogs();
    }, []);

    // Filtrer les logs
    useEffect(() => {
        let filtered = [...emailLogs];

        if (searchTerm) {
            filtered = filtered.filter(log => 
                log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (Array.isArray(log.to) ? log.to.join(', ') : log.to).toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(log => log.status === statusFilter);
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(log => log.emailType === typeFilter);
        }

        setFilteredLogs(filtered);
    }, [emailLogs, searchTerm, statusFilter, typeFilter]);

    const loadEmailLogs = () => {
        const logs = getEmailLogs();
        setEmailLogs(logs);
        setStats(getEmailStats());
    };

    const handleDeleteLogs = (logIds?: string[]) => {
        if (!logIds) {
            if (!window.confirm('Êtes-vous sûr de vouloir supprimer tous les logs d\'emails ?')) {
                return;
            }
        } else {
            if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${logIds.length} log(s) ?`)) {
                return;
            }
        }

        const success = deleteEmailLogs(logIds);
        if (success) {
            loadEmailLogs();
            setSelectedLogs([]);
        }
    };

    const handleSelectLog = (logId: string) => {
        setSelectedLogs(prev => 
            prev.includes(logId) 
                ? prev.filter(id => id !== logId)
                : [...prev, logId]
        );
    };

    const handleSelectAll = () => {
        if (selectedLogs.length === filteredLogs.length) {
            setSelectedLogs([]);
        } else {
            setSelectedLogs(filteredLogs.map(log => log.id));
        }
    };

    const handleSendEmail = async () => {
        if (!composeData.to || !composeData.subject || !composeData.content) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        setIsLoading(true);
        try {
            const result = await sendEmail(composeData as EmailData, 'custom');
            if (result.success) {
                alert('Email envoyé avec succès !');
                setShowComposeModal(false);
                setComposeData({ to: '', subject: '', content: '', htmlContent: '' });
                loadEmailLogs();
            } else {
                alert(`Erreur lors de l'envoi: ${result.error}`);
            }
        } catch (error) {
            alert(`Erreur: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: EmailLog['status']) => {
        switch (status) {
            case 'sent':
                return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'failed':
                return <XCircleIcon className="w-5 h-5 text-red-400" />;
            case 'pending':
                return <ClockIcon className="w-5 h-5 text-yellow-400" />;
            case 'scheduled':
                return <CalendarIcon className="w-5 h-5 text-blue-400" />;
            default:
                return <ExclamationTriangleIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: EmailLog['status']) => {
        switch (status) {
            case 'sent':
                return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'failed':
                return 'bg-red-500/20 text-red-300 border-red-500/50';
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'scheduled':
                return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            default:
                return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Gestion des Emails" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold flex items-center gap-3">
                        <EnvelopeIcon className="w-10 h-10" />
                        Gestion des Emails
                    </h1>
                    <p className="text-pm-off-white/70 mt-2">Gérez l'envoi d'emails et consultez les logs</p>
                </div>

                {/* Navigation secondaire pour les emails */}
                <EmailManagementNav className="mb-8" />

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-black p-6 border border-pm-gold/10 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pm-off-white/70 text-sm">Total Emails</p>
                                <p className="text-2xl font-bold text-pm-gold">{stats.total}</p>
                            </div>
                            <ChartBarIcon className="w-8 h-8 text-pm-gold/50" />
                        </div>
                    </div>
                    
                    <div className="bg-black p-6 border border-green-500/10 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pm-off-white/70 text-sm">Envoyés</p>
                                <p className="text-2xl font-bold text-green-400">{stats.sent}</p>
                            </div>
                            <CheckCircleIcon className="w-8 h-8 text-green-400/50" />
                        </div>
                    </div>
                    
                    <div className="bg-black p-6 border border-red-500/10 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pm-off-white/70 text-sm">Échecs</p>
                                <p className="text-2xl font-bold text-red-400">{stats.failed}</p>
                            </div>
                            <XCircleIcon className="w-8 h-8 text-red-400/50" />
                        </div>
                    </div>
                    
                    <div className="bg-black p-6 border border-blue-500/10 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-pm-off-white/70 text-sm">Taux de Réussite</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.successRate.toFixed(1)}%</p>
                            </div>
                            <ChartBarIcon className="w-8 h-8 text-blue-400/50" />
                        </div>
                    </div>
                </div>

                {/* Actions et Filtres */}
                <div className="bg-black p-6 border border-pm-gold/10 rounded-lg mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Recherche */}
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-pm-gold/50" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par sujet ou destinataire..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            {/* Filtres */}
                            <div className="flex gap-2">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="sent">Envoyés</option>
                                    <option value="failed">Échecs</option>
                                    <option value="pending">En attente</option>
                                    <option value="scheduled">Programmés</option>
                                </select>

                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="contact">Contact</option>
                                    <option value="booking">Réservation</option>
                                    <option value="payment">Paiement</option>
                                    <option value="news">Actualités</option>
                                    <option value="custom">Personnalisé</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowComposeModal(true)}
                                className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Nouvel Email
                            </button>

                            {selectedLogs.length > 0 && (
                                <button
                                    onClick={() => handleDeleteLogs(selectedLogs)}
                                    className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Supprimer ({selectedLogs.length})
                                </button>
                            )}

                            <button
                                onClick={() => handleDeleteLogs()}
                                className="px-4 py-2 bg-red-800 text-white font-bold rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Tout Supprimer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des logs */}
                <div className="bg-black border border-pm-gold/10 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-pm-gold/10">
                                <tr>
                                    <th className="px-6 py-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedLogs.length === filteredLogs.length && filteredLogs.length > 0}
                                            onChange={handleSelectAll}
                                            className="rounded border-pm-gold/20 text-pm-gold focus:ring-pm-gold"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-left text-pm-gold font-bold">Statut</th>
                                    <th className="px-6 py-4 text-left text-pm-gold font-bold">Type</th>
                                    <th className="px-6 py-4 text-left text-pm-gold font-bold">Destinataire</th>
                                    <th className="px-6 py-4 text-left text-pm-gold font-bold">Sujet</th>
                                    <th className="px-6 py-4 text-left text-pm-gold font-bold">Date</th>
                                    <th className="px-6 py-4 text-left text-pm-gold font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-black/20 transition-colors border-t border-pm-gold/10">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedLogs.includes(log.id)}
                                                onChange={() => handleSelectLog(log.id)}
                                                className="rounded border-pm-gold/20 text-pm-gold focus:ring-pm-gold"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(log.status)}
                                                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(log.status)}`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-pm-gold/20 text-pm-gold border border-pm-gold/50">
                                                {log.emailType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {Array.isArray(log.to) ? log.to.join(', ') : log.to}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {log.subject}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-pm-off-white/70">
                                            {new Date(log.timestamp).toLocaleString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {log.error && (
                                                    <button
                                                        onClick={() => alert(`Erreur: ${log.error}`)}
                                                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                        title="Voir l'erreur"
                                                    >
                                                        <ExclamationTriangleIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteLogs([log.id])}
                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredLogs.length === 0 && (
                        <div className="text-center py-12">
                            <EnvelopeIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                            <p className="text-pm-off-white/70">Aucun email trouvé</p>
                        </div>
                    )}
                </div>

                {/* Modal de composition d'email */}
                {showComposeModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-pm-gold/10">
                                <h3 className="text-xl font-bold text-pm-gold">Nouvel Email</h3>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Destinataire(s) *
                                    </label>
                                    <input
                                        type="text"
                                        value={composeData.to}
                                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                                        placeholder="email@example.com ou email1@example.com,email2@example.com"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Sujet *
                                    </label>
                                    <input
                                        type="text"
                                        value={composeData.subject}
                                        onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                                        placeholder="Sujet de l'email"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        value={composeData.content}
                                        onChange={(e) => setComposeData({...composeData, content: e.target.value})}
                                        rows={6}
                                        placeholder="Contenu de l'email"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Contenu HTML (optionnel)
                                    </label>
                                    <textarea
                                        value={composeData.htmlContent || ''}
                                        onChange={(e) => setComposeData({...composeData, htmlContent: e.target.value})}
                                        rows={6}
                                        placeholder="Contenu HTML de l'email"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-pm-gold/10 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowComposeModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSendEmail}
                                    disabled={isLoading}
                                    className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Envoi...' : 'Envoyer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEmailManagement;
