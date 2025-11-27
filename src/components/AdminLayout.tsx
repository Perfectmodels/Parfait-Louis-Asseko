import React from 'react';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
    children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-pm-dark">
            <div className="p-6 lg:p-8">
                {children || <Outlet />}
            </div>
        </div>
    );
};

export default AdminLayout;
