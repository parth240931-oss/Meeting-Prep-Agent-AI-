import React, { useState } from 'react';
import { MeetingBrief, InferredObjection } from '../types';
import { X, ShieldAlert, Sparkles, Send, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';

interface ObjectionSimulatorModalProps {
  brief: MeetingBrief;
  initialObjection?: InferredObjection;
  isOpen: boolean;
  onClose: () => void;
}

export const ObjectionSimulatorModal: React.FC<ObjectionSimulatorModalProps> = ({
  brief,
  initialObjection,
  isOpen,
  onClose,
}) => {
  const [selectedObjection, setSelectedObjection] = useState<InferredObjection>(
    initialObjection || brief.objectionsToExpect[0] || {
      objection: 'We build our tooling in-house and do not need a vendor.',
      likelyReason: 'Engineering NIH pride',
      riskLevel: 'High',
      recommendedPivot: 'Validate internal build, reframe to maintenance opportunity cost.',
      killerFollowUpQuestion: 'How many sprints a quarter go to compliance maintenance?',
    }
  );

  const [userResponse, setUserResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    headline: string;
    strengths: string[];
    improvements: string[];
    suggestedModelResponse: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleEvaluate = () => {
    if (!userResponse.trim()) return;
    setIsEvaluating(true);

    // Dynamic heuristic evaluation of the user's pitch response
    setTimeout(() => {
      const resp = userResponse.toLowerCase();
      const hasValidation = /understand|makes sense|great point|completely agree|fair|built|engineered/i.test(resp);
      const hasReframe = /maintenance|time|hours|bandwidth|focus|overhead|compliance|enterprise|scale|roi/i.test(resp);
      const hasFollowUp = /\?|what if|how many|how do you/i.test(resp);

      let score = 65;
      if (hasValidation) score += 12;
      if (hasReframe) score += 13;
      if (hasFollowUp) score += 10;
      score = Math.min(98, score);

      setFeedback({
        score,
        headline: score >= 85 ? 'Excellent Pivot & Control!' : score >= 75 ? 'Strong Response with Good Instincts' : 'Good Start, Needs Stronger Reframe',
        strengths: [
          hasValidation ? 'Immediately validated the buyer without sounding defensive.' : 'Addressed the core objection directly.',
          hasReframe ? 'Effectively shifted the conversation toward engineering opportunity cost and bandwidth.' : 'Maintained executive composure.',
        ],
        improvements: [
          !hasFollowUp ? 'Always end your pivot with a sharp discovery question to return conversational control to the prospect.' : 'Keep the opening validation under 10 words to avoid over-explaining.',
          'Mention real benchmark numbers (e.g., "saving 300 engineering hours a quarter") to make the pitch undeniable.',
        ],
        suggestedModelResponse: `${selectedObjection.recommendedPivot} "${selectedObjection.killerFollowUpQuestion}"`,
      });
      setIsEvaluating(false);
    }, 900);
  };

  const handleReset = () => {
    setUserResponse('');
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-[#FDFCF9] text-[#1A1A1A] border border-[#E5E2D9] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E2D9] flex items-center justify-between bg-[#F8F6F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-serif font-light text-[#1A1A1A] flex items-center gap-2">
                Objection Roleplay Simulator
                <span className="text-[10px] px-2 py-0.5 border border-[#E5E2D9] bg-[#EFEDE7] text-[#1A1A1A] font-mono uppercase tracking-wider">
                  {brief.companyName}
                </span>
              </h3>
              <p className="text-xs text-[#8C8980] font-serif italic">
                Practice handling the specific pushback inferred from {brief.companyName}'s stage and culture.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8980] hover:text-[#1A1A1A] hover:bg-[#EFEDE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-[#FDFCF9]">
          {/* Select Objection Selector */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#8C8980]">
              Select Inferred Objection To Roleplay:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {brief.objectionsToExpect.map((obj, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedObjection(obj);
                    handleReset();
                  }}
                  className={`text-left p-3.5 border text-xs transition-all ${
                    selectedObjection.objection === obj.objection
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                      : 'border-[#E5E2D9] bg-[#F8F6F1] hover:border-[#8C8980] text-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${selectedObjection.objection === obj.objection ? 'text-orange-400' : 'text-orange-600'}`}>
                      {obj.riskLevel} Risk
                    </span>
                    <span className="text-[10px] font-mono opacity-60">#{i + 1}</span>
                  </div>
                  <p className="line-clamp-2 font-serif text-xs leading-snug">{obj.objection}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Current Objection Card */}
          <div className="bg-[#F8F6F1] border border-[#E5E2D9] p-5 space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Prospect Pushback Inferred:</span>
            </div>
            <p className="text-base sm:text-lg font-serif font-light text-[#1A1A1A] italic">
              "{selectedObjection.objection}"
            </p>
            <p className="text-xs text-[#8C8980] font-serif">
              <strong className="text-[#1A1A1A] font-sans font-semibold">Hidden Psychology:</strong> {selectedObjection.likelyReason}
            </p>
          </div>

          {/* User Response Area */}
          {!feedback ? (
            <div className="space-y-3">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]">
                Your Verbal Counter-Pivot:
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Type how you would handle this objection in real life... (e.g. 'That completely makes sense given how much pride your team takes in building v1...')"
                className="w-full h-32 p-4 border border-[#E5E2D9] bg-[#FDFCF9] text-sm font-serif focus:border-[#1A1A1A] outline-none transition-all"
              />

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setUserResponse(selectedObjection.recommendedPivot)}
                  className="text-xs text-[#8C8980] hover:text-[#1A1A1A] underline font-serif italic"
                >
                  Load Recommended Pivot Script
                </button>

                <button
                  onClick={handleEvaluate}
                  disabled={isEvaluating || !userResponse.trim()}
                  className={`px-5 py-2.5 font-mono text-xs uppercase tracking-widest flex items-center gap-2 transition-all ${
                    isEvaluating || !userResponse.trim()
                      ? 'bg-[#EFEDE7] text-[#8C8980] cursor-not-allowed border border-[#E5E2D9]'
                      : 'bg-[#1A1A1A] hover:bg-black text-white shadow-xs'
                  }`}
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Grading Pivot...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      <span>Grade Response</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* AI Feedback Card */
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-[#1A1A1A] text-white p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-orange-400 block">
                      AI Sales Coach Evaluation
                    </span>
                    <h4 className="text-lg font-serif font-light text-white">
                      {feedback.headline}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono">
                      {feedback.score}/100
                    </div>
                    <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-widest">Pivot Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <span className="font-mono text-orange-400 flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> What Worked:
                    </span>
                    <ul className="space-y-1.5 text-neutral-300 font-serif">
                      {feedback.strengths.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-orange-400 flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Sharpening Notes:
                    </span>
                    <ul className="space-y-1.5 text-neutral-300 font-serif">
                      {feedback.improvements.map((s, i) => (
                        <li key={i}>• {s}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Benchmark Model Script */}
                <div className="bg-neutral-900 p-4 border border-neutral-800 space-y-1">
                  <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block">
                    Gold-Standard Benchmark Counter-Pivot:
                  </span>
                  <p className="text-xs text-neutral-200 font-serif italic leading-relaxed">
                    {feedback.suggestedModelResponse}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-[#E5E2D9] bg-[#F8F6F1] hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
