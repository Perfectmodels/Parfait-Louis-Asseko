import React, { useRef } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';

interface FadeInProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    className?: string;
    viewportAmount?: number;
}

const FadeIn: React.FC<FadeInProps> = ({
    children,
    delay = 0,
    duration = 0.5,
    direction = 'up',
    className = '',
    viewportAmount = 0.2
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: viewportAmount });
    const controls = useAnimation();

    React.useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    const getHiddenVariant = (): Variant => {
        switch (direction) {
            case 'up': return { opacity: 0, y: 40 };
            case 'down': return { opacity: 0, y: -40 };
            case 'left': return { opacity: 0, x: 40 };
            case 'right': return { opacity: 0, x: -40 };
            case 'none': return { opacity: 0 };
            default: return { opacity: 0, y: 40 };
        }
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={{
                hidden: getHiddenVariant(),
                visible: { opacity: 1, y: 0, x: 0 },
            }}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
