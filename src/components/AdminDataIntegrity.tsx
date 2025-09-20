import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useAdminDataSync } from '../services/adminDataSync';
import { 
    CheckCircleIcon, 
    ExclamationTriangleIcon, 
    XCircleIcon,
    ArrowPathIcon,
    InformationCircleIcon
} from '@heroicons/react/24/outline';

interface DataIntegrityCheck {
    status: 'success' | 'warning' | 'error';
    message: string;
    details?: string;
    action?: string;
}

const AdminDataIntegrity: React.FC = () => {
    const { data } = useData();
    const { syncAllData, generateReport } = useAdminDataSync();
    const [checks, setChecks] = useState<DataIntegrityCheck[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);

    useEffect(() => {
        runIntegrityChecks();
    }, [data]);

    const runIntegrityChecks = async () => {
        setIsRunning(true);
        const newChecks: DataIntegrityCheck[] = [];

        try {
            // Vérifier la synchronisation des données
            const syncData = await syncAllData();
            const report = generateReport(syncData);

            // Vérifier les mannequins
            if (syncData.models.total === 0) {
                newChecks.push({
                    status: 'warning',
                    message: 'Aucun mannequin trouvé',
                    details: 'Il est recommandé d\'ajouter des mannequins pour commencer',
                    action: 'Ajouter des mannequins'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: `${syncData.models.total} mannequin(s) trouvé(s)`,
                    details: `${syncData.models.active} actif(s), ${syncData.models.inactive} inactif(s)`
                });
            }

            // Vérifier les données financières
            if (syncData.financial.totalRevenue === 0) {
                newChecks.push({
                    status: 'warning',
                    message: 'Aucune donnée financière',
                    details: 'Les transactions comptables sont vides',
                    action: 'Ajouter des transactions'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: `Revenus totaux: ${syncData.financial.totalRevenue.toLocaleString()} FCFA`,
                    details: `Bénéfice net: ${syncData.financial.netProfit.toLocaleString()} FCFA`
                });
            }

            // Vérifier les candidatures
            if (syncData.applications.castingApplications === 0 && syncData.applications.fashionDayApplications === 0) {
                newChecks.push({
                    status: 'warning',
                    message: 'Aucune candidature trouvée',
                    details: 'Aucune candidature de casting ou Fashion Day',
                    action: 'Vérifier les formulaires'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: `${syncData.applications.castingApplications + syncData.applications.fashionDayApplications} candidature(s)`,
                    details: `${syncData.applications.newApplications} nouvelle(s), ${syncData.applications.pendingApplications} en attente`
                });
            }

            // Vérifier les messages
            if (syncData.communication.totalMessages === 0) {
                newChecks.push({
                    status: 'warning',
                    message: 'Aucun message de contact',
                    details: 'Aucun message reçu via le formulaire de contact',
                    action: 'Tester le formulaire de contact'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: `${syncData.communication.totalMessages} message(s) reçu(s)`,
                    details: `${syncData.communication.unreadMessages} non lu(s)`
                });
            }

            // Vérifier les événements
            if (syncData.events.totalEvents === 0) {
                newChecks.push({
                    status: 'warning',
                    message: 'Aucun événement configuré',
                    details: 'Aucun Perfect Fashion Day trouvé',
                    action: 'Ajouter des événements'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: `${syncData.events.totalEvents} événement(s)`,
                    details: `${syncData.events.upcomingEvents} à venir, ${syncData.events.completedEvents} terminé(s)`
                });
            }

            // Vérifier le contenu
            if (syncData.content.totalArticles === 0) {
                newChecks.push({
                    status: 'warning',
                    message: 'Aucun article de magazine',
                    details: 'Le magazine est vide',
                    action: 'Ajouter des articles'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: `${syncData.content.totalArticles} article(s)`,
                    details: `${syncData.content.publishedArticles} publié(s), ${syncData.content.totalAlbums} album(s)`
                });
            }

            // Vérifier la santé générale
            const healthScore = calculateHealthScore(syncData);
            if (healthScore < 0.5) {
                newChecks.push({
                    status: 'error',
                    message: 'Santé des données faible',
                    details: `Score: ${(healthScore * 100).toFixed(1)}%`,
                    action: 'Améliorer la qualité des données'
                });
            } else if (healthScore < 0.8) {
                newChecks.push({
                    status: 'warning',
                    message: 'Santé des données moyenne',
                    details: `Score: ${(healthScore * 100).toFixed(1)}%`,
                    action: 'Optimiser les données'
                });
            } else {
                newChecks.push({
                    status: 'success',
                    message: 'Santé des données excellente',
                    details: `Score: ${(healthScore * 100).toFixed(1)}%`
                });
            }

            setLastSync(new Date().toISOString());
        } catch (error) {
            newChecks.push({
                status: 'error',
                message: 'Erreur lors de la vérification',
                details: error instanceof Error ? error.message : 'Erreur inconnue',
                action: 'Réessayer'
            });
        }

        setChecks(newChecks);
        setIsRunning(false);
    };

    const calculateHealthScore = (syncData: any): number => {
        let score = 0;
        let factors = 0;

        // Facteur mannequins (30%)
        if (syncData.models.total > 0) {
            score += 0.3;
        }
        factors += 0.3;

        // Facteur financier (25%)
        if (syncData.financial.totalRevenue > 0) {
            score += 0.25;
        }
        factors += 0.25;

        // Facteur communication (20%)
        if (syncData.communication.totalMessages > 0) {
            score += 0.2;
        }
        factors += 0.2;

        // Facteur contenu (15%)
        if (syncData.content.totalArticles > 0) {
            score += 0.15;
        }
        factors += 0.15;

        // Facteur événements (10%)
        if (syncData.events.totalEvents > 0) {
            score += 0.1;
        }
        factors += 0.1;

        return factors > 0 ? score / factors : 0;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'warning':
                return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
            case 'error':
                return <XCircleIcon className="w-5 h-5 text-red-400" />;
            default:
                return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'border-green-500/20 bg-green-500/5';
            case 'warning':
                return 'border-yellow-500/20 bg-yellow-500/5';
            case 'error':
                return 'border-red-500/20 bg-red-500/5';
            default:
                return 'border-gray-500/20 bg-gray-500/5';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-pm-gold">Intégrité des Données</h3>
                <button
                    onClick={runIntegrityChecks}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-pm-gold/10 border border-pm-gold/20 rounded-lg text-pm-gold hover:bg-pm-gold/20 transition-colors disabled:opacity-50"
                >
                    <ArrowPathIcon className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                    {isRunning ? 'Vérification...' : 'Vérifier'}
                </button>
            </div>

            {lastSync && (
                <p className="text-sm text-pm-off-white/60">
                    Dernière vérification: {new Date(lastSync).toLocaleString('fr-FR')}
                </p>
            )}

            <div className="space-y-3">
                {checks.map((check, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-lg border ${getStatusColor(check.status)}`}
                    >
                        <div className="flex items-start gap-3">
                            {getStatusIcon(check.status)}
                            <div className="flex-1">
                                <p className="font-medium text-pm-off-white">{check.message}</p>
                                {check.details && (
                                    <p className="text-sm text-pm-off-white/70 mt-1">{check.details}</p>
                                )}
                                {check.action && (
                                    <button className="text-sm text-pm-gold hover:text-pm-gold/80 mt-2">
                                        {check.action} →
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {checks.length === 0 && !isRunning && (
                <div className="text-center py-8 text-pm-off-white/60">
                    <InformationCircleIcon className="w-12 h-12 mx-auto mb-4 text-pm-gold/50" />
                    <p>Aucune vérification effectuée</p>
                    <p className="text-sm">Cliquez sur "Vérifier" pour analyser l'intégrité des données</p>
                </div>
            )}
        </div>
    );
};

export default AdminDataIntegrity;
