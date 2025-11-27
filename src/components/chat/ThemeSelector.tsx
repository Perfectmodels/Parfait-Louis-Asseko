import React, { useState } from 'react';
import { useChat } from '../../contexts/ChatContext';
import { 
  SunIcon, 
  MoonIcon, 
  ComputerDesktopIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'light' as const,
      name: 'Clair',
      icon: SunIcon,
      description: 'Thème clair pour la journée'
    },
    {
      id: 'dark' as const,
      name: 'Sombre',
      icon: MoonIcon,
      description: 'Thème sombre pour la nuit'
    },
    {
      id: 'auto' as const,
      name: 'Auto',
      icon: ComputerDesktopIcon,
      description: 'S\'adapte automatiquement'
    }
  ];

  const currentTheme = themes.find(t => t.id === theme);

  if (!currentTheme) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-2"
      >
        <currentTheme.icon className="w-5 h-5" />
        <span className="text-sm hidden sm:inline">{currentTheme.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 min-w-[200px]">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900">Thème</p>
            <p className="text-xs text-gray-500">Choisissez l'apparence</p>
          </div>
          
          {themes.map(({ id, name, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => {
                setTheme(id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                theme === id ? 'bg-pm-gold bg-opacity-10' : ''
              }`}
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{name}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              {theme === id && (
                <CheckIcon className="w-4 h-4 text-pm-gold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
