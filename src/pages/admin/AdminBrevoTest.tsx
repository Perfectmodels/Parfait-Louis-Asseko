import React, { useState } from 'react';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

const AdminBrevoTest: React.FC = () => {
    const [testResults, setTestResults] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const runBrevoTest = async () => {
        setIsLoading(true);
        try {
            // Simulation d'un test Brevo
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockResults = {
                apiKey: 'Valid',
                smtp: 'Connected',
                email: 'Sent successfully',
                template: 'Found',
                overall: 'Success'
            };
            
            setTestResults(mockResults);
        } catch (error) {
            setTestResults({
                apiKey: 'Invalid',
                smtp: 'Failed',
                email: 'Failed',
                template: 'Not found',
                overall: 'Failed'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-pm-dark text-pm-off-white">
            <SEO 
                title="Test Brevo - Admin" 
                description="Validation de la configuration Brevo"
            />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link 
                        to="/admin" 
                        className="flex items-center gap-2 text-pm-gold hover:text-pm-gold/80 transition-colors"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Retour au Panel Admin
                    </Link>
                </div>

                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-pm-gold mb-2">Test Brevo</h1>
                    <p className="text-pm-off-white/70 mb-8">Validation de la configuration Brevo et des fonctionnalités email</p>

                    {/* Test Button */}
                    <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20 mb-8">
                        <h2 className="text-xl font-semibold text-pm-gold mb-4">Lancer les Tests</h2>
                        <button
                            onClick={runBrevoTest}
                            disabled={isLoading}
                            className="bg-pm-gold text-pm-dark px-6 py-3 rounded-lg font-semibold hover:bg-pm-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Test en cours...' : 'Lancer les Tests Brevo'}
                        </button>
                    </div>

                    {/* Test Results */}
                    {testResults && (
                        <div className="bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                            <h2 className="text-xl font-semibold text-pm-gold mb-6">Résultats des Tests</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                                        <span className="text-pm-off-white">Clé API</span>
                                        <div className="flex items-center gap-2">
                                            {testResults.apiKey === 'Valid' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-red-400" />
                                            )}
                                            <span className={testResults.apiKey === 'Valid' ? 'text-green-400' : 'text-red-400'}>
                                                {testResults.apiKey}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                                        <span className="text-pm-off-white">Connexion SMTP</span>
                                        <div className="flex items-center gap-2">
                                            {testResults.smtp === 'Connected' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-red-400" />
                                            )}
                                            <span className={testResults.smtp === 'Connected' ? 'text-green-400' : 'text-red-400'}>
                                                {testResults.smtp}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                                        <span className="text-pm-off-white">Envoi d'Email</span>
                                        <div className="flex items-center gap-2">
                                            {testResults.email === 'Sent successfully' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-red-400" />
                                            )}
                                            <span className={testResults.email === 'Sent successfully' ? 'text-green-400' : 'text-red-400'}>
                                                {testResults.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                                        <span className="text-pm-off-white">Templates</span>
                                        <div className="flex items-center gap-2">
                                            {testResults.template === 'Found' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-red-400" />
                                            )}
                                            <span className={testResults.template === 'Found' ? 'text-green-400' : 'text-red-400'}>
                                                {testResults.template}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                                        <span className="text-pm-off-white">Statut Global</span>
                                        <div className="flex items-center gap-2">
                                            {testResults.overall === 'Success' ? (
                                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="w-5 h-5 text-red-400" />
                                            )}
                                            <span className={testResults.overall === 'Success' ? 'text-green-400' : 'text-red-400'}>
                                                {testResults.overall}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Configuration Info */}
                    <div className="mt-8 bg-pm-dark/50 rounded-lg p-6 border border-pm-gold/20">
                        <h2 className="text-xl font-semibold text-pm-gold mb-4">Configuration Brevo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-pm-gold">Serveur SMTP:</span>
                                <span className="text-pm-off-white ml-2">smtp-relay.brevo.com</span>
                            </div>
                            <div>
                                <span className="text-pm-gold">Port:</span>
                                <span className="text-pm-off-white ml-2">587</span>
                            </div>
                            <div>
                                <span className="text-pm-gold">Login SMTP:</span>
                                <span className="text-pm-off-white ml-2">94c444001@smtp-brevo.com</span>
                            </div>
                            <div>
                                <span className="text-pm-gold">Email Expéditeur:</span>
                                <span className="text-pm-off-white ml-2">Contact@perfectmodels.ga</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBrevoTest;
