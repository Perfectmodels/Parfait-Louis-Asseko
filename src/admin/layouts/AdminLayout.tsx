import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    UsersIcon, 
    BookOpenIcon, 
    NewspaperIcon, 
    CalendarDaysIcon, 
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import { useData } from '../../contexts/DataContext';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = useData();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/login');
    };

    // Calculer les notifications
    const notifications = {
        casting: data?.castingApplications?.filter(app => app.status === 'Nouveau').length || 0,
        fashionDay: data?.fashionDayApplications?.filter(app => app.status === 'Nouveau').length || 0,
        recovery: data?.recoveryRequests?.filter(req => req.status === 'Nouveau').length || 0,
        bookings: data?.bookingRequests?.filter(req => req.status === 'Nouveau').length || 0,
        messages: data?.contactMessages?.filter(msg => msg.status === 'Nouveau').length || 0,
    };

    const totalNotifications = Object.values(notifications).reduce((sum, count) => sum + count, 0);

    return (
        <div className="min-h-screen bg-pm-dark">
            {/* Sidebar mobile overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div className="fixed inset-0 bg-black/50" />
                </div>
            )}

            {/* Sidebar */}
            <AdminSidebar 
                isOpen={sidebarOpen} 
                onClose={() => setSidebarOpen(false)}
                notifications={notifications}
            />

            {/* Main content */}
            <div className="lg:pl-72">
                {/* Header */}
                <AdminHeader 
                    onMenuClick={() => setSidebarOpen(true)}
                    onLogout={handleLogout}
                    totalNotifications={totalNotifications}
                />

                {/* Page content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;