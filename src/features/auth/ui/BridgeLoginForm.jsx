import React, { useState } from 'react';
import { KeyRound, RotateCcw, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/common/Button';

// TEMPORARY BRIDGE LOGIN
// Real Google/Firebase sign-in isn't built yet, so this form logs in the
// old-fashioned way (regNo + password) directly against the real backend's
// POST /api/user/login, purely so the rest of the portal can be wired and
// manually tested against real data in the meantime.
// Delete this file + the "bridge_login" mode in AuthContainer/AuthScreen
// once real Google sign-in replaces it.
export const BridgeLoginForm = ({ isLoading, onSubmit, onBack }) => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!regNo.trim() || !password) return;
    setErrorMessage(null);
    try {
      await onSubmit({ regNo: regNo.trim(), password });
    } catch (err) {
      setErrorMessage(err.extractedMessage || err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="mt-8 bg-white shadow-2xl rounded-xl border border-slate-200 text-slate-800 overflow-hidden">
      <div className="p-6 sm:p-8 space-y-4">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
          Temporary developer login — bypasses the Google sign-in flow to test the
          portal with a real backend account (regNo + password) while Firebase
          sign-in isn't wired up yet.
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="bridgeRegNo"
              className="block text-xs font-bold uppercase font-mono text-slate-700 tracking-wider"
            >
              Registration No.
            </label>
            <input
              id="bridgeRegNo"
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder="e.g. 2021331045"
              className="mt-1.5 block w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="bridgePassword"
              className="block text-xs font-bold uppercase font-mono text-slate-700 tracking-wider"
            >
              Password
            </label>
            <div className="mt-1.5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                id="bridgePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            type="submit"
            size="md"
            variant="primary"
            className="w-full justify-center"
            isLoading={isLoading}
            disabled={!regNo.trim() || !password}
          >
            Log In
          </Button>
        </form>

        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-slate-800 font-mono inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Back to Google sign-in flow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
