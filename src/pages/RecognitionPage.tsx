import React, { useState } from 'react';
import { Award, Trophy, Building2, Medal, Star, ChevronRight, FileCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { CertificateModal } from '../components/CertificateModal';

export const RecognitionPage: React.FC = () => {
  const { db } = useData();
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<string | null>(null);
  const [isCertOpen, setIsCertOpen] = useState(false);

  const openCertFor = (name: string, achievement: string) => {
    setSelectedRecipient(name);
    setSelectedAchievement(achievement);
    setIsCertOpen(true);
  };

  const recognitionCards = [
    {
      title: 'Innovation Champion 2025',
      badge: 'Gold Distinction',
      recipient: 'Aarav Patel',
      role: 'Student Innovator',
      dept: 'Dept. of AyurTech & Digital Health Informatics',
      achievement: 'Granted Patent (Pulse Waveform Diagnostic Sensor) + National Innovation Champion',
      color: 'amber'
    },
    {
      title: 'Top Research Contributor',
      badge: 'Distinguished Faculty',
      recipient: 'Prof. Anand Chaudhary',
      role: 'Professor & Head',
      dept: 'Dept. of Rasashastra & Bhaishajya Kalpana',
      achievement: '14 High-Impact SCI Publications + ₹1.45 Cr National AYUSH QC Grant',
      color: 'teal'
    },
    {
      title: 'Patent Excellence Award',
      badge: 'IPR Leadership',
      recipient: 'Dr. Meenakshi Sharma',
      role: 'Associate Professor',
      dept: 'Dept. of Dravyaguna Vijnana',
      achievement: 'Published Formulation for Rapid Diabetic Wound Epithelization',
      color: 'indigo'
    },
    {
      title: 'Best Institutional Department',
      badge: 'Academic Pinnacle',
      recipient: 'Dept. of Rasashastra & Bhaishajya Kalpana',
      role: 'Institutional Unit',
      dept: 'All India Institute of Ayurveda',
      achievement: 'Score: 89.4 / 100 · 18 Verified Projects · 3 Spin-offs',
      color: 'emerald'
    }
  ];

  const studentRankings = [
    { rank: 1, name: 'Aarav Patel', dept: 'AyurTech & Informatics', points: 142, contributions: '1 Patent · 1 Startup · National Winner' },
    { rank: 2, name: 'Neha Verma', dept: 'AyurTech & Informatics', points: 110, contributions: '1 Startup Co-founder · 1 Scopus Pub' },
    { rank: 3, name: 'Kunal Trivedi', dept: 'Rasashastra', points: 85, contributions: 'National Finalist · 2 Research Papers' }
  ];

  const facultyRankings = [
    { rank: 1, name: 'Prof. Anand Chaudhary', dept: 'Rasashastra', points: 210, contributions: '3 Patents · 14 Pubs · ₹145L Grant' },
    { rank: 2, name: 'Dr. Meenakshi Sharma', dept: 'Dravyaguna', points: 180, contributions: '1 Patent · 8 Pubs · ₹64L Grant' },
    { rank: 3, name: 'Dr. Vivek Sengupta', dept: 'AyurTech', points: 155, contributions: '1 Patent · ₹82L DST Grant' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">National AYUSH Hall of Fame & Recognition</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Honoring student inventors, faculty scientists, top research departments, and conferral of digital certificates.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedRecipient('Aarav Patel');
            setSelectedAchievement('Winner - National Innovation Conclave & Patent Grant');
            setIsCertOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-2xs transition-colors"
        >
          <Award className="h-4 w-4" /> Issue Digital Certificate
        </button>
      </div>

      {/* Recognition Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recognitionCards.map((card, idx) => (
          <div 
            key={idx}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded text-[11px]">
                  {card.title}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">{card.badge}</span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{card.recipient}</h3>
                <div className="text-xs text-slate-500">{card.role} · {card.dept}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <strong className="text-slate-900">Verified Milestone:</strong> {card.achievement}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400">AY 2025–2026 Honor Roll</span>
              <button
                onClick={() => openCertFor(card.recipient, `${card.title} — ${card.achievement}`)}
                className="flex items-center gap-1 text-xs font-semibold text-amber-800 hover:text-amber-950"
              >
                Confer Certificate <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rankings Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Top Student Innovators */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" /> Top Student Innovators
            </h3>
            <span className="text-[11px] text-slate-400">Ranked by Verified Contributions</span>
          </div>

          <div className="space-y-2">
            {studentRankings.map((st) => (
              <div 
                key={st.rank}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    st.rank === 1 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{st.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-slate-500">{st.dept} · {st.contributions}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">{st.points} pts</div>
                  <button
                    onClick={() => openCertFor(st.name, `Top Student Innovator (Rank #${st.rank})`)}
                    className="text-[11px] text-teal-800 font-semibold hover:underline"
                  >
                    Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Faculty Researchers */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Medal className="h-4 w-4 text-teal-600" /> Top Faculty Researchers
            </h3>
            <span className="text-[11px] text-slate-400">Ranked by Verified Outputs</span>
          </div>

          <div className="space-y-2">
            {facultyRankings.map((fac) => (
              <div 
                key={fac.rank}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                    fac.rank === 1 ? 'bg-teal-100 text-teal-900 border border-teal-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    #{fac.rank}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{fac.name}</div>
                    <div className="text-[11px] text-slate-500">{fac.dept} · {fac.contributions}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold font-mono text-slate-900">{fac.points} pts</div>
                  <button
                    onClick={() => openCertFor(fac.name, `Top Faculty Researcher (Rank #${fac.rank})`)}
                    className="text-[11px] text-teal-800 font-semibold hover:underline"
                  >
                    Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Issued Certificates History Table */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900">Recently Conferred Digital Certificates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">Certificate ID</th>
                <th className="py-2.5 px-3 font-semibold">Recipient</th>
                <th className="py-2.5 px-3 font-semibold">Achievement</th>
                <th className="py-2.5 px-3 font-semibold">Issue Date</th>
                <th className="py-2.5 px-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {db.certificates.map(cert => (
                <tr key={cert.id} className="hover:bg-slate-50">
                  <td className="py-2 px-3 font-mono text-teal-800 font-semibold">{cert.certificateNumber}</td>
                  <td className="py-2 px-3 font-medium text-slate-900">{cert.recipientName} ({cert.recipientRole})</td>
                  <td className="py-2 px-3">{cert.achievementTitle}</td>
                  <td className="py-2 px-3">{cert.issueDate}</td>
                  <td className="py-2 px-3">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {cert.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {isCertOpen && (
        <CertificateModal
          isOpen={true}
          onClose={() => setIsCertOpen(false)}
          presetRecipient={selectedRecipient || undefined}
          presetAchievement={selectedAchievement || undefined}
        />
      )}

    </div>
  );
};
