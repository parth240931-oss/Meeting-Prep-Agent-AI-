import React, { useState } from 'react';
import { MeetingBrief } from '../types';
import { X, Copy, Check, Printer, FileText, Share2, Mail } from 'lucide-react';

interface ExportModalProps {
  brief: MeetingBrief;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  brief,
  isOpen,
  onClose,
}) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const markdownText = `# Sales Meeting Prep Brief: ${brief.companyName}
**Scheduled Meeting:** ${brief.meetingTime} ${brief.meetingContext ? `(${brief.meetingContext})` : ''}
**Industry:** ${brief.companyOverview.industry} | **HQ:** ${brief.companyOverview.hq} | **Size:** ${brief.companyOverview.estimatedSize} | **Stage:** ${brief.companyOverview.fundingStage}

---

## 🎯 The 10-Second Opening Hook
> "${brief.strategicAngle.hook}"

**The Why-Now Catalyst:** ${brief.strategicAngle.whyNowReason}
**Urgency Driver:** ${brief.strategicAngle.urgencyDriver}

---

## 💬 Strategic Talking Points & Icebreakers
${brief.talkingPoints.map((tp, i) => `### ${i + 1}. ${tp.topic} (${tp.headline})
- **Signal:** ${tp.sourceSignal}
- **Context:** ${tp.context}
- **Suggested Verbatim Script:**
  > "${tp.suggestedScript}"
`).join('\n')}

---

## 🛡️ Inferred Objections & Counter-Pivots
${brief.objectionsToExpect.map((obj, i) => `### Objection ${i + 1} [${obj.riskLevel} Risk]: "${obj.objection}"
- **Hidden Psychology:** ${obj.likelyReason}
- **Recommended Counter-Pivot:**
  > "${obj.recommendedPivot}"
- **Killer Follow-Up Question:**
  > "${obj.killerFollowUpQuestion}"
`).join('\n')}

---

## ❓ Tactical SPIN Discovery Questions
${brief.discoveryQuestions.map((dq, i) => `- **[${dq.phase} Phase]** "${dq.question}" (Listen for: ${dq.idealResponseClues})`).join('\n')}

---

## ⚡ 60-Second Pre-Call Cheat Sheet
**Do Say:**
${brief.executiveCheatSheet.doSay.map(s => `- ${s}`).join('\n')}

**Do NOT Say:**
${brief.executiveCheatSheet.doNotSay.map(s => `- ${s}`).join('\n')}

**One-Sentence Value Prop:**
"${brief.executiveCheatSheet.oneSentenceValueProp}"
`;

  const emailBriefText = `Subject: Pre-Call Sales Prep Brief: ${brief.companyName} (${brief.meetingTime})

Hi Team,

Here is the autonomous sales research brief for ${brief.companyName} ahead of our call at ${brief.meetingTime}.

1. OPENING HOOK (Say this in first 2 mins):
"${brief.strategicAngle.hook}"

2. WHY NOW:
${brief.strategicAngle.whyNowReason}

3. PRIMARY TALKING POINT:
${brief.talkingPoints[0]?.topic} -> "${brief.talkingPoints[0]?.suggestedScript}"

4. TOP EXPECTED OBJECTION & PIVOT:
Objection: "${brief.objectionsToExpect[0]?.objection}"
Counter-Pivot: "${brief.objectionsToExpect[0]?.recommendedPivot}"

5. 60-SEC VALUE PROP:
"${brief.executiveCheatSheet.oneSentenceValueProp}"

Let's win this meeting!`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownText);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBriefText);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A1A1A]/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-[#FDFCF9] text-[#1A1A1A] border border-[#E5E2D9] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-[#E5E2D9] flex items-center justify-between bg-[#F8F6F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <Share2 className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-serif font-light text-[#1A1A1A]">
                Export & Dispatch Intelligence Brief
              </h3>
              <p className="text-xs text-[#8C8980] font-serif italic">
                Export Markdown, copy executive briefing summary, or print physical one-pager.
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

        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#FDFCF9]">
          {/* Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleCopyMarkdown}
              className="p-4 border border-[#E5E2D9] bg-[#F8F6F1] hover:border-[#1A1A1A] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-4 h-4 text-[#1A1A1A]" />
                {copiedMd ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-[#8C8980] group-hover:text-[#1A1A1A]" />}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">Copy Markdown</div>
              <p className="text-[11px] text-[#8C8980] font-serif mt-1">Formatted dossier for Notion or Docs</p>
            </button>

            <button
              onClick={handleCopyEmail}
              className="p-4 border border-[#E5E2D9] bg-[#F8F6F1] hover:border-[#1A1A1A] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-4 h-4 text-[#1A1A1A]" />
                {copiedEmail ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-[#8C8980] group-hover:text-[#1A1A1A]" />}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">Copy Slack / Email</div>
              <p className="text-[11px] text-[#8C8980] font-serif mt-1">Pre-call team sync memo</p>
            </button>

            <button
              onClick={handlePrint}
              className="p-4 border border-[#E5E2D9] bg-[#F8F6F1] hover:border-[#1A1A1A] text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <Printer className="w-4 h-4 text-[#1A1A1A]" />
                <Share2 className="w-4 h-4 text-[#8C8980] group-hover:text-[#1A1A1A]" />
              </div>
              <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">Print / Save PDF</div>
              <p className="text-[11px] text-[#8C8980] font-serif mt-1">Desk one-sheet format</p>
            </button>
          </div>

          {/* Markdown Preview */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C8980] block">
              Dossier Preview:
            </span>
            <div className="bg-[#1A1A1A] text-neutral-200 p-4 font-mono text-[11px] max-h-60 overflow-y-auto whitespace-pre-wrap border border-neutral-800 leading-relaxed">
              {markdownText}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
