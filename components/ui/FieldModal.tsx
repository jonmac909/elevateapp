'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

// Expandable row card — click to drop down and show full text with inline editing
interface FieldRowCardProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
}

export function FieldRowCard({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: FieldRowCardProps) {
  const [expanded, setExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const preview = value
    ? value.length > 120
      ? value.slice(0, 120) + '…'
      : value
    : null;

  useEffect(() => {
    if (expanded && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 120) + 'px';
      textareaRef.current.focus();
    }
  }, [expanded, value]);

  return (
    <div className="border border-[#E4E4E4] rounded-xl overflow-hidden">
      {/* Header — always visible, click to toggle */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 bg-[#F7F8FA] flex items-center justify-between text-left hover:bg-[#EEF0F4] transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-[#11142D]">{label}</h4>
          </div>
        </div>
        <svg
          className={cn(
            'size-5 text-[#808191] flex-shrink-0 ml-3 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded content — inline textarea */}
      {expanded && (
        <div className="p-4 border-t border-[#E4E4E4]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.max(e.target.scrollHeight, 120) + 'px';
            }}
            placeholder={placeholder}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'border border-[#E4E4E4]',
              'bg-white',
              'text-[#11142D] text-base leading-relaxed',
              'placeholder:italic placeholder:text-gray-400',
              'focus:outline-none focus:border-[#47A8DF] focus:ring-2 focus:ring-[#47A8DF]/20',
              'resize-none overflow-hidden',
              'transition-all duration-200'
            )}
            style={{ minHeight: '120px' }}
          />
        </div>
      )}
    </div>
  );
}

// Keep aliases for backward compat
export const ModalFieldButton = FieldRowCard;
