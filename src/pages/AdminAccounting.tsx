import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, PlusIcon, DocumentArrowDownIcon, 
    CurrencyDollarIcon, ChartBarIcon, CalendarIcon,
    BanknotesIcon, CreditCardIcon, ArrowTrendingUpIcon,
    ArrowTrendingDownIcon, EyeIcon, PencilIcon, TrashIcon
} from '@heroicons/react/24/outline';
import { AccountingTransaction, AccountingCategory, AccountingBalance } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const AdminAccounting: React.FC = () => {
    const { data, saveData } = useData();
    const [activeTab, setActiveTab] = useState<'transactions' | 'balance' | 'reports'>('transactions');
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [newTransaction, setNewTransaction] = useState<Partial<AccountingTransaction>>({
        date: new Date().toISOString().split('T')[0],
        category: 'revenue',
        subcategory: '',
        amount: 0,
        currency: 'FCFA',
        paymentMethod: 'cash',
        description: '',
        reference: '',
        notes: ''
    });

    const transactions = data?.accountingTransactions || [];
    const categories = data?.accountingCategories || [];
    

    // Filtrer les transactions par période
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.date.startsWith(selectedPeriod));
    }, [transactions, selectedPeriod]);

    // Calculer le bilan
    const balance: AccountingBalance = useMemo(() => {
        const totalRevenue = filteredTransactions
            .filter(t => t.category === 'revenue')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = filteredTransactions
            .filter(t => t.category === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalRevenue,
            totalExpenses,
            netIncome: totalRevenue - totalExpenses,
            currency: 'FCFA',
            period: selectedPeriod
        };
    }, [filteredTransactions, selectedPeriod]);

    const handleTransactionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data || !newTransaction.description || !newTransaction.amount) return;

        // --- Prévention des doublons ---
        const isDuplicate = transactions.some(t => 
            t.description.toLowerCase() === newTransaction.description?.toLowerCase() &&
            t.amount === newTransaction.amount &&
            t.date === newTransaction.date
        );

        if (isDuplicate) {
            if (!window.confirm("Une transaction très similaire existe déjà à cette date. Êtes-vous sûr de vouloir l'ajouter quand même ?")) {
                return; // Annuler si l'utilisateur ne confirme pas
            }
        }

        const transactionId = `trans-${newTransaction.category}-${newTransaction.date}-${Date.now()}`;

        const transaction: AccountingTransaction = {
            id: transactionId,
            date: newTransaction.date || new Date().toISOString().split('T')[0],
            description: newTransaction.description,
            category: newTransaction.category || 'revenue',
            subcategory: newTransaction.subcategory || '',
            amount: newTransaction.amount,
            currency: newTransaction.currency || 'FCFA',
            paymentMethod: newTransaction.paymentMethod || 'cash',
            reference: newTransaction.reference,
            notes: newTransaction.notes,
            createdBy: 'admin',
            createdAt: new Date().toISOString()
        };

        try {
            const updatedTransactions = [...transactions, transaction];
            await saveData({ ...data, accountingTransactions: updatedTransactions });
            setNewTransaction({
                date: new Date().toISOString().split('T')[0],
                category: 'revenue',
                subcategory: '',
                amount: 0,
                currency: 'FCFA',
                paymentMethod: 'cash',
                description: '',
                reference: '',
                notes: ''
            });
            setShowTransactionForm(false);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la transaction:', error);
            alert(`Erreur lors de l'enregistrement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        }
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        if (!data || !window.confirm('Supprimer cette transaction ?')) return;
        
        try {
            const updatedTransactions = transactions.filter(t => t.id !== transactionId);
            await saveData({ ...data, accountingTransactions: updatedTransactions });
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };


    const generatePaymentListPDF = async (type: 'cotisations' | 'inscriptions') => {
        try {
            // Filtrer les transactions selon le type
            const paymentTransactions = transactions.filter(t => {
                if (type === 'cotisations') {
                    return t.subcategory === 'Cotisations mensuelles' || 
                           t.subcategory === 'Cotisations + Inscriptions' ||
                           t.subcategory === 'Paiements en avance';
                } else {
                    return t.subcategory === 'Frais d\'inscription' || 
                           t.subcategory === 'Cotisations + Inscriptions';
                }
            });

            if (paymentTransactions.length === 0) {
                alert(`Aucune transaction de type "${type}" trouvée pour cette période.`);
                return;
            }

            // Créer le PDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPosition = 20;

            // Charger et ajouter le logo
            try {
                const logoUrl = 'https://i.ibb.co/3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg';
                const logoImg = new Image();
                logoImg.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                    logoImg.onload = resolve;
                    logoImg.onerror = reject;
                    logoImg.src = logoUrl;
                });

                // Ajouter le logo (redimensionné)
                const logoWidth = 40;
                const logoHeight = 30;
                doc.addImage(logoImg, 'JPEG', pageWidth / 2 - logoWidth / 2, yPosition, logoWidth, logoHeight);
                yPosition += logoHeight + 10;
            } catch (logoError) {
                console.warn('Impossible de charger le logo:', logoError);
                // Continuer sans le logo
            }

            // En-tête stylé
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 215, 0); // Couleur dorée
            doc.text('PERFECT MODEL AGENCY', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Ligne de séparation dorée
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.5);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;

            // Titre du document
            doc.setFontSize(18);
            doc.setTextColor(0, 0, 0); // Noir
            doc.setFont('helvetica', 'bold');
            doc.text(`LISTE DES ${type === 'cotisations' ? 'COTISATIONS' : 'INSCRIPTIONS'}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Informations de période
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100); // Gris
            doc.text(`Période: ${selectedPeriod}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 8;
            doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 20;

            // Tableau stylé avec largeurs ajustées
            const tableHeaders = ['Date', 'Mannequin', 'Type', 'Montant', 'Méthode'];
            const colWidths = [20, 60, 35, 35, 20]; // Ajusté pour éviter les superpositions
            const startX = 15;

            // En-têtes du tableau avec fond doré
            const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
            doc.setFillColor(255, 215, 0);
            doc.rect(startX, yPosition - 5, totalTableWidth, 10, 'F');
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0); // Noir sur fond doré
            let xPosition = startX;
            tableHeaders.forEach((header, index) => {
                // Centrer le texte dans chaque colonne
                const textWidth = doc.getTextWidth(header);
                const centerX = xPosition + (colWidths[index] / 2) - (textWidth / 2);
                doc.text(header, centerX, yPosition);
                xPosition += colWidths[index];
            });
            yPosition += 8;

            // Ligne de séparation dorée
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.5);
            doc.line(startX, yPosition, startX + colWidths.reduce((a, b) => a + b, 0), yPosition);
            yPosition += 5;

            // Données du tableau avec alternance de couleurs
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            let totalAmount = 0;

            paymentTransactions.forEach((transaction, index) => {
                // Vérifier si on a besoin d'une nouvelle page
                if (yPosition > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Alternance de couleurs pour les lignes
                if (index % 2 === 0) {
                    doc.setFillColor(248, 248, 248);
                    doc.rect(startX, yPosition - 3, totalTableWidth, 6, 'F');
                }

                // Préparer les données avec troncature si nécessaire
                const dateStr = new Date(transaction.date).toLocaleDateString('fr-FR');
                const modelName = (transaction.relatedModelName || 'N/A').length > 15 
                    ? (transaction.relatedModelName || 'N/A').substring(0, 15) + '...' 
                    : (transaction.relatedModelName || 'N/A');
                const typeStr = transaction.subcategory.length > 12 
                    ? transaction.subcategory.substring(0, 12) + '...' 
                    : transaction.subcategory;
                const amountStr = `${transaction.amount.toLocaleString()} FCFA`;
                const methodStr = transaction.paymentMethod.length > 8 
                    ? transaction.paymentMethod.substring(0, 8) + '...' 
                    : transaction.paymentMethod;

                const rowData = [dateStr, modelName, typeStr, amountStr, methodStr];

                doc.setTextColor(0, 0, 0);
                xPosition = startX;
                rowData.forEach((data, colIndex) => {
                    // Ajuster la position pour éviter les superpositions
                    const textX = xPosition + 1;
                    doc.text(data, textX, yPosition);
                    xPosition += colWidths[colIndex];
                });

                totalAmount += transaction.amount;
                yPosition += 6;
            });

            // Ligne de séparation finale dorée
            yPosition += 5;
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(1);
            doc.line(startX, yPosition, startX + colWidths.reduce((a, b) => a + b, 0), yPosition);
            yPosition += 10;

            // Total stylé
            doc.setFillColor(255, 215, 0);
            doc.rect(startX + colWidths.slice(0, 3).reduce((a, b) => a + b, 0) - 10, yPosition - 5, colWidths[3] + colWidths[4] + 10, 10, 'F');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`TOTAL: ${totalAmount.toLocaleString()} FCFA`, startX + colWidths.slice(0, 3).reduce((a, b) => a + b, 0), yPosition);

            // Pied de page stylé
            yPosition = pageHeight - 30;
            
            // Ligne de séparation dorée
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.5);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;
            
            // Informations de l'agence
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 215, 0);
            doc.text('PERFECT MODEL AGENCY', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 5;
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text('Agence de Mannequins Professionnelle', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 4;
            doc.text('Livre Comptable - Document Officiel', pageWidth / 2, yPosition, { align: 'center' });

            // Télécharger le PDF
            const fileName = `liste_${type}_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            alert(`PDF généré avec succès: ${fileName}`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
        }
    };

    const generateBalanceReportPDF = async () => {
        try {
            if (filteredTransactions.length === 0) {
                alert('Aucune transaction trouvée pour cette période.');
                return;
            }

            // Créer le PDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            let yPosition = 20;

            // Charger et ajouter le logo
            try {
                const logoUrl = 'https://i.ibb.co/3yD48r0J/480946208-616728137878198-6925216743970681454-n.jpg';
                const logoImg = new Image();
                logoImg.crossOrigin = 'anonymous';
                
                await new Promise((resolve, reject) => {
                    logoImg.onload = resolve;
                    logoImg.onerror = reject;
                    logoImg.src = logoUrl;
                });

                // Ajouter le logo (redimensionné)
                const logoWidth = 40;
                const logoHeight = 30;
                doc.addImage(logoImg, 'JPEG', pageWidth / 2 - logoWidth / 2, yPosition, logoWidth, logoHeight);
                yPosition += logoHeight + 10;
            } catch (logoError) {
                console.warn('Impossible de charger le logo:', logoError);
                // Continuer sans le logo
            }

            // En-tête stylé
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 215, 0); // Couleur dorée
            doc.text('PERFECT MODEL AGENCY', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Ligne de séparation dorée
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.5);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;

            // Titre du document
            doc.setFontSize(18);
            doc.setTextColor(0, 0, 0); // Noir
            doc.setFont('helvetica', 'bold');
            doc.text('RAPPORT DE BILAN COMPTABLE', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Informations de période
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100); // Gris
            doc.text(`Période: ${selectedPeriod}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 8;
            doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 20;

            // Résumé financier stylé
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('RÉSUMÉ FINANCIER', 20, yPosition);
            yPosition += 15;

            // Encadré pour le résumé
            const summaryWidth = pageWidth - 40;
            const summaryHeight = 40;
            doc.setFillColor(248, 248, 248);
            doc.rect(20, yPosition - 5, summaryWidth, summaryHeight, 'F');
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(1);
            doc.rect(20, yPosition - 5, summaryWidth, summaryHeight, 'S');

            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 100, 0); // Vert pour les revenus
            doc.text(`TOTAL DES REVENUS: ${balance.totalRevenue.toLocaleString()} FCFA`, 30, yPosition + 8);
            yPosition += 12;
            
            doc.setTextColor(200, 0, 0); // Rouge pour les dépenses
            doc.text(`TOTAL DES DÉPENSES: ${balance.totalExpenses.toLocaleString()} FCFA`, 30, yPosition + 8);
            yPosition += 12;
            
            doc.setTextColor(balance.netIncome >= 0 ? 0 : 200, balance.netIncome >= 0 ? 100 : 0, 0); // Vert si positif, rouge si négatif
            doc.text(`BÉNÉFICE NET: ${balance.netIncome.toLocaleString()} FCFA`, 30, yPosition + 8);
            yPosition += 20;

            // Détail des transactions
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Détail des Transactions', 20, yPosition);
            yPosition += 15;

            // Tableau des transactions avec largeurs ajustées
            const tableHeaders = ['Date', 'Description', 'Type', 'Montant'];
            const colWidths = [20, 100, 25, 35]; // Ajusté pour éviter les superpositions
            const startX = 15;

            // En-têtes du tableau avec fond doré
            const totalTableWidth = colWidths.reduce((a, b) => a + b, 0);
            doc.setFillColor(255, 215, 0);
            doc.rect(startX, yPosition - 5, totalTableWidth, 10, 'F');
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            let xPosition = startX;
            tableHeaders.forEach((header, index) => {
                // Centrer le texte dans chaque colonne
                const textWidth = doc.getTextWidth(header);
                const centerX = xPosition + (colWidths[index] / 2) - (textWidth / 2);
                doc.text(header, centerX, yPosition);
                xPosition += colWidths[index];
            });
            yPosition += 8;

            // Ligne de séparation dorée
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.5);
            doc.line(startX, yPosition, startX + totalTableWidth, yPosition);
            yPosition += 5;

            // Données du tableau avec alternance de couleurs
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            filteredTransactions.forEach((transaction, index) => {
                // Vérifier si on a besoin d'une nouvelle page
                if (yPosition > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }

                // Alternance de couleurs pour les lignes
                if (index % 2 === 0) {
                    doc.setFillColor(248, 248, 248);
                    doc.rect(startX, yPosition - 3, totalTableWidth, 6, 'F');
                }

                // Préparer les données avec troncature si nécessaire
                const dateStr = new Date(transaction.date).toLocaleDateString('fr-FR');
                const description = transaction.description.length > 35 
                    ? transaction.description.substring(0, 35) + '...' 
                    : transaction.description;
                const typeStr = transaction.category === 'revenue' ? 'Revenu' : 'Dépense';
                const amountStr = `${transaction.amount.toLocaleString()} FCFA`;

                const rowData = [dateStr, description, typeStr, amountStr];

                doc.setTextColor(0, 0, 0);
                xPosition = startX;
                rowData.forEach((data, colIndex) => {
                    // Ajuster la position pour éviter les superpositions
                    const textX = xPosition + 1;
                    doc.text(data, textX, yPosition);
                    xPosition += colWidths[colIndex];
                });

                yPosition += 6;
            });

            // Pied de page stylé
            yPosition = pageHeight - 30;
            
            // Ligne de séparation dorée
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.5);
            doc.line(20, yPosition, pageWidth - 20, yPosition);
            yPosition += 10;
            
            // Informations de l'agence
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 215, 0);
            doc.text('PERFECT MODEL AGENCY', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 5;
            
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            doc.text('Agence de Mannequins Professionnelle', pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 4;
            doc.text('Rapport Comptable - Document Officiel', pageWidth / 2, yPosition, { align: 'center' });

            // Télécharger le PDF
            const fileName = `rapport_bilan_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            alert(`Rapport de bilan généré avec succès: ${fileName}`);
        } catch (error) {
            console.error('Erreur lors de la génération du rapport:', error);
            alert('Erreur lors de la génération du rapport. Veuillez réessayer.');
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Comptabilité - Perfect Models Management" noIndex />
            <div className="container mx-auto px-6">
                <div className="admin-page-header">
                    <div>
                        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                            <ChevronLeftIcon className="w-5 h-5" />
                            Retour au Dashboard
                        </Link>
                        <h1 className="admin-page-title">Livre Comptable</h1>
                        <p className="admin-page-subtitle">Gestion des revenus, dépenses et génération de rapports</p>
                        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-blue-300 text-sm">
                                💡 <strong>Note :</strong> Pour enregistrer les paiements des mannequins, utilisez la page 
                                <Link to="/admin/payments" className="text-blue-400 hover:text-blue-300 underline ml-1">
                                    Gestion des Paiements
                                </Link>
                                . Les paiements sont automatiquement synchronisés avec le livre comptable.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => generatePaymentListPDF('cotisations')}
                            className="action-btn bg-green-500/10 text-green-300 border-green-500/50 hover:bg-green-500/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            PDF Cotisations
                        </button>
                        <button
                            onClick={() => generatePaymentListPDF('inscriptions')}
                            className="action-btn bg-blue-500/10 text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
                        >
                            <DocumentArrowDownIcon className="w-5 h-5" />
                            PDF Inscriptions
                        </button>
                        <button
                            onClick={() => setShowTransactionForm(true)}
                            className="action-btn bg-pm-gold text-pm-dark hover:bg-white"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Nouvelle Transaction
                        </button>
                    </div>
                </div>

                {/* Période de sélection */}
                <div className="admin-section-wrapper mb-8">
                    <div className="flex items-center gap-4">
                        <CalendarIcon className="w-6 h-6 text-pm-gold" />
                        <label className="text-pm-gold font-medium">Période :</label>
                        <input
                            type="month"
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="admin-input w-auto"
                        />
                    </div>
                </div>

                {/* Bilan rapide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-lg">
                        <div className="flex items-center gap-3">
                            <ArrowTrendingUpIcon className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-green-400/60 text-sm">Revenus</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {balance.totalRevenue.toLocaleString()} {balance.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-lg">
                        <div className="flex items-center gap-3">
                            <ArrowTrendingDownIcon className="w-8 h-8 text-red-400" />
                            <div>
                                <p className="text-red-400/60 text-sm">Dépenses</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {balance.totalExpenses.toLocaleString()} {balance.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`border p-6 rounded-lg ${
                        balance.netIncome >= 0 
                            ? 'bg-green-500/10 border-green-500/20' 
                            : 'bg-red-500/10 border-red-500/20'
                    }`}>
                        <div className="flex items-center gap-3">
                            <ChartBarIcon className={`w-8 h-8 ${
                                balance.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                            }`} />
                            <div>
                                <p className={`text-sm ${
                                    balance.netIncome >= 0 ? 'text-green-400/60' : 'text-red-400/60'
                                }`}>Résultat Net</p>
                                <p className={`text-2xl font-bold ${
                                    balance.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {balance.netIncome.toLocaleString()} {balance.currency}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Onglets */}
                <div className="admin-section-wrapper">
                    <div className="flex border-b border-pm-gold/20 mb-6">
                        {[
                            { id: 'transactions', label: 'Transactions', icon: BanknotesIcon },
                            { id: 'balance', label: 'Bilan', icon: ChartBarIcon },
                            { id: 'reports', label: 'Rapports', icon: DocumentArrowDownIcon }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-pm-gold border-b-2 border-pm-gold'
                                        : 'text-pm-off-white/60 hover:text-pm-gold'
                                }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Contenu des onglets */}

                    {activeTab === 'transactions' && (
                        <div className="space-y-4">
                            {filteredTransactions.map(transaction => (
                                <div key={transaction.id} className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    transaction.category === 'revenue'
                                                        ? 'bg-green-500/20 text-green-300'
                                                        : 'bg-red-500/20 text-red-300'
                                                }`}>
                                                    {transaction.category === 'revenue' ? 'Revenu' : 'Dépense'}
                                                </span>
                                                <span className="text-pm-gold font-medium">{transaction.subcategory}</span>
                                                <span className="text-pm-off-white/60">{transaction.date}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-pm-off-white mb-1">
                                                {transaction.description}
                                            </h3>
                                            <div className="flex items-center gap-6 text-sm text-pm-off-white/60">
                                                <span>Montant: <strong className="text-pm-gold">{transaction.amount.toLocaleString()} {transaction.currency}</strong></span>
                                                <span>Méthode: {transaction.paymentMethod}</span>
                                                {transaction.reference && <span>Réf: {transaction.reference}</span>}
                                            </div>
                                            {transaction.notes && (
                                                <p className="text-sm text-pm-off-white/60 mt-2">{transaction.notes}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="p-2 text-red-500/70 hover:text-red-500"
                                                title="Supprimer"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-12">
                                    <BanknotesIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                                    <p className="text-pm-off-white/60">Aucune transaction pour cette période</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'balance' && (
                        <div className="space-y-6">
                            <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                <h3 className="text-xl font-bold text-pm-gold mb-4">Bilan Détaillé - {selectedPeriod}</h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-lg font-semibold text-green-400 mb-3">Revenus</h4>
                                        <div className="space-y-2">
                                            {categories.filter(c => c.type === 'revenue').map(category => {
                                                const categoryTotal = filteredTransactions
                                                    .filter(t => t.category === 'revenue' && t.subcategory === category.name)
                                                    .reduce((sum, t) => sum + t.amount, 0);
                                                
                                                return categoryTotal > 0 ? (
                                                    <div key={category.id} className="flex justify-between">
                                                        <span className="text-pm-off-white/80">{category.name}</span>
                                                        <span className="text-green-400 font-medium">
                                                            {categoryTotal.toLocaleString()} {balance.currency}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-lg font-semibold text-red-400 mb-3">Dépenses</h4>
                                        <div className="space-y-2">
                                            {categories.filter(c => c.type === 'expense').map(category => {
                                                const categoryTotal = filteredTransactions
                                                    .filter(t => t.category === 'expense' && t.subcategory === category.name)
                                                    .reduce((sum, t) => sum + t.amount, 0);
                                                
                                                return categoryTotal > 0 ? (
                                                    <div key={category.id} className="flex justify-between">
                                                        <span className="text-pm-off-white/80">{category.name}</span>
                                                        <span className="text-red-400 font-medium">
                                                            {categoryTotal.toLocaleString()} {balance.currency}
                                                        </span>
                                                    </div>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-6 pt-6 border-t border-pm-gold/20">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-pm-gold">Résultat Net</span>
                                        <span className={`text-2xl font-bold ${
                                            balance.netIncome >= 0 ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {balance.netIncome.toLocaleString()} {balance.currency}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'reports' && (
                        <div className="space-y-6">
                            <div className="bg-black/50 p-6 rounded-lg border border-pm-gold/20">
                                <h3 className="text-xl font-bold text-pm-gold mb-4">Génération de Rapports</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <button
                                        onClick={() => generatePaymentListPDF('cotisations')}
                                        className="p-6 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors text-left"
                                    >
                                        <CurrencyDollarIcon className="w-8 h-8 text-green-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-green-400 mb-2">Liste des Cotisations</h4>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Générer un PDF avec toutes les cotisations des mannequins pour la période sélectionnée.
                                        </p>
                                    </button>
                                    
                                    <button
                                        onClick={() => generatePaymentListPDF('inscriptions')}
                                        className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors text-left"
                                    >
                                        <CreditCardIcon className="w-8 h-8 text-blue-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-blue-400 mb-2">Liste des Inscriptions</h4>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Générer un PDF avec toutes les inscriptions et frais d'inscription.
                                        </p>
                                    </button>
                                    
                                    <button
                                        onClick={generateBalanceReportPDF}
                                        className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors text-left"
                                    >
                                        <ChartBarIcon className="w-8 h-8 text-purple-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-purple-400 mb-2">Rapport de Bilan</h4>
                                        <p className="text-pm-off-white/60 text-sm">
                                            Générer un rapport complet avec revenus, dépenses et bénéfice net.
                                        </p>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                {/* Formulaire de nouvelle transaction */}
                {showTransactionForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-bold text-pm-gold mb-6">Nouvelle Transaction</h3>
                            
                            <form onSubmit={handleTransactionSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Date</label>
                                        <input
                                            type="date"
                                            value={newTransaction.date}
                                            onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                                            className="admin-input"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="admin-label">Type</label>
                                        <select
                                            value={newTransaction.category}
                                            onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value as 'revenue' | 'expense'})}
                                            className="admin-input"
                                            required
                                        >
                                            <option value="revenue">Revenu</option>
                                            <option value="expense">Dépense</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="admin-label">Description</label>
                                    <input
                                        type="text"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                                        className="admin-input"
                                        placeholder="Ex: Cotisation - Nom Mannequin"
                                        required
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Catégorie</label>
                                        <select
                                            value={newTransaction.subcategory}
                                            onChange={(e) => setNewTransaction({...newTransaction, subcategory: e.target.value})}
                                            className="admin-input"
                                            required
                                        >
                                            <option value="">Sélectionner une catégorie</option>
                                            {categories
                                                .filter(c => c.type === newTransaction.category)
                                                .map(category => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label">Montant</label>
                                        <input
                                            type="number"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                                            className="admin-input"
                                            placeholder="0"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="admin-label">Méthode de paiement</label>
                                        <select
                                            value={newTransaction.paymentMethod}
                                            onChange={(e) => setNewTransaction({...newTransaction, paymentMethod: e.target.value as any})}
                                            className="admin-input"
                                        >
                                            <option value="cash">Espèces</option>
                                            <option value="bank_transfer">Virement bancaire</option>
                                            <option value="mobile_money">Mobile Money</option>
                                            <option value="check">Chèque</option>
                                            <option value="other">Autre</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="admin-label">Référence (optionnel)</label>
                                        <input
                                            type="text"
                                            value={newTransaction.reference}
                                            onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                                            className="admin-input"
                                            placeholder="Ex: INV-2024-001, Nom Mannequin"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="admin-label">Notes (optionnel)</label>
                                    <textarea
                                        value={newTransaction.notes}
                                        onChange={(e) => setNewTransaction({...newTransaction, notes: e.target.value})}
                                        className="admin-textarea"
                                        rows={3}
                                        placeholder="Notes supplémentaires..."
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTransactionForm(false)}
                                        className="px-6 py-2 border border-pm-gold/50 text-pm-gold rounded-lg hover:bg-pm-gold/10 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminAccounting;
