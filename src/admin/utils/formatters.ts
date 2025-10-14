/**
 * Utilitaires de formatage pour l'admin
 */

export const formatDate = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatDateTime = (date: string | Date): string => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatStatus = (status: string): { text: string; color: string } => {
    const statusMap: Record<string, { text: string; color: string }> = {
        'Nouveau': { text: 'Nouveau', color: 'bg-blue-500/20 text-blue-300' },
        'En cours': { text: 'En cours', color: 'bg-yellow-500/20 text-yellow-300' },
        'Traité': { text: 'Traité', color: 'bg-green-500/20 text-green-300' },
        'Rejeté': { text: 'Rejeté', color: 'bg-red-500/20 text-red-300' },
        'Validé': { text: 'Validé', color: 'bg-green-500/20 text-green-300' },
        'Annulé': { text: 'Annulé', color: 'bg-gray-500/20 text-gray-300' }
    };

    return statusMap[status] || { text: status, color: 'bg-gray-500/20 text-gray-300' };
};

export const formatRole = (role: string): { text: string; color: string } => {
    const roleMap: Record<string, { text: string; color: string }> = {
        'admin': { text: 'Administrateur', color: 'bg-red-500/20 text-red-300' },
        'student': { text: 'Mannequin Pro', color: 'bg-pm-gold/20 text-pm-gold' },
        'beginner': { text: 'Débutant', color: 'bg-blue-500/20 text-blue-300' },
        'jury': { text: 'Jury', color: 'bg-purple-500/20 text-purple-300' },
        'registration': { text: 'Enregistrement', color: 'bg-teal-500/20 text-teal-300' }
    };

    return roleMap[role] || { text: role, color: 'bg-gray-500/20 text-gray-300' };
};

export const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatCurrency = (amount: number, currency: string = 'XAF'): string => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
    }).format(amount);
};