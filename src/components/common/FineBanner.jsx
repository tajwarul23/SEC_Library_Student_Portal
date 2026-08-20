import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export const FineBanner = ({ fine }) => {
  const navigate = useNavigate();

  if (!fine || fine <= 0) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-amber-900 shadow-2xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="p-1 bg-amber-200/60 rounded text-amber-800 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </span>
          <span>
            <strong>Circulation Hold:</strong> Outstanding fine of{' '}
            <span className="font-bold text-amber-950 font-mono text-sm underline decoration-amber-400">
              ৳{fine}
            </span>{' '}
            — book reservations are temporarily restricted. Clear it online to restore access.
          </span>
        </div>

        <button
          type="button"
          onClick={() => navigate('/fine')}
          className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
        >
          <span>Pay Now</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
