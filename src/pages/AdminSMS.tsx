import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, BellIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const AdminSMS: React.FC = () => {
    const { data } = useData();
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{
        success: boolean;
        message: string;
        details?: any;
    } | null>(null);

    const models = data?.models || [];
    const beginnerStudents = data?.beginnerStudents || [];
    const allUsers = [...models, ...beginnerStudents];

    const handleSendNotifications = async () => {
        if (!subject.trim() || !message.trim()) {
            setResult({
                success: false,
                message: 'Veuillez remplir le sujet et le message.'
            });
            return;
        }

        const apiKey = data?.apiKeys?.brevoApiKey || (import.meta as any).env?.VITE_BREVO_API_KEY;
        if (!apiKey) {
            setResult({
                success: false,
                message: 'Clé API Brevo non configurée. Veuillez la configurer dans les paramètres.'
            });
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const emailHtml = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 20px; border-radius: 10px;">
                        <h1 style="color: #D4AF37; text-align: center; margin-bottom: 30px;">Perfect Models Management</h1>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #333; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">${subject}</h2>
                            <p style="color: #333; white-space: pre-wrap; line-height: 1.6;">${message}</p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                            <p style="color: #6c757d; font-size: 0.9em; margin: 0;">
                                Cette notification a été envoyée depuis le système de gestion de Perfect Models Management.
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
                to: allUsers.map(user => ({
                    email: user.email || `${user.username}@perfectmodels.ga`,
                    name: user.name
                })),
                subject: subject,
                htmlContent: emailHtml
            };

            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': apiKey,
                    'content-type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur Brevo: ${errorData.message || response.statusText}`);
            }

            const result = await response.json();
            
            setResult({
                success: true,
                message: `Notifications envoyées avec succès à ${allUsers.length} utilisateurs`,
                details: result
            });

        } catch (error) {
            console.error('Erreur envoi notifications:', error);
            setResult({
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
            <SEO title="Admin - Notifications Groupées" noIndex />
            <div className="container mx-auto px-6">
                <Link to="/admin" className="inline-flex items-center gap-2 text-pm-gold mb-4 hover:underline">
                    <ChevronLeftIcon className="w-5 h-5" />
                    Retour au Dashboard
                </Link>
                
                <div className="mb-8">
                    <h1 className="text-4xl font-playfair text-pm-gold">Notifications Groupées</h1>
                    <p className="text-pm-off-white/70 mt-2">Envoyez des notifications par email à tous les mannequins et étudiants.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Formulaire d'envoi */}
                    <div className="bg-black p-6 border border-pm-gold/10 rounded-lg">
                        <h2 className="text-2xl font-bold text-pm-gold mb-4 flex items-center gap-2">
                            <BellIcon className="w-6 h-6" />
                            Nouvelle Notification
                        </h2>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">
                                    Sujet
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Sujet de la notification"
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-pm-gold mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Contenu de la notification..."
                                    rows={6}
                                    className="w-full px-3 py-2 bg-pm-dark border border-pm-gold/20 rounded-lg text-pm-off-white placeholder-pm-off-white/50 focus:border-pm-gold focus:outline-none resize-none"
                                />
                            </div>
                            
                            <button
                                onClick={handleSendNotifications}
                                disabled={isLoading || !subject.trim() || !message.trim()}
                                className="w-full px-4 py-2 bg-pm-gold text-pm-dark font-bold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Envoi en cours...' : `Envoyer à ${allUsers.length} utilisateurs`}
                            </button>
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="bg-black p-6 border border-pm-gold/10 rounded-lg">
                        <h2 className="text-2xl font-bold text-pm-gold mb-4">Statistiques</h2>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-pm-dark/50 rounded-lg">
                                <span className="text-pm-off-white/80">Mannequins Professionnels</span>
                                <span className="text-pm-gold font-bold">{models.length}</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-pm-dark/50 rounded-lg">
                                <span className="text-pm-off-white/80">Étudiants Débutants</span>
                                <span className="text-pm-gold font-bold">{beginnerStudents.length}</span>
                            </div>
                            
                            <div className="flex justify-between items-center p-3 bg-pm-gold/10 border border-pm-gold/30 rounded-lg">
                                <span className="text-pm-gold font-semibold">Total Destinataires</span>
                                <span className="text-pm-gold font-bold text-xl">{allUsers.length}</span>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Conseil</h3>
                            <p className="text-xs text-pm-off-white/70">
                                Les notifications sont envoyées par email via l'API Brevo. 
                                Assurez-vous que la configuration Brevo est correcte.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Résultat */}
                {result && (
                    <div className="mt-8 p-6 border rounded-lg">
                        <div className={`flex items-center gap-2 mb-4 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                            {result.success ? (
                                <CheckCircleIcon className="w-6 h-6" />
                            ) : (
                                <XCircleIcon className="w-6 h-6" />
                            )}
                            <h3 className="text-xl font-bold">
                                {result.success ? 'Succès' : 'Erreur'}
                            </h3>
                        </div>
                        
                        <p className="text-pm-off-white/90 mb-4">{result.message}</p>
                        
                        {result.details && (
                            <details className="mt-4">
                                <summary className="cursor-pointer text-pm-gold hover:underline">
                                    Détails techniques
                                </summary>
                                <pre className="mt-2 p-3 bg-pm-dark/50 rounded text-xs text-pm-off-white/70 overflow-auto">
                                    {JSON.stringify(result.details, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSMS;
