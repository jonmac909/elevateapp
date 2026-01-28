'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  accentColor?: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  description,
  accentColor = '#47A8DF',
  icon,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      className={cn(
        'relative p-6 rounded-xl',
        'bg-[var(--card-bg)] border-l-4',
        'transition-all duration-200',
        className
      )}
      style={{
        borderLeftColor: accentColor,
        backgroundColor: 'var(--card-bg)',
      }}
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-lg">{icon}</span>}
          <h4 className="font-semibold text-[var(--foreground)]">{title}</h4>
        </div>
        {description && (
          <p className="text-sm text-[var(--muted)] mt-2">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
