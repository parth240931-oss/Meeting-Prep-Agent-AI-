import React from 'react';
import { MeetingBrief } from '../types';
import { X, Activity, Search, Globe, Users, TrendingUp, CheckCircle2, Brain, ShieldCheck } from 'lucide-react';

interface AuditTrailModalProps {
  brief: MeetingBrief;
  isOpen: boolean;
  onClose: () => void;
}

export const AuditTrailModal: React.FC<AuditTrailModalProps> = ({
  brief,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-[#FDFCF9] text-[#1A1A1A] border border-[#E5E2D9] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E2D9] flex items-center justify-between bg-[#F8F6F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-serif font-light text-[#1A1A1A] flex items-center gap-2">
                Autonomous Agent Execution Audit Trail
                <span className="text-[10px] px-2 py-0.5 border border-[#E5E2D9] bg-[#EFEDE7] text-[#1A1A1A] font-mono uppercase tracking-wider">
                  {brief.companyName}
                </span>
              </h3>
              <p className="text-xs text-[#8C8980] font-serif italic">
                Complete log of queries generated, tools invoked, and autonomous stop decisions.
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

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs bg-[#FDFCF9]">
          {/* Top summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#F8F6F1] p-3.5 border border-[#E5E2D9]">
              <span className="text-[#8C8980] block text-[10px] font-mono uppercase tracking-widest">Total Chained Calls</span>
              <span className="text-lg font-bold text-[#1A1A1A] font-mono">{brief.researchTrace.totalToolsExecuted} Tools</span>
            </div>
            <div className="bg-[#F8F6F1] p-3.5 border border-[#E5E2D9]">
              <span className="text-[#8C8980] block text-[10px] font-mono uppercase tracking-widest">Agent Termination</span>
              <span className="text-sm font-bold text-orange-600 font-mono">Sufficiency Reached</span>
            </div>
            <div className="bg-[#F8F6F1] p-3.5 border border-[#E5E2D9]">
              <span className="text-[#8C8980] block text-[10px] font-mono uppercase tracking-widest">Inference Mode</span>
              <span className="text-sm font-bold text-[#1A1A1A] font-mono">Non-Templated</span>
            </div>
          </div>

          {/* Autonomous Stop Reason */}
          <div className="bg-[#EFEDE7] border border-[#E5E2D9] p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-orange-600 font-bold text-[10px] font-mono uppercase tracking-widest">
              <Brain className="w-3.5 h-3.5" />
              <span>Why The Agent Decided To Stop:</span>
            </div>
            <p className="text-[#1A1A1A] leading-relaxed font-serif text-xs">
              {brief.researchTrace.autonomousStopReason}
            </p>
          </div>

          {/* Chained Tool Invocations */}
          <div className="space-y-3">
            <h4 className="font-mono text-[#8C8980] uppercase tracking-widest text-[10px]">
              Executed Search Steps & Extracted Data:
            </h4>

            {brief.researchTrace.agentDecisions.map((step, idx) => (
              <div key={idx} className="bg-[#F8F6F1] border border-[#E5E2D9] p-4 space-y-2">
                <div className="flex items-center justify-between text-[#8C8980] text-[10px] font-mono">
                  <span className="font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Step {step.stepNumber}: {step.toolCall?.toolName.replace(/_/g, ' ')}
                  </span>
                  <span className="text-orange-600 font-bold">
                    Sufficiency: {step.sufficiencyScore}%
                  </span>
                </div>

                <p className="text-[#1A1A1A] font-serif leading-relaxed">
                  {step.thought}
                </p>

                {step.toolCall?.queryOrTarget && (
                  <div className="bg-[#EFEDE7] p-2 border border-[#E5E2D9] text-[#1A1A1A] font-mono text-[11px] break-all">
                    <span className="text-[#8C8980] mr-1">Query:</span>
                    {step.toolCall.queryOrTarget}
                  </div>
                )}

                {step.toolCall?.resultSummary && (
                  <div className="bg-[#FDFCF9] p-2 border border-[#E5E2D9] text-[#8C8980] font-serif text-[11px]">
                    <span className="text-orange-600 font-semibold font-mono mr-1">Extracted:</span>
                    {step.toolCall.resultSummary}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Queries List */}
          <div className="space-y-2">
            <h4 className="font-mono text-[#8C8980] uppercase tracking-widest text-[10px]">
              Dispatched Autonomous Queries:
            </h4>
            <div className="bg-[#1A1A1A] p-3 text-neutral-200 font-mono text-[11px] border border-neutral-800 space-y-1">
              {brief.researchTrace.searchQueriesUsed.map((q, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-neutral-500 select-none font-bold">[{i + 1}]</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
