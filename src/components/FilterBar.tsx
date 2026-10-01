import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { useData } from '../context/DataContext';

export const FilterBar: React.FC = () => {
  const { 
    db, 
    selectedDepartmentId, 
    setSelectedDepartmentId, 
    selectedYear, 
    setSelectedYear, 
    searchQuery, 
    setSearchQuery 
  } = useData();

  const handleReset = () => {
    setSelectedDepartmentId('all');
    setSelectedYear('2025-2026');
    setSearchQuery('');
  };

  const isFiltered = selectedDepartmentId !== 'all' || selectedYear !== '2025-2026' || searchQuery !== '';

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
      
      {/* Left: Department & Year filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span>Filters:</span>
        </div>

        {/* Department select */}
        <select
          value={selectedDepartmentId}
          onChange={(e) => setSelectedDepartmentId(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-700 focus:outline-none focus:border-teal-600 font-medium"
        >
          <option value="all">All Departments ({db.departments.length})</option>
          {db.departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        {/* Year select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-slate-700 focus:outline-none focus:border-teal-600 font-medium"
        >
          <option value="2025-2026">AY 2025–2026 (Current)</option>
          <option value="2024-2025">AY 2024–2025</option>
          <option value="2023-2024">AY 2023–2024</option>
          <option value="2022-2023">AY 2022–2023</option>
        </select>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {/* Right: Search Box */}
      <div className="relative min-w-[220px] max-w-xs w-full sm:w-auto">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          placeholder="Search records, titles, authors..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:bg-white"
        />
      </div>

    </div>
  );
};
