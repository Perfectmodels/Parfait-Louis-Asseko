import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({ children, className }) => {
  return (
    <div className={`card-base ${className || ''}`.trim()}>
      {children}
    </div>
  );
};

export default AdminCard;


