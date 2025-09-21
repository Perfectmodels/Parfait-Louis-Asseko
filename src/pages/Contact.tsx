
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  MapPinIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  PaperAirplaneIcon,
  BuildingOffice2Icon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  BriefcaseIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useData } from '../contexts/DataContext';
import PublicPageLayout from '../components/PublicPageLayout';
import { ContactMessage, BookingRequest } from '../types';

// Simplified email sending stubs for demonstration
const sendContactEmailNotification = (message: ContactMessage) => console.log("Sending contact email:", message);
const sendBookingEmailNotification = (request: BookingRequest) => console.log("Sending booking email:", request);

const Contact: React.FC = () => {
    const { data, saveData, isInitialized } = useData();
    const location = useLocation();
    
    const [formType, setFormType] = useState<'contact' | 'booking'>('contact');
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', clientCompany: '', requestedModels: '', startDate: '', endDate: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('type') === 'booking') setFormType('booking');
        if (params.get('service')) setFormData(prev => ({ ...prev, subject: `Demande concernant: ${params.get('service')}` }));
    }, [location.search]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        if (!data || !saveData) return;

        try {
            if (formType === 'contact') {
                const newMsg: ContactMessage = { id: `contact-${Date.now()}`, submissionDate: new Date().toISOString(), status: 'Nouveau', ...formData };
                await saveData({ ...data, contactMessages: [...(data.contactMessages || []), newMsg] });
                sendContactEmailNotification(newMsg);
                setStatusMessage('Message envoyé. Nous vous répondrons bientôt !');
            } else {
                const newReq: BookingRequest = { id: `booking-${Date.now()}`, submissionDate: new Date().toISOString(), status: 'Nouveau', clientName: formData.name, clientEmail: formData.email, ...formData };
                await saveData({ ...data, bookingRequests: [...(data.bookingRequests || []), newReq] });
                sendBookingEmailNotification(newReq);
                setStatusMessage('Demande de booking envoyée. Notre équipe vous contactera.');
            }
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '', clientCompany: '', requestedModels: '', startDate: '', endDate: '' });
        } catch (error) {
            setStatus('error');
            setStatusMessage('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    if (!isInitialized) return <div className="min-h-screen bg-pm-dark"></div>;

    return (
      <PublicPageLayout
        title="Contactez-nous"
        subtitle="Pour toute question, collaboration ou demande de booking, notre équipe est à votre écoute."
        heroImage={data?.siteImages.contactHero}
      >
        <div className="grid lg:grid-cols-5 gap-12">
          
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-2 space-y-8"
          >
              <div>
                <h2 className="text-3xl font-playfair text-pm-gold mb-6">Informations</h2>
                <div className="space-y-6">
                  <InfoBlock icon={MapPinIcon} title="Adresse" content={data?.contactInfo.address} />
                  <InfoBlock icon={PhoneIcon} title="Téléphone" content={data?.contactInfo.phone} href={`tel:${data?.contactInfo.phone}`} />
                  <InfoBlock icon={EnvelopeIcon} title="Email" content={data?.contactInfo.email} href={`mailto:${data?.contactInfo.email}`} />
                </div>
              </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-3 bg-black/30 border border-pm-gold/20 rounded-2xl p-8 shadow-2xl shadow-pm-gold/5"
          >
            <div className="flex justify-center mb-8">
                <div className="bg-black/50 p-1 rounded-full border border-pm-gold/20">
                    <button onClick={() => setFormType('contact')} className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors ${formType === 'contact' ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'}`}>Contact</button>
                    <button onClick={() => setFormType('booking')} className={`px-5 py-2.5 text-sm font-semibold rounded-full transition-colors ${formType === 'booking' ? 'bg-pm-gold text-pm-dark' : 'text-pm-off-white/70 hover:text-pm-gold'}`}>Booking</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={formType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="space-y-6"
                >
                  {formType === 'contact' ? (
                    <>
                      <FormInput icon={UserIcon} name="name" placeholder="Nom complet" value={formData.name} onChange={handleChange} required />
                      <FormInput icon={EnvelopeIcon} name="email" type="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} required />
                      <FormInput icon={BriefcaseIcon} name="subject" placeholder="Sujet" value={formData.subject} onChange={handleChange} required />
                      <FormTextarea name="message" placeholder="Votre message" value={formData.message} onChange={handleChange} required />
                    </>
                  ) : (
                    <>
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormInput icon={UserIcon} name="name" placeholder="Nom du client" value={formData.name} onChange={handleChange} required />
                        <FormInput icon={EnvelopeIcon} name="email" type="email" placeholder="Email du client" value={formData.email} onChange={handleChange} required />
                      </div>
                      <FormInput icon={BuildingOffice2Icon} name="clientCompany" placeholder="Société (optionnel)" value={formData.clientCompany} onChange={handleChange} />
                      <FormSelect name="requestedModels" value={formData.requestedModels} onChange={handleChange} options={[{value: '', label: 'Choisir un mannequin'}, ...(data?.models.filter(m => m.isPublic).map(m => ({value: m.name, label: m.name})) || []), {value: 'autre', label: 'Autre'}]} required />
                      <div className="grid md:grid-cols-2 gap-6">
                          <FormInput icon={CalendarDaysIcon} name="startDate" type="date" placeholder="Date de début" value={formData.startDate} onChange={handleChange} />
                          <FormInput icon={CalendarDaysIcon} name="endDate" type="date" placeholder="Date de fin" value={formData.endDate} onChange={handleChange} />
                      </div>
                      <FormTextarea name="message" placeholder="Détails du projet" value={formData.message} onChange={handleChange} required />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>

              <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-pm-gold text-pm-dark font-bold rounded-full hover:bg-white transition-all disabled:opacity-60">
                <PaperAirplaneIcon className="w-5 h-5" />
                {status === 'loading' ? 'Envoi...' : (formType === 'contact' ? 'Envoyer le message' : 'Faire une demande de booking')}
              </button>

              {statusMessage && (
                <div className={`flex items-center gap-3 p-4 rounded-lg text-sm ${status === 'success' ? 'bg-green-500/10 text-green-300 border border-green-500/20' : 'bg-red-500/10 text-red-300 border border-red-500/20'}`}>
                  {status === 'success' ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
                  {statusMessage}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </PublicPageLayout>
    );
};

const InfoBlock: React.FC<{ icon: React.ElementType; title: string; content?: string; href?: string }> = ({ icon: Icon, title, content, href }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-pm-gold/10 rounded-lg flex items-center justify-center">
      <Icon className="w-6 h-6 text-pm-gold" />
    </div>
    <div>
      <h3 className="font-bold text-pm-off-white text-lg">{title}</h3>
      {href ? 
        <a href={href} className="text-pm-off-white/70 hover:text-pm-gold transition-colors">{content}</a> :
        <p className="text-pm-off-white/70">{content}</p>
      }
    </div>
  </div>
);

const FormInput: React.FC<any> = ({ icon: Icon, ...props }) => (
    <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Icon className="w-5 h-5 text-pm-gold/50" />
        </div>
        <input {...props} className="w-full bg-black/40 border border-pm-gold/30 rounded-full pl-12 pr-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all" />
    </div>
);

const FormTextarea: React.FC<any> = (props) => (
    <textarea {...props} rows={4} className="w-full bg-black/40 border border-pm-gold/30 rounded-2xl px-4 py-3 text-pm-off-white placeholder:text-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all" />
);

const FormSelect: React.FC<any> = ({ options, ...props }) => (
    <select {...props} className="w-full bg-black/40 border border-pm-gold/30 rounded-full px-4 py-3 text-pm-off-white focus:outline-none focus:ring-2 focus:ring-pm-gold/50 transition-all">
        {options.map((opt:any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
);

export default Contact;
