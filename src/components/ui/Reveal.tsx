import React, { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
    className?: string; // To style the container
    blockColor?: string;
}

const Reveal: React.FC<RevealProps> = ({
    children,
    width = "fit-content",
    delay = 0.25,
    duration = 0.5,
    className = "",
    blockColor = "#D4AF37" // pm-gold
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const mainControls = useAnimation();
    const slideControls = useAnimation();

    useEffect(() => {
        if (isInView) {
            mainControls.start("visible");
            slideControls.start("visible");
        }
    }, [isInView, mainControls, slideControls]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }} className={className}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75 },
                    visible: { opacity: 1, y: 0 }
                }}
                initial="hidden"
                animate={mainControls}
                transition={{ duration, delay }}
            >
                {children}
            </motion.div>
            <motion.div
                variants={{
                    hidden: { left: 0 },
                    visible: { left: "100%" }
                }}
                initial="hidden"
                animate={slideControls}
                transition={{ duration: 0.5, ease: "easeIn", delay }}
                style={{
                    position: "absolute",
                    top: 4,
                    bottom: 4,
                    left: 0,
                    right: 0,
                    background: blockColor,
                    zIndex: 20
                }}
            />
        </div>
    );
};

export default Reveal;
