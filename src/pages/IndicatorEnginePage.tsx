import React, { useState } from 'react';
import { Gauge, Plus, Edit2, Check, AlertCircle, SlidersHorizontal, Calculator } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { IndicatorDefinition } from '../types';

export const IndicatorEnginePage: React.FC = () => {
  const { db, scoreBreakdown, updateIndicator, addIndicator } = useData();
  const { canManageIndicators } = useAuth();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState<number>(0);
  const [editTarget, setEditTarget] = useState<number>(0);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<IndicatorDefinition['category']>('Institutional Impact');
  const [newWeight, setNewWeight] = useState(10);
  const [newTarget, setNewTarget] = useState(15);
  const [newCalcMethod, setNewCalcMethod] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const activeIndicators = db.indicators.filter(i => i.isActive);
  const totalWeight = activeIndicators.reduce((sum, i) => sum + i.weight, 0);

  const handleStartEdit = (ind: IndicatorDefinition) => {
    setEditingId(ind.id);
    setEditWeight(ind.weight);
    setEditTarget(ind.target);
  };

  const handleSaveEdit = (indId: string) => {
    updateIndicator(indId, {
      weight: Number(editWeight),
      target: Number(editTarget)
    });
    setEditingId(null);
  };

  const handleToggleActive = (ind: IndicatorDefinition) => {
    updateIndicator(ind.id, { isActive: !ind.isActive });
  };

  const handleCreateIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    addIndicator({
      code: newCode || `IND_CUSTOM_${Date.now().toString().slice(-4)}`,
      name: newName,
      category: newCategory,
      weight: Number(newWeight),
      target: Number(newTarget),
      calculationMethod: newCalcMethod || 'Aggregated count of verified records',
      reportingPeriod: 'Annual',
      assignedTo: 'Institution',
      isActive: true,
      description: newDesc
    });

    setIsAddOpen(false);
    setNewCode('');
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Configurable Indicator & Scoring Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent institutional index formulation, weight distribution, and annual performance targets.
          </p>
        </div>

        {canManageIndicators && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 shadow-2xs"
          >
            <Plus className="h-4 w-4" /> Define New Indicator
          </button>
        )}
      </div>

      {/* Weight Summary Banner */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Total Configured Weight:</span>
            <span className={`text-base font-extrabold font-mono tabular-nums ${totalWeight === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {totalWeight}%
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {totalWeight === 100 
              ? 'Weights are normalized to 100%. Scores accurately reflect ministerial evaluation guidelines.' 
              : 'Warning: Total active indicator weights do not sum to 100%. Indicator score auto-normalizes proportionally.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-500">Current Computed Score</div>
            <div className="text-2xl font-bold text-teal-800 font-mono tabular-nums">
              {scoreBreakdown.overallScore.toFixed(1)} / 100
            </div>
          </div>
        </div>
      </div>

      {/* Indicators List Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Code & Indicator</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold text-right">Weight (%)</th>
                <th className="py-3 px-4 font-semibold text-right">Target</th>
                <th className="py-3 px-4 font-semibold text-right">Verified Actual</th>
                <th className="py-3 px-4 font-semibold text-right">Achieved %</th>
                <th className="py-3 px-4 font-semibold text-right">Score Points</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {db.indicators.map(ind => {
                const res = scoreBreakdown.results.find(r => r.indicatorId === ind.id);
                const isEditing = editingId === ind.id;

                return (
                  <tr key={ind.id} className={`transition-colors ${!ind.isActive ? 'opacity-50 bg-slate-50' : 'hover:bg-slate-50/80'}`}>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-mono text-[10px] text-slate-400">{ind.code}</div>
                      <div className="font-bold text-slate-900 line-clamp-1">{ind.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{ind.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium text-slate-700">{ind.category}</span>
                    </td>

                    {/* Weight Column */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editWeight}
                          onChange={(e) => setEditWeight(Number(e.target.value))}
                          className="w-16 p-1 border border-slate-300 rounded text-right font-mono text-xs"
                        />
                      ) : (
                        <span className="font-mono tabular-nums font-bold text-slate-900">{ind.weight}%</span>
                      )}
                    </td>

                    {/* Target Column */}
                    <td className="py-3 px-4 text-right">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editTarget}
                          onChange={(e) => setEditTarget(Number(e.target.value))}
                          className="w-16 p-1 border border-slate-300 rounded text-right font-mono text-xs"
                        />
                      ) : (
                        <span className="font-mono tabular-nums text-slate-700">{ind.target}</span>
                      )}
                    </td>

                    {/* Verified Actual */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      {res ? res.actual : '—'}
                    </td>

                    {/* Achieved % */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-teal-800">
                      {res ? `${res.achievementPercentage.toFixed(1)}%` : '—'}
                    </td>

                    {/* Score Points */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                      {res ? res.weightedScore.toFixed(1) : '—'}
                    </td>

                    {/* Active/Inactive Badge */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => canManageIndicators && handleToggleActive(ind)}
                        disabled={!canManageIndicators}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                          ind.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                        title="Click to toggle active indicator status"
                      >
                        {ind.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {canManageIndicators && (
                        isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(ind.id)}
                            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
                            title="Save Weight & Target"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(ind)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
                            title="Edit Target & Weight"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Indicator Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Define New Innovation Indicator</h2>
            <form onSubmit={handleCreateIndicator} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="IND_COLLAB_01"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Research">Research</option>
                    <option value="IPR">IPR & Patents</option>
                    <option value="Grants">Grants</option>
                    <option value="Entrepreneurship">Entrepreneurship</option>
                    <option value="Competitions">Competitions</option>
                    <option value="Institutional Impact">Institutional Impact</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Indicator Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Industry Sponsored Translational MoUs"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Weight Percentage (%) *</label>
                  <input
                    type="number"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Annual Institutional Target *</label>
                  <input
                    type="number"
                    required
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Calculation Method / Description</label>
                <textarea
                  rows={2}
                  placeholder="Describes how verified actuals are compiled from submissions"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
                >
                  Save Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
