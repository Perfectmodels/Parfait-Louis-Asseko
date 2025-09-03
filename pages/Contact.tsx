import React, { useState } from 'react';
import { MapPinIcon, DevicePhoneMobileIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import SEO from '../components/SEO';

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
      <SEO 
        title="Contact"
        description="Contactez l'agence Perfect Models Management pour toute demande de booking, partenariat ou information. Nous sommes à votre écoute."
        keywords="contacter agence mannequin, booking mannequin, partenariat mode, contact PMM"
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
                    <h3 className="text-2xl font-playfair text-pm-gold">Merci !</h3>
                    <p className="mt-2 text-pm-off-white/80">Votre message a bien été envoyé. Nous vous répondrons bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required type="text" placeholder="Votre nom" className="w-full bg-pm-dark border border-pm-off-white/20 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors" />
                  <input required type="email" placeholder="Votre email" className="w-full bg-pm-dark border border-pm-off-white/20 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors" />
                  <textarea required placeholder="Votre message" rows={5} className="w-full bg-pm-dark border border-pm-off-white/20 rounded-lg p-3 focus:outline-none focus:border-pm-gold transition-colors"></textarea>
                  <button type="submit" className="w-full px-8 py-3 bg-pm-gold text-pm-dark font-bold uppercase tracking-widest rounded-lg transition-all duration-300 hover:bg-white">Envoyer</button>
                </form>
              )}
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-playfair text-pm-gold mb-6">Nos Coordonnées</h3>
              <div className="space-y-4 text-pm-off-white/90 text-lg">
                <p className="flex items-center gap-4"><EnvelopeIcon className="w-6 h-6 text-pm-gold"/> Contact@perfectmodels.ga</p>
                <p className="flex items-center gap-4"><DevicePhoneMobileIcon className="w-6 h-6 text-pm-gold"/> +241 074066461</p>
                <p className="flex items-center gap-4"><MapPinIcon className="w-6 h-6 text-pm-gold"/> Ancien Sobraga (Libreville)</p>
              </div>
              <div className="mt-8 h-64 bg-pm-dark border border-pm-gold/50 flex items-center justify-center text-pm-gold/50 rounded-lg">
                 Emplacement de la carte Google Maps
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;