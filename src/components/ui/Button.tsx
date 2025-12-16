import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-widest rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-pm-gold text-pm-dark hover:bg-white hover:text-black",
        secondary: "bg-pm-dark border border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark",
        outline: "bg-transparent border-2 border-pm-gold text-pm-gold hover:bg-pm-gold hover:text-pm-dark",
        danger: "bg-red-600 text-white hover:bg-red-700"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Chargement...</span>
                </>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
