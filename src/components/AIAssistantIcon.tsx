import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/solid';

const AIAssistantIcon: React.FC = () => {
    return (
        <Link 
            to="/chat"
            className="fixed bottom-12 right-12 z-[100] group"
            aria-label="Assistant IA Concierge"
        >
            <div className="relative">
                {/* Aura animation */}
                <div className="absolute inset-0 bg-pm-gold rounded-full blur-[30px] opacity-10 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse-slow"></div>
                
                <div className="relative flex items-center justify-center w-20 h-20 bg-pm-dark border border-pm-gold/20 rounded-full text-pm-gold transition-all duration-1000 group-hover:border-pm-gold group-hover:scale-110 shadow-2xl">
                    <SparklesIcon className="w-10 h-10 group-hover:rotate-12 transition-transform duration-700" />
                </div>
                
                <div className="absolute right-full mr-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-10 group-hover:translate-x-0 pointer-events-none">
                    <span className="bg-black/90 backdrop-blur-3xl text-pm-gold text-[10px] uppercase tracking-[0.5em] font-black px-6 py-3 rounded-full whitespace-nowrap border border-pm-gold/10">
                        Concierge AI
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default AIAssistantIcon;