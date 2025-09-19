import { AccountingTransaction } from '../types';

const INSCRIPTION_FEE = 15000;
const COTISATION_FEE = 1500;

// Fonction pour mettre à jour le statut de paiement d'un mannequin
export const updateModelPaymentStatus = async (
  data: any,
  saveData: (newData: any) => Promise<void>,
  modelId: string,
  paymentData: {
    paymentType: 'inscription' | 'cotisation' | 'cotisation_inscription' | 'avance';
    amount: number;
    currency?: string;
    paymentMethod?: string;
    notes?: string;
    description?: string;
  }
) => {
  if (!data) return;

  // Trouver le mannequin pour obtenir son nom et son type
  const allModels = [
    ...(data?.models || []).map(m => ({...m, type: 'pro'})),
    ...(data?.beginnerStudents || []).map(m => ({...m, type: 'beginner'}))
  ];
  
  const model = allModels.find(m => m.id === modelId);
  if (!model) {
    console.error(`Modèle avec l'ID ${modelId} non trouvé`);
    return;
  }

  const currentPaymentStatus = model.paymentStatus || {};
  const paymentDate = new Date();

  // --- Prévention des doublons ---
  if (paymentData.paymentType === 'inscription' && currentPaymentStatus.inscription === 'paid') {
    console.warn(`Tentative de double paiement d'inscription pour ${model.name}`);
    alert(`L'inscription pour ${model.name} a déjà été payée.`);
    return false;
  }

  if (paymentData.paymentType === 'cotisation' && currentPaymentStatus.lastCotisationDate) {
    const lastPayment = new Date(currentPaymentStatus.lastCotisationDate);
    if (lastPayment.getMonth() === paymentDate.getMonth() && lastPayment.getFullYear() === paymentDate.getFullYear()) {
      console.warn(`Tentative de double paiement de cotisation pour ${model.name} pour le mois en cours.`);
      alert(`La cotisation de ce mois pour ${model.name} a déjà été payée le ${lastPayment.toLocaleDateString('fr-FR')}.`);
      return false;
    }
  }


  const updatedPaymentStatus = { ...currentPaymentStatus };

  // Mettre à jour les statuts de paiement individuels
  if (paymentData.paymentType === 'inscription' || paymentData.paymentType === 'cotisation_inscription') {
    updatedPaymentStatus.inscription = 'paid';
    if (!updatedPaymentStatus.inscriptionDate) {
      updatedPaymentStatus.inscriptionDate = paymentDate.toISOString();
    }
  }
  if (paymentData.paymentType === 'cotisation' || paymentData.paymentType === 'cotisation_inscription') {
    updatedPaymentStatus.cotisation = 'paid';
    updatedPaymentStatus.lastCotisationDate = paymentDate.toISOString();
  }

  // --- Logique de statut "À jour" ---
  const isBeginner = model.type === 'beginner';
  const hasPaidInscription = updatedPaymentStatus.inscription === 'paid';
  const hasPaidCotisation = updatedPaymentStatus.cotisation === 'paid';

  if (isBeginner) {
    updatedPaymentStatus.isUpToDate = hasPaidInscription && hasPaidCotisation;
  } else { // Mannequin pro
    updatedPaymentStatus.isUpToDate = hasPaidCotisation;
  }
  
  updatedPaymentStatus.lastPaymentDate = paymentDate.toISOString();


  // Mettre à jour les modèles professionnels
  const updatedProModels = (data?.models || []).map(proModel => {
    if (proModel.id === modelId) {
      return {
        ...proModel,
        paymentStatus: {
          ...proModel.paymentStatus,
          ...updatedPaymentStatus,
          amount: paymentData.amount,
          currency: paymentData.currency || 'FCFA',
          paymentMethod: paymentData.paymentMethod || 'cash',
          nextDueDate: paymentData.paymentType === 'cotisation' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : proModel.paymentStatus?.nextDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: paymentData.notes,
          paymentType: paymentData.paymentType,
          description: paymentData.description || `Paiement ${paymentData.paymentType}`,
          warnings: []
        }
      };
    }
    return proModel;
  });

  // Mettre à jour les mannequins débutants
  const updatedBeginnerStudents = (data?.beginnerStudents || []).map(beginner => {
    if (beginner.id === modelId) {
      return {
        ...beginner,
        paymentStatus: {
          ...beginner.paymentStatus,
          ...updatedPaymentStatus,
          amount: paymentData.amount,
          currency: paymentData.currency || 'FCFA',
          paymentMethod: paymentData.paymentMethod || 'cash',
          nextDueDate: paymentData.paymentType === 'cotisation' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : beginner.paymentStatus?.nextDueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notes: paymentData.notes,
          paymentType: paymentData.paymentType,
          description: paymentData.description || `Paiement ${paymentData.paymentType}`,
          warnings: []
        }
      };
    }
    return beginner;
  });

  // Créer une transaction comptable automatiquement
  const accountingTransaction: AccountingTransaction = {
    id: `trans-${Date.now()}`,
    date: new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
    description: paymentData.description || `Paiement ${paymentData.paymentType} pour ${model.name}`,
    category: 'revenue', // Les paiements des mannequins sont des revenus pour l'agence
    subcategory: paymentData.paymentType === 'cotisation' ? 'Cotisations mensuelles' : 
                 paymentData.paymentType === 'inscription' ? 'Frais d\'inscription' :
                 paymentData.paymentType === 'cotisation_inscription' ? 'Cotisations + Inscriptions' :
                 'Paiements en avance',
    amount: paymentData.amount,
    currency: paymentData.currency || 'FCFA',
    paymentMethod: (paymentData.paymentMethod as any) || 'cash',
    reference: `${paymentData.paymentType?.toUpperCase()}-${model.name}-${new Date().getFullYear()}`,
    notes: paymentData.notes || `Paiement ${paymentData.paymentType} pour ${model.name}`,
    relatedModelId: modelId,
    relatedModelName: model.name,
    createdBy: 'admin',
    createdAt: new Date().toISOString()
  };

  try {
    // Validation des données avant sauvegarde
    if (!accountingTransaction.amount || accountingTransaction.amount <= 0) {
      throw new Error('Le montant doit être supérieur à 0');
    }
    
    if (!accountingTransaction.description || accountingTransaction.description.trim() === '') {
      throw new Error('La description est requise');
    }

    // Ajouter la transaction comptable
    const updatedTransactions = [...(data.accountingTransactions || []), accountingTransaction];
    
    await saveData({ 
      ...data, 
      models: updatedProModels,
      beginnerStudents: updatedBeginnerStudents,
      accountingTransactions: updatedTransactions
    });
    
    console.log(`Paiement mis à jour avec succès pour ${model.name}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    alert(`Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    return false;
  }
};

// Fonction pour forcer manuellement le statut de paiement d'un mannequin
export const manualUpdateModelStatus = async (
  data: any,
  saveData: (newData: any) => Promise<void>,
  modelId: string,
  newStatus: 'complete' | 'pending' | 'inscription_only'
) => {
  if (!data) return false;

  const modelType = data.models?.some((m: any) => m.id === modelId) ? 'pro' : 'beginner';

  const updateStatus = (model: any) => {
    if (model.id !== modelId) return model;

    const updatedPaymentStatus = { ...model.paymentStatus };
    const today = new Date().toISOString();

    switch (newStatus) {
      case 'complete':
        updatedPaymentStatus.isUpToDate = true;
        updatedPaymentStatus.inscription = 'paid';
        updatedPaymentStatus.cotisation = 'paid';
        updatedPaymentStatus.lastPaymentDate = today;
        if (!updatedPaymentStatus.inscriptionDate) updatedPaymentStatus.inscriptionDate = today;
        updatedPaymentStatus.lastCotisationDate = today;
        break;
      case 'inscription_only':
        updatedPaymentStatus.isUpToDate = false;
        updatedPaymentStatus.inscription = 'paid';
        updatedPaymentStatus.cotisation = 'pending';
        if (!updatedPaymentStatus.inscriptionDate) updatedPaymentStatus.inscriptionDate = today;
        break;
      case 'pending':
        updatedPaymentStatus.isUpToDate = false;
        updatedPaymentStatus.inscription = 'pending';
        updatedPaymentStatus.cotisation = 'pending';
        break;
    }

    return { ...model, paymentStatus: updatedPaymentStatus };
  };

  const updatedProModels = modelType === 'pro' ? (data.models || []).map(updateStatus) : data.models;
  const updatedBeginnerStudents = modelType === 'beginner' ? (data.beginnerStudents || []).map(updateStatus) : data.beginnerStudents;

  try {
    await saveData({
      ...data,
      models: updatedProModels,
      beginnerStudents: updatedBeginnerStudents,
    });
    console.log(`Statut manuel mis à jour avec succès pour le modèle ${modelId}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour manuelle du statut:', error);
    return false;
  }
};
