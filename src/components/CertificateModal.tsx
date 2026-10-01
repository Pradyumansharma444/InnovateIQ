import React, { useState } from 'react';
import { X, Award, Download, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ExportService } from '../services/exportService';
import { CertificateRecord } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  presetRecipient?: string;
  presetAchievement?: string;
}

export const CertificateModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  presetRecipient = 'Aarav Patel', 
  presetAchievement = 'Winner - Smart India Hackathon & NadiScan Patent Grant' 
}) => {
  const { db, issueCertificate } = useData();
  const { currentUser } = useAuth();

  const [recipientName, setRecipientName] = useState(presetRecipient);
  const [recipientRole, setRecipientRole] = useState<'Student' | 'Faculty' | 'Department Head'>('Student');
  const [achievementTitle, setAchievementTitle] = useState(presetAchievement);
  const [category, setCategory] = useState('Patent & National Hackathon Winner');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().slice(0, 10));
  const [certNumber, setCertNumber] = useState(`AIIA-INNOV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [signatory, setSignatory] = useState('Prof. Tanuja Nesari');
  const [signatoryTitle, setSignatoryTitle] = useState('Director & Institutional Chairperson');
  const [issuedCert, setIssuedCert] = useState<CertificateRecord | null>(null);

  if (!isOpen) return null;

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: Omit<CertificateRecord, 'id' | 'generatedAt'> = {
      certificateNumber: certNumber,
      recipientName,
      recipientRole,
      achievementTitle,
      category,
      issueDate,
      institutionName: 'All India Institute of Ayurveda, New Delhi',
      authorizedSignatory: signatory,
      signatoryTitle,
      qrCodeMockUrl: `https://ayush.gov.in/verify-cert?id=${certNumber}`,
      status: 'Issued'
    };

    issueCertificate(newCert);
    const fullCert: CertificateRecord = {
      ...newCert,
      id: `cert-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
    setIssuedCert(fullCert);

    // Fire celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleDownloadPdf = () => {
    if (issuedCert) {
      ExportService.generateCertificatePdf(issuedCert);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Institutional Innovation Certificate Generator</h2>
              <p className="text-xs text-slate-500">Official Institutional Digital Conformance & Recognition</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!issuedCert ? (
            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Recipient Full Name</label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Recipient Role</label>
                  <select
                    value={recipientRole}
                    onChange={(e) => setRecipientRole(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Student">Student Innovator</option>
                    <option value="Faculty">Faculty Researcher</option>
                    <option value="Department Head">Department Head</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Achievement Title</label>
                <input
                  type="text"
                  required
                  value={achievementTitle}
                  onChange={(e) => setAchievementTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Innovation Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Certificate Number</label>
                  <input
                    type="text"
                    value={certNumber}
                    onChange={(e) => setCertNumber(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Authorized Signatory</label>
                  <input
                    type="text"
                    value={signatory}
                    onChange={(e) => setSignatory(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Signatory Title</label>
                  <input
                    type="text"
                    value={signatoryTitle}
                    onChange={(e) => setSignatoryTitle(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-xs"
                >
                  <Award className="h-4 w-4" /> Issue & Preview Certificate
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Certificate Parchment Preview */}
              <div className="relative border-4 border-amber-800 p-8 rounded-lg bg-amber-50/40 text-center shadow-md font-serif">
                <div className="border border-slate-900 p-6 space-y-4">
                  <div className="text-[11px] font-sans font-bold tracking-widest text-amber-900 uppercase">
                    Ministry of AYUSH · Government of India
                  </div>
                  <div className="text-xl font-bold text-slate-900 tracking-wide">
                    CERTIFICATE OF INNOVATION EXCELLENCE
                  </div>
                  <div className="text-xs text-slate-600 font-sans italic">
                    Conferred by All India Institute of Ayurveda to
                  </div>
                  <div className="text-2xl font-bold text-slate-900">
                    {issuedCert.recipientName}
                  </div>
                  <div className="text-xs text-slate-500 font-sans">
                    {issuedCert.recipientRole} · Department of AyurTech
                  </div>
                  <div className="text-xs text-slate-700 font-sans max-w-lg mx-auto">
                    in recognition of verified innovation milestone:
                    <div className="font-bold text-amber-900 text-sm mt-1">"{issuedCert.achievementTitle}"</div>
                  </div>
                  <div className="flex items-center justify-between pt-6 text-[10px] font-sans text-slate-500 border-t border-slate-200">
                    <div>
                      <div>Cert ID: <span className="font-mono text-slate-700">{issuedCert.certificateNumber}</span></div>
                      <div>Date: {issuedCert.issueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-800">{issuedCert.authorizedSignatory}</div>
                      <div>{issuedCert.signatoryTitle}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <button
                  onClick={() => setIssuedCert(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Create Another Certificate
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  <Download className="h-4 w-4" /> Download Official PDF Certificate
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
