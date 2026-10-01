import React, { useState } from 'react';
import { X, Upload, Check, AlertCircle, FileSpreadsheet, ArrowRight, Download } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultModule?: 'projects' | 'publications' | 'patents' | 'grants';
}

const sampleCsvRows = [
  { "Project Name": "Nadi Wave Sensor Pro", "Department": "AyurTech & Digital Health Informatics", "Principal Investigator": "Dr. Vivek Sengupta", "Category": "Biomedical Device", "Funding Amount": "1200000", "Start Date": "2025-01-10", "Outcome": "Hardware test bench passed" },
  { "Project Name": "Herbal Wound Spray Formulation", "Department": "Dravyaguna Vijnana", "Principal Investigator": "Dr. Meenakshi Sharma", "Category": "Ayurveda Formulation", "Funding Amount": "850000", "Start Date": "2025-02-15", "Outcome": "Preclinical batch formulated" },
  { "Project Name": "Missing Info Row", "Department": "", "Principal Investigator": "", "Category": "Digital Health", "Funding Amount": "invalid-num", "Start Date": "2025-03-01", "Outcome": "Incomplete row testing validation" }
];

export const ImportWizardModal: React.FC<Props> = ({ isOpen, onClose, defaultModule = 'projects' }) => {
  const { addProject, showToast } = useData();
  const { currentUser } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedModule, setSelectedModule] = useState<'projects' | 'publications' | 'patents' | 'grants'>(defaultModule);
  const [parsedRows, setParsedRows] = useState<any[]>(sampleCsvRows);
  
  // Column mapping state
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({
    'title': 'Project Name',
    'departmentName': 'Department',
    'createdByName': 'Principal Investigator',
    'category': 'Category',
    'funding': 'Funding Amount',
    'startDate': 'Start Date',
    'outcome': 'Outcome'
  });

  if (!isOpen) return null;

  // Validation metrics
  const totalRows = parsedRows.length;
  const invalidRows = parsedRows.filter(r => !r['Project Name'] || !r['Department']);
  const validRows = parsedRows.filter(r => r['Project Name'] && r['Department']);
  const duplicateRows = 0;

  const handleConfirmImport = () => {
    validRows.forEach((row) => {
      addProject({
        institutionId: currentUser.institutionId,
        departmentId: 'dept-3',
        departmentName: row[columnMapping['departmentName']] || 'AyurTech & Digital Health Informatics',
        title: row[columnMapping['title']] || 'Imported Project',
        description: row[columnMapping['outcome']] || 'Imported via CSV/Excel Data Integration Wizard',
        createdBy: currentUser.id,
        createdByName: row[columnMapping['createdByName']] || currentUser.name,
        createdByUserRole: currentUser.role,
        teamMembers: [row[columnMapping['createdByName']] || currentUser.name],
        category: (row[columnMapping['category']] as any) || 'Digital Health',
        technology: 'Standardized Phytochemistry / Hardware Sensor',
        problemStatement: 'Automated data ingestion from departmental spreadsheet.',
        solution: 'Normalized and imported into central MongoDB indicator repository.',
        status: 'In Progress',
        startDate: row[columnMapping['startDate']] || '2025-01-01',
        funding: parseInt(row[columnMapping['funding']]) || 500000,
        outcome: row[columnMapping['outcome']] || 'Under active development',
        impact: 'Contributes to departmental and institutional innovation scoring.',
        documents: ['batch_import_manifest.csv'],
        verificationStatus: 'submitted'
      });
    });

    showToast(`Successfully imported ${validRows.length} valid records to review queue.`);
    onClose();
  };

  const handleDownloadErrors = () => {
    const errorData = invalidRows.map((r, i) => ({
      RowIndex: i + 1,
      Reason: !r['Department'] ? 'Missing mandatory Department column' : 'Missing Project Name',
      Data: JSON.stringify(r)
    }));
    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'import_validation_errors.json';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">CSV & Excel Data Ingestion Wizard</h2>
              <p className="text-xs text-slate-500">Flexible Multi-Institute Column Mapping & Quality Validation</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wizard Steps indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-medium">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px]">1</span>
            Select Module & Upload
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px]">2</span>
            Column Mapping
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-slate-300" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-teal-700 font-bold' : 'text-slate-500'}`}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[11px]">3</span>
            Validation & Confirm
          </div>
        </div>

        {/* Step 1: Upload & Module */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Target Innovation Module</label>
              <select 
                value={selectedModule} 
                onChange={(e) => setSelectedModule(e.target.value as any)}
                className="w-full text-xs rounded-lg border border-slate-300 p-2.5 bg-white"
              >
                <option value="projects">Innovation Projects</option>
                <option value="publications">Research Publications</option>
                <option value="patents">Patents & IPR</option>
                <option value="grants">Research Grants</option>
              </select>
            </div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 p-8 text-center hover:border-teal-500 bg-slate-50/50 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
              <div className="text-xs font-semibold text-slate-700">Departmental Excel or CSV Spreadsheet</div>
              <p className="text-[11px] text-slate-400 mt-1">Accepts .csv, .xls, .xlsx files up to 25MB</p>
              <div className="mt-4">
                <span className="inline-block py-1.5 px-3 bg-white text-teal-800 border border-teal-200 text-xs font-medium rounded-md shadow-xs">
                  Loaded: AYUSH_Innovation_Batch_2025.csv (3 rows loaded)
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button 
                onClick={() => setStep(2)} 
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Proceed to Column Mapping
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Column Mapping */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-slate-600">
              Match the spreadsheet column names from your institute's legacy spreadsheet to the canonical AYUSH Innovation indicators schema:
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">System Field (Target Schema)</label>
                <div className="p-2.5 bg-slate-100 rounded border border-slate-200 font-medium">Title / Project Name</div>
                <div className="p-2.5 bg-slate-100 rounded border border-slate-200 font-medium">Department</div>
                <div className="p-2.5 bg-slate-100 rounded border border-slate-200 font-medium">Principal Investigator / Author</div>
                <div className="p-2.5 bg-slate-100 rounded border border-slate-200 font-medium">Funding Amount (₹)</div>
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Spreadsheet Column (Source File)</label>
                <input 
                  type="text" 
                  value={columnMapping['title']} 
                  onChange={(e) => setColumnMapping({ ...columnMapping, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs" 
                />
                <input 
                  type="text" 
                  value={columnMapping['departmentName']} 
                  onChange={(e) => setColumnMapping({ ...columnMapping, departmentName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs" 
                />
                <input 
                  type="text" 
                  value={columnMapping['createdByName']} 
                  onChange={(e) => setColumnMapping({ ...columnMapping, createdByName: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs" 
                />
                <input 
                  type="text" 
                  value={columnMapping['funding']} 
                  onChange={(e) => setColumnMapping({ ...columnMapping, funding: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs" 
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button onClick={() => setStep(1)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Back</button>
              <button 
                onClick={() => setStep(3)} 
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
              >
                Validate Data Integrity
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Validation & Preview */}
        {step === 3 && (
          <div className="p-6 space-y-4">
            
            {/* Metric pill cards */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-slate-500 text-[11px]">Total Rows</div>
                <div className="text-base font-bold text-slate-900 font-mono tabular-nums">{totalRows}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                <div className="text-[11px]">Valid Rows</div>
                <div className="text-base font-bold font-mono tabular-nums">{validRows.length}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-800">
                <div className="text-[11px]">Invalid Rows</div>
                <div className="text-base font-bold font-mono tabular-nums">{invalidRows.length}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-600">
                <div className="text-[11px]">Duplicates</div>
                <div className="text-base font-bold font-mono tabular-nums">{duplicateRows}</div>
              </div>
            </div>

            {/* Validation warning */}
            {invalidRows.length > 0 && (
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-700 shrink-0" />
                  <span>{invalidRows.length} row(s) failed required schema validation (missing title or department).</span>
                </div>
                <button 
                  onClick={handleDownloadErrors}
                  className="flex items-center gap-1 font-semibold text-amber-900 underline hover:text-amber-950"
                >
                  <Download className="h-3 w-3" /> Error Info
                </button>
              </div>
            )}

            {/* Preview table */}
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-2 font-semibold">Row</th>
                    <th className="p-2 font-semibold">Title</th>
                    <th className="p-2 font-semibold">Department</th>
                    <th className="p-2 font-semibold">PI / Author</th>
                    <th className="p-2 font-semibold">Validation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((r, i) => {
                    const isValid = r['Project Name'] && r['Department'];
                    return (
                      <tr key={i} className={isValid ? 'hover:bg-slate-50/60' : 'bg-rose-50/50'}>
                        <td className="p-2 font-mono text-slate-400">#{i + 1}</td>
                        <td className="p-2 font-medium text-slate-900">{r['Project Name'] || '<Missing Title>'}</td>
                        <td className="p-2 text-slate-600">{r['Department'] || '<Missing Dept>'}</td>
                        <td className="p-2 text-slate-600">{r['Principal Investigator'] || '—'}</td>
                        <td className="p-2">
                          <span className={`text-[11px] font-semibold ${isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {isValid ? 'Ready to Import' : 'Validation Error'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button onClick={() => setStep(2)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Back to Mapping</button>
              <button 
                onClick={handleConfirmImport} 
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-xs"
              >
                Confirm & Ingest {validRows.length} Valid Records
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
