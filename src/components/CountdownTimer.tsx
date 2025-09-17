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
  
  const timerComponents: JSX.Element[] = [];
  const frenchLabels: { [key: string]: string } = {
    days: 'Jours',
    hours: 'Heures',
    minutes: 'Minutes',
    seconds: 'Secondes',
  };

  Object.keys(frenchLabels).forEach((interval) => {
    const value = timeLeft[interval as keyof TimeLeft];
    if (value === undefined) return;

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center bg-black p-2 sm:p-4 w-16 sm:w-20 md:w-24 rounded-lg border border-pm-gold/20">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-pm-gold">{String(value).padStart(2, '0')}</span>
        <span className="text-xs uppercase tracking-wider text-pm-off-white/70 text-center leading-tight">{frenchLabels[interval]}</span>
      </div>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        <div className="flex justify-center gap-2 sm:gap-4 md:gap-8 flex-wrap">
          {timerComponents}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-playfair text-pm-gold">L'événement a commencé !</p>
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
