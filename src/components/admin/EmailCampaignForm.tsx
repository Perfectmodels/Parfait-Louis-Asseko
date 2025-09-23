import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { EmailCampaign, EmailRecipient } from '../../types';

interface EmailCampaignFormProps {
    campaign: EmailCampaign;
    onSave: (campaign: EmailCampaign) => void;
    onCancel: () => void;
}

const EmailCampaignForm: React.FC<EmailCampaignFormProps> = ({
    campaign,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState<EmailCampaign>(campaign);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [newRecipient, setNewRecipient] = useState({ name: '', email: '' });

    useEffect(() => {
        setFormData(campaign);
    }, [campaign]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom de la campagne est requis';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }

        if (!formData.htmlContent.trim()) {
            newErrors.htmlContent = 'Le contenu HTML est requis';
        }

        if (formData.recipients.length === 0) {
            newErrors.recipients = 'Au moins un destinataire est requis';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handleInputChange = (field: keyof EmailCampaign, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const addRecipient = () => {
        if (newRecipient.name.trim() && newRecipient.email.trim()) {
            const recipient: EmailRecipient = {
                id: Date.now().toString(),
                name: newRecipient.name.trim(),
                email: newRecipient.email.trim()
            };
            
            setFormData(prev => ({
                ...prev,
                recipients: [...prev.recipients, recipient]
            }));
            
            setNewRecipient({ name: '', email: '' });
        }
    };

    const removeRecipient = (id: string) => {
        setFormData(prev => ({
            ...prev,
            recipients: prev.recipients.filter(r => r.id !== id)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom de la campagne */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Nom de la campagne <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                        errors.name ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Ex: Newsletter Janvier 2024"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Sujet */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Sujet de l'email <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                        errors.subject ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Ex: Découvrez nos nouveaux mannequins"
                />
                {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
            </div>

            {/* Expéditeur */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Nom de l'expéditeur
                    </label>
                    <input
                        type="text"
                        value={formData.sender.name}
                        onChange={(e) => handleInputChange('sender', { ...formData.sender, name: e.target.value })}
                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                        placeholder="Perfect Models Management"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-pm-gold mb-2">
                        Email de l'expéditeur
                    </label>
                    <input
                        type="email"
                        value={formData.sender.email}
                        onChange={(e) => handleInputChange('sender', { ...formData.sender, email: e.target.value })}
                        className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                        placeholder="contact@perfectmodels.ga"
                    />
                </div>
            </div>

            {/* Destinataires */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Destinataires <span className="text-red-400">*</span>
                </label>
                
                {/* Liste des destinataires */}
                <div className="space-y-2 mb-4">
                    {formData.recipients.map((recipient) => (
                        <div key={recipient.id} className="flex items-center justify-between bg-pm-off-white/5 border border-pm-gold/20 rounded-lg p-3">
                            <div>
                                <div className="text-pm-off-white font-medium">{recipient.name}</div>
                                <div className="text-pm-off-white/70 text-sm">{recipient.email}</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeRecipient(recipient.id)}
                                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Ajouter un destinataire */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newRecipient.name}
                        onChange={(e) => setNewRecipient(prev => ({ ...prev, name: e.target.value }))}
                        className="flex-1 px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                        placeholder="Nom du destinataire"
                    />
                    <input
                        type="email"
                        value={newRecipient.email}
                        onChange={(e) => setNewRecipient(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-1 px-4 py-2 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                        placeholder="Email du destinataire"
                    />
                    <button
                        type="button"
                        onClick={addRecipient}
                        className="px-4 py-2 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-200 flex items-center gap-2"
                    >
                        <PlusIcon className="w-4 h-4" />
                        Ajouter
                    </button>
                </div>
                {errors.recipients && <p className="text-red-400 text-sm mt-1">{errors.recipients}</p>}
            </div>

            {/* Contenu HTML */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Contenu HTML <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={formData.htmlContent}
                    onChange={(e) => handleInputChange('htmlContent', e.target.value)}
                    rows={12}
                    className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold font-mono text-sm ${
                        errors.htmlContent ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="<html><body><h1>Votre contenu HTML ici</h1></body></html>"
                />
                {errors.htmlContent && <p className="text-red-400 text-sm mt-1">{errors.htmlContent}</p>}
            </div>

            {/* Contenu texte */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Contenu texte (optionnel)
                </label>
                <textarea
                    value={formData.textContent}
                    onChange={(e) => handleInputChange('textContent', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 bg-pm-off-white/5 border border-pm-gold/30 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold"
                    placeholder="Version texte de votre email pour les clients qui ne supportent pas HTML"
                />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-pm-gold/20">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-pm-gold border border-pm-gold/30 rounded-lg hover:bg-pm-gold/10 transition-colors duration-200"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-6 py-3 bg-pm-gold text-pm-dark font-medium rounded-lg hover:bg-yellow-400 transition-colors duration-200"
                >
                    {campaign.id ? 'Mettre à jour' : 'Créer la campagne'}
                </button>
            </div>
        </form>
    );
};

export default EmailCampaignForm;
