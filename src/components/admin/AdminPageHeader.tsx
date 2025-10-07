import React from 'react';

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle, right }) => {
  return (
    <header className="admin-page-header">
      <div>
        <h1 className="admin-page-title">{title}</h1>
        {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
      </div>
      {right}
    </header>
  );
};

export default AdminPageHeader;


