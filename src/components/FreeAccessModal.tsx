import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  X, Mail, User, ShieldCheck, GraduationCap, 
  Microscope, Rocket, Briefcase, Check, Building2, UserCheck 
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const FreeAccessModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithEmail } = useAuth();
  const { showToast } = useData();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('student');

  if (!isOpen) return null;

  const roleOptions = [
    { 
      id: 'student', 
      title: 'Student', 
      desc: 'Access projects, hackathons, patents & submit innovations',
      icon: GraduationCap 
    },
    { 
      id: 'faculty', 
      title: 'Faculty / Professor', 
      desc: 'Track research output, grants, publications & patents',
      icon: UserCheck 
    },
    { 
      id: 'researcher', 
      title: 'Researcher', 
      desc: 'Manage scientific articles, research grants & citations',
      icon: Microscope 
    },
    { 
      id: 'entrepreneur', 
      title: 'Entrepreneur / Startup', 
      desc: 'Track incubated ventures, seed grants & commercialization',
      icon: Rocket 
    },
    { 
      id: 'institution_admin', 
      title: 'Institution Admin', 
      desc: 'Full college governance, indicator engine & report generation',
      icon: Building2 
    },
    { 
      id: 'reviewer', 
      title: 'Reviewer / Auditor', 
      desc: 'Audit submitted records, verify documents & grant approvals',
      icon: ShieldCheck 
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const result = loginWithEmail({
      email: email.trim(),
      name: name.trim(),
      role: selectedRole,
      roles: [selectedRole]
    });

    if (result.isNew) {
      showToast(`Free access granted for ${email.trim()} as ${selectedRole.replace('_', ' ').toUpperCase()}!`);
    } else {
      showToast(`Welcome back! Retained data for ${email.trim()}. Role set to ${selectedRole.replace('_', ' ').toUpperCase()}.`);
    }

    onClose();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center shadow-md shrink-0">
              <Building2 className="h-5 w-5 text-emerald-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/80 text-emerald-200 text-[10px] font-bold tracking-wide border border-emerald-700/50 mb-1">
                FREE INSTANT ACCESS
              </div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Check College Performance Free</h3>
              <p className="text-xs text-slate-300 mt-0.5">Enter your Email ID & choose your role to access performance data & retain your records</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Email ID & Name inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Enter Email ID <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. user@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Re-enter the same email next time to restore your saved data.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Full Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Prof. Rajesh Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-slate-50/50 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Role Selection Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Select Your Role for Free Access <span className="text-rose-500">*</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {roleOptions.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <div
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-600/20 shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-950' : 'text-slate-900'}`}>
                          {role.title}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        {role.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-200" />
            <span>Check College Performance & Get Direct Access</span>
          </button>

        </form>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-2.5 text-[11px] text-slate-500 text-center flex items-center justify-between">
          <span>Free Institutional Access · InnovateIQ Portal</span>
          <span className="font-semibold text-emerald-700">No Credit Card / Passwords Required</span>
        </div>

      </div>
    </div>
  );
};
