import React from 'react';
import { LogIn } from 'lucide-react';
import { Button } from './Button';

// Replaces personal pages (reservations, fines, ...) while browsing as a
// guest: guests have no account, so there is nothing of theirs to show.
export const GuestSignInPrompt = ({ what, onSignIn }) => (
  <div className="max-w-md mx-auto mt-12 bg-white border border-slate-200 rounded-lg p-8 text-center shadow-2xs">
    <LogIn className="w-8 h-8 text-slate-400 mx-auto mb-3" />
    <h2 className="text-base font-bold text-slate-900">Sign in to see your {what}</h2>
    <p className="text-xs text-slate-500 mt-1">
      You're browsing as a guest. Sign in with your registration number and Google
      account to see your {what}.
    </p>
    <Button className="mt-5" onClick={onSignIn}>
      Sign in
    </Button>
  </div>
);
