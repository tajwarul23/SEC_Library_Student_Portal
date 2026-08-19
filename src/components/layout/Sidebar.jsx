import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  BookmarkCheck,
  ListOrdered,
  BookMarked,
  FileText,
  LogOut,
  Bot,
} from 'lucide-react';
import { Badge } from '../common/Badge';
import logo from '../../assets/logo.png';

export const Sidebar = ({
  user,
  onLogout,
  isMobileOpen,
  onCloseMobile,
  isChatOpen,
  onToggleChat,
}) => {
  const navSections = [
    {
      title: 'CATALOG & DISCOVERY',
      items: [
        {
          to: '/books',
          label: 'Browse Catalog',
          icon: BookOpen,
        },
        {
          to: '/research',
          label: 'Research Papers',
          icon: FileText,
        },
      ],
    },
    {
      title: 'MY CIRCULATION & HOLDS',
      items: [
        {
          to: '/reservations',
          label: 'My Reservations',
          icon: BookmarkCheck,
        },
        {
          to: '/waitlist',
          label: 'My Waitlist',
          icon: ListOrdered,
        },
        {
          to: '/issued',
          label: 'My Issued Books',
          icon: BookMarked,
        },
      ],
    },
  ];
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-2xs"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar fixed left */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#1E293B] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header Strip */}
        <div >
          <div onClick={()=>navigate("/books")}   className="h-16 px-5 flex items-center gap-3 border-b border-slate-700/60 bg-[#16202e] cursor-pointer" >
            <img src={logo} alt="SEC Library" className="w-9 h-9 object-contain shrink-0" />
            <div >
              <h1 className="text-white font-bold text-base leading-tight">
                SEC Library
              </h1>
              <span className="text-slate-400 text-[10px] font-mono font-medium uppercase tracking-wider block mt-0.5">
                Student Portal
              </span>
            </div>
          </div>

        

          {/* Navigation Groups */}
          <nav className="p-3 space-y-4 overflow-y-auto">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1">
                <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  {sec.title}
                </div>

                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded text-xs transition-all ${
                            isActive
                              ? 'bg-[#0EA5E9]/10 text-[#38BDF8] border-r-4 border-[#0EA5E9] font-medium'
                              : 'text-slate-300 hover:bg-slate-750 hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Pinned Bottom Strip */}
        <div className="p-3 bg-[#152031] border-t border-slate-700/60 space-y-2">
          <button
            type="button"
            onClick={onToggleChat}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all cursor-pointer ring-1 ${
              isChatOpen
                ? 'bg-linear-to-r from-[#0EA5E9]/15 to-[#818CF8]/15 ring-[#0EA5E9]/50'
                : 'bg-slate-800/60 hover:bg-linear-to-r hover:from-[#0EA5E9]/10 hover:to-[#818CF8]/10 ring-slate-700/80 hover:ring-[#0EA5E9]/30'
            }`}
          >
            <span className="relative shrink-0 w-8 h-8 rounded-full bg-linear-to-br from-[#0EA5E9] to-[#818CF8] flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Bot className="w-4 h-4 text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#152031]" />
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`block text-xs font-semibold leading-tight ${
                  isChatOpen ? 'text-[#38BDF8]' : 'text-white'
                }`}
              >
                Library Assistant
              </span>
              <span className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider mt-0.5">
                AI-Powered Chat
              </span>
            </span>
          </button>

         
        </div>
      </aside>
    </>
  );
};
