import React from 'react';

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ElementType;
    children: React.ReactNode;
}

const AdminButton: React.FC<AdminButtonProps> = ({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon: Icon,
    children,
    className = '',
    disabled,
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
        primary: 'bg-pm-gold text-black hover:bg-pm-gold/90 focus:ring-pm-gold',
        secondary: 'bg-pm-off-white/10 text-pm-off-white hover:bg-pm-off-white/20 focus:ring-pm-off-white',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
        success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
        outline: 'border border-pm-gold/40 text-pm-gold hover:bg-pm-gold/10 hover:border-pm-gold focus:ring-pm-gold'
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Chargement...
                </>
            ) : (
                <>
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {children}
                </>
            )}
        </button>
    );
};

export default AdminButton;