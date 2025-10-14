import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';

interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    backLink?: string;
    backText?: string;
    actions?: React.ReactNode;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
    title,
    subtitle,
    backLink = '/admin',
    backText = 'Retour au tableau de bord',
    actions
}) => {
    return (
        <div className="mb-8">
            {/* Breadcrumb */}
            <div className="mb-4">
                <Link 
                    to={backLink}
                    className="inline-flex items-center text-sm text-pm-off-white/70 hover:text-pm-gold transition-colors"
                >
                    <ChevronLeftIcon className="w-4 h-4 mr-1" />
                    {backText}
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                    <h1 className="text-3xl font-playfair text-pm-gold font-bold">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-pm-off-white/80 mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>
                {actions && (
                    <div className="flex items-center space-x-3">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;