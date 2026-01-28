'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface FieldModalProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  multiline?: boolean;
  open: boolean;
  onClose: () => void;
}

export function FieldModal({
  label,
  value,
  onChange,
  placeholder,
  icon,
  multiline = true,
  open,
  onClose,
}: FieldModalProps) {
  const [localValue, setLocalValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setLocalValue(value);
      setTimeout(() => {
        if (multiline && textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        } else if (!multiline && inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [open, value, multiline]);

  const handleSave = () => {
    onChange(localValue);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (!multiline && e.key === 'Enter') handleSave();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[var(--card-bg)] rounded-2xl shadow-2xl border border-[var(--border)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
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

        {/* Content */}
        <div className="p-6">
          {multiline ? (
            <textarea
              ref={textareaRef}
              value={localValue}
              onChange={(e) => {
                setLocalValue(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
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
              style={{ minHeight: '160px' }}
            />
          ) : (
            <input
              ref={inputRef}
              type="text"
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className={cn(
                'w-full px-4 py-3 rounded-xl',
                'border border-[var(--border)]',
                'bg-[var(--hover-bg)]',
                'text-[var(--foreground)] text-base',
                'placeholder:italic placeholder:text-gray-400 dark:placeholder:text-gray-600',
                'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20',
                'transition-all duration-200'
              )}
            />
          )}
        </div>

        {/* Footer */}
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

// Button that shows truncated value and opens modal on click
interface ModalFieldButtonProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  multiline?: boolean;
}

export function ModalFieldButton({
  label,
  value,
  onChange,
  placeholder,
  icon,
  multiline = true,
}: ModalFieldButtonProps) {
  const [open, setOpen] = useState(false);

  const displayValue = value
    ? value.length > 80
      ? value.slice(0, 80) + '…'
      : value
    : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'w-full text-left px-4 py-3 rounded-xl',
          'border border-[var(--border)]',
          'bg-[var(--card-bg)]',
          'hover:bg-[var(--hover-bg)] hover:border-[var(--primary)]/40',
          'transition-all duration-200',
          'group cursor-pointer'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {icon && <span className="text-base flex-shrink-0">{icon}</span>}
            <span className="text-sm font-medium text-[var(--muted)]">{label}</span>
          </div>
          <svg
            className="size-4 text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors flex-shrink-0 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
        {displayValue ? (
          <p className="mt-2 text-sm text-[var(--foreground)] truncate">{displayValue}</p>
        ) : (
          <p className="mt-2 text-sm italic text-gray-400 dark:text-gray-600">{placeholder || 'Click to edit...'}</p>
        )}
      </button>

      <FieldModal
        label={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        icon={icon}
        multiline={multiline}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
