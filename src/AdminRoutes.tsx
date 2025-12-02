import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, Layout } from '../components';

// Import admin pages
import Admin from './Admin';
import AdminMagazine from './AdminMagazine';
import AdminClassroom from './AdminClassroom';
import AdminSettings from './AdminSettings';
import AdminCasting from './AdminCasting';
import AdminCastingResults from './AdminCastingResults';
import AdminAnalytics from './AdminAnalytics';
import AdminGallery from './AdminGallery';

const AdminRoutes: React.FC = () => {
    return (
        <ProtectedRoute role="admin">
            <Layout>
                <Routes>
                    {/* Dashboard */}
                    <Route path="/" element={<Admin />} />

                    {/* Content */}
                    <Route path="magazine" element={<AdminMagazine />} />
                    <Route path="gallery" element={<AdminGallery />} />

                    {/* Events */}
                    <Route path="casting-applications" element={<AdminCasting />} />
                    <Route path="casting-results" element={<AdminCastingResults />} />

                    {/* Education */}
                    <Route path="classroom" element={<AdminClassroom />} />

                    {/* Management */}
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                </Routes>
            </Layout>
        </ProtectedRoute>
    );
};

export default AdminRoutes;
