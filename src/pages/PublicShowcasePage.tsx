import React, { useState } from 'react';
import { Search, Globe2, Lightbulb, Rocket, Award, ExternalLink, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

export const PublicShowcasePage: React.FC = () => {
  const { db } = useData();
  const [filterType, setFilterType] = useState<'all' | 'project' | 'patent' | 'startup' | 'award'>('all');
  const [query, setQuery] = useState('');

  // Collect ONLY verified approved records
  const approvedProjects = db.projects
    .filter(p => p.verificationStatus === 'approved')
    .map(p => ({
      id: p.id,
      type: 'project' as const,
      title: p.title,
      department: p.departmentName,
      lead: p.createdByName,
      summary: p.description,
      extra: p.category,
      metric: `Funding: ₹${(p.funding / 100000).toFixed(1)} L`
    }));

  const approvedPatents = db.patents
    .filter(p => p.verificationStatus === 'approved')
    .map(p => ({
      id: p.id,
      type: 'patent' as const,
      title: p.title,
      department: p.departmentName,
      lead: p.inventors.join(', '),
      summary: `Patent Status: ${p.status}. ${p.patentNumber ? `Patent No: ${p.patentNumber}` : `App No: ${p.applicationNumber}`}`,
      extra: p.category,
      metric: p.status
    }));

  const approvedStartups = db.startups
    .filter(s => s.verificationStatus === 'approved')
    .map(s => ({
      id: s.id,
      type: 'startup' as const,
      title: s.startupName,
      department: s.departmentName,
      lead: s.founders.join(', '),
      summary: s.achievement,
      extra: s.industry,
      metric: `Incubator: ${s.incubator}`
    }));

  const approvedAwards = db.awards
    .filter(a => a.verificationStatus === 'approved')
    .map(a => ({
      id: a.id,
      type: 'award' as const,
      title: a.title,
      department: a.departmentName,
      lead: a.recipient,
      summary: a.description,
      extra: a.organization,
      metric: a.awardLevel
    }));

  const allItems = [...approvedProjects, ...approvedPatents, ...approvedStartups, ...approvedAwards];

  const filtered = allItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.department.toLowerCase().includes(query.toLowerCase()) ||
      item.summary.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">National AYUSH Innovation Showcase</h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <ShieldCheck className="h-3 w-3 text-emerald-700" /> Verified Public Repository
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Showcasing institutional breakthroughs, patents, and incubated wellness technologies across AYUSH academies.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search verified innovations..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-teal-700"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'all' ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Showcases ({allItems.length})
        </button>
        <button
          onClick={() => setFilterType('project')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'project' ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Inventions & Projects ({approvedProjects.length})
        </button>
        <button
          onClick={() => setFilterType('patent')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'patent' ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Patents & IPR ({approvedPatents.length})
        </button>
        <button
          onClick={() => setFilterType('startup')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'startup' ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Startups ({approvedStartups.length})
        </button>
        <button
          onClick={() => setFilterType('award')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
            filterType === 'award' ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Awards ({approvedAwards.length})
        </button>
      </div>

      {/* Grid of Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div 
            key={`${item.type}-${item.id}`}
            className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-xs transition-all space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-teal-800">{item.type}</span>
                <span className="truncate max-w-[150px]">{item.department}</span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                By: <span className="font-medium text-slate-800">{item.lead}</span>
              </div>
              <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                {item.metric}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-500">
            No public innovation records found matching query.
          </div>
        )}
      </div>

    </div>
  );
};
