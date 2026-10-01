import React, { useState } from 'react';
import { BookOpen, Plus, ExternalLink, Download, CheckCircle2, History } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ResearchPublication } from '../types';
import { ExportService } from '../services/exportService';
import { AuditHistoryModal } from '../components/AuditHistoryModal';

export const ResearchPublicationsPage: React.FC = () => {
  const { db, addPublication, selectedDepartmentId, searchQuery } = useData();
  const { currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAuditPub, setSelectedAuditPub] = useState<ResearchPublication | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-2');
  const [authors, setAuthors] = useState(currentUser.name);
  const [journal, setJournal] = useState('');
  const [publisher, setPublisher] = useState('');
  const [doi, setDoi] = useState('');
  const [indexing, setIndexing] = useState<ResearchPublication['indexing']>('SCI');
  const [citations, setCitations] = useState(0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = db.departments.find(d => d.id === departmentId);
    addPublication({
      institutionId: currentUser.institutionId,
      departmentId,
      departmentName: dept?.name || 'Department',
      title,
      authors: authors.split(',').map(a => a.trim()),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      publicationType: 'Journal Article',
      journal,
      publisher: publisher || 'Peer-Reviewed Publisher',
      publicationDate: new Date().toISOString().slice(0, 10),
      doi: doi || `10.1016/ayush.${Date.now()}`,
      citationCount: Number(citations),
      indexing,
      documentUrl: doi ? `https://doi.org/${doi}` : undefined,
      verificationStatus: 'submitted'
    });

    setIsCreateOpen(false);
    setTitle('');
    setJournal('');
    setDoi('');
    setCitations(0);
  };

  const filteredPubs = db.publications.filter(p => {
    const matchesDept = selectedDepartmentId === 'all' || p.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.journal.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  const handleExportCsv = () => {
    ExportService.exportToCsv(
      filteredPubs.map(p => ({
        Title: p.title,
        Authors: p.authors.join('; '),
        Department: p.departmentName,
        Journal: p.journal,
        Indexing: p.indexing,
        DOI: p.doi,
        Citations: p.citationCount,
        Status: p.verificationStatus
      })),
      'AYUSH_Research_Publications'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Peer-Reviewed Research Publications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module B · Indexed journal articles, clinical trials, phytochemistry papers, and scientific citations.
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
            <Plus className="h-4 w-4" /> Add Research Paper
          </button>
        </div>
      </div>

      {/* Publications Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Article & Authors</th>
                <th className="py-3 px-4 font-semibold">Department</th>
                <th className="py-3 px-4 font-semibold">Journal & Indexing</th>
                <th className="py-3 px-4 font-semibold text-right">Citations</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredPubs.map(pub => (
                <tr key={pub.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 max-w-md">
                    <div className="font-bold text-slate-900 line-clamp-1">{pub.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {pub.authors.join(', ')}
                    </div>
                    {pub.doi && (
                      <a 
                        href={`https://doi.org/${pub.doi}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-teal-700 hover:underline font-mono mt-0.5"
                      >
                        doi:{pub.doi} <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{pub.departmentName}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{pub.journal}</div>
                    <span className="inline-block text-[10px] font-semibold text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded mt-0.5">
                      {pub.indexing}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {pub.citationCount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      pub.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                      pub.verificationStatus === 'under_review' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {pub.verificationStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedAuditPub(pub)}
                      className="text-slate-500 hover:text-slate-900 inline-flex items-center gap-1 font-semibold text-[11px]"
                    >
                      <History className="h-3 w-3" /> v{pub.version}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPubs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    No research publications match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Log Research Publication</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Article Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phytochemical Fingerprinting of Withania somnifera"
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
                  <label className="font-semibold text-slate-700">Database Indexing *</label>
                  <select
                    value={indexing}
                    onChange={(e) => setIndexing(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="SCI">SCI / SCIE</option>
                    <option value="Scopus">Scopus</option>
                    <option value="PubMed">PubMed</option>
                    <option value="UGC-CARE">UGC-CARE</option>
                    <option value="AYUSH Portal">AYUSH Research Portal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Journal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Journal of Ethnopharmacology"
                    value={journal}
                    onChange={(e) => setJournal(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">DOI Identifier</label>
                  <input
                    type="text"
                    placeholder="10.1016/j.jep.2025.118942"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Authors (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={authors}
                  onChange={(e) => setAuthors(e.target.value)}
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
                  Submit Publication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAuditPub && (
        <AuditHistoryModal
          isOpen={true}
          onClose={() => setSelectedAuditPub(null)}
          recordId={selectedAuditPub.id}
          recordTitle={selectedAuditPub.title}
        />
      )}

    </div>
  );
};
