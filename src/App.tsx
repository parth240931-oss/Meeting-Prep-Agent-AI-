import React, { useState, useEffect } from 'react';
import { MeetingBrief, ResearchRequest, AgentStep, InferredObjection } from './types';
import { SAMPLE_BRIEFS } from './data/sampleBriefs';
import { Header } from './components/Header';
import { ResearchForm } from './components/ResearchForm';
import { AgentLiveProgress } from './components/AgentLiveProgress';
import { BriefView } from './components/BriefView';
import { AudioBriefingModal } from './components/AudioBriefingModal';
import { ObjectionSimulatorModal } from './components/ObjectionSimulatorModal';
import { ExportModal } from './components/ExportModal';
import { AuditTrailModal } from './components/AuditTrailModal';
import { HistorySidebar } from './components/HistorySidebar';
import { Sparkles, Compass, AlertCircle, RefreshCw } from 'lucide-react';

const STORAGE_KEY = 'meeting_prep_briefs_v1';

export default function App() {
  const [briefs, setBriefs] = useState<MeetingBrief[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved briefs', e);
    }
    return SAMPLE_BRIEFS;
  });

  const [activeBrief, setActiveBrief] = useState<MeetingBrief | null>(() => {
    return SAMPLE_BRIEFS[0] || null;
  });

  // Research Execution State
  const [isLoading, setIsLoading] = useState(false);
  const [activeResearchCompany, setActiveResearchCompany] = useState('');
  const [liveSteps, setLiveSteps] = useState<AgentStep[]>([]);
  const [currentThought, setCurrentThought] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [activeSimulatorObjection, setActiveSimulatorObjection] = useState<InferredObjection | undefined>(undefined);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isHistorySidebarOpen, setIsHistorySidebarOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
    } catch (e) {
      console.warn('Failed to save briefs', e);
    }
  }, [briefs]);

  // Handle autonomous research submission with real-time SSE stream
  const handleStartResearch = async (req: ResearchRequest) => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveResearchCompany(req.companyName);
    setLiveSteps([]);
    setCurrentThought(`Initializing autonomous research agent for ${req.companyName}...`);

    const queryParams = new URLSearchParams({
      companyName: req.companyName,
      meetingTime: req.meetingTime,
      meetingContext: req.meetingContext || '',
      pitchFocus: req.pitchFocus || '',
    });

    try {
      const eventSource = new EventSource(`/api/research/stream?${queryParams.toString()}`);

      eventSource.addEventListener('agent_start', (e: any) => {
        const data = JSON.parse(e.data);
        setCurrentThought(data.message || `Investigating ${req.companyName}...`);
      });

      eventSource.addEventListener('agent_step', (e: any) => {
        const stepData: AgentStep = JSON.parse(e.data);
        setCurrentThought(stepData.thought);
        setLiveSteps((prev) => {
          // Replace or append step by stepNumber
          const existingIndex = prev.findIndex((s) => s.stepNumber === stepData.stepNumber);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = stepData;
            return updated;
          }
          return [...prev, stepData];
        });
      });

      eventSource.addEventListener('brief_complete', (e: any) => {
        const finalBrief: MeetingBrief = JSON.parse(e.data);
        setActiveBrief(finalBrief);
        setBriefs((prev) => [finalBrief, ...prev.filter((b) => b.id !== finalBrief.id)]);
        setIsLoading(false);
        eventSource.close();
      });

      eventSource.addEventListener('error', (e: any) => {
        console.warn('SSE stream error, falling back to direct POST API', e);
        eventSource.close();
        // Fallback to standard POST
        fallbackDirectResearch(req);
      });

      eventSource.addEventListener('done', () => {
        eventSource.close();
        setIsLoading(false);
      });
    } catch (err: any) {
      console.warn('SSE connection failed, using POST fallback', err);
      fallbackDirectResearch(req);
    }
  };

  const fallbackDirectResearch = async (req: ResearchRequest) => {
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const finalBrief: MeetingBrief = await res.json();
      setActiveBrief(finalBrief);
      setBriefs((prev) => [finalBrief, ...prev.filter((b) => b.id !== finalBrief.id)]);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to complete autonomous research. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (companyName: string) => {
    const existing = briefs.find((b) => b.companyName.toLowerCase() === companyName.toLowerCase());
    if (existing) {
      setActiveBrief(existing);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleStartResearch({
        companyName,
        meetingTime: 'Today at 3:00 PM',
        meetingContext: 'Discovery Call',
        pitchFocus: 'Modern Cloud & Enterprise Scaling',
      });
    }
  };

  const handleDeleteBrief = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBriefs((prev) => prev.filter((b) => b.id !== id));
    if (activeBrief?.id === id) {
      const remaining = briefs.filter((b) => b.id !== id);
      setActiveBrief(remaining[0] || null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Header */}
      <Header
        onOpenHistory={() => setIsHistorySidebarOpen(true)}
        savedCount={briefs.length}
        onSelectSample={handleSelectSample}
        selectedCompany={activeBrief?.companyName}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-[#EFEDE7] border border-rose-300 text-rose-900 text-xs font-sans font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-700" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 font-bold uppercase tracking-wider text-[10px]"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Form Input Area */}
        <section>
          <ResearchForm
            onStartResearch={handleStartResearch}
            isLoading={isLoading}
            activeCompany={activeBrief?.companyName}
          />
        </section>

        {/* Live Progress Chain of Thought View */}
        {isLoading && (
          <AgentLiveProgress
            companyName={activeResearchCompany}
            steps={liveSteps}
            isComplete={!isLoading}
            currentThought={currentThought}
          />
        )}

        {/* The One-Page Brief Display */}
        {activeBrief && !isLoading && (
          <section>
            <BriefView
              brief={activeBrief}
              onOpenAudio={() => setIsAudioModalOpen(true)}
              onOpenObjectionSimulator={(obj) => {
                setActiveSimulatorObjection(obj);
                setIsObjectionModalOpen(true);
              }}
              onOpenAuditTrail={() => setIsAuditModalOpen(true)}
              onOpenExport={() => setIsExportModalOpen(true)}
            />
          </section>
        )}

        {/* Empty state if no active brief */}
        {!activeBrief && !isLoading && (
          <div className="bg-[#F8F6F1] border border-[#E5E2D9] p-12 text-center space-y-3 font-sans">
            <div className="w-12 h-12 bg-[#EFEDE7] border border-[#E5E2D9] text-[#1A1A1A] flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-serif font-light text-[#1A1A1A]">
              No Executive Brief Loaded
            </h3>
            <p className="text-xs text-[#8C8980] max-w-sm mx-auto font-serif italic">
              Input prospect coordinates above to dispatch the autonomous research agent, or select a preset sample.
            </p>
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      {activeBrief && (
        <>
          <AudioBriefingModal
            brief={activeBrief}
            isOpen={isAudioModalOpen}
            onClose={() => setIsAudioModalOpen(false)}
          />

          <ObjectionSimulatorModal
            brief={activeBrief}
            initialObjection={activeSimulatorObjection}
            isOpen={isObjectionModalOpen}
            onClose={() => setIsObjectionModalOpen(false)}
          />

          <ExportModal
            brief={activeBrief}
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
          />

          <AuditTrailModal
            brief={activeBrief}
            isOpen={isAuditModalOpen}
            onClose={() => setIsAuditModalOpen(false)}
          />
        </>
      )}

      {/* History Drawer */}
      <HistorySidebar
        isOpen={isHistorySidebarOpen}
        onClose={() => setIsHistorySidebarOpen(false)}
        savedBriefs={briefs}
        activeBriefId={activeBrief?.id}
        onSelectBrief={(b) => setActiveBrief(b)}
        onDeleteBrief={handleDeleteBrief}
        onNewBrief={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
