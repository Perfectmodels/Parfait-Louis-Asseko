import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHamburgerIconProps {
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
}

const AnimatedHamburgerIcon: React.FC<AnimatedHamburgerIconProps> = ({ isOpen, onClick, className = '' }) => {
  return (
    <button onClick={onClick} className={`w-10 h-10 relative focus:outline-none flex flex-col justify-center items-center ${className}`}>
      <motion.span
        className="w-6 h-0.5 bg-pm-gold mb-1.5 rounded"
        animate={{
          rotate: isOpen ? 45 : 0,
          y: isOpen ? 8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-6 h-0.5 bg-pm-gold mb-1.5 rounded"
        animate={{
          opacity: isOpen ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="w-6 h-0.5 bg-pm-gold rounded"
        animate={{
          rotate: isOpen ? -45 : 0,
          y: isOpen ? -8 : 0,
        }}
        transition={{ duration: 0.3 }}
      />
    </button>
  );
};

export default AnimatedHamburgerIcon;
