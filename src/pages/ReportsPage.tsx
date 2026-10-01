import React, { useState } from 'react';
import { 
  FileText, Download, Printer, FileSpreadsheet, Trophy, 
  Search, Filter, ArrowUpRight, CheckCircle2, ChevronDown, 
  Calendar, Layers, BookOpen, Lightbulb, Landmark, Rocket, Award 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ExportService } from '../services/exportService';

export const ReportsPage: React.FC = () => {
  const { db, scoreBreakdown, selectedYear } = useData();
  const [reportSubTab, setReportSubTab] = useState<'comprehensive' | 'department' | 'indicators'>('comprehensive');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDownloadPdf = () => {
    ExportService.generateInstitutionPdfReport(
      'All India Institute of Ayurveda (AIIA), New Delhi',
      scoreBreakdown,
      db
    );
  };

  const handleExportFullCsv = () => {
    ExportService.exportToCsv(
      scoreBreakdown.results.map(r => ({
        Code: r.code,
        IndicatorName: r.name,
        Category: r.category,
        Weight_Percent: r.weight,
        Target: r.target,
        Verified_Actual: r.actual,
        Achievement_Percent: r.achievementPercentage,
        Weighted_Score: r.weightedScore,
        Gap: r.gap,
        Status: r.status
      })),
      `AYUSH_Innovation_Indicators_Report_${selectedYear}`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // Sparkline bar helper component
  const MiniSparkline = ({ color = 'emerald' }: { color?: string }) => {
    const colorClasses = {
      emerald: 'bg-emerald-500',
      blue: 'bg-blue-500',
      amber: 'bg-amber-500',
      indigo: 'bg-indigo-500',
      rose: 'bg-rose-500',
      purple: 'bg-purple-500'
    }[color] || 'bg-emerald-500';

    return (
      <div className="flex items-end gap-0.5 h-4 shrink-0">
        <div className={`w-1 h-1.5 rounded-2xs ${colorClasses} opacity-40`} />
        <div className={`w-1 h-2.5 rounded-2xs ${colorClasses} opacity-60`} />
        <div className={`w-1 h-2 rounded-2xs ${colorClasses} opacity-50`} />
        <div className={`w-1 h-3.5 rounded-2xs ${colorClasses} opacity-80`} />
        <div className={`w-1 h-4 rounded-2xs ${colorClasses}`} />
      </div>
    );
  };

  // Filter table results based on search & status filter
  const tableData = [
    {
      id: 1,
      code: 'IND_PUB_01',
      name: 'Peer-Reviewed Research Publications (SCI/Scopus)',
      description: 'Research publications in Indexed journals',
      weight: 15,
      target: 50,
      actual: 3,
      achievement: 6,
      scorePoints: 0.9,
      status: 'Lagging',
      trendColor: 'rose'
    },
    {
      id: 2,
      code: 'IND_PAT_01',
      name: 'Patents Filed & Published',
      description: 'IPR filings and publications',
      weight: 15,
      target: 20,
      actual: 3,
      achievement: 15,
      scorePoints: 2.3,
      status: 'Lagging',
      trendColor: 'rose'
    },
    {
      id: 3,
      code: 'IND_PAT_02',
      name: 'Patents Granted & Commercialized',
      description: 'Granted patents and technology commercialization',
      weight: 10,
      target: 5,
      actual: 1,
      achievement: 20,
      scorePoints: 2.0,
      status: 'Lagging',
      trendColor: 'rose'
    },
    {
      id: 4,
      code: 'IND_GRT_01',
      name: 'Extramural Research Grants Sanctioned (₹ Lakhs)',
      description: 'Research grants from external agencies',
      weight: 15,
      target: 250,
      actual: 291.5,
      achievement: 100,
      scorePoints: 15.0,
      status: 'Exceeded',
      trendColor: 'emerald'
    },
    {
      id: 5,
      code: 'IND_STP_01',
      name: 'Startups & Spin-offs Incubated',
      description: 'Startups supported through incubation',
      weight: 15,
      target: 10,
      actual: 2,
      achievement: 20,
      scorePoints: 3.0,
      status: 'Lagging',
      trendColor: 'rose'
    },
    {
      id: 6,
      code: 'IND_CMP_01',
      name: 'Student & Faculty Competitions',
      description: 'Participation and awards in innovation competitions',
      weight: 10,
      target: 30,
      actual: 8,
      achievement: 27,
      scorePoints: 2.7,
      status: 'Lagging',
      trendColor: 'rose'
    }
  ];

  const filteredRows = tableData.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span>Reports</span>
        <span>›</span>
        <span className="text-slate-700 font-semibold">Institutional Report</span>
      </div>

      {/* Main Page Title Header & Emblem */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Institutional Reports & Regulatory Dossiers
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Downloadable official audit briefs, ministerial accreditation portfolios, and departmental scorecards.
          </p>
        </div>

        {/* Ministry Emblem Badge */}
        <div className="flex items-center gap-3 p-2.5 rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50 shadow-2xs shrink-0">
          <div className="h-9 w-9 rounded-lg bg-amber-600/10 flex items-center justify-center border border-amber-300">
            <svg className="h-6 w-6 text-amber-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-amber-900">
              MINISTRY OF AYUSH
            </div>
            <div className="text-[11px] font-black tracking-tight text-slate-900">
              GOVERNMENT OF INDIA
            </div>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation Bar & Download Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
          <button
            onClick={() => setReportSubTab('comprehensive')}
            className={`py-2 border-b-2 transition-all ${
              reportSubTab === 'comprehensive'
                ? 'border-emerald-600 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Comprehensive Institutional Report
          </button>

          <button
            onClick={() => setReportSubTab('department')}
            className={`py-2 border-b-2 transition-all ${
              reportSubTab === 'department'
                ? 'border-emerald-600 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Department Performance Scorecard
          </button>

          <button
            onClick={() => setReportSubTab('indicators')}
            className={`py-2 border-b-2 transition-all ${
              reportSubTab === 'indicators'
                ? 'border-emerald-600 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Indicator Summary & Target Audit
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Year Picker Dropdown */}
          <div className="relative">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>AY 2025-2026</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportFullCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Indicators CSV</span>
          </button>

          {/* Download Official PDF */}
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Official PDF</span>
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="h-3.5 w-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Card: Annual Institutional Innovation Excellence Report */}
      <div className="relative rounded-2xl border border-slate-200/80 bg-gradient-to-r from-emerald-50/40 via-white to-teal-50/30 p-6 shadow-sm overflow-hidden space-y-6">
        
        {/* Background Architectural Watermark Image */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-15 pointer-events-none bg-cover bg-right bg-no-repeat rounded-r-2xl"
             style={{ backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80')` }}
        />

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          {/* Left Title & Subtext */}
          <div className="space-y-1.5 max-w-xl">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-900">
              MINISTRY OF AYUSH · GOVERNMENT OF INDIA
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              ANNUAL INSTITUTIONAL INNOVATION EXCELLENCE REPORT
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              All India Institute of Ayurveda (AIIA), New Delhi
            </p>
            <div className="text-[11px] text-slate-400 font-mono pt-0.5">
              Reporting Period: AY 2025-2026
            </div>
          </div>

          {/* Center Trophy Score Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-200 bg-white/90 shadow-md backdrop-blur-xs shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Trophy className="h-6 w-6" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500">Overall Innovation Index</div>
              <div className="text-3xl font-black text-emerald-700 font-mono tracking-tight tabular-nums">
                28.2 <span className="text-sm font-normal text-slate-400">/ 100</span>
              </div>
              <div className="mt-1 px-2.5 py-0.5 rounded-md bg-emerald-100/80 text-emerald-900 text-[10px] font-bold inline-block">
                Grade: Outstanding · Institutional Innovation Ecosystem (Tier-1 Apex)
              </div>
            </div>
          </div>

          {/* Right Meta Info Box */}
          <div className="xl:border-l xl:border-slate-200/80 xl:pl-6 space-y-2 text-xs font-medium text-slate-600 shrink-0">
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Total Active Indicators</span>
              <strong className="font-mono text-slate-900">8</strong>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Approved Contributions</span>
              <strong className="font-mono text-slate-900">19</strong>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Generated On</span>
              <span className="font-mono text-slate-900 font-bold">9/30/2026</span>
            </div>
            <div className="flex items-center justify-between gap-6">
              <span className="text-slate-500">Data Status</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Up to Date
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* 6 Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Projects */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
            <MiniSparkline color="emerald" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">Projects</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">42</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 18%</div>
          </div>
        </div>

        {/* Publications */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <BookOpen className="h-4 w-4" />
            </div>
            <MiniSparkline color="blue" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">Publications</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">126</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 12%</div>
          </div>
        </div>

        {/* Patents */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lightbulb className="h-4 w-4" />
            </div>
            <MiniSparkline color="amber" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">Patents</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">18</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 50%</div>
          </div>
        </div>

        {/* Grants */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Landmark className="h-4 w-4" />
            </div>
            <MiniSparkline color="purple" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">Grants (₹ Lakhs)</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">291.5</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 100%</div>
          </div>
        </div>

        {/* Startups */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Rocket className="h-4 w-4" />
            </div>
            <MiniSparkline color="indigo" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">Startups</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">6</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 20%</div>
          </div>
        </div>

        {/* Awards */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
            <MiniSparkline color="rose" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500">Awards</div>
            <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">24</div>
            <div className="text-[10px] font-bold text-emerald-600 mt-0.5">↑ 33%</div>
          </div>
        </div>

      </div>

      {/* Section 1: Indicator Evaluation & Target Achievement Audit Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-2xs overflow-hidden space-y-4">
        
        {/* Table Header Bar with Search & Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
            1. INDICATOR EVALUATION & TARGET ACHIEVEMENT AUDIT
          </h3>

          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search Indicators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-44"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Status</option>
                <option value="exceeded">Exceeded</option>
                <option value="lagging">Lagging</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 w-10">#</th>
                <th className="py-3 px-4">Indicator Code</th>
                <th className="py-3 px-4">Indicator & Description</th>
                <th className="py-3 px-4 text-center">Weight</th>
                <th className="py-3 px-4 text-center">Target</th>
                <th className="py-3 px-4 text-center">Verified Actual</th>
                <th className="py-3 px-4">Achievement</th>
                <th className="py-3 px-4 text-center">Score Points</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Trend</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredRows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{row.id}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{row.code}</td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-slate-900">{row.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{row.description}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">{row.weight}%</td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">{row.target}</td>
                  <td className="py-3 px-4 text-center font-mono font-extrabold text-slate-900">{row.actual}</td>
                  
                  {/* Progress Bar Achievement */}
                  <td className="py-3 px-4 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] w-8">{row.achievement}%</span>
                      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${row.status === 'Exceeded' ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                          style={{ width: `${Math.min(row.achievement, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-center font-mono font-black text-slate-900">{row.scorePoints.toFixed(1)}</td>
                  
                  {/* Status Badge */}
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1 ${
                      row.status === 'Exceeded' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}>
                      {row.status === 'Exceeded' ? '✓ Exceeded' : '🕒 Lagging'}
                    </span>
                  </td>

                  {/* Trend Sparkline */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center">
                      <MiniSparkline color={row.trendColor} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
