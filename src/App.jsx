import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { useAuth } from './features/auth/Hooks/useAuth';
import { useNotifications, useNotificationActions } from './features/notifications/Hooks/useNotifications';
import { AuthContainer } from './features/auth/AuthContainer';
import { AppLayout } from './components/layout/AppLayout';
import { BrowseBooksContainer } from './features/books/BrowseBooksContainer';
import { ReservationsContainer } from './features/reservations/ReservationsContainer';
import { WaitlistContainer } from './features/waitlist/WaitlistContainer';
import { IssuedBooksContainer } from './features/issued/IssuedBooksContainer';
import { ResearchPapersContainer } from './features/research/ResearchPapersContainer';
import { LoadingState } from './components/common/LoadingState';

function AppContent() {
  const { user, isLoading, logoutMutation } = useAuth();
  const { data: notifData } = useNotifications({ enabled: Boolean(user) });
  const { markAsReadMutation, markAllReadMutation } = useNotificationActions();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <LoadingState
          message="Authenticating Session..."
          description="Connecting to institutional student registry."
          className="max-w-sm w-full"
        />
      </div>
    );
  }

  // If unauthenticated or no valid student session, render Step 1 / Step 2 login screen
  if (!user) {
    return <AuthContainer />;
  }

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast('You have been logged out.');
    } catch (err) {
      toast.error('Logout error.');
    }
  };

  const handleNotificationRead = async (id) => {
    try {
      await markAsReadMutation.mutateAsync(id);
    } catch (err) {
      toast.error('Failed to mark notification as read.');
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await markAllReadMutation.mutateAsync();
    } catch (err) {
      toast.error('Failed to mark all notifications as read.');
    }
  };

  return (
    <Routes>
      {/* Explicit Auth Routes */}
      <Route path="/login" element={<AuthContainer />} />

      {/* Main Application Layout */}
      {!user ? (
        <Route path="*" element={<AuthContainer />} />
      ) : (
        <Route
          element={
            <AppLayout
              user={user}
              unreadCount={notifData?.unreadCount || 0}
              notifications={notifData?.notifications || []}
              onNotificationRead={handleNotificationRead}
              onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
              onLogout={handleLogout}
            />
          }
        >
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BrowseBooksContainer />} />
          <Route path="/reservations" element={<ReservationsContainer />} />
          <Route path="/waitlist" element={<WaitlistContainer />} />
          <Route path="/issued" element={<IssuedBooksContainer />} />
          <Route path="/research" element={<ResearchPapersContainer />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Route>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            borderRadius: '0.5rem',
          },
        }}
      />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
