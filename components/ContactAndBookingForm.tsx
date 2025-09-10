import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

type ContactMessageStatus = 'Nouveau' | 'Lu' | 'Archivé';
type BookingStatus = 'Nouveau' | 'Confirmé' | 'Annulé';

interface ContactAndBookingFormProps {
  prefilledModelName?: string;
  onSuccess?: () => void;
}

type FormType = 'contact' | 'booking';

const ContactAndBookingForm: React.FC<ContactAndBookingFormProps> = ({ prefilledModelName, onSuccess }) => {
  const { data, saveData } = useData();
  const [formType, setFormType] = useState<FormType>('contact');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Common form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    // Booking specific fields
    clientCompany: '',
    requestedModels: prefilledModelName || '',
    startDate: '',
    endDate: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (prefilledModelName) {
      setFormType('booking');
      setFormData(prev => ({ ...prev, requestedModels: prefilledModelName }));
    }
  }, [prefilledModelName]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Common validations
    if (!formData.name.trim()) errors.name = 'Le nom est requis';
    
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'L\'email est invalide';
    }
    
    if (formType === 'contact' && !formData.subject.trim()) {
      errors.subject = 'Le sujet est requis';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Le message est requis';
    } else if (formData.message.length < 10) {
      errors.message = 'Le message doit contenir au moins 10 caractères';
    }
    
    // Booking specific validations
    if (formType === 'booking') {
      if (!formData.requestedModels.trim()) {
        errors.requestedModels = 'Veuillez spécifier le(s) modèle(s) demandé(s)';
      }
      if (!formData.startDate) {
        errors.startDate = 'La date de début est requise';
      }
      if (!formData.endDate) {
        errors.endDate = 'La date de fin est requise';
      } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
        errors.endDate = 'La date de fin doit être postérieure à la date de début';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setStatus('error');
      setStatusMessage('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }
    
    setStatus('loading');
    setStatusMessage('Envoi en cours...');
    
    try {
      if (!data) {
        throw new Error('Les données ne sont pas disponibles pour la sauvegarde');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (formType === 'contact') {
        // Save as contact message
        const newMessage = {
          id: `contact-${Date.now()}`,
          submissionDate: new Date().toISOString(),
          status: 'Nouveau' as ContactMessageStatus,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        };
        
        const updatedMessages = [...(data.contactMessages || []), newMessage];
        await saveData({ ...data, contactMessages: updatedMessages });
      } else {
        // Save as booking request
        const newBooking = {
          id: `booking-${Date.now()}`,
          submissionDate: new Date().toISOString(),
          status: 'Nouveau' as BookingStatus,
          clientName: formData.name,
          clientEmail: formData.email,
          clientCompany: formData.clientCompany,
          requestedModels: formData.requestedModels,
          startDate: formData.startDate,
          endDate: formData.endDate,
          message: formData.message
        };
        
        const updatedBookings = [...(data.bookingRequests || []), newBooking];
        await saveData({ ...data, bookingRequests: updatedBookings });
      }
      
      // Success
      setStatus('success');
      setStatusMessage(
        formType === 'contact' 
          ? 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.'
          : 'Demande de réservation envoyée avec succès ! Nous vous contacterons bientôt.'
      );
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        clientCompany: '',
        requestedModels: prefilledModelName || '',
        startDate: '',
        endDate: ''
      });
      
      formRef.current?.reset();
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setStatusMessage('');
      }, 5000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setStatus('error');
      setStatusMessage('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
    }
  };

  const isFormValid = Object.values(formErrors).every(error => !error);

  return (
    <div className="space-y-6">
      {/* Form Type Selector */}
      <div className="flex space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setFormType('contact')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            formType === 'contact'
              ? 'bg-pm-gold text-pm-dark font-bold'
              : 'bg-pm-dark/50 text-pm-off-white hover:bg-pm-gold/20'
          }`}
        >
          Contact Général
        </button>
        <button
          type="button"
          onClick={() => setFormType('booking')}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            formType === 'booking'
              ? 'bg-pm-gold text-pm-dark font-bold'
              : 'bg-pm-dark/50 text-pm-off-white hover:bg-pm-gold/20'
          }`}
        >
          Demande de Réservation
        </button>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Votre nom <span className="text-pm-gold">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/30 border ${
                formErrors.name ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
              } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
              placeholder="Votre nom complet"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Votre email <span className="text-pm-gold">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/30 border ${
                formErrors.email ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
              } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
              placeholder="votre@email.com"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
            )}
          </div>
        </div>

        {/* Contact Specific Fields */}
        {formType === 'contact' && (
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-pm-off-white/80 mb-1">
              Sujet <span className="text-pm-gold">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-black/30 border ${
                formErrors.subject ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
              } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
              placeholder="Objet de votre message"
            />
            {formErrors.subject && (
              <p className="mt-1 text-sm text-red-400">{formErrors.subject}</p>
            )}
          </div>
        )}

        {/* Booking Specific Fields */}
        {formType === 'booking' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="clientCompany" className="block text-sm font-medium text-pm-off-white/80 mb-1">
                Société / Agence (optionnel)
              </label>
              <input
                id="clientCompany"
                name="clientCompany"
                type="text"
                value={formData.clientCompany}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-pm-gold/30 hover:border-pm-gold/50 rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors"
                placeholder="Nom de votre société ou agence"
              />
            </div>

            <div>
              <label htmlFor="requestedModels" className="block text-sm font-medium text-pm-off-white/80 mb-1">
                Modèle(s) demandé(s) <span className="text-pm-gold">*</span>
              </label>
              <input
                id="requestedModels"
                name="requestedModels"
                type="text"
                value={formData.requestedModels}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/30 border ${
                  formErrors.requestedModels ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
                } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
                placeholder="Noms des modèles ou critères de sélection"
              />
              {formErrors.requestedModels && (
                <p className="mt-1 text-sm text-red-400">{formErrors.requestedModels}</p>
              )}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-pm-off-white/80 mb-1">
                Date de début <span className="text-pm-gold">*</span>
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-black/30 border ${
                  formErrors.startDate ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
                } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
              />
              {formErrors.startDate && (
                <p className="mt-1 text-sm text-red-400">{formErrors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-pm-off-white/80 mb-1">
                Date de fin <span className="text-pm-gold">*</span>
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate}
                className={`w-full px-4 py-3 bg-black/30 border ${
                  formErrors.endDate ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
                } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
              />
              {formErrors.endDate && (
                <p className="mt-1 text-sm text-red-400">{formErrors.endDate}</p>
              )}
            </div>
          </div>
        )}

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-pm-off-white/80 mb-1">
            {formType === 'contact' ? 'Votre message' : 'Détails de la réservation'} <span className="text-pm-gold">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 bg-black/30 border ${
              formErrors.message ? 'border-red-500' : 'border-pm-gold/30 hover:border-pm-gold/50'
            } rounded-lg focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold outline-none transition-colors`}
            placeholder={
              formType === 'contact'
                ? 'Décrivez-nous votre projet ou posez-nous vos questions...'
                : 'Décrivez les détails de votre réservation, les créneaux horaires, les exigences spécifiques...'
            }
          ></textarea>
          {formErrors.message && (
            <p className="mt-1 text-sm text-red-400">{formErrors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`w-full bg-gradient-to-r from-pm-gold to-amber-500 text-pm-dark font-bold py-4 px-6 rounded-lg ${
              status === 'loading' ? 'opacity-80 cursor-not-allowed' : 'hover:opacity-90'
            } transition-all duration-300 flex items-center justify-center gap-3 group`}
          >
            {status === 'loading' ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <span>{formType === 'contact' ? 'Envoyer le message' : 'Envoyer la demande'}</span>
                <PaperAirplaneIcon className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Status Message */}
          {statusMessage && (
            <motion.div 
              className={`mt-4 p-4 rounded-lg ${
                status === 'error' 
                  ? 'bg-red-900/30 border border-red-700' 
                  : 'bg-green-900/30 border border-green-700'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className={status === 'error' ? 'text-red-300' : 'text-green-300'}>
                {statusMessage}
              </p>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactAndBookingForm;
