'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ContentFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  large?: boolean;
  icon?: string;
  className?: string;
}

export function ContentField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  large = false,
  icon,
  className,
}: ContentFieldProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-expand textarea
  useEffect(() => {
    if (multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value, multiline]);

  const baseClasses = cn(
    'w-full px-4 py-3 rounded-lg',
    'border border-transparent',
    'transition-all duration-200',
    'placeholder:italic placeholder:text-gray-400 dark:placeholder:text-gray-600',
    'text-[var(--foreground)] bg-transparent',
    'focus:outline-none',
    {
      // Hover state
      'hover:bg-[var(--hover-bg)]': !isFocused,
      // Focus state
      'bg-[var(--hover-bg)] border-b-2 border-b-[var(--primary)]': isFocused,
      // Large hero fields
      'text-2xl font-bold': large && !multiline,
      'text-lg font-semibold': large && multiline,
      // Normal fields
      'text-base': !large,
      // Multiline
      'resize-none overflow-hidden': multiline,
    },
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className="flex items-center gap-2 text-sm font-medium text-[var(--muted)] px-4">
          {icon && <span className="text-base">{icon}</span>}
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          className={baseClasses}
          rows={1}
          style={{ minHeight: large ? '120px' : '80px' }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}
