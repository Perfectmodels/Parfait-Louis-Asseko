import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ReadingProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <motion.div
        className="h-full bg-pm-gold shadow-[0_0_10px_#D4AF37]"
        style={{ scaleX, transformOrigin: "0%" }}
      />
    </div>
  );
};

export default ReadingProgress;
