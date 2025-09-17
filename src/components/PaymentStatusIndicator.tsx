import React from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { PaymentStatus } from '../types';

interface PaymentStatusIndicatorProps {
  paymentStatus?: PaymentStatus;
  showDetails?: boolean;
}

const PaymentStatusIndicator: React.FC<PaymentStatusIndicatorProps> = ({ 
  paymentStatus, 
  showDetails = false 
}) => {
  if (!paymentStatus) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-gray-500/20 border-gray-500/30">
        <XCircleIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-400">En attente (Aucun paiement)</span>
      </div>
    );
  }

  const getStatusInfo = () => {
    const now = new Date();
    const nextDueDate = paymentStatus.nextDueDate ? new Date(paymentStatus.nextDueDate) : null;
    const isOverdue = nextDueDate && nextDueDate < now;
    const hasWarnings = paymentStatus.warnings && paymentStatus.warnings.length > 0;
    
    // Vérifier si le mannequin a effectivement payé quelque chose
    const hasPaid = paymentStatus.lastPaymentDate && paymentStatus.amount && paymentStatus.amount > 0;
    
    // Si pas de paiement du tout, retourner "en attente"
    if (!hasPaid) {
      return {
        status: 'pending',
        label: 'En attente (Aucun paiement)',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/30',
        icon: XCircleIcon
      };
    }

    // Vérifier le type de paiement pour déterminer le statut
    if (paymentStatus.paymentType === 'cotisation_inscription') {
      // Pour cotisation + inscription, vérifier si les deux sont payés
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
        return {
          status: 'complete',
          label: 'À jour (Cotisation + Inscription)',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          icon: CheckCircleIcon
        };
      } else {
        return {
          status: 'partial',
          label: 'Partiel (Cotisation + Inscription)',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          icon: ExclamationTriangleIcon
        };
      }
    } else if (paymentStatus.paymentType === 'cotisation') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
        return {
          status: 'cotisation_only',
          label: 'À jour (Cotisation)',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/30',
          icon: CheckCircleIcon
        };
      } else {
        return {
          status: 'cotisation_pending',
          label: 'En attente (Cotisation)',
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/30',
          icon: ClockIcon
        };
      }
    } else if (paymentStatus.paymentType === 'inscription') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
        return {
          status: 'inscription_only',
          label: 'À jour (Inscription)',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500/30',
          icon: CheckCircleIcon
        };
      } else {
        return {
          status: 'inscription_pending',
          label: 'En attente (Inscription)',
          color: 'text-pink-400',
          bgColor: 'bg-pink-500/20',
          borderColor: 'border-pink-500/30',
          icon: ClockIcon
        };
      }
    } else if (paymentStatus.paymentType === 'avance') {
      if (paymentStatus.isUpToDate && !isOverdue && !hasWarnings) {
        return {
          status: 'advance',
          label: 'À jour (Avance)',
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-500/20',
          borderColor: 'border-indigo-500/30',
          icon: CheckCircleIcon
        };
      } else {
        return {
          status: 'advance_pending',
          label: 'En attente (Avance)',
          color: 'text-cyan-400',
          bgColor: 'bg-cyan-500/20',
          borderColor: 'border-cyan-500/30',
          icon: ClockIcon
        };
      }
    }

    // Statut par défaut
    if (isOverdue) {
      return {
        status: 'overdue',
        label: 'En retard',
        color: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
        icon: XCircleIcon
      };
    } else if (hasWarnings) {
      return {
        status: 'warning',
        label: 'Avertissement',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        icon: ExclamationTriangleIcon
      };
    } else {
      return {
        status: 'unknown',
        label: 'Statut inconnu',
        color: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/30',
        icon: ClockIcon
      };
    }
  };

  const statusInfo = getStatusInfo();
  const IconComponent = statusInfo.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusInfo.bgColor} ${statusInfo.borderColor}`}>
      <IconComponent className={`w-4 h-4 ${statusInfo.color}`} />
      <span className={`text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    </div>
  );
};

export default PaymentStatusIndicator;
