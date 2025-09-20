import React, { useState, useRef } from 'react';
import { 
    ArrowLeftIcon, 
    DocumentArrowUpIcon, 
    CheckCircleIcon, 
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { importContacts } from '../../services/contactService';
import SEO from '../../components/SEO';

interface ImportedContact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    status: 'valid' | 'invalid' | 'duplicate';
    error?: string;
}

const AdminImportContacts: React.FC = () => {
    const [importedContacts, setImportedContacts] = useState<ImportedContact[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [importStep, setImportStep] = useState<'upload' | 'review' | 'import'>('upload');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            processFile(file);
        }
    };

    const processFile = async (file: File) => {
        setIsProcessing(true);
        setImportStep('review');

        try {
            // Traitement du fichier selon son type
            let contactsData: Array<{ name: string; email: string; phone?: string; company?: string }> = [];
            
            if (file.name.endsWith('.csv')) {
                const text = await file.text();
                const lines = text.split('\n').filter(line => line.trim());
                
                if (lines.length < 2) {
                    throw new Error('Le fichier CSV doit contenir au moins une ligne d\'en-tête et une ligne de données');
                }
                
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                console.log('Headers détectés:', headers);
                
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                    const contactData: any = {};
                    
                    headers.forEach((header, index) => {
                        if (values[index]) {
                            if (header.includes('nom') || header.includes('name') || header.includes('prénom')) {
                                contactData.name = values[index];
                            } else if (header.includes('email') || header.includes('mail')) {
                                contactData.email = values[index];
                            } else if (header.includes('phone') || header.includes('téléphone') || header.includes('tel')) {
                                contactData.phone = values[index];
                            } else if (header.includes('company') || header.includes('entreprise') || header.includes('société')) {
                                contactData.company = values[index];
                            }
                        }
                    });
                    
                    if (contactData.name && contactData.email) {
                        contactsData.push(contactData);
                    }
                }
            } else if (file.name.endsWith('.txt')) {
                // Pour les fichiers texte, on cherche les emails
                const text = await file.text();
                const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
                const emails = text.match(emailRegex) || [];
                
                contactsData = emails.map((email, index) => ({
                    name: `Contact ${index + 1}`,
                    email: email
                }));
            } else {
                throw new Error('Format de fichier non supporté. Utilisez CSV ou TXT.');
            }

            if (contactsData.length === 0) {
                throw new Error('Aucun contact valide trouvé dans le fichier');
            }

            // Validation des contacts
            const importedContacts: ImportedContact[] = contactsData.map((contact, index) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                let status: 'valid' | 'invalid' | 'duplicate' = 'valid';
                let error: string | undefined;

                if (!emailRegex.test(contact.email)) {
                    status = 'invalid';
                    error = 'Format d\'email invalide';
                }

                return {
                    id: index.toString(),
                    name: contact.name,
                    email: contact.email,
                    phone: contact.phone,
                    company: contact.company,
                    status,
                    error
                };
            });

            setImportedContacts(importedContacts);
            console.log(`${importedContacts.length} contacts traités`);
        } catch (error) {
            console.error('Erreur lors du traitement:', error);
            alert(`Erreur lors du traitement du fichier: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
            setImportStep('upload');
        } finally {
            setIsProcessing(false);
        }
    };

    const loadSampleData = () => {
        const sampleContacts: ImportedContact[] = [
            {
                id: '1',
                name: 'Marie Dubois',
                email: 'marie.dubois@email.com',
                phone: '+33 6 12 34 56 78',
                company: 'Agence Mode',
                status: 'valid'
            },
            {
                id: '2',
                name: 'Jean Martin',
                email: 'jean.martin@email.com',
                phone: '+33 6 98 76 54 32',
                company: 'Studio Photo',
                status: 'valid'
            },
            {
                id: '3',
                name: 'Sophie Laurent',
                email: 'sophie.laurent@email.com',
                company: 'Agence Créative',
                status: 'valid'
            },
            {
                id: '4',
                name: 'Pierre Durand',
                email: 'pierre.durand@email.com',
                phone: '+33 6 77 88 99 00',
                company: 'Studio Fashion',
                status: 'valid'
            },
            {
                id: '5',
                name: 'Claire Moreau',
                email: 'claire.moreau@email.com',
                phone: '+33 6 11 22 33 44',
                company: 'Agence Style',
                status: 'valid'
            }
        ];

        setImportedContacts(sampleContacts);
        setImportStep('review');
    };

    const handleImport = async () => {
        setIsProcessing(true);
        setImportStep('import');

        try {
            // Préparer les données pour l'import
            const validContacts = importedContacts.filter(c => c.status === 'valid');
            const contactsData = validContacts.map(contact => ({
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                company: contact.company
            }));

            // Utiliser le service d'import (pas async)
            const result = importContacts(contactsData);
            
            console.log('Import terminé:', result);
            
            // Afficher un message de succès
            alert(`Import réussi ! ${result.success} contacts ajoutés, ${result.failed} échecs.`);
            
            // Reset après import
            setTimeout(() => {
                setImportedContacts([]);
                setSelectedFile(null);
                setImportStep('upload');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 3000);
        } catch (error) {
            console.error('Erreur lors de l\'import:', error);
            alert('Erreur lors de l\'import des contacts');
        } finally {
            setIsProcessing(false);
        }
    };

    const getStatusIcon = (status: ImportedContact['status']) => {
        switch (status) {
            case 'valid':
                return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
            case 'invalid':
                return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />;
            case 'duplicate':
                return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: ImportedContact['status']) => {
        switch (status) {
            case 'valid':
                return 'text-green-400';
            case 'invalid':
                return 'text-red-400';
            case 'duplicate':
                return 'text-orange-400';
            default:
                return 'text-gray-400';
        }
    };

    const validContacts = importedContacts.filter(c => c.status === 'valid').length;
    const invalidContacts = importedContacts.filter(c => c.status === 'invalid').length;
    const duplicateContacts = importedContacts.filter(c => c.status === 'duplicate').length;

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Import Contacts - Admin" 
                description="Importer des contacts depuis votre répertoire"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin/marketing-campaigns" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour aux Campagnes
                    </Link>
                </div>

                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-pm-gold mb-2">Import de Contacts</h1>
                    <p className="text-pm-off-white/70 mb-8">Importez vos contacts depuis votre répertoire</p>

                    {/* Étapes du processus */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-8">
                            <div className={`flex items-center gap-2 ${importStep === 'upload' ? 'text-pm-gold' : 'text-pm-off-white/50'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${importStep === 'upload' ? 'bg-pm-gold text-pm-dark' : 'bg-pm-dark/50'}`}>
                                    1
                                </div>
                                <span className="font-medium">Upload</span>
                            </div>
                            <div className={`w-16 h-0.5 ${importStep === 'review' || importStep === 'import' ? 'bg-pm-gold' : 'bg-pm-dark/50'}`}></div>
                            <div className={`flex items-center gap-2 ${importStep === 'review' ? 'text-pm-gold' : importStep === 'import' ? 'text-pm-gold' : 'text-pm-off-white/50'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${importStep === 'review' || importStep === 'import' ? 'bg-pm-gold text-pm-dark' : 'bg-pm-dark/50'}`}>
                                    2
                                </div>
                                <span className="font-medium">Révision</span>
                            </div>
                            <div className={`w-16 h-0.5 ${importStep === 'import' ? 'bg-pm-gold' : 'bg-pm-dark/50'}`}></div>
                            <div className={`flex items-center gap-2 ${importStep === 'import' ? 'text-pm-gold' : 'text-pm-off-white/50'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${importStep === 'import' ? 'bg-pm-gold text-pm-dark' : 'bg-pm-dark/50'}`}>
                                    3
                                </div>
                                <span className="font-medium">Import</span>
                            </div>
                        </div>
                    </div>

                    {/* Étape 1: Upload */}
                    {importStep === 'upload' && (
                        <div className="bg-pm-dark/50 rounded-lg p-8 border border-pm-gold/20 text-center">
                            <DocumentArrowUpIcon className="w-16 h-16 text-pm-gold mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-pm-gold mb-4">Sélectionnez votre fichier</h2>
                            <p className="text-pm-off-white/70 mb-6">
                                Formats supportés: CSV, Excel (.xlsx), vCard (.vcf)
                            </p>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx,.vcf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors"
                                >
                                    Choisir un fichier
                                </button>
                                <button
                                    onClick={loadSampleData}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                >
                                    Charger des données d'exemple
                                </button>
                            </div>
                            
                            {selectedFile && (
                                <div className="mt-4 p-4 bg-black/30 rounded-lg">
                                    <p className="text-pm-off-white">Fichier sélectionné: {selectedFile.name}</p>
                                    <p className="text-pm-off-white/70 text-sm">Taille: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Étape 2: Révision */}
                    {importStep === 'review' && (
                        <div className="space-y-6">
                            {isProcessing ? (
                                <div className="bg-pm-dark/50 rounded-lg p-8 border border-pm-gold/20 text-center">
                                    <div className="animate-spin w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-pm-off-white">Traitement du fichier en cours...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Statistiques */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-green-500/20 rounded-lg p-6 border border-green-500/30">
                                            <div className="flex items-center gap-3">
                                                <CheckCircleIcon className="w-8 h-8 text-green-400" />
                                                <div>
                                                    <div className="text-2xl font-bold text-green-400">{validContacts}</div>
                                                    <div className="text-green-300/70 text-sm">Contacts valides</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-red-500/20 rounded-lg p-6 border border-red-500/30">
                                            <div className="flex items-center gap-3">
                                                <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
                                                <div>
                                                    <div className="text-2xl font-bold text-red-400">{invalidContacts}</div>
                                                    <div className="text-red-300/70 text-sm">Contacts invalides</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-orange-500/20 rounded-lg p-6 border border-orange-500/30">
                                            <div className="flex items-center gap-3">
                                                <ExclamationTriangleIcon className="w-8 h-8 text-orange-400" />
                                                <div>
                                                    <div className="text-2xl font-bold text-orange-400">{duplicateContacts}</div>
                                                    <div className="text-orange-300/70 text-sm">Doublons</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Liste des contacts */}
                                    <div className="bg-pm-dark/50 rounded-lg border border-pm-gold/20 overflow-hidden">
                                        <div className="p-6 border-b border-pm-gold/20">
                                            <h3 className="text-lg font-semibold text-pm-gold">Aperçu des contacts</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {importedContacts.map((contact) => (
                                                <div key={contact.id} className="p-4 border-b border-pm-gold/10 last:border-b-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            {getStatusIcon(contact.status)}
                                                            <div>
                                                                <div className="font-medium text-pm-off-white">{contact.name}</div>
                                                                <div className="text-sm text-pm-off-white/70">{contact.email}</div>
                                                                {contact.phone && (
                                                                    <div className="text-sm text-pm-off-white/70">{contact.phone}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className={`text-sm font-medium ${getStatusColor(contact.status)}`}>
                                                                {contact.status === 'valid' ? 'Valide' : 
                                                                 contact.status === 'invalid' ? 'Invalide' : 'Doublon'}
                                                            </div>
                                                            {contact.error && (
                                                                <div className="text-xs text-red-400 mt-1">{contact.error}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={() => setImportStep('upload')}
                                            className="bg-pm-dark/50 text-pm-off-white px-6 py-3 rounded-lg border border-pm-gold/20 hover:border-pm-gold/40 transition-colors"
                                        >
                                            Retour
                                        </button>
                                        <button
                                            onClick={handleImport}
                                            disabled={validContacts === 0}
                                            className="bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Importer {validContacts} contacts
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Étape 3: Import */}
                    {importStep === 'import' && (
                        <div className="bg-pm-dark/50 rounded-lg p-8 border border-pm-gold/20 text-center">
                            {isProcessing ? (
                                <>
                                    <div className="animate-spin w-8 h-8 border-2 border-pm-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <h2 className="text-2xl font-semibold text-pm-gold mb-4">Import en cours...</h2>
                                    <p className="text-pm-off-white/70">Veuillez patienter pendant l'importation des contacts.</p>
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                                    <h2 className="text-2xl font-semibold text-pm-gold mb-4">Import terminé !</h2>
                                    <p className="text-pm-off-white/70 mb-6">
                                        {validContacts} contacts ont été importés avec succès.
                                    </p>
                                    <Link
                                        to="/admin/marketing-campaigns"
                                        className="bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors"
                                    >
                                        Retour aux campagnes
                                    </Link>
                                </>
                            )}
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                        <h3 className="text-lg font-semibold text-pm-gold mb-4">Instructions d'import</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div>
                                <h4 className="font-medium text-pm-gold mb-2">Formats supportés</h4>
                                <ul className="text-pm-off-white/70 space-y-1">
                                    <li>• CSV (Comma Separated Values)</li>
                                    <li>• Excel (.xlsx)</li>
                                    <li>• vCard (.vcf)</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-pm-gold mb-2">Colonnes requises</h4>
                                <ul className="text-pm-off-white/70 space-y-1">
                                    <li>• Nom (obligatoire)</li>
                                    <li>• Email (obligatoire)</li>
                                    <li>• Téléphone (optionnel)</li>
                                    <li>• Entreprise (optionnel)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminImportContacts;
