import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { AdminUser } from '../types';

const UserCreationTest: React.FC = () => {
    const { data, saveData } = useData();
    const [testResult, setTestResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const testUserCreation = async () => {
        if (!data) {
            setTestResult('❌ Aucune donnée disponible');
            return;
        }

        setIsLoading(true);
        setTestResult('🔄 Test en cours...');

        try {
            // Créer un utilisateur de test
            const testUser: AdminUser = {
                id: `test-user-${Date.now()}`,
                username: 'test-user',
                password: 'test123',
                name: 'Utilisateur Test',
                email: 'test@example.com',
                role: 'staff',
                permissions: ['read', 'write'],
                isActive: true,
                createdAt: new Date().toISOString(),
                createdBy: 'admin'
            };

            // Récupérer les utilisateurs existants
            const existingUsers = data.adminUsers || [];
            
            // Vérifier si l'utilisateur existe déjà
            const userExists = existingUsers.some(u => u.username === testUser.username);
            if (userExists) {
                setTestResult('⚠️ Utilisateur de test existe déjà');
                setIsLoading(false);
                return;
            }

            // Ajouter le nouvel utilisateur
            const updatedUsers = [...existingUsers, testUser];
            
            // Sauvegarder
            await saveData({ ...data, adminUsers: updatedUsers });
            
            setTestResult('✅ Utilisateur créé avec succès !');
        } catch (error) {
            console.error('Erreur lors du test:', error);
            setTestResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const testUserRetrieval = () => {
        if (!data) {
            setTestResult('❌ Aucune donnée disponible');
            return;
        }

        const users = data.adminUsers || [];
        setTestResult(`📊 ${users.length} utilisateur(s) trouvé(s) dans la base de données`);
    };

    return (
        <div className="bg-black border border-pm-gold/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-pm-gold mb-4">Test de Création d'Utilisateurs</h3>
            
            <div className="space-y-4">
                <div className="flex gap-4">
                    <button
                        onClick={testUserCreation}
                        disabled={isLoading}
                        className="px-4 py-2 bg-pm-gold text-pm-dark font-semibold rounded-lg hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Test...' : 'Tester Création'}
                    </button>
                    
                    <button
                        onClick={testUserRetrieval}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Vérifier Utilisateurs
                    </button>
                </div>
                
                {testResult && (
                    <div className="p-3 bg-pm-dark/50 rounded-lg">
                        <p className="text-sm">{testResult}</p>
                    </div>
                )}
                
                <div className="text-xs text-pm-off-white/60">
                    <p>• Test de création d'un utilisateur admin</p>
                    <p>• Vérification de la sauvegarde en base</p>
                    <p>• Comptage des utilisateurs existants</p>
                </div>
            </div>
        </div>
    );
};

export default UserCreationTest;
