import React, { useState, useMemo, useRef } from 'react';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import { 
    PlusIcon, 
    CurrencyDollarIcon, 
    CheckCircleIcon, 
    ExclamationCircleIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

import { MonthlyPayment } from '../../types';

const AdminPayments: React.FC = () => {
    const { data, saveData } = useData();
    const [isAdding, setIsAdding] = useState(false);
    const [editingPayment, setEditingPayment] = useState<MonthlyPayment | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'ajour' | 'paye' | 'en_attente' | 'en_retard'>('all');
    const [sortOrder, setSortOrder] = useState<'name' | 'status' | 'last_payment'>('name');
    
    // Form state
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [amountChoice, setAmountChoice] = useState<'1500' | '15000' | '16500' | 'custom'>('1500');
    const [paymentAmount, setPaymentAmount] = useState<string>('1500');
    const [paymentMethod, setPaymentMethod] = useState<'Espèces' | 'Virement' | 'Autre'>('Espèces');
    const [paymentStatus, setPaymentStatus] = useState<'Payé' | 'En attente' | 'En retard'>('Payé');
    const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [paymentMonth, setPaymentMonth] = useState<string>(new Date().toISOString().slice(0, 7));
    const [paymentNotes, setPaymentNotes] = useState('');

    const models = data?.models || [];
    const monthlyPayments: MonthlyPayment[] = (data as any)?.monthlyPayments || [];
    const importInputRef = useRef<HTMLInputElement>(null);

    // Helpers for import/reconciliation
    const normalize = (s: string) => (s || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
    const toMonth = (dateStr?: string) => {
        if (!dateStr) return new Date().toISOString().slice(0, 7);
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? String(dateStr).slice(0, 7) : d.toISOString().slice(0, 7);
    };
    const toYmd = (dateStr?: string) => {
        if (!dateStr) return new Date().toISOString().slice(0, 10);
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? String(dateStr).slice(0, 10) : d.toISOString().slice(0, 10);
    };
    const mapMethod = (m: string): 'Espèces' | 'Virement' | 'Autre' => {
        const mm = (m || '').toLowerCase();
        if (mm.includes('cash') || mm.includes('esp')) return 'Espèces';
        if (mm.includes('bank') || mm.includes('virement')) return 'Virement';
        return 'Autre';
    };
    const nameToModel = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();
        models.forEach(m => map.set(normalize(m.name), { id: m.id, name: m.name }));
        return map;
    }, [models]);

    const handleImportFile = async (file: File) => {
        if (!data) return;
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            let imported: MonthlyPayment[] = [];

            // Case 1: already an array of MonthlyPayment-like objects
            if (Array.isArray(json)) {
                imported = json.map((p: any, idx: number) => ({
                    id: p.id || `payment-${Date.now()}-${idx}`,
                    modelId: p.modelId,
                    modelName: p.modelName,
                    month: p.month || toMonth(p.paymentDate),
                    amount: Number(p.amount || 0),
                    method: mapMethod(p.method || p.paymentMethod || 'Autre'),
                    paymentDate: toYmd(p.paymentDate),
                    status: (p.status as any) || 'Payé',
                    notes: p.notes || ''
                } as MonthlyPayment));
            } else {
                // Case 2: full export with accountingTransactions
                const txs: any[] = json.accountingTransactions || json.data?.accountingTransactions || [];
                imported = txs
                    .filter(t => {
                        const cat = String(t.category || '').toLowerCase();
                        return cat.includes('revenue') || cat.includes('cotisation') || cat.includes('inscription');
                    })
                    .map((t, idx) => {
                        const keyName = t.relatedModelName || t.modelName || '';
                        const match = nameToModel.get(normalize(keyName));
                        if (!match) return null;
                        return {
                            id: `payment-${Date.now()}-${idx}`,
                            modelId: match.id,
                            modelName: match.name,
                            month: toMonth(t.date || t.createdAt),
                            amount: Number(t.amount || 0),
                            method: mapMethod(t.paymentMethod),
                            paymentDate: toYmd(t.date || t.createdAt),
                            status: 'Payé' as const,
                            notes: t.description || t.notes || ''
                        } as MonthlyPayment;
                    })
                    .filter(Boolean) as MonthlyPayment[];
            }

            // Intra-import dedup (same model, same amount, same day OR same month)
            const seenDay = new Set<string>();
            const seenMonth = new Set<string>();
            const uniqueImported: MonthlyPayment[] = [];
            for (const p of imported) {
                const dayKey = `${p.modelId}|${toYmd(p.paymentDate)}|${Number(p.amount || 0)}`;
                const monthKey = `${p.modelId}|${p.month}|${Number(p.amount || 0)}`;
                if (seenDay.has(dayKey) || seenMonth.has(monthKey)) continue;
                seenDay.add(dayKey);
                seenMonth.add(monthKey);
                uniqueImported.push(p);
            }

            // Against existing payments
            const existingDayKeys = new Set(
                monthlyPayments.map(p => `${p.modelId}|${toYmd(p.paymentDate)}|${Number(p.amount || 0)}`)
            );
            const existingMonthKeys = new Set(
                monthlyPayments.map(p => `${p.modelId}|${p.month}|${Number(p.amount || 0)}`)
            );

            const additions = uniqueImported.filter(p => {
                const dayKey = `${p.modelId}|${toYmd(p.paymentDate)}|${Number(p.amount || 0)}`;
                const monthKey = `${p.modelId}|${p.month}|${Number(p.amount || 0)}`;
                return p.modelId && !existingDayKeys.has(dayKey) && !existingMonthKeys.has(monthKey);
            });
            if (additions.length === 0) {
                alert('Aucun nouveau paiement à ajouter (tout est déjà présent).');
                return;
            }
            await saveData({ ...data, monthlyPayments: [...monthlyPayments, ...additions] });
            alert(`${additions.length} paiements ajoutés avec succès.`);
        } catch (e) {
            console.error(e);
            alert("Échec de l'import JSON");
        }
    };

    const handleMergeDuplicates = async () => {
        if (!data) return;
        // Build groups with duplicates by normalized name
        const groups = modelGroups.filter(g => g.ids.length > 1);
        if (groups.length === 0) {
            alert('Aucun doublon de nom trouvé.');
            return;
        }

        // Choose primaryId per group: modelId with most payments, fallback first
        const paymentCountByModel = new Map<string, number>();
        monthlyPayments.forEach(p => {
            paymentCountByModel.set(p.modelId, (paymentCountByModel.get(p.modelId) || 0) + 1);
        });

        const idToPrimary = new Map<string, string>();
        for (const g of groups) {
            let primary = g.ids[0];
            let best = paymentCountByModel.get(primary) || 0;
            for (const id of g.ids) {
                const c = paymentCountByModel.get(id) || 0;
                if (c > best) { best = c; primary = id; }
            }
            for (const id of g.ids) idToPrimary.set(id, primary);
        }

        // Reassign payments to primary and deduplicate
        let reassigned = 0;
        const reassignedPayments = monthlyPayments.map(p => {
            const primary = idToPrimary.get(p.modelId);
            if (primary && primary !== p.modelId) {
                reassigned += 1;
                return {
                    ...p,
                    modelId: primary,
                    modelName: models.find(m => m.id === primary)?.name || p.modelName
                } as MonthlyPayment;
            }
            return p;
        });

        // Dedup: same model + same amount on same day OR same month
        const seenDay = new Set<string>();
        const seenMonth = new Set<string>();
        const dedupedPayments: MonthlyPayment[] = [];
        let removed = 0;
        for (const p of reassignedPayments.sort((a,b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())) {
            const dayKey = `${p.modelId}|${toYmd(p.paymentDate)}|${Number(p.amount || 0)}`;
            const monthKey = `${p.modelId}|${p.month}|${Number(p.amount || 0)}`;
            if (seenDay.has(dayKey) || seenMonth.has(monthKey)) { removed += 1; continue; }
            seenDay.add(dayKey);
            seenMonth.add(monthKey);
            dedupedPayments.push(p);
        }

        // Update accountingTransactions references as well
        const updatedTransactions = (data.accountingTransactions || []).map((t: any) => {
            const id = t.relatedModelId;
            const primary = id ? idToPrimary.get(id) : undefined;
            if (primary && primary !== id) {
                return {
                    ...t,
                    relatedModelId: primary,
                    relatedModelName: models.find(m => m.id === primary)?.name || t.relatedModelName
                };
            }
            return t;
        });

        await saveData({
            ...data,
            monthlyPayments: dedupedPayments,
            accountingTransactions: updatedTransactions
        });

        alert(`Fusion terminée: ${groups.length} groupe(s), ${reassigned} paiement(s) réassigné(s), ${removed} doublon(s) supprimé(s).`);
    };

    // Group models by normalized name to avoid duplicates in UI
    const modelGroups = useMemo(() => {
        const groups = new Map<string, { name: string; ids: string[]; primaryId: string }>();
        for (const m of models) {
            const key = normalize(m.name);
            const g = groups.get(key);
            if (!g) {
                groups.set(key, { name: m.name, ids: [m.id], primaryId: m.id });
            } else {
                g.ids.push(m.id);
            }
        }
        return Array.from(groups.values()).sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
    }, [models]);

    // Vérifier si un groupe de mannequins (mêmes noms) est à jour pour le mois
    const isGroupUpToDate = (ids: string[]) => {
        const currentMonth = new Date().toISOString().slice(0, 7);
        return monthlyPayments.some(p => ids.includes(p.modelId) && p.month === currentMonth && p.status === 'Payé');
    };

    // Statistiques par mannequin
    const modelPaymentStats = useMemo(() => {
        return modelGroups.map(group => {
            const payments = monthlyPayments
                .filter(p => group.ids.includes(p.modelId))
                .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
            const totalPaid = payments.filter(p => p.status === 'Payé').reduce((sum, p) => sum + (p.amount || 0), 0);
            const partialPayments = payments.filter(p => p.status === 'En attente').length;
            const unpaidPayments = payments.filter(p => p.status === 'En retard').length;
            const isUpToDate = isGroupUpToDate(group.ids);
            return {
                modelId: group.primaryId,
                modelName: group.name,
                totalPaid,
                partialPayments,
                unpaidPayments,
                isUpToDate,
                paymentsCount: payments.length,
                lastPayment: payments[0] || null,
                groupIds: group.ids
            } as any;
        });
    }, [modelGroups, monthlyPayments]);

    // Filtrage
    const filteredStats = modelPaymentStats.filter(stat => {
        const matchesSearch = stat.modelName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = 
            filterStatus === 'all' ? true :
            filterStatus === 'ajour' ? stat.isUpToDate :
            filterStatus === 'paye' ? stat.unpaidPayments === 0 && stat.partialPayments === 0 :
            filterStatus === 'en_attente' ? stat.partialPayments > 0 :
            filterStatus === 'en_retard' ? stat.unpaidPayments > 0 : true;
        
        return matchesSearch && matchesStatus;
    });

    const sortedStats = useMemo(() => {
        const arr = [...filteredStats];
        if (sortOrder === 'name') {
            arr.sort((a, b) => a.modelName.localeCompare(b.modelName, 'fr', { sensitivity: 'base' }));
        } else if (sortOrder === 'status') {
            // À jour d'abord, puis en retard; puis alpha
            arr.sort((a, b) => {
                if (a.isUpToDate !== b.isUpToDate) return a.isUpToDate ? -1 : 1;
                return a.modelName.localeCompare(b.modelName, 'fr', { sensitivity: 'base' });
            });
        } else if (sortOrder === 'last_payment') {
            arr.sort((a, b) => {
                const ta = a.lastPayment ? new Date(a.lastPayment.paymentDate).getTime() : 0;
                const tb = b.lastPayment ? new Date(b.lastPayment.paymentDate).getTime() : 0;
                if (tb !== ta) return tb - ta; // plus récent d'abord
                return a.modelName.localeCompare(b.modelName, 'fr', { sensitivity: 'base' });
            });
        }
        return arr;
    }, [filteredStats, sortOrder]);

    const handleAddPayment = async () => {
        if (!selectedModel || !data || !paymentAmount) return;

        const model = models.find(m => m.id === selectedModel);
        if (!model) return;

        const amount = amountChoice === 'custom' ? parseFloat(paymentAmount) : parseFloat(amountChoice);
        if (!Number.isFinite(amount) || amount <= 0) return;
        
        const newPayment: MonthlyPayment = {
            id: `payment-${Date.now()}`,
            modelId: model.id,
            modelName: model.name,
            month: paymentMonth,
            amount: amount,
            method: paymentMethod,
            paymentDate: paymentDate,
            status: paymentStatus,
            notes: paymentNotes
        };

        // Créer aussi une transaction comptable
        const subcategory = amount === 15000 ? 'Frais d\'inscription' :
                           amount === 16500 ? 'Cotisations + Inscriptions' :
                           amount === 1500 ? 'Cotisations mensuelles' :
                           'Paiements en avance';

        const description = amount === 15000 ? `Inscription - ${model.name}` :
                           amount === 16500 ? `Cotisation + Inscription - ${model.name}` :
                           amount === 1500 ? `Cotisation mensuelle - ${model.name}` :
                           `Paiement ${paymentStatus.toLowerCase()} - ${model.name}`;

        const newTransaction = {
            id: `migration-${model.id}-${Date.now()}`,
            date: paymentDate,
            category: 'revenue',
            subcategory: subcategory,
            description: description,
            amount: amount,
            currency: 'FCFA',
            paymentMethod: paymentMethod === 'Espèces' ? 'cash' : 
                          paymentMethod === 'Virement' ? 'bank_transfer' : 
                          'other',
            reference: `${subcategory.toUpperCase().replace(/\s/g, '-')}-${model.name.replace(/\s/g, ' ')}-2025`,
            notes: paymentNotes || `Paiement ${paymentStatus.toLowerCase()} pour ${model.name} (Migration)`,
            createdBy: 'admin',
            createdAt: new Date().toISOString(),
            relatedModelId: model.id,
            relatedModelName: model.name
        };

        const updatedPayments = [...monthlyPayments, newPayment];
        const updatedTransactions = [...(data.accountingTransactions || []), newTransaction];

        await saveData({ 
            ...data, 
            monthlyPayments: updatedPayments,
            accountingTransactions: updatedTransactions
        });

        // Reset form
        resetForm();
        setIsAdding(false);
    };

    const handleEditPayment = async () => {
        if (!editingPayment || !data || !paymentAmount) return;

        const amount = parseFloat(paymentAmount);
        
        const updatedPayment: MonthlyPayment = {
            ...editingPayment,
            amount: amount,
            method: paymentMethod,
            paymentDate: paymentDate,
            month: paymentMonth,
            status: paymentStatus,
            notes: paymentNotes
        };

        const updatedPayments = monthlyPayments.map(p => 
            p.id === editingPayment.id ? updatedPayment : p
        );

        await saveData({ ...data, monthlyPayments: updatedPayments });

        resetForm();
        setEditingPayment(null);
    };

    const handleDeletePayment = async (paymentId: string) => {
        if (!data || !confirm('Êtes-vous sûr de vouloir supprimer ce paiement ?')) return;

        const updatedPayments = monthlyPayments.filter(p => p.id !== paymentId);
        await saveData({ ...data, monthlyPayments: updatedPayments });
    };

    const startEdit = (payment: MonthlyPayment) => {
        setEditingPayment(payment);
        setSelectedModel(payment.modelId);
        if (payment.amount === 1500 || payment.amount === 15000 || payment.amount === 16500) {
            setAmountChoice(String(payment.amount) as '1500' | '15000' | '16500');
            setPaymentAmount(String(payment.amount));
        } else {
            setAmountChoice('custom');
            setPaymentAmount(String(payment.amount));
        }
        setPaymentMethod(payment.method);
        setPaymentDate(payment.paymentDate);
        setPaymentMonth(payment.month);
        setPaymentStatus(payment.status);
        setPaymentNotes(payment.notes || '');
        setIsAdding(false);
    };

    const resetForm = () => {
        setSelectedModel('');
        setAmountChoice('1500');
        setPaymentAmount('1500');
        setPaymentMethod('Espèces');
        setPaymentStatus('Payé');
        setPaymentDate(new Date().toISOString().split('T')[0]);
        setPaymentMonth(new Date().toISOString().slice(0, 7));
        setPaymentNotes('');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount) + ' FCFA';
    };

    if (isAdding || editingPayment) {
        return (
            <AdminLayout>
                <AdminPageHeader 
                    title={editingPayment ? "Modifier un Paiement" : "Enregistrer un Paiement"}
                    subtitle="Cotisation mensuelle (1 500 FCFA), inscription (15 000 FCFA) ou paiement partiel"
                />

                <AdminSection title="Informations du Paiement">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                Mannequin *
                            </label>
                            <select
                                value={selectedModel}
                                onChange={e => setSelectedModel(e.target.value)}
                                disabled={!!editingPayment}
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none disabled:opacity-50"
                                required
                            >
                                <option value="">Sélectionner un mannequin</option>
                                {/* Deduplicated by name */}
                                {modelGroups.map(g => (
                                    <option key={g.primaryId} value={g.primaryId}>
                                        {g.name} {isGroupUpToDate(g.ids) ? '✓ À jour' : ''}
                                    </option>
                                ))}
                                {/* Ensure edit mode shows current modelId if not primary */}
                                {editingPayment && !modelGroups.some(g => g.primaryId === editingPayment.modelId) && (
                                    <option value={editingPayment.modelId}>{editingPayment.modelName}</option>
                                )}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Montant (FCFA) *
                                </label>
                                <select
                                    value={amountChoice}
                                    onChange={e => {
                                        const v = e.target.value as '1500' | '15000' | '16500' | 'custom';
                                        setAmountChoice(v);
                                        if (v === 'custom') {
                                            setPaymentAmount('');
                                        } else {
                                            setPaymentAmount(v);
                                        }
                                    }}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="1500">1 500 FCFA (Cotisation)</option>
                                    <option value="15000">15 000 FCFA (Inscription)</option>
                                    <option value="16500">16 500 FCFA (Cotisation + Inscription)</option>
                                    <option value="custom">Montant personnalisé</option>
                                </select>
                            </div>

                            {amountChoice === 'custom' && (
                                <div>
                                    <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                        Montant personnalisé *
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={paymentAmount}
                                        onChange={e => setPaymentAmount(e.target.value)}
                                        placeholder="Entrer le montant"
                                        className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Méthode de Paiement *
                                </label>
                                <select
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value as 'Espèces' | 'Virement' | 'Autre')}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="Espèces">Espèces</option>
                                    <option value="Virement">Virement</option>
                                    <option value="Autre">Autre</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Date de Paiement *
                                </label>
                                <input
                                    type="date"
                                    value={paymentDate}
                                    onChange={e => setPaymentDate(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Mois *
                                </label>
                                <input
                                    type="month"
                                    value={paymentMonth}
                                    onChange={e => setPaymentMonth(e.target.value)}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                    Statut *
                                </label>
                                <select
                                    value={paymentStatus}
                                    onChange={e => setPaymentStatus(e.target.value as 'Payé' | 'En attente' | 'En retard')}
                                    className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="Payé">Payé</option>
                                    <option value="En attente">En attente</option>
                                    <option value="En retard">En retard</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-pm-off-white mb-2">
                                Notes (optionnel)
                            </label>
                            <textarea
                                value={paymentNotes}
                                onChange={e => setPaymentNotes(e.target.value)}
                                rows={3}
                                placeholder="Informations supplémentaires..."
                                className="w-full bg-pm-dark border border-pm-gold/20 rounded px-4 py-3 text-pm-off-white focus:border-pm-gold focus:outline-none"
                            />
                        </div>

                        {/* Résumé */}
                        {selectedModel && ((amountChoice !== 'custom') || (amountChoice === 'custom' && paymentAmount)) && (
                            <div className="bg-pm-gold/10 border border-pm-gold/30 rounded-lg p-4">
                                <h4 className="text-pm-gold font-bold mb-3">Résumé du Paiement</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Mannequin:</span>
                                        <span className="text-pm-off-white font-semibold">
                                            {models.find(m => m.id === selectedModel)?.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Montant:</span>
                                        <span className="text-pm-gold font-bold">
                                            {formatCurrency(amountChoice === 'custom' ? parseFloat(paymentAmount || '0') : parseFloat(amountChoice))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Méthode:</span>
                                        <span className="text-pm-off-white">{paymentMethod}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-pm-off-white/70">Statut:</span>
                                        <span className={`font-semibold ${
                                            paymentStatus === 'Payé' ? 'text-green-400' :
                                            paymentStatus === 'En attente' ? 'text-yellow-400' :
                                            'text-red-400'
                                        }`}>
                                            {paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </AdminSection>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={editingPayment ? handleEditPayment : handleAddPayment}
                        disabled={!selectedModel || (amountChoice === 'custom' ? !paymentAmount : !amountChoice)}
                        className="px-6 py-3 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {editingPayment ? 'Modifier' : 'Enregistrer'}
                    </button>
                    <button
                        onClick={() => {
                            setIsAdding(false);
                            setEditingPayment(null);
                            resetForm();
                        }}
                        className="px-6 py-3 bg-black border border-pm-gold/20 text-pm-off-white rounded-lg hover:border-pm-gold/50 transition-colors"
                    >
                        Annuler
                    </button>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <AdminPageHeader 
                title="Paiements Mannequins"
                subtitle="Gestion des cotisations mensuelles (1 500 FCFA) et inscriptions (15 000 FCFA)"
            />
            <div className="mb-6 flex items-center gap-3">
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-pm-gold text-black font-semibold rounded-lg hover:bg-white transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Enregistrer un Paiement
                </button>
                <input
                    id="import-mp"
                    type="file"
                    accept="application/json"
                    className="hidden"
                    ref={importInputRef}
                    onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImportFile(f);
                        e.currentTarget.value = '';
                    }}
                />
                <button
                    type="button"
                    onClick={() => importInputRef.current?.click()}
                    className="px-4 py-2 bg-black border border-pm-gold/30 text-pm-off-white rounded-lg hover:border-pm-gold/60"
                    title="Importer des paiements depuis un fichier JSON exporté"
                >
                    Importer JSON
                </button>
                <button
                    type="button"
                    onClick={handleMergeDuplicates}
                    className="px-4 py-2 bg-black border border-pm-gold/30 text-pm-off-white rounded-lg hover:border-pm-gold/60"
                    title="Fusionner les doublons (même nom) et réassigner les paiements"
                >
                    Fusionner doublons
                </button>
            </div>

            {/* Statistiques globales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Mannequins À Jour</p>
                            <p className="text-2xl font-bold text-green-400">
                                {modelPaymentStats.filter(s => s.isUpToDate).length}
                            </p>
                        </div>
                        <CheckCircleIcon className="w-12 h-12 text-green-400/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">En Retard</p>
                            <p className="text-2xl font-bold text-red-400">
                                {modelPaymentStats.filter(s => !s.isUpToDate).length}
                            </p>
                        </div>
                        <ExclamationCircleIcon className="w-12 h-12 text-red-400/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Total Encaissé</p>
                            <p className="text-2xl font-bold text-pm-gold">
                                {formatCurrency(modelPaymentStats.reduce((sum, s) => sum + s.totalPaid, 0))}
                            </p>
                        </div>
                        <CurrencyDollarIcon className="w-12 h-12 text-pm-gold/30" />
                    </div>
                </AdminCard>
                <AdminCard>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pm-off-white/60 mb-1">Total Paiements</p>
                            <p className="text-2xl font-bold text-pm-off-white">
                                {monthlyPayments.length}
                            </p>
                        </div>
                        <ClockIcon className="w-12 h-12 text-pm-off-white/30" />
                    </div>
                </AdminCard>
            </div>

            {/* Recherche et filtres */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-pm-off-white/60 absolute left-3 top-3" />
                    <input
                        type="text"
                        placeholder="Rechercher un mannequin..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full bg-pm-dark border border-pm-gold/20 rounded pl-10 pr-4 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {(['all', 'ajour', 'paye', 'en_attente', 'en_retard'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                                filterStatus === status
                                    ? 'bg-pm-gold text-black'
                                    : 'bg-black border border-pm-gold/20 text-pm-off-white hover:border-pm-gold/50'
                            }`}
                        >
                            {status === 'all' ? 'Tous' : 
                             status === 'ajour' ? 'À jour' :
                             status === 'paye' ? 'Tout payé' :
                             status === 'en_attente' ? 'En attente' :
                             'En retard'}
                        </button>
                    ))}
                </div>
                <div>
                    <label className="block text-xs text-pm-off-white/60 mb-1">Tri</label>
                    <select
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value as any)}
                        className="bg-pm-dark border border-pm-gold/20 rounded px-3 py-2 text-pm-off-white focus:border-pm-gold focus:outline-none"
                    >
                        <option value="name">Nom (A → Z)</option>
                        <option value="status">Statut (À jour → En retard)</option>
                        <option value="last_payment">Dernier paiement (récent → ancien)</option>
                    </select>
                </div>
            </div>

            {/* Liste des mannequins avec statut */}
            <AdminSection title={`Mannequins (${sortedStats.length})`}>
                        <div className="space-y-4">
                    {sortedStats.map(stat => {
                        const modelPayments = monthlyPayments
                            .filter(p => (stat as any).groupIds ? (stat as any).groupIds.includes(p.modelId) : p.modelId === stat.modelId)
                            .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());

                        return (
                            <AdminCard key={stat.modelId}>
                                <div className="space-y-4">
                                    {/* En-tête mannequin */}
                                    <div className="flex items-start gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            stat.isUpToDate ? 'bg-green-600/20' : 'bg-red-600/20'
                                        }`}>
                                            {stat.isUpToDate ? (
                                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <ExclamationCircleIcon className="w-6 h-6 text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <button
                                                onClick={() => {
                                                    setIsAdding(true);
                                                    setSelectedModel(stat.modelId);
                                                }}
                                                className="text-left text-lg font-bold text-pm-off-white mb-1 hover:text-pm-gold"
                                                title="Créer un paiement pour ce mannequin"
                                            >
                                                {stat.modelName}
                                            </button>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    stat.isUpToDate 
                                                        ? 'bg-green-600/20 text-green-400' 
                                                        : 'bg-red-600/20 text-red-400'
                                                }`}>
                                                    {stat.isUpToDate ? '✓ À jour' : '⚠ En retard'}
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-pm-gold/20 text-pm-gold">
                                                    {stat.paymentsCount} paiement{stat.paymentsCount > 1 ? 's' : ''}
                                                </span>
                                                {stat.lastPayment && (
                                                    <span className="px-2 py-1 rounded text-xs font-bold bg-blue-600/20 text-blue-400">
                                                        Dernier: {new Date(stat.lastPayment.paymentDate).toLocaleDateString('fr-FR')}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-pm-off-white/80">
                                                <span className="text-green-400 font-bold">{formatCurrency(stat.totalPaid)}</span> encaissé
                                                {stat.partialPayments > 0 && (
                                                    <span className="ml-3 text-yellow-400">• {stat.partialPayments} partiel</span>
                                                )}
                                                {stat.unpaidPayments > 0 && (
                                                    <span className="ml-3 text-red-400">• {stat.unpaidPayments} impayé</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Historique des paiements */}
                                    {modelPayments.length > 0 && (
                                        <div className="border-t border-pm-gold/10 pt-4">
                                            <h4 className="text-sm font-semibold text-pm-off-white/70 mb-3">Historique des paiements</h4>
                                            <div className="space-y-2">
                                                {modelPayments.slice(0, 5).map(payment => (
                                                    <div key={payment.id} className="flex items-center justify-between bg-pm-dark/30 p-3 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="text-pm-off-white font-semibold">
                                                                    {formatCurrency(payment.amount)}
                                                                </span>
                                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                                    payment.status === 'Payé' ? 'bg-green-600/20 text-green-400' :
                                                                    payment.status === 'En attente' ? 'bg-yellow-600/20 text-yellow-400' :
                                                                    'bg-red-600/20 text-red-400'
                                                                }`}>
                                                                    {payment.status}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-pm-off-white/60">
                                                                {new Date(payment.paymentDate).toLocaleDateString('fr-FR')} • {payment.method} • Mois: {payment.month}
                                                            </div>
                                                            {payment.notes && (
                                                                <div className="text-xs text-pm-off-white/50 mt-1">{payment.notes}</div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEdit(payment)}
                                                                className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <PencilIcon className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeletePayment(payment.id)}
                                                                className="p-2 text-red-400 hover:bg-red-600/10 rounded transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {modelPayments.length > 5 && (
                                                    <p className="text-xs text-pm-off-white/60 text-center pt-2">
                                                        Et {modelPayments.length - 5} autre{modelPayments.length - 5 > 1 ? 's' : ''} paiement{modelPayments.length - 5 > 1 ? 's' : ''}...
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </AdminCard>
                        );
                    })}
                </div>

                {filteredStats.length === 0 && (
                    <div className="text-center py-12">
                        <CurrencyDollarIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                        <p className="text-pm-off-white/60">Aucun mannequin trouvé</p>
                    </div>
                )}
            </AdminSection>
        </AdminLayout>
    );
};

export default AdminPayments;
