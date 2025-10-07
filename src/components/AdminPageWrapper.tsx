import React from 'react';

interface AdminPageWrapperProps {
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ children }) => {
  return (
    <div className="p-6">
      {children}
    </div>
  );
};

export default AdminPageWrapper;
