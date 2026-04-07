import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit2, Save, X, Upload, CheckCircle, Clock, TrendingUp, RotateCcw } from 'lucide-react';
import { rtdb } from '../firebase';
import {
  ref,
  set,
  remove,
  update,
  onValue,
  push,
  increment,
} from 'firebase/database';
import { MissOneLightPendingVote } from '../types';
import { uploadToCloudinary, validateFile } from '../utils/cloudinaryService';

interface Candidate {
  id: string;
  order: number;
  name: string;
  slug: string;
  photo: string;
  bio: string;
  votes: number;
  status: 'active' | 'hidden' | 'winner';
}

const INITIAL_CANDIDATES = [
  { order: 1,  name: 'LÉONCIA',  slug: 'leoncia'  },
  { order: 2,  name: 'CELIA',    slug: 'celia'    },
  { order: 3,  name: 'LAÏCA',    slug: 'laica'    },
  { order: 4,  name: 'SARAH',    slug: 'sarah'    },
  { order: 5,  name: 'ANNA',     slug: 'anna'     },
  { order: 6,  name: 'RÉUSSITE', slug: 'reussite' },
  { order: 7,  name: 'JOHANNE',  slug: 'johanne'  },
  { order: 8,  name: 'LEÏLA',    slug: 'leila'    },
  { order: 9,  name: 'DJENIFER', slug: 'djenifer' },
  { order: 10, name: 'RENÉE',    slug: 'renee'    },
  { order: 11, name: 'FANELLA',  slug: 'fanella'  },
  { order: 12, name: 'ARIANA',   slug: 'ariana'   },
];

const EMPTY_FORM = {
  order: '', name: '', slug: '', photo: '', bio: '', status: 'active' as Candidate['status'],
};

const RTDB_PATH = 'missOneLight/candidates';

