import React from 'react';
// FIX: Fix react-router-dom imports by using a namespace import
import * as ReactRouterDOM from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AIAssistantIcon: React.FC = () => {
    return (
        <ReactRouterDOM.Link 
            to="/chat"
            className="fixed bottom-8 right-8 bg-pm-gold text-pm-dark p-4 rounded-full shadow-lg shadow-pm-gold/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pm-gold focus:ring-offset-pm-dark transition-all duration-300 z-30 transform hover:scale-110 animate-pulse-slow"
            aria-label="Ouvrir l'assistant IA"
            title="Assistant IA"
        >
            <SparklesIcon className="h-8 w-8" />
        </ReactRouterDOM.Link>
    );
};

export default AIAssistantIcon;