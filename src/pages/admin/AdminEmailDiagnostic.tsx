import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import SEO from '../../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, CheckCircleIcon, XCircleIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const AdminEmailDiagnostic: React.FC = () => {
    const { data, saveData } = useData();
    const [brevoApiKey, setBrevoApiKey] = useState(
        data?.apiKeys?.brevoApiKey || (import.meta as any).env?.VITE_BREVO_API_KEY || ''
    );
    const [testEmail, setTestEmail] = useState('');
    const [testSubject, setTestSubject] = useState('Test Email - Perfect Models');
    const [testMessage, setTestMessage] = useState('Ceci est un email de test pour vérifier la configuration Brevo.');
    const [isLoading, setIsLoading] = useState(false);
    const [testResult, setTestResult] = useState<{
        success: boolean;
        message: string;
        details?: any;
    } | null>(null);

    const handleSaveApiKey = async () => {
        if (!data) return;
        
        const updatedData = {
            ...data,
            apiKeys: {
                ...data.apiKeys,
                brevoApiKey: brevoApiKey
            }
        };
        
        await saveData(updatedData as any);
        alert('Clé API Brevo sauvegardée avec succès !');
    };

    const handleTestEmail = async () => {
        if (!brevoApiKey.trim()) {
            setTestResult({
                success: false,
                message: 'Veuillez d\'abord configurer la clé API Brevo.'
            });
            return;
        }

        if (!testEmail.trim()) {
            setTestResult({
                success: false,
                message: 'Veuillez saisir une adresse email de test.'
            });
            return;
        }

        setIsLoading(true);
        setTestResult(null);

        try {
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 20px; border-radius: 10px;">
                        <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">Perfect Models Management</h1>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Test de Configuration Email</h2>
                            <p style="color: #333; white-space: pre-wrap; line-height: 1.6;">${testMessage}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                            <p style="color: #6c757d; font-size: 0.9em; margin: 0;">
                                Cet email de test a été envoyé depuis le système de gestion de Perfect Models Management.
                            </p>
                        </div>
                    </div>
                </div>
            `;

            const emailData = {
                sender: { 
                    name: "Perfect Models Management", 
                    email: "Contact@perfectmodels.ga" 
                },
                to: [{ 
                    email: testEmail, 
                    name: "Test Recipient" 
                }],
                subject: testSubject,
                htmlContent: emailHtml
            };

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': brevoApiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur Brevo: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            
            setTestResult({
                success: true,
                message: `Email de test envoyé avec succès à ${testEmail}`,
                details: result
            });

        } catch (error) {
            console.error('Erreur test email:', error);
            setTestResult({
                success: false,
                message: `Erreur lors de l'envoi: ${(error as Error).message}`,
                details: error
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-pm-dark text-pm-off-white py-20 min-h-screen">
            <SEO title="Admin - Diagnostic Email" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold">Diagnostic Email</h1>
                    <p className="text-pm-off-white/70 mt-2">Testez et configurez l'envoi d'emails via l'API Brevo.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Configuration API */}
                    <div className="bg-black p-6 border border-pm-gold/10 rounded-lg">
                        <h2 className="text-2xl font-bold text-pm-gold mb-4 flex items-center gap-2">
                            <EnvelopeIcon className="w-6 h-6" />
                            Configuration Brevo
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">
                                    Clé API Brevo
                                </label>
                                <input
                                    type="password"
                                    value={brevoApiKey}
                                    onChange={(e) => setBrevoApiKey(e.target.value)}
                                    placeholder="xkeysib-..."
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                />
                            </div>
                            
                            <button
                                onClick={handleSaveApiKey}
                                className="w-full px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors"
                            >
                                Sauvegarder la Clé API
                            </button>
                        </div>
                    </div>

                    {/* Test Email */}
                    <div className="bg-black p-6 border border-pm-gold/10 rounded-lg">
                        <h2 className="text-2xl font-bold text-pm-gold mb-4">Test d'Envoi</h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">
                                    Email de Test
                                </label>
                                <input
                                    type="email"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    placeholder="test@example.com"
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    value={testSubject}
                                    onChange={(e) => setTestSubject(e.target.value)}
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={testMessage}
                                    onChange={(e) => setTestMessage(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none"
                                />
                            </div>
                            
                            <button
                                onClick={handleTestEmail}
                                disabled={isLoading}
                                className="w-full px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Envoi en cours...' : 'Envoyer Email de Test'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Résultat du test */}
                {testResult && (
                    <div className="mt-8 p-6 border rounded-lg">
                        <div className={`flex items-center gap-2 mb-4 ${testResult.success ? 'text-green-400' : 'text-red-400'}`}>
                            {testResult.success ? (
                                <CheckCircleIcon className="w-6 h-6" />
                            ) : (
                                <XCircleIcon className="w-6 h-6" />
                            )}
                            <h3 className="text-xl font-bold">
                                {testResult.success ? 'Succès' : 'Erreur'}
                            </h3>
                        </div>
                        
                        <p className="text-pm-off-white/90 mb-4">{testResult.message}</p>
                        
                        {testResult.details && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-pm-gold hover:underline">
                                    Détails techniques
                                </summary>
                                <pre className="mt-2 p-3 bg-pm-dark/50 rounded text-xs text-pm-off-white/70 overflow-auto">
                                    {JSON.stringify(testResult.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                {/* Informations utiles */}
                <div className="mt-8 bg-black p-6 border border-pm-gold/10 rounded-lg">
                    <h3 className="text-xl font-bold text-pm-gold mb-4">Informations Utiles</h3>
                    <div className="space-y-2 text-sm text-pm-off-white/80">
                        <p>• <strong>Clé API Brevo :</strong> Obtenez votre clé depuis le dashboard Brevo</p>
                        <p>• <strong>Adresse d'envoi :</strong> Contact@perfectmodels.ga (configurée)</p>
                        <p>• <strong>Limite d'envoi :</strong> Vérifiez votre quota Brevo</p>
                        <p>• <strong>Logs :</strong> Consultez les logs Brevo pour plus de détails</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminEmailDiagnostic;
