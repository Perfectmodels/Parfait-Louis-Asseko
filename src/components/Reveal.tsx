import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'scale';

interface RevealProps {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  direction?: RevealDirection;
  delayMs?: number;
  threshold?: number;
  once?: boolean;
}

const directionClassMap: Record<RevealDirection, string> = {
  up: 'reveal reveal-up',
  down: 'reveal reveal-down',
  left: 'reveal reveal-left',
  right: 'reveal reveal-right',
  scale: 'reveal reveal-scale',
};

const Reveal: React.FC<RevealProps> = ({
  as: Component = 'div',
  children,
  className = '',
  direction = 'up',
  delayMs = 0,
  threshold = 0.2,
  once = true,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const element = ref.current as HTMLElement | null;
    if (!element) return;

    const handleIntersection: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const timeout = setTimeout(() => {
            element.classList.add('show');
            setHasShown(true);
          }, delayMs);

          if (once) {
            observer.unobserve(entry.target);
          }

          return () => clearTimeout(timeout);
        } else if (!once) {
          element.classList.remove('show');
          setHasShown(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [delayMs, threshold, once]);

  return (
    <Component ref={ref as any} className={`${directionClassMap[direction]} ${className} ${hasShown ? 'show' : ''}`}>
      {children}
    </Component>
  );
};

export default Reveal;
