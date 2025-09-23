import React, { useState, useEffect } from 'react';
import { EmailTemplate } from '../../types';

interface EmailTemplateFormProps {
    template: EmailTemplate;
    onSave: (template: EmailTemplate) => void;
    onCancel: () => void;
}

const EmailTemplateForm: React.FC<EmailTemplateFormProps> = ({
    template,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState<EmailTemplate>(template);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setFormData(template);
    }, [template]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom du template est requis';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'Le sujet est requis';
        }

        if (!formData.htmlContent.trim()) {
            newErrors.htmlContent = 'Le contenu HTML est requis';
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

    const handleInputChange = (field: keyof EmailTemplate, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom du template */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Nom du template <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold ${
                        errors.name ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder="Ex: Template Newsletter"
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
                    placeholder="Ex: {{subject}} - Perfect Models Management"
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

            {/* Contenu HTML */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Contenu HTML <span className="text-red-400">*</span>
                </label>
                <div className="mb-2">
                    <p className="text-sm text-pm-off-white/70 mb-2">
                        Variables disponibles : <code className="bg-pm-gold/20 text-pm-gold px-2 py-1 rounded">{"{{name}}"}</code>, <code className="bg-pm-gold/20 text-pm-gold px-2 py-1 rounded">{"{{email}}"}</code>, <code className="bg-pm-gold/20 text-pm-gold px-2 py-1 rounded">{"{{subject}}"}</code>
                    </p>
                </div>
                <textarea
                    value={formData.htmlContent}
                    onChange={(e) => handleInputChange('htmlContent', e.target.value)}
                    rows={12}
                    className={`w-full px-4 py-3 bg-pm-off-white/5 border rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:outline-none focus:ring-2 focus:ring-pm-gold/50 focus:border-pm-gold font-mono text-sm ${
                        errors.htmlContent ? 'border-red-500' : 'border-pm-gold/30'
                    }`}
                    placeholder={`<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .header { background: #D4AF37; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Perfect Models Management</h1>
    </div>
    <div class="content">
        <h2>Bonjour {{name}},</h2>
        <p>Votre message personnalisé ici...</p>
    </div>
</body>
</html>`}
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
                    placeholder={`Bonjour {{name}},

Votre message personnalisé ici...

Cordialement,
L'équipe Perfect Models Management`}
                />
            </div>

            {/* Aperçu */}
            <div>
                <label className="block text-sm font-medium text-pm-gold mb-2">
                    Aperçu du template
                </label>
                <div className="border border-pm-gold/30 rounded-lg p-4 bg-pm-off-white/5 max-h-64 overflow-y-auto">
                    <div 
                        dangerouslySetInnerHTML={{ 
                            __html: formData.htmlContent || '<p class="text-pm-off-white/50">Aperçu du template...</p>' 
                        }}
                        className="text-sm"
                    />
                </div>
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
                    {template.id ? 'Mettre à jour' : 'Créer le template'}
                </button>
            </div>
        </form>
    );
};

export default EmailTemplateForm;
