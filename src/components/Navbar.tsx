import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { useData } from '../context/DataContext';
import { GlobalSearchBar } from './GlobalSearchBar';
import { Bell, ChevronDown, Menu, X, LogIn, Building2 } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenScoreBreakdown: () => void;
  onOpenCertModal: () => void;
  onOpenImportModal: () => void;
  onOpenGoogleAuth: () => void;
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
}

export const Navbar: React.FC<Props> = ({ 
  activeTab, 
  setActiveTab,
  onOpenScoreBreakdown,
  onOpenCertModal,
  onOpenImportModal,
  onOpenGoogleAuth,
  onToggleMobileMenu,
  isMobileMenuOpen
}) => {
  const { isLoggedIn, currentUser, userRoles } = useAuth();
  const { language, setLanguage } = useTranslation();
  const { scoreBreakdown, setSearchQuery, showToast } = useData();

  const handleSearchNavigate = (tab: string, itemId?: string) => {
    setActiveTab(tab);
    if (itemId) {
      setSearchQuery('');
    }
  };

  const primaryRoleDisplay = currentUser.isPrivilegedAdmin ? 'SUPER_ADMIN' : (userRoles[0] || 'USER').toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2.5 shadow-2xs gap-4">
      
      {/* Zone 1: Brand Logo & Mobile Navigation Toggle (Left) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
            title="Toggle Mobile Navigation Menu"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}

        <button
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2 text-left group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-emerald-400 font-extrabold text-sm tracking-tight shadow-sm group-hover:bg-slate-800 transition-colors">
            <Building2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
              Innovate<span className="text-emerald-600">IQ</span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 -mt-1 hidden sm:block">
              Institutional Performance Portal
            </div>
          </div>
        </button>
      </div>

      {/* Zone 2: Global Search Bar (Center / Middle - Only Shown After Login) */}
      {isLoggedIn && (
        <div className="flex-1 max-w-xs sm:max-w-md md:max-w-lg mx-auto flex justify-center">
          <div className="w-full">
            <GlobalSearchBar onNavigate={handleSearchNavigate} />
          </div>
        </div>
      )}

      {/* Zone 3: Right Controls (Score + Language + Notifications + User Profile Badge) */}
      <div className="flex items-center gap-2.5 shrink-0">
        
        {/* Score Badge */}
        {isLoggedIn && (
          <button
            onClick={onOpenScoreBreakdown}
            className="hidden sm:flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-2xs"
            title="Click to view score calculation"
          >
            <span className="text-slate-500 font-normal">Score:</span>
            <span className="font-extrabold text-emerald-700 font-mono tabular-nums">{scoreBreakdown.overallScore.toFixed(1)}</span>
          </button>
        )}

        {/* Language Switcher */}
        <button 
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1 py-1 px-2 border border-slate-200 rounded-md text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span>{language.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </button>

        {/* Notifications Icon with Red Counter Badge */}
        {isLoggedIn && (
          <button 
            onClick={() => showToast('You have 3 unread institutional notifications.')}
            className="relative p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white shadow-2xs">
              3
            </span>
          </button>
        )}

        {/* Clean User Profile Badge (Right Side) */}
        {isLoggedIn ? (
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl p-1 pr-3 border border-slate-200/90 transition-all shadow-2xs group"
            title="View Profile & Settings"
          >
            <img
              src={currentUser.profilePhoto || 'https://lh3.googleusercontent.com/a/default-user'}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover border border-slate-300 shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col text-left">
              <span className="font-bold text-slate-900 text-[12px] leading-tight max-w-[110px] sm:max-w-[140px] truncate">
                {currentUser.name}
              </span>
              <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-md uppercase tracking-wider leading-none mt-0.5 inline-block w-fit">
                {primaryRoleDisplay}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={onOpenGoogleAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <LogIn className="h-3.5 w-3.5 text-emerald-400" />
            <span>Sign In</span>
          </button>
        )}

      </div>
    </header>
  );
};
