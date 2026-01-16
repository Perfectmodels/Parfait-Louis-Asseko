import React from 'react';

const AnimatedHamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const commonClasses = "block absolute h-0.5 w-6 bg-current transform transition duration-500 ease-in-out";
  return (
    <div className="w-6 h-6 relative">
      <span className={`${commonClasses} ${isOpen ? 'rotate-45' : '-translate-y-1.5'}`}></span>
      <span className={`${commonClasses} ${isOpen ? 'opacity-0' : ''}`}></span>
      <span className={`${commonClasses} ${isOpen ? '-rotate-45' : 'translate-y-1.5'}`}></span>
    </div>
  );
};

export default AnimatedHamburgerIcon;
