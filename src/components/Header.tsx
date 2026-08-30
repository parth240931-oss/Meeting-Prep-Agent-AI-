import React from 'react';
import { Sparkles, Briefcase, Zap, Volume2, ShieldCheck, History } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  savedCount: number;
  onSelectSample: (companyName: string) => void;
  selectedCompany?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  savedCount,
  onSelectSample,
  selectedCompany,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#E5E2D9] bg-[#F8F6F1]/95 backdrop-blur-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Editorial Brand Identity */}
        <div className="flex items-center gap-4">
          <div className="border-r border-[#E5E2D9] pr-4 sm:pr-6">
            <div className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#8C8980]">
              Autonomous Research
            </div>
            <h1 className="text-2xl font-black italic tracking-tight font-serif text-[#1A1A1A] leading-tight">
              Vantage<span className="text-orange-600 not-italic">.</span>
            </h1>
          </div>

          <div className="hidden lg:block">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
              Executive Briefing Engine
            </div>
            <p className="text-xs text-[#4A4842] font-serif italic">
              Autonomous tool chaining & intelligence synthesis
            </p>
          </div>
        </div>

        {/* Right: Actions & History */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Preset Company Switcher */}
          <div className="hidden md:flex items-center gap-1 bg-[#EFEDE7] p-1 border border-[#E5E2D9] text-xs">
            <span className="px-2 text-[10px] uppercase font-bold tracking-wider text-[#8C8980]">
              Sample:
            </span>
            {['Linear', 'Ramp', 'Supabase', 'Datadog'].map((company) => (
              <button
                key={company}
                onClick={() => onSelectSample(company)}
                className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all ${
                  selectedCompany === company
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'text-[#4A4842] hover:text-[#1A1A1A] hover:bg-[#E5E2D9]/60'
                }`}
              >
                {company}
              </button>
            ))}
          </div>

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-2 border border-[#E5E2D9] bg-[#FDFCF9] hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all"
            title="Saved meeting briefs"
          >
            <History className="w-3.5 h-3.5 text-[#8C8980]" />
            <span className="hidden sm:inline">Briefs Index</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#1A1A1A] text-white text-[10px] font-mono font-bold ml-0.5">
                {savedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
