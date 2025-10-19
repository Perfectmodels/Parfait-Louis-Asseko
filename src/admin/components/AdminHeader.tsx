import React from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
  totalNotifications?: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, onMenuClick, onLogout, totalNotifications }) => {
  return (
    <div className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};

export default AdminHeader;