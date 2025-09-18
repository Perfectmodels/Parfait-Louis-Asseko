import React from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { allModelAccess } from '../data/modelAccess';
import ModelDashboard from './ModelDashboard';
import NotFound from './NotFound';
import PageTransition from '../components/PageTransition';

const LoadingFallback: React.FC = () => (
    <div className="min-h-screen bg-pm-dark flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
        <p className="text-pm-off-white/70 mt-4">Chargement du profil...</p>
    </div>
);

const Profile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const { data, isInitialized } = useData();

    if (!isInitialized || !data) {
        return <LoadingFallback />;
    }

    // Vérifier dans le système centralisé d'accès
    const modelAccess = allModelAccess.find(access => access.id === userId);
    
    if (modelAccess) {
        return <ModelDashboard />;
    }
    
    // Si pas trouvé dans le système centralisé, vérifier dans les anciennes données
    const isProModel = data.models.some(model => model.id === userId);
    const isBeginnerModel = data.beginnerStudents.some(student => student.id === userId);
    
    if (isProModel || isBeginnerModel) {
        return <ModelDashboard />;
    }
    
    // If user ID is not found in either list
    console.warn(`Profile page: User ID "${userId}" not found in centralized access or legacy data.`);
    return <NotFound />;
};

const ProfilePage: React.FC = () => (
    <PageTransition>
        <Profile />
    </PageTransition>
);


export default ProfilePage;
