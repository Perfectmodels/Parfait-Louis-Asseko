import React, { useState, useEffect } from 'react';
import SEO from '../components/SEO';
import WhatsAppMessaging from '../components/WhatsAppMessaging';

const ModelMessaging: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<{
        id: string;
        name: string;
        role: 'admin' | 'model' | 'beginner';
    } | null>(null);

    useEffect(() => {
        // Récupérer l'utilisateur actuel depuis sessionStorage
        const userId = sessionStorage.getItem('userId');
        const userName = sessionStorage.getItem('userName');
        const userRole = sessionStorage.getItem('classroom_role') as 'admin' | 'model' | 'beginner';
        const userType = sessionStorage.getItem('userType');

        if (userId && userName && userRole) {
            setCurrentUser({
                id: userId,
                name: userName,
                role: userType === 'beginner' ? 'beginner' : userRole
            });
        }
    }, []);

    if (!currentUser) {
        return (
            <div className="bg-pm-dark text-pm-off-white min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-playfair text-pm-gold mb-4">Accès non autorisé</h2>
                    <p className="text-pm-off-white/70">Veuillez vous connecter pour accéder à la messagerie.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <SEO title="Messagerie Interne" noIndex />
            <WhatsAppMessaging
                currentUserId={currentUser.id}
                currentUserName={currentUser.name}
                currentUserRole={currentUser.role}
                isAdmin={false}
            />
        </div>
    );
};

export default ModelMessaging;