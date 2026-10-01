import React, { useState } from 'react';
import { I18nProvider } from './i18n';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { FreeAccessModal } from './components/FreeAccessModal';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { CertificateModal } from './components/CertificateModal';
import { ImportWizardModal } from './components/ImportWizardModal';

import { LandingPage } from './pages/LandingPage';
import { PublicShowcasePage } from './pages/PublicShowcasePage';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ResearchPublicationsPage } from './pages/ResearchPublicationsPage';
import { PatentsPage } from './pages/PatentsPage';
import { GrantsPage } from './pages/GrantsPage';
import { StartupsPage } from './pages/StartupsPage';
import { CompetitionsAwardsPage } from './pages/CompetitionsAwardsPage';
import { EventsPage } from './pages/EventsPage';
import { IndicatorEnginePage } from './pages/IndicatorEnginePage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { RecognitionPage } from './pages/RecognitionPage';
import { ReportsPage } from './pages/ReportsPage';
import { DataImportPage } from './pages/DataImportPage';
import { ProfilePage } from './pages/ProfilePage';
import { FeedbackPage } from './pages/FeedbackPage';
import { AdminSettingsPage } from './pages/AdminSettingsPage';

import { Menu, X, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isFreeAccessModalOpen, setIsFreeAccessModalOpen] = useState<boolean>(false);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  const { isLoggedIn, onboardingRequired } = useAuth();
  const { toastMessage } = useData();

  const handleEnterApp = (tab?: string) => {
    if (!isLoggedIn) {
      setIsFreeAccessModalOpen(true);
    } else {
      setActiveTab(tab || 'dashboard');
    }
  };

  const renderActivePage = () => {
    if (!isLoggedIn && activeTab !== 'landing' && activeTab !== 'publicShowcase') {
      return (
        <LandingPage 
          onEnterApp={handleEnterApp} 
          onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
          onOpenGoogleAuth={() => setIsFreeAccessModalOpen(true)}
        />
      );
    }

    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage 
            onEnterApp={handleEnterApp} 
            onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
            onOpenGoogleAuth={() => setIsFreeAccessModalOpen(true)}
          />
        );
      case 'publicShowcase':
        return <PublicShowcasePage />;
      case 'dashboard':
        return (
          <DashboardPage
            onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCertModal={() => setIsCertModalOpen(true)}
          />
        );
      case 'projects':
        return <ProjectsPage />;
      case 'publications':
        return <ResearchPublicationsPage />;
      case 'patents':
        return <PatentsPage />;
      case 'grants':
        return <GrantsPage />;
      case 'startups':
        return <StartupsPage />;
      case 'competitions':
        return <CompetitionsAwardsPage />;
      case 'events':
        return <EventsPage />;
      case 'indicators':
        return <IndicatorEnginePage />;
      case 'reviewQueue':
        return <ReviewQueuePage />;
      case 'recognition':
        return <RecognitionPage />;
      case 'reports':
        return <ReportsPage />;
      case 'import':
        return <DataImportPage />;
      case 'feedback':
        return <FeedbackPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <AdminSettingsPage />;
      default:
        return (
          <DashboardPage
            onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenCertModal={() => setIsCertModalOpen(true)}
          />
        );
    }
  };

  const isFullLayout = isLoggedIn && activeTab !== 'landing';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl border border-slate-700 max-w-md animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScoreBreakdown={() => setIsScoreModalOpen(true)}
        onOpenCertModal={() => setIsCertModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onOpenGoogleAuth={() => setIsFreeAccessModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Drawer Overlay (When on Landing Page / Not Logged In) */}
      {!isFullLayout && isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-64 bg-white border-r border-slate-200 p-4 space-y-4 flex flex-col justify-between z-10 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-extrabold text-slate-900 text-sm">Navigation Menu</span>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1.5 text-xs font-semibold">
                <button
                  onClick={() => { setActiveTab('landing'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                    activeTab === 'landing' 
                      ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Home / Overview
                </button>
                <button
                  onClick={() => { setActiveTab('publicShowcase'); setIsMobileMenuOpen(false); }}
                  className={`w-full text-left px-3 py-2 rounded-xl transition-colors ${
                    activeTab === 'publicShowcase' 
                      ? 'bg-emerald-50 text-emerald-900 font-bold border-l-4 border-emerald-600' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Public Innovation Showcase
                </button>
                <button
                  onClick={() => { setIsScoreModalOpen(true); setIsMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Score Calculation Breakdown
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => { setIsFreeAccessModalOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                Check College Performance Free
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout Area */}
      {!isFullLayout ? (
        <main className="flex-1">
          {renderActivePage()}
        </main>
      ) : (
        <div className="flex-1 flex">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpenMobile={isMobileMenuOpen}
            setIsOpenMobile={setIsMobileMenuOpen}
          />

          {/* Content Viewport Container */}
          <main className="flex-1 md:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between min-h-[calc(100vh-60px)]">
            <div>
              {renderActivePage()}
            </div>

            {/* In-app Institutional Footer */}
            <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="font-semibold text-slate-700">InnovateIQ</span>
                <span className="hidden sm:inline text-slate-300">·</span>
                <span>Developed by <strong className="text-teal-900 font-bold">Pradyuman Sharma</strong></span>
              </div>
              <div className="text-[11px] text-slate-400">
                © 2026 InnovateIQ. All rights reserved. | Ministry of AYUSH · Government of India
              </div>
            </footer>
          </main>
        </div>
      )}

      {/* Free Instant Access Selection Modal */}
      <FreeAccessModal
        isOpen={isFreeAccessModalOpen}
        onClose={() => setIsFreeAccessModalOpen(false)}
        onSuccess={() => setActiveTab('dashboard')}
      />

      {/* Onboarding Modal for First-time Sign-In */}
      <OnboardingModal 
        isOpen={onboardingRequired} 
      />

      {/* Modals */}
      <ScoreBreakdownModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />

      <CertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      <ImportWizardModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
