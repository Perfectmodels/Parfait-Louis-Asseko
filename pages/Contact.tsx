import React, { useState } from 'react';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

const Contact: React.FC = () => {
    const { data } = useData();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState('');

    const contactInfo = data?.contactInfo;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setStatusMessage('');

        // This is a mock submission as we can't use Resend SDK on the client side without exposing API key.
        // In a real app, this would be an API call to a serverless function.
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // This is where you would call your backend/serverless function
            // const response = await fetch('/api/send-email', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData),
            // });
            // if (!response.ok) throw new Error('Failed to send message');

            setStatus('success');
            setStatusMessage('Votre message a bien été envoyé. Nous vous répondrons bientôt !');
            setFormData({ name: '', email: '', subject: '', message: '' });

        } catch (error) {
            setStatus('error');
            setStatusMessage("Une erreur s'est produite. Veuillez réessayer plus tard.");
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20">
            <SEO 
              title="Contactez-Nous | Perfect Models Management"
              description="Contactez Perfect Models Management pour toute demande de booking, partenariat ou information. Retrouvez notre adresse, email, téléphone et un formulaire de contact."
              keywords="contacter agence mannequin gabon, booking mannequin, partenariat mode, adresse pmm libreville, agence de mode contact"
            />
            <div className="container mx-auto px-6">
                <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Contactez-Nous</h1>
                <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-16">
                    Pour toute question, collaboration ou demande de booking, notre équipe est à votre disposition.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-black border border-pm-gold/20 p-8 md:p-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                         <h2 className="text-3xl font-playfair text-pm-gold">Nos Coordonnées</h2>
                         {contactInfo && (
                            <div className="space-y-6">
                                <InfoBlock icon={MapPinIcon} title="Adresse" content={contactInfo.address} />
                                <InfoBlock icon={PhoneIcon} title="Téléphone" content={contactInfo.phone} />
                                <InfoBlock icon={EnvelopeIcon} title="Email" content={<a href={`mailto:${contactInfo.email}`} className="hover:text-pm-gold">{contactInfo.email}</a>} />
                            </div>
                         )}
                        <div>
                           <h3 className="text-2xl font-playfair text-pm-gold mt-10 mb-4">Horaires d'Ouverture</h3>
                           <p className="text-pm-off-white/80">Lundi - Vendredi : 9h00 - 18h00</p>
                           <p className="text-pm-off-white/80">Samedi : 10h00 - 14h00 (sur rendez-vous)</p>
                        </div>
                    </div>
                    
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-3xl font-playfair text-pm-gold mb-6">Envoyez-nous un message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <FormInput label="Votre Nom" name="name" type="text" value={formData.name} onChange={handleChange} required />
                                <FormInput label="Votre Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <FormInput label="Sujet" name="subject" type="text" value={formData.subject} onChange={handleChange} required />
                            <FormTextArea label="Votre Message" name="message" value={formData.message} onChange={handleChange} rows={5} required />
                            
                            <div>
                                <button type="submit" disabled={status === 'loading'} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:bg-white disabled:opacity-50">
                                    {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
                                </button>
                            </div>
                            {statusMessage && (
                                <p className={`text-center text-sm p-3 rounded-md ${status === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                                    {statusMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface InfoBlockProps {
    icon: React.ElementType;
    title: string;
    content: React.ReactNode;
}
const InfoBlock: React.FC<InfoBlockProps> = ({ icon: Icon, title, content }) => (
    <div className="flex items-start gap-4">
        <div className="bg-pm-gold/10 p-3 rounded-full">
            <Icon className="w-6 h-6 text-pm-gold"/>
        </div>
        <div>
            <h3 className="font-bold text-lg text-pm-off-white">{title}</h3>
            <p className="text-pm-off-white/80">{content}</p>
        </div>
    </div>
);
const FormInput: React.FC<{label: string, name: string, type: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, required?: boolean}> = ({label, name, type, value, onChange, required}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-2">{label}</label>
        <input id={name} name={name} type={type} value={value} onChange={onChange} required={required} className="admin-input" />
    </div>
);
const FormTextArea: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, rows: number, required?: boolean}> = ({label, name, value, onChange, rows, required}) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-pm-off-white/70 mb-2">{label}</label>
        <textarea id={name} name={name} value={value} onChange={onChange} rows={rows} required={required} className="admin-input admin-textarea" />
    </div>
);

export default Contact;
