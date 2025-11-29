import React, { useEffect } from 'react';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ title, description, noIndex }) => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${title} | Perfect Models Management`;

        let metaDescription = document.querySelector('meta[name="description"]');
        const prevDescription = metaDescription?.getAttribute('content');

        if (description) {
            if (!metaDescription) {
                metaDescription = document.createElement('meta');
                metaDescription.setAttribute('name', 'description');
                document.head.appendChild(metaDescription);
            }
            metaDescription.setAttribute('content', description);
        }

        let metaRobots = document.querySelector('meta[name="robots"]');
        const prevRobots = metaRobots?.getAttribute('content');

        if (noIndex) {
            if (!metaRobots) {
                metaRobots = document.createElement('meta');
                metaRobots.setAttribute('name', 'robots');
                document.head.appendChild(metaRobots);
            }
            metaRobots.setAttribute('content', 'noindex, nofollow');
        }

        return () => {
            document.title = prevTitle;
            if (description && metaDescription) {
                if (prevDescription) {
                    metaDescription.setAttribute('content', prevDescription);
                } else {
                    metaDescription.remove();
                }
            }
            if (noIndex && metaRobots) {
                if (prevRobots) {
                    metaRobots.setAttribute('content', prevRobots);
                } else {
                    metaRobots.remove();
                }
            }
        };
    }, [title, description, noIndex]);

    return null;
};

export default SEO;
