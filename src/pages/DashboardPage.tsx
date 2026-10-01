import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, Legend, LineChart, Line 
} from 'recharts';
import { 
  FolderGit2, BookOpen, Lightbulb, Landmark, Rocket, 
  Trophy, Calendar, ArrowUpRight, HelpCircle, AlertCircle, 
  CheckCircle2, Clock, Award, FileDown, FileText, Printer
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useTranslation } from '../i18n';
import { FilterBar } from '../components/FilterBar';
import { ExportService } from '../services/exportService';

interface Props {
  onOpenScoreBreakdown: () => void;
  onNavigate: (tab: string) => void;
  onOpenCertModal: () => void;
}

export const DashboardPage: React.FC<Props> = ({ onOpenScoreBreakdown, onNavigate, onOpenCertModal }) => {
  const { db, scoreBreakdown, selectedDepartmentId, showToast } = useData();
  const { t } = useTranslation();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleExportPdf = () => {
    setIsGeneratingPdf(true);
    try {
      ExportService.generateInstitutionPdfReport(
        'All India Institute of Ayurveda (AIIA), New Delhi',
        scoreBreakdown,
        db
      );
      showToast('Institutional Innovation PDF Scorecard downloaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PDF report. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Overview Counts (filtered by department if selected)
  const isDept = selectedDepartmentId !== 'all';
  const filterByDept = (items: any[]) => isDept ? items.filter(i => i.departmentId === selectedDepartmentId) : items;

  const projects = filterByDept(db.projects);
  const publications = filterByDept(db.publications);
  const patents = filterByDept(db.patents);
  const grants = filterByDept(db.grants);
  const startups = filterByDept(db.startups);
  const awards = filterByDept(db.awards);
  const competitions = filterByDept(db.competitions);
  const events = filterByDept(db.events);

  const totalGrantAmount = grants.reduce((sum, g) => sum + (g.amount || 0), 0);

  // Department Comparison Chart Data
  const deptChartData = db.departments.map(dept => {
    const deptProjects = db.projects.filter(p => p.departmentId === dept.id && p.verificationStatus === 'approved').length;
    const deptPubs = db.publications.filter(p => p.departmentId === dept.id && p.verificationStatus === 'approved').length;
    const deptPatents = db.patents.filter(p => p.departmentId === dept.id && p.verificationStatus === 'approved').length;
    return {
      name: dept.code,
      fullName: dept.name,
      Projects: deptProjects,
      Publications: deptPubs,
      Patents: deptPatents
    };
  });

  // Annual Trend Chart Data (2023 - 2026)
  const yearlyTrendData = [
    { year: '2023', Publications: 24, Patents: 6, Projects: 12, Score: 58.2 },
    { year: '2024', Publications: 38, Patents: 11, Projects: 18, Score: 71.4 },
    { year: '2025', Publications: 56, Patents: 19, Projects: 28, Score: 84.6 },
    { year: '2026 (Proj.)', Publications: 70, Patents: 26, Projects: 35, Score: 92.0 },
  ];

  // Target vs Actual Chart Data
  const targetVsActualChartData = scoreBreakdown.results.map(r => ({
    name: r.code.replace('IND_', ''),
    indicatorName: r.name,
    Target: r.target,
    Actual: r.actual,
    Gap: r.gap
  }));

  // Top Contributors
  const topStudent = { name: 'Aarav Patel', dept: 'AyurTech & Informatics', points: '142 pts', achievements: '1 Granted Patent · National Champion · 1 Startup' };
  const topFaculty = { name: 'Prof. Anand Chaudhary', dept: 'Rasashastra & Pharmaceutics', points: '210 pts', achievements: '3 Patents · 14 Publications · ₹145L Grant' };
  const topDept = { name: 'Rasashastra & Bhaishajya Kalpana', points: '89.4 / 100', achievements: 'Leading institutional nano-medicine research' };

  return (
    <div className="space-y-6">
      
      {/* Executive Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Executive Dashboard & Scorecard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time innovation indicator scorecard, departmental gap analytics, and ministerial compliance benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span>Full Reports</span>
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg transition-colors shadow-2xs disabled:opacity-50"
            title="Download official institutional innovation scorecard PDF"
          >
            <FileDown className="h-4 w-4" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Export to PDF'}</span>
          </button>
        </div>
      </div>

      {/* Top Banner / Filter Bar */}
      <FilterBar />

      {/* Primary Row: Score Banner & Top Metric Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Institutional Innovation Score Card */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white flex flex-col justify-between shadow-2xs">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-teal-800">Composite Index</span>
              <span>AY 2025–2026</span>
            </div>

            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
                {scoreBreakdown.overallScore.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              Official institutional innovation rating computed across {scoreBreakdown.totalIndicators} weighted indicators from verified institutional records.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={onOpenScoreBreakdown}
              className="flex items-center gap-1 text-xs font-semibold text-teal-800 hover:text-teal-950 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>{t('dashboard.scoreExplanation')}</span>
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors shadow-2xs"
              title="Download scorecard PDF"
            >
              <FileDown className="h-3.5 w-3.5 text-teal-700" />
              <span>PDF Scorecard</span>
            </button>
          </div>
        </div>

        {/* 6 Quick Stat Overview Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <div 
            onClick={() => onNavigate('projects')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t('dashboard.totalProjects')}</span>
              <FolderGit2 className="h-4 w-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{projects.length}</div>
            <div className="text-[11px] text-teal-800 mt-1 font-medium">
              {projects.filter(p => p.verificationStatus === 'approved').length} Verified
            </div>
          </div>

          <div 
            onClick={() => onNavigate('publications')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t('dashboard.totalPublications')}</span>
              <BookOpen className="h-4 w-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{publications.length}</div>
            <div className="text-[11px] text-teal-800 mt-1 font-medium">
              {publications.filter(p => p.indexing === 'SCI' || p.indexing === 'Scopus').length} SCI/Scopus
            </div>
          </div>

          <div 
            onClick={() => onNavigate('patents')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t('dashboard.totalPatents')}</span>
              <Lightbulb className="h-4 w-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{patents.length}</div>
            <div className="text-[11px] text-emerald-800 mt-1 font-medium">
              {patents.filter(p => p.status === 'Granted').length} Granted
            </div>
          </div>

          <div 
            onClick={() => onNavigate('grants')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Research Grants</span>
              <Landmark className="h-4 w-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">₹{totalGrantAmount.toFixed(1)} L</div>
            <div className="text-[11px] text-teal-800 mt-1 font-medium">
              {grants.length} Sanctioned
            </div>
          </div>

          <div 
            onClick={() => onNavigate('startups')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t('dashboard.totalStartups')}</span>
              <Rocket className="h-4 w-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{startups.length}</div>
            <div className="text-[11px] text-teal-800 mt-1 font-medium">
              ABIC Incubation
            </div>
          </div>

          <div 
            onClick={() => onNavigate('events')}
            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>{t('dashboard.totalEvents')}</span>
              <Calendar className="h-4 w-4 text-slate-400 group-hover:text-teal-700 transition-colors" />
            </div>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{events.length}</div>
            <div className="text-[11px] text-teal-800 mt-1 font-medium">
              {events.reduce((s, e) => s + e.participantsCount, 0)} Attendees
            </div>
          </div>

        </div>

      </div>

      {/* Target vs Actual Gap Analytics */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Target vs Actual Performance & Institutional Gaps</h3>
            <p className="text-xs text-slate-500">Benchmark actual verified achievements against ministerial annual targets</p>
          </div>
          <button
            onClick={() => onNavigate('indicators')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 self-start sm:self-auto"
          >
            Configure Targets & Weights <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Recharts Bar Chart: Target vs Actual */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={targetVsActualChartData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                labelFormatter={(val, payload) => payload?.[0]?.payload?.indicatorName || val}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Target" fill="#94A3B8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#0D9488" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Gap" fill="#F43F5E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Indicator Cards List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {scoreBreakdown.results.slice(0, 4).map(res => (
            <div key={res.indicatorId} className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-slate-700 truncate max-w-[130px]">{res.name}</span>
                <span className={`text-[10px] font-bold ${res.achievementPercentage >= 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {res.achievementPercentage}%
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs font-mono tabular-nums">
                <span className="text-slate-500">Actual: <strong className="text-slate-900">{res.actual}</strong></span>
                <span className="text-slate-400">Target: {res.target}</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${res.achievementPercentage >= 100 ? 'bg-emerald-600' : 'bg-teal-600'}`}
                  style={{ width: `${Math.min(res.achievementPercentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Analytics: Department Comparison & Annual Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Department Performance Bar Chart */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('dashboard.deptComparison')}</h3>
            <p className="text-xs text-slate-500">Comparative innovation volume across institutional departments</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }}
                  labelFormatter={(val, payload) => payload?.[0]?.payload?.fullName || val}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Projects" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Publications" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Patents" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Annual Growth Trend Line Chart */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('dashboard.yearlyTrends')}</h3>
            <p className="text-xs text-slate-500">Institutional innovation score progression over time</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="Score" stroke="#0D9488" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Publications" stroke="#6366F1" strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Projects" stroke="#F59E0B" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Top Contributors & Recognition Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Top Innovators Card */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{t('dashboard.topContributors')}</h3>
            <button 
              onClick={() => onNavigate('recognition')}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950"
            >
              Hall of Fame →
            </button>
          </div>

          <div className="space-y-3">
            {/* Student */}
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Top Student Innovator</span>
                <span className="font-mono font-bold text-slate-900">{topStudent.points}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{topStudent.name}</div>
              <div className="text-[11px] text-slate-500">{topStudent.dept}</div>
              <div className="text-[11px] text-teal-900 font-medium pt-0.5">{topStudent.achievements}</div>
            </div>

            {/* Faculty */}
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">Top Faculty Researcher</span>
                <span className="font-mono font-bold text-slate-900">{topFaculty.points}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{topFaculty.name}</div>
              <div className="text-[11px] text-slate-500">{topFaculty.dept}</div>
              <div className="text-[11px] text-indigo-900 font-medium pt-0.5">{topFaculty.achievements}</div>
            </div>

            {/* Department */}
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Leading Department</span>
                <span className="font-mono font-bold text-slate-900">{topDept.points}</span>
              </div>
              <div className="text-xs font-bold text-slate-900">{topDept.name}</div>
              <div className="text-[11px] text-slate-500">{topDept.achievements}</div>
            </div>
          </div>
        </div>

        {/* Recent Activity Audit Feed */}
        <div className="lg:col-span-2 p-5 rounded-xl border border-slate-200 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.recentActivity')}</h3>
              <p className="text-xs text-slate-500">Live feed of verified submissions and status changes</p>
            </div>
            <button
              onClick={onOpenCertModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
            >
              + Generate Certificate
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {db.auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      log.action === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      log.action === 'Created' ? 'bg-teal-100 text-teal-800' :
                      log.action === 'Updated' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900 truncate">{log.recordTitle}</span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    By <span className="font-medium text-slate-800">{log.changedByName}</span> ({log.changedByRole})
                    {log.reason && <span className="italic text-slate-500"> — "{log.reason}"</span>}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-mono shrink-0">
                  {new Date(log.changedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
