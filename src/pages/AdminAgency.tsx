import React, { useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminPageHeader from '../components/admin/AdminPageHeader';
import AdminSection from '../components/admin/AdminSection';
import AdminCard from '../components/admin/AdminCard';
import ImageInput from '../components/icons/ImageInput';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminAgency: React.FC = () => {
  const { data, saveData } = useData();
  const [isSaving, setIsSaving] = useState(false);

  const initial = useMemo(() => {
    if (!data) return null;
    return JSON.parse(JSON.stringify({
                agencyInfo: data.agencyInfo,
                agencyTimeline: data.agencyTimeline,
      agencyPartners: data.agencyPartners,
                agencyServices: data.agencyServices,
      siteImages: data.siteImages,
    }));
  }, [data]);

  const [state, setState] = useState<any>(initial);
  React.useEffect(() => setState(initial), [initial]);

  if (!data || !state) return (
    <AdminLayout>
      <SEO title="Gestion de l'Agence" noIndex />
      <div className="text-pm-gold">Chargement...</div>
    </AdminLayout>
  );

  const updateField = (path: string[], value: any) => {
    setState((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cursor = next;
      for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]];
      cursor[path[path.length - 1]] = value;
      return next;
    });
  };

  const pushItem = (path: string[], item: any) => {
    setState((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cursor = next;
      for (let i = 0; i < path.length; i++) cursor = cursor[path[i]];
      cursor.push(item);
      return next;
    });
  };

  const removeItem = (path: string[], index: number) => {
    setState((prev: any) => {
      const next = JSON.parse(JSON.stringify(prev));
      let cursor = next;
      for (let i = 0; i < path.length; i++) cursor = cursor[path[i]];
      cursor.splice(index, 1);
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveData({
        ...data,
        agencyInfo: state.agencyInfo,
        agencyTimeline: state.agencyTimeline,
        agencyPartners: state.agencyPartners,
        agencyServices: state.agencyServices,
        siteImages: state.siteImages,
      });
      alert('Paramètres agence enregistrés.');
    } finally {
      setIsSaving(false);
    }
  };

    return (
    <AdminLayout>
      <SEO title="Gestion de l'Agence" noIndex />
      <AdminPageHeader
        title="Gestion de l'Agence"
        subtitle="Gérer les informations, images, services, partenaires et historique."
        right={(
          <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-lg hover:bg-white disabled:opacity-50">
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        )}
      />

      <AdminSection title="Images du Site">
        <AdminCard className="p-6 space-y-4">
          <ImageInput label="Logo" value={state.siteImages?.logo} onChange={(v) => updateField(['siteImages', 'logo'], v)} />
          <ImageInput label="Image Héros (Accueil)" value={state.siteImages?.hero} onChange={(v) => updateField(['siteImages', 'hero'], v)} />
          <ImageInput label='Image "À Propos" (Accueil)' value={state.siteImages?.about} onChange={(v) => updateField(['siteImages', 'about'], v)} />
        </AdminCard>
      </AdminSection>

      <AdminSection title="Présentation de l'Agence">
        <AdminCard className="p-6 space-y-4">
          <div>
            <label className="admin-label">Texte principal</label>
            <textarea className="admin-textarea" rows={4} value={state.agencyInfo?.about?.p1 || ''} onChange={(e) => updateField(['agencyInfo', 'about', 'p1'], e.target.value)} />
          </div>
                    <div>
            <label className="admin-label">Texte secondaire</label>
            <textarea className="admin-textarea" rows={4} value={state.agencyInfo?.about?.p2 || ''} onChange={(e) => updateField(['agencyInfo', 'about', 'p2'], e.target.value)} />
                    </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-pm-gold">Valeurs</h3>
              <button onClick={() => pushItem(['agencyInfo', 'values'], { name: 'Nouvelle valeur', description: '' })} className="inline-flex items-center gap-2 px-3 py-1 bg-pm-dark border border-pm-gold/50 text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
                <PlusIcon className="w-4 h-4" /> Ajouter
                    </button>
                </div>
            <div className="space-y-3">
              {(state.agencyInfo?.values || []).map((v: any, i: number) => (
                <div key={i} className="p-3 bg-pm-dark rounded-md border border-pm-off-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="admin-label">Nom</label>
                      <input className="admin-input" value={v.name} onChange={(e) => {
                        const copy = [...state.agencyInfo.values];
                        copy[i] = { ...copy[i], name: e.target.value };
                        updateField(['agencyInfo', 'values'], copy);
                      }} />
                        </div>
                    <div>
                      <label className="admin-label">Description</label>
                      <input className="admin-input" value={v.description} onChange={(e) => {
                        const copy = [...state.agencyInfo.values];
                        copy[i] = { ...copy[i], description: e.target.value };
                        updateField(['agencyInfo', 'values'], copy);
                      }} />
                        </div>
                    </div>
                  <div className="text-right mt-2">
                    <button onClick={() => removeItem(['agencyInfo', 'values'], i)} className="text-red-400 hover:bg-red-400/20 px-2 py-1 rounded inline-flex items-center gap-1">
                      <TrashIcon className="w-4 h-4" /> Supprimer
                    </button>
                        </div>
                    </div>
              ))}
                        </div>
                    </div>
        </AdminCard>
      </AdminSection>

      <AdminSection title="Timeline de l'Agence">
        <AdminCard className="p-6 space-y-3">
          <div className="text-right">
            <button onClick={() => pushItem(['agencyTimeline'], { year: new Date().getFullYear().toString(), event: 'Nouvel événement' })} className="inline-flex items-center gap-2 px-3 py-1 bg-pm-dark border border-pm-gold/50 text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
              <PlusIcon className="w-4 h-4" /> Ajouter
            </button>
                        </div>
          {(state.agencyTimeline || []).map((item: any, i: number) => (
            <div key={i} className="p-3 bg-pm-dark rounded-md border border-pm-off-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <label className="admin-label">Année</label>
                <input className="admin-input" value={item.year} onChange={(e) => {
                  const copy = [...state.agencyTimeline];
                  copy[i] = { ...copy[i], year: e.target.value };
                  updateField(['agencyTimeline'], copy);
                }} />
                    </div>
              <div className="md:col-span-2">
                <label className="admin-label">Événement</label>
                <input className="admin-input" value={item.event} onChange={(e) => {
                  const copy = [...state.agencyTimeline];
                  copy[i] = { ...copy[i], event: e.target.value };
                  updateField(['agencyTimeline'], copy);
                }} />
                </div>
              <div className="text-right md:col-span-3">
                <button onClick={() => removeItem(['agencyTimeline'], i)} className="text-red-400 hover:bg-red-400/20 px-2 py-1 rounded inline-flex items-center gap-1">
                  <TrashIcon className="w-4 h-4" /> Supprimer
                </button>
            </div>
        </div>
          ))}
        </AdminCard>
      </AdminSection>

      <AdminSection title="Partenaires">
        <AdminCard className="p-6 space-y-3">
          <div className="text-right">
            <button onClick={() => pushItem(['agencyPartners'], { name: 'Nouveau Partenaire' })} className="inline-flex items-center gap-2 px-3 py-1 bg-pm-dark border border-pm-gold/50 text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
              <PlusIcon className="w-4 h-4" /> Ajouter
            </button>
        </div>
          {(state.agencyPartners || []).map((p: any, i: number) => (
            <div key={i} className="p-3 bg-pm-dark rounded-md border border-pm-off-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="md:col-span-2">
                <label className="admin-label">Nom</label>
                <input className="admin-input" value={p.name} onChange={(e) => {
                  const copy = [...state.agencyPartners];
                  copy[i] = { ...copy[i], name: e.target.value };
                  updateField(['agencyPartners'], copy);
                }} />
    </div>
              <div className="text-right">
                <button onClick={() => removeItem(['agencyPartners'], i)} className="text-red-400 hover:bg-red-400/20 px-2 py-1 rounded inline-flex items-center gap-1">
                  <TrashIcon className="w-4 h-4" /> Supprimer
                    </button>
                            </div>
                </div>
            ))}
        </AdminCard>
      </AdminSection>

      <AdminSection title="Services de l'Agence">
        <AdminCard className="p-6 space-y-3">
          <div className="text-right">
            <button onClick={() => pushItem(['agencyServices'], { title: 'Nouveau service', description: '' })} className="inline-flex items-center gap-2 px-3 py-1 bg-pm-dark border border-pm-gold/50 text-pm-gold text-xs font-bold uppercase tracking-widest rounded-full hover:bg-pm-gold hover:text-pm-dark">
              <PlusIcon className="w-4 h-4" /> Ajouter
            </button>
        </div>
          {(state.agencyServices || []).map((s: any, i: number) => (
            <div key={i} className="p-3 bg-pm-dark rounded-md border border-pm-off-white/10 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                  <label className="admin-label">Titre</label>
                  <input className="admin-input" value={s.title} onChange={(e) => {
                    const copy = [...state.agencyServices];
                    copy[i] = { ...copy[i], title: e.target.value };
                    updateField(['agencyServices'], copy);
                  }} />
                    </div>
                <div>
                  <label className="admin-label">Description</label>
                  <input className="admin-input" value={s.description} onChange={(e) => {
                    const copy = [...state.agencyServices];
                    copy[i] = { ...copy[i], description: e.target.value };
                    updateField(['agencyServices'], copy);
                  }} />
                </div>
            </div>
              <div className="text-right">
                <button onClick={() => removeItem(['agencyServices'], i)} className="text-red-400 hover:bg-red-400/20 px-2 py-1 rounded inline-flex items-center gap-1">
                  <TrashIcon className="w-4 h-4" /> Supprimer
                </button>
            </div>
        </div>
          ))}
        </AdminCard>
      </AdminSection>
    </AdminLayout>
    );
};

export default AdminAgency;


