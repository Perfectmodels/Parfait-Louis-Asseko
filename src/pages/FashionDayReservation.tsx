import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import { FashionDayReservation } from '../types';
import { v4 as uuidv4 } from 'uuid';
import SEO from '../components/SEO';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

// Import des options de réservation depuis la configuration
import { reservationTableOptions } from '../constants/fashionDayEdition2';

const FashionDayReservationPage: React.FC = () => {
    const { data, saveData } = useData();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialRequests: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOption || !data) return;

        setIsSubmitting(true);

        const newReservation: FashionDayReservation = {
            id: uuidv4(),
            submissionDate: new Date().toISOString(),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            tableOptionId: selectedOption,
            specialRequests: formData.specialRequests,
            status: 'Nouveau'
        };

        const updatedReservations = [...(data.fashionDayReservations || []), newReservation];

        try {
            await saveData({ ...data, fashionDayReservations: updatedReservations });
            setSubmitSuccess(true);
            setFormData({ name: '', email: '', phone: '', specialRequests: '' });
            setSelectedOption(null);
        } catch (error) {
            console.error("Error saving reservation:", error);
            alert("Une erreur est survenue lors de la réservation. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-GA', { style: 'currency', currency: 'XAF' }).format(price);
    };

    const selectedTable = reservationTableOptions.find(opt => opt.id === selectedOption);

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Réservation Perfect Fashion Day | Perfect Models"
                description="Réservez votre table pour le Perfect Fashion Day Édition 2. Découvrez nos formules exclusives avec bières locales ou étrangères."
            />

            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-pm-gold mb-4">
                        Réservez votre Table
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Vivez l'expérience Perfect Fashion Day Édition 2 dans un confort absolu. Choisissez la formule qui vous convient.
                    </p>
                </motion.div>

                {submitSuccess ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto bg-pm-gold/10 border border-pm-gold/50 rounded-xl p-8 text-center"
                    >
                        <div className="w-16 h-16 bg-pm-gold rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircleIcon className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-playfair font-bold text-white mb-2">Réservation Confirmée !</h2>
                        <p className="text-gray-300 mb-6">
                            Merci pour votre réservation. Notre équipe vous contactera très prochainement pour confirmer les détails et le paiement.
                        </p>
                        <button
                            onClick={() => setSubmitSuccess(false)}
                            className="text-pm-gold hover:text-white underline transition-colors"
                        >
                            Effectuer une autre réservation
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Options Selection */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Tables avec Bières Locales */}
                            <div>
                                <h3 className="text-2xl font-playfair font-bold text-pm-gold mb-6 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-pm-gold"></span>
                                    Tables avec Bières Locales
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {reservationTableOptions.filter(opt => opt.category === 'Bières Locales').map(option => (
                                        <motion.div
                                            key={option.id}
                                            whileHover={{ scale: 1.02 }}
                                            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedOption === option.id
                                                ? 'border-pm-gold bg-pm-gold/10 shadow-lg shadow-pm-gold/20'
                                                : 'border-white/10 hover:border-pm-gold/50 bg-white/5'
                                                }`}
                                            onClick={() => setSelectedOption(option.id)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-xl font-bold">{option.name}</h4>
                                                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                                                    {option.capacity} pers.
                                                </span>
                                            </div>
                                            <p className="text-3xl font-playfair font-bold text-pm-gold mb-4">
                                                {formatPrice(option.price)}
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-gray-400 text-sm font-semibold mb-2">Inclus:</p>
                                                {option.includes.map((item, idx) => (
                                                    <p key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                                        <span className="text-pm-gold mt-1">✓</span>
                                                        {item}
                                                    </p>
                                                ))}
                                            </div>
                                            {selectedOption === option.id && (
                                                <div className="absolute top-4 right-4 text-pm-gold">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Tables avec Bières Étrangères */}
                            <div>
                                <h3 className="text-2xl font-playfair font-bold text-pm-gold mb-6 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-pm-gold"></span>
                                    Tables avec Bières Étrangères
                                </h3>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {reservationTableOptions.filter(opt => opt.category === 'Bières Étrangères').map(option => (
                                        <motion.div
                                            key={option.id}
                                            whileHover={{ scale: 1.02 }}
                                            className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedOption === option.id
                                                ? 'border-pm-gold bg-pm-gold/10 shadow-lg shadow-pm-gold/20'
                                                : 'border-white/10 hover:border-pm-gold/50 bg-white/5'
                                                }`}
                                            onClick={() => setSelectedOption(option.id)}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-xl font-bold">{option.name}</h4>
                                                <span className="bg-white/10 px-3 py-1 rounded-full text-sm">
                                                    {option.capacity} pers.
                                                </span>
                                            </div>
                                            <p className="text-3xl font-playfair font-bold text-pm-gold mb-4">
                                                {formatPrice(option.price)}
                                            </p>
                                            <div className="space-y-2">
                                                <p className="text-gray-400 text-sm font-semibold mb-2">Inclus:</p>
                                                {option.includes.map((item, idx) => (
                                                    <p key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                                                        <span className="text-pm-gold mt-1">✓</span>
                                                        {item}
                                                    </p>
                                                ))}
                                            </div>
                                            {selectedOption === option.id && (
                                                <div className="absolute top-4 right-4 text-pm-gold">
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reservation Form */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                                <h3 className="text-2xl font-playfair font-bold text-white mb-6">
                                    Vos Coordonnées
                                </h3>

                                {selectedTable && (
                                    <div className="mb-6 p-4 bg-pm-gold/10 border border-pm-gold/30 rounded-lg">
                                        <p className="text-sm text-pm-gold font-semibold mb-1">Table sélectionnée:</p>
                                        <p className="text-white font-bold">{selectedTable.name}</p>
                                        <p className="text-2xl font-playfair text-pm-gold mt-2">{formatPrice(selectedTable.price)}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Nom complet *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-colors"
                                            placeholder="Votre nom"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-colors"
                                            placeholder="votre@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-400 mb-2">Téléphone *</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-colors"
                                            placeholder="+241 ..."
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-400 mb-2">Demandes spéciales (optionnel)</label>
                                        <textarea
                                            id="specialRequests"
                                            name="specialRequests"
                                            rows={3}
                                            value={formData.specialRequests}
                                            onChange={handleInputChange}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pm-gold focus:ring-1 focus:ring-pm-gold outline-none transition-colors"
                                            placeholder="Allergies, préférences..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!selectedOption || isSubmitting}
                                        className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest transition-all duration-300 ${!selectedOption || isSubmitting
                                            ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                                            : 'bg-pm-gold text-pm-dark hover:bg-white shadow-lg shadow-pm-gold/20 hover:scale-105'
                                            }`}
                                    >
                                        {isSubmitting ? 'Traitement...' : 'Confirmer la Réservation'}
                                    </button>
                                    {!selectedOption && (
                                        <p className="text-red-400 text-xs text-center mt-2">
                                            Veuillez sélectionner une table
                                        </p>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FashionDayReservationPage;
