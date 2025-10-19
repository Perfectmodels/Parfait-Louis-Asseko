import React, { useMemo, useState } from 'react';
import SEO from '../../components/SEO';
import AdminPageHeader from '../components/AdminPageHeader';
import { useData } from '../../contexts/DataContext';
import { MonthlyPayment } from '../../types';

const AdminReports: React.FC = () => {
  const { data } = useData();
  const [month, setMonth] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const payments = useMemo(() => {
    let arr = [...(data?.monthlyPayments || [])];
    if (month) arr = arr.filter(p => p.month === month);
    if (search.trim()) {
      const q = search.toLowerCase();
      arr = arr.filter(p => p.modelName.toLowerCase().includes(q));
    }
    return arr.sort((a, b) => a.modelName.localeCompare(b.modelName) || a.month.localeCompare(b.month));
  }, [data?.monthlyPayments, month, search]);

  const uniqueMonths = useMemo(() => {
    const s = new Set((data?.monthlyPayments || []).map(p => p.month));
    return Array.from(s).sort().reverse();
  }, [data?.monthlyPayments]);

  const toCsv = (rows: MonthlyPayment[]) => {
    const headers = [
      'Mois',
      'Mannequin',
      'Montant',
      'Cotisation',
      'Inscription',
      'Nature',
      'Date Paiement',
      'Méthode',
      'Statut',
      'Notes',
    ];
    const lines = rows.map(p => [
      p.month,
      p.modelName,
      String(p.amount || 0),
      String(p.breakdown?.cotisation || (p.category === 'Cotisation mensuelle' ? p.amount : 0) || 0),
      String(p.breakdown?.inscription || (p.category === "Frais d'inscription" ? p.amount : 0) || 0),
      p.category || '',
      p.paymentDate,
      p.method,
      p.status,
      (p.notes || '').replace(/\n/g, ' '),
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    return [headers.join(','), ...lines].join('\n');
  };

  const downloadCsv = () => {
    const csv = toCsv(payments);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paiements_${month || 'tous'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = () => {
    // Simple print-based PDF: render a printable table and call window.print()
    const restore = document.body.innerHTML;
    const title = document.title;
    document.title = `Rapport Paiements ${month || 'Tous'}`;
    const tableHtml = document.getElementById('payments-report-table')?.outerHTML || '';
    document.body.innerHTML = `<div style="padding:20px;font-family:Arial,sans-serif">${tableHtml}</div>`;
    window.print();
    document.body.innerHTML = restore;
    document.title = title;
    window.location.reload();
  };

  const total = useMemo(() => payments.reduce((s, p) => s + (p.amount || 0), 0), [payments]);

  return (
    <div className="space-y-6">
      <SEO title="Admin - Rapports" noIndex />
      <AdminPageHeader title="Rapports Comptables" subtitle="Export mensuel détaillé (CSV/PDF)." />

      <div className="bg-black border border-pm-gold/20 rounded-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div>
            <label className="admin-label">Mois</label>
            <select value={month} onChange={e => setMonth(e.target.value)} className="admin-input !w-auto">
              <option value="">Tous</option>
              {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="md:ml-auto flex gap-2">
            <button onClick={downloadCsv} className="action-btn">Exporter CSV</button>
            <button onClick={downloadPdf} className="action-btn">Exporter PDF</button>
          </div>
        </div>
      </div>

      <div className="bg-black border border-pm-gold/20 rounded-lg overflow-x-auto">
        <table id="payments-report-table" className="admin-table !mb-0">
          <thead>
            <tr>
              <th>Mois</th>
              <th>Mannequin</th>
              <th>Montant</th>
              <th>Cotisation</th>
              <th>Inscription</th>
              <th>Nature</th>
              <th>Date Paiement</th>
              <th>Méthode</th>
              <th>Statut</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td>{p.month}</td>
                <td>{p.modelName}</td>
                <td>{p.amount.toLocaleString('fr-FR')} FCFA</td>
                <td>{(p.breakdown?.cotisation || (p.category === 'Cotisation mensuelle' ? p.amount : 0) || 0).toLocaleString('fr-FR')}</td>
                <td>{(p.breakdown?.inscription || (p.category === "Frais d'inscription" ? p.amount : 0) || 0).toLocaleString('fr-FR')}</td>
                <td>{p.category || '-'}</td>
                <td>{new Date(p.paymentDate).toLocaleDateString('fr-FR')}</td>
                <td>{p.method}</td>
                <td>{p.status}</td>
                <td>{p.notes || '-'}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center text-pm-off-white/60 py-6">Aucune donnée</td>
              </tr>
            )}
          </tbody>
          {payments.length > 0 && (
            <tfoot>
              <tr>
                <td colSpan={2}>Total</td>
                <td>{total.toLocaleString('fr-FR')} FCFA</td>
                <td colSpan={7}></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
