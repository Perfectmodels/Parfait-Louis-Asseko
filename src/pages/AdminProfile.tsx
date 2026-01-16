import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { AdminProfile } from '../types';
import { UserIcon, LockClosedIcon, EnvelopeIcon, PhoneIcon, PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const AdminProfilePage: React.FC = () => {
    const { data, saveData } = useData();
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [originalProfile, setOriginalProfile] = useState<AdminProfile | null>(null);
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (data && data.adminProfile) {
            setProfile({ ...data.adminProfile });
            setOriginalProfile({ ...data.adminProfile });
            setPasswordConfirm(data.adminProfile.password);
        }
    }, [data]);

    const handleChange = (field: keyof AdminProfile, value: string) => {
        if (!profile) return;
        setProfile({ ...profile, [field]: value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        if (!data || !profile) return;

        if (profile.password !== passwordConfirm) {
            setMessage({ type: 'error', text: "Les mots de passe ne correspondent pas." });
            return;
        }

        setIsSaving(true);
        try {
            await saveData({ ...data, adminProfile: profile });
            setOriginalProfile({ ...profile });
            setMessage({ type: 'success', text: "Profil administrateur mis à jour avec succès." });
        } catch (error) {
            console.error("Erreur sauvegarde admin:", error);
            setMessage({ type: 'error', text: "Erreur lors de la sauvegarde." });
        } finally {
            setIsSaving(false);
        }
    };

    if (!profile) return <div className="text-white p-8">Chargement...</div>;

    const hasChanges = JSON.stringify(profile) !== JSON.stringify(originalProfile) || profile.password !== passwordConfirm;

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <h1 className="text-3xl font-playfair text-pm-gold mb-8 border-b border-pm-gold/20 pb-4">Profil Administrateur</h1>

            {message && (
                <div className={`p-4 rounded mb-6 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-700' : 'bg-red-900/50 text-red-200 border border-red-700'}`}>
                    <CheckCircleIcon className="w-5 h-5" />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Card */}
                <div className="lg:col-span-1">
                    <div className="bg-pm-dark-light rounded-lg border border-pm-gold/20 p-6 text-center shadow-lg">
                        <div className="relative inline-block mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pm-gold mx-auto bg-black flex items-center justify-center">
                                {profile.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-16 h-16 text-pm-gold/50" />
                                )}
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                        <p className="text-pm-gold text-sm">{profile.email}</p>
                        <p className="text-xs text-pm-off-white/50 mt-2 uppercase tracking-widest">Super Admin</p>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave} className="bg-pm-dark-light rounded-lg border border-pm-gold/20 p-8 shadow-lg space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-pm-off-white mb-1">Nom Complet</label>
                                <div className="relative">
                                    <UserIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        placeholder="Votre Nom Complet"
                                        className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:border-pm-gold outline-none focus:ring-1 focus:ring-pm-gold"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-off-white mb-1">Email (Contact)</label>
                                <div className="relative">
                                    <EnvelopeIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        placeholder="admin@exemple.com"
                                        className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:border-pm-gold outline-none focus:ring-1 focus:ring-pm-gold"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-off-white mb-1">Nom d'utilisateur (Login)</label>
                                <div className="relative">
                                    <UserIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={profile.username}
                                        onChange={(e) => handleChange('username', e.target.value)}
                                        placeholder="votre_pseudo"
                                        className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:border-pm-gold outline-none focus:ring-1 focus:ring-pm-gold"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-pm-off-white mb-1">Téléphone</label>
                                <div className="relative">
                                    <PhoneIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={profile.phone || ''}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        placeholder="+241 00 00 00 00"
                                        className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:border-pm-gold outline-none focus:ring-1 focus:ring-pm-gold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-pm-gold/10 pt-6">
                            <h3 className="text-lg font-playfair text-pm-gold mb-4">Sécurité</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white mb-1">Mot de passe</label>
                                    <div className="relative">
                                        <LockClosedIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            value={profile.password}
                                            onChange={(e) => handleChange('password', e.target.value)}
                                            placeholder="Votre mot de passe"
                                            className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:border-pm-gold outline-none focus:ring-1 focus:ring-pm-gold"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pm-off-white mb-1">Confirmer mot de passe</label>
                                    <div className="relative">
                                        <LockClosedIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="password"
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            placeholder="Confirmer le mot de passe"
                                            className={`w-full bg-black/30 border rounded-lg py-2 pl-10 pr-4 text-white outline-none focus:ring-1 ${profile.password !== passwordConfirm ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-pm-gold/20 focus:border-pm-gold focus:ring-pm-gold'}`}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-pm-gold/10 pt-6">
                            <label className="block text-sm font-medium text-pm-off-white mb-1">Avatar URL</label>
                            <div className="relative">
                                <PhotoIcon className="w-5 h-5 text-pm-gold/50 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={profile.avatarUrl || ''}
                                    onChange={(e) => handleChange('avatarUrl', e.target.value)}
                                    placeholder="https://..."
                                    className="w-full bg-black/30 border border-pm-gold/20 rounded-lg py-2 pl-10 pr-4 text-white focus:border-pm-gold outline-none focus:ring-1 focus:ring-pm-gold"
                                />
                            </div>
                            <p className="text-xs text-pm-off-white/40 mt-1">Lien vers une image carrée de préférence.</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={!hasChanges || isSaving}
                                className="px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]"
                            >
                                {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
