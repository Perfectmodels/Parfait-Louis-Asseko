import React, { useState, useEffect } from 'react';
import { XMarkIcon, CalendarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface PaymentScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
  modelName: string;
  paymentHistory: any[];
}

const PaymentScheduleModal: React.FC<PaymentScheduleModalProps> = ({
  isOpen,
  onClose,
  modelName,
  paymentHistory
}) => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | null>(null);

  // Calculer le planning des paiements
  useEffect(() => {
    if (!paymentHistory || paymentHistory.length === 0) return;

    const sortedPayments = paymentHistory.sort((a, b) => 
      new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime()
    );

    const schedule: any[] = [];
    let currentDate = new Date();

    // Analyser les paiements pour déterminer le planning
    sortedPayments.forEach(payment => {
      if (payment.paymentMethod === 'installments' && payment.installmentCount) {
        // Paiement par tranches
        for (let i = 1; i < payment.installmentCount; i++) {
          const paymentDate = new Date(currentDate);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          
          schedule.push({
            id: `installment_${payment.id}_${i}`,
            type: 'installment',
            amount: payment.amount,
            dueDate: paymentDate,
            status: 'pending',
            originalPayment: payment
          });
        }
      } else if (payment.paymentMethod === 'advance' && payment.advanceMonths) {
        // Paiement anticipé - calculer les mois couverts
        const startDate = new Date(payment.submissionDate);
        for (let i = 1; i <= payment.advanceMonths; i++) {
          const paymentDate = new Date(startDate);
          paymentDate.setMonth(paymentDate.getMonth() + i);
          
          schedule.push({
            id: `advance_${payment.id}_${i}`,
            type: 'advance_covered',
            amount: payment.amount / payment.advanceMonths,
            dueDate: paymentDate,
            status: 'paid',
            originalPayment: payment
          });
        }
        
        // Définir la prochaine date de paiement après la période d'avance
        const nextDate = new Date(startDate);
        nextDate.setMonth(nextDate.getMonth() + payment.advanceMonths + 1);
        setNextPaymentDate(nextDate);
      }
    });

    // Ajouter les cotisations mensuelles régulières
    const lastPayment = sortedPayments[sortedPayments.length - 1];
    if (lastPayment && lastPayment.type === 'cotisation') {
      const lastPaymentDate = new Date(lastPayment.submissionDate);
      const monthsSinceLastPayment = Math.floor(
        (currentDate.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      );
      
      // Ajouter les cotisations manquantes
      for (let i = 1; i <= monthsSinceLastPayment; i++) {
        const paymentDate = new Date(lastPaymentDate);
        paymentDate.setMonth(paymentDate.getMonth() + i);
        
        schedule.push({
          id: `monthly_${i}`,
          type: 'monthly',
          amount: 1500,
          dueDate: paymentDate,
          status: 'overdue'
        });
      }
    }

    setSchedule(schedule.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime()));
  }, [paymentHistory]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-500/20';
      case 'pending': return 'text-yellow-400 bg-yellow-500/20';
      case 'overdue': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'overdue': return 'En retard';
      default: return 'Inconnu';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-pm-dark border border-pm-gold/20 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-pm-gold/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-playfair text-pm-gold flex items-center gap-3">
              <CalendarIcon className="w-6 h-6" />
              Planning des Paiements - {modelName}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-pm-off-white/70 hover:text-pm-gold transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Prochaine date de paiement */}
          {nextPaymentDate && (
            <div className="bg-pm-gold/10 border border-pm-gold/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <ClockIcon className="w-6 h-6 text-pm-gold" />
                <div>
                  <h3 className="text-lg font-semibold text-pm-gold">Prochaine Échéance</h3>
                  <p className="text-pm-off-white">
                    {nextPaymentDate.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Résumé */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
              <div className="text-sm text-pm-off-white/70">Total des échéances</div>
              <div className="text-2xl font-bold text-pm-gold">{schedule.length}</div>
            </div>
            <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
              <div className="text-sm text-pm-off-white/70">Payées</div>
              <div className="text-2xl font-bold text-green-400">
                {schedule.filter(s => s.status === 'paid').length}
              </div>
            </div>
            <div className="bg-black/30 border border-pm-gold/20 rounded-lg p-4">
              <div className="text-sm text-pm-off-white/70">En retard</div>
              <div className="text-2xl font-bold text-red-400">
                {schedule.filter(s => s.status === 'overdue').length}
              </div>
            </div>
          </div>

          {/* Liste des échéances */}
          <div>
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Échéances</h3>
            <div className="space-y-3">
              {schedule.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-pm-gold/50 mx-auto mb-3" />
                  <p className="text-pm-off-white/70">Aucune échéance programmée</p>
                </div>
              ) : (
                schedule.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-black/30 border border-pm-gold/20 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'paid' ? 'bg-green-400' :
                        item.status === 'overdue' ? 'bg-red-400' :
                        'bg-yellow-400'
                      }`} />
                      <div>
                        <div className="font-semibold text-pm-off-white">
                          {item.type === 'installment' ? 'Tranche' :
                           item.type === 'advance_covered' ? 'Mois couvert' :
                           'Cotisation mensuelle'}
                        </div>
                        <div className="text-sm text-pm-off-white/70">
                          {item.dueDate.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-pm-gold">
                          {item.amount.toLocaleString()} FCFA
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                      {item.status === 'paid' && (
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScheduleModal;
