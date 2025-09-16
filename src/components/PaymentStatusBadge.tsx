import React from 'react';
import { PaymentStatus } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface PaymentStatusBadgeProps {
  paymentStatus?: PaymentStatus;
  showDetails?: boolean;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ 
  paymentStatus, 
  showDetails = false 
}) => {
  if (!paymentStatus) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm">
        <ClockIcon className="w-4 h-4" />
        <span>Statut inconnu</span>
      </div>
    );
  }

  const isOverdue = paymentStatus.nextDueDate && 
    new Date(paymentStatus.nextDueDate) < new Date();

  const getStatusInfo = () => {
    if (paymentStatus.isUpToDate) {
      return {
        icon: CheckCircleIcon,
        text: 'À jour',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30'
      };
    } else if (isOverdue) {
      return {
        icon: ExclamationTriangleIcon,
        text: 'En retard',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30'
      };
    } else {
      return {
        icon: ClockIcon,
        text: 'En attente',
        bgColor: 'bg-yellow-500/20',
        textColor: 'text-yellow-400',
        borderColor: 'border-yellow-500/30'
      };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} border ${statusInfo.borderColor} rounded-full text-sm font-medium`}>
        <Icon className="w-4 h-4" />
        <span>{statusInfo.text}</span>
      </div>
      
      {showDetails && (
        <div className="text-xs text-pm-off-white/60">
          {paymentStatus.lastPaymentDate && (
            <div>Dernier paiement: {new Date(paymentStatus.lastPaymentDate).toLocaleDateString('fr-FR')}</div>
          )}
          {paymentStatus.nextDueDate && (
            <div>Prochaine échéance: {new Date(paymentStatus.nextDueDate).toLocaleDateString('fr-FR')}</div>
          )}
          {paymentStatus.amount && (
            <div>Montant: {paymentStatus.amount} {paymentStatus.currency || 'FCFA'}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentStatusBadge;
