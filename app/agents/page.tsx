'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/elevate-types';
import { LoadingState, PageHeader, useToast } from '@/components/ui';

const AGENTS = [
  { type: 'app_idea_validator', icon: '🔍', name: 'App Idea Validator', desc: 'Analyze market size, competition, and demand score', category: 'research' },
  { type: 'niche_analyzer', icon: '📊', name: 'Niche Analyzer', desc: 'Discover top pain points, solutions, and gaps', category: 'research' },
  { type: 'competitor_xray', icon: '🎯', name: 'Competitor X-Ray', desc: 'Analyze competitor features, pricing, and weaknesses', category: 'research' },
  { type: 'landing_page_generator', icon: '📄', name: 'Landing Page Generator', desc: 'Generate a complete landing page with 13 blocks', category: 'launch' },
  { type: 'launch_sequence_generator', icon: '📅', name: '7-Day Launch Sequence', desc: 'Generate daily content for your launch', category: 'launch' },
  { type: 'offer_builder', icon: '💰', name: 'Offer Builder', desc: 'Create your pricing and bonus stack', category: 'launch' },
  { type: 'vsl_writer', icon: '🎬', name: 'VSL Writer', desc: 'Video sales letter scripts', category: 'copy' },
  { type: 'email_generator', icon: '📧', name: 'Email Sequences', desc: 'Nurture and sales emails', category: 'copy' },
  { type: 'ad_copy_generator', icon: '📢', name: 'Ad Copy', desc: 'Facebook, Google, and YouTube ads', category: 'copy' },
  { type: 'headline_generator', icon: '✍️', name: 'Headlines', desc: 'Attention-grabbing headlines', category: 'copy' },
  { type: 'objection_handler', icon: '🛡️', name: 'Objection Handlers', desc: 'FAQ and rebuttals', category: 'copy' },
  { type: 'case_study_generator', icon: '⭐', name: 'Case Studies', desc: 'Turn results into stories', category: 'copy' },
  { type: 'transformation_mapper', icon: '🔄', name: 'Transformation Mapper', desc: 'Map before/after customer states', category: 'research' },
];

export default function AgentsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [runningAgent, setRunningAgent] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const { addToast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/elevate/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects?.length > 0) {
          setSelectedProject(data.projects[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async (agentType: string) => {
    if (!selectedProject) {
      addToast('Please select a project first', 'error');
      return;
    }

    // Get API key from localStorage
    const apiKey = localStorage.getItem('claudeApiKey');
    if (!apiKey) {
      addToast('Please add your Claude API key in Settings first.', 'error');
      return;
    }

    setRunningAgent(agentType);
    try {
      const res = await fetch('/api/elevate/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: selectedProject,
          agent_type: agentType,
          api_key: apiKey,
        }),
      });

      if (res.ok) {
        addToast('Agent completed successfully!', 'success');
      } else {
        const data = await res.json();
        addToast(data.error || 'Agent failed', 'error');
      }
    } catch (error) {
      console.error('Error running agent:', error);
      addToast('Failed to run agent', 'error');
    } finally {
      setRunningAgent(null);
    }
  };

  const categories = ['all', 'research', 'launch', 'copy'];
  const filteredAgents = filter === 'all' ? AGENTS : AGENTS.filter(a => a.category === filter);

  return (
    <div className="p-8">
      <PageHeader
        title="AI Agents"
        subtitle="Run AI-powered agents to build and launch your app"
        backHref="/"
        backLabel="Back to Dashboard"
      />

      {loading ? (
        <LoadingState title="Loading..." subtitle="Fetching your projects" />
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E4E4E4] p-8 text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-lg font-semibold text-[#11142D] mb-2">No projects yet</h3>
          <p className="text-[#808191] mb-4">Create a project to use AI agents</p>
          <Link href="/" className="px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9] transition-colors inline-block">
            Create Project
          </Link>
        </div>
      ) : (
        <>
          {/* Project Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#11142D] mb-2">Select Project</label>
            <select
              value={selectedProject || ''}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none min-w-[300px]"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-[#47A8DF] text-white'
                    : 'bg-white text-[#808191] border border-[#E4E4E4] hover:border-[#47A8DF]'
                }`}
              >
                {cat === 'all' ? 'All Agents' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.type}
                className="bg-white rounded-xl border border-[#E4E4E4] p-4 hover:border-[#47A8DF] transition-colors"
              >
                <div className="text-2xl mb-2">{agent.icon}</div>
                <h4 className="font-semibold text-[#11142D] mb-1">{agent.name}</h4>
                <p className="text-sm text-[#808191] mb-3">{agent.desc}</p>
                <button
                  onClick={() => runAgent(agent.type)}
                  disabled={runningAgent !== null}
                  className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {runningAgent === agent.type ? 'Running...' : 'Run Agent'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Running Overlay */}
      {runningAgent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="size-12 border-4 border-[#47A8DF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-[#11142D] mb-2">Running {runningAgent.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-[#808191]">This may take a moment...</p>
          </div>
        </div>
      )}
    </div>
  );
}
