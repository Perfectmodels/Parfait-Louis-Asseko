import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const firebaseConfig = {
  apiKey: "AIzaSyDlE_x6E8y3SHNbe95gFB0WjXH3i1XS45I",
  authDomain: "pmmdb-89a3f.firebaseapp.com",
  databaseURL: "https://pmmdb-89a3f-default-rtdb.firebaseio.com",
  projectId: "pmmdb-89a3f",
  storageBucket: "pmmdb-89a3f.firebasestorage.app",
  messagingSenderId: "1062005773098",
  appId: "1:1062005773098:web:7e3c3a5b8e4a2e7c5b3e8f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

async function syncFinancialData() {
  console.log('💰 Synchronisation des données financières...\n');

  try {
    // Récupérer toutes les données financières
    const [
      monthlyPaymentsSnap,
      accountingTransactionsSnap,
      accountingCategoriesSnap,
      invoicesSnap
    ] = await Promise.all([
      get(ref(db, 'monthlyPayments')),
      get(ref(db, 'accountingTransactions')),
      get(ref(db, 'accountingCategories')),
      get(ref(db, 'invoices'))
    ]);

    const monthlyPayments = monthlyPaymentsSnap.val() || {};
    const accountingTransactions = accountingTransactionsSnap.val() || [];
    const accountingCategories = accountingCategoriesSnap.val() || [];
    const invoices = invoicesSnap.val() || [];

    console.log('📊 DONNÉES RÉCUPÉRÉES:');
    console.log(`   - Paiements mensuels: ${Object.keys(monthlyPayments).length} mannequin(s)`);
    console.log(`   - Transactions comptables: ${accountingTransactions.length}`);
    console.log(`   - Catégories comptables: ${accountingCategories.length}`);
    console.log(`   - Factures: ${invoices.length}\n`);

    // Analyser les paiements mensuels
    console.log('💵 PAIEMENTS MENSUELS PAR MANNEQUIN:\n');
    let totalMannequinsAJour = 0;
    let totalMannequinsEnRetard = 0;
    let totalRevenusMensuels = 0;

    Object.entries(monthlyPayments).forEach(([modelId, payments]) => {
      const paymentsArray = Object.values(payments);
      const lastPayment = paymentsArray[paymentsArray.length - 1];
      const totalPaid = paymentsArray.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      if (lastPayment?.isUpToDate) {
        totalMannequinsAJour++;
      } else {
        totalMannequinsEnRetard++;
      }
      
      totalRevenusMensuels += totalPaid;
      
      console.log(`   ${modelId}:`);
      console.log(`     - Nombre de paiements: ${paymentsArray.length}`);
      console.log(`     - Total payé: ${totalPaid} FCFA`);
      console.log(`     - Statut: ${lastPayment?.isUpToDate ? '✅ À jour' : '⚠️ En retard'}`);
      console.log('');
    });

    console.log('📈 RÉSUMÉ DES PAIEMENTS:');
    console.log(`   - Mannequins à jour: ${totalMannequinsAJour}`);
    console.log(`   - Mannequins en retard: ${totalMannequinsEnRetard}`);
    console.log(`   - Revenus totaux des cotisations: ${totalRevenusMensuels} FCFA\n`);

    // Analyser les transactions comptables
    console.log('💼 TRANSACTIONS COMPTABLES:\n');
    let totalRecettes = 0;
    let totalDepenses = 0;

    const transactionsByCategory = {};
    accountingTransactions.forEach(transaction => {
      if (transaction.type === 'recette') {
        totalRecettes += transaction.amount;
      } else if (transaction.type === 'dépense') {
        totalDepenses += transaction.amount;
      }

      if (!transactionsByCategory[transaction.category]) {
        transactionsByCategory[transaction.category] = {
          recettes: 0,
          depenses: 0,
          count: 0
        };
      }
      
      if (transaction.type === 'recette') {
        transactionsByCategory[transaction.category].recettes += transaction.amount;
      } else {
        transactionsByCategory[transaction.category].depenses += transaction.amount;
      }
      transactionsByCategory[transaction.category].count++;
    });

    console.log('📊 Par catégorie:');
    Object.entries(transactionsByCategory).forEach(([category, data]) => {
      console.log(`   ${category}:`);
      console.log(`     - Recettes: ${data.recettes.toLocaleString()} FCFA`);
      console.log(`     - Dépenses: ${data.depenses.toLocaleString()} FCFA`);
      console.log(`     - Nombre de transactions: ${data.count}`);
    });

    const balance = totalRecettes - totalDepenses;
    console.log('\n💰 BILAN GLOBAL:');
    console.log(`   - Total Recettes: ${totalRecettes.toLocaleString()} FCFA`);
    console.log(`   - Total Dépenses: ${totalDepenses.toLocaleString()} FCFA`);
    console.log(`   - Solde: ${balance.toLocaleString()} FCFA ${balance >= 0 ? '✅' : '⚠️'}\n`);

    // Analyser les factures
    console.log('🧾 FACTURES:\n');
    const facturesTotales = invoices.reduce((sum, inv) => sum + (inv.totalHT || 0), 0);
    const facturesPaid = invoices.filter(inv => inv.status === 'paid').length;
    const facturesPending = invoices.filter(inv => inv.status === 'pending').length;
    const facturesOverdue = invoices.filter(inv => inv.status === 'overdue').length;

    console.log(`   - Total facturé (HT): ${facturesTotales.toLocaleString()} FCFA`);
    console.log(`   - Factures payées: ${facturesPaid}`);
    console.log(`   - Factures en attente: ${facturesPending}`);
    console.log(`   - Factures en retard: ${facturesOverdue}\n`);

    // Créer un fichier de rapport
    const reportData = {
      generatedAt: new Date().toISOString(),
      monthlyPayments: {
        totalModels: Object.keys(monthlyPayments).length,
        modelsUpToDate: totalMannequinsAJour,
        modelsOverdue: totalMannequinsEnRetard,
        totalRevenue: totalRevenusMensuels,
        details: monthlyPayments
      },
      transactions: {
        total: accountingTransactions.length,
        totalRecettes,
        totalDepenses,
        balance,
        byCategory: transactionsByCategory,
        details: accountingTransactions
      },
      invoices: {
        total: invoices.length,
        totalAmount: facturesTotales,
        paid: facturesPaid,
        pending: facturesPending,
        overdue: facturesOverdue,
        details: invoices
      },
      categories: accountingCategories
    };

    const reportPath = path.join(__dirname, '..', 'financial-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2), 'utf-8');
    console.log(`✅ Rapport financier généré: ${reportPath}\n`);

    // Créer un fichier TypeScript pour importer dans l'app
    const tsContent = `// Auto-généré le ${new Date().toLocaleString('fr-FR')}
// NE PAS MODIFIER MANUELLEMENT - Utilisez scripts/syncFinancialData.mjs

export interface FinancialData {
  monthlyPayments: Record<string, any>;
  accountingTransactions: any[];
  accountingCategories: any[];
  invoices: any[];
}

export const financialData: FinancialData = ${JSON.stringify({
  monthlyPayments,
  accountingTransactions,
  accountingCategories,
  invoices
}, null, 2)};

export const financialSummary = {
  lastUpdated: '${new Date().toISOString()}',
  monthlyPayments: {
    totalModels: ${Object.keys(monthlyPayments).length},
    modelsUpToDate: ${totalMannequinsAJour},
    modelsOverdue: ${totalMannequinsEnRetard},
    totalRevenue: ${totalRevenusMensuels}
  },
  transactions: {
    total: ${accountingTransactions.length},
    totalRecettes: ${totalRecettes},
    totalDepenses: ${totalDepenses},
    balance: ${balance}
  },
  invoices: {
    total: ${invoices.length},
    totalAmount: ${facturesTotales},
    paid: ${facturesPaid},
    pending: ${facturesPending},
    overdue: ${facturesOverdue}
  }
};
`;

    const tsPath = path.join(__dirname, '..', 'src', 'constants', 'financialData.ts');
    fs.writeFileSync(tsPath, tsContent, 'utf-8');
    console.log(`✅ Fichier TypeScript généré: ${tsPath}\n`);

    console.log('🎉 Synchronisation terminée avec succès!');
    console.log('\n📝 PROCHAINES ÉTAPES:');
    console.log('   1. Le fichier financialData.ts est prêt à être importé');
    console.log('   2. Utilisez-le dans vos pages de comptabilité');
    console.log('   3. Relancez ce script pour mettre à jour les données\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

syncFinancialData();

