import React, { useState } from 'react';
import { UploadCloud, Server, FileSpreadsheet, Download, CheckCircle2, ArrowRight } from 'lucide-react';
import { ImportWizardModal } from '../components/ImportWizardModal';
import { IntegrationAdapterModal } from '../components/IntegrationAdapterModal';
import { ExportService } from '../services/exportService';

export const DataImportPage: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAdapterModalOpen, setIsAdapterModalOpen] = useState(false);

  const sampleCsvTemplate = [
    {
      "Project Name": "Microfluidic Herbal Extraction Console",
      "Department": "Rasashastra & Bhaishajya Kalpana",
      "Principal Investigator": "Prof. Anand Chaudhary",
      "Category": "Ayurveda Formulation",
      "Funding Amount": "1800000",
      "Start Date": "2025-04-01",
      "Outcome": "Validated 3x higher bioavailability in preclinical tests"
    },
    {
      "Project Name": "Digital Tridosha Thermography Sensor",
      "Department": "AyurTech & Digital Health Informatics",
      "Principal Investigator": "Aarav Patel",
      "Category": "Biomedical Device",
      "Funding Amount": "950000",
      "Start Date": "2025-05-15",
      "Outcome": "Thermal baseline mapping complete"
    }
  ];

  const handleDownloadTemplate = () => {
    ExportService.exportToCsv(sampleCsvTemplate, 'AYUSH_Innovation_Import_Template');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Data Collection, Ingestion & System Integration</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          InnovateIQ Data Collection Engine · Flexible spreadsheet mapping for varied institutes and REST adapters for legacy systems.
        </p>
      </div>

      {/* Two Ingestion Modalities Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CSV/Excel Import Card */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
              <FileSpreadsheet className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">CSV & Excel Ingestion Wizard</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Upload departmental spreadsheets. Our flexible column-mapping engine lets any college or university match their custom spreadsheet headers to canonical AYUSH indicator fields with live integrity validation.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
                <span>Custom column mapping ("Project Name" → title)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
                <span>Pre-flight validation (flags missing mandatory fields)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
                <span>Downloadable error diagnostic reports</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleDownloadTemplate}
              className="text-xs text-slate-600 font-semibold hover:text-slate-900 flex items-center gap-1"
            >
              <Download className="h-3.5 w-3.5" /> Download Template
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
            >
              <UploadCloud className="h-4 w-4" /> Launch Import Wizard
            </button>
          </div>
        </div>

        {/* REST API Connectors Card */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-800">
              <Server className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">External System REST Adapters</h3>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Connect and sync records directly from existing institutional systems including the University Research Management System (RMS), AYUSH Research Portal (ARP), and Indian Patent Office gazettes.
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-700" />
                <span>REST JSON transformation and normalization</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-700" />
                <span>Deduplication & automatic verification routing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-700" />
                <span>Real-time indicator recalculation post-sync</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setIsAdapterModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 shadow-2xs"
            >
              <Server className="h-4 w-4" /> Open System Adapters
            </button>
          </div>
        </div>

      </div>

      {/* Workflow Diagram */}
      <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Data Integration Pipeline Flow</h4>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-700">
          <span className="p-2 bg-white rounded border border-slate-200">Departmental Spreadsheets / API</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="p-2 bg-white rounded border border-slate-200">Column Mapping Layer</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="p-2 bg-white rounded border border-slate-200">Pre-Flight Validation Engine</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="p-2 bg-white rounded border border-slate-200">Central Ingestion Storage</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="p-2 bg-teal-50 text-teal-900 rounded border border-teal-200 font-bold">Reviewer Verification Queue</span>
        </div>
      </div>

      {/* Modals */}
      {isImportModalOpen && (
        <ImportWizardModal
          isOpen={true}
          onClose={() => setIsImportModalOpen(false)}
        />
      )}

      {isAdapterModalOpen && (
        <IntegrationAdapterModal
          isOpen={true}
          onClose={() => setIsAdapterModalOpen(false)}
        />
      )}

    </div>
  );
};
