import React from 'react';
import { Eye } from 'lucide-react';

// Shown across the top while browsing as a guest.
export const GuestBanner = ({ onSignIn }) => (
  <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-amber-900 shadow-2xs">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
      <span className="flex items-center gap-2 font-medium">
        <Eye className="w-4 h-4 text-amber-700 shrink-0" />
        You're viewing as a guest: read-only. Reserving, waitlists and submissions are disabled.
      </span>
      <button
        type="button"
        onClick={onSignIn}
        className="shrink-0 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
      >
        Sign in
      </button>
    </div>
  </div>
);
