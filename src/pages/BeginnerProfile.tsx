import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { BeginnerStudent, MonthlyPayment } from '../types';
import { ArrowLeftIcon, ArrowRightOnRectangleIcon, CheckCircleIcon, ExclamationCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const monthKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

const statusStyles: Record<MonthlyPayment['status'], string> = {
  'Payé': 'bg-green-500/15 text-green-300 border-green-500/40',
  'En attente': 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40',
  'En retard': 'bg-red-500/15 text-red-300 border-red-500/40',
};

const BeginnerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { data, saveData } = useData();

  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('userName') || 'Mannequin Débutant';

  const [form, setForm] = useState({ email: '', phone: '', city: '', instagram: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const student: BeginnerStudent | undefined = useMemo(() => {
    const s = data?.beginnerStudents?.find((st) => st.id === userId);
    if (s) {
      // initialize form with current values
      setTimeout(() => setForm({
        email: s.email || '',
        phone: s.phone || '',
        city: s.city || '',
        instagram: s.instagram || '',
        password: s.password || '',
      }), 0);
    }
    return s;
  }, [data?.beginnerStudents, userId]);

  const payments = useMemo(() => (data?.monthlyPayments || []).filter(p => p.modelId === userId), [data?.monthlyPayments, userId]);
  const currentMonth = monthKey();
  const paymentCurrent = payments.find(p => p.month === currentMonth);
  const latestPayment = payments.slice().sort((a, b) => (a.month < b.month ? 1 : -1))[0];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data || !student) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = data.beginnerStudents.map((s) =>
        s.id === student.id ? { ...s, email: form.email, phone: form.phone, city: form.city, instagram: form.instagram, password: form.password } : s
      );
      await saveData({ ...data, beginnerStudents: updated });
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès.' });
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Une erreur est survenue lors de la mise à jour.' });
    } finally {
      setSaving(false);
    }
  };

  if (!student) {
    return (
      <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-center text-pm-off-white/70">Profil non trouvé. Veuillez vous reconnecter.</p>
          <div className="text-center mt-6">
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full font-bold">Se connecter</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO title="Mon Profil Débutant" noIndex />
      <div className="container mx-auto px-6 max-w-3xl">
        <header className="flex items-center justify-between mb-8">
          <Link to="/classroom-debutant" className="inline-flex items-center gap-2 text-pm-gold hover:underline"><ArrowLeftIcon className="w-5 h-5"/>Retour au Classroom</Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 text-pm-gold/80 hover:text-pm-gold text-sm"><ArrowRightOnRectangleIcon className="w-5 h-5"/>Déconnexion</button>
        </header>

        <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
          <h1 className="text-3xl font-playfair text-pm-gold mb-2">{userName}</h1>
          <p className="text-sm text-pm-off-white/70 mb-6">Profil personnalisé du programme Débutant</p>

          {/* Payment status */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-pm-off-white/80 mb-3">Statut de Paiement</h2>
            {paymentCurrent ? (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusStyles[paymentCurrent.status]}`}>
                {paymentCurrent.status === 'Payé' ? <CheckCircleIcon className="w-4 h-4"/> : paymentCurrent.status === 'En retard' ? <ExclamationCircleIcon className="w-4 h-4"/> : <ClockIcon className="w-4 h-4"/>}
                <span className="text-sm">Mois {paymentCurrent.month} — {paymentCurrent.status}</span>
              </div>
            ) : latestPayment ? (
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusStyles[latestPayment.status]}`}>
                {latestPayment.status === 'Payé' ? <CheckCircleIcon className="w-4 h-4"/> : latestPayment.status === 'En retard' ? <ExclamationCircleIcon className="w-4 h-4"/> : <ClockIcon className="w-4 h-4"/>}
                <span className="text-sm">Dernier enregistrement: {latestPayment.month} — {latestPayment.status}</span>
              </div>
            ) : (
              <p className="text-sm text-pm-off-white/70">Aucun enregistrement de paiement trouvé.</p>
            )}
          </section>

          {/* Edit form */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-pm-off-white/80 mb-3">Mes Informations</h2>
            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="admin-label">Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className="admin-input" placeholder="ex: nom@exemple.com"/>
              </div>
              <div>
                <label htmlFor="phone" className="admin-label">Téléphone</label>
                <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="admin-input" placeholder="ex: +241 ..."/>
              </div>
              <div>
                <label htmlFor="city" className="admin-label">Ville</label>
                <input id="city" name="city" value={form.city} onChange={handleChange} className="admin-input" placeholder="ex: Libreville"/>
              </div>
              <div>
                <label htmlFor="instagram" className="admin-label">Instagram</label>
                <input id="instagram" name="instagram" value={form.instagram} onChange={handleChange} className="admin-input" placeholder="ex: @moncompte"/>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="password" className="admin-label">Mot de passe</label>
                <input id="password" name="password" value={form.password} onChange={handleChange} className="admin-input" placeholder="••••••••"/>
              </div>
              <div className="sm:col-span-2 flex justify-end">
                <button type="submit" disabled={saving} className="px-6 py-2 bg-pm-gold text-pm-dark rounded-full font-bold hover:bg-white disabled:opacity-50">{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </form>
            {message && (
              <p className={`mt-3 text-sm p-3 rounded ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{message.text}</p>
            )}
          </section>

          {/* Quiz recap */}
          <section>
            <h2 className="text-xl font-bold text-pm-off-white/80 mb-3">Mes Résultats aux Quiz</h2>
            {student.quizScores && Object.keys(student.quizScores).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-pm-gold/20">
                      <th className="py-2 pr-4">Module</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Tentatives</th>
                      <th className="py-2 pr-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(student.quizScores).map(([moduleSlug, s]) => (
                      <tr key={moduleSlug} className="border-b border-pm-dark/50">
                        <td className="py-2 pr-4">{moduleSlug}</td>
                        <td className="py-2 pr-4">{s.score} / {s.total}</td>
                        <td className="py-2 pr-4">{s.timesLeft}</td>
                        <td className="py-2 pr-4">{new Date(s.timestamp).toLocaleString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-pm-off-white/70">Aucun quiz complété pour le moment.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BeginnerProfile;
