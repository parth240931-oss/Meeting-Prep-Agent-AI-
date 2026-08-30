import React, { useState, useEffect, useRef } from 'react';
import { MeetingBrief } from '../types';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, Check, FastForward } from 'lucide-react';

interface AudioBriefingModalProps {
  brief: MeetingBrief;
  isOpen: boolean;
  onClose: () => void;
}

export const AudioBriefingModal: React.FC<AudioBriefingModalProps> = ({
  brief,
  isOpen,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.1);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Structured script segments for synchronized teleprompter
  const scriptSegments = [
    {
      title: 'Meeting Context & Opener',
      text: `Starting 90-second sales brief for ${brief.companyName}. Scheduled for ${brief.meetingTime}.`,
    },
    {
      title: 'The 10-Second Strategic Hook',
      text: `Your opening hook: ${brief.strategicAngle.hook}`,
    },
    {
      title: 'The Why-Now Catalyst',
      text: `Why they care right now: ${brief.strategicAngle.whyNowReason}`,
    },
    {
      title: 'Primary Talking Point',
      text: `Lead talking point: ${brief.talkingPoints[0]?.topic || 'Enterprise Scaling'}. Context: ${brief.talkingPoints[0]?.context || ''}. Say: ${brief.talkingPoints[0]?.suggestedScript || ''}`,
    },
    {
      title: 'Top Inferred Objection to Watch For',
      text: `Expect this objection: ${brief.objectionsToExpect[0]?.objection || 'Internal build pride'}. Counter-pivot by saying: ${brief.objectionsToExpect[0]?.recommendedPivot || ''}`,
    },
    {
      title: 'Executive Value Prop to Memorize',
      text: `Remember your one-sentence value proposition: ${brief.executiveCheatSheet.oneSentenceValueProp}. Good luck on the call.`,
    },
  ];

  const fullScript = scriptSegments.map(s => s.text).join(' ');

  useEffect(() => {
    if (!isOpen) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setCurrentSection(0);
    }
  }, [isOpen]);

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(fullScript);
    utterance.rate = playbackRate;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')) && v.lang.startsWith('en'));
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentSection(0);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleRestart = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentSection(0);
    setTimeout(() => {
      handlePlay();
    }, 150);
  };

  const handleChangeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setTimeout(() => {
        const u = new SpeechSynthesisUtterance(fullScript);
        u.rate = rate;
        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(v => (v.name.includes('Natural') || v.name.includes('Google')) && v.lang.startsWith('en'));
        if (naturalVoice) u.voice = naturalVoice;
        u.onend = () => setIsPlaying(false);
        utteranceRef.current = u;
        window.speechSynthesis.speak(u);
        setIsPlaying(true);
      }, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FDFCF9] text-[#1A1A1A] border border-[#E5E2D9] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E2D9] flex items-center justify-between bg-[#F8F6F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Volume2 className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-serif font-light text-[#1A1A1A] flex items-center gap-2">
                90-Second Voice Briefing
                <span className="text-[10px] px-2 py-0.5 border border-[#E5E2D9] bg-[#EFEDE7] text-[#1A1A1A] font-mono uppercase tracking-wider">
                  {brief.companyName}
                </span>
              </h3>
              <p className="text-xs text-[#8C8980] font-serif italic">
                Audio synthesis of critical strategic hook, talking angles, and counter-pivots.
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

        {/* Audio Wave Visualizer Simulation */}
        <div className="bg-[#1A1A1A] text-white p-6 flex flex-col items-center justify-center border-b border-[#E5E2D9] space-y-5">
          <div className="flex items-center justify-center gap-1.5 h-12">
            {[40, 70, 25, 90, 50, 80, 30, 95, 60, 40, 85, 30, 75, 45, 65].map((height, i) => (
              <div
                key={i}
                className={`w-1 rounded-none transition-all duration-300 ${
                  isPlaying ? 'bg-orange-500 animate-pulse' : 'bg-neutral-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (i % 3 + 1)) % 48)}px` : '8px',
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleRestart}
              className="p-2 border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors"
              title="Restart Briefing"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlay}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm transition-all active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  <span>Pause Audio</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Play 90s Synthesis</span>
                </>
              )}
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 text-[10px] font-mono">
              {[1.0, 1.15, 1.3].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleChangeSpeed(rate)}
                  className={`px-2 py-1 transition-colors ${
                    playbackRate === rate
                      ? 'bg-orange-600 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Synchronized Teleprompter Script */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-[#FDFCF9]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8980] block">
            Teleprompter Briefing Script:
          </span>

          <div className="space-y-3">
            {scriptSegments.map((seg, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#F8F6F1] border border-[#E5E2D9] space-y-1.5 hover:border-[#1A1A1A] transition-colors"
              >
                <div className="text-[10px] font-mono uppercase tracking-widest text-orange-600 font-bold">
                  {seg.title}
                </div>
                <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed font-serif">
                  {seg.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
