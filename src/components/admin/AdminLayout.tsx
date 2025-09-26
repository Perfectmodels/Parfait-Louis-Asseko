import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  EnvelopeIcon, 
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import AIAssistant from '../AIAssistant';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; path: string }>;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, description, breadcrumbs }) => {
  const location = useLocation();
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/models', label: 'Mannequins', icon: UserGroupIcon },
    { path: '/admin/emails', label: 'Emails', icon: EnvelopeIcon },
    { path: '/admin/accounting', label: 'Comptabilité', icon: CurrencyDollarIcon },
    { path: '/admin/content', label: 'Contenu', icon: DocumentTextIcon },
    { path: '/admin/events', label: 'Événements', icon: CalendarIcon },
    { path: '/admin/analytics', label: 'Analytics', icon: ChartBarIcon },
    { path: '/admin/settings', label: 'Paramètres', icon: CogIcon },
  ];

  return (
    <div className="min-h-screen bg-pm-dark text-pm-off-white">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black/50 border-r border-pm-gold/20 min-h-screen">
          <div className="p-6">
            <h1 className="text-2xl font-playfair text-pm-gold mb-8">Admin Panel</h1>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? 'bg-pm-gold text-pm-dark'
                        : 'text-pm-off-white/70 hover:text-pm-gold hover:bg-pm-gold/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          {(title || description || breadcrumbs) && (
            <div className="mb-8">
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4">
                  <ol className="flex items-center space-x-2 text-sm text-pm-off-white/70">
                    {breadcrumbs.map((crumb, index) => (
                      <li key={crumb.path} className="flex items-center">
                        {index > 0 && <span className="mx-2">/</span>}
                        <span className={index === breadcrumbs.length - 1 ? 'text-pm-gold' : 'hover:text-pm-gold cursor-pointer'}>
                          {crumb.label}
                        </span>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              {title && (
                <h1 className="text-3xl font-playfair text-pm-gold mb-2">{title}</h1>
              )}
              {description && (
                <p className="text-pm-off-white/80 text-lg">{description}</p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Assistant AI Global */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAIAssistantOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-pm-gold to-yellow-400 text-pm-dark font-bold rounded-full shadow-lg hover:from-yellow-400 hover:to-pm-gold transition-all duration-300 hover:scale-105 hover:shadow-xl"
          title="Assistant IA Global"
        >
          <SparklesIcon className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:block">Assistant IA</span>
        </button>
      </div>

      <AIAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        onInsertContent={() => {}} // Pas d'insertion pour l'assistant global
        fieldName="Assistant Global"
        initialPrompt="Bonjour ! Je suis votre assistant IA pour Perfect Models Management. Comment puis-je vous aider avec la gestion de votre agence de mannequins ?"
      />
    </div>
  );
};

export default AdminLayout;
