import React, { useState } from 'react';
import { Search, Clock, Target, Sparkles, ChevronRight, Compass, ArrowRight, Building2, Layers, Globe, Zap, Users, Shield, Link2, ExternalLink } from 'lucide-react';
import { ResearchRequest, ConnectorConfig } from '../types';

interface ResearchFormProps {
  onStartResearch: (req: ResearchRequest) => void;
  isLoading: boolean;
  activeCompany?: string;
  onOpenDiscovery?: () => void;
  onOpenConnectors?: () => void;
  connectorConfig?: ConnectorConfig;
}

const POPULAR_COMPANIES = [
  { name: 'Linear', domain: 'https://linear.app', context: 'Discovery Call with VP of Engineering' },
  { name: 'Ramp', domain: 'https://ramp.com', context: 'Executive Demo with Head of RevOps' },
  { name: 'Supabase', domain: 'https://supabase.com', context: 'Technical Architecture Pitch' },
  { name: 'Resend', domain: 'https://resend.com', context: 'Developer Email Infrastructure Review' },
  { name: 'Vercel', domain: 'https://vercel.com', context: 'Enterprise Security & Scale Review' },
  { name: 'Stripe', domain: 'https://stripe.com', context: 'Platform Partnership Discussion' },
];

const POPULAR_INDIAN_COMPANIES = [
  { name: 'Swiggy', domain: 'https://swiggy.com', context: 'Executive Brief on Quick-Commerce Logistics & Growth' },
  { name: 'Zepto', domain: 'https://zeptonow.com', context: 'Dark Store Automation & Supply Chain Partnership' },
  { name: 'Razorpay', domain: 'https://razorpay.com', context: 'Fintech Payments Infrastructure & API Integration' },
  { name: 'Zoho', domain: 'https://zoho.com', context: 'Enterprise SaaS Cloud Architecture Alignment' },
  { name: 'PhysicsWallah', domain: 'https://pw.live', context: 'EdTech Scalability & Student Engagement AI' },
  { name: 'Zerodha', domain: 'https://zerodha.com', context: 'High-Frequency FinTech Architecture & Brokerage' },
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
  onOpenDiscovery,
  onOpenConnectors,
  connectorConfig,
}) => {
  const [companyName, setCompanyName] = useState(activeCompany || '');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [meetingTime, setMeetingTime] = useState('Today at 3:00 PM');
  const [meetingContext, setMeetingContext] = useState('');
  const [pitchFocus, setPitchFocus] = useState('Developer Infrastructure & Enterprise Acceleration');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onStartResearch({
      companyName: companyName.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      meetingTime: meetingTime.trim() || 'Today at 3:00 PM',
      meetingContext: meetingContext.trim() || undefined,
      pitchFocus: pitchFocus.trim() || undefined,
      connectors: connectorConfig,
    });
  };

  const handleSelectPreset = (company: string, domain?: string, defaultCtx?: string) => {
    setCompanyName(company);
    if (domain) setWebsiteUrl(domain);
    if (defaultCtx) setMeetingContext(defaultCtx);
  };

  // Determine if company input looks like a URL
  const isUrlInput = companyName.includes('.') && !companyName.includes(' ') && (companyName.startsWith('http') || companyName.endsWith('.com') || companyName.endsWith('.app') || companyName.endsWith('.io') || companyName.endsWith('.ai') || companyName.endsWith('.dev') || companyName.endsWith('.co'));

  return (
    <div className="w-full bg-[#F8F6F1] border border-[#E5E2D9] p-6 sm:p-8 transition-all font-sans">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6 pb-5 border-b border-[#E5E2D9]">
        <div>
          <div className="text-[10px] font-sans font-bold text-orange-600 tracking-[0.25em] uppercase mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
            <span>Autonomous Intelligence & Web Crawler</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light font-serif tracking-tight text-[#1A1A1A]">
            Autonomous Meeting Prep <span className="italic font-normal">Synthesis</span>
          </h2>
          <p className="text-xs text-[#4A4842] font-serif italic mt-1 max-w-2xl">
            Live internet crawler & connected intelligence. Enter any company name, website domain, or discover entities across the web.
          </p>
        </div>

        {/* Action triggers: Discovery & Connectors */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {onOpenDiscovery && (
            <button
              type="button"
              onClick={onOpenDiscovery}
              className="px-3 py-1.5 bg-white hover:bg-[#EFEDE7] border border-[#1A1A1A] text-[11px] font-sans font-bold tracking-wider text-[#1A1A1A] uppercase flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
            >
              <Search className="w-3.5 h-3.5 text-orange-600" />
              <span>Find Companies</span>
            </button>
          )}

          {onOpenConnectors && (
            <button
              type="button"
              onClick={onOpenConnectors}
              className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-sans font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-2xs transition-all hover:scale-[1.02]"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect Apollo & LinkedIn</span>
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Row 1: Target Company / Website & Meeting Time */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          <div className="sm:col-span-7 space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-sans font-bold text-[#1A1A1A] uppercase tracking-[0.2em]">
                Target Company or Website URL <span className="text-orange-600">*</span>
              </label>
              {isUrlInput && (
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 flex items-center gap-1">
                  <Globe className="w-2.5 h-2.5" /> Direct URL Crawler
                </span>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8C8980]">
                {isUrlInput ? <Globe className="w-4 h-4 text-emerald-600" /> : <Building2 className="w-4 h-4" />}
              </div>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Linear, Ramp, https://resend.com, or any domain..."
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
        <div className="space-y-2 pt-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 border border-orange-200 mr-1 flex items-center gap-1">
              🇮🇳 India Top:
            </span>
            {POPULAR_INDIAN_COMPANIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectPreset(c.name, c.domain, c.context)}
                className={`text-[11px] font-sans px-2.5 py-1 border transition-all font-medium ${
                  companyName.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                    : 'bg-[#FDFCF9] text-[#4A4842] border-[#E5E2D9] hover:bg-[#EFEDE7] hover:text-[#1A1A1A]'
                }`}
              >
                {c.name}
              </button>
            ))}

            {onOpenDiscovery && (
              <button
                type="button"
                onClick={onOpenDiscovery}
                className="text-[11px] font-sans px-2.5 py-1 bg-white border border-dashed border-orange-600 text-orange-700 font-bold hover:bg-orange-50 transition-colors flex items-center gap-1 ml-auto sm:ml-0"
              >
                <Search className="w-3 h-3 text-orange-600" />
                <span>Search 10,000+ Indian Companies →</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#8C8980] mr-1">
              🌐 Global:
            </span>
            {POPULAR_COMPANIES.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => handleSelectPreset(c.name, c.domain, c.context)}
                className={`text-[11px] font-sans px-2 py-0.5 border transition-all font-medium ${
                  companyName.toLowerCase() === c.name.toLowerCase()
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] font-bold'
                    : 'bg-[#FDFCF9] text-[#4A4842] border-[#E5E2D9] hover:bg-[#EFEDE7] hover:text-[#1A1A1A]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Optional Collapsible Settings: Pitch Focus & Direct URL */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-[#8C8980] hover:text-[#1A1A1A] transition-colors"
          >
            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
            {showAdvanced ? 'Hide Advanced Parameters & URL Override' : '+ Direct Website URL & Persona Customization (Optional)'}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-[#EFEDE7] border border-[#E5E2D9] space-y-3 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#4A4842]">
                    Direct Company Website URL (Optional Override)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-[#8C8980]">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-8 pr-3 py-2 border border-[#D9D6CE] bg-[#FDFCF9] text-xs text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
                    />
                  </div>
                </div>

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

        {/* Active Connectors Ribbon */}
        <div className="p-3 bg-[#FDFCF9] border border-[#E5E2D9] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980]">
              Active Signals:
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
              <Globe className="w-3 h-3 text-emerald-600" /> Live Web Crawler
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-orange-800 bg-orange-50 px-2 py-0.5 border border-orange-200">
              <Zap className="w-3 h-3 text-orange-600" /> Apollo Personas
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-blue-800 bg-blue-50 px-2 py-0.5 border border-blue-200">
              <Users className="w-3 h-3 text-blue-600" /> LinkedIn Headcount
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-purple-800 bg-purple-50 px-2 py-0.5 border border-purple-200">
              <Sparkles className="w-3 h-3 text-purple-600" /> Google Search Grounding
            </span>
          </div>

          {onOpenConnectors && (
            <button
              type="button"
              onClick={onOpenConnectors}
              className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A] hover:underline"
            >
              Configure Connectors →
            </button>
          )}
        </div>

        {/* Launch Button */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E5E2D9]">
          <div className="text-xs font-serif italic text-[#8C8980] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
            <span>Autonomous agent dispatches live website scraper, Apollo intelligence & LinkedIn graph.</span>
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
                <span>Scraping & Synthesizing {companyName || 'Target'}...</span>
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

