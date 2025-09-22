import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ChevronLeftIcon, 
    DocumentDuplicateIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    EyeIcon,
    CheckIcon,
    XMarkIcon,
    ExclamationTriangleIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';
import SEO from '../../components/SEO';
import EmailManagementNav from '../../components/EmailManagementNav';
import { 
    getEmailTemplates, 
    createEmailTemplate, 
    updateEmailTemplate, 
    deleteEmailTemplate, 
    duplicateEmailTemplate,
    getAvailableVariables,
    validateEmailTemplate,
    EmailTemplate,
    EmailType 
} from '../../services/emailTemplateService';

const AdminEmailTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<EmailTemplate[]>([]);
    const [filteredTemplates, setFilteredTemplates] = useState<EmailTemplate[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
    const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
    const [templateForm, setTemplateForm] = useState<Partial<EmailTemplate>>({
        name: '',
        type: 'custom',
        subject: '',
        htmlContent: '',
        textContent: '',
        variables: [],
        isActive: true
    });
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    // Charger les templates au montage
    useEffect(() => {
        loadTemplates();
    }, []);

    // Filtrer les templates
    useEffect(() => {
        let filtered = [...templates];

        if (searchTerm) {
            filtered = filtered.filter(template => 
                template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                template.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (typeFilter !== 'all') {
            filtered = filtered.filter(template => template.type === typeFilter);
        }

        if (statusFilter !== 'all') {
            const isActive = statusFilter === 'active';
            filtered = filtered.filter(template => template.isActive === isActive);
        }

        setFilteredTemplates(filtered);
    }, [templates, searchTerm, typeFilter, statusFilter]);

    const loadTemplates = () => {
        const allTemplates = getEmailTemplates();
        setTemplates(allTemplates);
    };

    const handleCreateTemplate = () => {
        setEditingTemplate(null);
        setTemplateForm({
            name: '',
            type: 'custom',
            subject: '',
            htmlContent: '',
            textContent: '',
            variables: [],
            isActive: true
        });
        setValidationErrors([]);
        setShowTemplateModal(true);
    };

    const handleEditTemplate = (template: EmailTemplate) => {
        setEditingTemplate(template);
        setTemplateForm(template);
        setValidationErrors([]);
        setShowTemplateModal(true);
    };

    const handleDuplicateTemplate = (template: EmailTemplate) => {
        const duplicated = duplicateEmailTemplate(template.id);
        if (duplicated) {
            loadTemplates();
            alert('Template dupliqué avec succès !');
        }
    };

    const handleDeleteTemplate = (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
            return;
        }

        const success = deleteEmailTemplate(id);
        if (success) {
            loadTemplates();
        } else {
            alert('Erreur lors de la suppression du template');
        }
    };

    const handleSaveTemplate = () => {
        // Validation
        const validation = validateEmailTemplate(templateForm);
        setValidationErrors(validation.errors);

        if (!validation.isValid) {
            return;
        }

        try {
            if (editingTemplate) {
                // Mise à jour
                const success = updateEmailTemplate(editingTemplate.id, templateForm);
                if (success) {
                    loadTemplates();
                    setShowTemplateModal(false);
                    alert('Template mis à jour avec succès !');
                } else {
                    alert('Erreur lors de la mise à jour du template');
                }
            } else {
                // Création
                createEmailTemplate(templateForm as Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>);
                loadTemplates();
                setShowTemplateModal(false);
                alert('Template créé avec succès !');
            }
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            alert('Erreur lors de la sauvegarde du template');
        }
    };

    const handlePreviewTemplate = (template: EmailTemplate) => {
        setPreviewTemplate(template);
    };

    const getTypeLabel = (type: EmailType) => {
        const labels = {
            contact: 'Contact',
            booking: 'Réservation',
            payment: 'Paiement',
            news: 'Actualités',
            custom: 'Personnalisé'
        };
        return labels[type];
    };

    const getTypeColor = (type: EmailType) => {
        const colors = {
            contact: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
            booking: 'bg-green-500/20 text-green-300 border-green-500/50',
            payment: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
            news: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
            custom: 'bg-gray-500/20 text-gray-300 border-gray-500/50'
        };
        return colors[type];
    };

    const availableVariables = getAvailableVariables(templateForm.type as EmailType);

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Modèles d'Emails" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold flex items-center gap-3">
                        <DocumentTextIcon className="w-10 h-10" />
                        Modèles d'Emails
                    </h1>
                    <p className="text-pm-off-white/70 mt-2">Gérez les modèles d'emails personnalisés</p>
                </div>

                {/* Navigation secondaire pour les emails */}
                <EmailManagementNav className="mb-8" />

                {/* Actions et Filtres */}
                <div className="bg-black p-6 border border-pm-gold/10 rounded-lg mb-6">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            {/* Recherche */}
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-pm-gold/50" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou sujet..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                />
                            </div>

                            {/* Filtres */}
                            <div className="flex gap-2">
                                <select
                                    value={typeFilter}
                                    onChange={(e) => setTypeFilter(e.target.value)}
                                    className="px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="contact">Contact</option>
                                    <option value="booking">Réservation</option>
                                    <option value="payment">Paiement</option>
                                    <option value="news">Actualités</option>
                                    <option value="custom">Personnalisé</option>
                                </select>

                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="active">Actifs</option>
                                    <option value="inactive">Inactifs</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateTemplate}
                                className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Nouveau Template
                            </button>
                        </div>
                    </div>
                </div>

                {/* Liste des templates */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="bg-black p-6 border border-pm-gold/10 rounded-lg hover:border-pm-gold/30 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-pm-gold mb-2">{template.name}</h3>
                                    <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getTypeColor(template.type)}`}>
                                        {getTypeLabel(template.type)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {template.isActive ? (
                                        <CheckIcon className="w-5 h-5 text-green-400" title="Actif" />
                                    ) : (
                                        <XMarkIcon className="w-5 h-5 text-red-400" title="Inactif" />
                                    )}
                                </div>
                            </div>

                            <p className="text-sm text-pm-off-white/80 mb-4 line-clamp-2">
                                <strong>Sujet:</strong> {template.subject}
                            </p>

                            <p className="text-xs text-pm-off-white/60 mb-4">
                                Mis à jour le {new Date(template.updatedAt).toLocaleDateString('fr-FR')}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePreviewTemplate(template)}
                                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                    title="Aperçu"
                                >
                                    <EyeIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleEditTemplate(template)}
                                    className="p-2 text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-colors"
                                    title="Modifier"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDuplicateTemplate(template)}
                                    className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                                    title="Dupliquer"
                                >
                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTemplate(template.id)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                    title="Supprimer"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <DocumentTextIcon className="w-16 h-16 text-pm-gold/30 mx-auto mb-4" />
                        <p className="text-pm-off-white/70">Aucun template trouvé</p>
                    </div>
                )}

                {/* Modal de création/édition */}
                {showTemplateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-pm-gold/10">
                                <h3 className="text-xl font-bold text-pm-gold">
                                    {editingTemplate ? 'Modifier le Template' : 'Nouveau Template'}
                                </h3>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                {/* Erreurs de validation */}
                                {validationErrors.length > 0 && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                        <div className="flex items-center gap-2 text-red-400 mb-2">
                                            <ExclamationTriangleIcon className="w-5 h-5" />
                                            <span className="font-semibold">Erreurs de validation</span>
                                        </div>
                                        <ul className="text-sm text-red-300 space-y-1">
                                            {validationErrors.map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-pm-gold mb-2">
                                            Nom du Template *
                                        </label>
                                        <input
                                            type="text"
                                            value={templateForm.name || ''}
                                            onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                                            placeholder="Nom du template"
                                            className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-pm-gold mb-2">
                                            Type d'Email *
                                        </label>
                                        <select
                                            value={templateForm.type || 'custom'}
                                            onChange={(e) => setTemplateForm({...templateForm, type: e.target.value as EmailType})}
                                            className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white focus:border-pm-gold focus:outline-none"
                                        >
                                            <option value="contact">Contact</option>
                                            <option value="booking">Réservation</option>
                                            <option value="payment">Paiement</option>
                                            <option value="news">Actualités</option>
                                            <option value="custom">Personnalisé</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Sujet *
                                    </label>
                                    <input
                                        type="text"
                                        value={templateForm.subject || ''}
                                        onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                                        placeholder="Sujet de l'email"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Contenu HTML
                                    </label>
                                    <textarea
                                        value={templateForm.htmlContent || ''}
                                        onChange={(e) => setTemplateForm({...templateForm, htmlContent: e.target.value})}
                                        rows={8}
                                        placeholder="Contenu HTML de l'email"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none font-mono text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Contenu Texte
                                    </label>
                                    <textarea
                                        value={templateForm.textContent || ''}
                                        onChange={(e) => setTemplateForm({...templateForm, textContent: e.target.value})}
                                        rows={6}
                                        placeholder="Contenu texte de l'email"
                                        className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none"
                                    />
                                </div>

                                {/* Variables disponibles */}
                                <div>
                                    <label className="block text-sm font-semibold text-pm-gold mb-2">
                                        Variables Disponibles
                                    </label>
                                    <div className="bg-black p-4 rounded-lg border border-pm-gold/10">
                                        <p className="text-sm text-pm-off-white/70 mb-3">
                                            Variables disponibles pour ce type d'email :
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {availableVariables.map((variable) => (
                                                <div key={variable.name} className="flex items-center gap-2 text-sm">
                                                    <code className="bg-pm-gold/20 text-pm-gold px-2 py-1 rounded text-xs">
                                                        {variable.name}
                                                    </code>
                                                    <span className="text-pm-off-white/70">
                                                        {variable.description}
                                                        {variable.required && <span className="text-red-400 ml-1">*</span>}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={templateForm.isActive || false}
                                        onChange={(e) => setTemplateForm({...templateForm, isActive: e.target.checked})}
                                        className="rounded border-pm-gold/20 text-pm-gold focus:ring-pm-gold"
                                    />
                                    <label htmlFor="isActive" className="text-sm text-pm-gold">
                                        Template actif
                                    </label>
                                </div>
                            </div>

                            <div className="p-6 border-t border-pm-gold/10 flex justify-end gap-3">
                                <button
                                    onClick={() => setShowTemplateModal(false)}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSaveTemplate}
                                    className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                >
                                    {editingTemplate ? 'Mettre à jour' : 'Créer'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal d'aperçu */}
                {previewTemplate && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-pm-dark border border-pm-gold/20 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-pm-gold/10">
                                <h3 className="text-xl font-bold text-pm-gold">Aperçu du Template</h3>
                                <p className="text-pm-off-white/70">{previewTemplate.name}</p>
                            </div>
                            
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm font-semibold text-pm-gold mb-2">Sujet :</h4>
                                        <p className="text-pm-off-white">{previewTemplate.subject}</p>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-semibold text-pm-gold mb-2">Contenu HTML :</h4>
                                        <div className="bg-black p-4 rounded-lg border border-pm-gold/10">
                                            <div 
                                                className="prose prose-invert max-w-none"
                                                dangerouslySetInnerHTML={{ __html: previewTemplate.htmlContent }}
                                            />
                                        </div>
                                    </div>
                                    
                                    {previewTemplate.textContent && (
                                        <div>
                                            <h4 className="text-sm font-semibold text-pm-gold mb-2">Contenu Texte :</h4>
                                            <div className="bg-black p-4 rounded-lg border border-pm-gold/10">
                                                <pre className="text-pm-off-white whitespace-pre-wrap font-mono text-sm">
                                                    {previewTemplate.textContent}
                                                </pre>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 border-t border-pm-gold/10 flex justify-end">
                                <button
                                    onClick={() => setPreviewTemplate(null)}
                                    className="px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                                >
                                    Fermer
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminEmailTemplates;
