'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Project, CustomerDNA, AppDNA, BrandDNA, LAUNCH_DAY_THEMES } from '@/lib/elevate-types';

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
  const [agentResult, setAgentResult] = useState<{ type: string; output: unknown } | null>(null);

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
    
    // Get API key from localStorage
    const apiKey = localStorage.getItem('claudeApiKey');
    if (!apiKey) {
      alert('Please add your Claude API key in Settings first.');
      return;
    }
    
    setAgentRunning(agentType);
    try {
      const res = await fetch('/api/elevate/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          agent_type: agentType,
          api_key: apiKey,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAgentResult({ type: agentType, output: data.output });
        fetchProject();
      } else {
        const error = await res.json();
        alert(`Agent failed: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error running agent:', error);
      alert('Agent execution failed. Check console for details.');
    } finally {
      setAgentRunning(null);
    }
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
          <AppDNATab dna={project.app_dna} onUpdate={updateAppDNA} />
        )}
        {activeTab === 'brand' && (
          <BrandDNATab dna={project.brand_dna} onUpdate={updateBrandDNA} />
        )}
        {activeTab === 'research' && (
          <ResearchTab project={project} onRunAgent={runAgent} />
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
      {agentRunning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center max-w-md">
            <div className="size-12 border-4 border-[#47A8DF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-[#11142D] mb-2">Running {agentRunning.replace(/_/g, ' ')}</h3>
            <p className="text-sm text-[#808191]">This may take a moment...</p>
          </div>
        </div>
      )}

      {/* Agent Results Modal */}
      {agentResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#E4E4E4] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#11142D]">
                {agentResult.type.replace(/_/g, ' ')} Results
              </h3>
              <button
                onClick={() => setAgentResult(null)}
                aria-label="Close results"
                className="p-2 hover:bg-[#F7F8FA] rounded-lg focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
              >
                <svg className="size-5 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <pre className="text-sm text-[#11142D] whitespace-pre-wrap font-mono bg-[#F7F8FA] p-4 rounded-lg">
                {typeof agentResult.output === 'string' 
                  ? agentResult.output 
                  : JSON.stringify(agentResult.output, null, 2)}
              </pre>
            </div>
            <div className="p-4 border-t border-[#E4E4E4]">
              <button
                onClick={() => setAgentResult(null)}
                className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg font-medium hover:bg-[#3B96C9]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Overview Tab
function OverviewTab({ project }: { project: Project }) {
  const completionItems = [
    { name: 'Customer DNA', done: !!project.customer_dna?.main_problem },
    { name: 'App DNA', done: !!project.app_dna?.problem_solved },
    { name: 'Brand DNA', done: !!project.brand_dna?.your_story },
    { name: 'Research Completed', done: project.progress >= 25 },
    { name: 'App Built', done: project.progress >= 50 },
    { name: 'Landing Page', done: project.progress >= 75 },
    { name: 'Launch Sequence', done: project.progress >= 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#11142D] mb-4">Project Completion</h3>
        <div className="space-y-2">
          {completionItems.map((item) => (
            <div key={item.name} className="flex items-center gap-3">
              <div className={`size-5 rounded-full flex items-center justify-center ${
                item.done ? 'bg-green-500' : 'bg-[#E4E4E4]'
              }`}>
                {item.done && (
                  <svg className="size-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={item.done ? 'text-[#11142D]' : 'text-[#808191]'}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Status</p>
          <p className="text-lg font-semibold text-[#11142D] capitalize">{project.status}</p>
        </div>
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Progress</p>
          <p className="text-lg font-semibold text-[#11142D]">{project.progress}%</p>
        </div>
        <div className="p-4 bg-[#F7F8FA] rounded-xl">
          <p className="text-sm text-[#808191]">Created</p>
          <p className="text-lg font-semibold text-[#11142D]">
            {new Date(project.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Customer DNA Tab
function CustomerDNATab({ dna, onUpdate, onRunAgent }: { dna?: CustomerDNA; onUpdate: (updates: Partial<CustomerDNA>) => void; onRunAgent?: (type: string) => void }) {
  const [formData, setFormData] = useState<Partial<CustomerDNA>>(dna || {});

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [dna]);

  const handleChange = (field: keyof CustomerDNA, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#11142D]">Customer DNA</h3>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#47A8DF] text-white rounded-xl font-medium hover:bg-[#3B96C9]"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Target Market</label>
          <input
            type="text"
            value={formData.target_market || ''}
            onChange={(e) => handleChange('target_market', e.target.value)}
            placeholder="e.g., First-time course creators with less than 100 students"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Demographics</label>
          <input
            type="text"
            value={formData.demographics || ''}
            onChange={(e) => handleChange('demographics', e.target.value)}
            placeholder="e.g., 25-45, US-based, $50k-150k income"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Main Problem</label>
        <textarea
          value={formData.main_problem || ''}
          onChange={(e) => handleChange('main_problem', e.target.value)}
          placeholder="Describe the core problem your app solves in visceral detail..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div className="p-4 bg-[#F7F8FA] rounded-xl border border-[#E4E4E4]">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-[#11142D]">Transformation Map</h4>
          {onRunAgent && (
            <button
              onClick={() => onRunAgent('transformation_mapper')}
              className="px-3 py-1.5 bg-[#47A8DF] text-white rounded-lg text-xs font-medium hover:bg-[#3B96C9]"
            >
              Generate with AI
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-red-700 mb-2">BEFORE State</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-red-600">Emotional State</label>
                <input
                  type="text"
                  value={formData.before_emotional_state || ''}
                  onChange={(e) => handleChange('before_emotional_state', e.target.value)}
                  placeholder="Overwhelmed, drowning in..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-600">Core Fear</label>
                <input
                  type="text"
                  value={formData.before_core_fear || ''}
                  onChange={(e) => handleChange('before_core_fear', e.target.value)}
                  placeholder="Afraid that..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-600">Daily Experience</label>
                <input
                  type="text"
                  value={formData.before_daily_experience || ''}
                  onChange={(e) => handleChange('before_daily_experience', e.target.value)}
                  placeholder="Every day they..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-red-600">Self-Identity</label>
                <input
                  type="text"
                  value={formData.before_self_identity || ''}
                  onChange={(e) => handleChange('before_self_identity', e.target.value)}
                  placeholder="They see themselves as..."
                  className="w-full px-3 py-2 rounded-lg border border-red-200 text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-green-800 mb-2">AFTER State</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-green-600">Emotional State</label>
                <input
                  type="text"
                  value={formData.after_emotional_state || ''}
                  onChange={(e) => handleChange('after_emotional_state', e.target.value)}
                  placeholder="Confident, in control..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-green-600">Core Fear (Resolved)</label>
                <input
                  type="text"
                  value={formData.after_core_fear || ''}
                  onChange={(e) => handleChange('after_core_fear', e.target.value)}
                  placeholder="Now they believe..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-green-600">Daily Experience</label>
                <input
                  type="text"
                  value={formData.after_daily_experience || ''}
                  onChange={(e) => handleChange('after_daily_experience', e.target.value)}
                  placeholder="Now every day they..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-green-600">Self-Identity</label>
                <input
                  type="text"
                  value={formData.after_self_identity || ''}
                  onChange={(e) => handleChange('after_self_identity', e.target.value)}
                  placeholder="They see themselves as..."
                  className="w-full px-3 py-2 rounded-lg border border-green-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// App DNA Tab
function AppDNATab({ dna, onUpdate }: { dna?: AppDNA; onUpdate: (updates: Partial<AppDNA>) => void }) {
  const [formData, setFormData] = useState<Partial<AppDNA>>(dna || {});

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [dna]);

  const handleChange = (field: keyof AppDNA, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#11142D]">App DNA</h3>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#47A8DF] text-white rounded-xl font-medium hover:bg-[#3B96C9]"
        >
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">App Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="e.g., CourseBot Pro"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Tagline</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="e.g., Your 24/7 student support team"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Problem Solved</label>
        <textarea
          value={formData.problem_solved || ''}
          onChange={(e) => handleChange('problem_solved', e.target.value)}
          placeholder="Describe the core problem your app solves..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3">Unique Mechanism</h4>
        <p className="text-sm text-blue-700 mb-3">Give your solution a proprietary name that makes it memorable and differentiates you from competitors.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-blue-600">Mechanism Name</label>
            <input
              type="text"
              value={formData.unique_mechanism || ''}
              onChange={(e) => handleChange('unique_mechanism', e.target.value)}
              placeholder='e.g., "The Knowledge Engine Protocol"'
              className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-blue-600">Description</label>
            <input
              type="text"
              value={formData.unique_mechanism_description || ''}
              onChange={(e) => handleChange('unique_mechanism_description', e.target.value)}
              placeholder="How it works in one sentence..."
              className="w-full px-3 py-2 rounded-lg border border-blue-200 text-sm"
            />
          </div>
        </div>
      </div>

    </div>
  );
}

// Brand DNA Tab
function BrandDNATab({ dna, onUpdate }: { dna?: BrandDNA; onUpdate: (updates: Partial<BrandDNA>) => void }) {
  const [formData, setFormData] = useState<Partial<BrandDNA>>(dna || {});

  useEffect(() => {
    if (dna) setFormData(dna);
  }, [dna]);

  const handleChange = (field: keyof BrandDNA, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onUpdate(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[#11142D]">Brand DNA</h3>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#47A8DF] text-white rounded-xl font-medium hover:bg-[#3B96C9]"
        >
          Save Changes
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Your Story</label>
        <textarea
          value={formData.your_story || ''}
          onChange={(e) => handleChange('your_story', e.target.value)}
          placeholder="Share your journey... Why are you the right person to build this? What experience do you bring?"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#11142D] mb-2">Credentials</label>
        <textarea
          value={formData.credentials || ''}
          onChange={(e) => handleChange('credentials', e.target.value)}
          placeholder="List your relevant credentials, experience, results you've achieved..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Voice Tone</label>
          <select
            value={formData.voice_tone || ''}
            onChange={(e) => handleChange('voice_tone', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          >
            <option value="">Select tone...</option>
            <option value="casual">Casual & Friendly</option>
            <option value="professional">Professional</option>
            <option value="authoritative">Authoritative</option>
            <option value="empathetic">Empathetic & Warm</option>
            <option value="energetic">Energetic & Bold</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#11142D] mb-2">Banned Words</label>
          <input
            type="text"
            value={(formData.banned_words || []).join(', ')}
            onChange={(e) => handleChange('banned_words', e.target.value.split(',').map(w => w.trim()))}
            placeholder="e.g., synergy, guru, hack, ninja"
            className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
        </div>
      </div>
    </div>
  );
}

// Research Tab
function ResearchTab({ project, onRunAgent }: { project: Project; onRunAgent: (type: string) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Research Agents</h3>
      <p className="text-[#808191]">Use these AI agents to validate your app idea before building.</p>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">🔍</div>
          <h4 className="font-semibold text-[#11142D] mb-1">App Idea Validator</h4>
          <p className="text-sm text-[#808191] mb-3">Analyze market size, competition, and demand score</p>
          <button
            onClick={() => onRunAgent('app_idea_validator')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Run Validator
          </button>
        </div>

        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">📊</div>
          <h4 className="font-semibold text-[#11142D] mb-1">Niche Analyzer</h4>
          <p className="text-sm text-[#808191] mb-3">Discover top pain points, solutions, and gaps</p>
          <button
            onClick={() => onRunAgent('niche_analyzer')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Analyze Niche
          </button>
        </div>

        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">🎯</div>
          <h4 className="font-semibold text-[#11142D] mb-1">Competitor X-Ray</h4>
          <p className="text-sm text-[#808191] mb-3">Analyze competitor features, pricing, and weaknesses</p>
          <button
            onClick={() => onRunAgent('competitor_xray')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            X-Ray Competitor
          </button>
        </div>
      </div>
    </div>
  );
}

// Build Tab
function BuildTab({ project, onUpdate }: { project: Project; onUpdate: (updates: Partial<AppDNA>) => Promise<void> }) {
  const [deployUrl, setDeployUrl] = useState(project.app_dna?.deploy_url || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onUpdate({ deploy_url: deployUrl });
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Build Your App</h3>
      
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h4 className="font-semibold text-[#11142D] mb-2">PM Method Steps</h4>
        <p className="text-sm text-[#808191] mb-4">Follow these steps with Claude Code to build your app:</p>
        
        <div className="space-y-3">
          {[
            { step: 1, title: 'Project Setup', desc: 'Initialize project with Next.js + Supabase' },
            { step: 2, title: 'Core Data Model', desc: 'Define database schema and types' },
            { step: 3, title: 'Auth Flow', desc: 'Set up authentication (if needed)' },
            { step: 4, title: 'Main Feature', desc: 'Build the core functionality' },
            { step: 5, title: 'UI Polish', desc: 'Style and make responsive' },
            { step: 6, title: 'Deploy', desc: 'Deploy to Vercel or Cloudflare' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-3 p-3 bg-white rounded-lg">
              <div className="size-8 bg-[#47A8DF] text-white rounded-full flex items-center justify-center text-sm font-bold">
                {item.step}
              </div>
              <div>
                <p className="font-medium text-[#11142D]">{item.title}</p>
                <p className="text-xs text-[#808191]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-white rounded-xl border border-[#E4E4E4]">
        <label className="block text-sm font-medium text-[#11142D] mb-2">Deploy URL</label>
        <p className="text-sm text-[#808191] mb-3">Once deployed, paste your app URL here:</p>
        <div className="flex gap-3">
          <input
            type="url"
            value={deployUrl}
            onChange={(e) => setDeployUrl(e.target.value)}
            placeholder="https://your-app.vercel.app"
            className="flex-1 px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#47A8DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47A8DF] focus-visible:ring-offset-2"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-3 bg-[#47A8DF] text-white rounded-xl font-medium hover:bg-[#3B96C9] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
        {project.app_dna?.deploy_url && (
          <p className="mt-3 text-sm">
            <a 
              href={project.app_dna.deploy_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#47A8DF] hover:underline"
            >
              Visit your deployed app →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

// Launch Tab
function LaunchTab({ project, onRunAgent }: { project: Project; onRunAgent: (type: string) => void }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Launch Command Center</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">📄</div>
          <h4 className="font-semibold text-[#11142D] mb-1">Landing Page Generator</h4>
          <p className="text-sm text-[#808191] mb-3">Generate a complete landing page with 13 blocks</p>
          <button
            onClick={() => onRunAgent('landing_page_generator')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Generate Page
          </button>
        </div>

        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">📅</div>
          <h4 className="font-semibold text-[#11142D] mb-1">7-Day Launch Sequence</h4>
          <p className="text-sm text-[#808191] mb-3">Generate daily content for your launch</p>
          <button
            onClick={() => onRunAgent('launch_sequence_generator')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Generate Sequence
          </button>
        </div>

        <div className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
          <div className="text-2xl mb-2">💰</div>
          <h4 className="font-semibold text-[#11142D] mb-1">Offer Builder</h4>
          <p className="text-sm text-[#808191] mb-3">Create your pricing and bonus stack</p>
          <button
            onClick={() => onRunAgent('offer_builder')}
            className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
          >
            Build Offer
          </button>
        </div>
      </div>

      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
        <h4 className="font-semibold text-orange-900 mb-3">7-Day Launch Calendar</h4>
        <div className="grid grid-cols-7 gap-2">
          {LAUNCH_DAY_THEMES.map(({ day, theme, description }) => (
            <div key={day} className="p-2 bg-white rounded-lg text-center">
              <div className="text-xs text-orange-600 font-medium">Day {day}</div>
              <div className="text-sm font-semibold text-[#11142D]">{theme}</div>
              <div className="text-[10px] text-[#808191] mt-1">{description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Copy Tab
function CopyTab({ project, onRunAgent, agentRunning }: { project: Project; onRunAgent: (type: string) => void; agentRunning?: string | null }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#11142D]">Copy Generators</h3>
      <p className="text-[#808191]">Generate all your marketing copy with AI.</p>

      <div className="grid grid-cols-3 gap-4">
        {[
          { type: 'vsl_writer', icon: '🎬', name: 'VSL Script', desc: 'Full video sales letter script' },
          { type: 'email_generator', icon: '📧', name: 'Email Sequences', desc: 'Welcome + launch emails' },
          { type: 'ad_copy_generator', icon: '📱', name: 'Ad Copy', desc: 'Facebook & Instagram ads' },
          { type: 'headline_generator', icon: '📝', name: 'Headlines', desc: '20 headline variations' },
          { type: 'objection_handler', icon: '🛡️', name: 'Objection Handlers', desc: 'FAQ and rebuttals' },
          { type: 'case_study_generator', icon: '⭐', name: 'Case Studies', desc: 'Turn results into stories' },
        ].map((agent) => (
          <div key={agent.type} className="p-4 border border-[#E4E4E4] rounded-xl hover:border-[#47A8DF] transition-colors">
            <div className="text-2xl mb-2">{agent.icon}</div>
            <h4 className="font-semibold text-[#11142D] mb-1">{agent.name}</h4>
            <p className="text-sm text-[#808191] mb-3">{agent.desc}</p>
            <button
              onClick={() => onRunAgent(agent.type)}
              className="w-full px-4 py-2 bg-[#47A8DF] text-white rounded-lg text-sm font-medium hover:bg-[#3B96C9]"
            >
              Generate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
