'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Project, CustomerDNA, AppDNA, BrandDNA } from '@/lib/elevate-types';
import { OverviewTab } from '@/components/project/OverviewTab';
import { CustomerDNATab } from '@/components/project/CustomerDNATab';
import { AppDNATab } from '@/components/project/AppDNATab';
import { BrandDNATab } from '@/components/project/BrandDNATab';
import { ResearchTab } from '@/components/project/ResearchTab';
import { BuildTab } from '@/components/project/BuildTab';
import { LaunchTab } from '@/components/project/LaunchTab';
import { CopyTab } from '@/components/project/CopyTab';
import { AgentOverlay } from '@/components/project/AgentOverlay';
import { AgentResultsModal } from '@/components/project/AgentResultsModal';

type Tab = 'overview' | 'app' | 'brand' | 'customer' | 'research' | 'build' | 'launch' | 'market';

const TABS: { id: Tab; name: string }[] = [
  { id: 'overview', name: 'Overview' },
  { id: 'app', name: 'App' },
  { id: 'brand', name: 'Brand' },
  { id: 'customer', name: 'Customer' },
  { id: 'research', name: 'Research' },
  { id: 'build', name: 'Build' },
  { id: 'launch', name: 'Launch' },
  { id: 'market', name: 'Market' },
];

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agentRunning, setAgentRunning] = useState<string | null>(null);
  const [agentProgress, setAgentProgress] = useState<{ step: string; percent: number } | null>(null);
  const [agentResult, setAgentResult] = useState<{ type: string; output: unknown } | null>(null);
  const [expandedResearch, setExpandedResearch] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/elevate/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (updates: Partial<Project>) => {
    if (!project) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elevate/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateCustomerDNA = async (updates: Partial<CustomerDNA>) => {
    if (!project?.customer_dna_id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elevate/dnas/customer/${project.customer_dna_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error('Error updating customer DNA:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateAppDNA = async (updates: Partial<AppDNA>) => {
    if (!project?.app_dna_id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elevate/dnas/app/${project.app_dna_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error('Error updating app DNA:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateBrandDNA = async (updates: Partial<BrandDNA>) => {
    if (!project?.brand_dna_id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/elevate/dnas/brand/${project.brand_dna_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        fetchProject();
      }
    } catch (error) {
      console.error('Error updating brand DNA:', error);
    } finally {
      setSaving(false);
    }
  };

  const runAgent = async (agentType: string) => {
    if (!project) return;
    
    setAgentRunning(agentType);
    
    // Status messages that rotate while polling
    const statusMessages = [
      'Starting agent...',
      'Analyzing project data...',
      'Processing with AI...',
      'Generating content...',
      'This may take a minute for complex outputs...',
      'Still working — crafting quality results...',
      'Almost there — finishing up...',
    ];
    let messageIndex = 0;
    
    setAgentProgress({ step: statusMessages[0], percent: 0 });
    
    const progressInterval = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, statusMessages.length - 1);
      setAgentProgress({ step: statusMessages[messageIndex], percent: 0 });
    }, 5000);
    
    try {
      // Step 1: Start the job (returns immediately with job_id)
      const startRes = await fetch('/api/elevate/agents/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          agent_type: agentType,
        }),
      });
      
      if (!startRes.ok) {
        const error = await startRes.json();
        alert(`Agent failed: ${error.error || 'Unknown error'}`);
        return;
      }
      
      const { job_id } = await startRes.json();
      
      // Step 2: Poll for results every 2 seconds
      const result = await pollJobStatus(job_id);
      
      if (result.status === 'completed') {
        const researchAgents = ['app_idea_validator', 'niche_analyzer', 'competitor_xray', 'truth_report_generator'];
        if (!agentType.startsWith('fill_') && !researchAgents.includes(agentType)) {
          setAgentResult({ type: agentType, output: result.output });
        }
        if (researchAgents.includes(agentType)) {
          setExpandedResearch(prev => ({ ...prev, [agentType]: true }));
        }
        fetchProject();
      } else if (result.status === 'failed') {
        alert(`Agent failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error running agent:', error);
      alert('Agent execution failed. Check console for details.');
    } finally {
      clearInterval(progressInterval);
      setAgentProgress({ step: 'Complete!', percent: 100 });
      setTimeout(() => {
        setAgentProgress(null);
        setAgentRunning(null);
      }, 500);
    }
  };

  /** Poll job status until completed or failed (max 5 minutes) */
  const pollJobStatus = async (jobId: string): Promise<Record<string, unknown>> => {
    const maxAttempts = 150; // 5 minutes at 2s intervals
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const res = await fetch(`/api/elevate/agents/status/${jobId}`);
        if (!res.ok) continue;
        
        const data = await res.json();
        if (data.status === 'completed' || data.status === 'failed') {
          return data;
        }
      } catch {
        // Network error — keep polling
      }
    }
    return { status: 'failed', error: 'Timed out waiting for agent (5 minutes)' };
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-[#808191]">Loading...</div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-[#11142D] mb-2">Project not found</h2>
        <Link href="/" className="text-[#009FE2] hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/" aria-label="Back to projects" className="text-[#808191] hover:text-[#11142D] focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2 rounded-lg">
          <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#11142D]">{project.name}</h1>
          <p className="text-[#808191]">{project.app_dna?.tagline || 'Add a tagline in App DNA'}</p>
        </div>
        {saving && <span className="text-sm text-[#808191]">Saving...</span>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#F7F8FA] p-1 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#11142D] shadow-sm'
                : 'text-[#808191] hover:text-[#11142D]'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-[#E4E4E4] p-6">
        {activeTab === 'overview' && (
          <OverviewTab project={project} />
        )}
        {activeTab === 'customer' && (
          <CustomerDNATab dna={project.customer_dna} onUpdate={updateCustomerDNA} onRunAgent={runAgent} />
        )}
        {activeTab === 'app' && (
          <AppDNATab dna={project.app_dna} onUpdate={updateAppDNA} onRunAgent={runAgent} />
        )}
        {activeTab === 'brand' && (
          <BrandDNATab dna={project.brand_dna} onUpdate={updateBrandDNA} onRunAgent={runAgent} />
        )}
        {activeTab === 'research' && (
          <ResearchTab project={project} onRunAgent={runAgent} expanded={expandedResearch} setExpanded={setExpandedResearch} />
        )}
        {activeTab === 'build' && (
          <BuildTab project={project} onUpdate={updateAppDNA} />
        )}
        {activeTab === 'launch' && (
          <LaunchTab project={project} onRunAgent={runAgent} />
        )}
        {activeTab === 'market' && (
          <CopyTab project={project} onRunAgent={runAgent} agentRunning={agentRunning} />
        )}
      </div>

      {/* Agent Running Overlay */}
      <AgentOverlay agentRunning={agentRunning} agentProgress={agentProgress} />

      {/* Agent Results Modal */}
      <AgentResultsModal agentResult={agentResult} onClose={() => setAgentResult(null)} />
    </div>
  );
}
