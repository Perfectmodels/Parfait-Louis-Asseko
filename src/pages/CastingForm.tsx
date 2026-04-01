import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { invalidateCache } from '../hooks/useFirebaseCollection';
import CloudinaryUploader from '../components/CloudinaryUploader';
import { notifyAdmin } from '../utils/adminNotify';

const STEPS = ['Infos personnelles', 'Mensurations', 'Expérience', 'Photos'];

const EMPTY = {
  // Étape 1
  firstName: '', lastName: '', birthDate: '', gender: 'Femme', nationality: '', city: '', email: '', phone: '',
  // Étape 2
  height: '', weight: '', chest: '', waist: '', hips: '', shoeSize: '', eyeColor: '', hairColor: '',
  // Étape 3
  experience: 'none', instagram: '', portfolioLink: '',
  // Étape 4
  photoPortraitUrl: '', photoFullBodyUrl: '', photoProfileUrl: '',
};

type FormData = typeof EMPTY;

const inputCls = "w-full bg-black/40 border border-pm-gold/20 rounded-lg px-4 py-3 text-sm text-pm-off-white placeholder:text-white/20 focus:outline-none focus:border-pm-gold transition-colors";
const labelCls = "text-xs uppercase tracking-widest text-pm-off-white/40 mb-1.5 block";

