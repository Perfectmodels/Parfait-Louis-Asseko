import React from 'react';

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" fill="white" />
        <circle cx="12" cy="12" r="11.5" stroke="#1877F2" strokeWidth="1" fill="none" />
    </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <defs>
            <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: '#f9ce34'}} />
                <stop offset="25%" style={{stopColor: '#ee2a7b'}} />
                <stop offset="50%" style={{stopColor: '#6228d7'}} />
                <stop offset="100%" style={{stopColor: '#f9ce34'}} />
            </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#instagram-gradient)" />
        <path d="M12 16a4 4 0 100-8 4 4 0 000 8zm0-6.5a2.5 2.5 0 110 5 2.5 2.5 0 010-5zM16.5 8.5a1 1 0 100-2 1 1 0 000 2z" fill="white" />
    </svg>
);

export const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="#FF0000" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#FF0000" />
        <path d="M9.5 15.5V8.5l7 3.5-7 3.5z" fill="white" />
    </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
     <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#25D366" />
        <path d="M16.57 14.82c-.13-.07-1.55-.77-1.79-.86-.24-.09-.42-.14-.58.14-.17.28-.67.86-.82 1.03-.15.18-.3.19-.57.05-.27-.14-1.14-.42-2.17-1.33-.8-.71-1.34-1.6-1.5-1.87-.16-.28-.02-.43.12-.57.12-.13.27-.31.4-.47.14-.16.18-.28.27-.47.09-.18.04-.34-.02-.48-.07-.14-.58-1.4-1.02-2.02-.2-.29-.4-.44-.58-.45l-.49-.01c-.15 0-.41.07-.63.3-.22.24-.83.82-.83 2s.85 2.32.97 2.48c.12.16 1.68 2.56 4.07 3.58.56.24 1 .39 1.34.5.49.15.93.13 1.28.08.38-.05 1.14-.47 1.3-.92.17-.45.17-.83.12-.92-.05-.1-.17-.15-.3-.22z" fill="white"/>
    </svg>
);

export const TikTokIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="black" />
        <path d="M15.1 6.81a3.94 3.94 0 01-3.94-3.94v7.6a4.74 4.74 0 104.74 4.74h-2.52a2.22 2.22 0 11-2.22-2.22V6.8h2.52a3.94 3.94 0 01-.6-2.02z" fill="#FE2C55" />
        <path d="M12.59 2.87a3.94 3.94 0 013.94 3.94v7.6a4.74 4.74 0 10-4.74-4.74h2.52a2.22 2.22 0 112.22 2.22V2.87h-2.52a3.94 3.94 0 01-1.42-7.72z" fill="#25F4EE" />
    </svg>
);