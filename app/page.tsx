'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project, Template, ProjectStatus } from '@/lib/elevate-types';
import { LoadingState, PageHeader, useToast } from '@/components/ui';

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; label: string }> = {
  research: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Research' },
  building: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Building' },
  launching: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Launching' },
  live: { bg: 'bg-green-100', text: 'text-green-700', label: 'Live' },
  archived: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Archived' },
};

export default function ElevatePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, templatesRes] = await Promise.all([
        fetch('/api/elevate/projects'),
        fetch('/api/elevate/templates'),
      ]);
      
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
      }
      
      if (templatesRes.ok) {
        const data = await templatesRes.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      addToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      const res = await fetch('/api/elevate/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName,
          template_id: selectedTemplate,
        }),
      });
      
      if (res.ok) {
        setNewProjectName('');
        setSelectedTemplate(null);
        setShowNewProject(false);
        addToast('Project created successfully!', 'success');
        fetchData();
      }
    } catch (error) {
      console.error('Error creating project:', error);
      addToast('Failed to create project', 'error');
    }
  };

  const getStatusColor = (status: ProjectStatus) => STATUS_COLORS[status] || STATUS_COLORS.research;

  return (
    <div className="p-8">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Build, launch, and scale your apps"
        showRefresh
        onRefresh={fetchData}
        actions={
          <button
            onClick={() => setShowNewProject(true)}
            className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Project
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.length, color: '#7C3AED', bg: 'bg-purple-50' },
          { label: 'In Research', value: projects.filter(p => p.status === 'research').length, color: '#8B5CF6', bg: 'bg-violet-50' },
          { label: 'Building', value: projects.filter(p => p.status === 'building').length, color: '#3B82F6', bg: 'bg-blue-50' },
          { label: 'Live', value: projects.filter(p => p.status === 'live').length, color: '#10B981', bg: 'bg-green-50' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl p-5 border border-[#E4E4E4] ${stat.bg}`}>
            <p className="text-[#808191] text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#11142D] mb-4">Your Projects</h2>
        
        {loading ? (
          <LoadingState 
            title="Loading your projects..."
            subtitle="Fetching your app projects and templates"
          />
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E4E4E4] p-12 text-center">
            <div className="w-16 h-16 bg-[#F7F8FA] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#808191]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#11142D] mb-2">No projects yet</h3>
            <p className="text-[#808191] mb-4">Start by creating your first app project</p>
            <button
              onClick={() => setShowNewProject(true)}
              className="px-4 py-2 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {projects.map((project) => {
              const statusStyle = getStatusColor(project.status);
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="bg-white rounded-xl border border-[#E4E4E4] p-5 hover:border-[#7C3AED] hover:shadow-lg transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#7C3AED] to-[#A855F7] rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-[#11142D] mb-1 group-hover:text-[#7C3AED] transition-colors">
                    {project.name}
                  </h3>
                  
                  <p className="text-sm text-[#808191] mb-3">
                    {project.app_dna?.tagline || 'No tagline yet'}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#808191]">Progress</span>
                      <span className="font-medium text-[#11142D]">{project.progress}%</span>
                    </div>
                    <div className="h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-[#808191]">
                    Updated {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Templates Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#11142D]">App Templates</h2>
          <Link href="/templates" className="text-[#7C3AED] text-sm font-medium hover:underline">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {templates.slice(0, 4).map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-[#E4E4E4] p-4 hover:border-[#7C3AED] hover:shadow-lg transition-all cursor-pointer"
              onClick={() => {
                setSelectedTemplate(template.id);
                setShowNewProject(true);
              }}
            >
              <div className="text-3xl mb-2">{template.icon}</div>
              <h3 className="font-medium text-[#11142D] text-sm mb-1">{template.name}</h3>
              <p className="text-xs text-[#808191] line-clamp-2">{template.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  template.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  template.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {template.difficulty}
                </span>
                <span className="text-[10px] text-[#808191]">{template.estimated_hours}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-bold text-[#11142D] mb-4">Create New Project</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#11142D] mb-2">Project Name</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="e.g., AI Support Bot for Course Creators"
                className="w-full px-4 py-3 rounded-xl border border-[#E4E4E4] focus:border-[#009FE2] focus:outline-none"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#11142D] mb-2">Start from Template (Optional)</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                <div
                  onClick={() => setSelectedTemplate(null)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTemplate === null ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-[#E4E4E4] hover:border-[#7C3AED]'
                  }`}
                >
                  <div className="text-xl mb-1">📝</div>
                  <p className="text-sm font-medium text-[#11142D]">Start from Scratch</p>
                </div>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedTemplate === template.id ? 'border-[#7C3AED] bg-[#7C3AED]/5' : 'border-[#E4E4E4] hover:border-[#7C3AED]'
                    }`}
                  >
                    <div className="text-xl mb-1">{template.icon}</div>
                    <p className="text-sm font-medium text-[#11142D]">{template.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowNewProject(false);
                  setNewProjectName('');
                  setSelectedTemplate(null);
                }}
                className="flex-1 px-4 py-3 border border-[#E4E4E4] rounded-xl font-medium text-[#808191] hover:bg-[#F7F8FA] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createProject}
                disabled={!newProjectName.trim()}
                className="flex-1 px-4 py-3 bg-[#7C3AED] text-white rounded-xl font-medium hover:bg-[#6D28D9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
