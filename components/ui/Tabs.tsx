'use client';

import { ReactNode } from 'react';
import { TabStatusIcon } from './StatusBadge';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  status?: 'completed' | 'warning' | 'empty';
  content?: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

export default function Tabs({ tabs, activeTab, onChange, variant = 'default' }: TabsProps) {
  const getTabStyles = (isActive: boolean) => {
    switch (variant) {
      case 'pills':
        return isActive
          ? 'bg-white text-[#11142D] shadow-sm'
          : 'text-[#808191] hover:text-[#11142D]';
      case 'underline':
        return isActive
          ? 'text-[#7C3AED] border-b-2 border-[#7C3AED]'
          : 'text-[#808191] hover:text-[#11142D] border-b-2 border-transparent';
      default:
        return isActive
          ? 'bg-white text-[#11142D] shadow-sm'
          : 'text-[#808191] hover:text-[#11142D]';
    }
  };

  const containerStyles = variant === 'pills' 
    ? 'flex gap-1 bg-[#F7F8FA] p-1 rounded-xl'
    : variant === 'underline'
    ? 'flex gap-6 border-b border-[#E4E4E4]'
    : 'flex gap-1 bg-[#F7F8FA] p-1 rounded-xl';

  return (
    <div className={containerStyles}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${getTabStyles(isActive)}`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.status && <TabStatusIcon status={tab.status} />}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  children: ReactNode;
  isActive: boolean;
}

export function TabPanel({ children, isActive }: TabPanelProps) {
  if (!isActive) return null;
  return <div className="py-4">{children}</div>;
}
