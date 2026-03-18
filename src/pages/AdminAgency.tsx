import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, TrashIcon, PlusIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const AdminAgency: React.FC = () => {
  const { data, saveData } = useData();

  // --- Agency Info ---
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({ p1: '', p2: '' });

  useEffect(() => {
    if (data?.agencyInfo) {
      setInfoForm({ p1: data.agencyInfo.about.p1, p2: data.agencyInfo.about.p2 });
    }
  }, [data?.agencyInfo]);

  const saveInfo = () => {
    if (!data) return;
    saveData({ ...data, agencyInfo: { ...data.agencyInfo, about: infoForm } });
    setEditingInfo(false);
  };

  // --- Partners ---
  const [newPartner, setNewPartner] = useState('');
  const partners = data?.agencyPartners ?? [];

  const addPartner = () => {
    if (!data || !newPartner.trim()) return;
    saveData({ ...data, agencyPartners: [...data.agencyPartners, { name: newPartner.trim() }] });
    setNewPartner('');
  };

  const removePartner = (name: string) => {
    if (!data) return;
    saveData({ ...data, agencyPartners: data.agencyPartners.filter(p => p.name !== name) });
  };

  // --- Timeline ---
  const [newTimeline, setNewTimeline] = useState({ year: '', event: '' });
  const timeline = data?.agencyTimeline ?? [];

  const addTimeline = () => {
    if (!data || !newTimeline.year.trim() || !newTimeline.event.trim()) return;
    saveData({ ...data, agencyTimeline: [...data.agencyTimeline, { year: newTimeline.year.trim(), event: newTimeline.event.trim() }] });
    setNewTimeline({ year: '', event: '' });
  };

  const removeTimeline = (year: string) => {
    if (!data) return;
    saveData({ ...data, agencyTimeline: data.agencyTimeline.filter(t => t.year !== year) });
  };

  if (!data) return <div className="bg-pm-dark min-h-screen flex items-center justify-center text-pm-off-white">Chargement...</div>;

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white py-20">
      <SEO title="Admin — Agence" noIndex />
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold/60 hover:text-pm-gold text-xs uppercase tracking-widest font-black mb-12 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" /> Tableau de Bord
        </Link>
        <h1 className="text-4xl font-playfair font-black italic mb-10">Admin — Agence</h1>

        {/* Section À Propos */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-pm-gold uppercase tracking-widest">À Propos</h2>
            {!editingInfo ? (
              <button onClick={() => setEditingInfo(true)} className="flex items-center gap-1 text-xs text-pm-gold/70 hover:text-pm-gold border border-pm-gold/30 px-3 py-1 rounded">
                <PencilIcon className="w-3 h-3" /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={saveInfo} className="flex items-center gap-1 text-xs text-green-400 border border-green-400/30 px-3 py-1 rounded hover:bg-green-400/10">
                  <CheckIcon className="w-3 h-3" /> Sauvegarder
                </button>
                <button onClick={() => setEditingInfo(false)} className="flex items-center gap-1 text-xs text-red-400 border border-red-400/30 px-3 py-1 rounded hover:bg-red-400/10">
                  <XMarkIcon className="w-3 h-3" /> Annuler
                </button>
              </div>
            )}
          </div>
          <div className="bg-black/40 border border-pm-gold/20 rounded-lg p-6 space-y-4">
            {editingInfo ? (
              <>
                <div>
                  <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Paragraphe 1</label>
                  <textarea value={infoForm.p1} onChange={e => setInfoForm(f => ({ ...f, p1: e.target.value }))} rows={4} className="w-full bg-pm-dark border border-pm-gold/30 rounded p-3 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-pm-off-white/50 mb-1 block">Paragraphe 2</label>
                  <textarea value={infoForm.p2} onChange={e => setInfoForm(f => ({ ...f, p2: e.target.value }))} rows={4} className="w-full bg-pm-dark border border-pm-gold/30 rounded p-3 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold" />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-pm-off-white/80 leading-relaxed">{data.agencyInfo?.about.p1}</p>
                <p className="text-sm text-pm-off-white/80 leading-relaxed">{data.agencyInfo?.about.p2}</p>
              </>
            )}
          </div>
        </section>

        {/* Section Partenaires */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-pm-gold uppercase tracking-widest mb-4">Partenaires ({partners.length})</h2>
          <div className="bg-black/40 border border-pm-gold/20 rounded-lg p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {partners.map(p => (
                <span key={p.name} className="flex items-center gap-2 bg-pm-dark border border-pm-gold/30 rounded-full px-3 py-1 text-sm">
                  {p.name}
                  <button onClick={() => removePartner(p.name)} className="text-red-400/70 hover:text-red-400">
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {partners.length === 0 && <p className="text-pm-off-white/40 text-sm">Aucun partenaire.</p>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPartner}
                onChange={e => setNewPartner(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPartner()}
                placeholder="Nom du partenaire..."
                className="flex-1 bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold"
              />
              <button onClick={addPartner} className="flex items-center gap-1 bg-pm-gold text-pm-dark px-4 py-2 rounded text-sm font-bold hover:bg-pm-gold/80">
                <PlusIcon className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </div>
        </section>

        {/* Section Timeline */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-pm-gold uppercase tracking-widest mb-4">Chronologie ({timeline.length})</h2>
          <div className="bg-black/40 border border-pm-gold/20 rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-pm-dark/50 border-b border-pm-gold/20">
                <tr>
                  <th className="p-4 text-xs uppercase tracking-wider w-24">Année</th>
                  <th className="p-4 text-xs uppercase tracking-wider">Événement</th>
                  <th className="p-4 text-xs uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map(t => (
                  <tr key={t.year} className="border-b border-pm-dark hover:bg-pm-dark/50">
                    <td className="p-4 font-bold text-pm-gold">{t.year}</td>
                    <td className="p-4 text-sm">{t.event}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => removeTimeline(t.year)} className="text-red-500/70 hover:text-red-500">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {timeline.length === 0 && <p className="text-center p-6 text-pm-off-white/40 text-sm">Aucune entrée.</p>}
            <div className="p-4 border-t border-pm-gold/20 flex gap-2">
              <input
                type="text"
                value={newTimeline.year}
                onChange={e => setNewTimeline(f => ({ ...f, year: e.target.value }))}
                placeholder="Année"
                className="w-24 bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold"
              />
              <input
                type="text"
                value={newTimeline.event}
                onChange={e => setNewTimeline(f => ({ ...f, event: e.target.value }))}
                placeholder="Description de l'événement..."
                className="flex-1 bg-pm-dark border border-pm-gold/30 rounded px-3 py-2 text-sm text-pm-off-white focus:outline-none focus:border-pm-gold"
              />
              <button onClick={addTimeline} className="flex items-center gap-1 bg-pm-gold text-pm-dark px-4 py-2 rounded text-sm font-bold hover:bg-pm-gold/80">
                <PlusIcon className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminAgency;
