import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  MapPinIcon, EnvelopeIcon, PhoneIcon,
  PaperAirplaneIcon, CheckCircleIcon, ClockIcon,
} from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../components/icons/SocialIcons';
import BookingForm from '../components/BookingForm';
import { ContactMessage } from '../types';
import {
  sendContactNotificationToAdmin,
  sendContactConfirmationToUser,
} from '../utils/brevoService';

const SUBJECTS = [
  'Demande de booking',
  'Partenariat / Collaboration',
  'Presse & Médias',
  'Renseignements généraux',
  'Autre',
];

const Contact: React.FC = () => {
  const { data, saveData } = useData();
  const location = useLocation();
  const contactInfo = data?.contactInfo;
  const socialLinks = data?.socialLinks;

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', customSubject: '', message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const service = params.get('service');
    if (service) {
      setFormData(prev => ({ ...prev, subject: 'Autre', customSubject: `Demande de devis pour : ${service}` }));
    }
  }, [location.search]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setStatusMessage('');

    if (!data) {
      setStatus('error');
      setStatusMessage("Erreur : impossible de charger les données de l'application.");
      return;
    }

    const finalSubject =
      formData.subject === 'Autre' && formData.customSubject.trim()
        ? formData.customSubject.trim()
        : formData.subject;

    const newMessage: ContactMessage = {
      id: `contact-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      status: 'Nouveau',
      name: formData.name,
      email: formData.email,
      subject: finalSubject,
      message: formData.message,
    };

    try {
      // 1. Sauvegarde Firebase
      await saveData({ ...data, contactMessages: [...(data.contactMessages || []), newMessage] });

      // 2. Emails Brevo en parallèle
      const notifEmail =
        data.contactInfo?.notificationEmail ||
        data.contactInfo?.email ||
        'contact@perfectmodels.ga';

      await Promise.allSettled([
        sendContactNotificationToAdmin({
          name: formData.name,
          email: formData.email,
          subject: finalSubject,
          message: formData.message,
          notificationEmail: notifEmail,
        }),
        sendContactConfirmationToUser({
          name: formData.name,
          email: formData.email,
          subject: finalSubject,
        }),
      ]);

      setStatus('success');
      setStatusMessage('');
      setFormData({ name: '', email: '', phone: '', subject: '', customSubject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setStatusMessage("Une erreur est survenue. Veuillez réessayer ou nous contacter directement.");
      console.error(error);
    }
  };

  return (
    <div className="bg-pm-dark text-pm-off-white min-h-screen">
      <SEO
        title="Contact | Perfect Models Management"
        description="Contactez-nous pour toute demande de booking, de partenariat ou d'information."
        keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode, pmm contact"
        image={data?.siteImages.about}
      />

      {/* Hero */}
      <div className="relative py-24 lg:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-pm-dark to-pm-dark" />
        <div className="relative container mx-auto px-6 text-center">
          <span className="section-label">Parlons-nous</span>
          <h1 className="text-5xl sm:text-7xl font-playfair font-black text-white italic leading-tight mt-4">
            Contactez-<span className="text-pm-gold">nous</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-pm-off-white/60 text-lg">
            Une question, un projet ou une demande de booking ? Notre équipe vous répond sous 24h.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-24 max-w-7xl">

        {/* Info cards + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">

          {/* Left: info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Coordonnées */}
            <div className="bg-black border border-pm-gold/20 rounded-2xl p-8 space-y-6">
              <h2 className="text-xl font-playfair text-pm-gold">Nos coordonnées</h2>
              {contactInfo && (
                <div className="space-y-5">
                  <InfoItem icon={MapPinIcon} label="Adresse" text={contactInfo.address} />
                  <InfoItem icon={PhoneIcon} label="Téléphone" text={contactInfo.phone} href={`tel:${contactInfo.phone}`} />
                  <InfoItem icon={EnvelopeIcon} label="Email" text={contactInfo.email} href={`mailto:${contactInfo.email}`} />
                </div>
              )}
            </div>

            {/* Réseaux */}
            <div className="bg-black border border-pm-gold/20 rounded-2xl p-8">
              <h2 className="text-xl font-playfair text-pm-gold mb-6">Suivez-nous</h2>
              {socialLinks && (
                <div className="flex gap-5">
                  {socialLinks.facebook && <SocialLink href={socialLinks.facebook} icon={FacebookIcon} label="Facebook" />}
                  {socialLinks.instagram && <SocialLink href={socialLinks.instagram} icon={InstagramIcon} label="Instagram" />}
                  {socialLinks.youtube && <SocialLink href={socialLinks.youtube} icon={YoutubeIcon} label="YouTube" />}
                </div>
              )}
            </div>

            {/* Délai de réponse */}
            <div className="bg-pm-gold/5 border border-pm-gold/20 rounded-2xl p-6 flex gap-4 items-start">
              <ClockIcon className="w-6 h-6 text-pm-gold shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-pm-gold uppercase tracking-widest mb-1">Délai de réponse</p>
                <p className="text-sm text-pm-off-white/60">Nous répondons généralement sous 24 à 48 heures ouvrées.</p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              <SuccessCard onReset={() => setStatus('idle')} />
            ) : (
              <div className="bg-black border border-pm-gold/20 rounded-2xl p-8 lg:p-10">
                <h2 className="text-2xl font-playfair text-white mb-8">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Field label="Nom complet *">
                      <input
                        name="name" value={formData.name} onChange={handleChange}
                        required placeholder="Jean Dupont"
                        className="contact-input"
                      />
                    </Field>
                    <Field label="Email *">
                      <input
                        name="email" type="email" value={formData.email} onChange={handleChange}
                        required placeholder="vous@exemple.com"
                        className="contact-input"
                      />
                    </Field>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <Field label="Téléphone (optionnel)">
                      <input
                        name="phone" type="tel" value={formData.phone} onChange={handleChange}
                        placeholder="+241 XX XX XX XX"
                        className="contact-input"
                      />
                    </Field>
                    <Field label="Sujet *">
                      <select
                        name="subject" value={formData.subject} onChange={handleChange}
                        required className="contact-input"
                      >
                        <option value="" disabled>Choisir un sujet…</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                  </div>

                  {formData.subject === 'Autre' && (
                    <Field label="Précisez votre sujet *">
                      <input
                        name="customSubject" value={formData.customSubject} onChange={handleChange}
                        required placeholder="Décrivez brièvement votre demande"
                        className="contact-input"
                      />
                    </Field>
                  )}

                  <Field label="Message *">
                    <textarea
                      name="message" value={formData.message} onChange={handleChange}
                      required rows={6}
                      placeholder="Décrivez votre projet ou votre demande en détail…"
                      className="contact-input resize-none"
                    />
                  </Field>

                  {status === 'error' && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      {statusMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-pm-gold text-pm-dark font-black uppercase tracking-widest rounded-full transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-5 h-5 border-2 border-pm-dark/30 border-t-pm-dark rounded-full animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="w-5 h-5" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Booking */}
        <div className="bg-black border border-pm-gold/20 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-10">
            <span className="section-label">Réservation</span>
            <h2 className="text-3xl font-playfair text-white mt-3">Demande de Booking</h2>
            <p className="text-pm-off-white/60 mt-2">Pour un ou plusieurs mannequins, ou tout autre projet.</p>
          </div>
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

/* ── Sub-components ─────────────────────────────────────────── */

const SuccessCard: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="bg-black border border-green-500/30 rounded-2xl p-10 flex flex-col items-center text-center h-full justify-center gap-6">
    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
      <CheckCircleIcon className="w-10 h-10 text-green-400" />
    </div>
    <div>
      <h3 className="text-2xl font-playfair text-white mb-3">Message envoyé !</h3>
      <p className="text-pm-off-white/60 max-w-sm">
        Nous avons bien reçu votre message. Un email de confirmation vous a été envoyé. Notre équipe vous répondra sous 24–48h.
      </p>
    </div>
    <div className="flex gap-4 flex-wrap justify-center">
      <button onClick={onReset} className="px-6 py-2 border border-pm-gold/40 text-pm-gold rounded-full text-sm hover:bg-pm-gold/10 transition-colors">
        Nouveau message
      </button>
      <Link to="/" className="px-6 py-2 bg-pm-gold text-pm-dark font-bold rounded-full text-sm hover:bg-white transition-colors">
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black uppercase tracking-widest text-pm-off-white/50">{label}</label>
    {children}
  </div>
);

const InfoItem: React.FC<{ icon: React.ElementType; label: string; text: string; href?: string }> = ({
  icon: Icon, label, text, href,
}) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-full bg-pm-gold/10 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-pm-gold" />
    </div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-pm-gold/60 mb-0.5">{label}</p>
      {href
        ? <a href={href} className="text-pm-off-white/80 hover:text-pm-gold transition-colors text-sm">{text}</a>
        : <p className="text-pm-off-white/80 text-sm">{text}</p>
      }
    </div>
  </div>
);

const SocialLink: React.FC<{ href: string; icon: React.ElementType; label: string }> = ({
  href, icon: Icon, label,
}) => (
  <a
    href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
    className="w-12 h-12 rounded-full bg-pm-gold/10 border border-pm-gold/20 flex items-center justify-center text-pm-off-white/60 hover:text-pm-gold hover:border-pm-gold/60 hover:bg-pm-gold/20 transition-all"
  >
    <Icon className="w-5 h-5" />
  </a>
);

export default Contact;
