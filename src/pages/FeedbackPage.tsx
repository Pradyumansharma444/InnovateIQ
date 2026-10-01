import React, { useState } from 'react';
import { MessageSquareText, Star, Send, CheckCircle2, Reply } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Feedback } from '../types';

export const FeedbackPage: React.FC = () => {
  const { db, addFeedback, respondFeedback } = useData();
  const { currentUser, canVerify } = useAuth();

  const [type, setType] = useState<Feedback['type']>('Suggestion');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);

  const [replyId, setReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedback({
      institutionId: currentUser.institutionId,
      type,
      message,
      submittedBy: currentUser.id,
      submittedByName: currentUser.name,
      submittedByRole: currentUser.role,
      rating,
      status: 'Open'
    });

    setMessage('');
    setRating(5);
  };

  const handleSendReply = (fbId: string) => {
    if (!replyText.trim()) return;
    respondFeedback(fbId, replyText);
    setReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Stakeholder Feedback & Continuous Improvement</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          InnovateIQ Stakeholder Feedback Loop · Submit recommendations, report data discrepancies, and track administrative responses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Submit Feedback Form */}
        <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">Submit Institutional Feedback</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Feedback Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="Suggestion">Suggestion / Improvement</option>
                <option value="Innovation Portal Feedback">Portal Feedback</option>
                <option value="Project Feedback">Project Inquiry</option>
                <option value="Department Feedback">Department Feedback</option>
                <option value="Event Feedback">Event Feedback</option>
                <option value="Issue">Discrepancy / Issue</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Ecosystem Rating</label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= rating ? 'fill-amber-400 text-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Your Message / Suggestion *</label>
              <textarea
                rows={4}
                required
                placeholder="Share constructive observations on indicator parameters, missing publications, or collaboration ideas..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Send className="h-3.5 w-3.5" /> Submit to Innovation Council
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Recent Stakeholder Feedback & Admin Responses</h2>
          
          <div className="space-y-3">
            {db.feedback.map(fb => (
              <div 
                key={fb.id}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{fb.submittedByName}</span>
                    <span className="text-[10px] text-slate-400">({fb.submittedByRole})</span>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded">
                      {fb.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[...Array(fb.rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">
                  "{fb.message}"
                </p>

                {/* Admin response if exists */}
                {fb.adminResponse ? (
                  <div className="p-3 rounded-lg bg-teal-50 border border-teal-100 text-xs text-teal-950 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-teal-900">
                      <span>Official Response by {fb.respondedBy || 'Administration'}:</span>
                      <span className="text-[10px] text-teal-700 font-mono">
                        {fb.respondedAt ? new Date(fb.respondedAt).toLocaleDateString() : 'Recorded'}
                      </span>
                    </div>
                    <div>{fb.adminResponse}</div>
                  </div>
                ) : (
                  canVerify && (
                    <div className="pt-2 border-t border-slate-100">
                      {replyId === fb.id ? (
                        <div className="space-y-2">
                          <textarea
                            rows={2}
                            placeholder="Enter official institutional reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setReplyId(null)}
                              className="px-3 py-1 text-xs text-slate-500 hover:text-slate-800"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendReply(fb.id)}
                              className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 rounded"
                            >
                              Send Response
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setReplyId(fb.id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-teal-800 hover:text-teal-950"
                        >
                          <Reply className="h-3 w-3" /> Reply as Administrator
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
