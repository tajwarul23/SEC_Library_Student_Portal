import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { useAuth } from './Hooks/useAuth';
import { AuthScreen } from './ui/AuthScreen';
import { BridgeLoginForm } from './ui/BridgeLoginForm';
import toast from 'react-hot-toast';

export const AuthContainer = () => {
  const { user, checkRegNoMutation, googleAuthMutation, logoutMutation, passwordLoginMutation } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('step1'); // 'step1' | 'step2' | 'bridge_login'
  const [regNoInput, setRegNoInput] = useState('');
  const [verifiedStudent, setVerifiedStudent] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [errorType, setErrorType] = useState(null);

  const handleRegNoChange = (val) => {
    setRegNoInput(val);
    setErrorMessage(null);
    setErrorType(null);
  };

  const handleContinueStep1 = async () => {
    if (!regNoInput.trim()) return;
    setErrorMessage(null);
    setErrorType(null);

    try {
      const res = await checkRegNoMutation.mutateAsync(regNoInput.trim());
      setVerifiedStudent(res);
      setMode('step2');
    } catch (err) {
      const msg = err.extractedMessage || err.response?.data?.message || 'Registration number not recognized.';
      setErrorMessage(msg);
      setErrorType('not_found');
    }
  };

  const handleGoogleSignIn = async () => {
    if (!verifiedStudent) return;
    setErrorMessage(null);
    setErrorType(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const data = await googleAuthMutation.mutateAsync({
        regNo: verifiedStudent.regNo,
        idToken,
      });

      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/books');
    } catch (err) {
      if (err.code?.startsWith('auth/')) {
        // Firebase popup errors (closed by user, blocked, etc.) — not worth
        // surfacing as a hard error banner, just let them retry.
        if (err.code !== 'auth/popup-closed-by-user') {
          toast.error('Google sign-in failed. Please try again.');
        }
        return;
      }
      const msg = err.extractedMessage || err.response?.data?.message || 'Failed to authenticate with Google.';
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const handleReset = () => {
    setMode('step1');
    setRegNoInput('');
    setVerifiedStudent(null);
    setErrorMessage(null);
    setErrorType(null);
  };

  const handleQuickFill = (reg) => {
    setRegNoInput(reg);
    setErrorMessage(null);
    setErrorType(null);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast('Signed out successfully.');
      handleReset();
    } catch (err) {
      toast.error('Failed to log out.');
    }
  };

  // TEMPORARY BRIDGE LOGIN — see BridgeLoginForm.jsx.
  const handleBridgeLogin = async ({ regNo, password }) => {
    await passwordLoginMutation.mutateAsync({ regNo, password });
    toast.success('Signed in.');
    navigate('/books');
  };

  if (!user && mode === 'bridge_login') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-lg">
          <BridgeLoginForm
            isLoading={passwordLoginMutation.isPending}
            onSubmit={handleBridgeLogin}
            onBack={() => setMode('step1')}
          />
        </div>
      </div>
    );
  }

  return (
    <AuthScreen
      mode={mode}
      regNoInput={regNoInput}
      verifiedStudent={verifiedStudent}
      currentUser={user}
      errorMessage={errorMessage}
      errorType={errorType}
      isLoading={checkRegNoMutation.isPending || googleAuthMutation.isPending}
      onRegNoChange={handleRegNoChange}
      onContinueStep1={handleContinueStep1}
      onGoogleSignIn={handleGoogleSignIn}
      onSwitchMode={(m) => {
        setMode(m);
        setErrorMessage(null);
        setErrorType(null);
      }}
      onReset={handleReset}
      onQuickFillReg={handleQuickFill}
      onLogout={handleLogout}
      onNavigateToApp={() => navigate('/books')}
    />
  );
};
