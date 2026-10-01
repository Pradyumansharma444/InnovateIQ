import React, { useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, FileText, User } from 'lucide-react';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  collection: 'projects' | 'publications' | 'patents' | 'grants' | 'startups' | 'competitions' | 'awards' | 'events';
}

export const VerificationModal: React.FC<Props> = ({ isOpen, onClose, record, collection }) => {
  const { verifyRecord } = useData();
  const [comments, setComments] = useState('');
  const [action, setAction] = useState<'approved' | 'rejected' | 'correction_required'>('approved');

  if (!isOpen || !record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((action === 'rejected' || action === 'correction_required') && !comments.trim()) {
      alert('Please enter a review reason or correction details for the applicant.');
      return;
    }
    verifyRecord(collection, record.id, action, comments);
    onClose();
  };

  const title = record.title || record.startupName || record.eventName || record.projectTitle || 'Innovation Record';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Institutional Review & Verification</h2>
            <p className="text-xs text-slate-500">Official Evaluation for Innovation Excellence Indicator Ingestion</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700 uppercase tracking-wide">{collection.toUpperCase()}</span>
              <span>Submitted by: {record.createdByName || record.principalInvestigator || 'Applicant'}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-600 line-clamp-3">
              {record.description || record.problemStatement || record.achievement || record.projectOutcome || 'Supporting documentation and abstract verified against AYUSH scientific guidelines.'}
            </p>
            {record.departmentName && (
              <div className="text-xs text-slate-500 pt-1">
                Department: <span className="font-medium text-slate-700">{record.departmentName}</span>
              </div>
            )}
          </div>

          {/* Action selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Verification Decision</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAction('approved')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  action === 'approved' 
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-800' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Approve Record
              </button>
              <button
                type="button"
                onClick={() => setAction('correction_required')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  action === 'correction_required' 
                    ? 'border-amber-600 bg-amber-50 text-amber-800' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Need Correction
              </button>
              <button
                type="button"
                onClick={() => setAction('rejected')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  action === 'rejected' 
                    ? 'border-rose-600 bg-rose-50 text-rose-800' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className="h-4 w-4 text-rose-600" />
                Reject Record
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Reviewer Assessment & Feedback {(action === 'rejected' || action === 'correction_required') && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              placeholder={
                action === 'approved' 
                  ? 'Verification notes (e.g. Scopus indexing confirmed, patent application verified)...' 
                  : 'State the specific discrepancy or missing documentation required for rectification...'
              }
              className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-teal-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Submit Verification
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
