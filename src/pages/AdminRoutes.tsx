import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../components/AdminLayout';

// Lazy load admin pages
const Admin = React.lazy(() => import('./Admin'));
const AdminModels = React.lazy(() => import('./AdminModels'));
const AdminMagazine = React.lazy(() => import('./AdminMagazine'));
const AdminClassroom = React.lazy(() => import('./AdminClassroom'));
const AdminSettings = React.lazy(() => import('./AdminSettings'));
const AdminAgency = React.lazy(() => import('./AdminAgency'));
const AdminCasting = React.lazy(() => import('./AdminCasting'));
const AdminCastingResults = React.lazy(() => import('./AdminCastingResults'));
const AdminFashionDay = React.lazy(() => import('./AdminFashionDay'));
const AdminFashionDayEvents = React.lazy(() => import('./AdminFashionDayEvents'));
const AdminNews = React.lazy(() => import('./AdminNews'));
const AdminClassroomProgress = React.lazy(() => import('./AdminClassroomProgress'));
const AdminModelAccess = React.lazy(() => import('./AdminModelAccess'));
const AdminRecovery = React.lazy(() => import('./AdminRecovery'));
const AdminComments = React.lazy(() => import('./AdminComments'));
const AdminMessages = React.lazy(() => import('./AdminMessages'));
const AdminBookings = React.lazy(() => import('./AdminBookings'));
const AdminPayments = React.lazy(() => import('./AdminPayments'));
const AdminAbsences = React.lazy(() => import('./AdminAbsences'));
const AdminArtisticDirection = React.lazy(() => import('./AdminArtisticDirection'));
const AdminMailing = React.lazy(() => import('./AdminMailing'));

const AdminRoutes: React.FC = () => {
    return (
        <ProtectedRoute role="admin">
            <AdminLayout>
                <React.Suspense fallback={
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pm-gold"></div>
                    </div>
                }>
                    <Routes>
                        {/* Dashboard */}
                        <Route path="/" element={<Admin />} />
                        
                        {/* Models */}
                        <Route path="models" element={<AdminModels />} />
                        <Route path="model-access" element={<AdminModelAccess />} />
                        
                        {/* Content */}
                        <Route path="magazine" element={<AdminMagazine />} />
                        <Route path="news" element={<AdminNews />} />
                        
                        {/* Events */}
                        <Route path="casting-applications" element={<AdminCasting />} />
                        <Route path="casting-results" element={<AdminCastingResults />} />
                        <Route path="fashion-day-applications" element={<AdminFashionDay />} />
                        <Route path="fashion-day-events" element={<AdminFashionDayEvents />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        
                        {/* Education */}
                        <Route path="classroom" element={<AdminClassroom />} />
                        <Route path="classroom-progress" element={<AdminClassroomProgress />} />
                        <Route path="absences" element={<AdminAbsences />} />
                        
                        {/* Communication */}
                        <Route path="messages" element={<AdminMessages />} />
                        <Route path="mailing" element={<AdminMailing />} />
                        <Route path="comments" element={<AdminComments />} />
                        
                        {/* Management */}
                        <Route path="agency" element={<AdminAgency />} />
                        <Route path="artistic-direction" element={<AdminArtisticDirection />} />
                        <Route path="payments" element={<AdminPayments />} />
                        <Route path="recovery-requests" element={<AdminRecovery />} />
                        <Route path="settings" element={<AdminSettings />} />
                    </Routes>
                </React.Suspense>
            </AdminLayout>
        </ProtectedRoute>
    );
};

export default AdminRoutes;
