import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    className?: string;
}

const AdminModal: React.FC<AdminModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    className = ""
}) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        '2xl': 'max-w-6xl'
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
                onClick={closeOnOverlayClick ? onClose : undefined}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className={`relative w-full ${sizeClasses[size]} transform transition-all`}>
                    <div className={`bg-gradient-to-br from-pm-dark to-black border border-pm-gold/20 rounded-2xl shadow-2xl ${className}`}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-pm-gold/20">
                            <h3 className="text-2xl font-playfair text-pm-gold">
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="p-2 text-pm-gold/70 hover:text-pm-gold hover:bg-pm-gold/10 rounded-lg transition-all duration-200"
                                    aria-label="Fermer"
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminModal;
