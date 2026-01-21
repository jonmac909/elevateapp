'use client';

import { ReactNode } from 'react';

interface SplitPanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  leftTitle?: string;
  rightTitle?: string;
  rightActions?: ReactNode;
}

export default function SplitPanel({
  leftPanel,
  rightPanel,
  leftTitle = 'Agent Settings',
  rightTitle = 'Document',
  rightActions,
}: SplitPanelProps) {
  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Left Panel */}
      <div className="w-[400px] flex-shrink-0 bg-white rounded-xl border border-[#E4E4E4] flex flex-col">
        <div className="p-4 border-b border-[#E4E4E4]">
          <h3 className="font-semibold text-[#11142D] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {leftTitle}
          </h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{leftPanel}</div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 bg-white rounded-xl border border-[#E4E4E4] flex flex-col">
        <div className="p-4 border-b border-[#E4E4E4] flex items-center justify-between">
          <h3 className="font-semibold text-[#11142D] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {rightTitle}
          </h3>
          <div className="flex items-center gap-2">
            {rightActions}
            <button className="px-3 py-1.5 text-sm font-medium text-[#808191] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
            </button>
            <button className="px-3 py-1.5 text-sm font-medium text-[#808191] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              DNAs
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{rightPanel}</div>
      </div>
    </div>
  );
}

interface DNASelectorProps {
  selectedDNAs: { type: string; name: string; id: string }[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export function DNASelector({ selectedDNAs, onRemove, onAdd }: DNASelectorProps) {
  const typeColors: Record<string, string> = {
    personality: 'bg-pink-100 text-pink-700 border-pink-200',
    audience: 'bg-orange-100 text-orange-700 border-orange-200',
    product: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[#11142D]">Campaign DNA</label>
      <div className="flex flex-wrap gap-2">
        {selectedDNAs.map((dna) => (
          <span
            key={dna.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border ${
              typeColors[dna.type] || 'bg-gray-100 text-gray-700 border-gray-200'
            }`}
          >
            {dna.name}
            <button
              onClick={() => onRemove(dna.id)}
              className="hover:opacity-70 transition-opacity"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm border border-dashed border-[#E4E4E4] text-[#808191] hover:border-[#7C3AED] hover:text-[#7C3AED] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add DNA
        </button>
      </div>
    </div>
  );
}