const CastingForm: React.FC = () => {
  const navigate = useNavigate();
  const { addDocument } = useData();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const update = (field: keyof FormData, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await addDocument('castingApplications', {
        ...form,
        status: 'Nouveau',
        submissionDate: new Date().toISOString(),
        passageNumber: Math.floor(Math.random() * 9000) + 1000,
      });
      invalidateCache('castingApplications');
      
      // Notification push admin
      notifyAdmin('casting', `${form.firstName} ${form.lastName} — ${form.city}`, '/admin/casting-applications').catch(() => {});
      
      setDone(true);
    } catch (e: any) {
      setError(e.message || 'Erreur lors de la soumission');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="bg-pm-dark min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-pm-gold/10 border border-pm-gold/30 flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-8 h-8 text-pm-gold" />
          </div>
          <h2 className="text-3xl font-playfair font-black text-white mb-3">Candidature envoyée</h2>
          <p className="text-pm-off-white/50 text-sm mb-8">Nous avons bien reçu votre dossier. Notre équipe vous contactera sous 48h.</p>
          <button onClick={() => navigate('/casting')} className="px-6 py-3 bg-pm-gold text-pm-dark font-black text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors">
            Retour au casting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pm-dark min-h-screen text-pm-off-white">
      <SEO title="Formulaire de Candidature — Casting" />
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 max-w-2xl">
        <button onClick={() => navigate('/casting')} className="inline-flex items-center gap-2 text-pm-gold/60 hover:text-pm-gold text-xs uppercase tracking-widest font-black mb-8 sm:mb-10 transition-colors">
          <ChevronLeftIcon className="w-4 h-4" /> Retour
        </button>

        <h1 className="text-3xl sm:text-4xl font-playfair font-black italic mb-2">Candidature Casting</h1>
        <p className="text-pm-off-white/40 text-sm mb-8 sm:mb-10">Étape {step + 1} sur {STEPS.length} — {STEPS[step]}</p>

        {/* Stepper */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-8 sm:mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`flex items-center gap-1.5 sm:gap-2 ${i <= step ? 'text-pm-gold' : 'text-white/20'}`}>
                <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-black transition-all ${i < step ? 'bg-pm-gold border-pm-gold text-pm-dark' : i === step ? 'border-pm-gold text-pm-gold' : 'border-white/10 text-white/20'}`}>
                  {i < step ? <CheckIcon className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className="text-[10px] uppercase tracking-widest hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-pm-gold/40' : 'bg-white/10'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-black/30 border border-pm-gold/10 rounded-2xl p-5 sm:p-8">
          {/* Étape 1 */}
          {step === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className={labelCls}>Prénom *</label>
                <input value={form.firstName} onChange={e => update('firstName', e.target.value)} placeholder="Prénom" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Nom *</label>
                <input value={form.lastName} onChange={e => update('lastName', e.target.value)} placeholder="Nom de famille" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date de naissance *</label>
                <input type="date" value={form.birthDate} onChange={e => update('birthDate', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Genre *</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)} className={inputCls}>
                  <option value="Femme">Femme</option>
                  <option value="Homme">Homme</option>
                  <option value="Non-binaire">Non-binaire</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Nationalité</label>
                <input value={form.nationality} onChange={e => update('nationality', e.target.value)} placeholder="Ex: Gabonaise" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Ville *</label>
                <input value={form.city} onChange={e => update('city', e.target.value)} placeholder="Ex: Libreville" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="votre@email.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Téléphone *</label>
                <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+241 077 00 00 00" className={inputCls} />
              </div>
            </div>
          )}

          {/* Étape 2 */}
          {step === 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
              {[
                { label: 'Taille (cm) *', field: 'height', placeholder: '175' },
                { label: 'Poids (kg)', field: 'weight', placeholder: '60' },
                { label: 'Poitrine (cm)', field: 'chest', placeholder: '90' },
                { label: 'Taille vêtement (cm)', field: 'waist', placeholder: '65' },
                { label: 'Hanches (cm)', field: 'hips', placeholder: '95' },
                { label: 'Pointure', field: 'shoeSize', placeholder: '39' },
              ].map(({ label, field, placeholder }) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <input type="number" value={(form as any)[field]} onChange={e => update(field as keyof FormData, e.target.value)} placeholder={placeholder} className={inputCls} />
                </div>
              ))}
              <div>
                <label className={labelCls}>Couleur des yeux</label>
                <input value={form.eyeColor} onChange={e => update('eyeColor', e.target.value)} placeholder="Ex: Marron" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Couleur des cheveux</label>
                <input value={form.hairColor} onChange={e => update('hairColor', e.target.value)} placeholder="Ex: Noir" className={inputCls} />
              </div>
            </div>
          )}

          {/* Étape 3 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Niveau d'expérience *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { value: 'none', label: 'Débutant(e)', desc: 'Aucune expérience' },
                    { value: 'beginner', label: 'Novice', desc: 'Quelques shootings' },
                    { value: 'intermediate', label: 'Intermédiaire', desc: 'Défilés locaux' },
                    { value: 'professional', label: 'Professionnel(le)', desc: 'Portfolio solide' },
                  ].map(opt => (
                    <button key={opt.value} type="button" onClick={() => update('experience', opt.value)}
                      className={`p-4 rounded-xl border text-left transition-all ${form.experience === opt.value ? 'border-pm-gold bg-pm-gold/10' : 'border-white/10 hover:border-pm-gold/30'}`}>
                      <p className={`text-sm font-bold ${form.experience === opt.value ? 'text-pm-gold' : 'text-white/70'}`}>{opt.label}</p>
                      <p className="text-xs text-white/30 mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                <input value={form.instagram} onChange={e => update('instagram', e.target.value)} placeholder="@votre_compte" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Lien portfolio</label>
                <input type="url" value={form.portfolioLink} onChange={e => update('portfolioLink', e.target.value)} placeholder="https://..." className={inputCls} />
              </div>
            </div>
          )}

          {/* Étape 4 */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-sm text-pm-off-white/50">Ajoutez au moins une photo. Fond neutre recommandé.</p>
              {[
                { label: 'Portrait (visage)', field: 'photoPortraitUrl' },
                { label: 'Plein corps', field: 'photoFullBodyUrl' },
                { label: 'Profil (de côté)', field: 'photoProfileUrl' },
              ].map(({ label, field }) => (
                <div key={field}>
                  <label className={labelCls}>{label}</label>
                  <CloudinaryUploader
                    value={(form as any)[field]}
                    onChange={(url: string) => update(field as keyof FormData, url)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">{error}</p>}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 sm:mt-8">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-pm-gold/20 text-pm-off-white/60 text-xs uppercase tracking-widest rounded-full hover:border-pm-gold/50 hover:text-pm-off-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeftIcon className="w-4 h-4" /> Précédent
          </button>

          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-pm-gold text-pm-dark font-black text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors">
              Suivant <ChevronRightIcon className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-pm-gold text-pm-dark font-black text-xs uppercase tracking-widest rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting
                ? <><span className="w-3.5 h-3.5 border-2 border-pm-dark/30 border-t-pm-dark rounded-full animate-spin" />Envoi…</>
                : <><CheckIcon className="w-4 h-4" />Soumettre ma candidature</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CastingForm;

