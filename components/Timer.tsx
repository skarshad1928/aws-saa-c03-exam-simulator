
import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ initialMinutes, onTimeUp }) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onTimeUp]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLow = secondsRemaining < 300; // 5 mins

  return (
    <div className={`font-mono text-xl font-bold px-4 py-2 rounded border-2 ${isLow ? 'text-red-600 border-red-600 animate-pulse' : 'text-slate-700 border-slate-300'}`}>
      Time Remaining: {formatTime(secondsRemaining)}
    </div>
  );
};

export default Timer;
