import React, { useState } from 'react';
import { 
  FolderGit2, Plus, Filter, Search, CheckCircle2, Clock, 
  AlertTriangle, History, MessageSquare, Download, Users 
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { InnovationProject } from '../types';
import { ExportService } from '../services/exportService';
import { AuditHistoryModal } from '../components/AuditHistoryModal';

export const ProjectsPage: React.FC = () => {
  const { db, addProject, selectedDepartmentId, searchQuery } = useData();
  const { currentUser, canVerify } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAuditProj, setSelectedAuditProj] = useState<InnovationProject | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Form state
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-3');
  const [category, setCategory] = useState<InnovationProject['category']>('AI in Diagnostics');
  const [technology, setTechnology] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [solution, setSolution] = useState('');
  const [funding, setFunding] = useState(500000);
  const [outcome, setOutcome] = useState('');
  const [impact, setImpact] = useState('');
  const [teamMembersInput, setTeamMembersInput] = useState(currentUser.name);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = db.departments.find(d => d.id === departmentId);
    addProject({
      institutionId: currentUser.institutionId,
      departmentId,
      departmentName: dept?.name || 'Department',
      title,
      description: problemStatement,
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      createdByUserRole: currentUser.role,
      teamMembers: teamMembersInput.split(',').map(m => m.trim()),
      category,
      technology,
      problemStatement,
      solution,
      status: 'In Progress',
      startDate: new Date().toISOString().slice(0, 10),
      funding: Number(funding),
      outcome,
      impact,
      documents: ['project_synopsis.pdf'],
      verificationStatus: 'submitted'
    });

    setIsCreateOpen(false);
    setTitle('');
    setTechnology('');
    setProblemStatement('');
    setSolution('');
    setOutcome('');
    setImpact('');
  };

  // Filter projects
  const filteredProjects = db.projects.filter(p => {
    const matchesDept = selectedDepartmentId === 'all' || p.departmentId === selectedDepartmentId;
    const matchesStatus = statusFilter === 'all' || p.verificationStatus === statusFilter;
    const matchesQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.createdByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesStatus && matchesQuery;
  });

  const handleExportCsv = () => {
    ExportService.exportToCsv(
      filteredProjects.map(p => ({
        Title: p.title,
        Department: p.departmentName,
        Lead: p.createdByName,
        Category: p.category,
        Technology: p.technology,
        Funding_INR: p.funding,
        Status: p.status,
        Verification: p.verificationStatus
      })),
      'AYUSH_Innovation_Projects'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Innovation Projects Repository</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module A · Translational R&D, clinical devices, formulation engineering, and digital health solutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <Plus className="h-4 w-4" /> Add Innovation Project
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        <span className="text-slate-400 font-medium">Status:</span>
        {['all', 'approved', 'submitted', 'under_review', 'correction_required'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-lg capitalize transition-colors ${
              statusFilter === st ? 'bg-slate-900 text-white font-semibold' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((proj) => (
          <div 
            key={proj.id}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                    {proj.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{proj.title}</h3>
                </div>

                {/* Verification Badge */}
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                  proj.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                  proj.verificationStatus === 'under_review' ? 'bg-amber-100 text-amber-800' :
                  proj.verificationStatus === 'submitted' ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {proj.verificationStatus.replace('_', ' ')}
                </span>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed space-y-1">
                <p><strong className="text-slate-700">Problem:</strong> {proj.problemStatement}</p>
                <p><strong className="text-slate-700">Solution:</strong> {proj.solution}</p>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 space-y-1 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span>Lead: <strong className="text-slate-800">{proj.createdByName}</strong> ({proj.createdByUserRole})</span>
                  <span>Funding: <strong className="text-slate-800 font-mono">₹{(proj.funding / 100000).toFixed(1)} Lakhs</strong></span>
                </div>
                <div>Dept: <span className="text-slate-700">{proj.departmentName}</span></div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Users className="h-3 w-3" />
                  <span>Team: {proj.teamMembers.join(', ')}</span>
                </div>
              </div>

              {proj.reviewComments && (
                <div className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Review Note:</span> {proj.reviewComments}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                v{proj.version} · {new Date(proj.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => setSelectedAuditProj(proj)}
                className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900"
              >
                <History className="h-3.5 w-3.5" /> Version History
              </button>
            </div>
          </div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-16 text-center text-xs text-slate-500 bg-white rounded-xl border border-slate-200">
            No innovation projects found matching active filters.
          </div>
        )}
      </div>

      {/* Project Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Add New Innovation Project</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Automated Panchakarma Shirodhara Oscillating Nozzle"
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
                    <option value="Ayurveda Formulation">Ayurveda Formulation</option>
                    <option value="Biomedical Device">Biomedical Device</option>
                    <option value="AI in Diagnostics">AI in Diagnostics</option>
                    <option value="Herbal Pharmacology">Herbal Pharmacology</option>
                    <option value="Panchakarma Tech">Panchakarma Tech</option>
                    <option value="Digital Health">Digital Health</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Problem Statement *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="What clinical, industrial, or scientific problem does this project address?"
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Proposed Technological Solution *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Technical formulation, sensor hardware, or algorithms utilized"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Funding (₹ INR)</label>
                  <input
                    type="number"
                    value={funding}
                    onChange={(e) => setFunding(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Team Members (Comma separated)</label>
                  <input
                    type="text"
                    value={teamMembersInput}
                    onChange={(e) => setTeamMembersInput(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
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
                  Submit for Verification
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Audit Modal */}
      {selectedAuditProj && (
        <AuditHistoryModal
          isOpen={true}
          onClose={() => setSelectedAuditProj(null)}
          recordId={selectedAuditProj.id}
          recordTitle={selectedAuditProj.title}
        />
      )}

    </div>
  );
};
