import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeLeft = (targetDate: string): Partial<TimeLeft> => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft: Partial<TimeLeft> = {};

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

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });
  
  const timerComponents: React.ReactElement[] = [];
  const frenchLabels: { [key: string]: string } = {
    days: 'j',
    hours: 'h',
    minutes: 'm',
    seconds: 's',
  };

  Object.keys(frenchLabels).forEach((interval) => {
    const value = timeLeft[interval as keyof TimeLeft];
    if (value === undefined) return;

    timerComponents.push(
      <div key={interval} className="flex items-baseline gap-1">
        <span className="text-2xl lg:text-3xl font-playfair font-black text-pm-gold tabular-nums leading-none">
            {String(value).padStart(2, '0')}
        </span>
        <span className="text-[8px] uppercase font-bold text-white/30">{frenchLabels[interval]}</span>
      </div>
    );
  });

  return (
    <div className="flex items-center justify-center">
      {timerComponents.length ? (
        <div className="flex items-center gap-6 lg:gap-8">
          {timerComponents}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-pm-gold">Événement en cours</p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;