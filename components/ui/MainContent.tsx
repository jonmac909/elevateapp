'use client';

import { useSidebar } from './SidebarContext';
import { ReactNode } from 'react';

export function MainContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar();
  
  return (
    <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
      {children}
    </main>
  );
}
