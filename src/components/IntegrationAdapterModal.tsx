import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, ArrowDownToLine, Database, Server } from 'lucide-react';
import { MockIntegrationAdapter, ExternalSystemRecord } from '../services/mockIntegrationAdapter';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationAdapterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { addPublication, addPatent, addGrant, showToast } = useData();
  const { currentUser } = useAuth();
  const [records, setRecords] = useState<ExternalSystemRecord[]>(() => MockIntegrationAdapter.getAvailableRecords());
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncRecord = (rec: ExternalSystemRecord) => {
    setIsSyncing(true);
    setTimeout(() => {
      if (rec.type === 'publication') {
        addPublication({
          institutionId: currentUser.institutionId,
          departmentId: 'dept-2',
          departmentName: rec.department,
          title: rec.title,
          authors: [rec.authorOrInventor],
          createdBy: currentUser.id,
          createdByName: rec.authorOrInventor,
          publicationType: 'Journal Article',
          journal: 'Journal of Ethnopharmacology (External Sync)',
          publisher: 'Elsevier',
          publicationDate: rec.date,
          doi: rec.identifier,
          citationCount: 14,
          indexing: 'SCI',
          verificationStatus: 'submitted'
        });
      } else if (rec.type === 'patent') {
        addPatent({
          institutionId: currentUser.institutionId,
          departmentId: 'dept-1',
          departmentName: rec.department,
          title: rec.title,
          inventors: [rec.authorOrInventor],
          createdBy: currentUser.id,
          createdByName: rec.authorOrInventor,
          applicationNumber: rec.identifier.replace('App No: ', ''),
          filingDate: rec.date,
          status: 'Published',
          category: 'Diagnostic Device',
          verificationStatus: 'submitted'
        });
      } else if (rec.type === 'grant') {
        addGrant({
          institutionId: currentUser.institutionId,
          departmentId: 'dept-4',
          departmentName: rec.department,
          projectTitle: rec.title,
          principalInvestigator: rec.authorOrInventor,
          principalInvestigatorId: currentUser.id,
          fundingAgency: 'Ministry of AYUSH',
          amount: 55.0,
          grantDate: rec.date,
          duration: '18 Months',
          status: 'Ongoing',
          projectOutcome: 'Auto-ingested from University RMS API',
          verificationStatus: 'submitted'
        });
      }

      MockIntegrationAdapter.markSynced(rec.sourceId);
      setRecords(MockIntegrationAdapter.getAvailableRecords());
      setIsSyncing(false);
      showToast(`Synced "${rec.title}" into Central MongoDB queue.`);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">External System Integration Connectors</h2>
                <span className="text-[10px] font-semibold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Live Sync Connectors
                </span>
              </div>
              <p className="text-xs text-slate-500">
                REST API Adapters for University RMS, AYUSH Research Portal & Patent Gazette Sync
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Integration Pipeline: </span>
            External Rest Endpoint → Connector Adapter → JSON Validation Layer → Ingestion into MongoDB Collection → Indicator Recalculation Engine.
          </div>

          <div className="space-y-3">
            {records.map((rec) => (
              <div 
                key={rec.sourceId}
                className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-mono text-slate-400">{rec.sourceId}</span>
                    <span className="font-semibold text-indigo-700">{rec.sourceSystem}</span>
                    <span className="text-slate-300">·</span>
                    <span className="capitalize text-slate-500">{rec.type}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{rec.title}</h4>
                  <div className="text-[11px] text-slate-500">
                    Lead: <span className="text-slate-700 font-medium">{rec.authorOrInventor}</span> ({rec.department}) · {rec.identifier}
                  </div>
                </div>

                <div>
                  {rec.status === 'Synced' ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" /> Synced
                    </div>
                  ) : (
                    <button
                      disabled={isSyncing}
                      onClick={() => handleSyncRecord(rec)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors shadow-xs"
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5" /> Ingest Record
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
