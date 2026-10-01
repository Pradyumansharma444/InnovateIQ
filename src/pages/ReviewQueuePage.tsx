import React, { useState } from 'react';
import { CheckSquare, Search, Filter, ShieldCheck, AlertTriangle, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { VerificationModal } from '../components/VerificationModal';

export const ReviewQueuePage: React.FC = () => {
  const { db } = useData();
  const { canVerify } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<any>('projects');
  const [query, setQuery] = useState('');

  // Collect records across all 8 modules with normalized structure
  const allSubmissions: any[] = [
    ...db.projects.map(p => ({ ...p, collectionName: 'projects', moduleType: 'Project' })),
    ...db.publications.map(p => ({ ...p, collectionName: 'publications', moduleType: 'Publication' })),
    ...db.patents.map(p => ({ ...p, collectionName: 'patents', moduleType: 'Patent' })),
    ...db.grants.map(g => ({ ...g, collectionName: 'grants', moduleType: 'Grant' }))
  ];

  const filtered = allSubmissions.filter(item => {
    const isPending = item.verificationStatus === 'submitted' || item.verificationStatus === 'under_review' || item.verificationStatus === 'correction_required';
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'pending' ? isPending :
      item.verificationStatus === activeTab;

    const title = item.title || item.projectTitle || item.startupName || '';
    const author = item.createdByName || item.principalInvestigator || '';
    const matchesQuery = !query || 
      title.toLowerCase().includes(query.toLowerCase()) || 
      author.toLowerCase().includes(query.toLowerCase()) ||
      item.departmentName.toLowerCase().includes(query.toLowerCase());

    return matchesTab && matchesQuery;
  });

  const pendingCount = allSubmissions.filter(s => s.verificationStatus === 'submitted' || s.verificationStatus === 'under_review').length;

  const handleOpenReview = (item: any) => {
    setSelectedRecord(item);
    setSelectedCollection(item.collectionName);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">Institutional Review & Verification Cell</h1>
            {pendingCount > 0 && (
              <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Peer scrutiny and documentation validation. Only approved records feed into official AYUSH excellence indicators.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search pending reviews..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-teal-700"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('pending')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'pending'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pending Scrutiny ({allSubmissions.filter(s => s.verificationStatus === 'submitted' || s.verificationStatus === 'under_review').length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'approved'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Approved & Ingested ({allSubmissions.filter(s => s.verificationStatus === 'approved').length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'rejected'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Rejected / Rectifications ({allSubmissions.filter(s => s.verificationStatus === 'rejected' || s.verificationStatus === 'correction_required').length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'all'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          All Filings ({allSubmissions.length})
        </button>
      </div>

      {/* Verification Queue List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Module</th>
                <th className="py-3 px-4 font-semibold">Title & Documentation</th>
                <th className="py-3 px-4 font-semibold">Applicant & Dept</th>
                <th className="py-3 px-4 font-semibold">Date Submitted</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filtered.map((item) => {
                const title = item.title || item.projectTitle || item.startupName;
                const applicant = item.createdByName || item.principalInvestigator;

                return (
                  <tr key={`${item.collectionName}-${item.id}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {item.moduleType}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.problemStatement || item.abstract || item.journal || item.achievement || 'Evidence attached.'}
                      </div>
                      {item.reviewComments && (
                        <div className="text-[10px] text-amber-900 bg-amber-50 p-1 rounded mt-1 border border-amber-200/50">
                          Note: {item.reviewComments}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{applicant}</div>
                      <div className="text-[11px] text-slate-400">{item.departmentName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {new Date(item.createdAt || item.filingDate || item.grantDate || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        item.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        item.verificationStatus === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        item.verificationStatus === 'correction_required' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                        {item.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenReview(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Scrutinize
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-slate-500">
                    No submissions found in this review queue tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRecord && (
        <VerificationModal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          record={selectedRecord}
          collection={selectedCollection}
        />
      )}

    </div>
  );
};
