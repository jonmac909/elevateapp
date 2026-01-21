'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  dropdown?: ReactNode;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  backHref,
  backLabel = 'Return',
  actions,
  dropdown,
  showRefresh,
  onRefresh,
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {/* Back Link */}
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1 text-sm text-[#808191] hover:text-[#11142D] mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {backLabel}
        </Link>
      )}

      {/* Title Row */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#11142D]">{title}</h1>
            {showRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <svg className="w-5 h-5 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
          {subtitle && <p className="text-[#808191] mt-1">{subtitle}</p>}
          {dropdown && <div className="mt-3">{dropdown}</div>}
        </div>

        {/* Actions */}
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
}

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <span className="text-sm font-medium text-[#11142D]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-[#7C3AED]' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  );
}
