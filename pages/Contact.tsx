import React, { useState } from 'react';
import { MapPinIcon, DevicePhoneMobileIcon, EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';
import { useData } from '../contexts/DataContext';

const Contact: React.FC = () => {
  const { data, isInitialized } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactInfo = data?.contactInfo;
  const apiKeys = data?.apiKeys;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeys?.emailApiKey) {
      setError("La configuration du service d'envoi d'email (Clé API) est manquante. Veuillez la configurer dans le panel d'administration (Paramètres du Site > Clés API).");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        from: `contact@perfectmodels.ga`,
        to: contactInfo?.email || 'contact@perfectmodels.ga',
        subject: `Nouveau message de contact de ${formData.name}`,
        html: `<div style="font-family: sans-serif;">
                        <h2>Nouveau Message de Contact</h2>
                        <p><strong>Nom:</strong> ${formData.name}</p>
                        <p><strong>Email (à utiliser pour répondre):</strong> ${formData.email}</p>
                        <p><strong>Message:</strong></p>
                        <p style="white-space: pre-wrap; background: #f4f4f4; padding: 15px; border-radius: 5px;">${formData.message}</p>
                      </div>`,
      };

      const response = await fetch('https://octopus-mail.p.rapidapi.com/mail/send', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-rapidapi-host': 'octopus-mail.p.rapidapi.com',
          'x-rapidapi-key': apiKeys.emailApiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Une erreur est survenue lors de l\'envoi.');
      }
      
      setSubmitted(true);

    } catch (err: any) {
      setError(err.message || "Impossible d'envoyer le message. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isInitialized || !contactInfo) {
      return <div className="min-h-screen bg-pm-dark" />;
  }

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title="Contact | Perfect Models Management"
        description="Contactez l'agence Perfect Models Management à Libreville pour toute demande de booking de mannequins, proposition de partenariat ou information. Notre équipe est à votre écoute pour concrétiser vos projets."
        keywords="contacter agence mannequin, booking mannequin gabon, partenariat mode libreville, adresse pmm, téléphone agence mannequin"
      />
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-playfair text-pm-gold text-center mb-4">Contactez-Nous</h1>
        <p className="text-center max-w-2xl mx-auto text-pm-off-white/80 mb-12">
          Pour toute question, partenariat ou booking, n'hésitez pas à nous contacter. Notre équipe est à votre disposition.
        </p>

        <div className="max-w-6xl mx-auto bg-black p-8 md:p-12 border border-pm-gold/20">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">Envoyez-nous un message</h3>
              {submitted ? (
                <div className="flex flex-col justify-center items-center h-full text-center p-8 bg-pm-dark border border-pm-gold rounded-lg">
                    <CheckCircleIcon className="w-16 h-16 text-pm-gold mx-auto mb-4" />
                    <h3 className="text-2xl font-playfair text-pm-gold">Merci !</h3>
                    <p className="mt-2 text-pm-off-white/80">Votre message a bien été envoyé. Nous vous répondrons bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" placeholder="Votre nom" className="w-full bg-pm-dark border border-pm-off-white/20 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors" />
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" placeholder="Votre email" className="w-full bg-pm-dark border border-pm-off-white/20 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors" />
                  <textarea required name="message" value={formData.message} onChange={handleChange} placeholder="Votre message" rows={5} className="w-full bg-pm-dark border border-pm-off-white/20 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors"></textarea>
                  
                  {error && (
                    <div className="p-3 bg-red-900/50 border border-red-500 text-red-300 text-sm rounded-md flex items-center gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        <p>{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={isLoading} className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? 'Envoi en cours...' : 'Envoyer'}
                  </button>
                </form>
              )}
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">Nos Coordonnées</h3>
              <div className="space-y-4 text-pm-off-white/90 text-lg">
                <p className="flex items-center gap-4"><EnvelopeIcon className="w-6 h-6 text-pm-gold"/> {contactInfo.email}</p>
                <p className="flex items-center gap-4"><DevicePhoneMobileIcon className="w-6 h-6 text-pm-gold"/> {contactInfo.phone}</p>
                <p className="flex items-center gap-4"><MapPinIcon className="w-6 h-6 text-pm-gold"/> {contactInfo.address}</p>
              </div>
              <div className="mt-8 h-64 bg-pm-dark border border-pm-gold/50 flex items-center justify-center text-pm-gold/50 rounded-lg">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.721008687799!2d9.447545674964726!3d0.4099279995873281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x106138622f96e62d%3A0xb35583b2632b570e!2sAncien%20Sobraga!5e0!3m2!1sfr!2sga!4v1721921382433!5m2!1sfr!2sga" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte de localisation de l'agence">
                 </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;