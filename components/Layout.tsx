
import React from 'react';
import { Home, Briefcase, MessageSquare, User } from 'lucide-react';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  title: string;
  currentUser?: UserProfile;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, title, currentUser }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: '概览' },
    { id: 'projects', icon: Briefcase, label: '项目' },
    { id: 'feedback', icon: MessageSquare, label: '反馈' },
    { id: 'profile', icon: User, label: '我的' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-200">
      {/* Header - Updated to Dark Slate Gradient */}
      <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sticky top-0 z-20 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-lg font-bold tracking-wide flex items-center gap-2">
            <span className="w-1 h-4 bg-teal-400 rounded-full inline-block"></span>
            {title}
          </h1>
        </div>
        <div 
          onClick={() => onTabChange('profile')}
          className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold border border-slate-600 text-teal-400 cursor-pointer hover:bg-slate-600 transition-colors"
        >
          {currentUser ? currentUser.initials : 'User'}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth bg-slate-50/50">
        {children}
      </main>

      {/* Bottom Navigation - Updated with Teal Accents */}
      <nav className="bg-white/95 backdrop-blur-sm border-t border-slate-200 fixed bottom-0 w-full max-w-md z-30 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                  isActive ? 'text-teal-700 scale-105' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-sm" : ""} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-teal-800' : 'text-slate-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
