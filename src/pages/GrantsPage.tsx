import React, { useState } from 'react';
import { Landmark, Plus, Download, History, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ResearchGrant } from '../types';
import { ExportService } from '../services/exportService';
import { AuditHistoryModal } from '../components/AuditHistoryModal';

export const GrantsPage: React.FC = () => {
  const { db, addGrant, selectedDepartmentId, searchQuery } = useData();
  const { currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAuditGrant, setSelectedAuditGrant] = useState<ResearchGrant | null>(null);

  // Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-1');
  const [principalInvestigator, setPrincipalInvestigator] = useState(currentUser.name);
  const [fundingAgency, setFundingAgency] = useState<ResearchGrant['fundingAgency']>('Ministry of AYUSH');
  const [amount, setAmount] = useState(75.0); // Lakhs
  const [duration, setDuration] = useState('36 Months');
  const [status, setStatus] = useState<ResearchGrant['status']>('Sanctioned');
  const [projectOutcome, setProjectOutcome] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = db.departments.find(d => d.id === departmentId);
    addGrant({
      institutionId: currentUser.institutionId,
      departmentId,
      departmentName: dept?.name || 'Department',
      projectTitle,
      principalInvestigator,
      principalInvestigatorId: currentUser.id,
      fundingAgency,
      amount: Number(amount),
      grantDate: new Date().toISOString().slice(0, 10),
      duration,
      status,
      projectOutcome,
      verificationStatus: 'submitted'
    });

    setIsCreateOpen(false);
    setProjectTitle('');
    setProjectOutcome('');
  };

  const filteredGrants = db.grants.filter(g => {
    const matchesDept = selectedDepartmentId === 'all' || g.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      g.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.principalInvestigator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.fundingAgency.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const handleExportCsv = () => {
    ExportService.exportToCsv(
      filteredGrants.map(g => ({
        ProjectTitle: g.projectTitle,
        PrincipalInvestigator: g.principalInvestigator,
        Department: g.departmentName,
        Agency: g.fundingAgency,
        Amount_Lakhs: g.amount,
        Duration: g.duration,
        Status: g.status,
        Verification: g.verificationStatus
      })),
      'AYUSH_Research_Grants'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Extramural Research Grants</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module D · Sponsored research grants sanctioned by Ministry of AYUSH, ICMR, DST, DBT, and CCRAS.
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
            <Plus className="h-4 w-4" /> Log Research Grant
          </button>
        </div>
      </div>

      {/* Grants Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGrants.map((grt) => (
          <div 
            key={grt.id}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                  {grt.fundingAgency}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {grt.status}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    grt.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {grt.verificationStatus}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{grt.projectTitle}</h3>

              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Sanctioned Amount</div>
                  <div className="text-lg font-bold text-teal-950 font-mono tabular-nums">
                    ₹{grt.amount.toFixed(1)} Lakhs
                  </div>
                </div>
                <div className="text-right text-xs text-teal-900 font-medium">
                  <div>Duration: {grt.duration}</div>
                  <div className="text-[11px] text-teal-700">Sanctioned: {grt.grantDate}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                Principal Investigator: <strong className="text-slate-800">{grt.principalInvestigator}</strong>
              </div>
              <div className="text-[11px] text-slate-500">Dept: {grt.departmentName}</div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Outcome Milestone: </span>
                {grt.projectOutcome}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">v{grt.version}</span>
              <button
                onClick={() => setSelectedAuditGrant(grt)}
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
            <h2 className="text-base font-bold text-slate-900">Record Research Grant</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Grant / Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Mission on Quality Control and Nano-Characterization"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
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
                  <label className="font-semibold text-slate-700">Funding Agency *</label>
                  <select
                    value={fundingAgency}
                    onChange={(e) => setFundingAgency(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Ministry of AYUSH">Ministry of AYUSH</option>
                    <option value="ICMR">ICMR</option>
                    <option value="DST">DST</option>
                    <option value="DBT">DBT</option>
                    <option value="CCRAS">CCRAS</option>
                    <option value="CSIR">CSIR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Sanctioned Amount (₹ Lakhs) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Principal Investigator *</label>
                <input
                  type="text"
                  required
                  value={principalInvestigator}
                  onChange={(e) => setPrincipalInvestigator(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Outcome & Deliverables</label>
                <textarea
                  rows={2}
                  placeholder="Key milestones or laboratory instrumentation to be created"
                  value={projectOutcome}
                  onChange={(e) => setProjectOutcome(e.target.value)}
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
                  Submit Grant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAuditGrant && (
        <AuditHistoryModal
          isOpen={true}
          onClose={() => setSelectedAuditGrant(null)}
          recordId={selectedAuditGrant.id}
          recordTitle={selectedAuditGrant.projectTitle}
        />
      )}

    </div>
  );
};
