import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FineBanner } from '../common/FineBanner';
import { ChatWidget } from '../../features/assistant/ui/ChatWidget';

export const AppLayout = ({
  user,
  unreadCount = 0,
  notifications = [],
  onNotificationRead,
  onMarkAllNotificationsRead,
  onLogout,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-800 selection:bg-sky-500 selection:text-white">
      {/* Sidebar fixed left */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area (offset by w-64 on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Header */}
        <Header
          user={user}
          unreadCount={unreadCount}
          notifications={notifications}
          onNotificationRead={onNotificationRead}
          onMarkAllNotificationsRead={onMarkAllNotificationsRead}
          onToggleMobileMenu={() => setIsMobileOpen(!isMobileOpen)}
          onLogout={onLogout}
        />

        {/* Global Persistent Fine Warning Banner */}
        <FineBanner
          fine={user?.fine}
         
        />

        {/* Dynamic Route Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
            <div className="text-center sm:text-left">
              <p className="font-semibold text-slate-700">Sylhet Engineering College</p>
              <p>Tilagarh, Sylhet-3100 — Library Management System</p>
            </div>
            <div className="text-center sm:text-right">
              <p>© {new Date().getFullYear()} All rights reserved.</p>
              <p>Need help? Visit the Library .</p>
            </div>
          </div>
        </footer>
      </div>

      <ChatWidget />
    </div>
  );
};
