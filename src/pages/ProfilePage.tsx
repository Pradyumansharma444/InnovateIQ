import React, { useState } from 'react';
import { User as UserIcon, Award, Lightbulb, BookOpen, Rocket, Trophy, Calendar, CheckCircle2, Shield, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { OnboardingModal } from '../components/OnboardingModal';

export const ProfilePage: React.FC = () => {
  const { currentUser, userRoles } = useAuth();
  const { db } = useData();
  const [isEditOnboardingOpen, setIsEditOnboardingOpen] = useState(false);

  // Find records authored by or associated with currentUser
  const userProjects = db.projects.filter(p => p.createdBy === currentUser.id || p.teamMembers.includes(currentUser.name));
  const userPubs = db.publications.filter(p => p.createdBy === currentUser.id || p.authors.includes(currentUser.name));
  const userPatents = db.patents.filter(p => p.createdBy === currentUser.id || p.inventors.includes(currentUser.name));
  const userCertificates = db.certificates.filter(c => c.recipientName === currentUser.name);

  const instName = db.institutions.find(i => i.id === currentUser.institutionId)?.institutionName || 'All India Institute of Ayurveda';
  const deptName = db.departments.find(d => d.id === currentUser.departmentId)?.name;

  // Chronological timeline milestones
  const timelineMilestones = [
    { year: '2024', title: 'Filed Indian Patent for Multimodal Pulse Sensor', category: 'Patent', verified: true },
    { year: '2025', title: 'Winner - National AYUSH Innovation Grand Finale', category: 'Hackathon', verified: true },
    { year: '2025', title: 'Publication in IEEE Transactions on Biomedical Eng.', category: 'Publication', verified: true },
    { year: '2025', title: 'Incubated NadiVeda Healthtech Solutions Pvt Ltd', category: 'Startup', verified: true },
    { year: '2025', title: 'Conferred Certificate of Innovation Excellence #0841', category: 'Recognition', verified: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Profile Header Card */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={currentUser.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"} 
            alt={currentUser.name} 
            className="h-16 w-16 rounded-2xl border-2 border-teal-700 shadow-xs object-cover"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />
                Verified Portal Access
              </span>
            </div>

            {/* Active Onboarding Roles */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[11px] text-slate-500 font-medium">Roles:</span>
              {userRoles.map(r => (
                <span key={r} className="text-[10px] font-bold uppercase px-2 py-0.5 bg-teal-100 text-teal-900 rounded-md border border-teal-200">
                  {r}
                </span>
              ))}
            </div>

            <div className="text-xs text-slate-600 font-medium pt-0.5">
              {currentUser.designation || 'Institutional Innovator'} · <span className="font-mono text-slate-800">{currentUser.email}</span>
            </div>
            <div className="text-xs text-slate-500">
              {instName} {deptName ? `· ${deptName}` : ''}
            </div>
          </div>
        </div>

        {/* Individual Score Card & Edit Preferences Action */}
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 text-center min-w-[160px] w-full">
            <div className="text-[11px] font-bold uppercase text-teal-800">Personal Innovation Score</div>
            <div className="text-3xl font-extrabold text-teal-950 font-mono tabular-nums mt-0.5">
              88.5
            </div>
            <div className="text-[10px] text-teal-700 font-medium">Rank #1 in Dept</div>
          </div>

          <button
            onClick={() => setIsEditOnboardingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Settings className="h-3.5 w-3.5 text-teal-700" />
            <span>Update Roles & Preferences</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-xs text-slate-500">Projects Tracked</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{userProjects.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-xs text-slate-500">Publications</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{userPubs.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-xs text-slate-500">Patents Registered</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{userPatents.length}</div>
        </div>
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="text-xs text-slate-500">Certificates Conferred</div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">{userCertificates.length || 1}</div>
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Chronological Innovation Journey & Milestones</h2>
          <p className="text-xs text-slate-500">Verified academic and entrepreneurial accomplishments timeline</p>
        </div>

        <div className="relative border-l border-slate-200 ml-4 space-y-6 pt-2">
          {timelineMilestones.map((item, idx) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-2 top-1 h-4 w-4 rounded-full bg-teal-600 border-2 border-white" />
              
              <div className="p-3.5 rounded-lg border border-slate-100 bg-slate-50/70 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-teal-800">{item.year}</span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {item.category}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">{item.title}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Official Institutional Verification Complete
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Preferences Modal */}
      <OnboardingModal
        isOpen={isEditOnboardingOpen}
        onClose={() => setIsEditOnboardingOpen(false)}
      />

    </div>
  );
};
