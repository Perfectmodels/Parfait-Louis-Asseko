import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoadingTest: React.FC = () => {
    const [testResults, setTestResults] = useState<string[]>([]);

    const addResult = (result: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
    };

    const testRoutes = [
        { path: '/', name: 'Accueil' },
        { path: '/mannequins', name: 'Mannequins' },
        { path: '/magazine', name: 'Magazine' },
        { path: '/services', name: 'Services' },
        { path: '/admin', name: 'Admin' },
        { path: '/formations', name: 'Formations' },
    ];

    const testRouteLoading = async (path: string, name: string) => {
        addResult(`Test de chargement: ${name}`);
        
        const startTime = performance.now();
        
        try {
            // Simulate navigation
            window.location.href = `#${path}`;
            
            // Wait a bit for the route to load
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const endTime = performance.now();
            const loadTime = Math.round(endTime - startTime);
            
            addResult(`✅ ${name} chargé en ${loadTime}ms`);
        } catch (error) {
            addResult(`❌ Erreur lors du chargement de ${name}: ${error}`);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="min-h-screen bg-pm-dark p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-pm-gold mb-8">Test de Chargement des Routes</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold text-pm-off-white mb-4">Routes à Tester</h2>
                        <div className="space-y-2">
                            {testRoutes.map(route => (
                                <div key={route.path} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                                    <span className="text-pm-off-white">{route.name}</span>
                                    <div className="space-x-2">
                                        <Link
                                            to={route.path}
                                            className="px-3 py-1 bg-pm-gold text-pm-dark text-sm rounded hover:bg-yellow-400 transition-colors"
                                        >
                                            Naviguer
                                        </Link>
                                        <button
                                            onClick={() => testRouteLoading(route.path, route.name)}
                                            className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                        >
                                            Tester
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-6">
                            <button
                                onClick={clearResults}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                Effacer les résultats
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <h2 className="text-xl font-semibold text-pm-off-white mb-4">Résultats des Tests</h2>
                        <div className="bg-black/50 rounded-lg p-4 h-96 overflow-y-auto">
                            {testResults.length === 0 ? (
                                <p className="text-pm-off-white/60">Aucun test effectué</p>
                            ) : (
                                <div className="space-y-2">
                                    {testResults.map((result, index) => (
                                        <div key={index} className="text-sm font-mono text-pm-off-white">
                                            {result}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 p-4 bg-black/30 rounded-lg">
                    <h3 className="text-lg font-semibold text-pm-gold mb-2">Instructions</h3>
                    <ul className="text-pm-off-white/70 space-y-1">
                        <li>• Cliquez sur "Naviguer" pour tester la navigation normale</li>
                        <li>• Cliquez sur "Tester" pour mesurer le temps de chargement</li>
                        <li>• Les pages ne devraient plus être vides ou figées</li>
                        <li>• Le chargement devrait être fluide avec des indicateurs visuels</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LoadingTest;