export default function AdminMissOneLight() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [formUploading, setFormUploading] = useState(false);
  const rowFileRef = useRef<HTMLInputElement>(null);
  const formFileRef = useRef<HTMLInputElement>(null);
  const pendingRowId = useRef<string | null>(null);

  // Pending votes state
  const [activeTab, setActiveTab] = useState<'candidates' | 'pending' | 'comptabilite'>('candidates');
  const [pendingVotes, setPendingVotes] = useState<MissOneLightPendingVote[]>([]);
  const [validating, setValidating] = useState<string | null>(null);
  const [pendingSubTab, setPendingSubTab] = useState<'waiting' | 'done'>('waiting');

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Upload photo depuis le tableau (quick upload)
  const handleRowUpload = async (file: File) => {
    const id = pendingRowId.current;
    if (!id) return;
    const err = validateFile(file, 'image');
    if (err) { showToast(err, 'error'); return; }
    setUploadingId(id);
    try {
      const res = await uploadToCloudinary(file, 'image', 'miss-one-light');
      await update(ref(rtdb, `${RTDB_PATH}/${id}`), { photo: res.secure_url });
      showToast('Photo mise à jour', 'success');
    } catch {
      showToast("Erreur lors de l'upload", 'error');
    } finally {
      setUploadingId(null);
      pendingRowId.current = null;
    }
  };

  // Upload photo depuis le formulaire
  const handleFormUpload = async (file: File) => {
    const err = validateFile(file, 'image');
    if (err) { showToast(err, 'error'); return; }
    setFormUploading(true);
    try {
      const res = await uploadToCloudinary(file, 'image', 'miss-one-light');
      setFormData(prev => ({ ...prev, photo: res.secure_url }));
      showToast('Photo uploadée', 'success');
    } catch {
      showToast("Erreur lors de l'upload", 'error');
    } finally {
      setFormUploading(false);
    }
  };

  // Écoute temps réel RTDB
  useEffect(() => {
    const candidatesRef = ref(rtdb, RTDB_PATH);
    const unsubscribe = onValue(candidatesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: Candidate[] = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<Candidate, 'id'>),
        }));
        list.sort((a, b) => a.order - b.order);
        setCandidates(list);
      } else {
        setCandidates([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load pending votes
  useEffect(() => {
    const pendingRef = ref(rtdb, 'missOneLight/pendingVotes');
    const unsubscribe = onValue(pendingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: MissOneLightPendingVote[] = Object.entries(data).map(([id, val]) => ({
          id,
          ...(val as Omit<MissOneLightPendingVote, 'id'>),
        })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setPendingVotes(list);
      } else {
        setPendingVotes([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleValidateVote = async (pending: MissOneLightPendingVote) => {
    const credited = pending.totalVotes ?? pending.votes;
    if (!confirm(`Valider ${credited} vote(s) pour ${pending.candidateName} ?\n(${pending.votes} achetés + ${pending.bonusVotes ?? 0} bonus)`)) return;
    setValidating(pending.id);
    try {
      // Re-read the record first to guard against double-validation
      // (two admins clicking validate simultaneously)
      const { get } = await import('firebase/database');
      const snap = await get(ref(rtdb, `missOneLight/pendingVotes/${pending.id}`));
      if (!snap.exists() || snap.val()?.validated === true) {
        showToast('Ce vote a déjà été validé ou supprimé.', 'error');
        return;
      }
      // Mark validated first, then increment — order matters for consistency
      await update(ref(rtdb, `missOneLight/pendingVotes/${pending.id}`), {
        validated: true,
        validatedAt: new Date().toISOString(),
      });
      // increment() is atomic in RTDB — safe under concurrent writes
      await update(ref(rtdb, `${RTDB_PATH}/${pending.candidateId}`), {
        votes: increment(credited),
      });
      showToast(`✅ ${credited} vote(s) crédités pour ${pending.candidateName}`, 'success');
    } catch {
      showToast('Erreur lors de la validation', 'error');
    } finally {
      setValidating(null);
    }
  };

  const handleDeletePending = async (id: string) => {
    if (!confirm('Supprimer cette demande ?')) return;
    await remove(ref(rtdb, `missOneLight/pendingVotes/${id}`));
    showToast('Demande supprimée', 'success');
  };

  const handleWhatsApp = (pending: MissOneLightPendingVote) => {
    const msg = `Bonjour, votre vote pour ${pending.candidateName} (${pending.votes} votes — ${pending.votes * 100} FCFA) a bien été validé ! Merci pour votre soutien. 🌟`;
    window.open(`https://wa.me/${pending.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleImport = async () => {
    if (!confirm('Importer les 12 candidates dans le Realtime Database ?')) return;
    setImporting(true);
    try {
      for (const c of INITIAL_CANDIDATES) {
        const newRef = push(ref(rtdb, RTDB_PATH));
        await set(newRef, {
          order: c.order,
          name: c.name,
          slug: c.slug,
          photo: '',
          bio: '',
          votes: 0,
          status: 'active',
        });
      }
      showToast('12 candidates importées avec succès', 'success');
    } catch {
      showToast("Erreur lors de l'import", 'error');
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order || !formData.name || !formData.slug) {
      showToast('Numéro, nom et slug sont requis', 'error');
      return;
    }
    const payload = {
      order: parseInt(formData.order),
      name: formData.name,
      slug: formData.slug,
      photo: formData.photo,
      bio: formData.bio,
      status: formData.status,
    };
    try {
      if (editingId) {
        await update(ref(rtdb, `${RTDB_PATH}/${editingId}`), payload);
        showToast('Candidate mise à jour', 'success');
      } else {
        const newRef = push(ref(rtdb, RTDB_PATH));
        await set(newRef, { ...payload, votes: 0 });
        showToast('Candidate ajoutée', 'success');
      }
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
    } catch {
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleEdit = (c: Candidate) => {
    setFormData({
      order: c.order.toString(), name: c.name, slug: c.slug,
      photo: c.photo, bio: c.bio, status: c.status,
    });
    setEditingId(c.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette candidate ?')) return;
    try {
      await remove(ref(rtdb, `${RTDB_PATH}/${id}`));
      showToast('Candidate supprimée', 'success');
    } catch {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleResetVotes = async (c: { id: string; name: string }) => {
    if (!confirm(`Remettre les votes de ${c.name} à zéro ?\nLes transactions validées seront marquées comme annulées dans la comptabilité.`)) return;
    try {
      // 1. Reset vote count on the candidate
      await update(ref(rtdb, `${RTDB_PATH}/${c.id}`), { votes: 0 });

      // 2. Mark all validated pending votes for this candidate as cancelled
      //    so the accounting tab stays balanced
      const toCancel = pendingVotes.filter(v => v.candidateId === c.id && v.validated && !v.cancelled);
      await Promise.all(toCancel.map(v =>
        update(ref(rtdb, `missOneLight/pendingVotes/${v.id}`), {
          cancelled: true,
          cancelledAt: new Date().toISOString(),
        })
      ));

      showToast(`Votes de ${c.name} remis à zéro${toCancel.length > 0 ? ` · ${toCancel.length} transaction(s) annulée(s)` : ''}`, 'success');
    } catch {
      showToast('Erreur lors de la remise à zéro', 'error');
    }
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const statusLabel: Record<string, string> = { active: 'Active', hidden: 'Masquée', winner: 'Gagnante' };
  const statusColor: Record<string, string> = {
    active: 'bg-green-500/20 text-green-300',
    hidden: 'bg-gray-500/20 text-gray-400',
    winner: 'bg-yellow-500/20 text-yellow-300',
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-white text-xl">Chargement...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white">Gestion Miss One Light</h1>
            <p className="text-white/40 text-sm mt-1">Realtime Database · missOneLight</p>
          </div>
          <div className="flex gap-3">
            {activeTab === 'candidates' && candidates.length === 0 && (
              <button
                onClick={handleImport}
                disabled={importing}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-all"
              >
                <Upload size={18} />
                {importing ? 'Import...' : 'Importer les 12 candidates'}
              </button>
            )}
            {activeTab === 'candidates' && (
              <button
                onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData(EMPTY_FORM); }}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-all"
              >
                <Plus size={18} />
                Ajouter
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('candidates')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'candidates' ? 'bg-pink-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            Candidates ({candidates.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'pending' ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            <Clock size={14} />
            Votes en attente
            {pendingVotes.filter(v => !v.validated).length > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {pendingVotes.filter(v => !v.validated).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('comptabilite')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'comptabilite' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            <TrendingUp size={14} />
            Comptabilité
          </button>
        </div>

        {/* Form */}
        {activeTab === 'candidates' && showForm && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-5">
              {editingId ? 'Modifier la candidate' : 'Nouvelle candidate'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">Ordre de passage</label>
                  <input type="number" min="1" value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    placeholder="1" />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Nom</label>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    placeholder="LÉONCIA" />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Slug</label>
                  <input type="text" value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                    placeholder="leoncia" />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Photo</label>
                  <div className="flex gap-2">
                    <input type="url" value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
                      placeholder="https://... ou uploader →" />
                    <button type="button" onClick={() => formFileRef.current?.click()}
                      disabled={formUploading}
                      className="bg-white/10 hover:bg-white/20 disabled:opacity-50 border border-white/20 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm transition-all whitespace-nowrap">
                      <Upload size={14} />
                      {formUploading ? 'Upload...' : 'Fichier'}
                    </button>
                  </div>
                  {formData.photo && (
                    <img src={formData.photo} alt="Aperçu" className="h-20 w-20 object-cover rounded-lg mt-2" />
                  )}
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">Statut</label>
                  <select value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Candidate['status'] })}
                    className="w-full bg-slate-800 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-pink-500">
                    <option value="active">Active</option>
                    <option value="hidden">Masquée</option>
                    <option value="winner">Gagnante</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Biographie courte</label>
                <textarea value={formData.bio} rows={3}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 resize-none"
                  placeholder="Quelques mots sur la candidate..." />
              </div>
              {formData.photo && (
                <img src={formData.photo} alt="Aperçu" className="h-28 w-28 object-cover rounded-lg" />
              )}
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all">
                  <Save size={16} />
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button type="button" onClick={handleCancel}
                  className="bg-gray-500/30 hover:bg-gray-500/50 text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 transition-all">
                  <X size={16} />
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hidden file inputs */}
        <input ref={rowFileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleRowUpload(e.target.files[0]); e.target.value = ''; }} />
        <input ref={formFileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) handleFormUpload(e.target.files[0]); e.target.value = ''; }} />

        {/* Table */}
        {activeTab === 'candidates' && (
        <div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">#</th>
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">Photo</th>
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">Nom</th>
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">Slug</th>
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">Statut</th>
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">Votes</th>
                  <th className="px-4 py-4 text-left text-white/70 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id} className="border-b border-white/10 hover:bg-white/5 transition-all">
                    <td className="px-4 py-3 text-white font-bold">{c.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {c.photo
                          ? <img src={c.photo} alt={c.name} className="h-10 w-10 object-cover rounded-lg" />
                          : <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center text-white/30 text-xs">—</div>
                        }
                        <button
                          onClick={() => { pendingRowId.current = c.id; rowFileRef.current?.click(); }}
                          disabled={uploadingId === c.id}
                          title="Changer la photo"
                          className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white/60 hover:text-white p-1.5 rounded-lg transition-all"
                        >
                          {uploadingId === c.id
                            ? <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin block" />
                            : <Upload size={14} />
                          }
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white font-semibold">{c.name}</td>
                    <td className="px-4 py-3 text-white/50 text-sm font-mono">{c.slug}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[c.status]}`}>
                        {statusLabel[c.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-pink-400 font-bold">{c.votes}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(c)}
                          className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 p-2 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleResetVotes(c)}
                          title="Remettre les votes à zéro"
                          className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 p-2 rounded-lg transition-all">
                          <RotateCcw size={16} />
                        </button>
                        <button onClick={() => handleDelete(c.id)}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-300 p-2 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {candidates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">Aucune candidate. Cliquez sur "Importer les 12 candidates" pour démarrer.</p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-2">Total candidates</p>
            <p className="text-4xl font-bold text-white">{candidates.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-2">Total votes</p>
            <p className="text-4xl font-bold text-pink-400">{candidates.reduce((s, c) => s + c.votes, 0)}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            <p className="text-gray-400 text-sm mb-2">En tête</p>
            <p className="text-2xl font-bold text-white">
              {candidates.length > 0 ? candidates.reduce((m, c) => c.votes > m.votes ? c : m).name : '—'}
            </p>
          </div>
        </div>
        </div>
        )} {/* end candidates tab */}

        {/* Pending Votes Tab */}
        {activeTab === 'pending' && (() => {
          const waiting = pendingVotes.filter(v => !v.validated && !v.cancelled);
          const done = pendingVotes.filter(v => v.validated || v.cancelled);

          const VoteCard = ({ v }: { v: MissOneLightPendingVote }) => (
            <div className={`bg-white/5 border rounded-2xl p-4 space-y-3 transition-all ${
              v.cancelled ? 'border-red-500/20 opacity-50' : v.validated ? 'border-green-500/20 opacity-70' : 'border-white/10 hover:border-amber-400/30'
            }`}>
              {/* Top row: candidate + status + amount */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{v.candidateName}</p>
                  <p className="text-white/40 text-xs font-mono mt-0.5 truncate">{v.txRef}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {v.cancelled
                    ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">Annulé</span>
                    : v.validated
                    ? <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">Validé</span>
                    : <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">En attente</span>
                  }
                  <span className="text-amber-400 font-black text-sm">{v.votes * 100} FCFA</span>
                </div>
              </div>

              {/* Votes row */}
              <div className="flex gap-4 text-sm">
                <div>
                  <span className="text-white/30 text-xs">Achetés</span>
                  <p className="text-pink-400 font-bold">{v.votes}</p>
                </div>
                {(v.bonusVotes ?? 0) > 0 && (
                  <div>
                    <span className="text-white/30 text-xs">Bonus</span>
                    <p className="text-[#009E60] font-bold">+{v.bonusVotes}</p>
                  </div>
                )}
                <div>
                  <span className="text-white/30 text-xs">Total</span>
                  <p className="text-white font-black">{v.totalVotes ?? v.votes}</p>
                </div>
              </div>

              {/* Contact row */}
              <div className="text-xs text-white/40 space-y-0.5">
                <p className="truncate">📧 {v.email}</p>
                <p>📱 {v.phone}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                {!v.validated && !v.cancelled && (
                  <button
                    onClick={() => handleValidateVote(v)}
                    disabled={validating === v.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/40 disabled:opacity-50 text-green-300 text-xs font-bold transition-all"
                  >
                    {validating === v.id
                      ? <span className="w-3.5 h-3.5 border border-green-300/40 border-t-green-300 rounded-full animate-spin block" />
                      : <CheckCircle size={14} />
                    }
                    Valider
                  </button>
                )}
                <button
                  onClick={() => handleWhatsApp(v)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/40 text-[#25D366] text-xs font-bold transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WA
                </button>
                <button
                  onClick={() => handleDeletePending(v.id)}
                  className="flex items-center justify-center px-3 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );

          return (
            <div className="space-y-6">
              {/* KPI */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">En attente</p>
                  <p className="text-2xl font-bold text-amber-400">{waiting.length}</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Validés</p>
                  <p className="text-2xl font-bold text-green-400">{pendingVotes.filter(v => v.validated && !v.cancelled).length}</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Votes à valider</p>
                  <p className="text-2xl font-bold text-white">{waiting.reduce((s, v) => s + v.votes, 0)}</p>
                </div>
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-2 border-b border-white/10 pb-0">
                <button
                  onClick={() => setPendingSubTab('waiting')}
                  className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 ${pendingSubTab === 'waiting' ? 'bg-amber-500 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                  En attente
                  {waiting.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{waiting.length}</span>
                  )}
                </button>
                <button
                  onClick={() => setPendingSubTab('done')}
                  className={`px-4 py-2.5 text-sm font-bold rounded-t-xl transition-all flex items-center gap-2 ${pendingSubTab === 'done' ? 'bg-green-600 text-white' : 'text-white/50 hover:text-white'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Traités ({done.length})
                </button>
              </div>

              {/* Sub-tab content */}
              {pendingSubTab === 'waiting' && (
                waiting.length === 0
                  ? <p className="text-white/30 text-sm py-10 text-center border border-white/10 rounded-2xl">Aucune demande en attente</p>
                  : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {waiting.map(v => <VoteCard key={v.id} v={v} />)}
                    </div>
              )}

              {pendingSubTab === 'done' && (
                done.length === 0
                  ? <p className="text-white/30 text-sm py-10 text-center border border-white/10 rounded-2xl">Aucune transaction traitée</p>
                  : <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {done.map(v => <VoteCard key={v.id} v={v} />)}
                    </div>
              )}
            </div>
          );
        })()}

        {/* Comptabilité Tab */}
        {activeTab === 'comptabilite' && (() => {
          const validated = pendingVotes.filter(v => v.validated && !v.cancelled);
          const cancelled = pendingVotes.filter(v => v.cancelled);
          const pending = pendingVotes.filter(v => !v.validated && !v.cancelled);

          const totalRevenue = validated.reduce((s, v) => s + v.votes * 100, 0);
          const pendingRevenue = pending.reduce((s, v) => s + v.votes * 100, 0);
          const cancelledRevenue = cancelled.reduce((s, v) => s + v.votes * 100, 0);
          const totalVotesSold = validated.reduce((s, v) => s + v.votes, 0);
          const totalBonusGiven = validated.reduce((s, v) => s + (v.bonusVotes ?? 0), 0);
          const totalVotesCredited = validated.reduce((s, v) => s + (v.totalVotes ?? v.votes), 0);

          // Per-candidate breakdown
          const byCandidate: Record<string, {
            name: string;
            revenue: number;
            votesSold: number;
            bonusVotes: number;
            totalVotes: number;
            transactions: number;
          }> = {};
          for (const v of validated) {
            if (!byCandidate[v.candidateId]) {
              byCandidate[v.candidateId] = { name: v.candidateName, revenue: 0, votesSold: 0, bonusVotes: 0, totalVotes: 0, transactions: 0 };
            }
            byCandidate[v.candidateId].revenue += v.votes * 100;
            byCandidate[v.candidateId].votesSold += v.votes;
            byCandidate[v.candidateId].bonusVotes += v.bonusVotes ?? 0;
            byCandidate[v.candidateId].totalVotes += v.totalVotes ?? v.votes;
            byCandidate[v.candidateId].transactions += 1;
          }
          const candidateRows = Object.values(byCandidate).sort((a, b) => b.revenue - a.revenue);

          return (
            <div className="space-y-6">
              {/* KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                  <p className="text-emerald-400/60 text-xs uppercase tracking-widest mb-1">Revenus encaissés</p>
                  <p className="text-2xl font-black text-emerald-400">{totalRevenue.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5">
                  <p className="text-amber-400/60 text-xs uppercase tracking-widest mb-1">En attente</p>
                  <p className="text-2xl font-black text-amber-400">{pendingRevenue.toLocaleString()} FCFA</p>
                </div>
                <div className="bg-pink-500/10 border border-pink-500/30 rounded-2xl p-5">
                  <p className="text-pink-400/60 text-xs uppercase tracking-widest mb-1">Votes vendus</p>
                  <p className="text-2xl font-black text-pink-400">{totalVotesSold}</p>
                </div>
                <div className="bg-[#009E60]/10 border border-[#009E60]/30 rounded-2xl p-5">
                  <p className="text-[#009E60]/60 text-xs uppercase tracking-widest mb-1">Bonus offerts</p>
                  <p className="text-2xl font-black text-[#009E60]">+{totalBonusGiven}</p>
                </div>
              </div>

              {/* Summary row */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-wrap gap-6">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Total votes crédités</p>
                  <p className="text-xl font-black text-white">{totalVotesCredited}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Transactions validées</p>
                  <p className="text-xl font-black text-white">{validated.length}</p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Taux bonus moyen</p>
                  <p className="text-xl font-black text-[#009E60]">
                    {totalVotesSold > 0 ? ((totalBonusGiven / totalVotesSold) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Revenu total (+ attente)</p>
                  <p className="text-xl font-black text-white">{(totalRevenue + pendingRevenue).toLocaleString()} FCFA</p>
                </div>
                {cancelledRevenue > 0 && (
                  <div>
                    <p className="text-red-400/60 text-xs uppercase tracking-widest mb-1">Annulés (reset)</p>
                    <p className="text-xl font-black text-red-400">-{cancelledRevenue.toLocaleString()} FCFA</p>
                  </div>
                )}
              </div>

              {/* Per-candidate breakdown */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h3 className="text-white font-bold">Répartition par candidate</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-4 py-3 text-left text-white/60 text-xs uppercase tracking-widest">Candidate</th>
                        <th className="px-4 py-3 text-right text-white/60 text-xs uppercase tracking-widest">Transactions</th>
                        <th className="px-4 py-3 text-right text-white/60 text-xs uppercase tracking-widest">Votes achetés</th>
                        <th className="px-4 py-3 text-right text-[#009E60]/60 text-xs uppercase tracking-widest">Bonus</th>
                        <th className="px-4 py-3 text-right text-white/60 text-xs uppercase tracking-widest">Total crédités</th>
                        <th className="px-4 py-3 text-right text-emerald-400/60 text-xs uppercase tracking-widest">Revenus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {candidateRows.map((row, i) => (
                        <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-all">
                          <td className="px-4 py-3 text-white font-semibold">{row.name}</td>
                          <td className="px-4 py-3 text-white/50 text-right">{row.transactions}</td>
                          <td className="px-4 py-3 text-pink-400 font-bold text-right">{row.votesSold}</td>
                          <td className="px-4 py-3 text-[#009E60] font-bold text-right">+{row.bonusVotes}</td>
                          <td className="px-4 py-3 text-white font-black text-right">{row.totalVotes}</td>
                          <td className="px-4 py-3 text-emerald-400 font-black text-right">{row.revenue.toLocaleString()} FCFA</td>
                        </tr>
                      ))}
                      {candidateRows.length === 0 && (
                        <tr><td colSpan={6} className="text-center py-8 text-white/30">Aucune transaction validée</td></tr>
                      )}
                    </tbody>
                    {candidateRows.length > 0 && (
                      <tfoot>
                        <tr className="bg-white/5 border-t-2 border-white/20">
                          <td className="px-4 py-3 text-white font-black">TOTAL</td>
                          <td className="px-4 py-3 text-white/50 text-right font-bold">{validated.length}</td>
                          <td className="px-4 py-3 text-pink-400 font-black text-right">{totalVotesSold}</td>
                          <td className="px-4 py-3 text-[#009E60] font-black text-right">+{totalBonusGiven}</td>
                          <td className="px-4 py-3 text-white font-black text-right">{totalVotesCredited}</td>
                          <td className="px-4 py-3 text-emerald-400 font-black text-right">{totalRevenue.toLocaleString()} FCFA</td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </div>

              {/* Bonus rule reminder */}
              <div className="bg-[#009E60]/5 border border-[#009E60]/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-[#009E60] text-xl">🎁</span>
                <div>
                  <p className="text-[#009E60] font-bold text-sm mb-1">Règle bonus active</p>
                  <p className="text-white/50 text-sm">+5 votes offerts par tranche de 10 votes achetés (20%). Ex : 10 votes achetés = 15 crédités, 20 = 30, 50 = 75.</p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl backdrop-blur-xl text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-500/10 border-green-500/40 text-green-300' : 'bg-red-500/10 border-red-500/40 text-red-300'}`}>
          {toast.message}
          <button onClick={() => setToast(null)} className="opacity-50 hover:opacity-100 ml-2">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
