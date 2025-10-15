import React, { useEffect, useMemo, useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import { AdminUser, AdminPermissions, AdminRole } from '../types';
import ImageInput from '../components/icons/ImageInput';
import { ChevronLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const defaultPermissions: AdminPermissions = {
  canEditContent: false,
  canPublishContent: false,
  canManageModels: false,
  canManagePayments: false,
  canModerateComments: false,
  canManageAdmins: false,
};

const AdminProfile: React.FC = () => {
  const { data, saveData, isInitialized } = useData();
  const adminId = sessionStorage.getItem('admin_id');
  const currentAdmin = useMemo(() => (data?.adminUsers || []).find(a => a.id === adminId) || null, [data?.adminUsers, adminId]);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [team, setTeam] = useState<AdminUser[]>([]);

  useEffect(() => {
    if (!isInitialized || !data) return;
    const list = data.adminUsers || [];
    let selected: AdminUser | null = currentAdmin;
    if (!selected && list.length > 0) {
      const normalized = (v: string) => v.toLowerCase().trim();
      const byIdOrName = list.find(a =>
        (a.username && normalized(a.username) === 'admin') ||
        (a.email && normalized(a.email) === 'admin@perfectmodels.ga') ||
        (a.name && normalized(a.name) === 'administrateur') ||
        a.role === 'SuperAdmin'
      ) || list[0];
      selected = byIdOrName || null;
    }
    if (!selected && list.length === 0) {
      selected = {
        id: 'admin-super-1',
        name: 'Administrateur',
        username: 'admin',
        password: 'admin2025',
        email: 'admin@perfectmodels.ga',
        phone: '',
        avatarUrl: '',
        role: 'SuperAdmin',
        permissions: {
          canEditContent: true,
          canPublishContent: true,
          canManageModels: true,
          canManagePayments: true,
          canModerateComments: true,
          canManageAdmins: true,
        },
        deputies: [],
        active: true,
      } as AdminUser;
    }
    if (selected) {
      setAdmin(JSON.parse(JSON.stringify(selected)));
      if (adminId !== selected.id) {
        sessionStorage.setItem('admin_id', selected.id);
      }
    }
    setTeam(JSON.parse(JSON.stringify(list)));
  }, [isInitialized, data, currentAdmin, adminId]);

  if (!data || !admin) return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="admin-page-title">Mon Profil Administrateur</h1>
        <p className="admin-page-subtitle">Initialisation du profil en cours...</p>
      </div>
    </div>
  );

  const isSuper = currentAdmin?.role === 'SuperAdmin';

  const handleSaveProfile = async () => {
    const updated = (data.adminUsers || []).map(a => a.id === admin.id ? admin : a);
    await saveData({ ...data, adminUsers: updated });
    alert('Profil mis à jour');
  };

  const handleAddAdmin = async () => {
    if (!isSuper) { alert('Accès refusé'); return; }
    const id = `admin-${Date.now()}`;
    const newUser: AdminUser = {
      id,
      name: 'Nouvel Admin',
      username: `admin${(data.adminUsers || []).length + 1}`,
      password: 'password2025',
      role: 'Communication',
      permissions: { ...defaultPermissions },
      active: true,
    };
    const updated = [ ...(data.adminUsers || []), newUser ];
    await saveData({ ...data, adminUsers: updated });
    setTeam(updated);
  };

  const handleDeleteAdmin = async (id: string) => {
    if (!isSuper) { alert('Accès refusé'); return; }
    if (id === admin.id) { alert('Impossible de supprimer votre propre compte'); return; }
    if (!confirm('Supprimer ce profil admin ?')) return;
    const updated = (data.adminUsers || []).filter(a => a.id !== id);
    await saveData({ ...data, adminUsers: updated });
    setTeam(updated);
  };

  const setPerm = (key: keyof AdminPermissions, value: boolean) => setAdmin(a => a ? ({ ...a, permissions: { ...(a.permissions || defaultPermissions), [key]: value } }) : a);

  const roles: AdminRole[] = ['SuperAdmin', 'Formations', 'Marketing', 'Communication', 'Discipline'];

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Mon Profil" noIndex />
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="admin-page-header">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline"><ChevronLeftIcon className="w-5 h-5"/>Retour</Link>
            <h1 className="admin-page-title">Mon Profil Administrateur</h1>
            <p className="admin-page-subtitle">Informations personnelles, accès et gestion de l'équipe.</p>
          </div>
          <button onClick={handleSaveProfile} className="px-6 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest text-sm rounded-full hover:bg-white">Enregistrer</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="admin-section-wrapper">
            <h2 className="admin-section-title">Mes Informations</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Nom</label>
                <input className="admin-input" value={admin.name} onChange={(e) => setAdmin({ ...admin, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Identifiant</label>
                  <input className="admin-input" value={admin.username} onChange={(e) => setAdmin({ ...admin, username: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Mot de passe</label>
                  <input type="password" className="admin-input" value={admin.password} onChange={(e) => setAdmin({ ...admin, password: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Email</label>
                  <input className="admin-input" value={admin.email || ''} onChange={(e) => setAdmin({ ...admin, email: e.target.value })} />
                </div>
                <div>
                  <label className="admin-label">Téléphone</label>
                  <input className="admin-input" value={admin.phone || ''} onChange={(e) => setAdmin({ ...admin, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="admin-label">Avatar</label>
                <ImageInput label="Photo" value={admin.avatarUrl || ''} onChange={(v) => setAdmin({ ...admin, avatarUrl: v })} />
              </div>
              <div>
                <label className="admin-label">Rôle</label>
                <select className="admin-input" value={admin.role} onChange={(e) => setAdmin({ ...admin, role: e.target.value as AdminRole })}>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(defaultPermissions).map((k) => (
                  <label key={k} className="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={Boolean((admin.permissions as any)?.[k])} onChange={(e) => setPerm(k as keyof AdminPermissions, e.target.checked)} />
                    <span>{k}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-section-wrapper">
            <div className="flex items-center justify-between">
              <h2 className="admin-section-title">Équipe Admin</h2>
              {isSuper && <button onClick={handleAddAdmin} className="inline-flex items-center gap-2 px-3 py-1 border border-pm-gold text-pm-gold rounded-full hover:bg-pm-gold hover:text-pm-dark text-xs"><PlusIcon className="w-4 h-4"/>Ajouter</button>}
            </div>
            <div className="space-y-3">
              {team.map(member => (
                <div key={member.id} className="bg-pm-dark/50 border border-pm-off-white/10 rounded-md p-3 flex items-center justify-between">
                  <div>
                    <p className="font-bold">{member.name} <span className="text-xs text-pm-off-white/60">({member.role})</span></p>
                    <p className="text-xs text-pm-off-white/60">{member.email || ''}</p>
                  </div>
                  {isSuper && <button onClick={() => handleDeleteAdmin(member.id)} className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 text-xs"><TrashIcon className="w-4 h-4"/>Supprimer</button>}
                </div>
              ))}
              {team.length === 0 && <p className="text-sm text-pm-off-white/60">Aucun profil admin pour le moment.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
