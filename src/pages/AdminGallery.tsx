import React, { useEffect, useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { GalleryItem, GalleryAlbum } from '../types';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import ImageInput from '../components/icons/ImageInput';

const AdminGallery: React.FC = () => {
  const { data, saveData } = useData();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [isCreatingAlbum, setIsCreatingAlbum] = useState(false);

  useEffect(() => {
    const list = (data?.gallery || []).slice().sort((a, b) => (a.order || 0) - (b.order || 0));
    setItems(list);
    const alb = (data?.galleryAlbums || []).slice().sort((a,b) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setAlbums(alb);
  }, [data?.gallery, data?.galleryAlbums]);

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditing({ id: '', url: '', title: '', category: '', createdAt: new Date().toISOString(), order: (items[items.length - 1]?.order || 0) + 1 });
  };

  const handleSave = async (item: GalleryItem) => {
    if (!data) return;
    let updated: GalleryItem[];
    if (isCreating) {
      const id = item.id || `gallery-${Date.now()}`;
      updated = [ ...items, { ...item, id } ];
    } else {
      updated = items.map((g) => g.id === item.id ? item : g);
    }
    await saveData({ ...data, gallery: updated });
    setEditing(null);
    setIsCreating(false);
  };

  const handleStartCreateAlbum = () => {
    setIsCreatingAlbum(true);
    setEditingAlbum({ id: '', title: '', description: '', category: 'Autre', coverUrl: '', images: [], tags: [], createdAt: new Date().toISOString() });
  };

  const handleSaveAlbum = async (album: GalleryAlbum) => {
    if (!data) return;
    let updated: GalleryAlbum[];
    if (isCreatingAlbum) {
      const id = album.id || `album-${Date.now()}`;
      // Ensure createdAt is set and album is normalized
      const createdAt = album.createdAt || new Date().toISOString();
      updated = [ ...albums, { ...album, id, createdAt } ];
    } else {
      updated = albums.map((a) => a.id === album.id ? album : a);
    }
    await saveData({ ...data, galleryAlbums: updated });
    setEditingAlbum(null);
    setIsCreatingAlbum(false);
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!data) return;
    if (!confirm('Supprimer cet album ?')) return;
    await saveData({ ...data, galleryAlbums: albums.filter((a) => a.id !== id) });
  };

  const handleDelete = async (id: string) => {
    if (!data) return;
    if (!confirm('Supprimer cet élément de la galerie ?')) return;
    await saveData({ ...data, gallery: items.filter((g) => g.id !== id) });
  };

  const move = async (index: number, dir: 'up' | 'down') => {
    if (!data) return;
    const copy = items.slice();
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= copy.length) return;
    [copy[index], copy[target]] = [copy[target], copy[index]];
    const reordered = copy.map((g, i) => ({ ...g, order: i + 1 }));
    await saveData({ ...data, gallery: reordered });
  };

  if (editing) {
    return (
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="admin-page-header !mb-8">
            <div>
              <h1 className="admin-page-title">{isCreating ? 'Ajouter une image' : "Modifier l'image"}</h1>
              <p className="admin-page-subtitle">Gérez les visuels affichés dans la galerie publique.</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSave(editing); }} className="admin-section-wrapper space-y-6">
            <div>
              <label className="admin-label">Image</label>
              <ImageInput label="URL" value={editing.url} onChange={(v) => setEditing({ ...editing, url: v })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="admin-label">Titre (optionnel)</label>
                <input className="admin-input" value={editing.title || ''} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Catégorie (optionnel)</label>
                <input className="admin-input" value={editing.category || ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Ordre</label>
                <input type="number" className="admin-input" value={editing.order || 1} onChange={(e) => setEditing({ ...editing, order: parseInt(e.target.value || '1', 10) })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-pm-gold/20">
              <button type="button" onClick={() => { setEditing(null); setIsCreating(false); }} className="px-4 py-2 border border-pm-off-white/30 rounded-full text-xs">Annuler</button>
              <button type="submit" className="px-5 py-2 bg-pm-gold text-pm-dark rounded-full text-xs font-bold uppercase tracking-widest">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (editingAlbum) {
    return (
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="admin-page-header !mb-8">
            <div>
              <h1 className="admin-page-title">{isCreatingAlbum ? 'Créer un album' : 'Modifier l\'album'}</h1>
              <p className="admin-page-subtitle">Regroupez des images par défilé, shooting ou collaboration.</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveAlbum(editingAlbum); }} className="admin-section-wrapper space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Titre</label>
                <input className="admin-input" value={editingAlbum.title} onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })} required />
              </div>
              <div>
                <label className="admin-label">Catégorie</label>
                <select className="admin-input" value={editingAlbum.category || 'Autre'} onChange={(e) => setEditingAlbum({ ...editingAlbum, category: e.target.value })}>
                  <option>Défilé</option>
                  <option>Shooting</option>
                  <option>Collaboration</option>
                  <option>Autre</option>
                </select>
              </div>
            </div>
            <div>
              <label className="admin-label">Description</label>
              <textarea className="admin-input admin-textarea" rows={4} value={editingAlbum.description || ''} onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })} />
            </div>
            <div>
              <label className="admin-label">Couverture (URL)</label>
              <input className="admin-input" value={editingAlbum.coverUrl || ''} onChange={(e) => setEditingAlbum({ ...editingAlbum, coverUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="admin-label">Images (une URL par ligne)</label>
              <textarea className="admin-input admin-textarea" rows={6} value={(editingAlbum.images || []).join('\n')} onChange={(e) => setEditingAlbum({ ...editingAlbum, images: e.target.value.split(/\n+/).map(s => s.trim()).filter(Boolean) })} />
              <p className="text-xs text-pm-off-white/50 mt-1">Astuce: utilisez l\'uploader imgbb dans les pages (ex: AdminNews) pour obtenir des URLs.</p>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-pm-gold/20">
              <button type="button" onClick={() => { setEditingAlbum(null); setIsCreatingAlbum(false); }} className="px-4 py-2 border border-pm-off-white/30 rounded-full text-xs">Annuler</button>
              <button type="submit" className="px-5 py-2 bg-pm-gold text-pm-dark rounded-full text-xs font-bold uppercase tracking-widest">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Galerie" noIndex />
      <div className="container mx-auto px-6">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour</Link>
            <h1 className="admin-page-title">Gestion de la Galerie</h1>
            <p className="admin-page-subtitle">Ajoutez, réordonnez ou supprimez des visuels.</p>
          </div>
          <button onClick={handleStartCreate} className="action-btn !flex !items-center !gap-2 !px-4 !py-2">
            <PlusIcon className="w-5 h-5"/> Ajouter Image
          </button>
        </div>

        <div className="admin-section-wrapper !p-4 space-y-6">
          {/* Albums */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-pm-off-white/80">Albums</h2>
              <button onClick={handleStartCreateAlbum} className="action-btn !flex !items-center !gap-2 !px-4 !py-2"><PlusIcon className="w-5 h-5"/> Nouvel Album</button>
            </div>
            {albums.length === 0 && <p className="text-pm-off-white/60">Aucun album pour le moment.</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {albums.map((a) => (
                <div key={a.id} className="bg-pm-dark/50 p-3 rounded border border-pm-gold/10">
                  <div className="flex items-center gap-3">
                    <img src={a.coverUrl || a.images[0] || '/assets/placeholder-model.png'} alt={a.title} className="w-20 h-14 object-cover rounded" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold truncate">{a.title}</p>
                      <p className="text-xs text-pm-off-white/60">{a.category || 'Autre'} • {(a.images || []).length} images</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 justify-end">
                    <button onClick={() => { setEditingAlbum(a); setIsCreatingAlbum(false); }} className="action-btn">Éditer</button>
                    {/* Actions cross-feature */}
                    <button
                      onClick={() => {
                        // propose conversion in News or Article via custom events
                        const type = window.prompt('Convertir en: tapez "news" ou "article"');
                        if (!type) return;
                        const payload = { albumId: a.id };
                        if (type === 'news') {
                          window.dispatchEvent(new CustomEvent('pmm:create-news-from-album', { detail: payload }));
                          alert('Allez dans Actualités: le formulaire sera pré-rempli.');
                        } else if (type === 'article') {
                          window.dispatchEvent(new CustomEvent('pmm:create-article-from-album', { detail: payload }));
                          alert('Allez dans Magazine: le formulaire sera pré-rempli.');
                        }
                      }}
                      className="action-btn !border-pm-gold/50 hover:!bg-pm-gold/10"
                    >Transformer</button>
                    <button onClick={() => handleDeleteAlbum(a.id)} className="action-btn !border-red-500/50 hover:!bg-red-500/20">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          {items.map((g, idx) => (
            <div key={g.id} className="flex items-center justify-between p-3 bg-pm-dark/50 rounded hover:bg-pm-dark">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <img src={g.url} alt={g.title || 'image'} className="w-20 h-14 object-cover rounded" />
                <div className="truncate">
                  <p className="font-bold truncate">{g.title || 'Sans titre'}</p>
                  <p className="text-xs text-pm-off-white/60">{g.category || 'Général'} • Ordre: {g.order || idx + 1}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => move(idx, 'up')} disabled={idx === 0} className="action-btn disabled:opacity-30" title="Monter"><ArrowUpIcon className="w-5 h-5"/></button>
                <button onClick={() => move(idx, 'down')} disabled={idx === items.length - 1} className="action-btn disabled:opacity-30" title="Descendre"><ArrowDownIcon className="w-5 h-5"/></button>
                <button onClick={() => { setEditing(g); setIsCreating(false); }} className="action-btn" title="Modifier">Éditer</button>
                <button onClick={() => handleDelete(g.id)} className="action-btn !border-red-500/50 hover:!bg-red-500/20" title="Supprimer"><TrashIcon className="w-5 h-5"/></button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-center text-pm-off-white/60">Aucun élément pour le moment.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
