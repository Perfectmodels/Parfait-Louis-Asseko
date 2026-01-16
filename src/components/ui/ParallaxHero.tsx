import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxHeroProps {
    image: string;
    title: string;
    subtitle?: string;
    height?: string; // e.g., 'h-[60vh]' or 'h-screen'
    overlayOpacity?: number;
    children?: React.ReactNode;
}

const ParallaxHero: React.FC<ParallaxHeroProps> = ({
    image,
    title,
    subtitle,
    height = 'h-[70vh]',
    overlayOpacity = 0.5,
    children
}) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <div ref={ref} className={`relative ${height} flex flex-col items-center justify-center overflow-hidden w-full`}>
            <motion.div
                className="absolute inset-0 z-0 h-[120%]"
                style={{
                    y,
                    backgroundImage: `url('${image}')`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}
            />
            <div
                className="absolute inset-0 z-10 bg-black mix-blend-multiply"
                style={{ opacity: overlayOpacity }}
            />

            <motion.div
                className="relative z-20 container mx-auto px-6 text-center"
                style={{ opacity }}
            >
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-6 leading-tight"
                    style={{ textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}
                >
                    {title}
                </motion.h1>

                {subtitle && (
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl lg:text-2xl text-pm-off-white/90 max-w-3xl mx-auto font-light tracking-wide"
                    >
                        {subtitle}
                    </motion.p>
                )}

                {children && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="mt-8"
                    >
                        {children}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default ParallaxHero;
