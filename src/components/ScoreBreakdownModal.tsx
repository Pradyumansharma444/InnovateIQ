import React from 'react';
import { X, HelpCircle, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ScoreBreakdownModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { scoreBreakdown } = useData();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Institutional Score Calculation Methodology</h2>
              <p className="text-xs text-slate-500">Ministry of AYUSH — Transparent Multi-Indicator Evaluation Formula</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Formula explanation box */}
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-600">The Mathematical Formula</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              The overall score is a normalized composite of active indicators. Each indicator's verified actual performance is benchmarked against its annual institutional target:
            </p>
            <div className="bg-white p-3 rounded border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
              <div>Achievement Ratio = min(Verified Actual / Target, 1.0)</div>
              <div>Weighted Score = Achievement Ratio × Indicator Weight (%)</div>
              <div className="font-semibold text-teal-700 pt-1 border-t border-slate-100">
                Institutional Score = Sum(Weighted Scores of All Active Indicators)
              </div>
            </div>
            <p className="text-xs text-slate-500">
              Note: Only officially verified and approved records contribute to the actual counts. Unverified or pending submissions remain in the review pipeline.
            </p>
          </div>

          {/* Current Score Summary */}
          <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-100">
            <div>
              <div className="text-xs font-semibold text-teal-800 uppercase tracking-wide">Current Composite Score</div>
              <div className="text-2xl font-bold text-teal-900 font-mono tabular-nums">
                {scoreBreakdown.overallScore.toFixed(1)} <span className="text-sm font-normal text-teal-700">/ 100</span>
              </div>
            </div>
            <div className="text-right text-xs text-teal-800 space-y-0.5">
              <div><span className="font-semibold">{scoreBreakdown.totalIndicators}</span> Active Indicators</div>
              <div><span className="font-semibold">{scoreBreakdown.totalApprovedRecords}</span> Total Verified Contributions</div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Indicator</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Weight</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Target</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Verified Actual</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Achieved %</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Score Points</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {scoreBreakdown.results.map((res) => (
                  <tr key={res.indicatorId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs">{res.name}</td>
                    <td className="py-2.5 px-3">{res.category}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{res.weight}%</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">{res.target}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">{res.actual}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-semibold text-teal-700">{res.achievementPercentage}%</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">{res.weightedScore.toFixed(1)}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-flex items-center text-[11px] font-medium ${
                        res.status === 'Exceeded' ? 'text-emerald-700' :
                        res.status === 'On Track' ? 'text-teal-700' :
                        res.status === 'Attention Required' ? 'text-amber-700' : 'text-rose-700'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 font-semibold text-slate-900 border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="py-2.5 px-3">Total Aggregate</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                    {scoreBreakdown.results.reduce((s, r) => s + r.weight, 0)}%
                  </td>
                  <td colSpan={3} className="py-2.5 px-3 text-right text-xs text-slate-500">Cumulative Weighted Score:</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-teal-800 font-bold text-sm">
                    {scoreBreakdown.overallScore.toFixed(1)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4 bg-slate-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
