import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { PhotoshootBrief } from '../types';

const STATUS_COLORS: Record<PhotoshootBrief['status'], string> = {
  'Nouveau': 'bg-blue-500/20 text-blue-300 border-blue-500',
  'Lu': 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
  'Archivé': 'bg-white/10 text-white/40 border-white/20',
};

const EMPTY_FORM = {
  modelId: '',
  modelName: '',
  theme: '',
  clothingStyle: '',
  accessories: '',
  location: '',
  dateTime: '',
};

const AdminArtisticDirection: React.FC = () => {
  const { data, saveData } = useData();
  const briefs = data?.photoshootBriefs ?? [];
  const models = data?.models ?? [];

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState<PhotoshootBrief | null>(null);
  const [filterStatus, setFilterStatus] = useState<PhotoshootBrief['status'] | 'Tous'>('Tous');

  const filtered = filterStatus === 'Tous' ? briefs : briefs.filter(b => b.status === filterStatus);

  const handleModelChange = (id: string) => {
    const model = models.find(m => m.id === id);
    setForm(f => ({ ...f, modelId: id, modelName: model?.name ?? '' }));
  };

  const handleSubmit = () => {
    if (!data || !form.modelId || !form.theme || !form.dateTime) return;
    const newBrief: PhotoshootBrief = {
      ...form,
      id: `brief-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'Nouveau',
    };
    saveData({ ...data, photoshootBriefs: [newBrief, ...data.photoshootBriefs] });
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleStatus = (id: string, status: PhotoshootBrief['status']) => {
    if (!data) return;
    saveData({ ...data, photoshootBriefs: data.photoshootBriefs.map(b => b.id === id ? { ...b, status } : b) });
  };

  const handleDelete = (id: string) => {
    if (!data || !window.confirm('Supprimer ce brief ?')) return;
    saveData({ ...data, photoshootBriefs: data.photoshootBriefs.filter(b => b.id !== id) });
    if (selected?.id === id) setSelected(null);
  };

  if (!data) return <div className="bg-pm-dark min-h-screen flex items-center justify-center text-pm-off-white">Chargement...</div>;

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white py-20">
      <SEO title="Admin — Direction Artistique" noIndex />
      <div className="container mx-auto px-6">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold/60 hover:text-pm-gold text-xs uppercase tracking-widest font-black mb-12 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" /> Tableau de Bord
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-playfair font-black italic">Admin — Direction Artistique</h1>
          <button onClick={() => setShowForm(v => !v)} className="flex items-center gap-2 bg-pm-gold text-pm-dark px-4 py-2 rounded text-sm font-bold hover:bg-pm-gold/80">
            <PlusIcon className="w-4 h-4" /> Nouveau Brief
          </button>
        </div>

        {/* Formulaire nouveau brief */}
        {showForm && (
          <div className="bg-black/40 border border-pm-gold/30 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-pm-gold mb-4">Nouveau Brief Photoshoot</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Mannequin *</label>
                <select value={form.modelId} onChange={e => handleModelChange(e.target.value)} className="w-full bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold">
                  <option value="">Sélectionner...</option>
                  {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Thème *</label>
                <input type="text" value={form.theme} onChange={e => setForm(f => ({ ...f, theme: e.target.value }))} placeholder="Ex: Élégance Urbaine" className="w-full bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Style vestimentaire</label>
                <input type="text" value={form.clothingStyle} onChange={e => setForm(f => ({ ...f, clothingStyle: e.target.value }))} placeholder="Ex: Robe longue noire" className="w-full bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Accessoires</label>
                <input type="text" value={form.accessories} onChange={e => setForm(f => ({ ...f, accessories: e.target.value }))} placeholder="Ex: Collier doré, sac clutch" className="w-full bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Lieu</label>
                <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Ex: Studio PMM, Libreville" className="w-full bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Date & Heure *</label>
                <input type="datetime-local" value={form.dateTime} onChange={e => setForm(f => ({ ...f, dateTime: e.target.value }))} className="w-full bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleSubmit} className="bg-pm-gold text-pm-dark px-5 py-2 rounded text-sm font-bold hover:bg-pm-gold/80">Créer le Brief</button>
              <button onClick={() => setShowForm(false)} className="border border-pm-gold/30 text-pm-off-white/60 px-5 py-2 rounded text-sm hover:border-pm-gold/60">Annuler</button>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['Tous', 'Nouveau', 'Lu', 'Archivé'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`text-xs px-3 py-1 rounded-full border transition-colors ${filterStatus === s ? 'bg-pm-gold text-pm-dark border-pm-gold font-bold' : 'border-pm-gold/30 text-pm-off-white/60 hover:border-pm-gold/60'}`}>
              {s}
            </button>
          ))}
        </div>

        {/* Tableau */}
        <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-pm-dark/50 border-b border-pm-gold/20">
                <tr>
                  <th className="p-4 text-xs uppercase tracking-wider">Mannequin</th>
                  <th className="p-4 text-xs uppercase tracking-wider hidden sm:table-cell">Thème</th>
                  <th className="p-4 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Statut</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                    <td className="p-4 font-semibold">{b.modelName}</td>
                    <td className="p-4 hidden sm:table-cell text-sm text-pm-off-white/80">{b.theme}</td>
                    <td className="p-4 hidden md:table-cell text-sm text-pm-off-white/60">
                      {b.dateTime ? new Date(b.dateTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td className="p-4">
                      <select value={b.status} onChange={e => handleStatus(b.id, e.target.value as PhotoshootBrief['status'])} className={`text-xs font-bold rounded-full border px-2 py-1 bg-transparent cursor-pointer ${STATUS_COLORS[b.status]}`}>
                        {(['Nouveau', 'Lu', 'Archivé'] as const).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-2">
                      <button onClick={() => setSelected(selected?.id === b.id ? null : b)} className="text-pm-gold/60 hover:text-pm-gold">
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-500/70 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center p-8 text-pm-off-white/40">Aucun brief.</p>}
          </div>
        </div>

        {/* Détail brief sélectionné */}
        {selected && (
          <div className="mt-6 bg-black/40 border border-pm-gold/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-pm-gold mb-4">Détail — {selected.modelName}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div><span className="text-pm-off-white/40 uppercase text-xs tracking-widest block mb-1">Thème</span>{selected.theme || '—'}</div>
              <div><span className="text-pm-off-white/40 uppercase text-xs tracking-widest block mb-1">Style vestimentaire</span>{selected.clothingStyle || '—'}</div>
              <div><span className="text-pm-off-white/40 uppercase text-xs tracking-widest block mb-1">Accessoires</span>{selected.accessories || '—'}</div>
              <div><span className="text-pm-off-white/40 uppercase text-xs tracking-widest block mb-1">Lieu</span>{selected.location || '—'}</div>
              <div><span className="text-pm-off-white/40 uppercase text-xs tracking-widest block mb-1">Date & Heure</span>{selected.dateTime ? new Date(selected.dateTime).toLocaleString('fr-FR') : '—'}</div>
              <div><span className="text-pm-off-white/40 uppercase text-xs tracking-widest block mb-1">Créé le</span>{new Date(selected.createdAt).toLocaleDateString('fr-FR')}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminArtisticDirection;
