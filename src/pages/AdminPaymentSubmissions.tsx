import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/outline';
import { PaymentSubmission, AccountingTransaction } from '../types';

const AdminPaymentSubmissions: React.FC = () => {
  const { data, saveData } = useData();
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  const submissions = data?.paymentSubmissions || [];
  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const approvedSubmissions = submissions.filter(s => s.status === 'approved');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  const handleApprove = async (submission: PaymentSubmission) => {
    if (!data) return;

    const confirmMessage = `Approuver le paiement de ${submission.modelName} pour ${submission.amount.toLocaleString()} FCFA (${submission.description}) ?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      // Mettre à jour le statut de la soumission
      const updatedSubmissions = submissions.map(s => 
        s.id === submission.id 
          ? { 
              ...s, 
              status: 'approved' as const,
              approvedAt: new Date().toISOString(),
              approvedBy: 'Admin', // TODO: Récupérer l'admin connecté
              adminNotes: adminNotes || 'Paiement approuvé'
            }
          : s
      );

      // Mettre à jour le statut de paiement du mannequin
      const updatedModels = (data.models || []).map(model => {
        if (model.id === submission.modelId) {
          let nextDueDate = new Date();
          
          if (submission.paymentType === 'cotisation') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (submission.paymentType === 'inscription') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (submission.paymentType === 'cotisation_inscription') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (submission.paymentType === 'avance') {
            const cotisationStandard = 1500;
            const moisAvance = Math.floor(submission.amount / cotisationStandard);
            nextDueDate.setMonth(nextDueDate.getMonth() + moisAvance);
          }

          return {
            ...model,
            paymentStatus: {
              ...model.paymentStatus,
              isUpToDate: true,
              lastPaymentDate: new Date().toISOString(),
              nextDueDate: nextDueDate.toISOString(),
              amount: submission.amount,
              currency: submission.currency,
              paymentMethod: submission.paymentMethod,
              notes: submission.notes,
              paymentType: submission.paymentType,
              description: submission.description,
              warnings: []
            }
          };
        }
        return model;
      });

      // Mettre à jour les étudiants débutants aussi
      const updatedBeginnerStudents = (data.beginnerStudents || []).map(student => {
        if (student.id === submission.modelId) {
          let nextDueDate = new Date();
          
          if (submission.paymentType === 'cotisation') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (submission.paymentType === 'inscription') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (submission.paymentType === 'cotisation_inscription') {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
          } else if (submission.paymentType === 'avance') {
            const cotisationStandard = 1500;
            const moisAvance = Math.floor(submission.amount / cotisationStandard);
            nextDueDate.setMonth(nextDueDate.getMonth() + moisAvance);
          }

          return {
            ...student,
            paymentStatus: {
              isUpToDate: true,
              lastPaymentDate: new Date().toISOString(),
              nextDueDate: nextDueDate.toISOString(),
              amount: submission.amount,
              currency: submission.currency,
              paymentMethod: submission.paymentMethod,
              notes: submission.notes,
              paymentType: submission.paymentType,
              description: submission.description,
              warnings: []
            }
          };
        }
        return student;
      });

      // Créer une transaction comptable automatiquement
      const accountingTransaction: AccountingTransaction = {
        id: `payment-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `${submission.description} - ${submission.modelName}`,
        category: 'revenue',
        subcategory: submission.paymentType === 'cotisation' ? 'Cotisations mensuelles' : 
                     submission.paymentType === 'inscription' ? 'Frais d\'inscription' :
                     submission.paymentType === 'cotisation_inscription' ? 'Cotisations + Inscriptions' :
                     'Paiements en avance',
        amount: submission.amount,
        currency: submission.currency,
        paymentMethod: submission.paymentMethod as any,
        reference: `${submission.paymentType?.toUpperCase()}-${submission.modelName}-${new Date().getFullYear()}`,
        notes: submission.notes || `Paiement ${submission.paymentType} pour ${submission.modelName}`,
        relatedModelId: submission.modelId,
        relatedModelName: submission.modelName,
        createdBy: 'admin',
        createdAt: new Date().toISOString()
      };

      // Ajouter la transaction comptable
      const updatedTransactions = [...(data.accountingTransactions || []), accountingTransaction];

      await saveData({ 
        ...data, 
        paymentSubmissions: updatedSubmissions,
        models: updatedModels,
        beginnerStudents: updatedBeginnerStudents,
        accountingTransactions: updatedTransactions
      });

      alert('Paiement approuvé avec succès !');
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert(`Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  const handleReject = async (submission: PaymentSubmission) => {
    if (!data) return;

    const reason = prompt('Raison du rejet (optionnel):');
    if (reason === null) return; // Annulé par l'utilisateur

    try {
      const updatedSubmissions = submissions.map(s => 
        s.id === submission.id 
          ? { 
              ...s, 
              status: 'rejected' as const,
              adminNotes: reason || 'Paiement rejeté'
            }
          : s
      );

      await saveData({ 
        ...data, 
        paymentSubmissions: updatedSubmissions
      });

      alert('Paiement rejeté.');
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Une erreur est survenue lors du rejet du paiement.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Soumissions de Paiement" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
              <ChevronLeftIcon className="w-5 h-5" />
              Retour au Dashboard
            </Link>
            <h1 className="admin-page-title">Soumissions de Paiement</h1>
            <p className="text-pm-off-white/60 mt-2">
              Validez ou rejetez les paiements soumis par les mannequins
            </p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/50 p-6 border border-pm-gold/20 rounded-lg">
            <div className="flex items-center gap-3">
              <ClockIcon className="w-8 h-8 text-yellow-500" />
              <div>
                <h3 className="text-2xl font-bold text-yellow-300">{pendingSubmissions.length}</h3>
                <p className="text-pm-off-white/60">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-black/50 p-6 border border-pm-gold/20 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircleIcon className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="text-2xl font-bold text-green-300">{approvedSubmissions.length}</h3>
                <p className="text-pm-off-white/60">Approuvés</p>
              </div>
            </div>
          </div>
          <div className="bg-black/50 p-6 border border-pm-gold/20 rounded-lg">
            <div className="flex items-center gap-3">
              <XCircleIcon className="w-8 h-8 text-red-500" />
              <div>
                <h3 className="text-2xl font-bold text-red-300">{rejectedSubmissions.length}</h3>
                <p className="text-pm-off-white/60">Rejetés</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des soumissions */}
        <div className="admin-section-wrapper">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mannequin</th>
                  <th>Type</th>
                  <th>Montant</th>
                  <th>Méthode</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions
                  .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
                  .map((submission) => (
                    <tr key={submission.id}>
                      <td className="font-semibold">{submission.modelName}</td>
                      <td>
                        <span className="px-2 py-1 text-xs rounded-full bg-pm-gold/20 text-pm-gold">
                          {submission.description}
                        </span>
                      </td>
                      <td className="font-semibold">{submission.amount.toLocaleString()} {submission.currency}</td>
                      <td className="capitalize">{submission.paymentMethod.replace('_', ' ')}</td>
                      <td>{new Date(submission.submittedAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          <span className="text-sm font-medium capitalize">{submission.status}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            className="p-2 text-pm-gold/70 hover:text-pm-gold"
                            title="Voir détails"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          {submission.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(submission)}
                                className="p-2 text-green-500/70 hover:text-green-500"
                                title="Approuver"
                              >
                                <CheckCircleIcon className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleReject(submission)}
                                className="p-2 text-red-500/70 hover:text-red-500"
                                title="Rejeter"
                              >
                                <XCircleIcon className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de détails */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-pm-gold mb-4">
                Détails du Paiement
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-pm-gold mb-2">Mannequin</h4>
                  <p className="text-pm-off-white">{selectedSubmission.modelName}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-pm-gold mb-2">Type de paiement</h4>
                  <p className="text-pm-off-white">{selectedSubmission.description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-pm-gold mb-2">Montant</h4>
                  <p className="text-pm-off-white font-semibold">
                    {selectedSubmission.amount.toLocaleString()} {selectedSubmission.currency}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-pm-gold mb-2">Méthode de paiement</h4>
                  <p className="text-pm-off-white capitalize">
                    {selectedSubmission.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-pm-gold mb-2">Date de soumission</h4>
                  <p className="text-pm-off-white">
                    {new Date(selectedSubmission.submittedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                
                {selectedSubmission.notes && (
                  <div>
                    <h4 className="font-semibold text-pm-gold mb-2">Notes du mannequin</h4>
                    <p className="text-pm-off-white">{selectedSubmission.notes}</p>
                  </div>
                )}
                
                {selectedSubmission.adminNotes && (
                  <div>
                    <h4 className="font-semibold text-pm-gold mb-2">Notes de l'admin</h4>
                    <p className="text-pm-off-white">{selectedSubmission.adminNotes}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
                >
                  Fermer
                </button>
                {selectedSubmission.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(selectedSubmission)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(selectedSubmission)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Rejeter
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentSubmissions;
