import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute, Layout } from '../components';

// Lazy load admin pages
const Admin = React.lazy(() => import('./Admin'));
const AdminMagazine = React.lazy(() => import('./AdminMagazine'));
const AdminClassroom = React.lazy(() => import('./AdminClassroom'));
const AdminSettings = React.lazy(() => import('./AdminSettings'));
const AdminCasting = React.lazy(() => import('./AdminCasting'));
const AdminCastingResults = React.lazy(() => import('./AdminCastingResults'));
const AdminAnalytics = React.lazy(() => import('./AdminAnalytics'));
const AdminGallery = React.lazy(() => import('./AdminGallery'));

const AdminRoutes: React.FC = () => {
    return (
        <ProtectedRoute role="admin">
            <Layout>
                <React.Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
                    </div>
                }>
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
                </React.Suspense>
            </Layout>
        </ProtectedRoute>
    );
};

export default AdminRoutes;
