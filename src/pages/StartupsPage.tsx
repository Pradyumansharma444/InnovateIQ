import React, { useState } from 'react';
import { Rocket, Plus, Download, History, ExternalLink } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Startup } from '../types';
import { ExportService } from '../services/exportService';
import { AuditHistoryModal } from '../components/AuditHistoryModal';

export const StartupsPage: React.FC = () => {
  const { db, addStartup, selectedDepartmentId, searchQuery } = useData();
  const { currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAuditStartup, setSelectedAuditStartup] = useState<Startup | null>(null);

  // Form State
  const [startupName, setStartupName] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-3');
  const [founders, setFounders] = useState(currentUser.name);
  const [studentOrFaculty, setStudentOrFaculty] = useState<Startup['studentOrFaculty']>('Student');
  const [incubator, setIncubator] = useState('AIIA Bio-Incubation Center (ABIC)');
  const [industry, setIndustry] = useState<Startup['industry']>('AyurTech Telemedicine');
  const [funding, setFunding] = useState(25.0);
  const [achievement, setAchievement] = useState('');
  const [website, setWebsite] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = db.departments.find(d => d.id === departmentId);
    addStartup({
      institutionId: currentUser.institutionId,
      departmentId,
      departmentName: dept?.name || 'Department',
      startupName,
      founders: founders.split(',').map(f => f.trim()),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      studentOrFaculty,
      incubator,
      industry,
      funding: Number(funding),
      launchDate: new Date().toISOString().slice(0, 10),
      status: 'Incubated',
      achievement,
      website: website || undefined,
      documents: ['incubation_agreement.pdf'],
      verificationStatus: 'submitted'
    });

    setIsCreateOpen(false);
    setStartupName('');
    setAchievement('');
    setWebsite('');
  };

  const filteredStartups = db.startups.filter(s => {
    const matchesDept = selectedDepartmentId === 'all' || s.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      s.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.founders.some(f => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.industry.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const handleExportCsv = () => {
    ExportService.exportToCsv(
      filteredStartups.map(s => ({
        StartupName: s.startupName,
        Founders: s.founders.join('; '),
        Department: s.departmentName,
        StudentOrFaculty: s.studentOrFaculty,
        Incubator: s.incubator,
        Industry: s.industry,
        SeedFunding_Lakhs: s.funding,
        Status: s.status,
        Verification: s.verificationStatus
      })),
      'AYUSH_Incubated_Startups'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Startups & Entrepreneurship Incubation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module E · Student and faculty ventures, bio-incubation centers, and commercialized herbal technologies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
          >
            <Plus className="h-4 w-4" /> Add Startup Record
          </button>
        </div>
      </div>

      {/* Grid of Startup Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStartups.map((stu) => (
          <div 
            key={stu.id}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                  {stu.industry}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {stu.status}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    stu.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {stu.verificationStatus}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{stu.startupName}</h3>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                <div>Founders: <strong className="text-slate-900">{stu.founders.join(', ')}</strong> ({stu.studentOrFaculty})</div>
                <div>Incubator: <span className="text-slate-600 font-medium">{stu.incubator}</span></div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Seed Grant: <strong className="text-teal-900 font-mono">₹{stu.funding.toFixed(1)} Lakhs</strong></span>
                  <span>Launched: {stu.launchDate}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Achievement & Traction: </span>
                {stu.achievement}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">v{stu.version}</span>
              <button
                onClick={() => setSelectedAuditStartup(stu)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                <History className="h-3.5 w-3.5" /> History & Audit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Add Incubated Startup</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Startup Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NadiVeda Healthtech Solutions Pvt Ltd"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department *</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {db.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Founder Classification *</label>
                  <select
                    value={studentOrFaculty}
                    onChange={(e) => setStudentOrFaculty(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Student">Student Led</option>
                    <option value="Faculty">Faculty Spin-off</option>
                    <option value="Joint">Joint Student-Faculty Venture</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Industry / Domain *</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="AYUSH Wellness">AYUSH Wellness</option>
                    <option value="Herbal Nutraceuticals">Herbal Nutraceuticals</option>
                    <option value="AyurTech Telemedicine">AyurTech Telemedicine</option>
                    <option value="Herbal Cosmeceuticals">Herbal Cosmeceuticals</option>
                    <option value="Phyto-pharmaceuticals">Phyto-pharmaceuticals</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Seed Funding (₹ Lakhs)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={funding}
                    onChange={(e) => setFunding(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Founders (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={founders}
                  onChange={(e) => setFounders(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Key Milestone & Achievement</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Selected for AYUSH Startup Challenge; FSSAI clearance; Pilot users"
                  value={achievement}
                  onChange={(e) => setAchievement(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Submit Startup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAuditStartup && (
        <AuditHistoryModal
          isOpen={true}
          onClose={() => setSelectedAuditStartup(null)}
          recordId={selectedAuditStartup.id}
          recordTitle={selectedAuditStartup.startupName}
        />
      )}

    </div>
  );
};
