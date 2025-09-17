import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Hook pour détecter si un élément est visible
export const useScrollAnimation = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    threshold,
    once: true,
    margin: "-100px 0px"
  });

  return { ref, isInView };
};

// Composant pour les animations de parallax
export const ParallaxSection: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations d'apparition au scroll
export const ScrollReveal: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
}> = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  distance = 50,
  className = "" 
}) => {
  const { ref, isInView } = useScrollAnimation();

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ 
        opacity: 0, 
        ...directionMap[direction] 
      }}
      animate={isInView ? { 
        opacity: 1, 
        x: 0, 
        y: 0 
      } : { 
        opacity: 0, 
        ...directionMap[direction] 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations de scale au scroll
export const ScaleOnScroll: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.5, className = "" }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1 
      } : { 
        opacity: 0, 
        scale: 0.8 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations de rotation au scroll
export const RotateOnScroll: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  rotation?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.6, rotation = 10, className = "" }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, rotate: -rotation }}
      animate={isInView ? { 
        opacity: 1, 
        rotate: 0 
      } : { 
        opacity: 0, 
        rotate: -rotation 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations de stagger au scroll
export const StaggerOnScroll: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}> = ({ 
  children, 
  staggerDelay = 0.1, 
  direction = 'up',
  className = "" 
}) => {
  const { ref, isInView } = useScrollAnimation();

  const directionMap = {
    up: { y: 30, x: 0 },
    down: { y: -30, x: 0 },
    left: { x: 30, y: 0 },
    right: { x: -30, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { 
              opacity: 0, 
              ...directionMap[direction] 
            },
            visible: { 
              opacity: 1, 
              x: 0, 
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Composant pour les animations de texte au scroll
export const TextReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}> = ({ children, delay = 0, duration = 0.8, className = "" }) => {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0 
      } : { 
        opacity: 0, 
        y: 20 
      }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations de progress bar au scroll
export const ProgressOnScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={{ scaleX }}
        className="origin-left"
      >
        {children}
      </motion.div>
    </div>
  );
};

// Hook pour créer des animations personnalisées au scroll
export const useScrollProgress = (targetRef: React.RefObject<HTMLElement>) => {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  return scrollYProgress;
};

// Composant pour les animations de floating
export const FloatingElement: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}> = ({ children, intensity = 10, duration = 3, className = "" }) => {
  return (
    <motion.div
      animate={{
        y: [0, -intensity, 0],
        rotate: [0, 2, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Composant pour les animations de pulse
export const PulseElement: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  duration?: number;
  className?: string;
}> = ({ children, intensity = 1.05, duration = 2, className = "" }) => {
  return (
    <motion.div
      animate={{
        scale: [1, intensity, 1]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
