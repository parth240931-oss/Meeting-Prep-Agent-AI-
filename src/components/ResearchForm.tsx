import React, { useState } from 'react';
import { Search, Clock, Target, Sparkles, ChevronRight, Compass, ArrowRight, Building2, Layers } from 'lucide-react';
import { ResearchRequest } from '../types';

interface ResearchFormProps {
  onStartResearch: (req: ResearchRequest) => void;
  isLoading: boolean;
  activeCompany?: string;
}

const POPULAR_COMPANIES = [
  { name: 'Linear', context: 'Discovery Call with VP of Engineering' },
  { name: 'Ramp', context: 'Executive Demo with Head of RevOps' },
  { name: 'Supabase', context: 'Technical Architecture Pitch' },
  { name: 'Vercel', context: 'Enterprise Security & Scale Review' },
  { name: 'Stripe', context: 'Platform Partnership Discussion' },
  { name: 'Datadog', context: 'Cloud Cost & Telemetry Acceleration' },
];

const PITCH_PRESETS = [
  'Enterprise Security, SOC2 & Automated Compliance',
  'Developer Infrastructure, Velocity & Tooling',
  'RevOps, Pipeline Automation & AI Sales Intelligence',
  'Cloud Cost Optimization & Multi-Region Resiliency',
  'Modern Data Pipeline & Real-Time Sync Engine',
];

export const ResearchForm: React.FC<ResearchFormProps> = ({
  onStartResearch,
  isLoading,
  activeCompany,
}) => {
  const [companyName, setCompanyName] = useState(activeCompany || '');
  const [meetingTime, setMeetingTime] = useState('Today at 3:00 PM');
  const [meetingContext, setMeetingContext] = useState('');
  const [pitchFocus, setPitchFocus] = useState('Developer Infrastructure & Enterprise Acceleration');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onStartResearch({
      companyName: companyName.trim(),
      meetingTime: meetingTime.trim() || 'Today at 3:00 PM',
      meetingContext: meetingContext.trim() || undefined,
      pitchFocus: pitchFocus.trim() || undefined,
    });
  };

  const handleSelectPreset = (company: string, defaultCtx?: string) => {
    setCompanyName(company);
    if (defaultCtx) setMeetingContext(defaultCtx);
  };

  return (
    <div className="w-full bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 transition-all">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 mb-6 pb-5 border-b border-[#E5E2D9]">
        <div>
          <div className="text-[10px] font-sans font-bold text-orange-600 tracking-[0.25em] uppercase mb-1">
            Dispatch Investigation
          </div>
          <h2 className="text-2xl sm:text-3xl font-light font-serif tracking-tight text-[#1A1A1A]">
            Autonomous Meeting Prep <span className="italic font-normal">Synthesis</span>
          </h2>
          <p className="text-xs text-[#4A4842] font-serif italic mt-1 max-w-2xl">
            Input prospect coordinates. The agent formulates hypotheses, executes chained web & signal lookups, and synthesizes an executive brief.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto px-3 py-1.5 bg-[#EFEDE7] border border-[#E5E2D9] text-[10px] font-sans font-bold tracking-widest text-[#8C8980] uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
          Agent Engine: Standby
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Company Name & Meeting Time */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          <div className="sm:col-span-7 space-y-1.5">
            <label className="block text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Target Prospect / Entity <span className="text-orange-600">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8980]">
                <Building2 className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Linear, Ramp, Datadog, or Stellaris Bio"
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E2D9] bg-[#FDFCF9] text-[#1A1A1A] text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:border-[#1A1A1A] transition-all"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="sm:col-span-5 space-y-1.5">
            <label className="block text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
              Scheduled Call Time
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8980]">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                placeholder="e.g. Today at 14:30 EST, Tomorrow 10 AM"
                className="w-full pl-10 pr-4 py-2.5 border border-[#E5E2D9] bg-[#FDFCF9] text-[#1A1A1A] text-xs sm:text-sm font-sans focus:bg-white focus:outline-none focus:border-[#1A1A1A] transition-all"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8980] mr-1">
            Quick Index:
          </span>
          {POPULAR_COMPANIES.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => handleSelectPreset(c.name, c.context)}
              className={`text-[11px] font-sans px-2.5 py-1 border transition-all font-medium ${
                companyName.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                  : 'bg-[#FDFCF9] text-[#4A4842] border-[#E5E2D9] hover:bg-[#EFEDE7] hover:text-[#1A1A1A]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Optional Collapsible Settings: Pitch Focus & Context */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-[#8C8980] hover:text-[#1A1A1A] transition-colors"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
            {showAdvanced ? 'Hide Pitch Tailoring Parameters' : '+ Customize Persona Angle & Value Focus (Optional)'}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-[#EFEDE7] border border-[#E5E2D9] space-y-3 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4842]">
                    Prospect Stakeholder Role / Call Objective
                  </label>
                  <input
                    type="text"
                    value={meetingContext}
                    onChange={(e) => setMeetingContext(e.target.value)}
                    placeholder="e.g. VP of Engineering & Head of Product"
                    className="w-full px-3 py-2 border border-[#D9D6CE] bg-[#FDFCF9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4842]">
                    Product Pillar / Value Proposition
                  </label>
                  <input
                    type="text"
                    value={pitchFocus}
                    onChange={(e) => setPitchFocus(e.target.value)}
                    placeholder="e.g. Modern Developer Tools, Cloud Cost Optimization"
                    className="w-full px-3 py-2 border border-[#D9D6CE] bg-[#FDFCF9] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                  />
                </div>
              </div>

              {/* Pitch presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980]">
                  Presets:
                </span>
                {PITCH_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPitchFocus(p)}
                    className="text-[10px] px-2 py-0.5 bg-[#FDFCF9] border border-[#D9D6CE] text-[#4A4842] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Launch Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E2D9]">
          <div className="text-xs font-serif italic text-[#8C8980] flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-green-600 shrink-0" />
            <span>Agent autonomously orchestrates web research, SEC/funding lookup, and inference heuristics.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !companyName.trim()}
            className={`w-full sm:w-auto px-8 py-3.5 text-[11px] font-sans font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all ${
              isLoading || !companyName.trim()
                ? 'bg-[#E5E2D9] text-[#A19E95] cursor-not-allowed'
                : 'bg-[#1A1A1A] hover:bg-black text-white active:scale-[0.99] shadow-xs'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Investigating {companyName || 'Target'}...</span>
              </>
            ) : (
              <>
                <span>Begin Autonomous Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
