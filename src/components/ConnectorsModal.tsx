import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, Globe, Key, Shield, Zap, ExternalLink, Database, Users, Sparkles, Check, ArrowRight } from 'lucide-react';
import { ConnectorConfig } from '../types';

interface ConnectorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConnectorConfig;
  onSaveConfig: (updated: ConnectorConfig) => void;
}

export const ConnectorsModal: React.FC<ConnectorsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [localConfig, setLocalConfig] = useState<ConnectorConfig>(config);
  const [activeTab, setActiveTab] = useState<'apollo' | 'linkedin' | 'webScraper' | 'googleSearch'>('apollo');
  const [testStatus, setTestStatus] = useState<Record<string, { loading: boolean; success?: boolean; message?: string }>>({});
  const [testUrlInput, setTestUrlInput] = useState('https://linear.app');

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  if (!isOpen) return null;

  const handleTestConnector = async (connectorId: 'apollo' | 'linkedin' | 'webScraper' | 'googleSearch') => {
    setTestStatus((prev) => ({ ...prev, [connectorId]: { loading: true } }));

    try {
      const payload: any = { connectorId };
      if (connectorId === 'apollo') payload.apiKey = localConfig.apollo.apiKey;
      if (connectorId === 'webScraper') payload.testUrl = testUrlInput;

      const res = await fetch('/api/connectors/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setTestStatus((prev) => ({
        ...prev,
        [connectorId]: {
          loading: false,
          success: data.success,
          message: data.message || (data.success ? 'Connection verified!' : 'Connection check failed'),
        },
      }));
    } catch (err: any) {
      setTestStatus((prev) => ({
        ...prev,
        [connectorId]: {
          loading: false,
          success: false,
          message: err?.message || 'Network error while testing connection',
        },
      }));
    }
  };

  const handleSaveAndApply = () => {
    onSaveConfig(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="bg-[#FDFCF9] border border-[#E5E2D9] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E5E2D9] bg-[#F8F6F1] flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#1A1A1A] text-white text-[10px] font-bold uppercase tracking-widest font-mono">
                Data Connectors Hub
              </span>
              <span className="text-xs font-serif italic text-[#8C8980]">
                Live Web Scraper & B2B Enriched Graph
              </span>
            </div>
            <h2 className="text-2xl font-light font-serif text-[#1A1A1A]">
              Connect Apollo, LinkedIn & Live Internet Scraper
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8C8980] hover:text-[#1A1A1A] hover:bg-[#EFEDE7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Connector Sidebar Tabs */}
          <div className="md:col-span-4 border-r border-[#E5E2D9] bg-[#F8F6F1]/50 p-3 sm:p-4 space-y-2 overflow-y-auto">
            {/* Apollo.io Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('apollo')}
              className={`w-full p-3.5 text-left border transition-all flex items-start gap-3 ${
                activeTab === 'apollo'
                  ? 'bg-white border-[#1A1A1A] shadow-xs'
                  : 'bg-transparent border-[#E5E2D9] hover:bg-[#EFEDE7]'
              }`}
            >
              <div className="p-2 bg-orange-100 text-orange-700 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A1A1A]">Apollo.io</span>
                  <span className="text-[10px] font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.2">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#8C8980] truncate mt-0.5">
                  B2B buyer personas & tech stack
                </p>
              </div>
            </button>

            {/* LinkedIn Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('linkedin')}
              className={`w-full p-3.5 text-left border transition-all flex items-start gap-3 ${
                activeTab === 'linkedin'
                  ? 'bg-white border-[#1A1A1A] shadow-xs'
                  : 'bg-transparent border-[#E5E2D9] hover:bg-[#EFEDE7]'
              }`}
            >
              <div className="p-2 bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A1A1A]">LinkedIn Graph</span>
                  <span className="text-[10px] font-mono font-bold text-green-700 bg-green-100 px-1.5 py-0.2">
                    ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#8C8980] truncate mt-0.5">
                  Headcount, growth & exec roster
                </p>
              </div>
            </button>

            {/* Direct Web Scraper Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('webScraper')}
              className={`w-full p-3.5 text-left border transition-all flex items-start gap-3 ${
                activeTab === 'webScraper'
                  ? 'bg-white border-[#1A1A1A] shadow-xs'
                  : 'bg-transparent border-[#E5E2D9] hover:bg-[#EFEDE7]'
              }`}
            >
              <div className="p-2 bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                <Globe className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A1A1A]">Live Web Scraper</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2">
                    LIVE
                  </span>
                </div>
                <p className="text-[11px] text-[#8C8980] truncate mt-0.5">
                  Access any public website directly
                </p>
              </div>
            </button>

            {/* Google Search Tab */}
            <button
              type="button"
              onClick={() => setActiveTab('googleSearch')}
              className={`w-full p-3.5 text-left border transition-all flex items-start gap-3 ${
                activeTab === 'googleSearch'
                  ? 'bg-white border-[#1A1A1A] shadow-xs'
                  : 'bg-transparent border-[#E5E2D9] hover:bg-[#EFEDE7]'
              }`}
            >
              <div className="p-2 bg-purple-100 text-purple-700 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A1A1A]">Google Search</span>
                  <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2">
                    READY
                  </span>
                </div>
                <p className="text-[11px] text-[#8C8980] truncate mt-0.5">
                  Real-time news & funding search
                </p>
              </div>
            </button>
          </div>

          {/* Tab Content Panels */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-6">
            {/* APOLLO TAB */}
            {activeTab === 'apollo' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-[#1A1A1A] font-medium">Apollo.io B2B Intelligence Connector</h3>
                    <p className="text-xs text-[#4A4842] mt-1 font-serif italic">
                      Enriches company briefings with verified buyer personas, executive contact email conventions, and detected technology stack signals.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.apollo.enabled}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            apollo: { ...localConfig.apollo, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#1A1A1A]"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Enabled</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F6F1] border border-[#E5E2D9] space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                      Apollo API Key (Optional / Production Direct Query)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8C8980]">
                        <Key className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={localConfig.apollo.apiKey || ''}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            apollo: { ...localConfig.apollo, apiKey: e.target.value },
                          })
                        }
                        placeholder="e.g. apollo_live_xxxx... (leave blank for intelligent enrichment)"
                        className="w-full pl-9 pr-4 py-2 border border-[#E5E2D9] bg-white text-xs text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
                      />
                    </div>
                    <p className="text-[11px] text-[#8C8980]">
                      If no custom API key is supplied, the agent uses the pre-configured high-fidelity Apollo organizational synthesizer.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E5E2D9]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.apollo.autoEnrichContacts}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            apollo: { ...localConfig.apollo, autoEnrichContacts: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#1A1A1A]"
                      />
                      <span className="text-xs text-[#1A1A1A] font-medium">
                        Auto-infer decision maker personas & primary email patterns ({`{first}.{last}@{domain}`})
                      </span>
                    </label>
                  </div>
                </div>

                {/* Capabilities Badges */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980]">
                    Extraction Capabilities:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Target Stakeholder Personas',
                      'Detected Tech Stack & Tools',
                      'Email Format Pattern Verification',
                      'Headcount & Revenue Tiers',
                    ].map((cap) => (
                      <div key={cap} className="p-2.5 bg-white border border-[#E5E2D9] text-xs flex items-center gap-2 text-[#4A4842]">
                        <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Connection */}
                <div className="pt-3 border-t border-[#E5E2D9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTestConnector('apollo')}
                    disabled={testStatus.apollo?.loading}
                    className="px-4 py-2 border border-[#1A1A1A] bg-white hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    {testStatus.apollo?.loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testing Apollo...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Test Apollo Connection</span>
                      </>
                    )}
                  </button>

                  {testStatus.apollo && (
                    <div className={`text-xs flex items-center gap-1.5 font-medium ${testStatus.apollo.success ? 'text-green-700' : 'text-rose-700'}`}>
                      {testStatus.apollo.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="max-w-xs truncate">{testStatus.apollo.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LINKEDIN TAB */}
            {activeTab === 'linkedin' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-[#1A1A1A] font-medium">LinkedIn Organizational Graph Connector</h3>
                    <p className="text-xs text-[#4A4842] mt-1 font-serif italic">
                      Inspects corporate headcount trajectory, departmental distribution (Engineering vs. Sales vs. Support), and founder/executive tenures.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.linkedin.enabled}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            linkedin: { ...localConfig.linkedin, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#1A1A1A]"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">Enabled</span>
                    </label>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F6F1] border border-[#E5E2D9] space-y-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.linkedin.extractHeadcountHistory}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            linkedin: { ...localConfig.linkedin, extractHeadcountHistory: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#1A1A1A]"
                      />
                      <span className="text-xs text-[#1A1A1A] font-medium">
                        Extract 1-year and 2-year headcount growth percentages and active hiring trajectory
                      </span>
                    </label>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed font-sans">
                    <span className="font-bold">Live Graph Resolution:</span> The agent queries verified corporate profile data, open job openings, and executive roster titles to prevent obsolete title citations.
                  </div>
                </div>

                {/* Capabilities Badges */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980]">
                    Extraction Capabilities:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Verified Employee Strength',
                      'Department Distribution Ratios',
                      '1-Year Headcount Growth Velocity',
                      'Executive & Leadership Profiles',
                    ].map((cap) => (
                      <div key={cap} className="p-2.5 bg-white border border-[#E5E2D9] text-xs flex items-center gap-2 text-[#4A4842]">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Test Connection */}
                <div className="pt-3 border-t border-[#E5E2D9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTestConnector('linkedin')}
                    disabled={testStatus.linkedin?.loading}
                    className="px-4 py-2 border border-[#1A1A1A] bg-white hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    {testStatus.linkedin?.loading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Testing LinkedIn Graph...</span>
                      </>
                    ) : (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        <span>Test LinkedIn Graph</span>
                      </>
                    )}
                  </button>

                  {testStatus.linkedin && (
                    <div className={`text-xs flex items-center gap-1.5 font-medium ${testStatus.linkedin.success ? 'text-green-700' : 'text-rose-700'}`}>
                      {testStatus.linkedin.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="max-w-xs truncate">{testStatus.linkedin.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* LIVE WEB SCRAPER TAB */}
            {activeTab === 'webScraper' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-[#1A1A1A] font-medium">Direct Live Internet Web Scraper</h3>
                    <p className="text-xs text-[#4A4842] mt-1 font-serif italic">
                      Direct HTTP crawler powered by Cheerio. Directly fetches and extracts content from any public company website, landing page, or subpage in real-time.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                      DIRECT INTERNET ACCESS
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F6F1] border border-[#E5E2D9] space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                      Test Live Scraping URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={testUrlInput}
                        onChange={(e) => setTestUrlInput(e.target.value)}
                        placeholder="https://linear.app, https://ramp.com, or any domain"
                        className="flex-1 px-3 py-2 border border-[#E5E2D9] bg-white text-xs font-mono text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleTestConnector('webScraper')}
                        disabled={testStatus.webScraper?.loading}
                        className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                      >
                        {testStatus.webScraper?.loading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Globe className="w-3.5 h-3.5" />
                        )}
                        <span>Scrape Live</span>
                      </button>
                    </div>
                  </div>

                  {testStatus.webScraper && (
                    <div className={`p-3 border text-xs font-sans leading-relaxed ${testStatus.webScraper.success ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}>
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        {testStatus.webScraper.success ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <AlertCircle className="w-4 h-4 text-rose-700" />}
                        <span>{testStatus.webScraper.success ? 'Website Successfully Scraped & Parsed' : 'Scrape Error'}</span>
                      </div>
                      <p>{testStatus.webScraper.message}</p>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-[#E5E2D9]">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.webScraper.crawlSubpages}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            webScraper: { ...localConfig.webScraper, crawlSubpages: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#1A1A1A]"
                      />
                      <span className="text-xs text-[#1A1A1A] font-medium">
                        Crawl key subpages (/about, /product, /pricing, /careers) when available
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localConfig.webScraper.extractPricing}
                        onChange={(e) =>
                          setLocalConfig({
                            ...localConfig,
                            webScraper: { ...localConfig.webScraper, extractPricing: e.target.checked },
                          })
                        }
                        className="w-4 h-4 accent-[#1A1A1A]"
                      />
                      <span className="text-xs text-[#1A1A1A] font-medium">
                        Extract business models and pricing tiers directly from website
                      </span>
                    </label>
                  </div>
                </div>

                {/* Capabilities Badges */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C8980]">
                    Direct Internet Features:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Any Custom Domain / Subdomain',
                      'Meta Description & OG Tags',
                      'Main Headings & Value Props',
                      'Tech Clues & Analytics Detection',
                    ].map((cap) => (
                      <div key={cap} className="p-2.5 bg-white border border-[#E5E2D9] text-xs flex items-center gap-2 text-[#4A4842]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* GOOGLE SEARCH TAB */}
            {activeTab === 'googleSearch' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-serif text-[#1A1A1A] font-medium">Google Search Grounding Engine</h3>
                    <p className="text-xs text-[#4A4842] mt-1 font-serif italic">
                      Powers live news, SEC filings, venture capital announcements, and competitive landscape extraction.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold font-mono">
                    ONLINE
                  </span>
                </div>

                <div className="p-4 bg-[#F8F6F1] border border-[#E5E2D9] space-y-3 font-sans text-xs text-[#4A4842]">
                  <p>
                    Google Search Grounding runs autonomously inside the research loop to query recent press releases, product launches, customer testimonials, and competitive alternatives for any target company.
                  </p>
                </div>

                {/* Test Connection */}
                <div className="pt-3 border-t border-[#E5E2D9] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleTestConnector('googleSearch')}
                    disabled={testStatus.googleSearch?.loading}
                    className="px-4 py-2 border border-[#1A1A1A] bg-white hover:bg-[#EFEDE7] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider flex items-center gap-2"
                  >
                    {testStatus.googleSearch?.loading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>Verify Search Grounding</span>
                  </button>

                  {testStatus.googleSearch && (
                    <div className={`text-xs flex items-center gap-1.5 font-medium ${testStatus.googleSearch.success ? 'text-green-700' : 'text-rose-700'}`}>
                      {testStatus.googleSearch.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{testStatus.googleSearch.message}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#E5E2D9] bg-[#F8F6F1] flex items-center justify-between">
          <div className="text-xs text-[#8C8980] font-serif italic hidden sm:block">
            Connectors automatically activate during autonomous research cycles.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-[#E5E2D9] bg-white text-xs font-bold uppercase tracking-wider text-[#4A4842] hover:text-[#1A1A1A] hover:bg-[#EFEDE7]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save & Activate Connectors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
