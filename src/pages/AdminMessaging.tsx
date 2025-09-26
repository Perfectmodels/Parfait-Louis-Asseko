import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import WhatsAppMessaging from '../components/WhatsAppMessaging';

const AdminMessaging: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<{
        id: string;
        name: string;
        role: 'admin' | 'model' | 'beginner';
    } | null>(null);

    useEffect(() => {
        // Récupérer l'utilisateur admin depuis sessionStorage
        const userRole = sessionStorage.getItem('classroom_role');
        
        if (userRole === 'admin') {
            setCurrentUser({
                id: 'admin',
                name: 'Administrateur',
                role: 'admin'
            });
        }
    }, []);

    if (!currentUser) {
        return (
            <AdminLayout 
                title="Messagerie Interne" 
                description="Gestion des conversations avec les mannequins et étudiants"
                breadcrumbs={[{ label: 'Messagerie' }]}
            >
                <div className="text-center py-12">
                    <h2 className="text-2xl font-playfair text-pm-gold mb-4">Accès non autorisé</h2>
                    <p className="text-pm-off-white/70">Veuillez vous connecter en tant qu'administrateur.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout 
            title="Messagerie Interne" 
            description="Gestion des conversations avec les mannequins et étudiants"
            breadcrumbs={[{ label: 'Messagerie' }]}
        >
            <div className="h-[calc(100vh-200px)]">
                <WhatsAppMessaging
                    currentUserId={currentUser.id}
                    currentUserName={currentUser.name}
                    currentUserRole={currentUser.role}
                    isAdmin={true}
                />
            </div>
        </AdminLayout>
    );
};

export default AdminMessaging;