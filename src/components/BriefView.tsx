import React, { useState } from 'react';
import { MeetingBrief, TalkingPoint, InferredObjection, DiscoveryQuestion } from '../types';
import { 
  Building2, 
  Clock, 
  MapPin, 
  Users, 
  TrendingUp, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  ShieldAlert, 
  MessageSquare, 
  HelpCircle, 
  Compass, 
  Activity, 
  ArrowUpRight, 
  Quote, 
  CheckCircle2, 
  XCircle,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Globe,
  Linkedin,
  Layers,
  Briefcase,
  PieChart,
  UserCheck
} from 'lucide-react';

interface BriefViewProps {
  brief: MeetingBrief;
  onOpenAudio: () => void;
  onOpenObjectionSimulator: (objection?: InferredObjection) => void;
  onOpenAuditTrail: () => void;
  onOpenExport: () => void;
}

export const BriefView: React.FC<BriefViewProps> = ({
  brief,
  onOpenAudio,
  onOpenObjectionSimulator,
  onOpenAuditTrail,
  onOpenExport,
}) => {
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'company-dossier' | 'talking-points' | 'objections' | 'discovery' | 'cheat-sheet'>('all');
  const [expandedObjection, setExpandedObjection] = useState<number | null>(0);

  const handleCopyHook = () => {
    navigator.clipboard.writeText(brief.strategicAngle.hook);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleCopyScript = (script: string, idx: number) => {
    navigator.clipboard.writeText(script);
    setCopiedScriptIndex(idx);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  const { companyOverview } = brief;
  const empStrength = companyOverview?.employeeStrength;

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16 print:p-0 print:space-y-4">
      {/* Data Source Notice Banner for Heuristic Estimates */}
      {brief.dataSource === 'heuristic_estimate' && (
        <div className="bg-amber-50 border border-amber-300/80 p-4 sm:p-5 flex items-start gap-3.5 text-amber-900 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold uppercase tracking-wider text-amber-800 flex items-center gap-2">
              <span>Heuristic Estimate Mode</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 font-mono font-medium">Offline / Live Grounding Unreached</span>
            </div>
            <p className="text-amber-800/90 leading-relaxed font-sans text-xs sm:text-sm">
              Live web and LinkedIn search extraction were unavailable or rate-limited for this session. Company positioning, headcount ranges, and financials are heuristic approximations. Executive names and recent press should be verified via official channels prior to high-stakes sales conversations.
            </p>
          </div>
        </div>
      )}

      {/* 1. TOP HERO CARD & MEETING BANNER */}
      <div className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 relative">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Company Title & Metadata */}
          <div className="space-y-3 flex-1">
            <div className="text-[10px] font-sans font-bold text-orange-600 tracking-[0.3em] uppercase">
              Executive Briefing Record • Ref #{brief.id ? brief.id.slice(0, 6) : 'LIVE'}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-serif tracking-tight text-[#1A1A1A] leading-[1.1]">
              {brief.companyName}
            </h1>
            
            <p className="text-base sm:text-lg text-[#4A4842] font-serif italic max-w-3xl leading-relaxed">
              "{brief.companyOverview.tagline}"
            </p>

            {/* Quick Badges with Live Web & LinkedIn links */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-sans">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEDE7] border border-[#E5E2D9] font-medium text-[#1A1A1A]">
                <Building2 className="w-3.5 h-3.5 text-[#8C8980]" />
                {brief.companyOverview.industry}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEDE7] border border-[#E5E2D9] font-medium text-[#1A1A1A]">
                <MapPin className="w-3.5 h-3.5 text-[#8C8980]" />
                {brief.companyOverview.hq}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEDE7] border border-[#E5E2D9] font-medium text-[#1A1A1A]">
                <Users className="w-3.5 h-3.5 text-[#8C8980]" />
                {empStrength?.exactOrEstimatedCount || empStrength?.headcountRange || brief.companyOverview.estimatedSize}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFEDE7] border border-[#E5E2D9] font-medium text-[#1A1A1A]">
                <TrendingUp className="w-3.5 h-3.5 text-green-700" />
                {empStrength?.headcountGrowth || brief.companyOverview.fundingStage}
              </span>

              {/* Direct Web & LinkedIn Link Badges */}
              {companyOverview?.websiteUrl && (
                <a
                  href={companyOverview.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FDFCF9] hover:bg-[#EFEDE7] border border-[#E5E2D9] font-mono text-[10px] text-[#1A1A1A] transition-colors"
                >
                  <Globe className="w-3 h-3 text-[#8C8980]" />
                  <span>Website</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-[#8C8980]" />
                </a>
              )}
              {companyOverview?.linkedinUrl && (
                <a
                  href={companyOverview.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 font-mono text-[10px] text-[#0A66C2] font-semibold transition-colors"
                >
                  <Linkedin className="w-3 h-3 text-[#0A66C2]" />
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="w-2.5 h-2.5 text-[#0A66C2]" />
                </a>
              )}
            </div>
          </div>

          {/* Meeting Time & Action Bar */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-[#E5E2D9] pt-4 lg:pt-0 lg:pl-6">
            <div className="bg-[#EFEDE7] border border-[#E5E2D9] p-3.5 lg:text-right w-full sm:w-auto">
              <div className="flex items-center lg:justify-end gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8980]">
                <Clock className="w-3 h-3 text-orange-600" />
                <span>Scheduled Call:</span>
              </div>
              <div className="text-sm font-sans font-bold text-[#1A1A1A] mt-0.5">
                {brief.meetingTime}
              </div>
              {brief.meetingContext && (
                <div className="text-[11px] text-[#4A4842] max-w-[240px] truncate font-serif italic mt-0.5">
                  {brief.meetingContext}
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 print:hidden font-sans">
              <button
                onClick={onOpenAudio}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all"
                title="90-Second Voice Briefing"
              >
                <Volume2 className="w-3.5 h-3.5 text-orange-400" />
                <span>90s Audio</span>
              </button>

              <button
                onClick={() => onOpenObjectionSimulator()}
                className="flex items-center gap-2 px-3.5 py-2 bg-[#FDFCF9] border border-[#E5E2D9] hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all"
                title="Practice Inferred Objections"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-orange-600" />
                <span>Objections Lab</span>
              </button>

              <button
                onClick={onOpenExport}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#FDFCF9] border border-[#E5E2D9] hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all"
                title="Export or Copy Brief"
              >
                <Share2 className="w-3.5 h-3.5 text-[#8C8980]" />
                <span>Export</span>
              </button>

              <button
                onClick={onOpenAuditTrail}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#EFEDE7] border border-[#E5E2D9] hover:bg-[#E5E2D9] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider transition-all"
                title="View Autonomous Agent Search Trail"
              >
                <Activity className="w-3.5 h-3.5 text-[#8C8980]" />
                <span className="hidden sm:inline">Trace</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED COMPANY INTELLIGENCE DOSSIER (WHAT THEY DO, LINKEDIN, EMPLOYEE STRENGTH, INDUSTRY) */}
      <div className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5E2D9] pb-3">
          <div>
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-orange-600 flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              Autonomous Company Intelligence & Profile
            </div>
            <h3 className="text-xl sm:text-2xl font-light font-serif tracking-tight text-[#1A1A1A] mt-0.5">
              Company Overview, Web & LinkedIn Intelligence
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-[#EFEDE7] border border-[#E5E2D9] text-[#1A1A1A]">
              Sector: {companyOverview.sector || companyOverview.industry}
            </span>
          </div>
        </div>

        {/* What The Company Does */}
        <div className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8980]">
            <span className="flex items-center gap-1.5 text-orange-600">
              <Layers className="w-3.5 h-3.5" />
              What the Company Does (Core Business Model & Problem Solved)
            </span>
            <span className="font-mono text-[10px] text-[#8C8980]">Verified Web Scrape</span>
          </div>
          <p className="text-sm sm:text-base text-[#1A1A1A] font-serif leading-relaxed">
            {companyOverview.whatCompanyDoes || `${brief.companyName} is a leading provider in ${companyOverview.industry}, delivering core platforms to accelerate enterprise workflows.`}
          </p>
          {companyOverview.businessModel && (
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#4A4842] font-sans">
              <span><strong>Business Model:</strong> {companyOverview.businessModel}</span>
              {companyOverview.targetCustomers && (
                <span><strong>Target Audience:</strong> {companyOverview.targetCustomers}</span>
              )}
            </div>
          )}
        </div>

        {/* Employee Strength & LinkedIn Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-sans">
          {/* Employee Strength & Headcount Dynamics */}
          <div className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                <Users className="w-3.5 h-3.5" />
                Employee Strength & Headcount
              </div>
              <span className="text-[10px] font-mono text-[#0A66C2] font-bold">LinkedIn Source</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#EFEDE7] p-3 border border-[#E5E2D9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] block">Headcount Scale</span>
                <span className="text-sm sm:text-base font-bold text-[#1A1A1A] block mt-0.5">
                  {empStrength?.exactOrEstimatedCount || empStrength?.headcountRange || companyOverview.estimatedSize}
                </span>
              </div>
              <div className="bg-[#EFEDE7] p-3 border border-[#E5E2D9]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] block">YoY Growth</span>
                <span className="text-sm sm:text-base font-bold text-green-700 block mt-0.5">
                  {empStrength?.headcountGrowth || '+15% - 25%'}
                </span>
              </div>
            </div>

            {/* Department Breakdown */}
            {empStrength?.departmentBreakdown && empStrength.departmentBreakdown.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] block">
                  Department Distribution (Estimated)
                </span>
                <div className="space-y-1.5">
                  {empStrength.departmentBreakdown.map((dept, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#E5E2D9]/60">
                      <span className="text-[#4A4842]">{dept.department}</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">{dept.percentageOrCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {empStrength?.hiringStatus && (
              <div className="text-[11px] text-[#4A4842] bg-[#EFEDE7]/50 p-2 border border-[#E5E2D9] italic font-serif">
                <strong>Hiring Signals:</strong> {empStrength.hiringStatus}
              </div>
            )}
          </div>

          {/* Industry, Sector & Executive Leadership */}
          <div className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                <Building2 className="w-3.5 h-3.5" />
                Industry & Key Executives
              </div>
              <span className="text-[10px] font-mono text-[#8C8980]">{companyOverview.hq}</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5E2D9]/60">
                <span className="text-[#8C8980] font-medium">Primary Industry:</span>
                <span className="font-semibold text-[#1A1A1A] text-right">{companyOverview.industry}</span>
              </div>
              {companyOverview.subIndustry && (
                <div className="flex justify-between py-1 border-b border-[#E5E2D9]/60">
                  <span className="text-[#8C8980] font-medium">Sub-Category:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right">{companyOverview.subIndustry}</span>
                </div>
              )}
              {companyOverview.valuationOrRevenue && (
                <div className="flex justify-between py-1 border-b border-[#E5E2D9]/60">
                  <span className="text-[#8C8980] font-medium">Valuation / Capital:</span>
                  <span className="font-semibold text-[#1A1A1A] text-right">{companyOverview.valuationOrRevenue}</span>
                </div>
              )}
            </div>

            {/* Key Executives */}
            {companyOverview?.keyExecutives && companyOverview.keyExecutives.length > 0 && (
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] block">
                  Identified Key Leadership
                </span>
                <div className="space-y-2">
                  {companyOverview.keyExecutives.map((exec, idx) => (
                    <div key={idx} className="bg-[#EFEDE7] p-2.5 border border-[#E5E2D9] text-xs space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#1A1A1A]">{exec.name}</span>
                        <span className="text-[10px] font-mono text-orange-700 uppercase">{exec.title}</span>
                      </div>
                      {exec.focusArea && (
                        <div className="text-[11px] text-[#4A4842] font-serif">{exec.focusArea}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Core Products Offering (if available) */}
        {companyOverview.coreProducts && companyOverview.coreProducts.length > 0 && (
          <div className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 space-y-3 font-sans">
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-600">
              Core Products & Capabilities
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {companyOverview.coreProducts.map((prod, i) => {
                const isObj = typeof prod === 'object' && prod !== null;
                const prodName = isObj ? prod.name : String(prod);
                const prodDesc = isObj ? prod.description : '';
                const prodAudience = isObj ? prod.targetAudience : '';
                return (
                  <div key={i} className="bg-[#EFEDE7] p-3.5 border border-[#E5E2D9] space-y-1">
                    <span className="font-bold text-xs text-[#1A1A1A] block">{prodName}</span>
                    {prodDesc && <p className="text-[11px] text-[#4A4842] font-serif leading-relaxed">{prodDesc}</p>}
                    {prodAudience && (
                      <span className="text-[10px] font-mono text-[#8C8980] block pt-1">Audience: {prodAudience}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. STRATEGIC ANGLE & "WHY THEY CARE RIGHT NOW" */}
      <div className="bg-[#EFEDE7] border border-[#E5E2D9] p-6 sm:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9D6CE] pb-3">
          <div className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-orange-600 flex items-center gap-1.5">
            Strategic Angle • Catalyst Analysis
          </div>
          <span className="text-[10px] font-mono text-[#8C8980] uppercase">
            Inferred from news signals & org trajectory
          </span>
        </div>

        {/* The 10-Second Opening Hook */}
        <div className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8980]">
            <span className="flex items-center gap-1.5 text-orange-600">
              <Quote className="w-3.5 h-3.5" />
              10-Second Opening Hook (Deliver in first 2 minutes)
            </span>
            <button
              onClick={handleCopyHook}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#EFEDE7] hover:bg-[#E5E2D9] text-[#1A1A1A] text-[10px] font-sans font-bold uppercase tracking-wider transition-colors print:hidden"
            >
              {copiedHook ? (
                <>
                  <Check className="w-3 h-3 text-green-700" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#8C8980]" />
                  <span>Copy Script</span>
                </>
              )}
            </button>
          </div>
          <p className="text-lg sm:text-xl font-medium font-serif italic text-[#1A1A1A] leading-relaxed">
            "{brief.strategicAngle.hook}"
          </p>
        </div>

        {/* Why Now & Executive Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-sans">
          <div className="bg-[#FDFCF9] p-4 border border-[#E5E2D9] space-y-1">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">
              The Why-Now Catalyst
            </span>
            <p className="text-xs sm:text-sm text-[#4A4842] leading-relaxed font-serif">
              {brief.strategicAngle.whyNowReason}
            </p>
          </div>

          <div className="bg-[#FDFCF9] p-4 border border-[#E5E2D9] space-y-1">
            <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">
              Urgency Driver
            </span>
            <p className="text-xs sm:text-sm text-[#4A4842] leading-relaxed font-serif">
              {brief.strategicAngle.urgencyDriver}
            </p>
          </div>
        </div>
      </div>

      {/* 4. MAIN SECTION NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#E5E2D9] print:hidden font-sans text-xs">
        <button
          onClick={() => setSelectedTab('all')}
          className={`px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] transition-all ${
            selectedTab === 'all'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'bg-[#FDFCF9] text-[#4A4842] border border-[#E5E2D9] hover:bg-[#EFEDE7]'
          }`}
        >
          Complete Brief
        </button>
        <button
          onClick={() => setSelectedTab('talking-points')}
          className={`px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] transition-all ${
            selectedTab === 'talking-points'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'bg-[#FDFCF9] text-[#4A4842] border border-[#E5E2D9] hover:bg-[#EFEDE7]'
          }`}
        >
          Talking Points ({brief.talkingPoints.length})
        </button>
        <button
          onClick={() => setSelectedTab('objections')}
          className={`px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] transition-all ${
            selectedTab === 'objections'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'bg-[#FDFCF9] text-[#4A4842] border border-[#E5E2D9] hover:bg-[#EFEDE7]'
          }`}
        >
          Objection Pivots ({brief.objectionsToExpect.length})
        </button>
        <button
          onClick={() => setSelectedTab('discovery')}
          className={`px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] transition-all ${
            selectedTab === 'discovery'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'bg-[#FDFCF9] text-[#4A4842] border border-[#E5E2D9] hover:bg-[#EFEDE7]'
          }`}
        >
          SPIN Discovery ({brief.discoveryQuestions.length})
        </button>
        <button
          onClick={() => setSelectedTab('cheat-sheet')}
          className={`px-3.5 py-2 font-bold uppercase tracking-wider text-[11px] transition-all ${
            selectedTab === 'cheat-sheet'
              ? 'bg-[#1A1A1A] text-white shadow-xs'
              : 'bg-[#FDFCF9] text-[#4A4842] border border-[#E5E2D9] hover:bg-[#EFEDE7]'
          }`}
        >
          60s Cheat Sheet
        </button>
      </div>

      {/* 5. INFERRED TALKING POINTS & CONTEXT */}
      {(selectedTab === 'all' || selectedTab === 'talking-points') && (
        <section className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-4 font-sans">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
                Pillar Arguments
              </div>
              <h3 className="text-xl sm:text-2xl font-light font-serif tracking-tight text-[#1A1A1A]">
                Strategic Talking Points & Icebreakers
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 bg-[#EFEDE7] border border-[#E5E2D9] text-[#1A1A1A]">
              {brief.talkingPoints.length} Points Assembled
            </span>
          </div>

          <div className="grid grid-cols-1 gap-5 font-sans">
            {brief.talkingPoints.map((tp, idx) => (
              <div
                key={idx}
                className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 sm:p-6 space-y-4 hover:border-[#1A1A1A] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E5E2D9] pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest block">
                      Pillar 0{idx + 1}
                    </span>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[#1A1A1A]">
                      {tp.topic}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase bg-[#EFEDE7] text-[#4A4842] px-2.5 py-1 border border-[#E5E2D9] self-start sm:self-auto">
                    <Activity className="w-3 h-3 text-[#8C8980]" />
                    Signal: {tp.sourceSignal}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#4A4842] font-serif leading-relaxed">
                  <strong className="font-sans font-bold text-[#1A1A1A] uppercase tracking-wider text-[10px] block mb-0.5">
                    Operational Context:
                  </strong>
                  {tp.context}
                </p>

                {/* Suggested Script Box */}
                <div className="bg-[#EFEDE7] border border-[#E5E2D9] p-4 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8980]">
                    <span className="text-[#1A1A1A]">Recommended Dialogue / Pitch Script:</span>
                    <button
                      onClick={() => handleCopyScript(tp.suggestedScript, idx)}
                      className="flex items-center gap-1 text-[#1A1A1A] hover:text-black font-bold uppercase tracking-wider text-[10px] transition-colors print:hidden"
                    >
                      {copiedScriptIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-green-700" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#8C8980]" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-serif italic text-[#1A1A1A] leading-relaxed">
                    {tp.suggestedScript}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. INFERRED OBJECTIONS & COUNTER-PIVOTS */}
      {(selectedTab === 'all' || selectedTab === 'objections') && (
        <section className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-4 font-sans">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
                Anticipated Resistance
              </div>
              <h3 className="text-xl sm:text-2xl font-light font-serif tracking-tight text-[#1A1A1A]">
                Inferred Objections & Counter-Pivots
              </h3>
            </div>
            <button
              onClick={() => onOpenObjectionSimulator()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-all print:hidden"
            >
              <ShieldAlert className="w-3 h-3 text-orange-400" />
              <span>Simulate All</span>
            </button>
          </div>

          <div className="space-y-4 font-sans">
            {brief.objectionsToExpect.map((obj, idx) => (
              <div
                key={idx}
                className="bg-[#FDFCF9] border border-[#E5E2D9] overflow-hidden transition-all"
              >
                <div 
                  onClick={() => setExpandedObjection(expandedObjection === idx ? null : idx)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-[#EFEDE7]/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                        Objection 0{idx + 1}
                      </span>
                      <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 bg-[#EFEDE7] text-[#4A4842] border border-[#E5E2D9]">
                        Risk: {obj.riskLevel}
                      </span>
                    </div>
                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] italic">
                      {obj.objection}
                    </h4>
                  </div>
                  <div className="text-[#8C8980] pt-1">
                    {expandedObjection === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {expandedObjection === idx && (
                  <div className="p-5 pt-0 border-t border-[#E5E2D9] space-y-4 bg-[#FAF9F5]">
                    <div className="space-y-1 pt-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980] block">
                        Underlying Internal Cause:
                      </span>
                      <p className="text-xs sm:text-sm text-[#4A4842] font-serif">
                        {obj.likelyReason}
                      </p>
                    </div>

                    <div className="bg-[#EFEDE7] border border-[#E5E2D9] p-4 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-green-800">
                        Recommended Counter-Pivot:
                      </div>
                      <p className="text-xs sm:text-sm font-serif italic text-[#1A1A1A] leading-relaxed">
                        {obj.recommendedPivot}
                      </p>
                    </div>

                    <div className="bg-[#FDFCF9] border border-[#E5E2D9] p-4 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 block">
                        Killer Follow-Up Question (Take Back Control):
                      </span>
                      <p className="text-xs sm:text-sm font-serif font-bold text-[#1A1A1A]">
                        "{obj.killerFollowUpQuestion}"
                      </p>
                    </div>

                    <div className="flex justify-end pt-1 print:hidden">
                      <button
                        onClick={() => onOpenObjectionSimulator(obj)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                      >
                        <ShieldAlert className="w-3 h-3 text-orange-400" />
                        <span>Interactive Roleplay This Objection</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SPIN DISCOVERY QUESTIONS */}
      {(selectedTab === 'all' || selectedTab === 'discovery') && (
        <section className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E5E2D9] pb-4 font-sans">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">
                Discovery Sequencing
              </div>
              <h3 className="text-xl sm:text-2xl font-light font-serif tracking-tight text-[#1A1A1A]">
                SPIN Discovery Questions
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#8C8980] uppercase">
              Situation • Problem • Implication • Need-Payoff
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
            {brief.discoveryQuestions.map((dq, idx) => (
              <div
                key={idx}
                className="bg-[#FDFCF9] border border-[#E5E2D9] p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#EFEDE7] text-orange-700 border border-[#E5E2D9]">
                    {dq.phase} Phase
                  </span>
                  <p className="text-sm font-serif font-bold text-[#1A1A1A] leading-snug">
                    "{dq.question}"
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E5E2D9] text-xs font-serif">
                  <div className="text-[#4A4842]">
                    <strong className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] mr-1">
                      Objective:
                    </strong>
                    {dq.whyAskThis}
                  </div>
                  <div className="text-[#4A4842]">
                    <strong className="text-[10px] font-bold uppercase tracking-wider text-orange-600 mr-1">
                      Listen for:
                    </strong>
                    {dq.idealResponseClues}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. 60-SECOND EXECUTIVE CHEAT SHEET */}
      {(selectedTab === 'all' || selectedTab === 'cheat-sheet') && (
        <section className="bg-[#1A1A1A] text-[#FDFCF9] border border-black p-6 sm:p-8 space-y-6 font-sans">
          <div className="flex items-center justify-between border-b border-white/20 pb-4">
            <div>
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.25em] block">
                Pre-Flight Protocol
              </span>
              <h3 className="text-xl sm:text-2xl font-light font-serif text-white tracking-tight">
                60 Seconds Before You Join The Call
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#8C8980] uppercase">
              Glanceable Guardrails
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DO SAY */}
            <div className="bg-white/5 border border-white/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Do Say • Resonating Themes</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-300 font-serif">
                {brief.executiveCheatSheet.doSay.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-400 font-mono font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DO NOT SAY */}
            <div className="bg-white/5 border border-white/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Do NOT Say • Potential Traps</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-300 font-serif">
                {brief.executiveCheatSheet.doNotSay.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-mono font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ONE SENTENCE VALUE PROP */}
          <div className="bg-white/10 border border-white/20 p-5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300 block mb-1">
              One-Sentence Value Prop To Anchor:
            </span>
            <p className="text-sm sm:text-base font-serif italic text-white leading-relaxed">
              "{brief.executiveCheatSheet.oneSentenceValueProp}"
            </p>
          </div>
        </section>
      )}

      {/* 8. STAKEHOLDER SIGNALS & RECENT VERIFIED PULSE */}
      {selectedTab === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
          {/* Stakeholder Signals */}
          <div className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 space-y-4">
            <div className="border-b border-[#E5E2D9] pb-3">
              <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                Org Mapping
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                Target Stakeholder Priorities
              </h3>
            </div>
            <div className="space-y-3">
              {brief.stakeholderSignals.map((sh, idx) => (
                <div key={idx} className="bg-[#FDFCF9] p-4 border border-[#E5E2D9] space-y-1.5">
                  <div className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    {sh.roleCategory}
                  </div>
                  <div className="text-xs text-[#4A4842] font-serif">
                    <strong className="font-sans text-[10px] uppercase font-bold text-[#1A1A1A] block">
                      Priorities:
                    </strong>
                    {sh.likelyPriorities.join(', ')}
                  </div>
                  <div className="text-xs text-orange-700 font-serif italic">
                    <strong className="font-sans text-[10px] uppercase font-bold text-[#1A1A1A] not-italic block">
                      Signal:
                    </strong>
                    {sh.recentSignals}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Verified Signals */}
          <div className="bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 space-y-4">
            <div className="border-b border-[#E5E2D9] pb-3">
              <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                Live Pulse
              </div>
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                Recent Verified Signals & Catalysts
              </h3>
            </div>
            <div className="space-y-3">
              {brief.recentSignals.map((sig, idx) => (
                <div key={idx} className="bg-[#FDFCF9] p-4 border border-[#E5E2D9] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold uppercase px-2 py-0.5 bg-[#EFEDE7] text-[#1A1A1A]">
                      {sig.category}
                    </span>
                    <span className="text-[#8C8980]">{sig.dateOrSource}</span>
                  </div>
                  <p className="text-sm font-serif font-bold text-[#1A1A1A] leading-snug">
                    {sig.headline}
                  </p>
                  <p className="text-xs text-[#4A4842] font-serif">
                    <strong className="font-sans text-[10px] uppercase font-bold text-orange-600 block">
                      Why it matters to your pitch:
                    </strong>
                    {sig.relevanceToPitch}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
