import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div className="w-6 h-5 relative flex flex-col justify-between items-center cursor-pointer">
      <motion.span
        animate={isOpen ? { rotate: 45, y: 9 } : { rotate: 0, y: 0 }}
        className="w-full h-0.5 bg-white block rounded-sm"
      />
      <motion.span
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
        className="w-full h-0.5 bg-white block rounded-sm"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
        className="w-full h-0.5 bg-white block rounded-sm"
      />
    </div>
  );
};

export default AnimatedHamburgerIcon;