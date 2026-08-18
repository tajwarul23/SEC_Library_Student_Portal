import React from "react";
import {
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  LogOut,
  LayoutDashboard,
  Loader2,
} from "lucide-react";
import { Badge } from "../../../components/common/Badge";
import logo from "../../../assets/logo.png";

const primaryButtonClass =
  "w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors cursor-pointer";

const secondaryButtonClass =
  "w-full mt-2 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 font-medium text-sm rounded border border-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors cursor-pointer";

export const AuthScreen = ({
  mode,
  regNoInput,
  verifiedStudent,
  currentUser,
  errorMessage,
  errorType,
  isLoading,
  onRegNoChange,
  onContinueStep1,
  onGoogleSignIn,
  onSwitchMode,
  onReset,
  onQuickFillReg,
  onLogout,
  onNavigateToApp,
}) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        {/* SEC Institutional Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center border-b-2 border-amber-600">
          <img
            src={logo}
            alt="Sylhet Engineering College"
            className="mx-auto w-20 h-20 object-contain mb-3"
          />
          <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
            Student Portal
          </span>
          <h1 className="text-xl font-bold tracking-tight text-white font-serif">
            Sylhet Engineering College
          </h1>
          <p className="text-xs text-slate-300 tracking-wide mt-0.5 uppercase">
            Library Management System
          </p>
        </div>

        {/* If user is already authenticated */}
        {currentUser ? (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Welcome back
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                You're signed in to the student library portal.
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">
                    {currentUser.name}
                  </h3>
                  <Badge department={currentUser.department}>
                    {currentUser.department}
                  </Badge>
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Reg No:{" "}
                  <span className="font-semibold text-slate-900">
                    {currentUser.regNo}
                  </span>{" "}
                  • Session: {currentUser.Session}
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  {currentUser.email}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToApp}
              className={primaryButtonClass}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Library Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full mt-2 py-2.5 px-4 bg-white hover:bg-red-50 text-red-600 font-medium text-sm rounded border border-red-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Student Account</span>
            </button>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Student Authentication
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registration number, then continue with the Gmail
                account you used during registration.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Authentication Error</p>
                  <p className="mt-0.5 text-red-600">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Step 1: Enter Registration Number */}
            {mode === "step1" && (
              <div>
                <label
                  htmlFor="regNo"
                  className="block text-xs font-semibold text-slate-700 mb-1"
                >
                  Student Registration Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    id="regNo"
                    type="text"
                    autoComplete="off"
                    value={regNoInput}
                    onChange={(e) => onRegNoChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && regNoInput.trim()) {
                        onContinueStep1();
                      }
                    }}
                    placeholder="e.g. 2023331099"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-colors"
                  />
                </div>

                <button
                  type="button"
                  disabled={!regNoInput.trim() || isLoading}
                  onClick={onContinueStep1}
                  className={primaryButtonClass}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Step 2: Google Account Linking */}
            {mode === "step2" && verifiedStudent && (
              <div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded space-y-1 mb-5">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Student Record Verified
                    </span>
                    <Badge department={verifiedStudent.department}>
                      {verifiedStudent.department}
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-950 font-semibold">
                    {verifiedStudent.name}
                  </p>
                  <div className="text-xs text-emerald-800">
                    Reg:{" "}
                    <strong className="font-semibold">
                      {verifiedStudent.regNo}
                    </strong>{" "}
                    • Session: {verifiedStudent.Session}
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                  {verifiedStudent.claimed
                    ? "Sign In With Google"
                    : "Link Your Google Account"}
                </h2>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  {verifiedStudent.claimed
                    ? "Sign in with the Google account already linked to this registration number."
                    : "Authenticate with your Google account to securely link it to this registration number for borrowing and reservation access."}
                </p>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onGoogleSignIn}
                  className={secondaryButtonClass}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>
                    {verifiedStudent.claimed
                      ? "Sign In with Google"
                      : "Link & Sign In with Google"}
                  </span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            Sylhet Engineering College
          </p>
        </div>
      </div>
    </div>
  );
};
