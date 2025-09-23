import React from 'react';

interface Column {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, item: any) => React.ReactNode;
    width?: string;
}

interface AdminTableProps {
    columns: Column[];
    data: any[];
    emptyMessage?: string;
    loading?: boolean;
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    className?: string;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    onDelete?: (id: string) => Promise<void>;
}

const AdminTable: React.FC<AdminTableProps> = ({
    columns,
    data,
    emptyMessage = "Aucune donnée trouvée",
    loading = false,
    onSort,
    sortColumn,
    sortDirection = 'asc',
    className = "",
    searchTerm,
    onSearchChange,
    onDelete
}) => {
    const handleSort = (column: string) => {
        if (!onSort || !columns.find(col => col.key === column)?.sortable) return;
        
        const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        onSort(column, newDirection);
    };

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) {
            return (
                <svg className="w-4 h-4 text-pm-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        
        return sortDirection === 'asc' ? (
            <svg className="w-4 h-4 text-pm-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        ) : (
            <svg className="w-4 h-4 text-pm-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    };

    if (loading) {
        return (
            <div className={`bg-black/50 border border-pm-gold/20 rounded-xl overflow-hidden ${className}`}>
                <div className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pm-gold"></div>
                    <p className="text-pm-off-white/70 mt-4">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={`bg-black/50 border border-pm-gold/20 rounded-xl overflow-hidden ${className}`}>
                <div className="p-8 text-center">
                    <svg className="w-12 h-12 text-pm-gold/50 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                    </svg>
                    <p className="text-pm-off-white/70">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-black/50 border border-pm-gold/20 rounded-xl overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-pm-gold/10 border-b border-pm-gold/20">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-4 text-left text-xs font-medium text-pm-gold uppercase tracking-wider ${
                                        column.sortable ? 'cursor-pointer hover:bg-pm-gold/20' : ''
                                    }`}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.key)}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>{column.label}</span>
                                        {column.sortable && getSortIcon(column.key)}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pm-gold/10">
                        {data.map((item, index) => (
                            <tr
                                key={item.id || index}
                                className="hover:bg-pm-gold/5 transition-colors duration-200"
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-pm-off-white"
                                    >
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
