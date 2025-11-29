import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    targetDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();
        let timeLeft: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    });

    const timerComponents: JSX.Element[] = [];

    Object.keys(timeLeft).forEach((interval) => {
        const value = timeLeft[interval as keyof TimeLeft];

        timerComponents.push(
            <div key={interval} className="flex flex-col items-center mx-4">
                <span className="text-4xl md:text-6xl font-playfair text-pm-gold font-bold">
                    {value < 10 ? `0${value}` : value}
                </span>
                <span className="text-sm uppercase tracking-widest text-pm-off-white/60 mt-2">
                    {interval === 'days' ? 'Jours' :
                        interval === 'hours' ? 'Heures' :
                            interval === 'minutes' ? 'Minutes' : 'Secondes'}
                </span>
            </div>
        );
    });

    return (
        <div className="flex justify-center flex-wrap gap-4 md:gap-8">
            {timerComponents.length ? timerComponents : <span className="text-2xl text-pm-gold">L'événement a commencé !</span>}
        </div>
    );
};

export default CountdownTimer;
