#!/usr/bin/env node
/**
 * Usage:
 *   node scripts/generateMonthlyPaymentsFromExport.mjs "pmmdb-89a3f-default-rtdb-export (1).json"
 * Output:
 *   - generated-monthlyPayments.json (array of MonthlyPayment)
 *   - reconciliation-report.txt (unmatched names)
 */
import fs from 'fs';
import path from 'path';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Missing input file path');
  process.exit(1);
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const toMonth = (dateStr) => {
  if (!dateStr) return new Date().toISOString().slice(0, 7);
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr).slice(0, 7);
  return d.toISOString().slice(0, 7);
};
const toYmd = (dateStr) => {
  if (!dateStr) return new Date().toISOString().slice(0, 10);
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr).slice(0, 10);
  return d.toISOString().slice(0, 10);
};
const normalize = (s) => String(s || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const methodMap = (m) => {
  const mm = String(m || '').toLowerCase();
  if (mm.includes('cash') || mm === 'especes' || mm.includes('esp')) return 'Espèces';
  if (mm.includes('bank') || mm.includes('virement')) return 'Virement';
  return 'Autre';
};

const root = readJson(path.resolve(inputPath));

// Try to locate models and transactions in various common shapes
const models = Array.isArray(root.models)
  ? root.models
  : Array.isArray(root?.data?.models)
    ? root.data.models
    : Array.isArray(root?.root?.models)
      ? root.root.models
      : [];

const txCandidates = root.accountingTransactions
  || root.transactions
  || root.data?.accountingTransactions
  || [];

const nameToModel = new Map();
for (const m of models) {
  if (!m) continue;
  nameToModel.set(normalize(m.name), m);
}

const generated = [];
const unmatched = new Map();
let created = 0;
for (const t of txCandidates) {
  if (!t) continue;
  const cat = String(t.category || '').toLowerCase();
  // Only income-like
  if (!(cat.includes('revenue') || cat.includes('cotisation') || cat.includes('inscription'))) continue;

  const modelName = t.relatedModelName || t.modelName || '';
  const key = normalize(modelName);
  const model = nameToModel.get(key);
  if (!model) {
    unmatched.set(modelName || '(vide)', (unmatched.get(modelName || '(vide)')) || 0 + 1);
    continue;
  }

  const amount = Number(t.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) continue;

  const mp = {
    id: `payment-${Date.now()}-${created}`,
    modelId: model.id,
    modelName: model.name,
    month: toMonth(t.date || t.createdAt),
    amount,
    method: methodMap(t.paymentMethod),
    paymentDate: toYmd(t.date || t.createdAt),
    status: 'Payé',
    notes: t.description || t.notes || ''
  };
  generated.push(mp);
  created += 1;
}

// Write outputs
const outPayments = path.resolve('generated-monthlyPayments.json');
fs.writeFileSync(outPayments, JSON.stringify(generated, null, 2), 'utf8');

let report = `Generated payments: ${generated.length}\n`;
if (unmatched.size) {
  report += `\nUnmatched names (not found in models):\n`;
  for (const [n, c] of unmatched.entries()) report += `- ${n} (${c})\n`;
}
fs.writeFileSync(path.resolve('reconciliation-report.txt'), report, 'utf8');

console.log('OK:', { outPayments, report: 'reconciliation-report.txt', generated: generated.length, unmatched: unmatched.size });

