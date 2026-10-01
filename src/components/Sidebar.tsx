import React, { useState } from 'react';
import { 
  LayoutDashboard, FolderGit2, Gauge, Trophy, FileText, 
  CheckSquare, Shield, Settings, HelpCircle, LogOut, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { useData } from '../context/DataContext';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab, isOpenMobile, setIsOpenMobile }) => {
  const { currentUser, isLoggedIn, userRoles, canVerify, canManageUsers, logout } = useAuth();
  const { t } = useTranslation();
  const { db, showToast } = useData();

  const [reportsExpanded, setReportsExpanded] = useState<boolean>(true);
  const [activeReportSubtab, setActiveReportSubtab] = useState<string>('inst_report');

  const primaryRoleDisplay = !isLoggedIn || currentUser.id === 'guest' 
    ? 'GUEST' 
    : (currentUser.isPrivilegedAdmin ? 'SUPER_ADMIN' : (userRoles[0] || currentUser.role || 'USER').toUpperCase());

  const instName = db.institutions.find(i => i.id === currentUser.institutionId)?.institutionName || 'InnovateIQ Portal';

  const pendingCount = 
    db.projects.filter(p => p.verificationStatus === 'submitted' || p.verificationStatus === 'under_review').length +
    db.publications.filter(p => p.verificationStatus === 'submitted' || p.verificationStatus === 'under_review').length +
    db.patents.filter(p => p.verificationStatus === 'submitted' || p.verificationStatus === 'under_review').length +
    db.grants.filter(p => p.verificationStatus === 'submitted' || p.verificationStatus === 'under_review').length;

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setIsOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    setActiveTab('landing');
    setIsOpenMobile(false);
    showToast('Logged out of institutional portal.');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          onClick={() => setIsOpenMobile(false)} 
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      <aside className={`
        fixed top-[57px] bottom-0 left-0 z-40 w-64 border-r border-slate-200 bg-white flex flex-col justify-between transition-transform duration-200
        md:translate-x-0 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* Top User Profile Box */}
          <div className="p-3 rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-emerald-50/40 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.profilePhoto || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt={currentUser.name}
                className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase tracking-wide ${
                  primaryRoleDisplay === 'GUEST'
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {primaryRoleDisplay}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {instName}
                </div>
              </div>
            </div>

            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Navigation Links List */}
          <nav className="space-y-1 text-xs font-semibold">
            
            {/* Dashboard */}
            <button
              onClick={() => handleSelect('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Dashboard</span>
            </button>

            {/* Innovation Projects */}
            <button
              onClick={() => handleSelect('projects')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'projects'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <FolderGit2 className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Innovation Projects</span>
            </button>

            {/* Indicator Engine */}
            <button
              onClick={() => handleSelect('indicators')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'indicators'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Gauge className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Indicator Engine</span>
            </button>

            {/* Hall of Fame */}
            <button
              onClick={() => handleSelect('recognition')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'recognition'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Trophy className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Hall of Fame</span>
            </button>

            {/* Reports (Accordion) */}
            <div>
              <button
                onClick={() => {
                  handleSelect('reports');
                  setReportsExpanded(!reportsExpanded);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'reports'
                    ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span>Reports</span>
                </div>
                {reportsExpanded ? (
                  <ChevronUp className="h-3.5 w-3.5 text-emerald-700" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                )}
              </button>

              {/* Submenu links */}
              {reportsExpanded && activeTab === 'reports' && (
                <div className="mt-1 ml-7 space-y-1 border-l-2 border-emerald-100 pl-3">
                  <button
                    onClick={() => setActiveReportSubtab('inst_report')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeReportSubtab === 'inst_report'
                        ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Institutional Report
                  </button>
                  <button
                    onClick={() => setActiveReportSubtab('dept_scorecard')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeReportSubtab === 'dept_scorecard'
                        ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Department Scorecard
                  </button>
                  <button
                    onClick={() => setActiveReportSubtab('indicator_audit')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeReportSubtab === 'indicator_audit'
                        ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Indicator Audit
                  </button>
                  <button
                    onClick={() => setActiveReportSubtab('custom_reports')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeReportSubtab === 'custom_reports'
                        ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Custom Reports
                  </button>
                  <button
                    onClick={() => setActiveReportSubtab('export_analytics')}
                    className={`w-full text-left py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                      activeReportSubtab === 'export_analytics'
                        ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Export & Analytics
                  </button>
                </div>
              )}
            </div>

            {/* Review & Verify */}
            {canVerify && (
              <button
                onClick={() => handleSelect('reviewQueue')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'reviewQueue'
                    ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-4 w-4 text-slate-500 shrink-0" />
                  <span>Review & Verify</span>
                </div>
                <span className="h-5 w-5 rounded-full bg-amber-400 text-amber-950 font-bold text-[10px] flex items-center justify-center shadow-2xs">
                  1
                </span>
              </button>
            )}

            {/* Administration */}
            {canManageUsers && (
              <button
                onClick={() => handleSelect('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                  activeTab === 'settings'
                    ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Shield className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Administration</span>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={() => handleSelect('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-emerald-50 text-emerald-900 font-bold border-r-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="h-4 w-4 text-slate-500 shrink-0" />
              <span>Settings</span>
            </button>

          </nav>
        </div>

        {/* Bottom Help Widget & Logout Button */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <HelpCircle className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Need Help?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Check documentation or contact support.
            </p>
            <button
              onClick={() => showToast('Opening help documentation & support center...')}
              className="w-full py-1 px-2.5 bg-white text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              Get Help →
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold transition-colors"
          >
            <LogOut className="h-4 w-4 text-rose-500 shrink-0" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>
    </>
  );
};
