import React from 'react';

interface AdminInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helpText?: string;
    icon?: React.ElementType;
}

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helpText?: string;
}

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helpText?: string;
    options: { value: string | number; label: string }[];
}

export const AdminInput: React.FC<AdminInputProps> = ({
    label,
    error,
    helpText,
    icon: Icon,
    className = '',
    ...props
}) => {
    const inputClasses = `admin-input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''} ${className}`;

    return (
        <div className="space-y-1">
            {label && (
                <label className="admin-label">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-pm-off-white/50" />
                    </div>
                )}
                <input
                    className={`${inputClasses} ${Icon ? 'pl-10' : ''}`}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
            {helpText && !error && (
                <p className="text-sm text-pm-off-white/60">{helpText}</p>
            )}
        </div>
    );
};

export const AdminTextarea: React.FC<AdminTextareaProps> = ({
    label,
    error,
    helpText,
    className = '',
    ...props
}) => {
    const textareaClasses = `admin-textarea ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''} ${className}`;

    return (
        <div className="space-y-1">
            {label && (
                <label className="admin-label">
                    {label}
                </label>
            )}
            <textarea
                className={textareaClasses}
                {...props}
            />
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
            {helpText && !error && (
                <p className="text-sm text-pm-off-white/60">{helpText}</p>
            )}
        </div>
    );
};

export const AdminSelect: React.FC<AdminSelectProps> = ({
    label,
    error,
    helpText,
    options,
    className = '',
    ...props
}) => {
    const selectClasses = `admin-input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''} ${className}`;

    return (
        <div className="space-y-1">
            {label && (
                <label className="admin-label">
                    {label}
                </label>
            )}
            <select
                className={selectClasses}
                {...props}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-400">{error}</p>
            )}
            {helpText && !error && (
                <p className="text-sm text-pm-off-white/60">{helpText}</p>
            )}
        </div>
    );
};