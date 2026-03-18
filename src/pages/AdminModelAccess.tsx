import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const AdminModelAccess: React.FC = () => {
  const { data, saveData } = useData();
  const models = data?.models ?? [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleSavePassword = (id: string) => {
    if (!data || !newPassword.trim()) return;
    saveData({ ...data, models: data.models.map(m => m.id === id ? { ...m, password: newPassword.trim() } : m) });
    setEditingId(null);
    setNewPassword('');
  };

  const toggleShow = (id: string) => setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Admin - Acces Mannequins" noIndex />
      <div className="container mx-auto px-6">
        <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
          <ChevronLeftIcon className="w-5 h-5" /> Retour au Tableau de Bord
        </Link>
        <h1 className="text-4xl font-playfair text-pm-gold mb-2">Acces Mannequins</h1>
        <p className="text-pm-off-white/50 text-sm mb-8">Gerez les identifiants de connexion des mannequins.</p>
        <div className="bg-black border border-pm-gold/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-pm-dark/50">
                <tr className="border-b border-pm-gold/20">
                  <th className="p-4 uppercase text-xs tracking-wider">Nom</th>
                  <th className="p-4 uppercase text-xs tracking-wider">Identifiant</th>
                  <th className="p-4 uppercase text-xs tracking-wider">Mot de passe</th>
                  <th className="p-4 uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {models.map(m => (
                  <tr key={m.id} className="border-b border-pm-dark hover:bg-pm-dark/50">
                    <td className="p-4 font-semibold">{m.name}</td>
                    <td className="p-4 text-sm font-mono text-pm-gold/80">{m.username}</td>
                    <td className="p-4 text-sm font-mono">
                      {editingId === m.id ? (
                        <div className="flex items-center gap-2">
                          <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Nouveau mot de passe" className="bg-pm-dark border border-pm-gold/30 rounded px-2 py-1 text-sm text-pm-off-white w-40" autoFocus />
                          <button onClick={() => handleSavePassword(m.id)} className="text-xs px-2 py-1 bg-pm-gold text-pm-dark font-bold rounded">OK</button>
                          <button onClick={() => { setEditingId(null); setNewPassword(''); }} className="text-xs px-2 py-1 border border-pm-gold/30 rounded text-pm-off-white">X</button>
                        </div>
                      ) : (
                        <span className="text-pm-off-white/60">{showPasswords[m.id] ? m.password : '........'}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => toggleShow(m.id)} className="text-pm-gold/60 hover:text-pm-gold">
                          {showPasswords[m.id] ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => { setEditingId(m.id); setNewPassword(m.password); }} className="text-pm-gold/60 hover:text-pm-gold">
                          <KeyIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {models.length === 0 && <p className="text-center p-8 text-pm-off-white/60">Aucun mannequin.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModelAccess;
