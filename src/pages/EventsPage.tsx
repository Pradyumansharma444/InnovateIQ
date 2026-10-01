import React, { useState } from 'react';
import { Calendar, Plus, Users, Download, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { InnovationEvent } from '../types';
import { ExportService } from '../services/exportService';

export const EventsPage: React.FC = () => {
  const { db, addEvent, selectedDepartmentId, searchQuery } = useData();
  const { currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-3');
  const [eventType, setEventType] = useState<InnovationEvent['eventType']>('Workshop');
  const [organizer, setOrganizer] = useState('AIIA Innovation Cell');
  const [participantsCount, setParticipantsCount] = useState(150);
  const [studentCount, setStudentCount] = useState(120);
  const [facultyCount, setFacultyCount] = useState(30);
  const [outcome, setOutcome] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = db.departments.find(d => d.id === departmentId);
    addEvent({
      institutionId: currentUser.institutionId,
      departmentId,
      departmentName: dept?.name || 'Department',
      title,
      eventType,
      organizer,
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      participantsCount: Number(participantsCount),
      studentCount: Number(studentCount),
      facultyCount: Number(facultyCount),
      outcome,
      status: 'Completed',
      verificationStatus: 'approved'
    });

    setIsCreateOpen(false);
    setTitle('');
    setOutcome('');
  };

  const filteredEvents = db.events.filter(e => {
    const matchesDept = selectedDepartmentId === 'all' || e.departmentId === selectedDepartmentId;
    const matchesQuery = !searchQuery || 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Innovation Events, Ideathons & Bootcamps</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Module H · Institutional workshops, IPR awareness, training sessions, and student ideathons.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
        >
          <Plus className="h-4 w-4" /> Register Event
        </button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map(ev => (
          <div 
            key={ev.id}
            className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 shadow-2xs"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wide">
                  {ev.eventType}
                </span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {ev.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">{ev.title}</h3>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                <div>Organizer: <strong className="text-slate-900">{ev.organizer}</strong></div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Total Attendees: <strong className="text-slate-800 font-mono">{ev.participantsCount}</strong></span>
                  <span>Students: {ev.studentCount} · Faculty: {ev.facultyCount}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Measurable Outcome: </span>
                {ev.outcome}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Dept: {ev.departmentName}</span>
              <span>{ev.startDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Register Innovation Event</h2>
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Ideathon on AI in Traditional Medicine"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department *</label>
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {db.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Type *</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Workshop">Workshop</option>
                    <option value="Ideathon">Ideathon</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Conference">Conference</option>
                    <option value="Entrepreneurship Bootcamp">Bootcamp</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Organizer *</label>
                <input
                  type="text"
                  required
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Total Attendees</label>
                  <input
                    type="number"
                    value={participantsCount}
                    onChange={(e) => setParticipantsCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Students</label>
                  <input
                    type="number"
                    value={studentCount}
                    onChange={(e) => setStudentCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Faculty</label>
                  <input
                    type="number"
                    value={facultyCount}
                    onChange={(e) => setFacultyCount(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Key Outcomes / Deliverables Drafted</label>
                <textarea
                  rows={2}
                  placeholder="e.g. 15 student project ideas shortlisted for seed bio-incubation"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Register Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
