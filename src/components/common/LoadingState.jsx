import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({
  message = 'Loading data...',
  description = 'Connecting to library database...',
  className = '',
}) => {
  return (
    <div className={`p-8 text-center bg-white border border-slate-200 rounded-lg shadow-2xs ${className}`}>
      <Loader2 className="w-6 h-6 text-[#1E3A8A] animate-spin mx-auto mb-3" />
      <p className="text-xs font-semibold text-slate-800 font-mono tracking-tight">{message}</p>
      {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
    </div>
  );
};
