import React from 'react';

interface AdminSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const AdminSection: React.FC<AdminSectionProps> = ({ title, children, className }) => {
  return (
    <div className={`admin-section-wrapper ${className || ''}`.trim()}>
      <h2 className="admin-section-title">{title}</h2>
      {children}
    </div>
  );
};

export default AdminSection;


