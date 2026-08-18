import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const CountdownTimer = ({
  expiresAt,
  onExpire,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
        if (onExpire) onExpire();
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isUrgent = totalSeconds < 1800; // < 30 minutes
  const isExpired = totalSeconds === 0;

  if (isExpired) {
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-mono font-medium text-slate-400 ${className}`}>
        <Clock className="w-3 h-3" />
        Expired
      </span>
    );
  }

  const pad = (n) => String(n).padStart(2, '0');
  const formatted =
    hours > 0
      ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
      : `${pad(minutes)}:${pad(seconds)}`;

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-semibold tracking-tight ${
        isUrgent
          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
          : 'bg-blue-50 text-blue-800 border border-blue-200'
      } ${className}`}
    >
      <Clock className="w-3 h-3 shrink-0" />
      <span>{formatted} left</span>
    </span>
  );
};
