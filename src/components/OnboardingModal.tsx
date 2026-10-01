import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Building2, Layers, CheckCircle2, UserCheck, 
  ArrowRight, ArrowLeft, GraduationCap, Microscope, Rocket, 
  Briefcase, ShieldCheck, Check 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, completeOnboarding } = useAuth();
  const { db, showToast } = useData();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['student']);
  const [institutionId, setInstitutionId] = useState<string>('inst-1');
  const [departmentId, setDepartmentId] = useState<string>('dept-3');

  if (!isOpen) return null;

  const roleOptions = [
    { 
      id: 'student', 
      title: 'Student', 
      desc: 'Projects, Hackathons, Patents, Publications & Achievements',
      icon: GraduationCap 
    },
    { 
      id: 'faculty', 
      title: 'Faculty', 
      desc: 'Translational R&D, Research, Patents, Publications & Grants',
      icon: UserCheck 
    },
    { 
      id: 'researcher', 
      title: 'Researcher', 
      desc: 'Scientific Papers, Patents, Grants & Peer Collaboration',
      icon: Microscope 
    },
    { 
      id: 'entrepreneur', 
      title: 'Entrepreneur / Startup', 
      desc: 'Incubation, Venture Capital, Startups & Commercialization',
      icon: Rocket 
    },
    { 
      id: 'industry', 
      title: 'Industry / Mentor', 
      desc: 'Mentorship, Technology Transfer & Industry Consultations',
      icon: Briefcase 
    },
    { 
      id: 'other', 
      title: 'Other Stakeholder', 
      desc: 'Institutional Innovation Tracking & Institutional Oversight',
      icon: ShieldCheck 
    }
  ];

  const toggleRole = (roleId: string) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter(r => r !== roleId));
      }
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  const handleFinish = () => {
    completeOnboarding(selectedRoles, institutionId, departmentId);
    showToast('Profile onboarding completed! Welcome to InnovateIQ Portal.');
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header Banner with Step Progress */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 text-white relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-[11px] font-semibold tracking-wide border border-emerald-700/50">
              <Building2 className="h-3 w-3 text-emerald-300" />
              <span>Welcome to InnovateIQ</span>
            </div>

            {/* Step Counter Badge */}
            <div className="text-xs font-mono font-bold text-teal-300 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-teal-700/50">
              Step {step} of 3
            </div>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white">
            {step === 1 && 'Select Your Role(s)'}
            {step === 2 && 'Select Your Institution'}
            {step === 3 && 'Select Your Department'}
          </h2>
          
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
            {step === 1 && 'Choose one or more roles that best describe your profile.'}
            {step === 2 && 'Select the primary institute you belong to.'}
            {step === 3 && 'Choose your primary department or academic discipline.'}
          </p>

          {/* Wizard Step Progress Bar */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-2 border-t border-teal-800/60">
            <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
            <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
          </div>
        </div>

        {/* Google Authenticated User Profile Chip */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <img 
              src={currentUser.profilePhoto || "https://lh3.googleusercontent.com/a/default-user"} 
              alt={currentUser.name} 
              className="h-7 w-7 rounded-full border border-teal-600 shadow-2xs shrink-0"
            />
            <div className="truncate">
              <span className="font-bold text-slate-900 mr-1.5">{currentUser.name}</span>
              <span className="text-[10px] text-slate-500 font-mono">({currentUser.email || 'Free User'})</span>
            </div>
          </div>
          <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Free Verified Access
          </span>
        </div>

        {/* Wizard Step Content */}
        <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          
          {/* STEP 1: ROLE SELECTION */}
          {step === 1 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Multi-Role Selection (Select all that apply)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {roleOptions.map((opt) => {
                  const isSelected = selectedRoles.includes(opt.id);
                  const Icon = opt.icon;

                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleRole(opt.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-2xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                            {opt.title}
                          </span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 leading-snug">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: INSTITUTION SELECTION */}
          {step === 2 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Academic / Research Institution
              </div>

              <div className="space-y-3">
                {db.institutions.map(inst => {
                  const isSelected = institutionId === inst.id;
                  return (
                    <div
                      key={inst.id}
                      onClick={() => setInstitutionId(inst.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-2xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-slate-900">
                            {inst.institutionName}
                          </div>
                          <div className="text-xs text-slate-500">
                            Code: <span className="font-mono font-semibold">{inst.institutionCode}</span> · {inst.city}, {inst.state}
                          </div>
                        </div>
                      </div>

                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DEPARTMENT SELECTION */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Select Department / Discipline
              </div>

              <div className="space-y-2">
                <div
                  onClick={() => setDepartmentId('')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    departmentId === '' 
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-2xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                      departmentId === '' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">General / Institutional Level</div>
                      <div className="text-[10px] text-slate-500">Broad institutional oversight without specific department assignment</div>
                    </div>
                  </div>
                  {departmentId === '' && <Check className="h-4 w-4 text-emerald-600" />}
                </div>

                {db.departments.map(dept => {
                  const isSelected = departmentId === dept.id;
                  return (
                    <div
                      key={dept.id}
                      onClick={() => setDepartmentId(dept.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20 shadow-2xs' 
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Layers className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {dept.name} <span className="font-mono text-slate-400">({dept.code})</span>
                          </div>
                          <div className="text-[10px] text-slate-500">{dept.description}</div>
                        </div>
                      </div>

                      {isSelected && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              Step 1 of 3: Role Selection
            </span>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((step + 1) as any)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors"
            >
              <span>{step === 1 ? 'Next: Institution' : 'Next: Department'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md transition-colors"
            >
              <span>Complete Setup & Enter Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
