import React from 'react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (value: any, item: T, index: number) => React.ReactNode;
    className?: string;
    sortable?: boolean;
}

interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T, index: number) => void;
    className?: string;
    emptyMessage?: string;
    loading?: boolean;
}

function AdminTable<T extends Record<string, any>>({
    data,
    columns,
    onRowClick,
    className = "",
    emptyMessage = "Aucune donnée disponible",
    loading = false
}: AdminTableProps<T>) {
    const getValue = (item: T, key: keyof T | string): any => {
        if (typeof key === 'string' && key.includes('.')) {
            return key.split('.').reduce((obj, k) => obj?.[k], item);
        }
        return item[key as keyof T];
    };

    if (loading) {
        return (
            <div className="bg-black border border-pm-gold/20 rounded-lg p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pm-gold"></div>
                    <span className="ml-3 text-pm-off-white">Chargement...</span>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-black border border-pm-gold/20 rounded-lg p-8">
                <div className="text-center text-pm-off-white/60">
                    {emptyMessage}
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-black border border-pm-gold/20 rounded-lg overflow-hidden ${className}`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-pm-dark border-b border-pm-gold/20">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`px-6 py-4 text-left text-sm font-semibold text-pm-gold ${column.className || ''}`}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-pm-gold/10">
                        {data.map((item, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick?.(item, rowIndex)}
                                className={`hover:bg-pm-gold/5 transition-colors ${
                                    onRowClick ? 'cursor-pointer' : ''
                                }`}
                            >
                                {columns.map((column, colIndex) => {
                                    const value = getValue(item, column.key);
                                    return (
                                        <td
                                            key={colIndex}
                                            className={`px-6 py-4 text-sm text-pm-off-white ${column.className || ''}`}
                                        >
                                            {column.render ? column.render(value, item, rowIndex) : value}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminTable;