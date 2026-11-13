import React from 'react';
import { AgentStep } from '../types';
import { Search, Globe, Users, TrendingUp, CheckCircle2, Loader2, Sparkles, Brain, ArrowRight, ShieldAlert } from 'lucide-react';

interface AgentLiveProgressProps {
  companyName: string;
  steps: AgentStep[];
  isComplete: boolean;
  currentThought?: string;
  onCancel?: () => void;
}

export const AgentLiveProgress: React.FC<AgentLiveProgressProps> = ({
  companyName,
  steps,
  isComplete,
  currentThought,
}) => {
  // Get latest sufficiency score
  const latestStepWithScore = [...steps].reverse().find((s) => s.sufficiencyScore !== undefined);
  const currentSufficiency = latestStepWithScore?.sufficiencyScore ?? 25;

  // Calculate segmented blocks (5 blocks total)
  const activeSegments = Math.min(5, Math.max(1, Math.round((currentSufficiency / 100) * 5)));

  return (
    <div className="w-full bg-[#F8F6F1] text-[#1A1A1A] border border-[#E5E2D9] shadow-xs my-6 overflow-hidden font-sans">
      {/* Header with live status & confidence index */}
      <div className="p-6 border-b border-[#E5E2D9] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FDFCF9]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-orange-600">
              Active Investigation Chain
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-light font-serif tracking-tight text-[#1A1A1A] mt-1">
            Investigating: <span className="italic font-bold">{companyName}</span>
          </h3>
          <p className="text-xs text-[#4A4842] font-serif italic mt-0.5">
            Agent dynamically probes news, LinkedIn hiring indicators, and filing signals without rigid templates.
          </p>
        </div>

        {/* Segmented Context Confidence Index */}
        <div className="bg-[#EFEDE7] p-3.5 border border-[#E5E2D9] min-w-[220px]">
          <div className="text-[10px] font-bold text-[#8C8980] tracking-widest uppercase mb-1.5 flex items-center justify-between">
            <span>Context Confidence Index</span>
            <span className="text-[#1A1A1A] font-mono font-black">{currentSufficiency}%</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 transition-colors duration-500 ${
                  idx <= activeSegments ? 'bg-[#1A1A1A]' : 'bg-[#D9D6CE]'
                }`}
              />
            ))}
            <span className="ml-2 text-[10px] font-black text-[#1A1A1A]">
              {currentSufficiency >= 75 ? 'HIGH' : currentSufficiency >= 45 ? 'MODERATE' : 'GATHERING'}
            </span>
          </div>
        </div>
      </div>

      {/* Current Internal Thought Banner */}
      {currentThought && !isComplete && (
        <div className="bg-[#EFEDE7] border-b border-[#E5E2D9] p-4 flex items-start gap-3 text-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] block">
              Agent Monologue & Working Hypothesis:
            </span>
            <p className="text-xs font-mono text-[#1A1A1A] leading-relaxed">
              {currentThought}
            </p>
          </div>
        </div>
      )}

      {/* Chained Step Timeline */}
      <div className="p-6 space-y-4">
        <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8C8980] border-b border-[#E5E2D9] pb-2 flex items-center justify-between">
          <span>Agent Logic & Tool Invocations</span>
          <span className="text-[10px] font-mono text-[#4A4842]">
            {steps.filter(s => s.toolCall).length} Tools Dispatched
          </span>
        </div>

        <div className="space-y-3 font-sans">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#FDFCF9] border border-[#E5E2D9] p-4 space-y-2 text-[13px] leading-snug"
            >
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs font-bold text-[#1A1A1A]">
                      <span className="uppercase tracking-wider mr-1 text-[10px] text-[#8C8980]">
                        Step 0{step.stepNumber}:
                      </span>
                      {step.toolCall?.toolName ? step.toolCall.toolName.replace(/_/g, ' ') : step.actionType}
                    </div>

                    {step.toolCall?.status === 'running' && (
                      <span className="text-[10px] font-mono uppercase font-bold text-orange-600 animate-pulse">
                        Executing...
                      </span>
                    )}
                    {step.toolCall?.status === 'completed' && (
                      <span className="text-[10px] font-mono uppercase font-bold text-green-700">
                        ✓ Done
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#4A4842] leading-relaxed">
                    {step.thought}
                  </p>

                  {step.toolCall?.queryOrTarget && (
                    <div className="text-[11px] font-mono bg-[#EFEDE7] p-2 border border-[#E5E2D9] text-[#1A1A1A] break-all">
                      <span className="text-[#8C8980] font-sans mr-1 font-bold">Query:</span>
                      "{step.toolCall.queryOrTarget}"
                    </div>
                  )}

                  {step.toolCall?.resultSummary && (
                    <div className="text-xs text-[#4A4842] bg-[#F8F6F1] p-2.5 border border-[#E5E2D9] leading-relaxed font-serif italic">
                      <span className="text-[#1A1A1A] font-sans font-bold not-italic text-[10px] uppercase tracking-wider block mb-0.5">
                        Extracted Signal:
                      </span>
                      {step.toolCall.resultSummary}
                    </div>
                  )}

                  {step.sufficiencyReasoning && (
                    <div className="text-[11px] bg-[#EFEDE7] p-2 border border-[#E5E2D9] text-[#4A4842] flex items-start gap-2">
                      <span className="text-[9px] font-mono font-bold bg-[#1A1A1A] text-white px-1 py-0.5 uppercase tracking-wider shrink-0 mt-0.5">
                        Score: {step.sufficiencyScore}%
                      </span>
                      <span className="font-sans leading-normal">
                        <span className="font-bold text-[#1A1A1A]">Model Decision:</span> {step.sufficiencyReasoning}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Finalizing Synthesis Indicator */}
          {isComplete && (
            <div className="bg-[#EFEDE7] border border-[#E5E2D9] p-4 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-600 shrink-0" />
              <div>
                <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest block">
                  AGENT STATUS: BRIEF SYNTHESIS COMPLETE
                </span>
                <p className="text-xs text-[#4A4842] font-serif italic">
                  Sufficient signal threshold reached. Generated 10-second opening hook, verbatim talking scripts, and objection pivots.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer status bar */}
      <div className="p-4 bg-[#EFEDE7] text-[10px] font-sans tracking-widest text-[#8C8980] border-t border-[#E5E2D9] uppercase font-bold flex items-center justify-between">
        <span>AGENT STATUS: {isComplete ? 'FINALIZED' : 'PROBING SIGNALS & SYNTHESIZING'}</span>
        <span>AUTONOMOUS WORKFLOW</span>
      </div>
    </div>
  );
};
