import React from 'react';
import { X, History, Clock, User, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  recordId?: string;
  recordTitle?: string;
}

export const AuditHistoryModal: React.FC<Props> = ({ isOpen, onClose, recordId, recordTitle }) => {
  const { db } = useData();

  if (!isOpen) return null;

  // Filter logs for this specific record, or show all logs if none specified
  const filteredLogs = recordId 
    ? db.auditLogs.filter(log => log.recordId === recordId)
    : db.auditLogs;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <History className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {recordTitle ? `Version Audit History: ${recordTitle}` : 'Institutional Integrity & Audit Log'}
              </h2>
              <p className="text-xs text-slate-500">Immutable Change Log & Data Lineage</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No audit logs recorded for this record yet.
            </div>
          ) : (
            <div className="relative border-l border-slate-200 ml-4 space-y-6">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative pl-6">
                  {/* Timeline dot */}
                  <div className={`absolute -left-2 top-1 h-4 w-4 rounded-full border-2 border-white ${
                    log.action === 'Approved' ? 'bg-emerald-600' :
                    log.action === 'Created' ? 'bg-teal-600' :
                    log.action === 'Rejected' ? 'bg-rose-600' :
                    log.action === 'Updated' ? 'bg-indigo-600' : 'bg-amber-600'
                  }`} />

                  <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">
                          Version {log.version} · {log.action}
                        </span>
                        <span className="text-[10px] text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded">
                          {log.recordType}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Clock className="h-3 w-3" />
                        {new Date(log.changedAt).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <span className="font-medium text-slate-700">{log.changedByName}</span> ({log.changedByRole})
                    </div>

                    {log.reason && (
                      <div className="text-xs text-slate-700 bg-white p-2 rounded border border-slate-100 italic">
                        "{log.reason}"
                      </div>
                    )}

                    {log.oldValue && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        <span className="text-slate-400">Previous:</span> {log.oldValue}
                      </div>
                    )}

                    {log.newValue && (
                      <div className="text-[11px] text-emerald-800 font-mono">
                        <span className="text-emerald-600">Current:</span> {log.newValue}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-3 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Close Audit
          </button>
        </div>

      </div>
    </div>
  );
};
