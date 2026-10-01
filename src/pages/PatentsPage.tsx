import React, { useState } from 'react';
import { Lightbulb, Plus, Download, History, ShieldCheck, FileCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Patent } from '../types';
import { ExportService } from '../services/exportService';
import { AuditHistoryModal } from '../components/AuditHistoryModal';

export const PatentsPage: React.FC = () => {
  const { db, addPatent, selectedDepartmentId, searchQuery } = useData();
  const { currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAuditPatent, setSelectedAuditPatent] = useState<Patent | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-1');
  const [inventors, setInventors] = useState(currentUser.name);
  const [applicationNumber, setApplicationNumber] = useState('');
  const [patentNumber, setPatentNumber] = useState('');
  const [status, setStatus] = useState<Patent['status']>('Filed');
  const [category, setCategory] = useState<Patent['category']>('Diagnostic Device');
  const [filingDate, setFilingDate] = useState(new Date().toISOString().slice(0, 10));

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = db.departments.find(d => d.id === departmentId);
    addPatent({
      institutionId: currentUser.institutionId,
      departmentId,
      departmentName: dept?.name || 'Department',
      title,
      inventors: inventors.split(',').map(i => i.trim()),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      applicationNumber: applicationNumber || `2026110${Math.floor(1000 + Math.random() * 9000)}`,
      patentNumber: patentNumber || undefined,
      filingDate,
      grantDate: status === 'Granted' ? new Date().toISOString().slice(0, 10) : undefined,
      status,
      category,
      verificationStatus: 'submitted'
    });

    setIsCreateOpen(false);
    setTitle('');
    setApplicationNumber('');
    setPatentNumber('');
  };

  const filteredPatents = db.patents.filter(p => {
    const matchesDept = selectedDepartmentId === 'all' || p.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.patentNumber && p.patentNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.inventors.some(inv => inv.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesQuery;
  });

  const handleExportCsv = () => {
    ExportService.exportToCsv(
      filteredPatents.map(p => ({
        Title: p.title,
        Inventors: p.inventors.join('; '),
        Department: p.departmentName,
        ApplicationNo: p.applicationNumber,
        PatentNo: p.patentNumber || 'N/A',
        FilingDate: p.filingDate,
        GrantDate: p.grantDate || 'Pending',
        Status: p.status,
        Verification: p.verificationStatus
      })),
      'AYUSH_Patents_IPR'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Patents & Intellectual Property Rights (IPR)</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module C · Indian Patent Office (IPO) and PCT international filings, green formulations, and medical devices.
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
            <Plus className="h-4 w-4" /> Register Patent
          </button>
        </div>
      </div>

      {/* Grid of Patent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatents.map((pat) => (
          <div 
            key={pat.id}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                  {pat.category}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    pat.status === 'Granted' ? 'bg-emerald-100 text-emerald-800' :
                    pat.status === 'Under Examination' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pat.status}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    pat.verificationStatus === 'approved' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pat.verificationStatus}
                  </span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{pat.title}</h3>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-xs text-slate-700 space-y-1">
                <div>App No: <strong className="text-slate-900">{pat.applicationNumber}</strong></div>
                {pat.patentNumber && <div>Patent Grant No: <strong className="text-emerald-700">{pat.patentNumber}</strong></div>}
                <div className="text-[11px] text-slate-500 font-sans">
                  Filing Date: {pat.filingDate} {pat.grantDate && `· Granted: ${pat.grantDate}`}
                </div>
              </div>

              <div className="text-xs text-slate-600">
                Inventors: <span className="font-medium text-slate-800">{pat.inventors.join(', ')}</span>
              </div>
              <div className="text-[11px] text-slate-500">Dept: {pat.departmentName}</div>

              {pat.reviewComments && (
                <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Verification Note:</span> {pat.reviewComments}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">v{pat.version}</span>
              <button
                onClick={() => setSelectedAuditPatent(pat)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                <History className="h-3.5 w-3.5" /> History & Audit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Register Patent Application</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Invention / Patent Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multimodal Sensor Array for Arterial Pulse Analysis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Ayurvedic Formulation">Ayurvedic Formulation</option>
                    <option value="Extraction Process">Extraction Process</option>
                    <option value="Diagnostic Device">Diagnostic Device</option>
                    <option value="Therapeutic Method">Therapeutic Method</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">IPO Application Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="202511039842"
                    value={applicationNumber}
                    onChange={(e) => setApplicationNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Filed">Filed</option>
                    <option value="Published">Published</option>
                    <option value="Under Examination">Under Examination</option>
                    <option value="Granted">Granted</option>
                    <option value="Commercialized">Commercialized</option>
                  </select>
                </div>
              </div>

              {status === 'Granted' && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Patent Grant Number</label>
                  <input
                    type="text"
                    placeholder="IN-PAT-498210"
                    value={patentNumber}
                    onChange={(e) => setPatentNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Inventors (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={inventors}
                  onChange={(e) => setInventors(e.target.value)}
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
                  Submit Patent Filing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAuditPatent && (
        <AuditHistoryModal
          isOpen={true}
          onClose={() => setSelectedAuditPatent(null)}
          recordId={selectedAuditPatent.id}
          recordTitle={selectedAuditPatent.title}
        />
      )}

    </div>
  );
};
