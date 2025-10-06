import React, { useState } from 'react';
import { DocumentArrowDownIcon, CalendarIcon, ChartBarIcon, EyeIcon } from '@heroicons/react/24/outline';

interface AnalyticsReportProps {
  title: string;
  data: any[];
  columns: Array<{ key: string; label: string; type?: 'text' | 'number' | 'date' | 'status' }>;
  onExport?: (format: 'csv' | 'pdf' | 'excel') => void;
  onViewDetails?: (item: any) => void;
}

const AnalyticsReport: React.FC<AnalyticsReportProps> = ({
  title,
  data,
  columns,
  onExport,
  onViewDetails
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  const formatValue = (value: any, type: string = 'text') => {
    switch (type) {
      case 'number':
        return value?.toLocaleString() || '0';
      case 'date':
        return value ? new Date(value).toLocaleDateString('fr-FR') : '-';
      case 'status':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'Actif' ? 'bg-green-500/20 text-green-400' :
            value === 'Inactif' ? 'bg-red-500/20 text-red-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {value}
          </span>
        );
      default:
        return value || '-';
    }
  };

  return (
    <div className="bg-black/50 border border-pm-gold/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-playfair text-pm-gold flex items-center gap-3">
          <ChartBarIcon className="w-6 h-6" />
          {title}
        </h3>
        
        <div className="flex items-center gap-2">
          {onExport && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExport('csv')}
                className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm rounded hover:bg-blue-500/30 transition-colors"
              >
                CSV
              </button>
              <button
                onClick={() => onExport('pdf')}
                className="px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded hover:bg-red-500/30 transition-colors"
              >
                PDF
              </button>
              <button
                onClick={() => onExport('excel')}
                className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 text-sm rounded hover:bg-green-500/30 transition-colors"
              >
                Excel
              </button>
            </div>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12">
          <ChartBarIcon className="w-16 h-16 text-pm-gold/50 mx-auto mb-4" />
          <p className="text-pm-off-white/70 text-lg">Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pm-gold/20">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-4 text-pm-gold font-medium cursor-pointer hover:bg-pm-gold/5 transition-colors"
                    onClick={() => handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {sortColumn === column.key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {onViewDetails && (
                  <th className="text-left py-3 px-4 text-pm-gold font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index} className="border-b border-pm-gold/10 hover:bg-pm-gold/5 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4 text-pm-off-white/70">
                      {formatValue(item[column.key], column.type)}
                    </td>
                  ))}
                  {onViewDetails && (
                    <td className="py-3 px-4">
                      <button
                        onClick={() => onViewDetails(item)}
                        className="p-1 text-pm-gold hover:text-pm-gold/70 transition-colors"
                        title="Voir les détails"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-pm-off-white/60">
        Total: {data.length} enregistrement{data.length > 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default AnalyticsReport;
