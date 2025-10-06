import React from 'react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  className?: string;
}

const AdminTable: React.FC<AdminTableProps> = ({ 
  columns, 
  data, 
  emptyMessage = "Aucune donnée trouvée",
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-black/50 border border-pm-gold/20 rounded-xl p-8 text-center ${className}`}>
        <p className="text-pm-off-white/70 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-black/50 border border-pm-gold/20 rounded-xl overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-pm-off-white">
          <thead className="bg-pm-gold/10 border-b border-pm-gold/20">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-medium text-pm-gold uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pm-gold/10">
            {data.map((item, index) => (
              <tr key={index} className="hover:bg-pm-gold/5 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                    {column.render 
                      ? column.render(item[column.key], item)
                      : item[column.key]
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
