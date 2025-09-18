import React, { useState } from 'react';
import { ArrowLeftIcon, PaperAirplaneIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { sendEmail, EmailData } from '../services/emailService';
import SEO from '../components/SEO';

const AdminNewEmail: React.FC = () => {
    const [formData, setFormData] = useState({
        to: '',
        subject: '',
        message: '',
        priority: 'normal'
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const emailData: EmailData = {
                to: formData.to,
                subject: formData.subject,
                message: formData.message,
                priority: formData.priority as 'low' | 'normal' | 'high'
            };

            const result = await sendEmail(emailData);
            
            if (result.success) {
                setIsSent(true);
                console.log('Email envoyé avec succès:', result.messageId);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    setIsSent(false);
                    setFormData({
                        to: '',
                        subject: '',
                        message: '',
                        priority: 'normal'
                    });
                }, 3000);
            } else {
                console.error('Erreur lors de l\'envoi:', result.error);
                alert(`Erreur lors de l'envoi: ${result.error}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'envoi:', error);
            alert('Erreur lors de l\'envoi de l\'email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Nouvel Email - Admin" 
                description="Envoyer un nouvel email depuis le panel admin"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin/messaging" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour à la Messagerie
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-pm-gold mb-2">Nouvel Email</h1>
                    <p className="text-pm-off-white/70 mb-8">Composer et envoyer un nouvel email</p>

                    {isSent && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <div className="flex items-center gap-2 text-green-400">
                                <EnvelopeIcon className="w-5 h-5" />
                                <span className="font-semibold">Email envoyé avec succès !</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSendEmail} className="space-y-6">
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <h2 className="text-xl font-semibold text-pm-gold mb-4">Destinataire</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="to" className="block text-sm font-medium text-pm-off-white mb-2">
                                        Adresse email
                                    </label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pm-gold" />
                                        <input
                                            type="email"
                                            id="to"
                                            name="to"
                                            value={formData.to}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                            placeholder="destinataire@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-pm-off-white mb-2">
                                        Sujet
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                        placeholder="Sujet de l'email"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="priority" className="block text-sm font-medium text-pm-off-white mb-2">
                                        Priorité
                                    </label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                    >
                                        <option value="low">Faible</option>
                                        <option value="normal">Normale</option>
                                        <option value="high">Élevée</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <h2 className="text-xl font-semibold text-pm-gold mb-4">Message</h2>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-pm-off-white mb-2">
                                    Contenu du message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={10}
                                    className="w-full px-4 py-3 bg-black/30 border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-vertical"
                                    placeholder="Tapez votre message ici..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex items-center gap-2 bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                {isLoading ? 'Envoi en cours...' : 'Envoyer l\'email'}
                            </button>
                            
                            <Link
                                to="/admin/messaging"
                                className="flex items-center gap-2 bg-pm-dark/50 text-pm-off-white px-6 py-3 rounded-lg border border-pm-gold/20 hover:border-pm-gold/40 transition-colors"
                            >
                                Annuler
                            </Link>
                        </div>
                    </form>

                    {/* Templates rapides */}
                    <div className="mt-8 bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                        <h2 className="text-xl font-semibold text-pm-gold mb-4">Templates Rapides</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    subject: 'Bienvenue chez Perfect Models',
                                    message: 'Bonjour,\n\nNous sommes ravis de vous accueillir dans notre agence.\n\nCordialement,\nL\'équipe Perfect Models'
                                }))}
                                className="p-4 bg-black/30 rounded-lg border border-pm-gold/20 hover:border-pm-gold/40 transition-colors text-left"
                            >
                                <div className="text-pm-gold font-semibold">Message de bienvenue</div>
                                <div className="text-pm-off-white/70 text-sm">Template pour nouveaux mannequins</div>
                            </button>
                            
                            <button
                                onClick={() => setFormData(prev => ({
                                    ...prev,
                                    subject: 'Rappel de paiement',
                                    message: 'Bonjour,\n\nNous vous rappelons que votre paiement mensuel est dû.\n\nMerci de régulariser votre situation.\n\nCordialement,\nL\'équipe Perfect Models'
                                }))}
                                className="p-4 bg-black/30 rounded-lg border border-pm-gold/20 hover:border-pm-gold/40 transition-colors text-left"
                            >
                                <div className="text-pm-gold font-semibold">Rappel de paiement</div>
                                <div className="text-pm-off-white/70 text-sm">Template pour rappels financiers</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNewEmail;
