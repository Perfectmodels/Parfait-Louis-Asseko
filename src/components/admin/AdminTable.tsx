import React from 'react';

interface AdminTableProps {
  children: React.ReactNode;
  className?: string;
}

const AdminTable: React.FC<AdminTableProps> = ({ children, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full border border-pm-gold/20 text-pm-off-white">
        {children}
      </table>
    </div>
  );
};

export default AdminTable;
