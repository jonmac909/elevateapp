'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FieldModalProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  open: boolean;
  onClose: () => void;
}

export function FieldModal({
  label,
  value,
  onChange,
  placeholder,
  icon,
  open,
  onClose,
}: FieldModalProps) {
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setLocalValue(value);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = Math.max(textareaRef.current.scrollHeight, 200) + 'px';
        }
      }, 100);
    }
  }, [open, value]);

  const handleSave = () => {
    onChange(localValue);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-[var(--card-bg)] rounded-2xl shadow-2xl border border-[var(--border)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{label}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:bg-[var(--hover-bg)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <textarea
            ref={textareaRef}
            value={localValue}
            onChange={(e) => {
              setLocalValue(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.max(e.target.scrollHeight, 200) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'border border-[var(--border)]',
              'bg-[var(--hover-bg)]',
              'text-[var(--foreground)] text-base leading-relaxed',
              'placeholder:italic placeholder:text-gray-400 dark:placeholder:text-gray-600',
              'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
              'resize-none overflow-hidden',
              'transition-all duration-200'
            )}
            style={{ minHeight: '200px' }}
          />
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[var(--border)]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[var(--muted)] hover:bg-[var(--hover-bg)] font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[var(--primary)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// Row card that matches Research tab style: icon + title + preview + Edit button
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
  const [open, setOpen] = useState(false);

  const preview = value
    ? value.length > 120
      ? value.slice(0, 120) + '…'
      : value
    : null;

  return (
    <>
      <div className="border border-[#E4E4E4] rounded-xl overflow-hidden">
        <div className="p-4 bg-[#F7F8FA] flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {icon && <span className="text-2xl flex-shrink-0">{icon}</span>}
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-[#11142D]">{label}</h4>
              {preview ? (
                <p className="text-sm text-[#808191] truncate">{preview}</p>
              ) : (
                <p className="text-sm text-[#808191] italic">{placeholder || 'Not set'}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9] flex-shrink-0 ml-4"
          >
            Edit
          </button>
        </div>
      </div>

      <FieldModal
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={icon}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

// Keep ModalFieldButton for backward compat (alias to FieldRowCard)
export const ModalFieldButton = FieldRowCard;
