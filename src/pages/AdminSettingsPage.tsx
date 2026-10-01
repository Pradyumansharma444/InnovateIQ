import React, { useState } from 'react';
import { Building2, Layers, Users, Shield, RotateCcw, Plus, CheckCircle2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

export const AdminSettingsPage: React.FC = () => {
  const { db, resetDatabase } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'departments' | 'institutions' | 'users' | 'audit'>('departments');

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Institutional Administration & Governance</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-institution profiles, departmental structures, user rosters, and immutable audit logs.
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Reset database to clean Ministry of AYUSH demonstration state?')) {
              resetDatabase();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset Demo Database
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('departments')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'departments'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="inline h-3.5 w-3.5 mr-1" /> Department Management ({db.departments.length})
        </button>
        <button
          onClick={() => setActiveTab('institutions')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'institutions'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="inline h-3.5 w-3.5 mr-1" /> Participating Institutes ({db.institutions.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'users'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="inline h-3.5 w-3.5 mr-1" /> User Directory ({db.users.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`py-2 px-3.5 font-semibold border-b-2 transition-colors ${
            activeTab === 'audit'
              ? 'border-teal-700 text-teal-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="inline h-3.5 w-3.5 mr-1" /> Master Audit Trails ({db.auditLogs.length})
        </button>
      </div>

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {db.departments.map(dept => {
              const projCount = db.projects.filter(p => p.departmentId === dept.id).length;
              const pubCount = db.publications.filter(p => p.departmentId === dept.id).length;
              const patCount = db.patents.filter(p => p.departmentId === dept.id).length;

              return (
                <div key={dept.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-teal-800">{dept.code}</span>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {dept.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{dept.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{dept.description}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <div>Department Head: <strong className="text-slate-900">{dept.headName}</strong></div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>Faculty: {dept.facultyCount}</span>
                      <span>Scholars: {dept.studentCount}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Projects: {projCount}</span>
                    <span>Publications: {pubCount}</span>
                    <span>Patents: {patCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Institutions Tab */}
      {activeTab === 'institutions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {db.institutions.map(inst => (
              <div key={inst.id} className="p-6 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-teal-800">{inst.institutionCode}</span>
                  <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {inst.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{inst.institutionName}</h3>
                  <div className="text-xs text-slate-500">{inst.institutionType} · Est. {inst.establishedYear}</div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {inst.description}
                </p>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <div>Address: {inst.address}, {inst.city}, {inst.state}</div>
                  <div>Official Email: {inst.email} · Phone: {inst.phone}</div>
                  <div>Website: <a href={inst.website} target="_blank" rel="noreferrer" className="text-teal-800 underline">{inst.website}</a></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Designation & Affiliation</th>
                <th className="py-3 px-4 font-semibold">Identifiers</th>
                <th className="py-3 px-4 font-semibold text-right">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {db.users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded capitalize">
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-800 font-medium">{u.designation}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                    {u.employeeId || u.rollNumber || '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Module</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Record Title</th>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Details / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {db.auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-400">
                    {new Date(log.changedAt).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                      {log.recordType}
                    </span>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      log.action === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      log.action === 'Created' ? 'bg-teal-100 text-teal-800' :
                      log.action === 'Updated' ? 'bg-indigo-100 text-indigo-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                    {log.recordTitle}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-slate-800 font-medium">{log.changedByName}</span>
                    <span className="text-[10px] text-slate-400 block capitalize">{log.changedByRole.replace('_', ' ')}</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 max-w-sm truncate text-[11px]">
                    {log.reason || log.newValue || 'Standard audit record'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
