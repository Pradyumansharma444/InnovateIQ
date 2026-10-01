import React from 'react';
import { 
  ArrowRight, Lightbulb, BarChart3, Award, 
  FileCheck, Database, Building2, CheckCircle2, Search 
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { useData } from '../context/DataContext';

interface Props {
  onEnterApp: (tab?: string) => void;
  onOpenScoreBreakdown: () => void;
  onOpenGoogleAuth: () => void;
}

export const LandingPage: React.FC<Props> = ({ onEnterApp, onOpenScoreBreakdown, onOpenGoogleAuth }) => {
  const { t } = useTranslation();
  const { db, scoreBreakdown } = useData();

  const approvedProjects = db.projects.filter(p => p.verificationStatus === 'approved').length;
  const approvedPubs = db.publications.filter(p => p.verificationStatus === 'approved').length;
  const approvedPatents = db.patents.filter(p => p.verificationStatus === 'approved').length;
  const totalGrantLakhs = db.grants.reduce((s, g) => s + (g.amount || 0), 0);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      
      {/* Top Ministry Banner */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide">MINISTRY OF AYUSH · GOVERNMENT OF INDIA</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 font-medium">InnovateIQ — Innovation Excellence & Institutional Intelligence</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-400">
          <span>Smart Education & Innovation Tracking</span>
          <span>·</span>
          <span>Autonomous Institutional Evaluation</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto space-y-8 text-center">
          
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 text-balance max-w-4xl mx-auto leading-tight">
            Centralized Portal for Institutional Innovation Excellence Indicators
          </h1>

          <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Measuring and showcasing innovation excellence across educational and research institutes. Collect, verify, calculate weighted indicators, highlight top champions, and generate official institutional reports.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenGoogleAuth}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all shadow-lg shrink-0 group"
            >
              <Search className="h-4 w-4 shrink-0 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Check College Performance Free</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </button>

            <button
              onClick={() => onEnterApp('publicShowcase')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              View Public Innovation Showcase
            </button>
            <button
              onClick={onOpenScoreBreakdown}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-teal-200 bg-teal-50 text-teal-900 font-semibold text-xs hover:bg-teal-100 transition-colors"
            >
              How Score is Calculated? ({scoreBreakdown.overallScore.toFixed(1)}/100)
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{scoreBreakdown.overallScore.toFixed(1)}</div>
              <div className="text-xs text-slate-500 mt-0.5">Composite Innovation Score</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-teal-800 font-mono tabular-nums">{approvedProjects}</div>
              <div className="text-xs text-slate-500 mt-0.5">Verified Projects</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{approvedPatents}</div>
              <div className="text-xs text-slate-500 mt-0.5">Patents Filed & Granted</div>
            </div>
            <div className="p-3 text-center">
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">₹{totalGrantLakhs.toFixed(1)} L</div>
              <div className="text-xs text-slate-500 mt-0.5">Sanctioned Research Grants</div>
            </div>
          </div>

        </div>
      </section>

      {/* Complete Workflow Section */}
      <section className="py-14 px-6 sm:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700">Institutional Governance Architecture</h2>
            <h3 className="text-2xl font-bold text-slate-900">The End-to-End Innovation Governance Pipeline</h3>
            <p className="text-xs text-slate-500 max-w-xl mx-auto">
              From departmental records to ministerial analytics, eliminating data silos across colleges and universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 text-teal-800 font-bold text-xs">
                1
              </div>
              <h4 className="text-sm font-bold text-slate-900">1. Data Ingestion & Integration</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Manual forms, spreadsheet CSV/Excel wizard with column mapping, and mock REST connectors to university RMS.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs">
                2
              </div>
              <h4 className="text-sm font-bold text-slate-900">2. Review & Document Verification</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Peer verification officers audit filings, examine DOIs and patent filings, and approve or request corrections.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800 font-bold text-xs">
                3
              </div>
              <h4 className="text-sm font-bold text-slate-900">3. Configurable Indicator Engine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent multi-indicator formula: weights, targets, and achievement ratios compute institutional composite scores.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                4
              </div>
              <h4 className="text-sm font-bold text-slate-900">4. Recognition, Reports & Feedback</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digital PDF certificates, institutional reports, department leaderboards, and continuous stakeholder feedback.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-14 px-6 sm:px-12 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Key Capabilities of the Portal</h3>
            <p className="text-xs text-slate-500">Built specifically for the Ministry of AYUSH and Smart Education</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <Lightbulb className="h-5 w-5 text-teal-700" />
              <h4 className="text-xs font-bold text-slate-900">8 Connected Innovation Modules</h4>
              <p className="text-xs text-slate-600">
                Covers Projects, Publications, Patents, Grants, Startups, Competitions, Awards, and Innovation Events.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <BarChart3 className="h-5 w-5 text-teal-700" />
              <h4 className="text-xs font-bold text-slate-900">Target vs Actual Gap Analytics</h4>
              <p className="text-xs text-slate-600">
                Identify institutional bottlenecks and compare departmental performance with live interactive charts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <Award className="h-5 w-5 text-teal-700" />
              <h4 className="text-xs font-bold text-slate-900">Digital Certificate Generation</h4>
              <p className="text-xs text-slate-600">
                Generate downloadable PDF certificates with verification IDs and official authorized signatures.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <FileCheck className="h-5 w-5 text-teal-700" />
              <h4 className="text-xs font-bold text-slate-900">Data Lineage & Audit History</h4>
              <p className="text-xs text-slate-600">
                Every record edit, approval, or rejection maintains a permanent audit trail with old vs new diffs.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 py-8 px-6 sm:px-12 bg-white text-xs text-slate-500">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-sm">InnovateIQ</span>
                <span className="text-slate-300">|</span>
                <span className="font-semibold text-slate-700">Platform for Innovation Excellence Indicators</span>
              </div>
              <div className="text-[12px] text-slate-500 mt-0.5">Ministry of AYUSH · Institutional Innovation Ecosystem</div>
              <div className="text-[12px] text-teal-800 font-semibold mt-1.5 flex items-center gap-1.5">
                <span>Developed by</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-900 font-bold border border-teal-200">
                  Pradyuman Sharma
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
              <button onClick={() => onEnterApp('dashboard')} className="hover:text-slate-900 transition-colors">Dashboard</button>
              <button onClick={() => onEnterApp('publicShowcase')} className="hover:text-slate-900 transition-colors">Public Showcase</button>
              <button onClick={() => onEnterApp('reports')} className="hover:text-slate-900 transition-colors">Reports</button>
              <button onClick={() => onEnterApp('indicators')} className="hover:text-slate-900 transition-colors">Indicator Engine</button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div>
              © 2026 InnovateIQ. All rights reserved. Developed by Pradyuman Sharma for Ministry of AYUSH, Government of India.
            </div>
            <div className="flex items-center gap-4">
              <span className="hover:text-slate-600 transition-colors">Privacy Policy</span>
              <span>·</span>
              <span className="hover:text-slate-600 transition-colors">Terms of Service</span>
              <span>·</span>
              <span className="hover:text-slate-600 transition-colors">Institutional Security & Compliance</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
