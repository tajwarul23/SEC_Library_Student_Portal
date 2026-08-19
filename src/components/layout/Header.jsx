import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  CheckCheck,
  ChevronRight,
  ChevronDown,
  BookOpen,
  LogOut,
  LifeBuoy,
  Phone,
  Mail,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

const LIBRARY_ADMIN_PHONE = '+880-XXX-XXXXXX';
const LIBRARY_ADMIN_EMAIL = 'library@sec.edu.bd';

export const Header = ({
  user,
  unreadCount = 0,
  notifications = [],
  onNotificationRead,
  onMarkAllNotificationsRead,
  onToggleMobileMenu,
  onLogout,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const location = useLocation();

  const getBreadcrumbTitle = (path) => {
    switch (path) {
      case '/books':
        return 'Library Catalog';
      case '/reservations':
        return 'My Active Reservations';
      case '/waitlist':
        return 'My Queued Waitlists';
      case '/issued':
        return 'Circulation Ledger & Issued Books';
      case '/research':
        return 'Institutional Research Papers';
      default:
        return 'Library User Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 shadow-xs flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile menu toggle + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs sm:text-sm">
          <span className="hidden sm:inline text-slate-400 font-medium">
            Student Access Portal
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <span className="font-semibold text-[#1E3A8A] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {getBreadcrumbTitle(location.pathname)}
          </span>
        </div>
      </div>

      {/* Right: Actions, Notification Center, Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Library Admin Helpline */}
        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Contact library admin"
          title="Contact library admin"
        >
          <LifeBuoy className="w-4 h-4" />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold font-mono text-white shadow-2xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 uppercase font-mono">
                    System Alerts & Notices
                  </span>
                  {unreadCount > 0 && (
                    <Badge variant="danger">{unreadCount} Unread</Badge>
                  )}
                </div>
                {unreadCount > 0 && onMarkAllNotificationsRead && (
                  <button
                    type="button"
                    onClick={() => {
                      onMarkAllNotificationsRead();
                    }}
                    className="text-[11px] text-[#0EA5E9] hover:underline font-mono flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-mono">
                    No active notifications or alerts.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif._id}
                      onClick={() => {
                        if (!notif.read && onNotificationRead) {
                          onNotificationRead(notif._id);
                        }
                      }}
                      className={`p-3 text-xs transition-colors cursor-pointer ${
                        notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900 leading-tight">
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-[#0EA5E9] shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-normal">
                        {notif.message}
                      </p>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        {user && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold font-mono">
                {user.name?.charAt(0) || 'S'}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] font-mono text-slate-500">{user.regNo}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50">
                {/* Profile Summary Header */}
                <div className="px-4 py-2.5 border-b border-slate-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{user.name}</span>
                    <Badge department={user.department}>{user.department}</Badge>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500">Reg: {user.regNo}</div>
                  <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Session: {user.Session} • Gender: {user.gender}
                  </div>
                </div>

                {/* Fine Status Box */}
                <div className="p-3 bg-slate-50 mx-2 my-2 rounded border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-slate-600">Outstanding Fine:</span>
                    <span
                      className={`font-mono font-bold ${
                        user.fine > 0 ? 'text-red-600' : 'text-emerald-700'
                      }`}
                    >
                      ৳{user.fine}
                    </span>
                  </div>
                </div>

                {/* Logout */}
                {onLogout && (
                  <div className="px-2 pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2 px-2 py-2 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Library Admin Contact Modal */}
      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="Contact Library Admin"
        subtitle="Reach out for help with your account, fines, or borrowed books"
        maxWidth="sm"
      >
        <div className="space-y-3">
          <a
            href={`tel:${LIBRARY_ADMIN_PHONE}`}
            className="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Phone</div>
              <div className="text-sm font-semibold text-slate-900 font-mono">
                {LIBRARY_ADMIN_PHONE}
              </div>
            </div>
          </a>

          <a
            href={`mailto:${LIBRARY_ADMIN_EMAIL}`}
            className="flex items-center gap-3 p-3 rounded border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-blue-50 text-[#1E3A8A] flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Email</div>
              <div className="text-sm font-semibold text-slate-900">
                {LIBRARY_ADMIN_EMAIL}
              </div>
            </div>
          </a>
        </div>
      </Modal>
    </header>
  );
};
