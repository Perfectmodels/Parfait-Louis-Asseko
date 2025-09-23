// Les icônes sont maintenant retournées comme des chaînes de caractères
// pour éviter les problèmes de compilation

export const statusLabels: Record<string, string> = {
    connected: 'Connecté',
    operational: 'Opérationnel',
    healthy: 'Sain',
    good: 'Bon',
    warning: 'Attention',
    error: 'Erreur',
    disabled: 'Désactivé',
    enabled: 'Activé',
    active: 'Actif',
    current: 'À jour',
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté'
};

export const getStatusColor = (status: string): string => {
    switch (status) {
        case 'operational':
        case 'enabled':
        case 'active':
        case 'current':
        case 'connected':
        case 'healthy':
        case 'good':
        case 'approved':
            return 'text-green-400 bg-green-500/20 border-green-500/30';
        case 'warning':
        case 'pending':
            return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
        case 'error':
        case 'disabled':
        case 'rejected':
            return 'text-red-400 bg-red-500/20 border-red-500/30';
        default:
            return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
};

export const getStatusIcon = (status: string) => {
    switch (status) {
        case 'operational':
        case 'enabled':
        case 'active':
        case 'current':
        case 'connected':
        case 'healthy':
        case 'good':
        case 'approved':
            return 'CheckCircleIcon';
        case 'warning':
        case 'pending':
            return 'ExclamationTriangleIcon';
        case 'error':
        case 'disabled':
        case 'rejected':
            return 'XCircleIcon';
        default:
            return 'CogIcon';
    }
};

export const getStatusText = (status: string): string => {
    return statusLabels[status] || status;
};
