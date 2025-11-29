import React from 'react';
import { motion } from 'framer-motion';

const Marquee: React.FC = () => {
    return (
        <div className="bg-pm-gold text-black py-2 overflow-hidden whitespace-nowrap">
            <motion.div
                className="inline-block"
                animate={{ x: [0, -1000] }}
                transition={{
                    repeat: Infinity,
                    duration: 20,
                    ease: "linear"
                }}
            >
                <span className="text-sm font-semibold mx-4">
                    CASTING CALL 2024 - REJOIGNEZ L'AGENCE PERFECT MODELS - FORMATION MANNEQUINAT - SHOOTING PHOTO - DÉFILÉS DE MODE
                </span>
                <span className="text-sm font-semibold mx-4">
                    •
                </span>
                <span className="text-sm font-semibold mx-4">
                    CASTING CALL 2024 - REJOIGNEZ L'AGENCE PERFECT MODELS - FORMATION MANNEQUINAT - SHOOTING PHOTO - DÉFILÉS DE MODE
                </span>
                <span className="text-sm font-semibold mx-4">
                    •
                </span>
                <span className="text-sm font-semibold mx-4">
                    CASTING CALL 2024 - REJOIGNEZ L'AGENCE PERFECT MODELS - FORMATION MANNEQUINAT - SHOOTING PHOTO - DÉFILÉS DE MODE
                </span>
                <span className="text-sm font-semibold mx-4">
                    •
                </span>
                <span className="text-sm font-semibold mx-4">
                    CASTING CALL 2024 - REJOIGNEZ L'AGENCE PERFECT MODELS - FORMATION MANNEQUINAT - SHOOTING PHOTO - DÉFILÉS DE MODE
                </span>
            </motion.div>
        </div>
    );
};

export default Marquee;
