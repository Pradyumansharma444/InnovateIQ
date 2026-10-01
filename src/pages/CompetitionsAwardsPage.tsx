import React, { useState } from 'react';
import { Trophy, Award as AwardIcon, Plus, Download, History } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Competition, Award } from '../types';
import { ExportService } from '../services/exportService';

export const CompetitionsAwardsPage: React.FC = () => {
  const { db, addCompetition, addAward, selectedDepartmentId, searchQuery } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'competitions' | 'awards'>('competitions');
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [isAwardModalOpen, setIsAwardModalOpen] = useState(false);

  // Competition Form State
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<Competition['eventType']>('Hackathon');
  const [participants, setParticipants] = useState(currentUser.name);
  const [organizer, setOrganizer] = useState('');
  const [position, setPosition] = useState<Competition['position']>('1st Place (Winner)');
  const [awardReward, setAwardReward] = useState('');

  // Award Form State
  const [awardTitle, setAwardTitle] = useState('');
  const [recipient, setRecipient] = useState(currentUser.name);
  const [organization, setOrganization] = useState('');
  const [awardLevel, setAwardLevel] = useState<Award['awardLevel']>('National');
  const [awardDesc, setAwardDesc] = useState('');

  const handleCreateCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    addCompetition({
      institutionId: currentUser.institutionId,
      departmentId: 'dept-3',
      departmentName: 'AyurTech & Digital Health Informatics',
      eventName,
      eventType,
      participantType: 'Student',
      participants: participants.split(',').map(p => p.trim()),
      createdBy: currentUser.id,
      createdByName: currentUser.name,
      date: new Date().toISOString().slice(0, 10),
      organizer,
      position,
      award: awardReward,
      verificationStatus: 'submitted'
    });

    setIsCompModalOpen(false);
    setEventName('');
    setAwardReward('');
  };

  const handleCreateAward = (e: React.FormEvent) => {
    e.preventDefault();
    addAward({
      institutionId: currentUser.institutionId,
      departmentId: 'dept-1',
      departmentName: 'Rasashastra & Bhaishajya Kalpana',
      title: awardTitle,
      recipient,
      recipientId: currentUser.id,
      recipientType: currentUser.role === 'student' ? 'Student' : 'Faculty',
      organization,
      date: new Date().toISOString().slice(0, 10),
      category: 'National Innovation Award',
      description: awardDesc,
      awardLevel,
      verificationStatus: 'submitted'
    });

    setIsAwardModalOpen(false);
    setAwardTitle('');
    setAwardDesc('');
  };

  const filteredCompetitions = db.competitions.filter(c => {
    const matchesDept = selectedDepartmentId === 'all' || c.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      c.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesDept && matchesQuery;
  });

  const filteredAwards = db.awards.filter(a => {
    const matchesDept = selectedDepartmentId === 'all' || a.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.organization.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Competitions, Hackathons & Honors</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Modules F & G · Smart India Hackathons, ideathons, ministry recognitions, and national honors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'competitions' ? (
            <button
              onClick={() => setIsCompModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
            >
              <Plus className="h-4 w-4" /> Log Hackathon Milestone
            </button>
          ) : (
            <button
              onClick={() => setIsAwardModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
            >
              <Plus className="h-4 w-4" /> Add Award / Honor
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('competitions')}
          className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'competitions'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Trophy className="h-4 w-4" /> Hackathons & Competitions ({filteredCompetitions.length})
        </button>
        <button
          onClick={() => setActiveTab('awards')}
          className={`flex items-center gap-2 py-2.5 px-4 font-semibold border-b-2 transition-colors ${
            activeTab === 'awards'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AwardIcon className="h-4 w-4" /> Institutional Awards & Honors ({filteredAwards.length})
        </button>
      </div>

      {/* Competitions View */}
      {activeTab === 'competitions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCompetitions.map(comp => (
            <div 
              key={comp.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                    {comp.eventType}
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {comp.position}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{comp.eventName}</h3>

                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 font-medium">
                  Trophy & Prize: {comp.award}
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <div>Organizer: <span className="font-medium text-slate-800">{comp.organizer}</span></div>
                  <div>Team Members: <span className="text-slate-700">{comp.participants.join(', ')}</span></div>
                  <div className="text-[11px] text-slate-500">Date: {comp.date} · {comp.departmentName}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {comp.verificationStatus}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">v{comp.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Awards View */}
      {activeTab === 'awards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAwards.map(awd => (
            <div 
              key={awd.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wide">
                    {awd.awardLevel} Level
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    {awd.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">{awd.title}</h3>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-700 space-y-1">
                  <div>Conferred To: <strong className="text-slate-900">{awd.recipient}</strong> ({awd.recipientType})</div>
                  <div>Conferring Body: <span className="font-medium text-slate-800">{awd.organization}</span></div>
                  <div className="text-[11px] text-slate-500">Date: {awd.date} · {awd.departmentName}</div>
                </div>

                <p className="text-xs text-slate-600 italic">
                  "{awd.description}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {awd.verificationStatus}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">v{awd.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hackathon Modal */}
      {isCompModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Log Hackathon / Competition Milestone</h2>
            <form onSubmit={handleCreateCompetition} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Event Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National AYUSH Innovation Grand Finale"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Event Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Ideathon">Ideathon</option>
                    <option value="Innovation Conclave">Innovation Conclave</option>
                    <option value="Business Pitch">Business Pitch</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Placement / Position *</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="1st Place (Winner)">1st Place (Winner)</option>
                    <option value="2nd Place (Runner-up)">2nd Place (Runner-up)</option>
                    <option value="3rd Place">3rd Place</option>
                    <option value="Finalist">Finalist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Organizer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ministry of Education / AICTE"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Award / Cash Prize</label>
                  <input
                    type="text"
                    placeholder="Winner Trophy + ₹1,00,000"
                    value={awardReward}
                    onChange={(e) => setAwardReward(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Team Participants (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCompModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Submit Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Award Modal */}
      {isAwardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Record Institutional Honor / Award</h2>
            <form onSubmit={handleCreateAward} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Award Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National AYUSH Young Scientist Award"
                  value={awardTitle}
                  onChange={(e) => setAwardTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Level *</label>
                  <select
                    value={awardLevel}
                    onChange={(e) => setAwardLevel(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="National">National</option>
                    <option value="International">International</option>
                    <option value="State">State</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Conferring Organization *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ministry of AYUSH, Govt. of India"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Citation / Description</label>
                <textarea
                  rows={2}
                  placeholder="Recognized for green nano-synthesis in drug delivery"
                  value={awardDesc}
                  onChange={(e) => setAwardDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAwardModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
