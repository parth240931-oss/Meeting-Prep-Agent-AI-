import React, { useState } from 'react';
import { MeetingBrief } from '../types';
import { X, History, Trash2, ChevronRight, Clock, Building2, Search, Plus } from 'lucide-react';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  savedBriefs: MeetingBrief[];
  activeBriefId?: string;
  onSelectBrief: (brief: MeetingBrief) => void;
  onDeleteBrief: (id: string, e: React.MouseEvent) => void;
  onNewBrief: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({
  isOpen,
  onClose,
  savedBriefs,
  activeBriefId,
  onSelectBrief,
  onDeleteBrief,
  onNewBrief,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredBriefs = savedBriefs.filter(b => 
    b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.companyOverview.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#1A1A1A]/60 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-[#FDFCF9] w-full max-w-md h-full shadow-2xl border-l border-[#E5E2D9] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E2D9] flex items-center justify-between bg-[#F8F6F1]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <History className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <h3 className="text-base font-serif font-light text-[#1A1A1A]">
                Archived Meeting Briefs
              </h3>
              <p className="text-xs text-[#8C8980] font-serif italic">
                {savedBriefs.length} compiled prospect intelligence dossiers
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

        {/* Search & New Brief */}
        <div className="p-4 border-b border-[#E5E2D9] space-y-2.5 bg-[#FDFCF9]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8980]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company or industry..."
              className="w-full pl-9 pr-3 py-2 border border-[#E5E2D9] text-xs font-serif bg-[#F8F6F1] text-[#1A1A1A] placeholder-[#8C8980] focus:border-[#1A1A1A] outline-none"
            />
          </div>

          <button
            onClick={() => {
              onNewBrief();
              onClose();
            }}
            className="w-full py-2.5 px-3 bg-[#1A1A1A] hover:bg-black text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-orange-400" />
            <span>Generate New Intelligence Dossier</span>
          </button>
        </div>

        {/* Briefs List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 bg-[#FDFCF9]">
          {filteredBriefs.length === 0 ? (
            <div className="text-center py-12 text-[#8C8980] font-serif italic text-xs">
              No archived intelligence dossiers found.
            </div>
          ) : (
            filteredBriefs.map((brief) => {
              const isActive = brief.id === activeBriefId;
              return (
                <div
                  key={brief.id}
                  onClick={() => {
                    onSelectBrief(brief);
                    onClose();
                  }}
                  className={`p-4 border transition-all cursor-pointer group relative ${
                    isActive
                      ? 'bg-[#EFEDE7] border-[#1A1A1A]'
                      : 'bg-[#F8F6F1] border-[#E5E2D9] hover:border-[#8C8980]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif text-base font-light text-[#1A1A1A] truncate">
                          {brief.companyName}
                        </h4>
                        <span className="text-[9px] px-1.5 py-0.5 border border-[#E5E2D9] bg-[#FDFCF9] text-[#8C8980] font-mono uppercase tracking-wider">
                          {brief.companyOverview.industry.split('/')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8C8980]">
                        <Clock className="w-3 h-3 text-orange-600" />
                        <span>{brief.meetingTime}</span>
                      </div>

                      <p className="text-xs text-[#555] font-serif italic line-clamp-1">
                        "{brief.strategicAngle.hook}"
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={(e) => onDeleteBrief(brief.id, e)}
                        className="p-1.5 text-[#8C8980] hover:text-rose-700 hover:bg-[#EFEDE7] opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete brief"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <ChevronRight className="w-4 h-4 text-[#8C8980] group-hover:text-[#1A1A1A]" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
