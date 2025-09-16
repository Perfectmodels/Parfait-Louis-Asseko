import React from 'react';
import { PaymentWarning } from '../types';
import { ExclamationTriangleIcon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PaymentWarningAlertProps {
  warnings: PaymentWarning[];
  onDismissWarning: (warningId: string) => void;
}

const PaymentWarningAlert: React.FC<PaymentWarningAlertProps> = ({ 
  warnings, 
  onDismissWarning 
}) => {
  const unreadWarnings = warnings.filter(w => !w.isRead);
  
  if (unreadWarnings.length === 0) {
    return null;
  }

  const getWarningStyle = (type: PaymentWarning['type']) => {
    switch (type) {
      case 'overdue':
        return {
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-300',
          iconColor: 'text-red-400'
        };
      case 'final_notice':
        return {
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          textColor: 'text-orange-300',
          iconColor: 'text-orange-400'
        };
      default:
        return {
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-300',
          iconColor: 'text-yellow-400'
        };
    }
  };

  return (
    <div className="space-y-3">
      {unreadWarnings.map((warning) => {
        const style = getWarningStyle(warning.type);
        return (
          <div
            key={warning.id}
            className={`${style.bgColor} ${style.borderColor} border rounded-lg p-4 relative`}
          >
            <div className="flex items-start gap-3">
              <div className={`${style.iconColor} flex-shrink-0 mt-0.5`}>
                {warning.type === 'overdue' ? (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                ) : (
                  <BellIcon className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`${style.textColor} font-medium mb-1`}>
                  {warning.type === 'overdue' && 'Paiement en retard'}
                  {warning.type === 'final_notice' && 'Dernier rappel'}
                  {warning.type === 'reminder' && 'Rappel de paiement'}
                </div>
                <p className={`${style.textColor} text-sm`}>
                  {warning.message}
                </p>
                <div className={`${style.textColor} text-xs mt-2 opacity-75`}>
                  {new Date(warning.date).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <button
                onClick={() => onDismissWarning(warning.id)}
                className={`${style.textColor} hover:opacity-75 transition-opacity flex-shrink-0`}
                title="Marquer comme lu"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentWarningAlert;
