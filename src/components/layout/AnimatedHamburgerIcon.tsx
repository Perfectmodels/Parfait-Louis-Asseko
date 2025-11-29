import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHamburgerIconProps {
    isOpen: boolean;
    onClick: () => void;
}

const AnimatedHamburgerIcon: React.FC<AnimatedHamburgerIconProps> = ({ isOpen, onClick }) => {
    const variant = isOpen ? "opened" : "closed";
    const top = {
        closed: {
            rotate: 0,
            translateY: 0
        },
        opened: {
            rotate: 45,
            translateY: 6
        }
    };
    const center = {
        closed: {
            opacity: 1
        },
        opened: {
            opacity: 0
        }
    };
    const bottom = {
        closed: {
            rotate: 0,
            translateY: 0
        },
        opened: {
            rotate: -45,
            translateY: -6
        }
    };

    return (
        <button
            onClick={onClick}
            className="flex flex-col justify-center items-center w-8 h-8 space-y-1.5 focus:outline-none z-50"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
            <motion.span
                animate={variant}
                variants={top}
                className="block w-6 h-0.5 bg-pm-gold"
            />
            <motion.span
                animate={variant}
                variants={center}
                className="block w-6 h-0.5 bg-pm-gold"
            />
            <motion.span
                animate={variant}
                variants={bottom}
                className="block w-6 h-0.5 bg-pm-gold"
            />
        </button>
    );
};

export default AnimatedHamburgerIcon;
